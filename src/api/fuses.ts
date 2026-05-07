import client from './client'
import type { IFuse, AmpValue } from '../interfaces'

// GFCI has no numeric amperage in the BE schema; encode it as amperage=20 + description='GFCI'.
const GFCI_DESCRIPTION = 'GFCI'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toFuse(r: any): IFuse {
  return {
    id: String(r.id),
    pos: r.position,
    label: r.label,
    amp: r.description === GFCI_DESCRIPTION ? 'GFCI' : (r.amperage as AmpValue),
  }
}

function ampToBody(amp: AmpValue): { amperage: number; description?: string } {
  if (amp === 'GFCI') return { amperage: 20, description: GFCI_DESCRIPTION }
  return { amperage: amp as number }
}

export async function getFuses(panelId: string): Promise<IFuse[]> {
  const { data } = await client.get(`/api/panels/${panelId}/fuses`)
  return data.map(toFuse)
}

export async function createFuse(
  panelId: string,
  fuse: { pos: number; label: string; amp: AmpValue }
): Promise<IFuse> {
  const { data } = await client.post(`/api/panels/${panelId}/fuses`, {
    position: fuse.pos,
    label: fuse.label,
    ...ampToBody(fuse.amp),
  })
  return toFuse(data)
}

export async function updateFuse(
  panelId: string,
  fuseId: string,
  fuse: { pos: number; label: string; amp: AmpValue }
): Promise<IFuse> {
  const { data } = await client.put(`/api/panels/${panelId}/fuses/${fuseId}`, {
    position: fuse.pos,
    label: fuse.label,
    ...ampToBody(fuse.amp),
  })
  return toFuse(data)
}

export async function deleteFuse(panelId: string, fuseId: string): Promise<void> {
  await client.delete(`/api/panels/${panelId}/fuses/${fuseId}`)
}

export async function reorderFuses(panelId: string, orderedIds: string[]): Promise<void> {
  await client.put(`/api/panels/${panelId}/fuses/reorder`, { orderedIds })
}
