import { create } from 'zustand'
import type { Fuse, Panel } from '../types'

interface FuseBoxState {
  panels: Panel[]
  selectedPanelId: string | null
  setPanels: (panels: Panel[]) => void
  selectPanel: (id: string | null) => void
}

export const useFuseBoxStore = create<FuseBoxState>((set) => ({
  panels: [],
  selectedPanelId: null,
  setPanels: (panels) => set({ panels }),
  selectPanel: (id) => set({ selectedPanelId: id }),
}))
