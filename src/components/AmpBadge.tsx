import { ampMeta } from '../constants/amps'
import type { AmpValue } from '../types'

export default function AmpBadge({ amp }: { amp: AmpValue }) {
  const m = ampMeta(amp)
  const style = {
    '--badge-bg': `color-mix(in oklch, ${m.color} 18%, transparent)`,
    '--badge-fg': `color-mix(in oklch, ${m.color} 100%, #1A1916 35%)`,
    '--badge-border': `color-mix(in oklch, ${m.color} 40%, transparent)`,
  } as React.CSSProperties

  if (m.value === 'GFCI') {
    return <span className="amp-badge mono" style={style}>GFCI</span>
  }
  return (
    <span className="amp-badge mono" style={style}>
      {m.value}<span className="unit">A</span>
    </span>
  )
}
