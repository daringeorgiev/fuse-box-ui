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

export function nextId(): string {
  return 'f' + Math.random().toString(36).slice(2, 9)
}

export const SEED_FUSES: IFuse[] = [
  { id: 'f1',  pos: 1,  label: 'Ground Floor Lights',   amp: 10 },
  { id: 'f2',  pos: 2,  label: 'Upper Floor Lights',    amp: 10 },
  { id: 'f3',  pos: 3,  label: 'Living Room Sockets',   amp: 16 },
  { id: 'f4',  pos: 4,  label: 'Dining Room Sockets',   amp: 16 },
  { id: 'f5',  pos: 5,  label: 'Kitchen Sockets',       amp: 16 },
  { id: 'f6',  pos: 6,  label: 'Kitchen Appliances',    amp: 16 },
  { id: 'f7',  pos: 7,  label: 'Electric Hob',          amp: 32 },
  { id: 'f8',  pos: 8,  label: 'Built-in Oven',         amp: 16 },
  { id: 'f9',  pos: 9,  label: 'Refrigerator',          amp: 16 },
  { id: 'f10', pos: 10, label: 'Dishwasher',            amp: 'GFCI' },
  { id: 'f11', pos: 11, label: 'Washing Machine',       amp: 16 },
  { id: 'f12', pos: 12, label: 'Tumble Dryer',          amp: 16 },
  { id: 'f13', pos: 13, label: 'Master Bedroom',        amp: 16 },
  { id: 'f14', pos: 14, label: 'Bedroom 2',             amp: 16 },
  { id: 'f15', pos: 15, label: 'Bedroom 3',             amp: 16 },
  { id: 'f16', pos: 16, label: 'Bathroom (RCD)',        amp: 'GFCI' },
  { id: 'f17', pos: 17, label: 'Towel Rail / En-suite', amp: 16 },
  { id: 'f18', pos: 18, label: 'Electric Boiler',       amp: 20 },
  { id: 'f19', pos: 19, label: 'Heat Pump',             amp: 25 },
  { id: 'f20', pos: 20, label: 'Garage',                amp: 16 },
  { id: 'f21', pos: 21, label: 'Outdoor Sockets (RCD)', amp: 'GFCI' },
  { id: 'f22', pos: 22, label: 'Outdoor Lighting',      amp: 10 },
  { id: 'f23', pos: 23, label: 'EV Charger',            amp: 32 },
]
