import { useRegisterSW } from 'virtual:pwa-register/react'
import { useTranslation } from 'react-i18next'

export default function ReloadPrompt() {
  const { t } = useTranslation()
  const { needRefresh: [needRefresh, setNeedRefresh], updateServiceWorker } = useRegisterSW()

  if (!needRefresh) return null

  return (
    <div className="reload-prompt" role="status" aria-live="polite">
      <span className="reload-prompt-text">{t('pwa.updateAvailable')}</span>
      <div className="reload-prompt-actions">
        <button
          className="btn btn-primary reload-prompt-btn"
          onClick={() => updateServiceWorker(true)}
        >
          {t('pwa.reload')}
        </button>
        <button
          className="btn btn-ghost reload-prompt-btn"
          onClick={() => setNeedRefresh(false)}
        >
          {t('pwa.dismiss')}
        </button>
      </div>
    </div>
  )
}
