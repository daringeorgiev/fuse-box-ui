import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getFuses, createFuse, updateFuse, deleteFuse, reorderFuses } from '../api/fuses'
import type { AmpValue } from '../types'

function fusesKey(panelId: string) {
  return ['fuses', panelId] as const
}

export function useFuses(panelId: string | null) {
  return useQuery({
    queryKey: fusesKey(panelId ?? ''),
    queryFn: () => getFuses(panelId!),
    enabled: !!panelId,
  })
}

export function useCreateFuse(panelId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (fuse: { pos: number; label: string; amp: AmpValue }) =>
      createFuse(panelId, fuse),
    onSuccess: () => qc.invalidateQueries({ queryKey: fusesKey(panelId) }),
  })
}

export function useUpdateFuse(panelId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...fuse }: { id: string; pos: number; label: string; amp: AmpValue }) =>
      updateFuse(panelId, id, fuse),
    onSuccess: () => qc.invalidateQueries({ queryKey: fusesKey(panelId) }),
  })
}

export function useDeleteFuse(panelId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (fuseId: string) => deleteFuse(panelId, fuseId),
    onSuccess: () => qc.invalidateQueries({ queryKey: fusesKey(panelId) }),
  })
}

export function useReorderFuses(panelId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (orderedIds: string[]) => reorderFuses(panelId, orderedIds),
    onSuccess: () => qc.invalidateQueries({ queryKey: fusesKey(panelId) }),
  })
}
