import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { usePanels, useUpdatePanel, useDeletePanel } from '../hooks/usePanels'
import Stepper from '../components/Stepper'

const MAIN_AMP_OPTIONS = [40, 63, 80, 100, 125, 200]
const VOLTAGE_OPTIONS = [120, 230, 240]
const FREQUENCY_OPTIONS = [50, 60]

export default function PanelEditPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: panels = [], isLoading } = usePanels()
  const updatePanel = useUpdatePanel()
  const deletePanel = useDeletePanel()

  const panel = panels.find(p => p.id === id)

  const [name, setName] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [location, setLocation] = useState('')
  const [numRows, setNumRows] = useState(2)
  const [fusesPerRow, setFusesPerRow] = useState(12)
  const [mainAmp, setMainAmp] = useState(200)
  const [voltage, setVoltage] = useState(240)
  const [frequency, setFrequency] = useState(60)
  const nameRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (panel) {
      setName(panel.name)
      setLocation(panel.location)
      setNumRows(panel.numRows)
      setFusesPerRow(panel.fusesPerRow)
      setMainAmp(panel.mainAmp)
      setVoltage(panel.voltage)
      setFrequency(panel.frequency)
    }
  }, [panel?.id])

  useEffect(() => {
    if (!isLoading) nameRef.current?.focus()
  }, [isLoading])

  const handleDelete = () => {
    if (!panel) return
    if (!confirmDelete) { setConfirmDelete(true); return }
    deletePanel.mutate(panel.id, { onSuccess: () => navigate('/') })
  }

  const handleSave = () => {
    if (!panel || !name.trim()) return
    updatePanel.mutate(
      { ...panel, name: name.trim(), location: location.trim(), numRows, fusesPerRow, mainAmp, voltage, frequency },
      { onSuccess: () => navigate(`/?panel=${panel.id}`) }
    )
  }

  const topbar = (
    <header className="topbar">
      <div className="brand">
        <div className="brand-mark">F</div>
        <span className="brand-name">Fuse Box</span>
        <span className="brand-sub">Panel Configurator</span>
      </div>
    </header>
  )

  const configbar = (
    <div className="configbar">
      <div className="config-panel-identity">
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span className="panel-title">{name || panel?.name || 'Distribution Panel'}</span>
          {(location || panel?.location) && (
            <span className="panel-location">{location || panel?.location}</span>
          )}
        </div>
      </div>
      <div className="config-spacer" />
      <button
        className="btn btn-ghost panel-edit-btn"
        onClick={() => navigate(`/?panel=${id}`)}
      >
        ← Back
      </button>
    </div>
  )

  if (isLoading) {
    return (
      <div className="app">
        {topbar}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', color: 'var(--ink-3)' }}>
          Loading…
        </div>
      </div>
    )
  }

  if (!panel) {
    return (
      <div className="app">
        {topbar}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: 16, color: 'var(--ink-3)' }}>
          <span>Panel not found.</span>
          <button className="btn" onClick={() => navigate(`/?panel=${id}`)}>Go back</button>
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      {topbar}
      {configbar}
      <main className="main" style={{ maxWidth: 520 }}>
        <div className="card">
          <div className="card-header">
            <span className="card-title">Edit Panel</span>
          </div>
          <div className="card-body">
            <div className="field">
              <label className="field-label" htmlFor="panel-name">Name</label>
              <input
                ref={nameRef}
                id="panel-name"
                className="input"
                value={name}
                onChange={e => setName(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleSave() }}
                placeholder="Panel name"
              />
            </div>
            <div className="field">
              <label className="field-label" htmlFor="panel-location">Location</label>
              <input
                id="panel-location"
                className="input"
                value={location}
                onChange={e => setLocation(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleSave() }}
                placeholder="e.g. Utility Room, Garage"
              />
            </div>
            <div className="field">
              <label className="field-label">Rows</label>
              <div style={{ alignSelf: 'flex-start' }}>
                <Stepper value={numRows} min={1} max={12} onChange={setNumRows} ariaLabel="Number of rows" />
              </div>
            </div>
            <div className="field">
              <label className="field-label">Fuses / Row</label>
              <div style={{ alignSelf: 'flex-start' }}>
                <Stepper value={fusesPerRow} min={2} max={12} onChange={setFusesPerRow} ariaLabel="Fuses per row" />
              </div>
            </div>
            <div className="field">
              <label className="field-label">Main Breaker</label>
              <div className="amp-grid">
                {MAIN_AMP_OPTIONS.map(a => (
                  <button
                    key={a}
                    type="button"
                    className={`amp-pill${mainAmp === a ? ' active' : ''}`}
                    onClick={() => setMainAmp(a)}
                  >{a}A</button>
                ))}
              </div>
            </div>
            <div className="field">
              <label className="field-label">Voltage</label>
              <div className="amp-grid">
                {VOLTAGE_OPTIONS.map(v => (
                  <button
                    key={v}
                    type="button"
                    className={`amp-pill${voltage === v ? ' active' : ''}`}
                    onClick={() => setVoltage(v)}
                  >{v}V</button>
                ))}
              </div>
            </div>
            <div className="field" style={{ marginBottom: 0 }}>
              <label className="field-label">Frequency</label>
              <div className="amp-grid">
                {FREQUENCY_OPTIONS.map(f => (
                  <button
                    key={f}
                    type="button"
                    className={`amp-pill${frequency === f ? ' active' : ''}`}
                    onClick={() => setFrequency(f)}
                  >{f}Hz</button>
                ))}
              </div>
            </div>
          </div>
          <div className="dialog-footer">
            <button className="btn" onClick={() => navigate(`/?panel=${id}`)}>Cancel</button>
            <button
              className="btn btn-primary"
              onClick={handleSave}
              disabled={!name.trim() || updatePanel.isPending}
            >
              {updatePanel.isPending ? 'Saving…' : 'Save'}
            </button>
          </div>
        </div>

        <div className="danger-zone" style={{ marginTop: '1.25rem' }}>
          <div className="danger-zone-header">Danger Zone</div>
          <div className="danger-zone-body">
            <p>
              {confirmDelete
                ? 'This will permanently delete the panel and all its fuses. Are you sure?'
                : 'Permanently delete this panel and all its fuses.'}
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
              {confirmDelete && (
                <button className="btn" onClick={() => setConfirmDelete(false)}>
                  Cancel
                </button>
              )}
              <button
                className="btn btn-danger"
                onClick={handleDelete}
                disabled={deletePanel.isPending}
              >
                {deletePanel.isPending ? 'Deleting…' : confirmDelete ? 'Yes, delete' : 'Delete Panel'}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
