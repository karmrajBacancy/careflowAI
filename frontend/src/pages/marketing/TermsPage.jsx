export default function TermsPage() {
  return (
    <div>
      {/* Hero */}
      <section className="py-20 sm:py-28 px-4 bg-gradient-to-br from-primary-50 via-white to-accent-50">
        <div className="max-w-3xl mx-auto text-center animate-fade-in">
          <div className="badge-indigo badge mb-4">Legal</div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-6">
            Terms of <span className="gradient-text">Service</span>
          </h1>
          <p className="text-lg text-gray-600">Last updated: February 1, 2026</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-3xl mx-auto space-y-10">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">1. Acceptance of Terms</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              By accessing or using CareFlow AI's services, you agree to be bound by these Terms of Service. If you are using the services on behalf of a healthcare organization, you represent that you have authority to bind that organization to these terms. If you do not agree, you may not use our services.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">2. Description of Services</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              CareFlow AI provides AI-powered clinical documentation tools including ambient encounter recording, automated SOAP note generation, ICD-10/CPT code suggestions, virtual nurse triage, and nursing team management dashboards. Our services are designed to assist — not replace — clinical judgment. All AI-generated content must be reviewed and approved by a licensed healthcare provider before becoming part of the medical record.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">3. User Accounts & Responsibilities</h2>
            <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
              <p>You are responsible for:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Maintaining the confidentiality of your account credentials</li>
                <li>Ensuring all users within your organization have appropriate access levels</li>
                <li>Reviewing and verifying all AI-generated clinical content before finalizing</li>
                <li>Complying with all applicable healthcare regulations in your jurisdiction</li>
                <li>Obtaining appropriate patient consent for ambient recording where required by law</li>
              </ul>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">4. Clinical Disclaimer</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              CareFlow AI is a clinical decision support tool. It does not provide medical diagnoses, treatment recommendations, or clinical advice. All AI-generated notes, codes, and suggestions are preliminary and must be reviewed, edited, and approved by a qualified healthcare professional. CareFlow AI is not liable for clinical decisions made based on AI-generated content.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">5. Subscription & Billing</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              Paid plans are billed monthly or annually as selected at enrollment. You may cancel at any time; access continues until the end of the current billing period. We reserve the right to modify pricing with 30 days' notice. The free tier includes limited encounters per month and may be subject to usage caps.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">6. Intellectual Property</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              CareFlow AI retains all rights to its platform, AI models, algorithms, and technology. Clinical notes generated using our tools belong to the healthcare organization that created them. You grant us a limited license to process your data solely for the purpose of providing and improving our services, subject to HIPAA and our BAA.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">7. Limitation of Liability</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              To the maximum extent permitted by law, CareFlow AI's total liability for any claims arising from or related to the services shall not exceed the amounts paid by you in the twelve (12) months preceding the claim. We are not liable for indirect, incidental, special, consequential, or punitive damages.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">8. Termination</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              Either party may terminate this agreement with 30 days' written notice. We may suspend access immediately for violations of these terms or applicable law. Upon termination, we will provide a data export within 30 days and delete your data within 90 days, unless retention is required by law.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">9. Contact</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              Questions about these terms should be directed to <span className="text-primary-600">legal@careflow.ai</span> or: CareFlow AI, 548 Market Street, Suite 35000, San Francisco, CA 94104.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
