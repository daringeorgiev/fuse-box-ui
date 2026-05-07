import type { AmpValue, IFuse, IAmpRating } from '../interfaces'

export const AMP_RATINGS: IAmpRating[] = [
  { value: 15,     label: '15A',  color: 'var(--amp-15)',   tone: 'low' },
  { value: 20,     label: '20A',  color: 'var(--amp-20)',   tone: 'low' },
  { value: 30,     label: '30A',  color: 'var(--amp-30)',   tone: 'mid' },
  { value: 40,     label: '40A',  color: 'var(--amp-40)',   tone: 'mid' },
  { value: 50,     label: '50A',  color: 'var(--amp-50)',   tone: 'high' },
  { value: 60,     label: '60A',  color: 'var(--amp-60)',   tone: 'high' },
  { value: 'GFCI', label: 'GFCI', color: 'var(--amp-gfci)', tone: 'special', amps: 20 },
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

export function nextId(): string {
  return 'f' + Math.random().toString(36).slice(2, 9)
}

export const SEED_FUSES: IFuse[] = [
  { id: 'f1',  pos: 1,  label: 'Kitchen Outlets',     amp: 20 },
  { id: 'f2',  pos: 2,  label: 'Refrigerator',        amp: 20 },
  { id: 'f3',  pos: 3,  label: 'Dishwasher',          amp: 'GFCI' },
  { id: 'f4',  pos: 4,  label: 'Microwave',           amp: 20 },
  { id: 'f5',  pos: 5,  label: 'Living Room Lights',  amp: 15 },
  { id: 'f6',  pos: 6,  label: 'Living Room Outlets', amp: 15 },
  { id: 'f7',  pos: 7,  label: 'Dining Room',         amp: 15 },
  { id: 'f8',  pos: 8,  label: 'Hallway / Stairs',    amp: 15 },
  { id: 'f9',  pos: 9,  label: 'Master Bedroom',      amp: 15 },
  { id: 'f10', pos: 10, label: 'Bedroom 2',           amp: 15 },
  { id: 'f11', pos: 11, label: 'Bedroom 3',           amp: 15 },
  { id: 'f12', pos: 12, label: 'Master Bathroom',     amp: 'GFCI' },
  { id: 'f13', pos: 13, label: 'Hall Bathroom',       amp: 'GFCI' },
  { id: 'f14', pos: 14, label: 'HVAC Air Handler',    amp: 30 },
  { id: 'f15', pos: 15, label: 'A/C Condenser',       amp: 40 },
  { id: 'f16', pos: 16, label: 'Electric Dryer',      amp: 30 },
  { id: 'f17', pos: 17, label: 'Electric Range',      amp: 50 },
  { id: 'f18', pos: 18, label: 'Water Heater',        amp: 30 },
  { id: 'f19', pos: 19, label: 'Garage Outlets',      amp: 'GFCI' },
  { id: 'f20', pos: 20, label: 'Garage Door Opener',  amp: 15 },
  { id: 'f21', pos: 21, label: 'EV Charger',          amp: 60 },
  { id: 'f22', pos: 22, label: 'Pool Pump',           amp: 20 },
  { id: 'f23', pos: 23, label: 'Exterior Lights',     amp: 15 },
]
