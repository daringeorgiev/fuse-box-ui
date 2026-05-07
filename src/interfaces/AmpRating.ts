import type { AmpValue } from './AmpValue'

export interface IAmpRating {
  value: AmpValue
  label: string
  color: string
  tone: 'low' | 'mid' | 'high' | 'special'
  amps?: number
}
