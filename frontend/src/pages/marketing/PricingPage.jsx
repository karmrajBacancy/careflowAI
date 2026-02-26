import { useState } from 'react'
import { Link } from 'react-router-dom'

const tiers = [
  {
    name: 'Starter',
    price: 'Free',
    period: '',
    desc: 'Perfect for solo practitioners getting started with AI documentation.',
    features: ['5 encounters / month', '1 provider', 'Basic SOAP notes', 'Standard support', 'Community access'],
    cta: 'Start Free',
    highlighted: false,
  },
  {
    name: 'Professional',
    price: '$49',
    period: '/mo',
    desc: 'For growing practices that need the full power of CareFlow AI.',
    features: [
      'Unlimited encounters',
      'Up to 10 providers',
      'Full SOAP + H&P notes',
      'ICD-10 & CPT codes',
      'Virtual Nurse AI',
      'Smart Triage',
      'Priority support',
    ],
    cta: 'Get Started',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    desc: 'For hospitals and large health systems with advanced needs.',
    features: [
      'Unlimited everything',
      'Unlimited providers',
      'SSO & SAML',
      'HIPAA BAA included',
      'Dedicated account manager',
      'Custom integrations',
      'On-premise option',
    ],
    cta: 'Contact Sales',
    highlighted: false,
  },
]

const comparisonRows = [
  { feature: 'Monthly encounters', starter: '5', pro: 'Unlimited', enterprise: 'Unlimited' },
  { feature: 'Providers', starter: '1', pro: '10', enterprise: 'Unlimited' },
  { feature: 'SOAP Notes', starter: true, pro: true, enterprise: true },
  { feature: 'H&P Reports', starter: false, pro: true, enterprise: true },
  { feature: 'ICD-10 / CPT Codes', starter: false, pro: true, enterprise: true },
  { feature: 'Virtual Nurse AI', starter: false, pro: true, enterprise: true },
  { feature: 'Smart Triage', starter: false, pro: true, enterprise: true },
  { feature: 'Patient Intake Forms', starter: true, pro: true, enterprise: true },
  { feature: 'Nurse Dashboard', starter: false, pro: true, enterprise: true },
  { feature: 'SSO / SAML', starter: false, pro: false, enterprise: true },
  { feature: 'HIPAA BAA', starter: false, pro: false, enterprise: true },
  { feature: 'Dedicated Support', starter: false, pro: false, enterprise: true },
]

const faqs = [
  {
    q: 'Is CareFlow AI HIPAA compliant?',
    a: 'Yes. CareFlow AI is fully HIPAA compliant. All data is encrypted at rest and in transit, and we sign Business Associate Agreements (BAAs) with all Enterprise customers.',
  },
  {
    q: 'Can I try CareFlow AI before committing?',
    a: 'Absolutely. Our Starter plan is free and gives you 5 encounters per month to experience the platform. No credit card required.',
  },
  {
    q: 'How accurate are the AI-generated notes?',
    a: 'Our clinical notes achieve 98% accuracy as validated by board-certified physicians. Every note is presented for your review before signing.',
  },
  {
    q: 'Does it integrate with my EHR?',
    a: 'CareFlow AI integrates with major EHR systems including Epic, Cerner, and Athenahealth. Enterprise plans include custom integration support.',
  },
  {
    q: 'What happens to my data if I cancel?',
    a: 'Your data remains accessible for 90 days after cancellation. You can export all records at any time. After 90 days, data is securely deleted per HIPAA guidelines.',
  },
  {
    q: 'Do you offer discounts for non-profits or academic institutions?',
    a: 'Yes, we offer special pricing for non-profit healthcare organizations and academic medical centers. Contact our sales team for details.',
  },
]

function CheckIcon() {
  return (
    <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  )
}

