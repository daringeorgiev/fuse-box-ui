import { create } from 'zustand'
import type { IFuseBoxState } from '../interfaces'

export const useFuseBoxStore = create<IFuseBoxState>((set) => ({
  selectedPanelId: null,
  selectPanel: (id) => set({ selectedPanelId: id }),
}))
