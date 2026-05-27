import { useTranslation } from 'react-i18next'
import { GitHub } from './Icons'

export default function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="app-footer">
      <span className="app-footer-built">
        {t('footer.builtBy')}{' '}
        <a
          className="app-footer-link"
          href="https://daringeorgiev.github.io/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Darin Georgiev – personal site"
        >
          Darin Georgiev
        </a>
      </span>

      <span className="app-footer-sep" aria-hidden="true">·</span>

      <a
        className="app-footer-link app-footer-repo"
        href="https://github.com/daringeorgiev/fuse-box-ui"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="FuseBox UI source code on GitHub"
      >
        <GitHub aria-hidden="true" />
        UI
      </a>

      <a
        className="app-footer-link app-footer-repo"
        href="https://github.com/daringeorgiev/fuse-box-api"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="FuseBox API source code on GitHub"
      >
        <GitHub aria-hidden="true" />
        API
      </a>
    </footer>
  )
}
