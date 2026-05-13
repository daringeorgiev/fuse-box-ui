import { useState, useRef, useEffect } from 'react'
import type { IPanel } from '../interfaces'

interface IPanelTypeaheadProps {
  panels: IPanel[]
  selectedPanelId: string | null
  onSelect: (id: string) => void
}

export default function PanelTypeahead({ panels, selectedPanelId, onSelect }: IPanelTypeaheadProps) {
  const selectedPanel = panels.find(p => p.id === selectedPanelId)
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [activeIdx, setActiveIdx] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const filtered = query.trim()
    ? panels.filter(p => p.name.toLowerCase().includes(query.toLowerCase()))
    : panels

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        close()
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const openDropdown = () => {
    setQuery('')
    setOpen(true)
    setActiveIdx(-1)
  }

  const close = () => {
    setOpen(false)
    setQuery('')
    setActiveIdx(-1)
  }

  const handleSelect = (id: string) => {
    onSelect(id)
    close()
    inputRef.current?.blur()
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') { close(); inputRef.current?.blur(); return }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIdx(i => Math.min(i + 1, filtered.length - 1))
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIdx(i => Math.max(i - 1, 0))
    }
    if (e.key === 'Enter') {
      if (activeIdx >= 0 && filtered[activeIdx]) handleSelect(filtered[activeIdx].id)
    }
  }

  return (
    <div className="panel-typeahead" ref={containerRef}>
      <div
        className={`panel-typeahead-trigger${open ? ' open' : ''}`}
        onClick={() => inputRef.current?.focus()}
      >
        <input
          ref={inputRef}
          className="panel-typeahead-input"
          value={open ? query : (selectedPanel?.name ?? '')}
          placeholder={open ? (selectedPanel?.name ?? 'Search panels…') : ''}
          onFocus={openDropdown}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          role="combobox"
          aria-label="Select panel"
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-autocomplete="list"
          aria-controls="panel-typeahead-menu"
        />
        <svg
          className="panel-typeahead-chevron"
          width="10" height="6" viewBox="0 0 10 6"
          fill="none" aria-hidden="true"
        >
          <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      {open && (
        <div className="panel-typeahead-menu" id="panel-typeahead-menu" role="listbox">
          {filtered.length === 0 && (
            <div className="panel-typeahead-empty">No panels match</div>
          )}
          {filtered.map((p, i) => (
            <button
              key={p.id}
              role="option"
              aria-selected={p.id === selectedPanelId}
              className={`panel-typeahead-item${p.id === selectedPanelId ? ' active' : ''}${i === activeIdx ? ' keyboard-focused' : ''}`}
              onMouseDown={e => { e.preventDefault(); handleSelect(p.id) }}
            >
              <span className="panel-typeahead-item-name">{p.name}</span>
              {p.location && <span className="panel-typeahead-item-loc">{p.location}</span>}
              {p.id === selectedPanelId && (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true" style={{ marginLeft: 'auto', flexShrink: 0 }}>
                  <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
