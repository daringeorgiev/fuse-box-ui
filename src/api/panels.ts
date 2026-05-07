import client from './client'
import type { Panel } from '../types'

interface PanelBody {
  name: string
  location?: string
  description?: string
  numRows: number
  fusesPerRow: number
  mainAmp: number
  voltage: number
  frequency: number
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toPanel(r: any): Panel {
  return {
    id: String(r.id),
    name: r.name,
    location: r.location ?? '',
    numRows: r.numRows,
    fusesPerRow: r.fusesPerRow,
    mainAmp: r.mainAmp ?? 200,
    voltage: r.voltage ?? 240,
    frequency: r.frequency ?? 60,
  }
}

export async function getPanels(): Promise<Panel[]> {
  const { data } = await client.get('/api/panels')
  return data.map(toPanel)
}

export async function createPanel(body: PanelBody): Promise<Panel> {
  const { data } = await client.post('/api/panels', body)
  return toPanel(data)
}

export async function updatePanel(id: string, body: PanelBody): Promise<Panel> {
  const { data } = await client.put(`/api/panels/${id}`, body)
  return toPanel(data)
}

export async function deletePanel(id: string): Promise<void> {
  await client.delete(`/api/panels/${id}`)
}
