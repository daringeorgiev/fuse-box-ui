import { useState } from 'react'
import type { IFuse, IDragState, AmpValue } from '../interfaces'

type UpdateFn = (data: { id: string; pos: number; label: string; amp: AmpValue }) => void

export function useDragHandlers(fuses: IFuse[], updateMutate: UpdateFn) {
  const [dragState, setDragState] = useState<IDragState>({ draggingId: null, overPos: null })

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, fuse: IFuse) => {
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', fuse.id)
    setDragState({ draggingId: fuse.id, overPos: null })
  }

  const handleDragEnd = () => setDragState({ draggingId: null, overPos: null })

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, pos: number) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragState(prev => prev.overPos === pos ? prev : { ...prev, overPos: pos })
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>, pos: number) => {
    if (e.currentTarget.contains(e.relatedTarget as Node)) return
    setDragState(prev => prev.overPos === pos ? { ...prev, overPos: null } : prev)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, pos: number) => {
    e.preventDefault()
    const id = e.dataTransfer.getData('text/plain')
    if (!id) return
    const src = fuses.find(f => f.id === id)
    if (!src || src.pos === pos) { setDragState({ draggingId: null, overPos: null }); return }

    const target = fuses.find(f => f.pos === pos)
    // If target slot is occupied, swap its position back to the source slot
    if (target) updateMutate({ id: target.id, pos: src.pos, label: target.label, amp: target.amp })
    // Move the dragged fuse to the target slot
    updateMutate({ id: src.id, pos, label: src.label, amp: src.amp })

    setDragState({ draggingId: null, overPos: null })
  }

  return { dragState, handleDragStart, handleDragEnd, handleDragOver, handleDragLeave, handleDrop }
}
