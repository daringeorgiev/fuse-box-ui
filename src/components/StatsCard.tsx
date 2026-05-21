import { useTranslation } from 'react-i18next'

import type { IFuse } from '../interfaces'

interface StatsCardProps {
  fuses: IFuse[]
  capacity: number
  mainAmp: number
}

export default function StatsCard({ fuses, capacity, mainAmp }: StatsCardProps) {
  const { t } = useTranslation()
  const installed = fuses.length
  const free = capacity - installed
  const utilization = capacity > 0 ? Math.round((installed / capacity) * 100) : 0
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
            <span className="stat-label">{t('statsCard.freeSlots')}</span>
            <span className={`stat-value${free === 0 ? ' warn' : ''}`}>
              {free}
            </span>
          </div>
          <div className="stat">
            <span className="stat-label">{t('statsCard.mainBreaker')}</span>
            <span className="stat-value">
              {mainAmp}<span style={{ fontSize: 11, color: 'var(--ink-3)' }}>A</span>
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
