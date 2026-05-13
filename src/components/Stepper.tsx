import { Minus, Plus } from './Icons'

interface StepperProps {
  value: number
  min: number
  max: number
  onChange: (n: number) => void
  ariaLabel: string
  disabled?: boolean
}

export default function Stepper({ value, min, max, onChange, ariaLabel, disabled }: StepperProps) {
  return (
    <div className="stepper" role="group" aria-label={ariaLabel}>
      <button onClick={() => onChange(Math.max(min, value - 1))} disabled={disabled || value <= min} aria-label="decrease">
        <Minus />
      </button>
      <span className="stepper-value">{value}</span>
      <button onClick={() => onChange(Math.min(max, value + 1))} disabled={disabled || value >= max} aria-label="increase">
        <Plus />
      </button>
    </div>
  )
}
