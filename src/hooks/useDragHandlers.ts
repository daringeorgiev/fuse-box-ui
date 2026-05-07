import { useState } from 'react'
import type { IFuse, IDragState } from '../interfaces'

export function useDragHandlers(fuses: IFuse[], reorderMutate: (ids: string[]) => void) {
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

    const swapped = fuses.map(f => {
      const target = fuses.find(x => x.pos === pos)
      if (f.id === src.id) return { ...f, pos }
      if (target && f.id === target.id) return { ...f, pos: src.pos }
      return f
    })

    const orderedIds = [...swapped].sort((a, b) => a.pos - b.pos).map(f => f.id)
    reorderMutate(orderedIds)
    setDragState({ draggingId: null, overPos: null })
  }

  return { dragState, handleDragStart, handleDragEnd, handleDragOver, handleDragLeave, handleDrop }
}
