import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getHospitals } from '../utils/api'

export default function SuperAdminDashboard() {
  const [hospitals, setHospitals] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      const data = await getHospitals()
      setHospitals(data)
    } catch (err) {
      console.error('Failed to load hospitals:', err)
    } finally {
      setLoading(false)
    }
  }

  const totalHospitals = hospitals.length
  const activeHospitals = hospitals.filter(h => h.is_active).length
  const totalAdmins = hospitals.reduce((sum, h) => sum + (h.admin_count || 0), 0)
  const totalPatients = hospitals.reduce((sum, h) => sum + (h.patient_count || 0), 0)

  if (loading) {
    return (
      <div className="page-container">
        <div className="skeleton h-32 rounded-2xl mb-8" />
        <div className="grid grid-cols-4 gap-4 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="stat-card">
              <div className="skeleton h-3 w-24 mb-3" />
              <div className="skeleton h-8 w-16" />
            </div>
          ))}
        </div>
        <div className="skeleton h-64 rounded-xl" />
      </div>
    )
  }

  return (
    <div className="page-container animate-fade-in">
      {/* Gradient Header */}
      <div className="bg-gradient-to-r from-primary-700 via-primary-600 to-accent-500 rounded-2xl p-8 mb-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-1/2 w-32 h-32 bg-white/5 rounded-full translate-y-1/2" />
        <div className="relative z-10">
          <h1 className="text-2xl font-bold">Super Admin Dashboard</h1>
          <p className="text-primary-100 mt-1">Manage hospitals and platform overview</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="stat-card border-l-4 border-l-primary-500 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Total Hospitals</p>
            <p className="text-2xl font-bold text-gray-900">{totalHospitals}</p>
            <p className="text-xs text-green-600 font-medium">{activeHospitals} active</p>
          </div>
        </div>
        <div className="stat-card border-l-4 border-l-accent-500 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-accent-100 text-accent-600 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Hospital Admins</p>
            <p className="text-2xl font-bold text-gray-900">{totalAdmins}</p>
          </div>
        </div>
        <div className="stat-card border-l-4 border-l-purple-500 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Total Patients</p>
            <p className="text-2xl font-bold text-gray-900">{totalPatients}</p>
          </div>
        </div>
        <div className="stat-card border-l-4 border-l-green-500 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Platform Status</p>
            <p className="text-lg font-bold text-green-600">Operational</p>
          </div>
        </div>
      </div>

      {/* Hospital List */}
      <div className="bg-white rounded-xl shadow-card border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Hospitals</h2>
          <button
            onClick={() => navigate('/admin/hospitals')}
            className="btn-primary"
          >
            Manage Hospitals
          </button>
        </div>
        {hospitals.length === 0 ? (
          <div className="p-12 text-center">
            <svg className="w-12 h-12 text-gray-200 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <p className="text-gray-400">No hospitals yet. Create your first hospital to get started.</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50/80">
              <tr>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Slug</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Admins</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Patients</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {hospitals.map((h, i) => (
                <tr
                  key={h.id}
                  className={`hover:bg-primary-50/30 cursor-pointer transition-colors ${i % 2 === 1 ? 'bg-gray-50/30' : ''}`}
                  onClick={() => navigate(`/admin/hospitals?id=${h.id}`)}
                >
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{h.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-400 font-mono">{h.slug}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{h.admin_count}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{h.patient_count}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 badge ${
                      h.is_active ? 'badge-green' : 'badge-red'
                    } font-semibold`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${h.is_active ? 'bg-green-500' : 'bg-red-500'}`} />
                      {h.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
