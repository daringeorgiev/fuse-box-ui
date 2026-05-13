import { useTranslation } from 'react-i18next'

interface MainBreakerProps {
  on: boolean
  onToggle: () => void
  ampRating: number
  voltage: number
}

export default function MainBreaker({ on, onToggle, ampRating, voltage }: MainBreakerProps) {
  const { t } = useTranslation()
  return (
    <div className="breaker">
      <div
        className={`breaker-switch ${on ? 'on' : 'off'}`}
        onClick={onToggle}
        role="button"
        tabIndex={0}
        title={on ? t('mainBreaker.titleOn') : t('mainBreaker.titleOff')}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onToggle()}
      />
      <div className="breaker-info">
        <div className="breaker-label">{t('mainBreaker.label')}</div>
        <div className="breaker-name">{t('mainBreaker.name')}</div>
        <div className="breaker-sub">
          {on ? t('mainBreaker.energized') : t('mainBreaker.deEnergized')}
        </div>
      </div>
      <div className="breaker-amp">
        <span className="breaker-amp-value">{ampRating}</span>
        <span className="breaker-amp-unit">AMPS · {voltage}V</span>
      </div>
    </div>
  )
}
