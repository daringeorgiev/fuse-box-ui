import { useTranslation } from 'react-i18next'
import type { IFuse } from '../interfaces'
import AmpBadge from './AmpBadge'
import { ampMeta } from '../constants/amps'
import { X } from './Icons'

interface FuseCardProps {
  fuse: IFuse
  pos: number
  selected: boolean
  isDragging: boolean
  readOnly?: boolean
  hideRemove?: boolean
  onSelect: (id: string) => void
  onRemove: (id: string) => void
  onDragStart: (e: React.DragEvent<HTMLDivElement>, fuse: IFuse) => void
  onDragEnd: () => void
}

export default function FuseCard({ fuse, pos, selected, isDragging, readOnly, hideRemove, onSelect, onRemove, onDragStart, onDragEnd }: FuseCardProps) {
  const { t } = useTranslation()
  const m = ampMeta(fuse.amp)
  const cardStyle = { '--fuse-color': m.color } as React.CSSProperties

  const classes = [
    'fuse',
    isDragging && 'dragging',
    selected && 'selected',
  ].filter(Boolean).join(' ')

  return (
    <div
      className={classes}
      style={cardStyle}
      draggable={!readOnly}
      onClick={readOnly ? undefined : () => onSelect(fuse.id)}
      onDragStart={readOnly ? undefined : (e) => onDragStart(e, fuse)}
      onDragEnd={readOnly ? undefined : onDragEnd}
      title={readOnly ? fuse.label : t('fuseCard.editHint', { label: fuse.label })}
    >
      <div className="fuse-head">
        <span className="fuse-pos mono">{String(pos).padStart(2, '0')}</span>
        {!hideRemove && (
          <button
            className="fuse-remove"
            onClick={(e) => { e.stopPropagation(); onRemove(fuse.id) }}
            title={t('fuseCard.remove')}
            aria-label={t('fuseCard.remove')}
            disabled={readOnly}
          >
            <X />
          </button>
        )}
      </div>
      <div className="fuse-label">{fuse.label}</div>
      <div className="fuse-foot">
        <AmpBadge amp={fuse.amp} />
      </div>
    </div>
  )
}
