import type { IFuse, IDragState } from '../interfaces'
import Slot from './Slot'

interface IPanelGridProps {
  rows: number
  perRow: number
  fuseByPos: Record<number, IFuse>
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

export default function PanelGrid({
  rows, perRow, fuseByPos, selectedId, focusPos, dragState,
  onSelect, onAddHere, onDragOver, onDragLeave, onDrop, onRemove, onDragStart, onDragEnd,
}: IPanelGridProps) {
  const isStandard = perRow === 2
  const rowList: React.ReactElement[] = []

  for (let r = 0; r < rows; r++) {
    const slots: React.ReactElement[] = []
    for (let c = 0; c < perRow; c++) {
      const pos = isStandard ? r * 2 + c + 1 : r * perRow + c + 1
      slots.push(
        <Slot
          key={pos}
          pos={pos}
          fuse={fuseByPos[pos]}
          selectedId={selectedId}
          focusPos={focusPos}
          dragState={dragState}
          onSelect={onSelect}
          onAddHere={onAddHere}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onRemove={onRemove}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
        />
      )
    }
    rowList.push(
      <div className={`fuse-row${isStandard ? ' standard' : ''}`} key={r}>
        <div className="row-label">{String(r + 1).padStart(2, '0')}</div>
        {isStandard ? (
          <>
            <div className="row-slots" style={{ gridTemplateColumns: '1fr' }}>{slots[0]}</div>
            <div className="bus-bar" aria-hidden="true"><span /><span /><span /></div>
            <div className="row-slots" style={{ gridTemplateColumns: '1fr' }}>{slots[1]}</div>
          </>
        ) : (
          <div className="row-slots" style={{ gridTemplateColumns: `repeat(${perRow}, 1fr)` }}>
            {slots}
          </div>
        )}
      </div>
    )
  }

  return <div className="fuse-rows">{rowList}</div>
}
