import { useTranslation } from 'react-i18next'

export default function LangToggle() {
  const { i18n } = useTranslation()
  const current = i18n.language.startsWith('bg') ? 'bg' : 'en'

  return (
    <div className="lang-toggle">
      <button
        className={`lang-btn${current === 'en' ? ' lang-btn--active' : ''}`}
        onClick={() => i18n.changeLanguage('en')}
        aria-pressed={current === 'en'}
      >
        EN
      </button>
      <button
        className={`lang-btn${current === 'bg' ? ' lang-btn--active' : ''}`}
        onClick={() => i18n.changeLanguage('bg')}
        aria-pressed={current === 'bg'}
      >
        BG
      </button>
    </div>
  )
}
