import { useState, useEffect } from 'react'
import { getEscalations, getActiveSessions, getCompletedIntakes, getIntakeDetail } from '../utils/api'

export default function NurseDashboard() {
  const [escalations, setEscalations] = useState([])
  const [activeSessions, setActiveSessions] = useState([])
  const [completedIntakes, setCompletedIntakes] = useState([])
  const [expandedIntake, setExpandedIntake] = useState(null)
  const [intakeDetail, setIntakeDetail] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
    const interval = setInterval(loadData, 15000)
    return () => clearInterval(interval)
  }, [])

  const loadData = async () => {
    try {
      const [esc, active, intakes] = await Promise.all([
        getEscalations().catch(() => []),
        getActiveSessions().catch(() => []),
        getCompletedIntakes().catch(() => []),
      ])
      setEscalations(esc)
      setActiveSessions(active)
      setCompletedIntakes(intakes)
    } finally {
      setLoading(false)
    }
  }

  const handleViewIntake = async (sessionId) => {
    if (expandedIntake === sessionId) {
      setExpandedIntake(null)
      setIntakeDetail(null)
      return
    }
    try {
      const detail = await getIntakeDetail(sessionId)
      setIntakeDetail(detail)
      setExpandedIntake(sessionId)
    } catch {
      setExpandedIntake(null)
      setIntakeDetail(null)
    }
  }

  return (
    <div className="page-container animate-fade-in">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Nurse Dashboard</h1>
          <p className="text-gray-400 mt-1">Monitor patient chats, escalations, and triage status</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-xl border border-green-100">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
          </span>
          <span className="text-sm font-medium text-green-700">Live Monitoring</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="stat-card border-l-4 border-l-red-500 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Escalations</p>
            <p className="text-2xl font-bold text-red-600">{escalations.length}</p>
          </div>
        </div>
        <div className="stat-card border-l-4 border-l-primary-500 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Active Sessions</p>
            <p className="text-2xl font-bold text-primary-600">{activeSessions.length}</p>
          </div>
        </div>
        <div className="stat-card border-l-4 border-l-green-500 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Status</p>
            <p className="text-2xl font-bold text-green-600">Monitoring</p>
          </div>
        </div>
      </div>

      {/* Escalations */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
          </span>
          Escalation Alerts
        </h2>
        {escalations.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 shadow-card p-10 text-center text-gray-400">
            <svg className="w-10 h-10 mx-auto mb-3 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            No active escalations
          </div>
        ) : (
          <div className="space-y-3">
            {escalations.map((e) => (
              <div key={e.session_id} className="bg-white rounded-xl border border-red-100 shadow-card p-5 flex items-center justify-between hover:shadow-card-hover transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center flex-shrink-0">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Session: {e.session_id.slice(0, 8)}...</p>
                    <p className="text-sm text-red-600 font-medium">{e.escalation_reason}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{new Date(e.created_at).toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {e.triage_level && (
                    <span className="badge badge-red font-bold text-sm px-3 py-1">
                      ESI-{e.triage_level}
                    </span>
                  )}
                  <button className="btn-primary text-xs px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700">
                    Review
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Active Sessions */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Active Chat Sessions</h2>
        {activeSessions.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 shadow-card p-10 text-center text-gray-400">
            No active sessions
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-100 shadow-card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50/80">
                <tr>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Session</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Type</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Triage</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Started</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {activeSessions.map((s, i) => (
                  <tr key={s.session_id} className={`hover:bg-primary-50/30 transition-colors ${i % 2 === 1 ? 'bg-gray-50/30' : ''}`}>
                    <td className="px-5 py-3.5 font-mono text-xs text-gray-500">{s.session_id.slice(0, 8)}...</td>
                    <td className="px-5 py-3.5 capitalize text-gray-700">{s.session_type}</td>
                    <td className="px-5 py-3.5">
                      {s.triage_level ? (
                        <span className={`badge font-bold ${
                          s.triage_level <= 2 ? 'badge-red' : 'badge-yellow'
                        }`}>
                          ESI-{s.triage_level}
                        </span>
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-gray-400 text-xs">{new Date(s.created_at).toLocaleString()}</td>
                    <td className="px-5 py-3.5">
                      {s.escalated ? (
                        <span className="badge badge-red font-semibold">Escalated</span>
                      ) : (
                        <span className="badge badge-green font-semibold">Active</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Completed Intakes */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Completed Intakes
        </h2>
        {completedIntakes.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 shadow-card p-10 text-center text-gray-400">
            No completed intakes yet
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-100 shadow-card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50/80">
                <tr>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Session</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Chief Complaint</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Date</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {completedIntakes.map((intake, i) => (
                  <tr key={intake.session_id} className="group">
                    <td colSpan={4} className="p-0">
                      <div
                        className={`flex items-center px-5 py-3.5 cursor-pointer hover:bg-primary-50/30 transition-colors ${i % 2 === 1 ? 'bg-gray-50/30' : ''}`}
                        onClick={() => handleViewIntake(intake.session_id)}
                      >
                        <div className="flex-1 font-mono text-xs text-gray-500">{intake.session_id.slice(0, 8)}...</div>
                        <div className="flex-1 text-gray-700 truncate">
                          {intake.intake_data?.chief_complaint || intake.intake_data?.reason_for_visit || '—'}
                        </div>
                        <div className="flex-1 text-gray-400 text-xs">{new Date(intake.created_at).toLocaleString()}</div>
                        <div className="flex-shrink-0">
                          <button className="btn-primary text-xs px-4 py-1.5">
                            {expandedIntake === intake.session_id ? 'Hide' : 'View'}
                          </button>
                        </div>
                      </div>
                      {expandedIntake === intake.session_id && intakeDetail && (
                        <div className="px-5 pb-5 bg-primary-50/20 border-t border-gray-100 animate-fade-in">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                            {Object.entries(intakeDetail.intake_data || {}).map(([key, val]) => (
                              <div key={key} className="bg-white rounded-lg p-3 border border-gray-100">
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                                  {key.replace(/_/g, ' ')}
                                </p>
                                <p className="text-sm text-gray-700">
                                  {Array.isArray(val) ? val.join(', ') : String(val || '—')}
                                </p>
                              </div>
                            ))}
                          </div>
                          {Object.keys(intakeDetail.intake_data || {}).length === 0 && (
                            <p className="text-sm text-gray-400 mt-4">No intake data recorded.</p>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
