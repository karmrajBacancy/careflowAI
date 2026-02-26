import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getEncounter, getEncounters, updateNote, suggestCodes } from '../utils/api'
import NoteEditor from '../components/NoteEditor'

export default function NoteReview() {
  const { encounterId } = useParams()
  const [encounters, setEncounters] = useState([])
  const [selectedEncounter, setSelectedEncounter] = useState(null)
  const [codes, setCodes] = useState(null)
  const [loading, setLoading] = useState(true)
  const [codesLoading, setCodesLoading] = useState(false)
  const [message, setMessage] = useState(null)

  useEffect(() => {
    loadEncounters()
  }, [])

  useEffect(() => {
    if (encounterId) loadEncounter(encounterId)
  }, [encounterId])

  const loadEncounters = async () => {
    try {
      const data = await getEncounters()
      setEncounters(data)
      if (!encounterId && data.length > 0) {
        loadEncounter(data[0].id)
      }
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }

  const loadEncounter = async (id) => {
    setLoading(true)
    setCodes(null)
    try {
      const data = await getEncounter(id)
      setSelectedEncounter(data)
    } catch {
      setSelectedEncounter(null)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (noteText) => {
    if (!selectedEncounter?.notes?.[0]) return
    try {
      await updateNote(selectedEncounter.notes[0].id, noteText, 'reviewed')
      setMessage('Note saved successfully')
      setTimeout(() => setMessage(null), 3000)
    } catch (e) {
      setMessage('Failed to save note')
    }
  }

  const handleSuggestCodes = async (noteText) => {
    setCodesLoading(true)
    try {
      const result = await suggestCodes(noteText)
      setCodes(result)
    } catch {
      setMessage('Failed to generate code suggestions')
    } finally {
      setCodesLoading(false)
    }
  }

  const note = selectedEncounter?.notes?.[0]

  return (
    <div className="page-container max-w-6xl animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Review Notes</h1>
        <p className="text-gray-400 mt-1">Review and edit AI-generated clinical notes</p>
      </div>

      {message && (
        <div className="mb-4 p-3.5 bg-green-50 border border-green-100 rounded-xl text-green-700 text-sm font-medium flex items-center gap-2 animate-fade-in">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          {message}
        </div>
      )}

      <div className="grid grid-cols-12 gap-6">
        {/* Encounter List */}
        <div className="col-span-3">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Encounters</h3>
          <div className="space-y-2">
            {encounters.map(e => {
              const isSelected = selectedEncounter?.id === e.id
              return (
                <button
                  key={e.id}
                  onClick={() => loadEncounter(e.id)}
                  className={`w-full text-left p-3.5 rounded-xl border text-sm transition-all duration-200 ${
                    isSelected
                      ? 'border-primary-300 bg-primary-50 shadow-sm border-l-4 border-l-primary-600'
                      : 'border-gray-100 bg-white hover:border-gray-200 hover:shadow-card'
                  }`}
                >
                  <p className={`font-medium ${isSelected ? 'text-primary-700' : 'text-gray-700'}`}>
                    {new Date(e.date).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-gray-400 capitalize mt-0.5">{e.encounter_type.replace('_', ' ')}</p>
                </button>
              )
            })}
            {encounters.length === 0 && !loading && (
              <p className="text-gray-400 text-sm text-center py-4">No encounters yet</p>
            )}
          </div>
        </div>

        {/* Note Editor */}
        <div className="col-span-5">
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="stat-card h-32">
                  <div className="skeleton h-4 w-24 mb-3" />
                  <div className="skeleton h-3 w-full mb-2" />
                  <div className="skeleton h-3 w-3/4" />
                </div>
              ))}
            </div>
          ) : note ? (
            <NoteEditor note={note} onSave={handleSave} onSuggestCodes={handleSuggestCodes} />
          ) : selectedEncounter ? (
            <div className="text-center py-16 bg-white rounded-xl border border-gray-100 shadow-card text-gray-400">
              No notes for this encounter
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-xl border border-gray-100 shadow-card text-gray-400">
              Select an encounter to review
            </div>
          )}
        </div>

        {/* Codes & Transcript */}
        <div className="col-span-4 space-y-6">
          {/* Transcript */}
          {selectedEncounter?.transcript && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-card overflow-hidden">
              <div className="px-4 py-3 bg-gray-50/80 border-b border-gray-100">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Transcript</h3>
              </div>
              <div className="p-4 max-h-48 overflow-y-auto">
                <p className="text-xs text-gray-600 whitespace-pre-wrap leading-relaxed">
                  {selectedEncounter.transcript}
                </p>
              </div>
            </div>
          )}

          {/* Code Suggestions */}
          {codesLoading && (
            <div className="text-center py-8 bg-white rounded-xl border border-gray-100 shadow-card">
              <div className="inline-block animate-spin rounded-full h-7 w-7 border-[3px] border-primary-200 border-t-primary-600 mb-3" />
              <p className="text-gray-400 text-sm">Analyzing codes...</p>
            </div>
          )}

          {codes && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-card overflow-hidden">
              <div className="px-4 py-3 bg-gray-50/80 border-b border-gray-100">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Code Suggestions</h3>
              </div>
              <div className="p-4 space-y-4">
                {codes.icd10_codes?.length > 0 && (
                  <div>
                    <h4 className="text-xs font-medium text-gray-500 mb-2">ICD-10</h4>
                    {codes.icd10_codes.map((c, i) => (
                      <div key={i} className="flex items-start gap-2 py-2 border-b border-gray-50 last:border-0">
                        <span className="badge badge-indigo font-mono text-[11px]">{c.code}</span>
                        <div>
                          <p className="text-xs text-gray-700">{c.description}</p>
                          <p className="text-[11px] text-gray-400">{c.confidence} confidence</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {codes.cpt_codes?.length > 0 && (
                  <div>
                    <h4 className="text-xs font-medium text-gray-500 mb-2">CPT</h4>
                    {codes.cpt_codes.map((c, i) => (
                      <div key={i} className="flex items-start gap-2 py-2 border-b border-gray-50 last:border-0">
                        <span className="badge badge-green font-mono text-[11px]">{c.code}</span>
                        <div>
                          <p className="text-xs text-gray-700">{c.description}</p>
                          <p className="text-[11px] text-gray-400">{c.confidence} confidence</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {codes.em_level && (
                  <div>
                    <h4 className="text-xs font-medium text-gray-500 mb-1">E/M Level</h4>
                    <p className="text-sm text-gray-700 font-medium">{codes.em_level}</p>
                  </div>
                )}

                {codes.documentation_gaps?.length > 0 && (
                  <div>
                    <h4 className="text-xs font-medium text-yellow-600 mb-1.5">Documentation Gaps</h4>
                    <ul className="text-xs text-gray-600 space-y-1.5">
                      {codes.documentation_gaps.map((g, i) => (
                        <li key={i} className="flex gap-1.5 items-start">
                          <svg className="w-3.5 h-3.5 text-yellow-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          {g}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
