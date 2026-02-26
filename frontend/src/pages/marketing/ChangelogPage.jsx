const entries = [
  {
    date: 'Feb 20, 2026',
    version: 'v2.4.0',
    tag: 'New',
    tagColor: 'bg-emerald-100 text-emerald-700',
    title: 'Watch Demo Product Tour',
    items: [
      'Interactive 5-step animated product walkthrough on the landing page',
      'Auto-advancing slides with manual navigation controls',
    ],
  },
  {
    date: 'Feb 10, 2026',
    version: 'v2.3.0',
    tag: 'Improvement',
    tagColor: 'bg-blue-100 text-blue-700',
    title: 'Nurse Dashboard Enhancements',
    items: [
      'Real-time priority alert cards with severity levels',
      'Improved shift handoff workflow with checklist templates',
      'Task completion tracking with team visibility',
    ],
  },
  {
    date: 'Jan 28, 2026',
    version: 'v2.2.0',
    tag: 'New',
    tagColor: 'bg-emerald-100 text-emerald-700',
    title: 'Virtual Nurse AI Triage',
    items: [
      '24/7 AI-powered patient symptom assessment chatbot',
      'Automatic escalation to providers for urgent cases',
      'Configurable triage protocols per specialty',
    ],
  },
  {
    date: 'Jan 15, 2026',
    version: 'v2.1.0',
    tag: 'Improvement',
    tagColor: 'bg-blue-100 text-blue-700',
    title: 'SOAP Note Accuracy Boost',
    items: [
      'Upgraded clinical NLP model with 12% improvement in ICD-10 code accuracy',
      'Added CPT code suggestions alongside diagnosis codes',
      'Support for multi-provider encounter notes',
    ],
  },
  {
    date: 'Dec 18, 2025',
    version: 'v2.0.0',
    tag: 'Major',
    tagColor: 'bg-purple-100 text-purple-700',
    title: 'CareFlow AI 2.0 Launch',
    items: [
      'Complete UI redesign with modern glass-card aesthetic',
      'Ambient recording with real-time transcription preview',
      'Multi-tenant architecture with super-admin portal',
      'Patient digital intake forms',
    ],
  },
  {
    date: 'Nov 5, 2025',
    version: 'v1.5.0',
    tag: 'Fix',
    tagColor: 'bg-amber-100 text-amber-700',
    title: 'Stability & Performance',
    items: [
      'Fixed audio recording dropout on iOS Safari',
      'Reduced note generation latency by 40%',
      'Improved HIPAA audit logging coverage',
    ],
  },
]

export default function ChangelogPage() {
  return (
    <div>
      {/* Hero */}
      <section className="py-20 sm:py-28 px-4 bg-gradient-to-br from-primary-50 via-white to-accent-50">
        <div className="max-w-3xl mx-auto text-center animate-fade-in">
          <div className="badge-indigo badge mb-4">Changelog</div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-6">
            What's <span className="gradient-text">new</span>
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            The latest updates, improvements, and fixes to CareFlow AI.
          </p>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="space-y-10">
            {entries.map((e) => (
              <div key={e.version} className="relative pl-8 border-l-2 border-primary-200">
                <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-gradient-to-br from-primary-500 to-accent-500" />
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="text-sm font-mono text-gray-400">{e.date}</span>
                  <span className="text-xs font-semibold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">{e.version}</span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${e.tagColor}`}>{e.tag}</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{e.title}</h3>
                <ul className="space-y-1">
                  {e.items.map((item, i) => (
                    <li key={i} className="text-sm text-gray-600 leading-relaxed flex items-start gap-2">
                      <span className="text-primary-400 mt-1">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
