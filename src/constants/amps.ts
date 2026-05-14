import type { AmpValue, IFuse, IAmpRating } from '../interfaces'

export const AMP_RATINGS: IAmpRating[] = [
  { value: 10,     label: '10A',  color: 'var(--amp-10)',   tone: 'low' },
  { value: 16,     label: '16A',  color: 'var(--amp-16)',   tone: 'low' },
  { value: 20,     label: '20A',  color: 'var(--amp-20)',   tone: 'low' },
  { value: 25,     label: '25A',  color: 'var(--amp-25)',   tone: 'mid' },
  { value: 32,     label: '32A',  color: 'var(--amp-32)',   tone: 'mid' },
  { value: 40,     label: '40A',  color: 'var(--amp-40)',   tone: 'high' },
  { value: 63,     label: '63A',  color: 'var(--amp-63)',   tone: 'high' },
  { value: 'GFCI', label: 'RCD',  color: 'var(--amp-gfci)', tone: 'special', amps: 16 },
]

export const ampMeta = (v: AmpValue): IAmpRating =>
  AMP_RATINGS.find(r => r.value === v) ?? AMP_RATINGS[0]

export function totalLoad(fuses: IFuse[]): number {
  return fuses.reduce((sum, f) => {
    const m = ampMeta(f.amp)
    const a = m.amps ?? (typeof m.value === 'number' ? m.value : 0)
    return sum + a
  }, 0)
}
