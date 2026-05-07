import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getPanels, createPanel, updatePanel, deletePanel } from '../api/panels'
import type { Panel } from '../types'

const PANELS_KEY = ['panels'] as const

export function usePanels() {
  return useQuery({ queryKey: PANELS_KEY, queryFn: getPanels })
}

export function useCreatePanel() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: { name: string; location?: string; numRows: number; fusesPerRow: number }) =>
      createPanel(body),
    onSuccess: () => qc.invalidateQueries({ queryKey: PANELS_KEY }),
  })
}

export function useUpdatePanel() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...body }: Panel) =>
      updatePanel(id, { name: body.name, location: body.location, numRows: body.numRows, fusesPerRow: body.fusesPerRow }),
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
