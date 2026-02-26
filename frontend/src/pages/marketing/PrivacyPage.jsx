export default function PrivacyPage() {
  return (
    <div>
      {/* Hero */}
      <section className="py-20 sm:py-28 px-4 bg-gradient-to-br from-primary-50 via-white to-accent-50">
        <div className="max-w-3xl mx-auto text-center animate-fade-in">
          <div className="badge-indigo badge mb-4">Legal</div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-6">
            Privacy <span className="gradient-text">Policy</span>
          </h1>
          <p className="text-lg text-gray-600">Last updated: February 1, 2026</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-3xl mx-auto prose-container space-y-10">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">1. Information We Collect</h2>
            <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
              <p>CareFlow AI collects information necessary to provide our clinical documentation services:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Account Information:</strong> Name, email, professional credentials, and practice details provided during registration.</li>
                <li><strong>Clinical Audio Data:</strong> Audio recordings of patient encounters captured through our ambient documentation feature, processed in real-time and not stored after note generation unless explicitly configured.</li>
                <li><strong>Generated Clinical Notes:</strong> SOAP notes, H&P reports, and related documentation created by our AI system.</li>
                <li><strong>Usage Data:</strong> Feature usage patterns, session duration, and interaction data to improve our services.</li>
              </ul>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">2. How We Use Your Information</h2>
            <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
              <p>We use collected information to:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Provide, maintain, and improve our clinical AI services</li>
                <li>Generate accurate clinical documentation and billing codes</li>
                <li>Ensure HIPAA compliance and maintain audit trails</li>
                <li>Communicate service updates and security notices</li>
                <li>Develop and train improved AI models using de-identified, aggregated data only</li>
              </ul>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">3. Data Protection & Security</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              All data is encrypted at rest (AES-256) and in transit (TLS 1.3). Our infrastructure is hosted on HIPAA-compliant cloud services with SOC 2 Type II certification. We conduct annual third-party security audits and penetration testing. Access to patient data is strictly controlled through role-based permissions with comprehensive audit logging.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">4. Data Sharing</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              We do not sell, rent, or share patient health information with third parties for marketing purposes. Data may be shared only with: (a) your authorized healthcare organization members, (b) service providers bound by BAAs who assist in delivering our services, and (c) as required by law or valid legal process.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">5. Data Retention</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              Clinical documentation is retained according to your organization's configured retention policy and applicable state/federal regulations. Audio recordings are processed in real-time and discarded immediately after note generation unless your organization enables extended storage. You may request data deletion at any time, subject to legal retention requirements.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">6. Your Rights</h2>
            <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
              <p>You have the right to:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Access and receive a copy of your data</li>
                <li>Request correction of inaccurate information</li>
                <li>Request deletion of your data (subject to legal requirements)</li>
                <li>Opt out of non-essential data processing</li>
                <li>Receive notice of any data breach affecting your information</li>
              </ul>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">7. Contact Us</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              For privacy-related inquiries, contact our Data Protection Officer at <span className="text-primary-600">privacy@careflow.ai</span> or write to: CareFlow AI, Attn: Privacy Team, 548 Market Street, Suite 35000, San Francisco, CA 94104.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
