import { useNavigate } from 'react-router-dom'
import { usePanels } from '../hooks/usePanels'
import Topbar from '../components/Topbar'

export default function PanelsPage() {
  const navigate = useNavigate()
  const { data: panels = [], isLoading } = usePanels()

  return (
    <div className="app">
      <Topbar />
      <main className="main panels-page">
        <div className="page-header">
          <h1 className="page-title">My Panels</h1>
          <button className="btn" onClick={() => navigate('/panels/new')}>+ New Panel</button>
        </div>

        <div className="card">

          {isLoading && (
            <div className="panels-list-empty">Loading…</div>
          )}

          {!isLoading && panels.length === 0 && (
            <div className="panels-list-empty">No panels yet. Create your first one.</div>
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
                      View
                    </button>
                    <button
                      className="btn btn-ghost"
                      onClick={() => navigate(`/panels/${p.id}/edit`)}
                    >
                      Edit
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
