import { useTranslation } from 'react-i18next'
import { totalLoad } from '../constants/amps'
import type { IFuse } from '../interfaces'

interface StatsCardProps {
  fuses: IFuse[]
  capacity: number
  mainAmp: number
}

export default function StatsCard({ fuses, capacity, mainAmp }: StatsCardProps) {
  const { t } = useTranslation()
  const installed = fuses.length
  const load = totalLoad(fuses)
  const spare = mainAmp - load
  const utilization = Math.round((load / mainAmp) * 100)
  const utilClass = utilization > 90 ? ' warn' : ''

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">{t('statsCard.title')}</span>
      </div>
      <div className="card-body" style={{ padding: 0 }}>
        <div className="stats">
          <div className="stat">
            <span className="stat-label">{t('statsCard.installed')}</span>
            <span className="stat-value">
              {installed}
              <span style={{ fontSize: 12, color: 'var(--ink-3)', fontWeight: 500 }}> / {capacity}</span>
            </span>
          </div>
          <div className="stat">
            <span className="stat-label">{t('statsCard.totalLoad')}</span>
            <span className="stat-value">
              {load}
              <span style={{ fontSize: 11, color: 'var(--ink-3)' }}>A</span>
            </span>
          </div>
          <div className="stat">
            <span className="stat-label">{t('statsCard.spareCapacity')}</span>
            <span className={`stat-value${spare < 20 ? ' warn' : ''}`}>
              {spare}<span style={{ fontSize: 11, color: 'var(--ink-3)' }}>A</span>
            </span>
          </div>
          <div className="stat">
            <span className="stat-label">{t('statsCard.utilization')}</span>
            <span className={`stat-value${utilClass}`}>
              {utilization}
              <span style={{ fontSize: 11, color: 'var(--ink-3)' }}>%</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
