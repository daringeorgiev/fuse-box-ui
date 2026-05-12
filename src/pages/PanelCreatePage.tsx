import { useNavigate } from 'react-router-dom'
import { useCreatePanel } from '../hooks/usePanels'
import type { IPanelFormValues } from '../interfaces'
import Topbar from '../components/Topbar'
import PanelForm from '../components/PanelForm'

export default function PanelCreatePage() {
  const navigate = useNavigate()
  const createPanel = useCreatePanel()

  const handleSubmit = (values: IPanelFormValues) => {
    createPanel.mutate(values, { onSuccess: (p) => navigate(`/?panel=${p.id}`) })
  }

  const topbar = <Topbar />

  const configbar = (
    <div className="configbar">
      <div className="configbar-group configbar-group--identity">
        <span className="panel-title">New Panel</span>
      </div>
      <div className="configbar-group configbar-group--actions">
        <button className="btn btn-ghost panel-action-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>
      </div>
    </div>
  )

  return (
    <div className="app">
      {topbar}
      {configbar}
      <main className="main" style={{ maxWidth: 520 }}>
        <div className="card">
          <div className="card-header">
            <span className="card-title">New Panel</span>
          </div>
          <PanelForm
            submitLabel="Create"
            isPending={createPanel.isPending}
            onSubmit={handleSubmit}
            onCancel={() => navigate(-1)}
          />
        </div>
      </main>
    </div>
  )
}
