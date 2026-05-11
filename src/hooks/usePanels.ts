import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getPanels, createPanel, updatePanel, deletePanel } from '../api/panels'
import { createFuse } from '../api/fuses'
import type { IPanel, IFuse } from '../interfaces'

const PANELS_KEY = ['panels'] as const

export function usePanels(enabled = true) {
  return useQuery({ queryKey: PANELS_KEY, queryFn: getPanels, enabled })
}

export function useCreatePanel() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: { name: string; location?: string; numRows: number; fusesPerRow: number; mainAmp: number; voltage: number; frequency: number }) =>
      createPanel(body),
    onSuccess: () => qc.invalidateQueries({ queryKey: PANELS_KEY }),
  })
}

export function useUpdatePanel() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...body }: IPanel) =>
      updatePanel(id, { name: body.name, location: body.location, numRows: body.numRows, fusesPerRow: body.fusesPerRow, mainAmp: body.mainAmp, voltage: body.voltage, frequency: body.frequency }),
    onSuccess: () => qc.invalidateQueries({ queryKey: PANELS_KEY }),
  })
}

export function useDeletePanel() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deletePanel(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: PANELS_KEY }),
  })
}

export function useCopyPanel() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ panel, fuses }: { panel: IPanel; fuses: IFuse[] }): Promise<IPanel> => {
      const copy = await createPanel({
        name: `Copy of ${panel.name}`,
        location: panel.location,
        numRows: panel.numRows,
        fusesPerRow: panel.fusesPerRow,
        mainAmp: panel.mainAmp,
        voltage: panel.voltage,
        frequency: panel.frequency,
      })
      await Promise.all(fuses.map(f => createFuse(copy.id, { pos: f.pos, label: f.label, amp: f.amp })))
      return copy
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: PANELS_KEY }),
  })
}
