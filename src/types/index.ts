export type AmpValue = number | 'GFCI'

export interface Fuse {
  id: string
  pos: number
  label: string
  amp: AmpValue
}

export interface Panel {
  id: string
  name: string
  location: string
  numRows: number
  fusesPerRow: number
  mainAmp: number
  voltage: number
  frequency: number
}

export interface DragState {
  draggingId: string | null
  overPos: number | null
}