function CrossIcon() {
  return (
    <svg className="w-5 h-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}

function CellValue({ value }) {
  if (value === true) return <CheckIcon />
  if (value === false) return <CrossIcon />
  return <span className="text-sm font-medium text-gray-700">{value}</span>
}

export default function PricingPage() {
  const [openFaq, setOpenFaq] = useState(null)

  return (
    <div>
      {/* Header */}
      <section className="py-20 sm:py-28 px-4 bg-gradient-to-br from-primary-50 via-white to-accent-50">
        <div className="max-w-3xl mx-auto text-center animate-fade-in">
          <div className="badge-indigo badge mb-4">Pricing</div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4">
            Simple, transparent pricing
          </h1>
          <p className="text-lg text-gray-600">
            Start free, upgrade when you're ready. No hidden fees, no long-term contracts.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 px-4 -mt-8">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6 items-start">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1 ${
                tier.highlighted
                  ? 'bg-gradient-to-br from-primary-600 to-accent-600 text-white shadow-xl ring-4 ring-primary-200 scale-105'
                  : 'glass-card'
              }`}
            >
              {tier.highlighted && (
                <div className="text-xs font-bold uppercase tracking-wider text-accent-200 mb-3">
                  Most Popular
                </div>
              )}
              <h3 className={`text-xl font-bold mb-1 ${tier.highlighted ? 'text-white' : 'text-gray-900'}`}>
                {tier.name}
              </h3>
              <div className="flex items-baseline gap-1 mb-3">
                <span className={`text-4xl font-extrabold ${tier.highlighted ? 'text-white' : 'text-gray-900'}`}>
                  {tier.price}
                </span>
                {tier.period && (
                  <span className={`text-sm ${tier.highlighted ? 'text-primary-100' : 'text-gray-500'}`}>
                    {tier.period}
                  </span>
                )}
              </div>
              <p className={`text-sm mb-6 ${tier.highlighted ? 'text-primary-100' : 'text-gray-600'}`}>
                {tier.desc}
              </p>
              <ul className="space-y-3 mb-8">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <svg
                      className={`w-4 h-4 flex-shrink-0 ${tier.highlighted ? 'text-accent-300' : 'text-green-500'}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    <span className={tier.highlighted ? 'text-white/90' : 'text-gray-700'}>{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                to={tier.name === 'Enterprise' ? '/contact' : '/login'}
                className={`block text-center py-2.5 rounded-xl font-medium transition-all text-sm ${
                  tier.highlighted
                    ? 'bg-white text-primary-700 hover:bg-primary-50'
                    : 'btn-primary w-full'
                }`}
              >
                {tier.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">Feature comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-3 pr-4 text-sm font-semibold text-gray-900">Feature</th>
                  <th className="py-3 px-4 text-sm font-semibold text-gray-900 text-center">Starter</th>
                  <th className="py-3 px-4 text-sm font-semibold text-primary-600 text-center">Professional</th>
                  <th className="py-3 pl-4 text-sm font-semibold text-gray-900 text-center">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row) => (
                  <tr key={row.feature} className="border-b border-gray-100">
                    <td className="py-3 pr-4 text-sm text-gray-700">{row.feature}</td>
                    <td className="py-3 px-4 text-center"><div className="flex justify-center"><CellValue value={row.starter} /></div></td>
                    <td className="py-3 px-4 text-center bg-primary-50/30"><div className="flex justify-center"><CellValue value={row.pro} /></div></td>
                    <td className="py-3 pl-4 text-center"><div className="flex justify-center"><CellValue value={row.enterprise} /></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">Frequently asked questions</h2>
            <p className="text-gray-600">Can't find what you're looking for? <Link to="/contact" className="text-primary-600 hover:underline">Contact us</Link>.</p>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="glass-card overflow-hidden">
                <button
                  className="w-full flex items-center justify-between p-5 text-left"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="font-medium text-gray-900 text-sm">{faq.q}</span>
                  <svg
                    className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-200 ${openFaq === i ? 'rotate-180' : ''}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 text-sm text-gray-600 leading-relaxed animate-fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
