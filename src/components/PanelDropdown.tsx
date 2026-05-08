import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import type { IPanel } from '../interfaces'

interface Props {
  panels: IPanel[]
  selectedPanelId: string | null
  onSelect: (id: string) => void
}

export default function PanelDropdown({ panels, selectedPanelId, onSelect }: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const selectedPanel = panels.find(p => p.id === selectedPanelId)

  return (
    <div className="panel-dropdown" ref={ref}>
      <button
        className="panel-dropdown-trigger"
        onClick={() => setOpen(o => !o)}
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
          <button
            className="panel-dropdown-item panel-dropdown-new"
            onClick={() => { setOpen(false); navigate('/panels/new') }}
          >
            + New Panel
          </button>
        </div>
      )}
    </div>
  )
}
