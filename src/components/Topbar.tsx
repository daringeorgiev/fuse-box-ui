import { Link } from 'react-router-dom'
import UserMenu from './UserMenu'
import LangToggle from './LangToggle'
import Logo from './Logo'

export default function Topbar() {
  return (
    <header className="topbar">
      <Link to="/" className="brand">
        <Logo variant="default" />
      </Link>
      <LangToggle />
      <UserMenu />
    </header>
  )
}
