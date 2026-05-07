import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { usePanels, useUpdatePanel } from '../hooks/usePanels'
import Stepper from '../components/Stepper'

const MAIN_AMP_OPTIONS = [100, 150, 200, 400]
const VOLTAGE_OPTIONS = [120, 230, 240]
const FREQUENCY_OPTIONS = [50, 60]

export default function PanelEditPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: panels = [], isLoading } = usePanels()
  const updatePanel = useUpdatePanel()

  const panel = panels.find(p => p.id === id)

  const [name, setName] = useState('')
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

  const handleSave = () => {
    if (!panel || !name.trim()) return
    updatePanel.mutate(
      { ...panel, name: name.trim(), location: location.trim(), numRows, fusesPerRow, mainAmp, voltage, frequency },
      { onSuccess: () => navigate('/') }
    )
  }

  const topbar = (
    <header className="topbar">
      <div className="brand">
        <div className="brand-mark">F</div>
        <span className="brand-name">Fuse Box</span>
        <span className="brand-sub">Panel Configurator</span>
      </div>
      <div className="topbar-right">
        <button className="btn" style={{ borderColor: 'rgba(245,242,236,0.2)', background: 'transparent', color: 'rgba(245,242,236,0.7)' }} onClick={() => navigate('/')}>
          ← Back
        </button>
      </div>
    </header>
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
          <button className="btn" onClick={() => navigate('/')}>Go back</button>
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      {topbar}
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
            <button className="btn" onClick={() => navigate('/')}>Cancel</button>
            <button
              className="btn btn-primary"
              onClick={handleSave}
              disabled={!name.trim() || updatePanel.isPending}
            >
              {updatePanel.isPending ? 'Saving…' : 'Save'}
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
