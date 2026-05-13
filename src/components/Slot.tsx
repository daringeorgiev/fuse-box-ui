import type { IFuse, IDragState } from '../interfaces'
import FuseCard from './FuseCard'
import { Plus } from './Icons'

interface SlotProps {
  pos: number
  fuse: IFuse | undefined
  selectedId: string | null
  focusPos: number | null
  dragState: IDragState
  readOnly?: boolean
  onSelect: (id: string) => void
  onAddHere: (pos: number) => void
  onDragOver: (e: React.DragEvent<HTMLDivElement>, pos: number) => void
  onDragLeave: (e: React.DragEvent<HTMLDivElement>, pos: number) => void
  onDrop: (e: React.DragEvent<HTMLDivElement>, pos: number) => void
  onRemove: (id: string) => void
  onDragStart: (e: React.DragEvent<HTMLDivElement>, fuse: IFuse) => void
  onDragEnd: () => void
}

export default function Slot({ pos, fuse, selectedId, focusPos, dragState, readOnly, onSelect, onAddHere, onDragOver, onDragLeave, onDrop, onRemove, onDragStart, onDragEnd }: SlotProps) {
  const isTarget = !readOnly && dragState.overPos === pos && dragState.draggingId !== fuse?.id
  const isSwap = isTarget && !!fuse
  const isFocused = !fuse && focusPos === pos

  const classes = [
    'slot',
    !fuse && 'empty',
    isTarget && 'drop-target',
    isSwap && 'swap-target',
    isFocused && 'slot-focused',
  ].filter(Boolean).join(' ')

  return (
    <div
      className={classes}
      onDragOver={readOnly ? undefined : (e) => onDragOver(e, pos)}
      onDragLeave={readOnly ? undefined : (e) => onDragLeave(e, pos)}
      onDrop={readOnly ? undefined : (e) => onDrop(e, pos)}
    >
      {fuse ? (
        <FuseCard
          fuse={fuse}
          pos={pos}
          selected={selectedId === fuse.id}
          isDragging={dragState.draggingId === fuse.id}
          readOnly={readOnly}
          onSelect={onSelect}
          onRemove={onRemove}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
        />
      ) : (
        <button
          type="button"
          className="slot-empty-btn"
          onClick={readOnly ? undefined : () => onAddHere(pos)}
          disabled={readOnly}
          title={`Install fuse in slot ${String(pos).padStart(2, '0')}`}
        >
          <span className="slot-pos mono">{String(pos).padStart(2, '0')}</span>
          <span className="slot-add-icon" aria-hidden="true"><Plus /></span>
          <span className="slot-add-label">Install</span>
        </button>
      )}
    </div>
  )
}
