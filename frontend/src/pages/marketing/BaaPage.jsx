import { Link } from 'react-router-dom'

export default function BaaPage() {
  return (
    <div>
      {/* Hero */}
      <section className="py-20 sm:py-28 px-4 bg-gradient-to-br from-primary-50 via-white to-accent-50">
        <div className="max-w-3xl mx-auto text-center animate-fade-in">
          <div className="badge-indigo badge mb-4">Legal</div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-6">
            Business Associate <span className="gradient-text">Agreement</span>
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            We sign BAAs with every covered entity before any PHI touches our platform.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-3xl mx-auto space-y-10">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">What is a BAA?</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              A Business Associate Agreement is a legally binding contract required under HIPAA between a covered entity (your healthcare organization) and a business associate (CareFlow AI) that handles protected health information on your behalf. The BAA establishes the permitted uses and disclosures of PHI, requires appropriate safeguards, and ensures accountability for data protection.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Our BAA Covers</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { title: 'Permitted Uses of PHI', desc: 'Strictly limited to providing and improving clinical documentation services.' },
                { title: 'Safeguard Requirements', desc: 'Administrative, physical, and technical safeguards to prevent unauthorized access.' },
                { title: 'Breach Notification', desc: 'Commitment to notify your organization within 24 hours of discovering any breach.' },
                { title: 'Subcontractor Obligations', desc: 'All subcontractors who access PHI are bound by equivalent BAA terms.' },
                { title: 'Data Return & Destruction', desc: 'Upon termination, all PHI is returned or securely destroyed within 30 days.' },
                { title: 'Audit Rights', desc: 'Your organization retains the right to audit our compliance practices.' },
              ].map((item) => (
                <div key={item.title} className="glass-card p-5">
                  <h3 className="font-semibold text-gray-900 mb-1 text-sm">{item.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">How to Get a BAA</h2>
            <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
              <p>Executing a BAA with CareFlow AI is straightforward:</p>
              <ol className="list-decimal pl-5 space-y-2">
                <li><strong>Sign up</strong> for a CareFlow AI account and select a paid plan (BAAs are included with all paid tiers at no additional cost).</li>
                <li><strong>Review</strong> our standard BAA, which is available during onboarding and meets or exceeds HIPAA requirements.</li>
                <li><strong>Execute</strong> the agreement electronically. Both parties receive a signed copy for their records.</li>
                <li><strong>Custom terms:</strong> Enterprise customers requiring modifications to our standard BAA can work with our legal team for tailored agreements.</li>
              </ol>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {[
                { q: 'Is the BAA included in all plans?', a: 'Yes, BAAs are included with all paid plans at no additional cost. The free tier does not include a BAA and should not be used with real patient data.' },
                { q: 'Can we use our own BAA template?', a: 'Enterprise customers can work with our legal team to negotiate custom BAA terms. Contact us to discuss your requirements.' },
                { q: 'How quickly can we execute a BAA?', a: 'Our standard BAA can be executed electronically in minutes during onboarding. Custom agreements typically take 5–10 business days.' },
                { q: 'Does the BAA cover all CareFlow AI features?', a: 'Yes. The BAA covers all services including ambient recording, note generation, virtual nurse, and the nursing dashboard.' },
              ].map((faq) => (
                <div key={faq.q} className="glass-card p-5">
                  <h4 className="font-semibold text-gray-900 mb-1 text-sm">{faq.q}</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center py-8">
            <h2 className="text-xl font-bold text-gray-900 mb-3">Ready to get started?</h2>
            <p className="text-sm text-gray-600 mb-6">Sign up for a paid plan and execute your BAA in minutes.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link to="/login" className="btn-primary px-6 py-2.5 text-sm">Get Started</Link>
              <Link to="/contact" className="btn-secondary px-6 py-2.5 text-sm">Contact Legal Team</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
