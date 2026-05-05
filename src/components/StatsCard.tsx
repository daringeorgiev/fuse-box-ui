import { totalLoad } from '../constants/amps'
import type { Fuse } from '../types'

interface StatsCardProps {
  fuses: Fuse[]
  capacity: number
  mainAmp: number
}

export default function StatsCard({ fuses, capacity, mainAmp }: StatsCardProps) {
  const installed = fuses.length
  const load = totalLoad(fuses)
  const tripped = fuses.filter(f => f.tripped).length
  const utilization = Math.round((load / mainAmp) * 100)
  const utilClass = utilization > 90 ? 'warn' : utilization > 60 ? '' : 'ok'

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">Panel Status</span>
      </div>
      <div className="card-body" style={{ padding: 0 }}>
        <div className="stats">
          <div className="stat">
            <span className="stat-label">Installed</span>
            <span className="stat-value">
              {installed}
              <span style={{ fontSize: 12, color: 'var(--ink-3)', fontWeight: 500 }}> / {capacity}</span>
            </span>
          </div>
          <div className="stat">
            <span className="stat-label">Tripped</span>
            <span className={`stat-value ${tripped ? 'warn' : 'ok'}`}>{tripped}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Total Load</span>
            <span className="stat-value">
              {load}
              <span style={{ fontSize: 11, color: 'var(--ink-3)' }}>A</span>
            </span>
          </div>
          <div className="stat">
            <span className="stat-label">Utilization</span>
            <span className={`stat-value ${utilClass}`}>
              {utilization}
              <span style={{ fontSize: 11, color: 'var(--ink-3)' }}>%</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
