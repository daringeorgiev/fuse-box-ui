import { useMemo } from 'react'
import { AMP_RATINGS } from '../constants/amps'
import type { IFuse } from '../interfaces'

export default function Legend({ fuses }: { fuses: IFuse[] }) {
  const counts = useMemo(() => {
    const map: Record<string, number> = {}
    fuses.forEach(f => { map[String(f.amp)] = (map[String(f.amp)] ?? 0) + 1 })
    return map
  }, [fuses])

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">Amperage Legend</span>
      </div>
      <div className="card-body">
        <div className="legend">
          {AMP_RATINGS.map(r => (
            <div className="legend-row" key={String(r.value)}>
              <div className="legend-key">
                <span className="legend-swatch" style={{ background: r.color }} />
                <span className="legend-name">
                  {r.value === 'GFCI' ? 'GFCI 20A' : `${r.value} Amps`}
                </span>
              </div>
              <span className="legend-count">{counts[String(r.value)] ?? 0}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
