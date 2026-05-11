import { Link } from 'react-router-dom'
import UserMenu from './UserMenu'

export default function Topbar() {
  return (
    <header className="topbar">
      <Link to="/" className="brand">
        <div className="brand-mark">F</div>
        <span className="brand-name">Fuse Box</span>
        <span className="brand-sub">Panel Configurator</span>
      </Link>
      <UserMenu />
    </header>
  )
}
