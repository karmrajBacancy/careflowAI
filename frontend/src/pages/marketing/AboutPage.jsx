const values = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
      </svg>
    ),
    title: 'Innovation',
    desc: 'We push the boundaries of what AI can do for healthcare, always with clinical rigor.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    title: 'Privacy First',
    desc: 'HIPAA compliance isn\'t an afterthought — it\'s built into every layer of our architecture.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
    title: 'Simplicity',
    desc: 'Complex technology, simple interface. If it takes training to use, we haven\'t done our job.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
      </svg>
    ),
    title: 'Patient Care',
    desc: 'Every feature we build is measured against one question: does this help patients get better care?',
  },
]

const team = [
  { name: 'Dr. Anika Patel', title: 'CEO & Co-Founder', bio: 'Former ER physician with 12 years of clinical experience. Founded CareFlow AI to solve the documentation crisis she lived every day.' },
  { name: 'Marcus Chen', title: 'CTO & Co-Founder', bio: 'ML engineer from Stanford. Previously led NLP teams at a major health-tech company. Obsessed with clinical accuracy.' },
  { name: 'Dr. James Whitfield', title: 'Chief Medical Officer', bio: 'Board-certified internist and health informatics specialist. Ensures every AI output meets clinical standards.' },
  { name: 'Priya Sharma', title: 'VP of Engineering', bio: 'Scaled infrastructure at two healthcare unicorns. Leads the team building our HIPAA-compliant cloud platform.' },
]

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="py-20 sm:py-28 px-4 bg-gradient-to-br from-primary-50 via-white to-accent-50">
        <div className="max-w-3xl mx-auto text-center animate-fade-in">
          <div className="badge-indigo badge mb-4">Our Mission</div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-6">
            Reducing physician burnout with <span className="gradient-text">AI</span>
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            We believe doctors should spend their time healing, not typing. CareFlow AI exists to give clinicians back the hours lost to documentation.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Why CareFlow AI exists</h2>
          <div className="space-y-4 text-gray-600 leading-relaxed">
            <p>
              Physicians spend nearly two hours on documentation for every one hour of patient care. That's not a technology problem — it's a human cost. Burnout rates among clinicians have reached crisis levels, with over 60% of doctors reporting symptoms. The paperwork isn't just tedious; it's driving talented people out of medicine.
            </p>
            <p>
              CareFlow AI was born in an emergency room. Our co-founder, Dr. Anika Patel, spent years watching colleagues stay hours after their shifts, hunched over computers, finishing notes they couldn't complete during patient visits. She partnered with AI researcher Marcus Chen to build a system that listens during the encounter and generates accurate, structured clinical notes — giving doctors their time and energy back where it matters most: with patients.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <div className="badge-cyan badge mb-4">Our Values</div>
            <h2 className="text-3xl font-bold text-gray-900">What drives us</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => (
              <div key={v.title} className="glass-card p-6 text-center hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center text-primary-600 mx-auto mb-4">
                  {v.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{v.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <div className="badge-indigo badge mb-4">Team</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Meet the people behind CareFlow AI</h2>
            <p className="text-gray-600 max-w-xl mx-auto">A team of clinicians, engineers, and healthcare experts united by one goal.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((t) => (
              <div key={t.name} className="glass-card p-6 text-center hover:-translate-y-1 transition-all duration-300">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-200 to-accent-200 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary-700">
                    {t.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900">{t.name}</h3>
                <p className="text-sm text-primary-600 mb-3">{t.title}</p>
                <p className="text-sm text-gray-600 leading-relaxed">{t.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
