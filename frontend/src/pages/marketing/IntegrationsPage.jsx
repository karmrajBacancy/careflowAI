import { Link } from 'react-router-dom'

const integrations = [
  {
    name: 'Epic EHR',
    category: 'EHR',
    desc: 'Bi-directional sync with Epic for patient data, notes, and billing codes.',
    status: 'Live',
  },
  {
    name: 'Cerner',
    category: 'EHR',
    desc: 'Seamless integration with Oracle Cerner for clinical workflows and documentation.',
    status: 'Live',
  },
  {
    name: 'Athenahealth',
    category: 'EHR',
    desc: 'Connect CareFlow AI notes directly into Athenahealth encounters.',
    status: 'Live',
  },
  {
    name: 'Allscripts',
    category: 'EHR',
    desc: 'Push AI-generated notes and codes to Allscripts Professional or Touchworks.',
    status: 'Beta',
  },
  {
    name: 'HL7 FHIR',
    category: 'Standards',
    desc: 'Standards-based interoperability via FHIR R4 APIs for any compliant system.',
    status: 'Live',
  },
  {
    name: 'Zoom for Healthcare',
    category: 'Telehealth',
    desc: 'Record and transcribe telehealth visits directly from Zoom meetings.',
    status: 'Live',
  },
  {
    name: 'Microsoft Teams',
    category: 'Telehealth',
    desc: 'Ambient documentation for virtual visits conducted via Teams.',
    status: 'Beta',
  },
  {
    name: 'Surescripts',
    category: 'Pharmacy',
    desc: 'E-prescribing integration for medication orders generated from AI notes.',
    status: 'Coming Soon',
  },
]

export default function IntegrationsPage() {
  return (
    <div>
      {/* Hero */}
      <section className="py-20 sm:py-28 px-4 bg-gradient-to-br from-primary-50 via-white to-accent-50">
        <div className="max-w-3xl mx-auto text-center animate-fade-in">
          <div className="badge-cyan badge mb-4">Integrations</div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-6">
            Connects with the tools you <span className="gradient-text">already use</span>
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            CareFlow AI plugs into your existing EHR, telehealth platform, and clinical systems — no rip-and-replace required.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {integrations.map((i) => (
              <div key={i.name} className="glass-card p-6 hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">{i.category}</span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    i.status === 'Live' ? 'bg-emerald-100 text-emerald-700' :
                    i.status === 'Beta' ? 'bg-amber-100 text-amber-700' :
                    'bg-gray-100 text-gray-600'
                  }`}>{i.status}</span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center text-primary-700 font-bold text-lg mb-3">
                  {i.name.charAt(0)}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{i.name}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{i.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Don't see your system?</h2>
          <p className="text-gray-600 mb-6">We're adding new integrations every month. Let us know what you need.</p>
          <Link to="/contact" className="btn-primary px-6 py-3 text-sm">Request an Integration</Link>
        </div>
      </section>
    </div>
  )
}
