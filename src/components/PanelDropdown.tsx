import { useState, useRef, useEffect } from 'react'
import type { IPanel } from '../interfaces'

interface Props {
  panels: IPanel[]
  selectedPanelId: string | null
  onSelect: (id: string) => void
  onCreate: (name: string, location: string) => void
}

export default function PanelDropdown({ panels, selectedPanelId, onSelect, onCreate }: Props) {
  const [open, setOpen] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [location, setLocation] = useState('')
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
        setShowForm(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const selectedPanel = panels.find(p => p.id === selectedPanelId)

  const handleCreate = () => {
    if (!name.trim()) return
    onCreate(name.trim(), location.trim() || 'Unknown')
    setName('')
    setLocation('')
    setShowForm(false)
    setOpen(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleCreate()
    if (e.key === 'Escape') setShowForm(false)
  }

  return (
    <div className="panel-dropdown" ref={ref}>
      <button
        className="panel-dropdown-trigger"
        onClick={() => { setOpen(o => !o); setShowForm(false) }}
        aria-expanded={open}
      >
        <span>{selectedPanel?.name ?? 'No Panel'}</span>
        <svg width="10" height="6" viewBox="0 0 10 6" fill="none" aria-hidden="true" style={{ transform: open ? 'rotate(180deg)' : undefined, transition: 'transform 0.15s' }}>
          <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {open && (
        <div className="panel-dropdown-menu">
          {panels.map(p => (
            <button
              key={p.id}
              className={`panel-dropdown-item${p.id === selectedPanelId ? ' active' : ''}`}
              onClick={() => { onSelect(p.id); setOpen(false) }}
            >
              <span>{p.name}</span>
              {p.id === selectedPanelId && (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </button>
          ))}
          {panels.length > 0 && <div className="panel-dropdown-sep" />}
          {!showForm ? (
            <button className="panel-dropdown-item panel-dropdown-new" onClick={() => setShowForm(true)}>
              + New Panel
            </button>
          ) : (
            <div className="panel-dropdown-form">
              <input
                className="panel-dropdown-input"
                placeholder="Panel name"
                value={name}
                onChange={e => setName(e.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus
              />
              <input
                className="panel-dropdown-input"
                placeholder="Location (optional)"
                value={location}
                onChange={e => setLocation(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <div className="panel-dropdown-form-actions">
                <button className="panel-dropdown-action cancel" onClick={() => setShowForm(false)}>Cancel</button>
                <button className="panel-dropdown-action create" onClick={handleCreate} disabled={!name.trim()}>Create</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
