import { useState, useEffect, useRef } from 'react'
import { AMP_RATINGS } from '../constants/amps'
import type { AmpValue, IFuse } from '../interfaces'
import { Plus } from './Icons'

interface FuseFormProps {
  editingFuse: IFuse | undefined
  focusPos: number | null
  slotsAvailable: number
  onAdd: (data: { label: string; amp: AmpValue; pos: number | null }) => void
  onUpdate: (id: string, patch: { label: string; amp: AmpValue }) => void
  onCancel: () => void
}

export default function FuseForm({ editingFuse, focusPos, slotsAvailable, onAdd, onUpdate, onCancel }: FuseFormProps) {
  const [label, setLabel] = useState('')
  const [amp, setAmp] = useState<AmpValue>(20)
  const inputRef = useRef<HTMLInputElement>(null)

  const isEdit = !!editingFuse
  const isFocused = !isEdit && focusPos != null

  useEffect(() => {
    if (editingFuse) {
      setLabel(editingFuse.label)
      setAmp(editingFuse.amp)
      inputRef.current?.focus()
      inputRef.current?.select()
    } else {
      setLabel('')
      setAmp(20)
    }
  }, [editingFuse?.id])

  useEffect(() => {
    if (isFocused) inputRef.current?.focus()
  }, [focusPos])

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault()
    const trimmed = label.trim()
    if (!trimmed) { inputRef.current?.focus(); return }
    if (isEdit) {
      onUpdate(editingFuse!.id, { label: trimmed, amp })
    } else {
      onAdd({ label: trimmed, amp, pos: focusPos })
      setLabel('')
      inputRef.current?.focus()
    }
  }

  const cancel = () => {
    setLabel('')
    setAmp(20)
    onCancel()
  }

  let headerMeta: React.ReactNode
  if (isEdit) {
    headerMeta = <span className="legend-count mono">SLOT {String(editingFuse!.pos).padStart(2, '0')}</span>
  } else if (isFocused) {
    headerMeta = <span className="legend-count mono">→ SLOT {String(focusPos).padStart(2, '0')}</span>
  } else {
    headerMeta = <span className="legend-count mono">{slotsAvailable} slot{slotsAvailable === 1 ? '' : 's'} free</span>
  }

  const cardClass = isEdit ? 'card card-edit' : isFocused ? 'card card-focused' : 'card'

  return (
    <form className={cardClass} onSubmit={submit}>
      <div className="card-header">
        <span className="card-title">{isEdit ? 'Edit Fuse' : 'Add Fuse'}</span>
        {headerMeta}
      </div>
      <div className="card-body">
        <div className="field">
          <label className="field-label" htmlFor="fuse-label">Circuit Label</label>
          <input
            id="fuse-label"
            ref={inputRef}
            className="input"
            type="text"
            placeholder="e.g. Living Room Lights"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            maxLength={40}
          />
        </div>
        <div className="field">
          <label className="field-label">Amperage</label>
          <div className="amp-grid">
            {AMP_RATINGS.map(r => (
              <button
                type="button"
                key={String(r.value)}
                className={`amp-pill${amp === r.value ? ' active' : ''}`}
                style={{ '--pill-color': r.color } as React.CSSProperties}
                onClick={() => setAmp(r.value)}
              >
                {r.value === 'GFCI' ? 'GFCI' : `${r.value}A`}
              </button>
            ))}
          </div>
        </div>
        {isEdit ? (
          <div className="form-actions">
            <button type="button" className="btn" onClick={cancel}>Cancel</button>
            <button className="btn btn-primary" type="submit">Save Changes</button>
          </div>
        ) : isFocused ? (
          <div className="form-actions">
            <button type="button" className="btn" onClick={cancel}>Cancel</button>
            <button className="btn btn-primary" type="submit">
              <Plus /> Install in Slot {String(focusPos).padStart(2, '0')}
            </button>
          </div>
        ) : (
          <button
            className="btn btn-primary btn-block"
            type="submit"
            disabled={slotsAvailable === 0}
          >
            <Plus />
            {slotsAvailable === 0 ? 'No Slots Available' : 'Install Fuse'}
          </button>
        )}
      </div>
    </form>
  )
}
