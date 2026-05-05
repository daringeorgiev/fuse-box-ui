export type AmpValue = number | 'GFCI'

export interface Fuse {
  id: string
  pos: number
  label: string
  amp: AmpValue
  tripped?: boolean
}

export interface Panel {
  id: string
  name: string
  location: string
}

export interface DragState {
  draggingId: string | null
  overPos: number | null
}
