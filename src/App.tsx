import { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import type { IFuse, IDragState } from './interfaces'
import type { AmpValue } from './interfaces'
import MainBreaker from './components/MainBreaker'
import Stepper from './components/Stepper'
import Slot from './components/Slot'
import FuseForm from './components/FuseForm'
import StatsCard from './components/StatsCard'
import Legend from './components/Legend'
import { Pencil } from './components/Icons'
import PanelDropdown from './components/PanelDropdown'
import PanelEditModal from './components/PanelEditModal'
import { useFuseBoxStore } from './store/fusebox.store'
import { usePanels, useCreatePanel, useUpdatePanel } from './hooks/usePanels'
import { useFuses, useCreateFuse, useUpdateFuse, useDeleteFuse, useReorderFuses } from './hooks/useFuses'

function App() {
  const { selectedPanelId, selectPanel } = useFuseBoxStore()

  const { data: panels = [], isLoading: panelsLoading } = usePanels()
  const createPanelMutation = useCreatePanel()
  const updatePanelMutation = useUpdatePanel()

  // Auto-select first panel; create a default one if none exist after load
  useEffect(() => {
    if (panelsLoading) return
    if (panels.length === 0) {
      createPanelMutation.mutate(
        { name: 'Main Panel', location: 'Utility Room', numRows: 2, fusesPerRow: 12, mainAmp: 200, voltage: 240, frequency: 60 },
        { onSuccess: (p) => selectPanel(p.id) }
      )
    } else if (!selectedPanelId || !panels.find(p => p.id === selectedPanelId)) {
      selectPanel(panels[0].id)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [panelsLoading, panels.length])

  const selectedPanel = panels.find(p => p.id === selectedPanelId)

  // rows / perRow: local state for instant stepper feedback, synced from panel on selection change
  const [rows, setRows] = useState(selectedPanel?.numRows ?? 2)
  const [perRow, setPerRow] = useState(selectedPanel?.fusesPerRow ?? 12)

  useEffect(() => {
    if (selectedPanel) {
      setRows(selectedPanel.numRows)
      setPerRow(selectedPanel.fusesPerRow)
    }
  }, [selectedPanel?.id])

  const capacity = rows * perRow

  const { data: fusesData = [], isLoading: fusesLoading } = useFuses(selectedPanelId)
  const createFuseMutation = useCreateFuse(selectedPanelId ?? '')
  const updateFuseMutation = useUpdateFuse(selectedPanelId ?? '')
  const deleteFuseMutation = useDeleteFuse(selectedPanelId ?? '')
  const reorderMutation = useReorderFuses(selectedPanelId ?? '')

  const fuses: IFuse[] = fusesData

  const [mainOn, setMainOn] = useState(true)
  const mainAmp = selectedPanel?.mainAmp ?? 200
  const voltage = selectedPanel?.voltage ?? 240
  const frequency = selectedPanel?.frequency ?? 60

  const [editingPanel, setEditingPanel] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [focusPos, setFocusPos] = useState<number | null>(null)
  const [dragState, setDragState] = useState<IDragState>({ draggingId: null, overPos: null })
  const [toast, setToast] = useState<string | null>(null)
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const fuseByPos = useMemo(() => {
    const m: Record<number, IFuse> = {}
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
    if (selectedPanel) {
      updatePanelMutation.mutate({ ...selectedPanel, numRows: n })
    }
    if (displaced > 0) showToast(`${displaced} fuse${displaced === 1 ? '' : 's'} hidden — increase capacity to restore`)
  }

  const handlePerRowChange = (n: number) => {
    const displaced = fuses.filter(f => f.pos > rows * n).length
    setPerRow(n)
    if (selectedPanel) {
      updatePanelMutation.mutate({ ...selectedPanel, fusesPerRow: n })
    }
    if (displaced > 0) showToast(`${displaced} fuse${displaced === 1 ? '' : 's'} hidden — increase capacity to restore`)
  }

  const addFuse = ({ label, amp, pos: requestedPos }: { label: string; amp: AmpValue; pos: number | null }) => {
    if (!selectedPanelId || slotsAvailable === 0) return
    let pos = requestedPos ?? 0
    if (!pos || fuseByPos[pos] || pos > capacity) {
      pos = 1
      while (fuseByPos[pos]) pos++
    }
    if (pos > capacity) return
    createFuseMutation.mutate(
      { pos, label, amp },
      { onSuccess: () => showToast(`Installed "${label}" in slot ${String(pos).padStart(2, '0')}`) }
    )
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
    const fuse = fuses.find(f => f.id === id)
    if (!fuse) return
    updateFuseMutation.mutate(
      { id, pos: fuse.pos, ...patch },
      { onSuccess: () => { showToast(`Updated "${patch.label}"`); setSelectedId(null) } }
    )
  }

  const removeFuse = (id: string) => {
    const f = fuses.find(x => x.id === id)
    if (selectedId === id) setSelectedId(null)
    deleteFuseMutation.mutate(
      id,
      { onSuccess: () => { if (f) showToast(`Removed "${f.label}" from slot ${String(f.pos).padStart(2, '0')}`) } }
    )
  }

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, fuse: IFuse) => {
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
    const src = fuses.find(f => f.id === id)
    if (!src || src.pos === pos) { setDragState({ draggingId: null, overPos: null }); return }

    // Build the new position map after the swap
    const swapped = fuses.map(f => {
      const target = fuses.find(x => x.pos === pos)
      if (f.id === src.id) return { ...f, pos }
      if (target && f.id === target.id) return { ...f, pos: src.pos }
      return f
    })

    // Send ordered IDs sorted by new positions
    const orderedIds = [...swapped].sort((a, b) => a.pos - b.pos).map(f => f.id)
    reorderMutation.mutate(orderedIds)
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
          focusPos={focusPos}
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

  if (panelsLoading || fusesLoading) {
    return (
      <div className="app">
        <header className="topbar">
          <div className="brand">
            <div className="brand-mark">F</div>
            <span className="brand-name">Fuse Box</span>
            <span className="brand-sub">Panel Configurator</span>
          </div>
        </header>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', color: 'var(--text-muted)' }}>
          Loading…
        </div>
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
          <span>{voltage}V · {frequency}Hz</span>
          <PanelDropdown
              panels={panels}
              selectedPanelId={selectedPanelId}
              onSelect={selectPanel}
              onCreate={(name, location) =>
                createPanelMutation.mutate(
                  { name, location, numRows: 2, fusesPerRow: 12, mainAmp: 200, voltage: 240, frequency: 60 },
                  { onSuccess: (p) => selectPanel(p.id) }
                )
              }
            />
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
      </div>

      <main className="main">
        <section className="panel">
          <div className="panel-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="panel-title">{selectedPanel?.name ?? 'Distribution Panel'}</span>
              <button className="btn btn-ghost btn-icon panel-edit-btn" onClick={() => setEditingPanel(true)} title="Edit panel details" aria-label="Edit panel details">
                <Pencil />
              </button>
            </div>
            <div className="panel-meta">
              <span>{rows}P · {perRow === 2 ? 'SPLIT-BUS' : `${perRow}-WIDE`}</span>
              <span>·</span>
              <span>{visibleFuses.length} ACTIVE</span>
            </div>
          </div>

          <MainBreaker on={mainOn} onToggle={() => setMainOn(o => !o)} ampRating={mainAmp} voltage={voltage} />
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

      {editingPanel && selectedPanel && (
        <PanelEditModal
          panel={selectedPanel}
          onSave={(patch) => updatePanelMutation.mutate({ ...selectedPanel!, ...patch })}
          onClose={() => setEditingPanel(false)}
        />
      )}
      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}

export default App
