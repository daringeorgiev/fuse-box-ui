import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { AMP_RATINGS } from '../constants/amps'
import type { IFuse } from '../interfaces'

export default function Legend({ fuses }: { fuses: IFuse[] }) {
  const { t } = useTranslation()
  const counts = useMemo(() => {
    const map: Record<string, number> = {}
    fuses.forEach(f => { map[String(f.amp)] = (map[String(f.amp)] ?? 0) + 1 })
    return map
  }, [fuses])

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">{t('legend.title')}</span>
      </div>
      <div className="card-body">
        <div className="legend">
          {AMP_RATINGS.map(r => (
            <div className={`legend-row${r.value === 'RCD' ? ' legend-row--rcd' : ''}`} key={String(r.value)}>
              <div className="legend-key">
                <span className="legend-swatch" style={{ background: r.color }} />
                <span className="legend-name">
                  {r.value === 'RCD' ? t('legend.rcd') : t('legend.amps', { value: r.value })}
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
