import { BrowserRouter, Routes, Route } from 'react-router-dom'
import PanelPage from './pages/PanelPage'
import PanelEditPage from './pages/PanelEditPage'
import PanelCreatePage from './pages/PanelCreatePage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PanelPage />} />
        <Route path="/panels/new" element={<PanelCreatePage />} />
        <Route path="/panels/:id/edit" element={<PanelEditPage />} />
      </Routes>
    </BrowserRouter>
  )
}
