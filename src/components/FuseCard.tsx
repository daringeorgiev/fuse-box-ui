import type { Fuse } from '../types'
import AmpBadge from './AmpBadge'
import { ampMeta } from '../constants/amps'
import { X } from './Icons'

interface FuseCardProps {
  fuse: Fuse
  pos: number
  selected: boolean
  isDragging: boolean
  onSelect: (id: string) => void
  onRemove: (id: string) => void
  onDragStart: (e: React.DragEvent<HTMLDivElement>, fuse: Fuse) => void
  onDragEnd: () => void
}

export default function FuseCard({ fuse, pos, selected, isDragging, onSelect, onRemove, onDragStart, onDragEnd }: FuseCardProps) {
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
      draggable
      onClick={() => onSelect(fuse.id)}
      onDragStart={(e) => onDragStart(e, fuse)}
      onDragEnd={onDragEnd}
      title={`${fuse.label} — click to edit, drag to move`}
    >
      <div className="fuse-head">
        <span className="fuse-pos mono">{String(pos).padStart(2, '0')}</span>
        <button
          className="fuse-remove"
          onClick={(e) => { e.stopPropagation(); onRemove(fuse.id) }}
          title="Remove fuse"
          aria-label="Remove"
        >
          <X />
        </button>
      </div>
      <div className="fuse-label">{fuse.label}</div>
      <div className="fuse-foot">
        <AmpBadge amp={fuse.amp} />
        <span className="fuse-state">ON</span>
      </div>
    </div>
  )
}
