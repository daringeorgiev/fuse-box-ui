export interface IFuseBoxState {
  selectedPanelId: string | null
  selectPanel: (id: string | null) => void
}
