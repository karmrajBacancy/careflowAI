import { useState } from 'react'

const sectionConfig = [
  { key: 'subjective', label: 'Subjective', borderColor: 'border-l-primary-500', headerBg: 'bg-primary-50', headerText: 'text-primary-700' },
  { key: 'objective', label: 'Objective', borderColor: 'border-l-accent-500', headerBg: 'bg-accent-50', headerText: 'text-accent-700' },
  { key: 'assessment', label: 'Assessment', borderColor: 'border-l-purple-500', headerBg: 'bg-purple-50', headerText: 'text-purple-700' },
  { key: 'plan', label: 'Plan', borderColor: 'border-l-amber-500', headerBg: 'bg-amber-50', headerText: 'text-amber-700' },
]

export default function NoteEditor({ note, onSave, onSuggestCodes }) {
  const [sections, setSections] = useState({
    subjective: note?.subjective || '',
    objective: note?.objective || '',
    assessment: note?.assessment || '',
    plan: note?.plan || '',
  })
  const [saving, setSaving] = useState(false)

  const handleChange = (section, value) => {
    setSections(prev => ({ ...prev, [section]: value }))
  }

  const handleSave = async () => {
    setSaving(true)
    const fullText = Object.entries(sections)
      .map(([key, val]) => `## ${key.charAt(0).toUpperCase() + key.slice(1)}\n${val}`)
      .join('\n\n')
    await onSave?.(fullText)
    setSaving(false)
  }

  return (
    <div className="space-y-4">
      {sectionConfig.map(({ key, label, borderColor, headerBg, headerText }) => (
        <div key={key} className={`bg-white rounded-xl border border-gray-100 shadow-card overflow-hidden border-l-4 ${borderColor}`}>
          <div className={`px-4 py-2.5 ${headerBg} border-b border-gray-100`}>
            <h4 className={`text-sm font-semibold ${headerText}`}>{label}</h4>
          </div>
          <textarea
            value={sections[key]}
            onChange={(e) => handleChange(key, e.target.value)}
            rows={4}
            className="w-full px-4 py-3 text-sm text-gray-700 bg-transparent focus:outline-none focus:bg-gray-50/50 resize-y transition-colors"
            placeholder={`Enter ${label.toLowerCase()} findings...`}
          />
        </div>
      ))}

      <div className="flex gap-3 justify-end">
        {onSuggestCodes && (
          <button
            onClick={() => {
              const fullText = Object.entries(sections)
                .map(([key, val]) => `${key}: ${val}`)
                .join('\n')
              onSuggestCodes(fullText)
            }}
            className="btn-secondary"
          >
            Suggest Codes
          </button>
        )}
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-primary disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Note'}
        </button>
      </div>
    </div>
  )
}
