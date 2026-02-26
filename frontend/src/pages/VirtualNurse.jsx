import { useState } from 'react'
import ChatWindow from '../components/ChatWindow'
import TriageCard from '../components/TriageCard'
import { sendChatMessage, assessTriage } from '../utils/api'

export default function VirtualNurse() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hello! I'm your virtual nursing assistant. I'm an AI, not a human nurse. How can I help you today?",
    },
  ])
  const [sessionId, setSessionId] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [triageResult, setTriageResult] = useState(null)
  const [showTriage, setShowTriage] = useState(false)
  const [triageInput, setTriageInput] = useState('')
  const [triageLoading, setTriageLoading] = useState(false)

  const handleSendMessage = async (message) => {
    setMessages(prev => [...prev, { role: 'user', content: message }])
    setIsLoading(true)

    try {
      const result = await sendChatMessage(message, sessionId)
      setSessionId(result.session_id)
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: result.message,
          escalation: result.escalation,
        },
      ])
    } catch (e) {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, I encountered an error. If this is an emergency, please call 911.',
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleTriage = async () => {
    if (!triageInput.trim()) return
    setTriageLoading(true)
    try {
      const result = await assessTriage(triageInput)
      setTriageResult(result)
    } catch {
      alert('Triage assessment failed')
    } finally {
      setTriageLoading(false)
    }
  }

  return (
    <div className="page-container max-w-6xl h-full flex flex-col animate-fade-in">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Virtual Nursing Assistant</h1>
        </div>
        <p className="text-gray-400 mt-1 ml-11">Patient-facing AI chat for intake, questions, and symptom assessment</p>
      </div>

      <div className="flex-1 grid grid-cols-12 gap-6 min-h-0">
        {/* Chat */}
        <div className="col-span-8 flex flex-col min-h-0" style={{ height: 'calc(100vh - 200px)' }}>
          <ChatWindow
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            placeholder="Describe your symptoms or ask a question..."
          />
        </div>

        {/* Sidebar — Triage */}
        <div className="col-span-4 space-y-4">
          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Quick Triage Assessment
            </h3>
            <textarea
              value={triageInput}
              onChange={(e) => setTriageInput(e.target.value)}
              rows={4}
              placeholder="Describe symptoms for triage (e.g., 'severe headache for 3 days with vision changes')"
              className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 mb-3 transition-all"
            />
            <button
              onClick={handleTriage}
              disabled={!triageInput.trim() || triageLoading}
              className="w-full btn-primary disabled:opacity-50"
            >
              {triageLoading ? 'Assessing...' : 'Assess Triage Level'}
            </button>
          </div>

          {triageResult && <TriageCard result={triageResult} />}

          {/* Disclaimer */}
          <div className="px-4 py-3 bg-yellow-50/80 rounded-xl border border-yellow-100">
            <p className="text-[11px] text-yellow-700 leading-relaxed">
              <strong>Disclaimer:</strong> This AI assistant does not diagnose, prescribe, or replace professional medical advice.
              For emergencies, call 911.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
