interface MainBreakerProps {
  on: boolean
  onToggle: () => void
  ampRating: number
  voltage: number
}

export default function MainBreaker({ on, onToggle, ampRating, voltage }: MainBreakerProps) {
  return (
    <div className="breaker">
      <div
        className={`breaker-switch ${on ? 'on' : 'off'}`}
        onClick={onToggle}
        role="button"
        tabIndex={0}
        title={on ? 'Click to shut off main' : 'Click to energize main'}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onToggle()}
      />
      <div className="breaker-info">
        <div className="breaker-label">Main Breaker</div>
        <div className="breaker-name">SERVICE DISCONNECT</div>
        <div className="breaker-sub">
          {on ? 'Energized · Panel live' : 'De-energized · All circuits off'}
        </div>
      </div>
      <div className="breaker-amp">
        <span className="breaker-amp-value">{ampRating}</span>
        <span className="breaker-amp-unit">AMPS · {voltage}V</span>
      </div>
    </div>
  )
}
