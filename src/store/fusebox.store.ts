import { create } from 'zustand'

interface FuseBoxState {
  selectedPanelId: string | null
  selectPanel: (id: string | null) => void
}

export const useFuseBoxStore = create<FuseBoxState>((set) => ({
  selectedPanelId: null,
  selectPanel: (id) => set({ selectedPanelId: id }),
}))
