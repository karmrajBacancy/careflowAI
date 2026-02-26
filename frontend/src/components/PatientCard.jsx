export default function PatientCard({ patient, onClick }) {
  const age = patient.date_of_birth
    ? Math.floor((new Date() - new Date(patient.date_of_birth)) / 31557600000)
    : '?'

  const initials = `${(patient.first_name?.[0] || '').toUpperCase()}${(patient.last_name?.[0] || '').toUpperCase()}`

  return (
    <div
      onClick={() => onClick?.(patient)}
      className="group bg-white rounded-xl border border-gray-100 p-4 shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 text-white flex items-center justify-center text-sm font-bold shadow-sm flex-shrink-0">
            {initials}
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">
              {patient.first_name} {patient.last_name}
            </h3>
            <p className="text-sm text-gray-400">
              {age} y/o {patient.sex === 'M' ? 'Male' : 'Female'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {patient.triage_level && (
            <span className={`badge ${
              patient.triage_level <= 2
                ? 'badge-red'
                : patient.triage_level === 3
                  ? 'badge-yellow'
                  : 'badge-green'
            } font-bold`}>
              ESI-{patient.triage_level}
            </span>
          )}
          <svg className="w-4 h-4 text-gray-300 group-hover:text-primary-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>

      {patient.medical_history?.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {patient.medical_history.slice(0, 3).map((h, i) => (
            <span key={i} className="px-2 py-0.5 bg-gray-50 text-gray-500 text-xs rounded-full border border-gray-100">
              {h}
            </span>
          ))}
          {patient.medical_history.length > 3 && (
            <span className="text-xs text-gray-400 self-center">+{patient.medical_history.length - 3}</span>
          )}
        </div>
      )}

      {patient.allergies?.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {patient.allergies.map((a, i) => (
            <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-50 text-red-600 text-xs rounded-full border border-red-100">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
              {a}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
