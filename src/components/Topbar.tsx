import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import UserMenu from './UserMenu'
import LangToggle from './LangToggle'

export default function Topbar() {
  const { t } = useTranslation()
  return (
    <header className="topbar">
      <Link to="/" className="brand">
        <div className="brand-mark">F</div>
        <span className="brand-name">Fuse Box</span>
        <span className="brand-sub">{t('topbar.brandSub')}</span>
      </Link>
      <LangToggle />
      <UserMenu />
    </header>
  )
}
