import { Link } from 'react-router-dom'

const posts = [
  {
    tag: 'Product',
    tagColor: 'badge-indigo',
    title: 'Introducing the CareFlow AI Product Tour',
    excerpt: 'Take a guided walkthrough of every major feature — from ambient recording to the nurse dashboard — without signing up.',
    date: 'Feb 20, 2026',
    readTime: '3 min read',
  },
  {
    tag: 'Clinical AI',
    tagColor: 'badge-cyan',
    title: 'How Ambient AI Documentation Reduces Physician Burnout',
    excerpt: 'A look at the research behind ambient clinical documentation and how AI scribes are giving doctors their evenings back.',
    date: 'Feb 5, 2026',
    readTime: '6 min read',
  },
  {
    tag: 'Engineering',
    tagColor: 'badge-indigo',
    title: 'Building HIPAA-Compliant AI: Lessons from the Trenches',
    excerpt: 'Our engineering team shares the architecture decisions that keep patient data secure while enabling real-time AI processing.',
    date: 'Jan 22, 2026',
    readTime: '8 min read',
  },
  {
    tag: 'Industry',
    tagColor: 'badge-cyan',
    title: 'The State of Clinical Documentation in 2026',
    excerpt: "Physicians spend 2 hours on paperwork for every 1 hour of patient care. Here's how the industry is fighting back.",
    date: 'Jan 10, 2026',
    readTime: '5 min read',
  },
  {
    tag: 'Product',
    tagColor: 'badge-indigo',
    title: 'Virtual Nurse: AI Triage That Knows When to Escalate',
    excerpt: 'How we built a patient-facing AI assistant that triages symptoms accurately and routes urgent cases to providers.',
    date: 'Dec 28, 2025',
    readTime: '7 min read',
  },
  {
    tag: 'Clinical AI',
    tagColor: 'badge-cyan',
    title: 'SOAP Notes and ICD-10 Codes: Teaching AI to Think Like a Clinician',
    excerpt: 'A deep dive into how our NLP models generate structured clinical notes with accurate diagnostic and billing codes.',
    date: 'Dec 12, 2025',
    readTime: '9 min read',
  },
]

export default function BlogPage() {
  return (
    <div>
      {/* Hero */}
      <section className="py-20 sm:py-28 px-4 bg-gradient-to-br from-primary-50 via-white to-accent-50">
        <div className="max-w-3xl mx-auto text-center animate-fade-in">
          <div className="badge-cyan badge mb-4">Blog</div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-6">
            Insights on <span className="gradient-text">AI in Healthcare</span>
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            Product updates, clinical AI research, and perspectives from our team.
          </p>
        </div>
      </section>

      {/* Posts grid */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((p) => (
              <article key={p.title} className="glass-card overflow-hidden hover:-translate-y-1 transition-all duration-300 flex flex-col">
                <div className="h-40 bg-gradient-to-br from-primary-100 to-accent-50" />
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`${p.tagColor} badge text-xs`}>{p.tag}</span>
                    <span className="text-xs text-gray-400">{p.readTime}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 leading-snug">{p.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed flex-1">{p.excerpt}</p>
                  <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-400">{p.date}</div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Stay in the loop</h2>
          <p className="text-gray-600 mb-6">Get the latest CareFlow AI updates delivered to your inbox.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
            <input type="email" placeholder="you@hospital.com" className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
            <button className="btn-primary px-6 py-2.5 text-sm">Subscribe</button>
          </div>
        </div>
      </section>
    </div>
  )
}
