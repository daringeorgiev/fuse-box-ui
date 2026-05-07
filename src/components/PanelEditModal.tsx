import { useState, useEffect, useRef } from 'react'
import type { IPanel } from '../interfaces'
import { X } from './Icons'

interface IPanelEditModalProps {
  panel: IPanel
  onSave: (patch: { name: string; location: string; mainAmp: number; voltage: number; frequency: number }) => void
  onClose: () => void
}

const MAIN_AMP_OPTIONS = [100, 150, 200, 400]
const VOLTAGE_OPTIONS = [120, 230, 240]
const FREQUENCY_OPTIONS = [50, 60]

export default function PanelEditModal({ panel, onSave, onClose }: IPanelEditModalProps) {
  const [name, setName] = useState(panel.name)
  const [location, setLocation] = useState(panel.location)
  const [mainAmp, setMainAmp] = useState(panel.mainAmp)
  const [voltage, setVoltage] = useState(panel.voltage)
  const [frequency, setFrequency] = useState(panel.frequency)
  const nameRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    nameRef.current?.focus()
    nameRef.current?.select()
  }, [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  const handleSave = () => {
    if (!name.trim()) return
    onSave({ name: name.trim(), location: location.trim(), mainAmp, voltage, frequency })
    onClose()
  }

  return (
    <div className="modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className="dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-title">
        <div className="dialog-header">
          <span className="dialog-title" id="dialog-title">Edit Panel</span>
          <button className="btn btn-ghost btn-icon" onClick={onClose} aria-label="Close"><X /></button>
        </div>
        <div className="dialog-body">
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
          <button className="btn" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave} disabled={!name.trim()}>Save</button>
        </div>
      </div>
    </div>
  )
}
