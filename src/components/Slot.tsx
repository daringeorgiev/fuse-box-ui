import type { IFuse, IDragState } from '../interfaces'
import FuseCard from './FuseCard'
import { Plus } from './Icons'

interface SlotProps {
  pos: number
  fuse: IFuse | undefined
  selectedId: string | null
  focusPos: number | null
  dragState: IDragState
  onSelect: (id: string) => void
  onAddHere: (pos: number) => void
  onDragOver: (e: React.DragEvent<HTMLDivElement>, pos: number) => void
  onDragLeave: (e: React.DragEvent<HTMLDivElement>, pos: number) => void
  onDrop: (e: React.DragEvent<HTMLDivElement>, pos: number) => void
  onRemove: (id: string) => void
  onDragStart: (e: React.DragEvent<HTMLDivElement>, fuse: IFuse) => void
  onDragEnd: () => void
}

export default function Slot({ pos, fuse, selectedId, focusPos, dragState, onSelect, onAddHere, onDragOver, onDragLeave, onDrop, onRemove, onDragStart, onDragEnd }: SlotProps) {
  const isTarget = dragState.overPos === pos && dragState.draggingId !== fuse?.id
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
      onDragOver={(e) => onDragOver(e, pos)}
      onDragLeave={(e) => onDragLeave(e, pos)}
      onDrop={(e) => onDrop(e, pos)}
    >
      {fuse ? (
        <FuseCard
          fuse={fuse}
          pos={pos}
          selected={selectedId === fuse.id}
          isDragging={dragState.draggingId === fuse.id}
          onSelect={onSelect}
          onRemove={onRemove}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
        />
      ) : (
        <button
          type="button"
          className="slot-empty-btn"
          onClick={() => onAddHere(pos)}
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
