import { useState, useRef, useEffect } from 'react'
import type { IPanelFormValues } from '../interfaces'
import Stepper from './Stepper'

const MAIN_AMP_OPTIONS = [40, 63, 80, 100, 125, 200]
const VOLTAGE_OPTIONS = [120, 230, 240]
const FREQUENCY_OPTIONS = [50, 60]

interface IPanelFormProps {
  initialValues?: Partial<IPanelFormValues>
  submitLabel: string
  isPending: boolean
  readOnly?: boolean
  onSubmit: (values: IPanelFormValues) => void
  onCancel: () => void
}

const DEFAULTS: IPanelFormValues = {
  name: '',
  location: '',
  numRows: 2,
  fusesPerRow: 12,
  mainAmp: 63,
  voltage: 230,
  frequency: 50,
}

export default function PanelForm({ initialValues, submitLabel, isPending, readOnly, onSubmit, onCancel }: IPanelFormProps) {
  const init = { ...DEFAULTS, ...initialValues }
  const [name, setName] = useState(init.name)
  const [location, setLocation] = useState(init.location)
  const [numRows, setNumRows] = useState(init.numRows)
  const [fusesPerRow, setFusesPerRow] = useState(init.fusesPerRow)
  const [mainAmp, setMainAmp] = useState(init.mainAmp)
  const [voltage, setVoltage] = useState(init.voltage)
  const [frequency, setFrequency] = useState(init.frequency)
  const nameRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    nameRef.current?.focus()
  }, [])

  useEffect(() => {
    if (!initialValues) return
    if (initialValues.name !== undefined) setName(initialValues.name)
    if (initialValues.location !== undefined) setLocation(initialValues.location)
    if (initialValues.numRows !== undefined) setNumRows(initialValues.numRows)
    if (initialValues.fusesPerRow !== undefined) setFusesPerRow(initialValues.fusesPerRow)
    if (initialValues.mainAmp !== undefined) setMainAmp(initialValues.mainAmp)
    if (initialValues.voltage !== undefined) setVoltage(initialValues.voltage)
    if (initialValues.frequency !== undefined) setFrequency(initialValues.frequency)
  }, [initialValues?.name])

  const handleSubmit = () => {
    if (!name.trim() || isPending) return
    onSubmit({ name: name.trim(), location: location.trim(), numRows, fusesPerRow, mainAmp, voltage, frequency })
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSubmit()
  }

  return (
    <>
      <div className="card-body">
        <div className="field">
          <label className="field-label" htmlFor="panel-name">Name <span className="field-required">*</span></label>
          <input
            ref={nameRef}
            id="panel-name"
            className="input"
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Panel name"
            disabled={readOnly}
          />
        </div>
        <div className="field">
          <label className="field-label" htmlFor="panel-location">Location</label>
          <input
            id="panel-location"
            className="input"
            value={location}
            onChange={e => setLocation(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g. Utility Room, Garage"
            disabled={readOnly}
          />
        </div>
        <div className="field">
          <label className="field-label">Rows</label>
          <div style={{ alignSelf: 'flex-start' }}>
            <Stepper value={numRows} min={1} max={12} onChange={setNumRows} ariaLabel="Number of rows" disabled={readOnly} />
          </div>
        </div>
        <div className="field">
          <label className="field-label">Fuses / Row</label>
          <div style={{ alignSelf: 'flex-start' }}>
            <Stepper value={fusesPerRow} min={2} max={12} onChange={setFusesPerRow} ariaLabel="Fuses per row" disabled={readOnly} />
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
                disabled={readOnly}
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
                disabled={readOnly}
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
                disabled={readOnly}
              >{f}Hz</button>
            ))}
          </div>
        </div>
      </div>
      <div className="dialog-footer">
        <button className="btn" onClick={onCancel}>Cancel</button>
        {!readOnly && (
          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={!name.trim() || isPending}
          >
            {isPending ? `${submitLabel}…` : submitLabel}
          </button>
        )}
      </div>
    </>
  )
}
