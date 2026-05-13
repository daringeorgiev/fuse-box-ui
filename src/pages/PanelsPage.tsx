import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { usePanels } from '../hooks/usePanels'
import Topbar from '../components/Topbar'

export default function PanelsPage() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { data: panels = [], isLoading } = usePanels()

  return (
    <div className="app">
      <Topbar />
      <main className="main panels-page">
        <div className="page-header">
          <h1 className="page-title">{t('panelsPage.title')}</h1>
          <button className="btn" onClick={() => navigate('/panels/new')}>{t('panelsPage.newPanel')}</button>
        </div>

        <div className="card">

          {isLoading && (
            <div className="panels-list-empty">{t('panelsPage.loading')}</div>
          )}

          {!isLoading && panels.length === 0 && (
            <div className="panels-list-empty">{t('panelsPage.empty')}</div>
          )}

          {!isLoading && panels.length > 0 && (
            <div className="panels-list">
              {panels.map(p => (
                <div key={p.id} className="panels-list-item">
                  <div className="panels-list-item-info">
                    <span className="panels-list-item-name">{p.name}</span>
                    {p.location && (
                      <>
                        <span className="panels-list-item-sep">·</span>
                        <span className="panels-list-item-loc">{p.location}</span>
                      </>
                    )}
                  </div>
                  <div className="panels-list-item-actions">
                    <button
                      className="btn btn-ghost"
                      onClick={() => navigate(`/?panel=${p.id}`)}
                    >
                      {t('panelsPage.view')}
                    </button>
                    <button
                      className="btn btn-ghost"
                      onClick={() => navigate(`/panels/${p.id}/edit`)}
                    >
                      {t('panelsPage.edit')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
