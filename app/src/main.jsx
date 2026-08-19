import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './index.css'
import { VisitProvider } from './state/VisitContext'
import FlowLayout from './components/FlowLayout'
import Home from './pages/Home'
import Setup from './pages/Setup'
import Capture from './pages/Capture'
import Documentation from './pages/Documentation'
import FollowUp from './pages/FollowUp'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <VisitProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/visit/:patientId" element={<FlowLayout />}>
            <Route index element={<Navigate to="setup" replace />} />
            <Route path="setup" element={<Setup />} />
            <Route path="capture" element={<Capture />} />
            <Route path="documentation" element={<Documentation />} />
            <Route path="followup" element={<FollowUp />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </VisitProvider>
    </BrowserRouter>
  </StrictMode>,
)
