import type { IFuse, IPanel } from '../interfaces'
import { ampMeta } from '../constants/amps'
import AmpBadge from './AmpBadge'

interface IPrintViewProps {
  panel: IPanel
  fuses: IFuse[]
  rows: number
  perRow: number
}

function PrintSlot({ pos, fuse }: { pos: number; fuse: IFuse | undefined }) {
  const posLabel = String(pos).padStart(2, '0')

  if (!fuse) {
    return (
      <div className="print-slot print-slot--empty">
        <span className="print-slot-pos">{posLabel}</span>
      </div>
    )
  }

  const color = ampMeta(fuse.amp).color

  return (
    <div
      className="print-slot print-slot--filled"
      style={{ '--fuse-color': color } as React.CSSProperties}
    >
      <span className="print-slot-pos">{posLabel}</span>
      <span className="print-slot-label">{fuse.label}</span>
      <AmpBadge amp={fuse.amp} />
    </div>
  )
}

export default function PrintView({ panel, fuses, rows, perRow }: IPrintViewProps) {
  const fuseByPos: Record<number, IFuse> = {}
  fuses.forEach(f => { fuseByPos[f.pos] = f })

  const isStandard = perRow === 2
  const today = new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <div className="print-view">
      <div className="print-brand">
        <div className="print-brand-mark">F</div>
        <span className="print-brand-name">Fuse Box</span>
      </div>

      <div className="print-header">
        <div className="print-header-main">
          <h1 className="print-panel-name">{panel.name}</h1>
          {panel.location && <span className="print-panel-location">{panel.location}</span>}
        </div>
        <div className="print-header-meta">
          <span className="print-meta-item">Main: {panel.mainAmp}A</span>
          <span className="print-meta-item">{panel.voltage}V / {panel.frequency}Hz</span>
          <span className="print-meta-item">{today}</span>
        </div>
      </div>

      <div className="print-grid">
        {Array.from({ length: rows }, (_, r) => {
          const rowNum = String(r + 1).padStart(2, '0')

          if (isStandard) {
            const leftPos = r * 2 + 1
            const rightPos = r * 2 + 2
            return (
              <div key={r} className="print-row print-row--standard">
                <span className="print-row-label">{rowNum}</span>
                <PrintSlot pos={leftPos} fuse={fuseByPos[leftPos]} />
                <div className="print-bus-bar" />
                <PrintSlot pos={rightPos} fuse={fuseByPos[rightPos]} />
              </div>
            )
          }

          return (
            <div key={r} className="print-row print-row--custom">
              <span className="print-row-label">{rowNum}</span>
              <div
                className="print-slots-row"
                style={{ gridTemplateColumns: `repeat(${perRow}, 1fr)` }}
              >
                {Array.from({ length: perRow }, (_, c) => {
                  const pos = r * perRow + c + 1
                  return <PrintSlot key={c} pos={pos} fuse={fuseByPos[pos]} />
                })}
              </div>
            </div>
          )
        })}
      </div>

    </div>
  )
}
