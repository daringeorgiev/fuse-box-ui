import { useState, useEffect, useRef } from 'react'
import { AMP_RATINGS } from '../constants/amps'
import type { AmpValue, IFuse } from '../interfaces'
import { Minus, Plus } from './Icons'
import Notice from './Notice'

interface FuseFormProps {
  editingFuse: IFuse | undefined
  focusPos: number | null
  freeSlots: number[]
  readOnly?: boolean
  onAdd: (data: { label: string; amp: AmpValue; pos: number | null }) => void
  onUpdate: (id: string, patch: { label: string; amp: AmpValue; pos: number }) => void
  onCancel: () => void
}

export default function FuseForm({ editingFuse, focusPos, freeSlots, readOnly, onAdd, onUpdate, onCancel }: FuseFormProps) {

  const [label, setLabel] = useState('')
  const [amp, setAmp] = useState<AmpValue>(20)
  const [localPos, setLocalPos] = useState<number | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const isEdit = !!editingFuse

  // slots available to pick in each mode
  const activeSlots = isEdit
    ? [editingFuse!.pos, ...freeSlots].sort((a, b) => a - b)
    : freeSlots

  const slotIndex = localPos !== null ? activeSlots.indexOf(localPos) : -1

  useEffect(() => {
    if (editingFuse) {
      setLabel(editingFuse.label)
      setAmp(editingFuse.amp)
      setLocalPos(editingFuse.pos)
      inputRef.current?.focus()
      inputRef.current?.select()
    } else {
      setLabel('')
      setAmp(20)
    }
  }, [editingFuse?.id])

  // when user clicks a slot, jump to it; otherwise default to first free
  useEffect(() => {
    if (!isEdit) {
      setLocalPos(focusPos ?? freeSlots[0] ?? null)
    }
  }, [focusPos])

  useEffect(() => {
    if (!isEdit) inputRef.current?.focus()
  }, [focusPos])

  // keep localPos valid as freeSlots changes (e.g. after an install)
  useEffect(() => {
    if (isEdit) return
    if (localPos === null || !freeSlots.includes(localPos)) {
      setLocalPos(freeSlots[0] ?? null)
    }
  }, [freeSlots])

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault()
    const trimmed = label.trim()
    if (!trimmed) { inputRef.current?.focus(); return }
    if (isEdit) {
      onUpdate(editingFuse!.id, { label: trimmed, amp, pos: localPos ?? editingFuse!.pos })
    } else {
      onAdd({ label: trimmed, amp, pos: localPos })
      setLabel('')
      inputRef.current?.focus()
    }
  }

  const cancel = () => {
    setLabel('')
    setAmp(20)
    onCancel()
  }

  const isFocused = !isEdit && focusPos != null

  const headerMeta = isEdit
    ? <span className="legend-count mono">SLOT {String(editingFuse!.pos).padStart(2, '0')}</span>
    : <span className="legend-count mono">{freeSlots.length} slot{freeSlots.length === 1 ? '' : 's'} free</span>

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
            disabled={readOnly}
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
                disabled={readOnly}
              >
                {r.value === 'GFCI' ? 'GFCI' : `${r.value}A`}
              </button>
            ))}
          </div>
        </div>
        <div className="field">
          <label className="field-label">Slot</label>
          <div className="stepper" role="group" aria-label="Target slot">
            <button
              type="button"
              onClick={() => setLocalPos(activeSlots[slotIndex - 1])}
              disabled={readOnly || slotIndex <= 0}
              aria-label="previous slot"
            >
              <Minus />
            </button>
            <span className="stepper-value">
              {localPos !== null ? String(localPos).padStart(2, '0') : '—'}
            </span>
            <button
              type="button"
              onClick={() => setLocalPos(activeSlots[slotIndex + 1])}
              disabled={readOnly || slotIndex >= activeSlots.length - 1}
              aria-label="next slot"
            >
              <Plus />
            </button>
          </div>
          <span className="field-hint">Empty slots only — use drag and drop to swap</span>
        </div>
        {readOnly && (
          <Notice className="notice--mb">This is the default panel. Create your own to make changes.</Notice>
        )}
        {isEdit ? (
          <div className="form-actions">
            <button type="button" className="btn" onClick={cancel}>Cancel</button>
            <button className="btn btn-primary" type="submit" disabled={readOnly}>Save Changes</button>
          </div>
        ) : (
          <div className="form-actions">
            <button type="button" className="btn" onClick={cancel}>Cancel</button>
            <button className="btn btn-primary" type="submit" disabled={readOnly || localPos === null}>
              <Plus /> Install in Slot {localPos !== null ? String(localPos).padStart(2, '0') : '—'}
            </button>
          </div>
        )}
      </div>
    </form>
  )
}
