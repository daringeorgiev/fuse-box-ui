import { useState, useMemo, useCallback, useRef } from 'react'
import type { Fuse, DragState } from './types'
import type { AmpValue } from './types'
import { SEED_FUSES, nextId } from './constants/amps'
import MainBreaker from './components/MainBreaker'
import Stepper from './components/Stepper'
import Slot from './components/Slot'
import FuseForm from './components/FuseForm'
import StatsCard from './components/StatsCard'
import Legend from './components/Legend'
import { Reset } from './components/Icons'

function App() {
  const [rows, setRows] = useState(2)
  const [perRow, setPerRow] = useState(12)
  const [mainOn, setMainOn] = useState(true)
  const mainAmp = 200

  const [fuses, setFuses] = useState<Fuse[]>(SEED_FUSES)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [focusPos, setFocusPos] = useState<number | null>(null)
  const [dragState, setDragState] = useState<DragState>({ draggingId: null, overPos: null })
  const [toast, setToast] = useState<string | null>(null)
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const capacity = rows * perRow

  const fuseByPos = useMemo(() => {
    const m: Record<number, Fuse> = {}
    fuses.forEach(f => { if (f.pos <= capacity) m[f.pos] = f })
    return m
  }, [fuses, capacity])

  const visibleFuses = useMemo(
    () => fuses.filter(f => f.pos <= capacity),
    [fuses, capacity]
  )

  const slotsAvailable = capacity - visibleFuses.length

  const showToast = useCallback((msg: string) => {
    if (toastTimerRef.current !== null) clearTimeout(toastTimerRef.current)
    setToast(msg)
    toastTimerRef.current = setTimeout(() => setToast(null), 2000)
  }, [])

  const handleRowsChange = (n: number) => {
    const displaced = fuses.filter(f => f.pos > n * perRow).length
    setRows(n)
    if (displaced > 0) showToast(`${displaced} fuse${displaced === 1 ? '' : 's'} hidden — increase capacity to restore`)
  }

  const handlePerRowChange = (n: number) => {
    const displaced = fuses.filter(f => f.pos > rows * n).length
    setPerRow(n)
    if (displaced > 0) showToast(`${displaced} fuse${displaced === 1 ? '' : 's'} hidden — increase capacity to restore`)
  }

  const addFuse = ({ label, amp, pos: requestedPos }: { label: string; amp: AmpValue; pos: number | null }) => {
    if (slotsAvailable === 0) return
    let pos: number = requestedPos ?? 0
    if (!pos || fuseByPos[pos] || pos > capacity) {
      pos = 1
      while (fuseByPos[pos]) pos++
    }
    if (pos > capacity) return
    setFuses(prev => [...prev, { id: nextId(), pos, label, amp }])
    showToast(`Installed "${label}" in slot ${String(pos).padStart(2, '0')}`)
    setFocusPos(null)
  }

  const requestAddAt = (pos: number) => {
    setSelectedId(null)
    setFocusPos(pos)
  }

  const selectFuse = (id: string) => {
    setFocusPos(null)
    setSelectedId(prev => prev === id ? null : id)
  }

  const updateFuse = (id: string, patch: { label: string; amp: AmpValue }) => {
    setFuses(prev => prev.map(f => f.id === id ? { ...f, ...patch } : f))
    showToast(`Updated "${patch.label}"`)
    setSelectedId(null)
  }

  const removeFuse = (id: string) => {
    const f = fuses.find(x => x.id === id)
    setFuses(prev => prev.filter(x => x.id !== id))
    if (selectedId === id) setSelectedId(null)
    if (f) showToast(`Removed "${f.label}" from slot ${String(f.pos).padStart(2, '0')}`)
  }

  const resetTripped = () => {
    const trippedCount = fuses.filter(f => f.tripped).length
    if (trippedCount === 0) { showToast('No tripped breakers'); return }
    setFuses(prev => prev.map(f => ({ ...f, tripped: false })))
    showToast(`Reset ${trippedCount} tripped breaker${trippedCount === 1 ? '' : 's'}`)
  }

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, fuse: Fuse) => {
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', fuse.id)
    setDragState({ draggingId: fuse.id, overPos: null })
  }

  const handleDragEnd = () => setDragState({ draggingId: null, overPos: null })

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, pos: number) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragState(prev => prev.overPos === pos ? prev : { ...prev, overPos: pos })
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>, pos: number) => {
    if (e.currentTarget.contains(e.relatedTarget as Node)) return
    setDragState(prev => prev.overPos === pos ? { ...prev, overPos: null } : prev)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, pos: number) => {
    e.preventDefault()
    const id = e.dataTransfer.getData('text/plain')
    if (!id) return
    setFuses(prev => {
      const src = prev.find(f => f.id === id)
      if (!src || src.pos === pos) return prev
      const target = prev.find(f => f.pos === pos)
      return prev.map(f => {
        if (f.id === src.id) return { ...f, pos }
        if (target && f.id === target.id) return { ...f, pos: src.pos }
        return f
      })
    })
    setDragState({ draggingId: null, overPos: null })
  }

  const isStandard = perRow === 2
  const rowList: React.ReactElement[] = []

  for (let r = 0; r < rows; r++) {
    const slots: React.ReactElement[] = []
    for (let c = 0; c < perRow; c++) {
      const pos = isStandard ? r * 2 + c + 1 : r * perRow + c + 1
      slots.push(
        <Slot
          key={pos}
          pos={pos}
          fuse={fuseByPos[pos]}
          selectedId={selectedId}
          dragState={dragState}
          onSelect={selectFuse}
          onAddHere={requestAddAt}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onRemove={removeFuse}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        />
      )
    }
    rowList.push(
      <div className={`fuse-row${isStandard ? ' standard' : ''}`} key={r}>
        <div className="row-label">{String(r + 1).padStart(2, '0')}</div>
        {isStandard ? (
          <>
            <div className="row-slots" style={{ gridTemplateColumns: '1fr' }}>{slots[0]}</div>
            <div className="bus-bar" aria-hidden="true"><span /><span /><span /></div>
            <div className="row-slots" style={{ gridTemplateColumns: '1fr' }}>{slots[1]}</div>
          </>
        ) : (
          <div className="row-slots" style={{ gridTemplateColumns: `repeat(${perRow}, 1fr)` }}>
            {slots}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark">F</div>
          <span className="brand-name">Fuse Box</span>
          <span className="brand-sub">Panel Configurator</span>
        </div>
        <div className="topbar-right">
          <span><span className="status-dot" />System Online</span>
          <span>240V · 60Hz</span>
          <span>Panel #A‑12</span>
        </div>
      </header>

      <div className="configbar">
        <div className="config-group">
          <span className="config-label">Rows</span>
          <Stepper value={rows} min={1} max={12} onChange={handleRowsChange} ariaLabel="Number of rows" />
        </div>
        <div className="config-group">
          <span className="config-label">Fuses / Row</span>
          <Stepper value={perRow} min={2} max={12} onChange={handlePerRowChange} ariaLabel="Fuses per row" />
        </div>
        <div className="config-divider" />
        <div className="config-stat">
          <span className="config-stat-label">Capacity</span>
          <span className="config-stat-value">{capacity} slots</span>
        </div>
        <div className="config-stat">
          <span className="config-stat-label">Occupied</span>
          <span className="config-stat-value">{visibleFuses.length} / {capacity}</span>
        </div>
        <div className="config-spacer" />
        <button className="btn" onClick={resetTripped} title="Reset all tripped breakers">
          <Reset /> Reset Tripped
        </button>
      </div>

      <main className="main">
        <section className="panel">
          <div className="panel-header">
            <span className="panel-title">Distribution Panel</span>
            <div className="panel-meta">
              <span>{rows}P · {perRow === 2 ? 'SPLIT-BUS' : `${perRow}-WIDE`}</span>
              <span>·</span>
              <span>{visibleFuses.length} ACTIVE</span>
            </div>
          </div>
          <MainBreaker on={mainOn} onToggle={() => setMainOn(o => !o)} ampRating={mainAmp} />
          <div className="fuse-rows">{rowList}</div>
        </section>

        <aside className="sidebar">
          <FuseForm
            editingFuse={fuses.find(f => f.id === selectedId)}
            focusPos={focusPos}
            onAdd={addFuse}
            onUpdate={updateFuse}
            onCancel={() => { setSelectedId(null); setFocusPos(null) }}
            slotsAvailable={slotsAvailable}
          />
          <StatsCard fuses={visibleFuses} capacity={capacity} mainAmp={mainAmp} />
          <Legend fuses={visibleFuses} />
        </aside>
      </main>

      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}

export default App
