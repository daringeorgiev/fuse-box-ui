import type { IFuse } from '../interfaces'
import AmpBadge from './AmpBadge'
import { ampMeta } from '../constants/amps'
import { X } from './Icons'

interface FuseCardProps {
  fuse: IFuse
  pos: number
  selected: boolean
  isDragging: boolean
  readOnly?: boolean
  onSelect: (id: string) => void
  onRemove: (id: string) => void
  onDragStart: (e: React.DragEvent<HTMLDivElement>, fuse: IFuse) => void
  onDragEnd: () => void
}

export default function FuseCard({ fuse, pos, selected, isDragging, readOnly, onSelect, onRemove, onDragStart, onDragEnd }: FuseCardProps) {
  const m = ampMeta(fuse.amp)
  const cardStyle = { '--fuse-color': m.color } as React.CSSProperties

  const classes = [
    'fuse',
    isDragging && 'dragging',
    selected && 'selected',
  ].filter(Boolean).join(' ')

  return (
    <div
      className={classes}
      style={cardStyle}
      draggable={!readOnly}
      onClick={readOnly ? undefined : () => onSelect(fuse.id)}
      onDragStart={readOnly ? undefined : (e) => onDragStart(e, fuse)}
      onDragEnd={readOnly ? undefined : onDragEnd}
      title={readOnly ? fuse.label : `${fuse.label} — click to edit, drag to move`}
    >
      <div className="fuse-head">
        <span className="fuse-pos mono">{String(pos).padStart(2, '0')}</span>
        <button
          className="fuse-remove"
          onClick={(e) => { e.stopPropagation(); onRemove(fuse.id) }}
          title="Remove fuse"
          aria-label="Remove"
          disabled={readOnly}
        >
          <X />
        </button>
      </div>
      <div className="fuse-label">{fuse.label}</div>
      <div className="fuse-foot">
        <AmpBadge amp={fuse.amp} />
      </div>
    </div>
  )
}
