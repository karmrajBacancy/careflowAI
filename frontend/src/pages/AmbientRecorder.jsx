import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AudioRecorder from '../components/AudioRecorder'
import { transcribeAudio, generateNote } from '../utils/api'

const STEPS = ['Record', 'Transcribe', 'Generate Note']

export default function AmbientRecorder() {
  const navigate = useNavigate()
  const [step, setStep] = useState('record')
  const [transcript, setTranscript] = useState('')
  const [note, setNote] = useState(null)
  const [encounterId, setEncounterId] = useState(null)
  const [error, setError] = useState(null)

  const stepOrder = ['record', 'transcribing', 'transcript', 'generating', 'done']
  const currentIdx = stepOrder.indexOf(step)

  const handleRecordingComplete = async (blob) => {
    setStep('transcribing')
    setError(null)
    try {
      const file = new File([blob], 'recording.webm', { type: blob.type })
      const result = await transcribeAudio(file)
      setTranscript(result.transcript)
      setStep('transcript')
    } catch (e) {
      setError('Transcription failed: ' + (e.response?.data?.detail || e.message))
      setStep('record')
    }
  }

  const handleGenerateNote = async () => {
    setStep('generating')
    setError(null)
    try {
      const result = await generateNote(transcript)
      setNote(result.note)
      setEncounterId(result.encounter_id)
      setStep('done')
    } catch (e) {
      setError('Note generation failed: ' + (e.response?.data?.detail || e.message))
      setStep('transcript')
    }
  }

  const handleUseManualTranscript = () => {
    setStep('transcript')
  }

  const soapSections = [
    { key: 'subjective', label: 'Subjective', borderColor: 'border-l-primary-500', headerBg: 'bg-primary-50', headerText: 'text-primary-700' },
    { key: 'objective', label: 'Objective', borderColor: 'border-l-accent-500', headerBg: 'bg-accent-50', headerText: 'text-accent-700' },
    { key: 'assessment', label: 'Assessment', borderColor: 'border-l-purple-500', headerBg: 'bg-purple-50', headerText: 'text-purple-700' },
    { key: 'plan', label: 'Plan', borderColor: 'border-l-amber-500', headerBg: 'bg-amber-50', headerText: 'text-amber-700' },
  ]

  return (
    <div className="page-container max-w-4xl animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Record Encounter</h1>
        <p className="text-gray-400 mt-1">Capture a doctor-patient conversation and generate clinical notes</p>
      </div>

      {/* Progress Stepper */}
      <div className="flex items-center justify-center mb-10">
        {STEPS.map((s, i) => {
          const isActive = currentIdx >= i * 1.5
          const isComplete = currentIdx > i * 1.5 + 0.5
          return (
            <div key={s} className="flex items-center">
              {i > 0 && (
                <div className={`w-16 h-0.5 transition-colors duration-300 ${isActive ? 'bg-gradient-to-r from-primary-500 to-primary-400' : 'bg-gray-200'}`} />
              )}
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                  isComplete
                    ? 'bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-sm'
                    : isActive
                      ? 'bg-gradient-to-br from-primary-500 to-accent-500 text-white shadow-sm ring-4 ring-primary-100'
                      : 'bg-gray-100 text-gray-400'
                }`}>
                  {isComplete ? (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : i + 1}
                </div>
                <span className={`text-sm font-medium ${isActive ? 'text-primary-700' : 'text-gray-400'}`}>{s}</span>
              </div>
            </div>
          )
        })}
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-700 text-sm flex items-center gap-2">
          <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}

      {/* Step: Record */}
      {(step === 'record' || step === 'transcribing') && (
        <div className="space-y-6">
          <AudioRecorder onRecordingComplete={handleRecordingComplete} />

          {step === 'transcribing' && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-10 w-10 border-[3px] border-primary-200 border-t-primary-600 mb-4" />
              <p className="text-gray-500 font-medium">Transcribing audio with Whisper...</p>
            </div>
          )}

          <div className="text-center">
            <p className="text-gray-400 text-sm mb-2">Or paste a transcript manually</p>
            <button
              onClick={handleUseManualTranscript}
              className="text-primary-600 text-sm font-medium hover:text-primary-800 transition-colors"
            >
              Enter transcript manually
            </button>
          </div>
        </div>
      )}

      {/* Step: Review Transcript */}
      {(step === 'transcript' || step === 'generating') && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden">
            <div className="px-5 py-3.5 bg-gray-50/80 border-b border-gray-100 flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-sm font-semibold text-gray-700">Encounter Transcript</h3>
            </div>
            <textarea
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              rows={12}
              className="w-full px-5 py-4 text-sm text-gray-700 focus:outline-none focus:bg-primary-50/20 transition-colors resize-y"
              placeholder="Paste or edit the doctor-patient conversation transcript here..."
            />
          </div>

          <div className="flex gap-3 justify-end">
            <button
              onClick={() => { setStep('record'); setTranscript(''); }}
              className="btn-secondary"
            >
              Start Over
            </button>
            <button
              onClick={handleGenerateNote}
              disabled={!transcript.trim() || step === 'generating'}
              className="btn-primary disabled:opacity-50"
            >
              {step === 'generating' ? 'Generating...' : 'Generate SOAP Note'}
            </button>
          </div>

          {step === 'generating' && (
            <div className="text-center py-6">
              <div className="inline-block animate-spin rounded-full h-10 w-10 border-[3px] border-primary-200 border-t-primary-600 mb-4" />
              <p className="text-gray-500 font-medium">Claude is generating your clinical note...</p>
            </div>
          )}
        </div>
      )}

      {/* Step: Note Generated */}
      {step === 'done' && note && (
        <div className="space-y-6 animate-slide-up">
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl p-4 text-white text-sm font-medium flex items-center gap-2 shadow-sm">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            SOAP note generated successfully!
          </div>

          <div className="space-y-4">
            {soapSections.map(({ key, label, borderColor, headerBg, headerText }) => (
              <div key={key} className={`bg-white rounded-xl border border-gray-100 shadow-card overflow-hidden border-l-4 ${borderColor}`}>
                <div className={`px-4 py-2.5 ${headerBg}`}>
                  <h4 className={`text-sm font-semibold ${headerText}`}>{label}</h4>
                </div>
                <div className="px-4 py-3">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{note[key] || 'N/A'}</p>
                </div>
              </div>
            ))}
          </div>

          {note.icd10_codes?.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-card p-5">
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">ICD-10 Codes</h4>
              <div className="flex flex-wrap gap-2">
                {note.icd10_codes.map((c, i) => (
                  <span key={i} className="badge badge-indigo font-mono text-xs px-3 py-1">{c.code}</span>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3 justify-end">
            <button
              onClick={() => { setStep('record'); setTranscript(''); setNote(null); }}
              className="btn-secondary"
            >
              New Recording
            </button>
            {encounterId && (
              <button
                onClick={() => navigate(`/notes/${encounterId}`)}
                className="btn-primary"
              >
                Edit & Review Note
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
