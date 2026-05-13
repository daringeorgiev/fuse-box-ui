import { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from '@tanstack/react-query'
import type { IFuse } from '../interfaces'
import type { AmpValue } from '../interfaces'
import Stepper from '../components/Stepper'
import PanelGrid from '../components/PanelGrid'
import FuseForm from '../components/FuseForm'
import StatsCard from '../components/StatsCard'
import Legend from '../components/Legend'
import PanelTypeahead from '../components/PanelTypeahead'
import { useFuseBoxStore } from '../store/fusebox.store'
import { usePanels, useCreatePanel, useUpdatePanel, useCopyPanel } from '../hooks/usePanels'
import { useFuses, useCreateFuse, useUpdateFuse, useDeleteFuse } from '../hooks/useFuses'
import { useDragHandlers } from '../hooks/useDragHandlers'
import Topbar from '../components/Topbar'
import { Plus, Copy as CopyIcon, Pencil, Printer } from '../components/Icons'
import PrintView from '../components/PrintView'
import { useAuth } from '../context/AuthContext'

export default function PanelPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { t } = useTranslation()
  const { user, isAdmin, loading: authLoading } = useAuth()
  const { selectedPanelId, selectPanel } = useFuseBoxStore()
  const qc = useQueryClient()

  const selectPanelAndSync = useCallback((id: string) => {
    selectPanel(id)
    setSearchParams({ panel: id }, { replace: true })
  }, [selectPanel, setSearchParams])

  const { data: panels = [], isLoading: panelsLoading } = usePanels(!authLoading)

  useEffect(() => {
    if (!authLoading) qc.invalidateQueries({ queryKey: ['panels'] })
  }, [user, authLoading, qc])
  const createPanelMutation = useCreatePanel()
  const updatePanelMutation = useUpdatePanel()
  const copyPanelMutation = useCopyPanel()

  // Auto-select panel from query param, fall back to first panel
  useEffect(() => {
    if (panelsLoading) return
    if (panels.length === 0) {
      if (user) {
        createPanelMutation.mutate(
          { name: 'Main Panel', location: 'Utility Room', numRows: 2, fusesPerRow: 12, mainAmp: 63, voltage: 230, frequency: 50 },
          { onSuccess: (p) => selectPanelAndSync(p.id) }
        )
      }
    } else {
      const paramId = searchParams.get('panel')
      const target = (paramId && panels.find(p => p.id === paramId)) ? paramId : panels[0].id
      if (target !== selectedPanelId) selectPanelAndSync(target)
      else if (!paramId) setSearchParams({ panel: target }, { replace: true })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [panelsLoading, panels.length, user])

  const selectedPanel = panels.find(p => p.id === selectedPanelId)
  const readOnly = (selectedPanel?.isDefault ?? false) && !isAdmin

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

  const { data: fusesData = [] } = useFuses(selectedPanelId)
  const createFuseMutation = useCreateFuse(selectedPanelId ?? '')
  const updateFuseMutation = useUpdateFuse(selectedPanelId ?? '')
  const deleteFuseMutation = useDeleteFuse(selectedPanelId ?? '')

  const fuses: IFuse[] = fusesData

  const mainAmp = selectedPanel?.mainAmp ?? 63
  const voltage = selectedPanel?.voltage ?? 230
  const frequency = selectedPanel?.frequency ?? 50

  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [focusPos, setFocusPos] = useState<number | null>(null)
  const [toast, setToast] = useState<{ msg: string; isError: boolean } | null>(null)
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

  const freeSlots = useMemo(() => {
    const occupied = new Set(visibleFuses.map(f => f.pos))
    return Array.from({ length: capacity }, (_, i) => i + 1).filter(p => !occupied.has(p))
  }, [visibleFuses, capacity])

  const showToast = useCallback((msg: string, isError = false) => {
    if (toastTimerRef.current !== null) clearTimeout(toastTimerRef.current)
    setToast({ msg, isError })
    toastTimerRef.current = setTimeout(() => setToast(null), isError ? 4000 : 2000)
  }, [])

  const handleRowsChange = (n: number) => {
    const displaced = fuses.filter(f => f.pos > n * perRow).length
    setRows(n)
    if (selectedPanel) {
      updatePanelMutation.mutate(
        { ...selectedPanel, numRows: n },
        { onError: (e) => showToast((e as Error).message, true) }
      )
    }
    if (displaced > 0) showToast(t('panelPage.fusesHidden', { count: displaced }))
  }

  const handlePerRowChange = (n: number) => {
    const displaced = fuses.filter(f => f.pos > rows * n).length
    setPerRow(n)
    if (selectedPanel) {
      updatePanelMutation.mutate(
        { ...selectedPanel, fusesPerRow: n },
        { onError: (e) => showToast((e as Error).message, true) }
      )
    }
    if (displaced > 0) showToast(t('panelPage.fusesHidden', { count: displaced }))
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
      {
        onSuccess: () => showToast(t('toasts.installed', { label, slot: String(pos).padStart(2, '0') })),
        onError: (e) => showToast((e as Error).message, true),
      }
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

  const updateFuse = (id: string, patch: { label: string; amp: AmpValue; pos: number }) => {
    updateFuseMutation.mutate(
      { id, ...patch },
      {
        onSuccess: () => { showToast(t('toasts.updated', { label: patch.label })); setSelectedId(null) },
        onError: (e) => showToast((e as Error).message, true),
      }
    )
  }

  const removeFuse = (id: string) => {
    const f = fuses.find(x => x.id === id)
    if (selectedId === id) setSelectedId(null)
    deleteFuseMutation.mutate(
      id,
      {
        onSuccess: () => { if (f) showToast(t('toasts.removed', { label: f.label, slot: String(f.pos).padStart(2, '0') })) },
        onError: (e) => showToast((e as Error).message, true),
      }
    )
  }

  const handleCopy = () => {
    if (!user) { navigate('/login'); return }
    if (!selectedPanel) return
    copyPanelMutation.mutate(
      { panel: selectedPanel, fuses },
      {
        onSuccess: (p) => navigate(`/panels/${p.id}/edit`),
        onError: (e) => showToast((e as Error).message, true),
      }
    )
  }

  const mutateFuseForDrag = useCallback(
    (...args: Parameters<typeof updateFuseMutation.mutate>) =>
      updateFuseMutation.mutate(args[0], { ...args[1], onError: (e) => showToast((e as Error).message, true) }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [updateFuseMutation.mutate]
  )

  const { dragState, handleDragStart, handleDragEnd, handleDragOver, handleDragLeave, handleDrop } =
    useDragHandlers(fuses, mutateFuseForDrag)

  return (
    <div className="app">
      <Topbar />

      <div className="configbar">
        <div className="configbar-group configbar-group--identity">
          <PanelTypeahead
            panels={panels}
            selectedPanelId={selectedPanelId}
            onSelect={selectPanelAndSync}
          />
        </div>
        <div className="configbar-group configbar-group--switches">
          <div className="config-group">
            <span className="config-label">{t('panelPage.rows')}</span>
            <Stepper value={rows} min={1} max={12} onChange={handleRowsChange} ariaLabel={t('panelPage.rows')} disabled={readOnly} />
          </div>
          <div className="config-group">
            <span className="config-label">{t('panelPage.fusesPerRow')}</span>
            <Stepper value={perRow} min={2} max={12} onChange={handlePerRowChange} ariaLabel={t('panelPage.fusesPerRow')} disabled={readOnly} />
          </div>
        </div>
        <div className="configbar-group configbar-group--actions">
          <button
            className="btn btn-ghost panel-action-btn"
            onClick={() => navigate('/panels/new')}
            title={t('panelPage.newTitle')}
          >
            <Plus /> {t('panelPage.new')}
          </button>
          <button
            className="btn btn-ghost panel-action-btn"
            onClick={handleCopy}
            disabled={!selectedPanel || copyPanelMutation.isPending}
            title={t('panelPage.copyTitle')}
          >
            <CopyIcon /> {t('panelPage.copy')}
          </button>
          <button
            className="btn btn-ghost panel-action-btn"
            onClick={() => window.print()}
            disabled={!selectedPanel}
            title={t('panelPage.printTitle')}
          >
            <Printer /> {t('panelPage.print')}
          </button>
          <button
            className="btn btn-ghost panel-action-btn"
            onClick={() => selectedPanelId && navigate(`/panels/${selectedPanelId}/edit`)}
            title={t('panelPage.editTitle')}
          >
            <Pencil /> {t('panelsPage.edit')}
          </button>
        </div>
      </div>

      <div className="panel-infostrip">
        {selectedPanel ? (
          <>
            <span>{selectedPanel.name}</span>
            {selectedPanel.location && <><span className="infostrip-dot">·</span><span>{selectedPanel.location}</span></>}
            <span className="infostrip-dot">·</span><span>{voltage}V</span>
            <span className="infostrip-dot">·</span><span>{frequency}Hz</span>
            <span className="infostrip-dot">·</span><span>{mainAmp}A</span>
          </>
        ) : (
          <>
            <span className="skeleton skeleton--text" style={{ width: '7rem' }} />
            <span className="infostrip-dot">·</span>
            <span className="skeleton skeleton--text" style={{ width: '5rem' }} />
            <span className="infostrip-dot">·</span>
            <span className="skeleton skeleton--text" style={{ width: '3rem' }} />
          </>
        )}
      </div>

      <main className="main">
        <section className="panel">
          <div className="panel-header">
            <div className="panel-header-identity">
              <span className="panel-header-name">{selectedPanel?.name ?? t('panelPage.panel')}</span>
              {selectedPanel?.location && (
                <span className="panel-header-location">{selectedPanel.location}</span>
              )}
            </div>
          </div>

          <PanelGrid
            rows={rows}
            perRow={perRow}
            fuseByPos={fuseByPos}
            selectedId={selectedId}
            focusPos={focusPos}
            dragState={dragState}
            readOnly={readOnly}
            onSelect={selectFuse}
            onAddHere={requestAddAt}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onRemove={removeFuse}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          />
        </section>

        <aside className="sidebar">
          <FuseForm
            editingFuse={fuses.find(f => f.id === selectedId)}
            focusPos={focusPos}
            onAdd={addFuse}
            onUpdate={updateFuse}
            onCancel={() => { setSelectedId(null); setFocusPos(null) }}
            freeSlots={freeSlots}
            readOnly={readOnly}
          />
          <StatsCard fuses={visibleFuses} capacity={capacity} mainAmp={mainAmp} />
          <Legend fuses={visibleFuses} />
        </aside>
      </main>

      {toast && <div className={`snack${toast.isError ? ' snack--error' : ''}`}>{toast.msg}</div>}

      {selectedPanel && (
        <PrintView
          panel={selectedPanel}
          fuses={visibleFuses}
          rows={rows}
          perRow={perRow}
        />
      )}
    </div>
  )
}
