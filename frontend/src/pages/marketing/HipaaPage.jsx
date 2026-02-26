export default function HipaaPage() {
  const safeguards = [
    {
      title: 'Encryption Everywhere',
      desc: 'AES-256 encryption at rest, TLS 1.3 in transit. Audio streams are encrypted end-to-end from device to AI processor.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
        </svg>
      ),
    },
    {
      title: 'Access Controls',
      desc: 'Role-based permissions, multi-factor authentication, and automatic session timeouts protect every account.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
        </svg>
      ),
    },
    {
      title: 'Audit Logging',
      desc: 'Every access, modification, and export of PHI is logged with timestamps, user IDs, and IP addresses.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9zm3.75 11.625a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
        </svg>
      ),
    },
    {
      title: 'Infrastructure Security',
      desc: 'SOC 2 Type II certified cloud hosting with isolated VPCs, network segmentation, and intrusion detection.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-16.5-3a3 3 0 013-3h13.5a3 3 0 013 3m-19.5 0a4.5 4.5 0 01.9-2.7L5.737 5.1a3.375 3.375 0 012.7-1.35h7.126c1.062 0 2.062.5 2.7 1.35l2.587 3.45a4.5 4.5 0 01.9 2.7m0 0a3 3 0 01-3 3m0 3h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008zm-3 6h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008z" />
        </svg>
      ),
    },
    {
      title: 'Employee Training',
      desc: 'All team members complete HIPAA training annually. Only authorized personnel can access production systems.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342" />
        </svg>
      ),
    },
    {
      title: 'Breach Response',
      desc: '24-hour incident response team with documented breach notification procedures meeting HIPAA timelines.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
        </svg>
      ),
    },
  ]

  return (
    <div>
      {/* Hero */}
      <section className="py-20 sm:py-28 px-4 bg-gradient-to-br from-primary-50 via-white to-accent-50">
        <div className="max-w-3xl mx-auto text-center animate-fade-in">
          <div className="badge-indigo badge mb-4">Compliance</div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-6">
            HIPAA <span className="gradient-text">Compliance</span>
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            Protecting patient data isn't a feature — it's the foundation of everything we build.
          </p>
        </div>
      </section>

      {/* Overview */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Commitment</h2>
          <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
            <p>
              CareFlow AI is fully compliant with the Health Insurance Portability and Accountability Act (HIPAA), including the Privacy Rule, Security Rule, and Breach Notification Rule. We implement administrative, physical, and technical safeguards to protect the confidentiality, integrity, and availability of all protected health information (PHI) processed through our platform.
            </p>
            <p>
              We execute Business Associate Agreements (BAAs) with all covered entities before processing any PHI. Our compliance program includes regular risk assessments, ongoing monitoring, and annual third-party audits.
            </p>
          </div>
        </div>
      </section>

      {/* Safeguards grid */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <div className="badge-cyan badge mb-4">Safeguards</div>
            <h2 className="text-3xl font-bold text-gray-900">How we protect your data</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {safeguards.map((s) => (
              <div key={s.title} className="glass-card p-6 hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center text-primary-600 mb-4">
                  {s.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Certifications & Standards</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {['HIPAA', 'SOC 2 Type II', 'HITRUST CSF', 'FHIR R4'].map((cert) => (
              <div key={cert} className="glass-card p-5 flex items-center justify-center">
                <span className="font-bold text-gray-900">{cert}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
