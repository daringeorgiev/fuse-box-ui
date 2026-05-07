import { useState, useEffect, useRef } from 'react'
import type { Panel } from '../types'
import { X } from './Icons'

interface Props {
  panel: Panel
  onSave: (patch: { name: string; location: string }) => void
  onClose: () => void
}

export default function PanelEditModal({ panel, onSave, onClose }: Props) {
  const [name, setName] = useState(panel.name)
  const [location, setLocation] = useState(panel.location)
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
    onSave({ name: name.trim(), location: location.trim() })
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
          <div className="field" style={{ marginBottom: 0 }}>
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
        </div>
        <div className="dialog-footer">
          <button className="btn" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave} disabled={!name.trim()}>Save</button>
        </div>
      </div>
    </div>
  )
}
