import client from './client'
import type { IPanel, IPanelBody } from '../interfaces'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toPanel(r: any): IPanel {
  return {
    id: String(r.id),
    name: r.name,
    location: r.location ?? '',
    numRows: r.numRows,
    fusesPerRow: r.fusesPerRow,
    mainAmp: r.mainAmp ?? 200,
    voltage: r.voltage ?? 240,
    frequency: r.frequency ?? 60,
    isDefault: r.isDefault ?? false,
  }
}

export async function getPanels(): Promise<IPanel[]> {
  const { data } = await client.get('/api/panels')
  return data.map(toPanel)
}

export async function createPanel(body: IPanelBody): Promise<IPanel> {
  const { data } = await client.post('/api/panels', body)
  return toPanel(data)
}

export async function updatePanel(id: string, body: IPanelBody): Promise<IPanel> {
  const { data } = await client.put(`/api/panels/${id}`, body)
  return toPanel(data)
}

export async function deletePanel(id: string): Promise<void> {
  await client.delete(`/api/panels/${id}`)
}
