import { NavLink } from 'react-router-dom'
import { getUser, logout } from '../utils/auth'

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { path: '/dashboard/recorder', label: 'Record Encounter', icon: 'M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z' },
  { path: '/dashboard/notes', label: 'Review Notes', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
  { path: '/dashboard/nurse', label: 'Virtual Nurse', icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z' },
  { path: '/dashboard/nurse-dashboard', label: 'Nurse Dashboard', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
  { path: '/dashboard/intake', label: 'Patient Intake', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
]

export default function Sidebar() {
  const user = getUser()

  return (
    <aside className="w-64 bg-white border-r border-gray-100 flex flex-col shadow-sm">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary-700 via-primary-600 to-primary-800 p-5">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-lg flex items-center justify-center">
            <img src="/logo.svg" alt="CareFlow AI" className="w-11 h-11 rounded-lg" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white tracking-tight">CareFlow AI</h1>
            <p className="text-[11px] text-primary-200">Clinical AI Assistant</p>
          </div>
        </div>
        {user?.hospitalName && (
          <div className="mt-3 px-2.5 py-1 bg-accent-500/20 backdrop-blur-sm rounded-lg">
            <p className="text-xs font-medium text-accent-200">{user.hospitalName}</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {navItems.map(({ path, label, icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/dashboard'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? 'bg-primary-50 text-primary-700 border-l-[3px] border-primary-600 pl-[9px]'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                  isActive ? 'bg-primary-100' : 'bg-transparent group-hover:bg-gray-100'
                }`}>
                  <svg className="w-[18px] h-[18px] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={icon} />
                  </svg>
                </div>
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User Area */}
      <div className="p-3 border-t border-gray-100">
        {user && (
          <div className="flex items-center justify-between p-2.5 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                {user.username[0].toUpperCase()}
              </div>
              <div>
                <span className="text-sm font-medium text-gray-800 block leading-tight">{user.username}</span>
                <span className="text-[10px] font-medium text-primary-500 uppercase tracking-wider">Admin</span>
              </div>
            </div>
            <button
              onClick={logout}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
              title="Sign out"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        )}
        <div className="text-[10px] text-gray-400 text-center mt-2">v0.1.0 — Local MVP</div>
      </div>
    </aside>
  )
}
