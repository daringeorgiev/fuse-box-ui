import { useState, useCallback, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { usePanels, useUpdatePanel, useDeletePanel } from '../hooks/usePanels'
import type { IPanelFormValues } from '../interfaces'
import Topbar from '../components/Topbar'
import PanelForm from '../components/PanelForm'
import Notice from '../components/Notice'
import { useAuth } from '../context/AuthContext'

export default function PanelEditPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { isAdmin } = useAuth()
  const { data: panels = [], isLoading } = usePanels()
  const updatePanel = useUpdatePanel()
  const deletePanel = useDeletePanel()
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [snack, setSnack] = useState<{ msg: string; isError: boolean } | null>(null)
  const snackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const showSnack = useCallback((msg: string, isError = false) => {
    if (snackTimerRef.current !== null) clearTimeout(snackTimerRef.current)
    setSnack({ msg, isError })
    snackTimerRef.current = setTimeout(() => setSnack(null), isError ? 4000 : 2000)
  }, [])

  const panel = panels.find(p => p.id === id)
  const readOnly = (panel?.isDefault ?? false) && !isAdmin

  const handleSubmit = (values: IPanelFormValues) => {
    if (!panel) return
    updatePanel.mutate(
      { ...panel, ...values },
      {
        onSuccess: () => navigate(`/?panel=${panel.id}`),
        onError: (e) => showSnack((e as Error).message, true),
      }
    )
  }

  const handleDelete = () => {
    if (!panel) return
    if (!confirmDelete) { setConfirmDelete(true); return }
    deletePanel.mutate(
      panel.id,
      {
        onSuccess: () => navigate('/'),
        onError: (e) => showSnack((e as Error).message, true),
      }
    )
  }

  const topbar = <Topbar />

  if (isLoading) {
    return (
      <div className="app">
        {topbar}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', color: 'var(--ink-3)' }}>
          {t('panelEditPage.loading')}
        </div>
      </div>
    )
  }

  if (!panel) {
    return (
      <div className="app">
        {topbar}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: 16, color: 'var(--ink-3)' }}>
          <span>{t('panelEditPage.panelNotFound')}</span>
          <button className="btn" onClick={() => navigate(`/?panel=${id}`)}>{t('panelEditPage.goBack')}</button>
        </div>
      </div>
    )
  }

  const configbar = (
    <div className="configbar">
      <div className="configbar-group configbar-group--identity">
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span className="panel-title">{panel.name}</span>
          {panel.location && <span className="panel-location">{panel.location}</span>}
        </div>
      </div>
      <div className="configbar-group configbar-group--actions">
        <button className="btn btn-ghost panel-action-btn" onClick={() => navigate(`/?panel=${id}`)}>
          {t('panelEditPage.back')}
        </button>
      </div>
    </div>
  )

  return (
    <div className="app">
      {topbar}
      {configbar}
      <main className="main" style={{ maxWidth: 520 }}>
        {readOnly && (
          <Notice className="notice--mb">
            {t('panelEditPage.defaultNotice')}
          </Notice>
        )}
        <div className="card">
          <div className="card-header">
            <span className="card-title">{t('panelEditPage.cardTitle')}</span>
          </div>
          <PanelForm
            initialValues={panel}
            submitLabel={t('panelEditPage.save')}
            isPending={updatePanel.isPending}
            readOnly={readOnly}
            onSubmit={handleSubmit}
            onCancel={() => navigate(`/?panel=${id}`)}
          />
        </div>

        {!readOnly && (
          <div className="danger-zone" style={{ marginTop: '1.25rem' }}>
            <div className="danger-zone-header">{t('panelEditPage.dangerZone')}</div>
            <div className="danger-zone-body">
              <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                <button
                  className="btn btn-danger"
                  onClick={handleDelete}
                  disabled={deletePanel.isPending}
                >
                  {deletePanel.isPending
                    ? t('panelEditPage.deleting')
                    : confirmDelete
                      ? t('panelEditPage.yesDelete')
                      : t('panelEditPage.deletePanel')}
                </button>
                {confirmDelete && (
                  <button className="btn" onClick={() => setConfirmDelete(false)}>
                    {t('panelEditPage.cancel')}
                  </button>
                )}
              </div>
              <p>
                {confirmDelete
                  ? t('panelEditPage.dangerConfirmDescription')
                  : t('panelEditPage.dangerDescription')}
              </p>
            </div>
          </div>
        )}
      </main>
      {snack && <div className={`snack${snack.isError ? ' snack--error' : ''}`}>{snack.msg}</div>}
    </div>
  )
}
