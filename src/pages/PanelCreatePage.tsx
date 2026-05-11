import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCreatePanel } from '../hooks/usePanels'
import Topbar from '../components/Topbar'
import Stepper from '../components/Stepper'

const MAIN_AMP_OPTIONS = [40, 63, 80, 100, 125, 200]
const VOLTAGE_OPTIONS = [120, 230, 240]
const FREQUENCY_OPTIONS = [50, 60]

export default function PanelCreatePage() {
  const navigate = useNavigate()
  const createPanel = useCreatePanel()

  const [name, setName] = useState('')
  const [location, setLocation] = useState('')
  const [numRows, setNumRows] = useState(2)
  const [fusesPerRow, setFusesPerRow] = useState(12)
  const [mainAmp, setMainAmp] = useState(63)
  const [voltage, setVoltage] = useState(230)
  const [frequency, setFrequency] = useState(50)
  const nameRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    nameRef.current?.focus()
  }, [])

  const handleCreate = () => {
    if (!name.trim()) return
    createPanel.mutate(
      { name: name.trim(), location: location.trim() || 'Unknown', numRows, fusesPerRow, mainAmp, voltage, frequency },
      { onSuccess: (p) => navigate(`/?panel=${p.id}`) }
    )
  }

  const topbar = <Topbar />

  const configbar = (
    <div className="configbar">
      <div className="config-panel-identity">
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span className="panel-title">{name || 'New Panel'}</span>
          {location && <span className="panel-location">{location}</span>}
        </div>
      </div>
      <div className="config-spacer" />
      <button className="btn btn-ghost panel-edit-btn" onClick={() => navigate('/')}>
        ← Back
      </button>
    </div>
  )

  return (
    <div className="app">
      {topbar}
      {configbar}
      <main className="main" style={{ maxWidth: 520 }}>
        <div className="card">
          <div className="card-header">
            <span className="card-title">New Panel</span>
          </div>
          <div className="card-body">
            <div className="field">
              <label className="field-label" htmlFor="panel-name">Name <span className="field-required">*</span></label>
              <input
                ref={nameRef}
                id="panel-name"
                className="input"
                value={name}
                onChange={e => setName(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleCreate() }}
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
                onKeyDown={e => { if (e.key === 'Enter') handleCreate() }}
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
              onClick={handleCreate}
              disabled={!name.trim() || createPanel.isPending}
            >
              {createPanel.isPending ? 'Creating…' : 'Create'}
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
