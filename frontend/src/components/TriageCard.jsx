const ESI_CONFIG = {
  1: { label: 'Immediate', gradientFrom: 'from-red-500', gradientTo: 'to-red-600', bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', ring: 'ring-red-100' },
  2: { label: 'Emergent', gradientFrom: 'from-orange-500', gradientTo: 'to-orange-600', bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', ring: 'ring-orange-100' },
  3: { label: 'Urgent', gradientFrom: 'from-yellow-500', gradientTo: 'to-yellow-600', bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200', ring: 'ring-yellow-100' },
  4: { label: 'Less Urgent', gradientFrom: 'from-blue-500', gradientTo: 'to-blue-600', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', ring: 'ring-blue-100' },
  5: { label: 'Non-Urgent', gradientFrom: 'from-green-500', gradientTo: 'to-green-600', bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', ring: 'ring-green-100' },
}

export default function TriageCard({ result }) {
  if (!result) return null

  const config = ESI_CONFIG[result.esi_level] || ESI_CONFIG[3]

  return (
    <div className={`rounded-2xl border ${config.border} overflow-hidden shadow-card`}>
      {/* Header */}
      <div className={`${config.bg} px-5 py-4 flex items-center justify-between`}>
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${config.gradientFrom} ${config.gradientTo} flex items-center justify-center text-white text-lg font-bold shadow-sm ring-4 ${config.ring}`}>
            {result.esi_level}
          </div>
          <div>
            <span className={`text-sm font-bold ${config.text}`}>
              ESI Level {result.esi_level}
            </span>
            <p className={`text-xs font-medium ${config.text} opacity-75`}>
              {config.label}
            </p>
          </div>
        </div>
        {result.escalate_to_nurse && (
          <span className="px-3 py-1.5 bg-red-500 text-white text-xs font-bold rounded-full uppercase shadow-sm animate-pulse">
            Escalate
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-5 bg-white space-y-4">
        <div>
          <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Reasoning</h4>
          <p className="text-sm text-gray-700 leading-relaxed">{result.reasoning}</p>
        </div>

        {result.key_symptoms?.length > 0 && (
          <>
            <div className="border-t border-gray-100" />
            <div>
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Key Symptoms</h4>
              <div className="flex flex-wrap gap-1.5">
                {result.key_symptoms.map((s, i) => (
                  <span key={i} className="px-2.5 py-1 bg-gray-50 text-gray-600 text-xs rounded-full border border-gray-100">{s}</span>
                ))}
              </div>
            </div>
          </>
        )}

        {result.red_flags?.length > 0 && (
          <>
            <div className="border-t border-gray-100" />
            <div>
              <h4 className="text-xs font-semibold text-red-500 uppercase tracking-wider mb-2">Red Flags</h4>
              <div className="flex flex-wrap gap-1.5">
                {result.red_flags.map((f, i) => (
                  <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-50 text-red-700 text-xs rounded-full border border-red-100 font-medium">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {f}
                  </span>
                ))}
              </div>
            </div>
          </>
        )}

        <div className="border-t border-gray-100" />
        <div className={`${config.bg} rounded-xl p-3.5`}>
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Recommended Action</h4>
          <p className={`text-sm font-medium ${config.text}`}>{result.recommended_action}</p>
        </div>
      </div>
    </div>
  )
}
