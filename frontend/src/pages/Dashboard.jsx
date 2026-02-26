import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { healthCheck, getPatients, getEncounters, seedDatabase } from '../utils/api'
import { getUser } from '../utils/auth'
import PatientCard from '../components/PatientCard'

export default function Dashboard() {
  const navigate = useNavigate()
  const user = getUser()
  const [health, setHealth] = useState(null)
  const [patients, setPatients] = useState([])
  const [encounters, setEncounters] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [h, p, e] = await Promise.all([
        healthCheck().catch(() => null),
        getPatients().catch(() => []),
        getEncounters().catch(() => []),
      ])
      setHealth(h)
      setPatients(p)
      setEncounters(e)
    } finally {
      setLoading(false)
    }
  }

  const handleSeed = async () => {
    try {
      await seedDatabase()
      await loadData()
    } catch (e) {
      alert('Failed to seed database: ' + e.message)
    }
  }

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <div className="page-container animate-fade-in">
      {/* Gradient Header Banner */}
      <div className="bg-gradient-to-r from-primary-700 via-primary-600 to-accent-500 rounded-2xl p-8 mb-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-1/2 w-32 h-32 bg-white/5 rounded-full translate-y-1/2" />
        <div className="relative z-10">
          <p className="text-primary-200 text-sm mb-1">{today}</p>
          <h1 className="text-2xl font-bold">Welcome back{user?.username ? `, ${user.username}` : ''}!</h1>
          <p className="text-primary-100 mt-1">
            {user?.hospitalName || 'CareFlow AI'} — Clinical Dashboard
          </p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="stat-card">
              <div className="skeleton h-3 w-20 mb-3" />
              <div className="skeleton h-7 w-16" />
            </div>
          ))
        ) : (
          <>
            <StatCard
              label="System Status"
              value={health ? 'Online' : 'Offline'}
              icon="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              borderColor="border-l-green-500"
              iconBg="bg-green-100 text-green-600"
            />
            <StatCard
              label="Claude API"
              value={health?.claude_configured ? 'Connected' : 'Not Set'}
              icon="M13 10V3L4 14h7v7l9-11h-7z"
              borderColor="border-l-accent-500"
              iconBg="bg-accent-100 text-accent-600"
            />
            <StatCard
              label="Patients"
              value={patients.length}
              icon="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
              borderColor="border-l-primary-500"
              iconBg="bg-primary-100 text-primary-600"
            />
            <StatCard
              label="Encounters"
              value={encounters.length}
              icon="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              borderColor="border-l-purple-500"
              iconBg="bg-purple-100 text-purple-600"
            />
          </>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <QuickAction
          title="Record Encounter"
          description="Start ambient documentation"
          onClick={() => navigate('/recorder')}
          icon="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
          gradient="from-red-500 to-orange-500"
        />
        <QuickAction
          title="Virtual Nurse Chat"
          description="Patient-facing assistant"
          onClick={() => navigate('/nurse')}
          icon="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
          gradient="from-primary-500 to-accent-500"
        />
        <QuickAction
          title="Patient Intake"
          description="Pre-visit questionnaire"
          onClick={() => navigate('/intake')}
          icon="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          gradient="from-green-500 to-emerald-500"
        />
      </div>

      {/* Patients */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Patients</h2>
          {patients.length === 0 && !loading && (
            <button onClick={handleSeed} className="btn-secondary text-sm">
              Load Sample Data
            </button>
          )}
        </div>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="stat-card h-28">
                <div className="flex items-center gap-3">
                  <div className="skeleton w-10 h-10 rounded-xl" />
                  <div>
                    <div className="skeleton h-4 w-32 mb-2" />
                    <div className="skeleton h-3 w-20" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : patients.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-100 shadow-card">
            <svg className="w-12 h-12 text-gray-200 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p className="text-gray-400 text-sm">No patients yet. Click "Load Sample Data" to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {patients.slice(0, 9).map(p => (
              <PatientCard key={p.id} patient={p} onClick={() => navigate(`/notes`)} />
            ))}
          </div>
        )}
      </div>

      {/* Recent Encounters */}
      {encounters.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Encounters</h2>
          <div className="bg-white rounded-xl border border-gray-100 shadow-card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50/80">
                <tr>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="text-right px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {encounters.slice(0, 10).map((e, i) => (
                  <tr key={e.id} className={`hover:bg-primary-50/30 transition-colors ${i % 2 === 1 ? 'bg-gray-50/30' : ''}`}>
                    <td className="px-5 py-3.5 text-gray-700">{new Date(e.date).toLocaleDateString()}</td>
                    <td className="px-5 py-3.5 text-gray-700 capitalize">{e.encounter_type.replace('_', ' ')}</td>
                    <td className="px-5 py-3.5">
                      <span className="badge badge-green">{e.status}</span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => navigate(`/notes/${e.id}`)}
                        className="text-primary-600 hover:text-primary-800 text-sm font-medium transition-colors"
                      >
                        View Notes
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

function StatCard({ label, value, icon, borderColor, iconBg }) {
  return (
    <div className={`stat-card border-l-4 ${borderColor} flex items-center gap-4`}>
      <div className={`w-11 h-11 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0`}>
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={icon} />
        </svg>
      </div>
      <div>
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">{label}</p>
        <p className="text-xl font-bold text-gray-900 mt-0.5">{value}</p>
      </div>
    </div>
  )
}

function QuickAction({ title, description, onClick, icon, gradient }) {
  return (
    <button
      onClick={onClick}
      className="group text-left p-5 bg-white rounded-xl border border-gray-100 shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200"
    >
      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-3 shadow-sm group-hover:scale-105 transition-transform`}>
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={icon} />
        </svg>
      </div>
      <h3 className="font-semibold text-gray-800">{title}</h3>
      <p className="text-sm text-gray-400 mt-1">{description}</p>
    </button>
  )
}
