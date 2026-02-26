import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  getHospitals,
  createHospital,
  updateHospital,
  deleteHospital,
  getHospitalAdmins,
  createHospitalAdmin,
} from '../utils/api'

export default function HospitalManagement() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [hospitals, setHospitals] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedHospital, setSelectedHospital] = useState(null)
  const [admins, setAdmins] = useState([])
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showAdminForm, setShowAdminForm] = useState(false)
  const [editingHospital, setEditingHospital] = useState(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [form, setForm] = useState({ name: '', address: '', phone: '', email: '' })
  const [adminForm, setAdminForm] = useState({ username: '', password: '' })

  useEffect(() => {
    loadHospitals()
  }, [])

  useEffect(() => {
    const id = searchParams.get('id')
    if (id && hospitals.length > 0) {
      const h = hospitals.find(h => h.id === id)
      if (h) selectHospital(h)
    }
  }, [searchParams, hospitals])

  async function loadHospitals() {
    try {
      const data = await getHospitals()
      setHospitals(data)
    } catch (err) {
      console.error('Failed to load hospitals:', err)
    } finally {
      setLoading(false)
    }
  }

  async function selectHospital(hospital) {
    setSelectedHospital(hospital)
    setSearchParams({ id: hospital.id })
    try {
      const adminData = await getHospitalAdmins(hospital.id)
      setAdmins(adminData)
    } catch (err) {
      console.error('Failed to load admins:', err)
    }
  }

  async function handleCreateHospital(e) {
    e.preventDefault()
    setError('')
    try {
      await createHospital(form)
      setSuccess('Hospital created successfully')
      setShowCreateForm(false)
      setForm({ name: '', address: '', phone: '', email: '' })
      await loadHospitals()
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create hospital')
    }
  }

  async function handleUpdateHospital(e) {
    e.preventDefault()
    setError('')
    try {
      await updateHospital(editingHospital.id, form)
      setSuccess('Hospital updated successfully')
      setEditingHospital(null)
      setForm({ name: '', address: '', phone: '', email: '' })
      await loadHospitals()
      if (selectedHospital?.id === editingHospital.id) {
        setSelectedHospital(null)
        setSearchParams({})
      }
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update hospital')
    }
  }

  async function handleDeactivate(hospital) {
    if (!confirm(`Deactivate "${hospital.name}"? This will disable access for all its users.`)) return
    try {
      await deleteHospital(hospital.id)
      setSuccess('Hospital deactivated')
      await loadHospitals()
      if (selectedHospital?.id === hospital.id) {
        setSelectedHospital(null)
        setSearchParams({})
      }
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to deactivate hospital')
    }
  }

  async function handleCreateAdmin(e) {
    e.preventDefault()
    setError('')
    try {
      await createHospitalAdmin(selectedHospital.id, adminForm)
      setSuccess('Admin user created successfully')
      setShowAdminForm(false)
      setAdminForm({ username: '', password: '' })
      const adminData = await getHospitalAdmins(selectedHospital.id)
      setAdmins(adminData)
      await loadHospitals()
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create admin')
    }
  }

  function startEdit(hospital) {
    setEditingHospital(hospital)
    setForm({
      name: hospital.name,
      address: hospital.address || '',
      phone: hospital.phone || '',
      email: hospital.email || '',
    })
    setShowCreateForm(false)
  }

  if (loading) {
    return (
      <div className="page-container">
        <div className="skeleton h-10 w-64 mb-8" />
        <div className="grid grid-cols-3 gap-6">
          <div className="skeleton h-96 rounded-xl" />
          <div className="col-span-2 skeleton h-96 rounded-xl" />
        </div>
      </div>
    )
  }

  const inputClasses = "w-full px-3.5 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 outline-none text-sm transition-all"

  return (
    <div className="page-container animate-fade-in">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hospital Management</h1>
          <p className="text-sm text-gray-400 mt-1">Create, edit, and manage hospitals</p>
        </div>
        <button
          onClick={() => {
            setShowCreateForm(true)
            setEditingHospital(null)
            setForm({ name: '', address: '', phone: '', email: '' })
          }}
          className="btn-primary"
        >
          + New Hospital
        </button>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 text-red-700 text-sm px-4 py-3 rounded-xl border border-red-100 flex items-center justify-between animate-fade-in">
          <span>{error}</span>
          <button onClick={() => setError('')} className="text-red-400 hover:text-red-600 transition-colors">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      )}
      {success && (
        <div className="mb-4 bg-green-50 text-green-700 text-sm px-4 py-3 rounded-xl border border-green-100 flex items-center gap-2 animate-fade-in">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Hospital List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-card border border-gray-100 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
              <h3 className="text-sm font-semibold text-gray-700">All Hospitals ({hospitals.length})</h3>
            </div>
            <div className="divide-y divide-gray-50 max-h-[600px] overflow-y-auto">
              {hospitals.map(h => (
                <div
                  key={h.id}
                  onClick={() => selectHospital(h)}
                  className={`px-4 py-3.5 cursor-pointer transition-all duration-200 ${
                    selectedHospital?.id === h.id
                      ? 'bg-primary-50 border-l-4 border-l-primary-600 pl-3'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-sm text-gray-900">{h.name}</div>
                    <span className={`inline-flex items-center gap-1 badge text-[11px] ${
                      h.is_active ? 'badge-green' : 'badge-red'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${h.is_active ? 'bg-green-500' : 'bg-red-500'}`} />
                      {h.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {h.admin_count} admins · {h.patient_count} patients
                  </div>
                </div>
              ))}
              {hospitals.length === 0 && (
                <div className="p-6 text-center text-sm text-gray-400">No hospitals yet</div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Detail / Forms */}
        <div className="lg:col-span-2 space-y-6">
          {/* Create/Edit Form */}
          {(showCreateForm || editingHospital) && (
            <div className="bg-white rounded-xl shadow-card border border-gray-100 p-6 animate-slide-up">
              <h3 className="text-lg font-semibold text-gray-900 mb-5">
                {editingHospital ? 'Edit Hospital' : 'Create New Hospital'}
              </h3>
              <form onSubmit={editingHospital ? handleUpdateHospital : handleCreateHospital} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Hospital Name *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    className={inputClasses}
                    placeholder="e.g. City General Hospital"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Address</label>
                  <input
                    type="text"
                    value={form.address}
                    onChange={e => setForm({ ...form, address: e.target.value })}
                    className={inputClasses}
                    placeholder="123 Medical Drive"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
                    <input
                      type="text"
                      value={form.phone}
                      onChange={e => setForm({ ...form, phone: e.target.value })}
                      className={inputClasses}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                      className={inputClasses}
                    />
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="submit" className="btn-primary">
                    {editingHospital ? 'Save Changes' : 'Create Hospital'}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setShowCreateForm(false); setEditingHospital(null) }}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Hospital Detail */}
          {selectedHospital && !editingHospital && (
            <div className="bg-white rounded-xl shadow-card border border-gray-100 p-6 animate-fade-in">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{selectedHospital.name}</h3>
                  <p className="text-sm text-gray-400 font-mono">{selectedHospital.slug}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => startEdit(selectedHospital)}
                    className="btn-secondary text-sm px-3.5 py-1.5"
                  >
                    Edit
                  </button>
                  {selectedHospital.is_active && (
                    <button
                      onClick={() => handleDeactivate(selectedHospital)}
                      className="px-3.5 py-1.5 bg-red-50 text-red-700 text-sm font-medium rounded-xl hover:bg-red-100 transition border border-red-100"
                    >
                      Deactivate
                    </button>
                  )}
                </div>
              </div>

              {/* Hospital Info */}
              <div className="grid grid-cols-2 gap-4 mb-6 text-sm p-4 bg-gray-50/50 rounded-xl">
                <div>
                  <span className="text-gray-400 text-xs uppercase tracking-wider">Address</span>
                  <p className="text-gray-900 mt-0.5">{selectedHospital.address || '—'}</p>
                </div>
                <div>
                  <span className="text-gray-400 text-xs uppercase tracking-wider">Phone</span>
                  <p className="text-gray-900 mt-0.5">{selectedHospital.phone || '—'}</p>
                </div>
                <div>
                  <span className="text-gray-400 text-xs uppercase tracking-wider">Email</span>
                  <p className="text-gray-900 mt-0.5">{selectedHospital.email || '—'}</p>
                </div>
                <div>
                  <span className="text-gray-400 text-xs uppercase tracking-wider">Patients</span>
                  <p className="text-gray-900 mt-0.5">{selectedHospital.patient_count}</p>
                </div>
              </div>

              {/* Admin Users */}
              <div className="border-t border-gray-100 pt-5">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-semibold text-gray-700">Admin Users ({admins.length})</h4>
                  <button
                    onClick={() => { setShowAdminForm(true); setAdminForm({ username: '', password: '' }) }}
                    className="btn-primary text-xs px-3.5 py-1.5"
                  >
                    + Add Admin
                  </button>
                </div>

                {showAdminForm && (
                  <form onSubmit={handleCreateAdmin} className="mb-4 p-4 bg-gray-50 rounded-xl space-y-3 animate-slide-up">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Username</label>
                        <input
                          type="text"
                          required
                          minLength={3}
                          value={adminForm.username}
                          onChange={e => setAdminForm({ ...adminForm, username: e.target.value })}
                          className={inputClasses}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Password</label>
                        <input
                          type="password"
                          required
                          minLength={6}
                          value={adminForm.password}
                          onChange={e => setAdminForm({ ...adminForm, password: e.target.value })}
                          className={inputClasses}
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button type="submit" className="btn-primary text-xs px-3.5 py-1.5">
                        Create Admin
                      </button>
                      <button type="button" onClick={() => setShowAdminForm(false)} className="btn-secondary text-xs px-3.5 py-1.5">
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                <div className="space-y-2">
                  {admins.map(a => (
                    <div key={a.id} className="flex items-center justify-between py-3 px-4 bg-gray-50/80 rounded-xl hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                          {a.username[0].toUpperCase()}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{a.username}</div>
                          <div className="text-xs text-gray-400">{a.role}</div>
                        </div>
                      </div>
                      <span className={`inline-flex items-center gap-1 badge text-[11px] ${
                        a.is_active ? 'badge-green' : 'badge-red'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${a.is_active ? 'bg-green-500' : 'bg-red-500'}`} />
                        {a.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  ))}
                  {admins.length === 0 && (
                    <div className="text-sm text-gray-400 text-center py-6">No admin users yet</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Empty state */}
          {!selectedHospital && !showCreateForm && !editingHospital && (
            <div className="bg-white rounded-xl shadow-card border border-gray-100 p-16 text-center">
              <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <p className="text-gray-400">Select a hospital to view details or create a new one</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
