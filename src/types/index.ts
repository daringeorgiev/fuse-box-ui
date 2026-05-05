export interface Fuse {
  id: string
  label: string
  amperage: number
  status: 'ok' | 'blown' | 'unknown'
  panelId: string
}

export interface Panel {
  id: string
  name: string
  location: string
  fuses: Fuse[]
}
