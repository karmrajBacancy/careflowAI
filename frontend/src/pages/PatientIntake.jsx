import { useState } from 'react'
import ChatWindow from '../components/ChatWindow'
import { startIntake, sendIntakeMessage } from '../utils/api'

export default function PatientIntake() {
  const [started, setStarted] = useState(false)
  const [sessionId, setSessionId] = useState(null)
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [complete, setComplete] = useState(false)
  const [intakeSummary, setIntakeSummary] = useState(null)
  const [reason, setReason] = useState('')

  const handleNewIntake = () => {
    setStarted(false)
    setSessionId(null)
    setMessages([])
    setComplete(false)
    setIntakeSummary(null)
    setReason('')
  }

  const handleStart = async () => {
    setIsLoading(true)
    try {
      const result = await startIntake(null, reason || null)
      setSessionId(result.session_id)
      setMessages([{ role: 'assistant', content: result.message }])
      setStarted(true)
    } catch {
      alert('Failed to start intake')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendMessage = async (message) => {
    setMessages(prev => [...prev, { role: 'user', content: message }])
    setIsLoading(true)

    try {
      const result = await sendIntakeMessage(sessionId, message)
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: result.message,
          escalation: result.escalation,
        },
      ])
      if (result.complete) {
        setComplete(true)
        setIntakeSummary(result.intake_summary)
      }
    } catch {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  if (!started) {
    return (
      <div className="page-container max-w-2xl animate-fade-in">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Patient Intake</h1>
          <p className="text-gray-400 mt-1">Pre-visit questionnaire powered by AI</p>
        </div>

        <div className="glass-card p-8 shadow-glass">
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center mx-auto mb-4 shadow-sm">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-800">Start Intake</h2>
            <p className="text-sm text-gray-400 mt-2 max-w-sm mx-auto">
              Our AI nursing assistant will guide you through a pre-visit questionnaire
              to collect important information before your appointment.
            </p>
          </div>

          <div className="space-y-3 mb-6 text-sm text-gray-500">
            {['Collect medical history & current symptoms', 'Review medications & allergies', 'AI-powered triage assessment'].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-primary-50 flex items-center justify-center flex-shrink-0">
                  <svg className="w-3.5 h-3.5 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                {item}
              </div>
            ))}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Reason for visit (optional)
            </label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g., Annual checkup, follow-up for back pain"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all"
            />
          </div>

          <button
            onClick={handleStart}
            disabled={isLoading}
            className="w-full btn-primary py-3 text-base disabled:opacity-50"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Starting...
              </span>
            ) : 'Begin Intake'}
          </button>

          <p className="text-[11px] text-gray-400 mt-4 text-center">
            This process takes about 5-10 minutes. Your information will be reviewed by your healthcare team.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="page-container max-w-4xl h-full flex flex-col animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Patient Intake</h1>
        <p className="text-gray-400 mt-1">
          {complete ? 'Intake complete!' : 'Answer the questions to help us prepare for your visit'}
        </p>
      </div>

      {complete && intakeSummary && (
        <div className="mb-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl p-5 text-white shadow-sm animate-slide-up">
          <div className="flex items-center gap-2 mb-3">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <h3 className="text-sm font-bold">Intake Summary</h3>
          </div>
          <div className="text-sm text-green-50 space-y-1">
            {Object.entries(intakeSummary).map(([key, val]) => (
              <p key={key}>
                <strong className="capitalize text-white">{key.replace(/_/g, ' ')}:</strong>{' '}
                {Array.isArray(val) ? val.join(', ') : String(val)}
              </p>
            ))}
          </div>
          <button
            onClick={handleNewIntake}
            className="mt-4 px-5 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Start New Intake
          </button>
        </div>
      )}

      <div className="flex-1 min-h-0" style={{ height: 'calc(100vh - 280px)' }}>
        <ChatWindow
          messages={messages}
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          placeholder={complete ? 'Intake complete' : 'Type your response...'}
        />
      </div>
    </div>
  )
}
