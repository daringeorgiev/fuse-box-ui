import { BrowserRouter, Routes, Route } from 'react-router-dom'
import PanelPage from './pages/PanelPage'
import PanelEditPage from './pages/PanelEditPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PanelPage />} />
        <Route path="/panels/:id/edit" element={<PanelEditPage />} />
      </Routes>
    </BrowserRouter>
  )
}
