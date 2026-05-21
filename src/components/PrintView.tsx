import { useTranslation } from 'react-i18next'
import type { IFuse, IPanel } from '../interfaces'
import { ampMeta } from '../constants/amps'
import AmpBadge from './AmpBadge'
import Logo from './Logo'

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
  const { t, i18n } = useTranslation()
  const fuseByPos: Record<number, IFuse> = {}
  fuses.forEach(f => { fuseByPos[f.pos] = f })

  const isStandard = perRow === 2
  const today = new Date().toLocaleDateString(i18n.language, { year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <div className="print-view">
      <div className="print-brand">
        <Logo variant="compact" />
      </div>

      <div className="print-header">
        <div className="print-header-main">
          <h1 className="print-panel-name">{panel.name}</h1>
          {panel.location && <span className="print-panel-location">{panel.location}</span>}
        </div>
        <div className="print-header-meta">
          <span className="print-meta-item">{t('printView.main', { amp: panel.mainAmp })}</span>
          <span className="print-meta-item">{panel.voltage}V / {panel.frequency}Hz</span>
          <span className="print-meta-item">{today}</span>
        </div>
      </div>

      <div className="print-grid">
        {Array.from({ length: rows }, (_, r) => {
          const rowNum = String(r + 1).padStart(2, '0')
          const mainFuse: IFuse = { id: 'main', pos: 0, label: t('mainBreaker.label'), amp: panel.mainAmp as IFuse['amp'] }

          if (isStandard) {
            const leftPos = r === 0 ? 0 : r * 2
            const rightPos = r === 0 ? 1 : r * 2 + 1
            return (
              <div key={r} className="print-row print-row--standard">
                <span className="print-row-label">{rowNum}</span>
                <PrintSlot pos={leftPos} fuse={r === 0 ? mainFuse : fuseByPos[leftPos]} />
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
                {r === 0 && <PrintSlot key="mb" pos={0} fuse={mainFuse} />}
                {Array.from({ length: r === 0 ? perRow - 1 : perRow }, (_, c) => {
                  const pos = r === 0 ? c + 1 : r * perRow + c
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
