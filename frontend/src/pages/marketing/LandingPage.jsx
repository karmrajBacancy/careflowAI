import { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const demoSlides = [
  {
    step: 1,
    title: 'Dashboard',
    description: 'Your clinical command center — see patients, stats, and tasks at a glance.',
    render: () => (
      <div className="space-y-3">
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Patients Today', value: '24', color: 'from-primary-500 to-primary-600' },
            { label: 'Notes Pending', value: '3', color: 'from-amber-400 to-orange-500' },
            { label: 'Avg Wait Time', value: '8m', color: 'from-emerald-400 to-teal-500' },
          ].map((c) => (
            <div key={c.label} className={`bg-gradient-to-br ${c.color} rounded-xl p-3 text-white`}>
              <div className="text-2xl font-bold">{c.value}</div>
              <div className="text-xs opacity-80">{c.label}</div>
            </div>
          ))}
        </div>
        <div className="bg-white/10 backdrop-blur rounded-xl border border-white/10 p-3">
          <div className="text-xs font-semibold text-gray-400 mb-2">Upcoming Patients</div>
          {['Sarah M. — Follow-up', 'James K. — New Visit', 'Ana R. — Lab Review'].map((p, i) => (
            <div key={i} className="flex items-center justify-between py-1.5 border-b border-white/5 last:border-0">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-400 to-accent-400" />
                <span className="text-sm text-gray-300">{p}</span>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full ${i === 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-500/20 text-gray-400'}`}>
                {i === 0 ? 'Now' : `${10 + i * 15}m`}
              </span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    step: 2,
    title: 'Record Encounter',
    description: 'AI listens while you care — ambient recording captures every detail naturally.',
    render: () => (
      <div className="space-y-4">
        <div className="flex items-center justify-center gap-3 py-4">
          <span className="relative flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500" />
          </span>
          <span className="text-red-400 font-semibold text-sm tracking-wide uppercase">Recording</span>
          <span className="text-gray-500 text-sm ml-2">02:34</span>
        </div>
        <div className="flex items-center justify-center gap-[3px] h-16">
          {Array.from({ length: 40 }).map((_, i) => (
            <div
              key={i}
              className="w-1 rounded-full bg-gradient-to-t from-primary-500 to-accent-400"
              style={{
                height: `${12 + Math.sin(i * 0.5) * 20 + Math.random() * 24}px`,
                opacity: 0.5 + Math.random() * 0.5,
              }}
            />
          ))}
        </div>
        <div className="bg-white/5 rounded-xl border border-white/10 p-3 space-y-2">
          <div className="text-xs text-gray-500">Live Transcript</div>
          <p className="text-sm text-gray-300 leading-relaxed">
            "...patient reports intermittent chest tightness for the past two weeks, primarily with exertion. No associated shortness of breath or diaphoresis..."
          </p>
          <div className="h-4 w-3/4 bg-white/5 rounded animate-pulse" />
        </div>
      </div>
    ),
  },
  {
    step: 3,
    title: 'AI Clinical Notes',
    description: 'SOAP notes generated in seconds — structured, coded, and ready to sign.',
    render: () => (
      <div className="space-y-2">
        {[
          { section: 'Subjective', color: 'bg-blue-500', text: 'Pt reports intermittent chest tightness x 2 weeks, worse with exertion. Denies SOB, diaphoresis.' },
          { section: 'Objective', color: 'bg-emerald-500', text: 'BP 132/84, HR 78, RR 16. Cardiac: RRR, no murmurs. Lungs: CTA bilaterally.' },
          { section: 'Assessment', color: 'bg-amber-500', text: 'Atypical chest pain (R07.9). Low-risk by HEART score. Consider stress test.' },
          { section: 'Plan', color: 'bg-purple-500', text: 'Order exercise stress test, BMP, lipid panel. Follow up in 1 week.' },
        ].map((s) => (
          <div key={s.section} className="bg-white/5 rounded-lg border border-white/10 p-3">
            <div className="flex items-center gap-2 mb-1">
              <div className={`w-2 h-2 rounded-full ${s.color}`} />
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{s.section}</span>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed">{s.text}</p>
          </div>
        ))}
      </div>
    ),
  },
  {
    step: 4,
    title: 'Virtual Nurse',
    description: '24/7 AI triage assistant — answers patient questions and escalates when needed.',
    render: () => (
      <div className="space-y-3 max-w-sm mx-auto">
        {[
          { from: 'patient', text: "I've had a headache for 3 days and some blurry vision." },
          { from: 'ai', text: "I'm sorry to hear that. Let me ask a few questions to help assess this. On a scale of 1–10, how severe is your headache?" },
          { from: 'patient', text: "About a 7. It's mostly behind my eyes." },
          { from: 'ai', text: "Thank you. Given the duration and visual symptoms, I recommend scheduling an urgent visit. I've flagged this for your care team.", flag: true },
        ].map((m, i) => (
          <div key={i} className={`flex ${m.from === 'patient' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
              m.from === 'patient'
                ? 'bg-primary-600 text-white rounded-br-md'
                : 'bg-white/10 text-gray-300 border border-white/10 rounded-bl-md'
            }`}>
              {m.text}
              {m.flag && (
                <div className="mt-2 flex items-center gap-1.5 text-xs text-amber-400 font-medium">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.168 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 6a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 6zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" /></svg>
                  Escalated to provider
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    step: 5,
    title: 'Nurse Dashboard',
    description: 'Real-time team monitoring — alerts, tasks, and shift handoffs in one place.',
    render: () => (
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: 'Active Patients', value: '18', icon: '👥' },
            { label: 'Pending Tasks', value: '7', icon: '📋' },
          ].map((c) => (
            <div key={c.label} className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center gap-3">
              <span className="text-xl">{c.icon}</span>
              <div>
                <div className="text-lg font-bold text-white">{c.value}</div>
                <div className="text-xs text-gray-400">{c.label}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-3">
          <div className="text-xs font-semibold text-gray-400 mb-2">Priority Alerts</div>
          {[
            { text: 'Room 4 — Vitals overdue', level: 'bg-red-500/20 text-red-400' },
            { text: 'Room 7 — Med due in 10 min', level: 'bg-amber-500/20 text-amber-400' },
            { text: 'Room 2 — Discharge ready', level: 'bg-emerald-500/20 text-emerald-400' },
          ].map((a, i) => (
            <div key={i} className={`text-xs px-3 py-2 rounded-lg mb-1.5 last:mb-0 ${a.level}`}>{a.text}</div>
          ))}
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-3">
          <div className="text-xs font-semibold text-gray-400 mb-2">Task List</div>
          {['Administer IV antibiotics — Rm 3', 'Update care plan — Rm 5', 'Patient education — Rm 8'].map((t, i) => (
            <div key={i} className="flex items-center gap-2 py-1.5 text-sm text-gray-300 border-b border-white/5 last:border-0">
              <div className={`w-4 h-4 rounded border ${i === 0 ? 'bg-primary-500 border-primary-500' : 'border-gray-600'} flex items-center justify-center`}>
                {i === 0 && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
              </div>
              <span className={i === 0 ? 'line-through text-gray-500' : ''}>{t}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
]

function DemoModal({ open, onClose }) {
  const navigate = useNavigate()
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)

  const goTo = useCallback((i) => {
    setCurrent(i)
    setPaused(true)
  }, [])

  const next = useCallback(() => {
    setCurrent((prev) => Math.min(prev + 1, demoSlides.length - 1))
    setPaused(true)
  }, [])

  const prev = useCallback(() => {
    setCurrent((prev) => Math.max(prev - 1, 0))
    setPaused(true)
  }, [])

  // Auto-advance every 4s unless paused
  useEffect(() => {
    if (!open || paused || current >= demoSlides.length - 1) return
    const timer = setInterval(() => {
      setCurrent((prev) => {
        if (prev >= demoSlides.length - 1) { clearInterval(timer); return prev }
        return prev + 1
      })
    }, 4000)
    return () => clearInterval(timer)
  }, [open, paused, current])

  // Escape key closes
  useEffect(() => {
    if (!open) return
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  // Reset on open
  useEffect(() => {
    if (open) { setCurrent(0); setPaused(false) }
  }, [open])

  if (!open) return null

  const slide = demoSlides[current]
  const isLast = current === demoSlides.length - 1

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative w-full max-w-4xl glass-card bg-gray-900/90 border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <h2 className="text-lg font-bold text-white">
            CareFlow AI — <span className="gradient-text">Product Tour</span>
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors p-1">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Step badge + title */}
          <div className="flex items-center gap-3 mb-2">
            <span className="badge-indigo badge text-xs">Step {slide.step} / {demoSlides.length}</span>
            <h3 className="text-xl font-bold text-white">{slide.title}</h3>
          </div>
          <p className="text-sm text-gray-400 mb-5">{slide.description}</p>

          {/* Mock UI */}
          <div className="bg-gray-800/60 rounded-xl border border-white/5 p-4 min-h-[260px]">
            {slide.render()}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-white/10">
          <button
            onClick={prev}
            disabled={current === 0}
            className="btn-secondary px-4 py-2 text-sm disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Prev
          </button>

          {/* Dots */}
          <div className="flex items-center gap-2">
            {demoSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  i === current ? 'bg-primary-500 scale-125' : 'bg-gray-600 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>

          {isLast ? (
            <button
              onClick={() => { onClose(); navigate('/login') }}
              className="btn-primary px-5 py-2 text-sm"
            >
              Get Started Free
            </button>
          ) : (
            <button onClick={next} className="btn-primary px-4 py-2 text-sm">
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

const features = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
      </svg>
    ),
    title: 'Ambient Documentation',
    desc: 'Record patient encounters naturally. Our AI listens and documents everything in real-time.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
    title: 'AI Clinical Notes',
    desc: 'Generate SOAP notes, H&P reports, and discharge summaries with structured ICD-10 and CPT codes.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
      </svg>
    ),
    title: 'Virtual Nurse',
    desc: 'AI-powered patient triage and symptom assessment available 24/7 for your practice.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
    title: 'Smart Triage',
    desc: 'Automatically classify patient urgency levels and route cases to the right provider instantly.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ),
    title: 'Patient Intake',
    desc: 'Digital intake forms that feed directly into the clinical workflow — no more clipboard paperwork.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
    title: 'Nurse Dashboard',
    desc: 'Real-time patient monitoring, task management, and shift handoff tools for nursing teams.',
  },
]

const steps = [
  { num: '1', title: 'Record', desc: 'Start an ambient recording during the patient encounter.' },
  { num: '2', title: 'AI Generates', desc: 'Our AI produces structured clinical notes with codes in seconds.' },
  { num: '3', title: 'Review & Sign', desc: 'Review, edit if needed, and sign off — documentation complete.' },
]

const stats = [
  { value: '500+', label: 'Encounters Processed' },
  { value: '98%', label: 'Accuracy Rate' },
  { value: '10 min', label: 'Saved Per Visit' },
  { value: 'HIPAA', label: 'Fully Compliant' },
]

const testimonials = [
  {
    quote: "CareFlow AI cut my documentation time in half. I actually get to leave the office on time now.",
    name: 'Dr. Sarah Chen',
    role: 'Family Medicine, Valley Health',
  },
  {
    quote: "The ambient recording is incredible — it captures details I used to miss. My notes have never been this thorough.",
    name: 'Dr. James Okafor',
    role: 'Internal Medicine, Metro Clinic',
  },
  {
    quote: "Our nursing team loves the dashboard. Shift handoffs are seamless and nothing falls through the cracks.",
    name: 'Maria Gonzalez, RN',
    role: 'Nurse Manager, Summit Hospital',
  },
]

export default function LandingPage() {
  const [demoOpen, setDemoOpen] = useState(false)

  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="relative py-24 sm:py-32 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-accent-50 -z-10" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200/30 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent-200/20 rounded-full blur-3xl -z-10" />

        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          <div className="badge-indigo badge mb-6">AI-Powered Healthcare Platform</div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
            AI-Powered Clinical Intelligence for{' '}
            <span className="gradient-text">Modern Healthcare</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Reduce documentation burden by 70%. CareFlow AI listens to patient encounters and generates
            accurate clinical notes, SOAP reports, and billing codes — so you can focus on patient care.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/login" className="btn-primary px-8 py-3 text-base">
              Get Started Free
            </Link>
            <button onClick={() => setDemoOpen(true)} className="btn-secondary px-8 py-3 text-base flex items-center gap-2">
              <svg className="w-5 h-5 text-primary-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              Watch Demo
            </button>
          </div>
        </div>
      </section>

      {/* Trusted By */}
      <section className="py-12 border-y border-gray-100 bg-white">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p className="text-sm font-medium text-gray-500 mb-1">Trusted by <span className="text-primary-600 font-bold">500+</span> healthcare providers nationwide</p>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 sm:py-28 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <div className="badge-cyan badge mb-4">Features</div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Everything your practice needs
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              From ambient documentation to AI triage, CareFlow AI provides a complete suite of tools to modernize your clinical workflow.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="glass-card p-6 hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center text-primary-600 mb-4 group-hover:scale-110 transition-transform">
                  {f.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 sm:py-28 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="badge-indigo badge mb-4">How It Works</div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Three simple steps</h2>
            <p className="text-gray-600 max-w-xl mx-auto">Get from patient encounter to signed clinical note in minutes, not hours.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((s, i) => (
              <div key={s.title} className="relative text-center">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-600 to-accent-500 text-white text-xl font-bold flex items-center justify-center mx-auto mb-5">
                  {s.num}
                </div>
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-7 left-[60%] w-[80%] h-px bg-gradient-to-r from-primary-300 to-accent-300" />
                )}
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-sm text-gray-600">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary-600 to-accent-600">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <div className="text-3xl sm:text-4xl font-extrabold text-white mb-1">{s.value}</div>
              <div className="text-sm text-primary-100">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 sm:py-28 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="badge-cyan badge mb-4">Testimonials</div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Loved by clinicians</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="glass-card p-6">
                <svg className="w-8 h-8 text-primary-200 mb-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151C7.546 6.068 5.983 8.789 5.983 11H10v10H0z" />
                </svg>
                <p className="text-gray-700 leading-relaxed mb-6 italic">"{t.quote}"</p>
                <div>
                  <div className="font-semibold text-gray-900 text-sm">{t.name}</div>
                  <div className="text-xs text-gray-500">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary-700 via-primary-600 to-accent-600">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to transform your practice?
          </h2>
          <p className="text-primary-100 mb-8 text-lg">
            Join 500+ providers who spend less time on paperwork and more time with patients.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/login" className="px-8 py-3 bg-white text-primary-700 font-semibold rounded-xl hover:bg-primary-50 transition-colors">
              Get Started Free
            </Link>
            <Link to="/contact" className="px-8 py-3 border border-white/30 text-white font-medium rounded-xl hover:bg-white/10 transition-colors">
              Contact Sales
            </Link>
          </div>
        </div>
      </section>

      <DemoModal open={demoOpen} onClose={() => setDemoOpen(false)} />
    </div>
  )
}
