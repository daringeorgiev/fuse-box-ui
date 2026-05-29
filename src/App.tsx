import { BrowserRouter, Routes, Route } from 'react-router-dom'
import PanelPage from './pages/PanelPage'
import PanelEditPage from './pages/PanelEditPage'
import PanelCreatePage from './pages/PanelCreatePage'
import PanelsPage from './pages/PanelsPage'
import LoginPage from './pages/LoginPage'
import ProtectedRoute from './components/ProtectedRoute'
import ReloadPrompt from './components/ReloadPrompt'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<PanelPage />} />
        <Route path="/panels" element={<ProtectedRoute><PanelsPage /></ProtectedRoute>} />
        <Route path="/panels/new" element={<ProtectedRoute><PanelCreatePage /></ProtectedRoute>} />
        <Route path="/panels/:id/edit" element={<ProtectedRoute><PanelEditPage /></ProtectedRoute>} />
      </Routes>
      <ReloadPrompt />
    </BrowserRouter>
  )
}
