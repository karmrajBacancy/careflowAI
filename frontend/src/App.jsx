import { Routes, Route, Navigate } from 'react-router-dom'
import { isAuthenticated, isSuperAdmin, isHospitalAdmin } from './utils/auth'
import Sidebar from './components/Sidebar'
import SuperAdminSidebar from './components/SuperAdminSidebar'
import Dashboard from './pages/Dashboard'
import AmbientRecorder from './pages/AmbientRecorder'
import NoteReview from './pages/NoteReview'
import VirtualNurse from './pages/VirtualNurse'
import NurseDashboard from './pages/NurseDashboard'
import PatientIntake from './pages/PatientIntake'
import SuperAdminDashboard from './pages/SuperAdminDashboard'
import HospitalManagement from './pages/HospitalManagement'
import Login from './pages/Login'
import MarketingLayout from './components/MarketingLayout'
import LandingPage from './pages/marketing/LandingPage'
import PricingPage from './pages/marketing/PricingPage'
import AboutPage from './pages/marketing/AboutPage'
import ContactPage from './pages/marketing/ContactPage'

function ProtectedRoute({ children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />
  }
  return children
}

function SuperAdminRoute({ children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />
  }
  if (!isSuperAdmin()) {
    return <Navigate to="/" replace />
  }
  return children
}

function HospitalAdminRoute({ children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />
  }
  if (isSuperAdmin()) {
    return <Navigate to="/admin" replace />
  }
  return children
}


export default function App() {
  return (
    <Routes>
      {/* Marketing pages (public) */}
      <Route path="/" element={<MarketingLayout><LandingPage /></MarketingLayout>} />
      <Route path="/pricing" element={<MarketingLayout><PricingPage /></MarketingLayout>} />
      <Route path="/about" element={<MarketingLayout><AboutPage /></MarketingLayout>} />
      <Route path="/contact" element={<MarketingLayout><ContactPage /></MarketingLayout>} />

      <Route path="/login" element={<Login />} />

      {/* Super Admin Routes */}
      <Route
        path="/admin/*"
        element={
          <SuperAdminRoute>
            <div className="flex h-screen bg-gray-50">
              <SuperAdminSidebar />
              <main className="flex-1 overflow-y-auto">
                <Routes>
                  <Route path="/" element={<SuperAdminDashboard />} />
                  <Route path="/hospitals" element={<HospitalManagement />} />
                </Routes>
              </main>
            </div>
          </SuperAdminRoute>
        }
      />

      {/* Hospital Admin Routes (clinical UI) */}
      <Route
        path="/dashboard/*"
        element={
          <HospitalAdminRoute>
            <div className="flex h-screen bg-gray-50">
              <Sidebar />
              <main className="flex-1 overflow-y-auto">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/recorder" element={<AmbientRecorder />} />
                  <Route path="/notes/:encounterId?" element={<NoteReview />} />
                  <Route path="/nurse" element={<VirtualNurse />} />
                  <Route path="/nurse-dashboard" element={<NurseDashboard />} />
                  <Route path="/intake" element={<PatientIntake />} />
                </Routes>
              </main>
            </div>
          </HospitalAdminRoute>
        }
      />
    </Routes>
  )
}
