import type { IFuse, IDragState, AmpValue } from '../interfaces'
import Slot from './Slot'
import FuseCard from './FuseCard'

interface IPanelGridProps {
  rows: number
  perRow: number
  fuseByPos: Record<number, IFuse>
  selectedId: string | null
  focusPos: number | null
  dragState: IDragState
  readOnly?: boolean
  mainAmp: number
  mainBreakerLabel: string
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
  rows, perRow, fuseByPos, selectedId, focusPos, dragState, readOnly,
  mainAmp, mainBreakerLabel,
  onSelect, onAddHere, onDragOver, onDragLeave, onDrop, onRemove, onDragStart, onDragEnd,
}: IPanelGridProps) {
  const isStandard = perRow === 2

  const mainFuse: IFuse = { id: 'main', pos: 0, label: mainBreakerLabel, amp: mainAmp as AmpValue }
  const mainBreakerSlot = (
    <div className="slot" key="mb">
      <FuseCard
        fuse={mainFuse}
        pos={0}
        selected={false}
        isDragging={false}
        readOnly={true}
        hideRemove={true}
        onSelect={() => {}}
        onRemove={() => {}}
        onDragStart={() => {}}
        onDragEnd={() => {}}
      />
    </div>
  )

  const rowList: React.ReactElement[] = []

  for (let r = 0; r < rows; r++) {
    const slots: React.ReactElement[] = []
    // Row 0 has one fewer regular slot to make room for the main breaker
    const slotsInRow = r === 0 ? perRow - 1 : perRow

    for (let c = 0; c < slotsInRow; c++) {
      // Row 0: positions 1…perRow-1; rows 1+: positions r*perRow…
      const pos = r === 0 ? c + 1 : r * perRow + c
      slots.push(
        <Slot
          key={pos}
          pos={pos}
          fuse={fuseByPos[pos]}
          selectedId={selectedId}
          focusPos={focusPos}
          dragState={dragState}
          readOnly={readOnly}
          hideRemove={readOnly}
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
            <div className="row-slots" style={{ gridTemplateColumns: '1fr' }}>
              {r === 0 ? mainBreakerSlot : slots[0]}
            </div>
            <div className="bus-bar" aria-hidden="true"><span /><span /><span /></div>
            <div className="row-slots" style={{ gridTemplateColumns: '1fr' }}>
              {r === 0 ? slots[0] : slots[1]}
            </div>
          </>
        ) : (
          <div className="row-slots" style={{ gridTemplateColumns: `repeat(${perRow}, 1fr)` }}>
            {r === 0 && mainBreakerSlot}
            {slots}
          </div>
        )}
      </div>
    )
  }

  return <div className="fuse-rows">{rowList}</div>
}
