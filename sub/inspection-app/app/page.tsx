import Link from 'next/link';
import Image from 'next/image';
import ContactForm from './components/ContactForm';

const PAIN_POINTS = [
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
    title: 'Paper-Based Audits',
    description: 'Still relying on spreadsheets, Word documents, and paper checklists? They\'re slow, error-prone, and impossible to track consistently across services.',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
      </svg>
    ),
    title: 'Regulatory Complexity',
    description: 'CQC in England, Care Inspectorate in Scotland, CIW in Wales, RQIA in Northern Ireland — each with different frameworks, standards, and expectations.',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" />
      </svg>
    ),
    title: 'No Visibility on Quality',
    description: 'Without standardised scoring and tracking, you can\'t benchmark services, spot declining quality early, or evidence improvement to commissioners.',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Reactive, Not Proactive',
    description: 'When audits fail, action plans are cobbled together from scratch. No consistency, no structure, no expert insight to identify what actually needs fixing and in what order.',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    title: 'No Endorsement System',
    description: 'How does a commissioner know you\'ve been independently audited? There\'s no verifiable certificate, no QR code to scan, no public register of endorsed providers.',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
      </svg>
    ),
    title: 'Placement Guesswork',
    description: 'Matching individuals to services is often subjective. Without a structured assessment of needs, staff capability, and compatibility, placements break down.',
  },
];

const SERVICES = [
  {
    tag: 'Quality Audit',
    title: 'QM7 Quality Management Audit',
    description: 'A comprehensive, on-site quality audit tailored to your country\'s regulatory framework. Our auditor conducts 100 questions across 8 sections, observes care systems in action, and reviews all accreditations.',
    details: ['Country-specific (CQC, Care Inspectorate, CIW, RQIA)', 'Care support system observation', 'Accreditation review (CPI, BILD PBS, STOMP, OMG, RRN)', 'BILD pre-mock assessment included'],
    color: 'bg-neutral-900',
    textColor: 'text-white',
  },
  {
    tag: 'Expert Action Plans',
    title: 'Practical Improvement Plans',
    description: 'If your audit falls below the 70% pass threshold, you don\'t just get a fail — you get a detailed, expert-crafted action plan that tells you exactly what to fix, in what order, and by when.',
    details: ['Priority-ranked improvement actions', 'Assigned responsibility and deadlines', 'Re-audit scheduling for follow-up', 'Section-specific recommendations'],
    color: 'bg-blue-600',
    textColor: 'text-white',
  },
  {
    tag: 'Endorsement',
    title: 'DPB Endorsed Certificate',
    description: 'Services that pass receive an official DPB-endorsed certificate with a unique QR code. Commissioners, local authorities, and families can scan it to verify your quality status instantly.',
    details: ['Unique audit reference number', 'QR code linking to live verification', 'DPB Quality Assurance stamp', 'ISO 9001 and UKAS aligned'],
    color: 'bg-emerald-600',
    textColor: 'text-white',
  },
  {
    tag: 'Placement',
    title: 'Placement Assessment & Matching',
    description: 'A structured assessment of an individual\'s support needs matched against your facility, staff profiles, and current residents — so the right person goes to the right service.',
    details: ['Support level calculation (low / medium / high)', 'Staff-to-individual matching', 'Resident compatibility scoring', 'Transition plan generation'],
    color: 'bg-purple-600',
    textColor: 'text-white',
  },
];

const AUDIENCES = [
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 0h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
      </svg>
    ),
    title: 'Care Home & Service Managers',
    description: 'Know exactly where you stand before the regulator arrives. Our team provides evidence-based scoring, clear improvement actions, and a verifiable certificate if you pass.',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
      </svg>
    ),
    title: 'Commissioners & Local Authorities',
    description: 'Verify quality at a glance. Scan a QR code on any DPB-endorsed certificate to confirm an independent audit was conducted, with the date, scores, and reference.',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m1.5.5l-1.5-.5M6.75 7.364V3h-3v18m3-13.636l10.5-3.819" />
      </svg>
    ),
    title: 'Supported Housing Providers',
    description: 'We inspect properties against a structured framework covering safety, wellbeing, and resident voice. You receive a full report with charts, analysis, and a practical action plan.',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
      </svg>
    ),
    title: 'Training Providers',
    description: 'Take your training to the next level with our dedicated training auditors. We provide expert guidance, detailed reports, and BILD inspection readiness through our QM7 quality management audit system.',
  },
];

const STATS = [
  { value: '400+', label: 'Audit Questions', sublabel: 'Across 4 UK nations' },
  { value: '70%', label: 'Pass Threshold', sublabel: 'Evidence-based standard' },
  { value: '8', label: 'Audit Sections', sublabel: 'Comprehensive coverage' },
  { value: 'Expert', label: 'Action Plans', sublabel: 'Detailed & practical' },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md z-50 border-b border-neutral-100">
        <div className="max-w-6xl mx-auto px-6 py-2 flex items-center justify-between">
          <div className="flex items-center">
            <Image src="/dpb-logo.png" alt="DPB Care Consultancy" width={400} height={400} className="h-20 w-auto -my-2" priority />
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="#services"
              className="hidden sm:inline-block text-sm text-neutral-600 hover:text-neutral-900 px-3 py-2 transition-colors"
            >
              Services
            </Link>
            <Link
              href="#about"
              className="hidden sm:inline-block text-sm text-neutral-600 hover:text-neutral-900 px-3 py-2 transition-colors"
            >
              About
            </Link>
            <Link
              href="#contact"
              className="text-sm font-medium bg-neutral-900 text-white px-4 py-2 rounded-lg hover:bg-neutral-800 transition-colors"
            >
              Request an Audit
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 text-sm font-medium px-4 py-1.5 rounded-full mb-8">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Independent quality audits for UK care services
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-neutral-900 leading-[1.1] mb-6 tracking-tight">
            Stop guessing.<br />
            <span className="text-neutral-400">Start proving</span> quality.
          </h1>
          <p className="text-lg sm:text-xl text-neutral-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            We take a traditional, hands-on approach — our experienced team delivers detailed 
            audit reports and creates practical, achievable action plans to support your 
            improvement journey where needed.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              href="#contact"
              className="w-full sm:w-auto text-center bg-neutral-900 text-white px-8 py-3.5 rounded-xl font-medium text-base hover:bg-neutral-800 transition-colors shadow-lg shadow-neutral-900/10"
            >
              Request an Audit
            </Link>
            <Link
              href="#how-it-works"
              className="w-full sm:w-auto text-center border-2 border-neutral-200 text-neutral-700 px-8 py-3.5 rounded-xl font-medium text-base hover:border-neutral-400 transition-colors"
            >
              See How It Works
            </Link>
          </div>

          {/* Stats bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-neutral-900">{stat.value}</div>
                <div className="text-sm font-medium text-neutral-700 mt-1">{stat.label}</div>
                <div className="text-xs text-neutral-400">{stat.sublabel}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-6xl mx-auto px-6"><hr className="border-neutral-100" /></div>

      {/* Pain Points */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold text-red-500 tracking-wide uppercase mb-3">The Problem</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-4">
              Care quality shouldn&apos;t depend on paperwork
            </h2>
            <p className="text-neutral-500 max-w-2xl mx-auto text-lg">
              If any of these sound familiar, you&apos;re not alone — and there&apos;s a better way.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PAIN_POINTS.map((point) => (
              <div key={point.title} className="bg-neutral-50 rounded-2xl p-7 border border-neutral-100 hover:border-neutral-200 transition-colors">
                <div className="w-12 h-12 bg-red-50 text-red-500 rounded-xl flex items-center justify-center mb-4">
                  {point.icon}
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">{point.title}</h3>
                <p className="text-neutral-500 text-sm leading-relaxed">{point.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-6 bg-neutral-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold text-blue-600 tracking-wide uppercase mb-3">How It Works</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-4">
              From enquiry to endorsement
            </h2>
            <p className="text-neutral-500 max-w-2xl mx-auto text-lg">
              A structured, professional process — our team handles the audit, you get the results.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Get in Touch', desc: 'Contact us to discuss your service, your regulatory body, and what you need. We\'ll arrange a convenient date for the on-site audit.' },
              { step: '02', title: 'On-Site Audit', desc: 'Our auditor conducts a thorough audit — 100 questions across 8 sections, care system observations, and accreditation review — all using a purpose-built digital platform.' },
              { step: '03', title: 'Report & Action Plan', desc: 'You receive a detailed report with section scores, charts, and — if needed — a comprehensive action plan with prioritised improvements and deadlines.' },
              { step: '04', title: 'Endorsement', desc: 'Services that pass receive a DPB-endorsed certificate with a unique QR code that commissioners can scan to verify your quality status instantly.' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-14 h-14 bg-white border-2 border-neutral-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-lg font-bold text-neutral-900">{item.step}</span>
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">{item.title}</h3>
                <p className="text-neutral-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold text-neutral-900 tracking-wide uppercase mb-3">What You Get</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-4">
              Professional audits, real results
            </h2>
            <p className="text-neutral-500 max-w-2xl mx-auto text-lg">
              We provide clear, expert recommendations through comprehensive audit reports — giving you practical solutions that deliver real results.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {SERVICES.map((service) => (
              <div key={service.tag} className={`${service.color} ${service.textColor} rounded-2xl p-8`}>
                <span className="text-xs font-semibold tracking-wide uppercase opacity-70">{service.tag}</span>
                <h3 className="text-xl font-bold mt-2 mb-3">{service.title}</h3>
                <p className="opacity-80 text-sm leading-relaxed mb-5">{service.description}</p>
                <ul className="space-y-2">
                  {service.details.map((detail) => (
                    <li key={detail} className="flex items-start gap-2 text-sm">
                      <svg className="w-4 h-4 mt-0.5 flex-shrink-0 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      <span className="opacity-90">{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who It's For */}
      <section className="py-20 px-6 bg-neutral-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold text-purple-600 tracking-wide uppercase mb-3">Who We Work With</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-4">
              Whether you run a service or commission one
            </h2>
            <p className="text-neutral-500 max-w-2xl mx-auto text-lg">
              Different roles, same need: confidence that care quality is measured, evidenced, and independently verified.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {AUDIENCES.map((audience) => (
              <div key={audience.title} className="bg-white rounded-2xl p-8 border border-neutral-100 hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-neutral-100 text-neutral-600 rounded-xl flex items-center justify-center mb-5">
                  {audience.icon}
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">{audience.title}</h3>
                <p className="text-neutral-500 text-sm leading-relaxed">{audience.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About DPB */}
      <section id="about" className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-sm font-semibold text-neutral-900 tracking-wide uppercase mb-3">About</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-4">
              DPB Care Consultancy
            </h2>
          </div>
          <div className="bg-neutral-50 rounded-2xl p-8 sm:p-10 border border-neutral-100">
            <div className="flex flex-col sm:flex-row gap-8 items-start">
              <div className="flex-shrink-0">
                <Image src="/dpb-logo.png" alt="DPB Care Consultancy" width={400} height={400} className="w-32 h-32 object-contain" />
              </div>
              <div>
                <p className="text-neutral-600 leading-relaxed mb-4">
                  Our founder <strong className="text-neutral-900">Dave Burke</strong> developed a deep 
                  passion for quality care early in his career, shaped by first-hand experience of 
                  inadequate care standards — driving our commitment to excellence today.
                </p>
                <p className="text-neutral-600 leading-relaxed mb-4">
                  Our friendly and professional team works alongside you to implement the right steps, 
                  helping you build a compliant, confident, and thriving service in the shortest possible 
                  time. We support rapid, effective improvements across your organisation — helping to 
                  create a positive working environment that recognises and celebrates success.
                </p>
                <p className="text-neutral-600 leading-relaxed">
                  With extensive experience across the UK care sector, our auditors work with services 
                  regulated by CQC, the Care Inspectorate, CIW, and RQIA. We use a purpose-built digital 
                  platform that ensures consistency, transparency, and verifiable results — delivering 
                  professional, independent quality assurance you can trust.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact / CTA */}
      <section id="contact" className="py-20 px-6 bg-neutral-900">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <Image src="/dpb-logo.png" alt="DPB Care Consultancy" width={400} height={400} className="h-28 w-auto mx-auto mb-4 brightness-0 invert" />
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to raise the standard?
            </h2>
            <p className="text-neutral-400 text-lg max-w-xl mx-auto leading-relaxed">
              Tell us about your service and what you need. Our team will get back to you 
              to discuss options and arrange a convenient date.
            </p>
          </div>

          <ContactForm />
        </div>
      </section>

      {/* Trust Signals */}
      <section className="py-16 px-6 border-t border-neutral-100">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 text-neutral-300">
            <div className="flex items-center gap-3">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
              <span className="text-sm font-medium text-neutral-400">QR Verified Certificates</span>
            </div>
            <div className="flex items-center gap-3">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
              </svg>
              <span className="text-sm font-medium text-neutral-400">ISO 9001 Aligned</span>
            </div>
            <div className="flex items-center gap-3">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
              </svg>
              <span className="text-sm font-medium text-neutral-400">Expert-Led Analysis</span>
            </div>
            <div className="flex items-center gap-3">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
              <span className="text-sm font-medium text-neutral-400">GDPR Compliant</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-100 py-10 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <Image src="/dpb-logo.png" alt="DPB Care Consultancy" width={400} height={400} className="h-16 w-auto opacity-60" />
            </div>
            <div className="flex items-center gap-6">
              <Link href="#services" className="text-sm text-neutral-400 hover:text-neutral-600 transition-colors">Services</Link>
              <Link href="#about" className="text-sm text-neutral-400 hover:text-neutral-600 transition-colors">About</Link>
              <Link href="#contact" className="text-sm text-neutral-400 hover:text-neutral-600 transition-colors">Contact</Link>
            </div>
          </div>
          <div className="mt-6 text-center sm:text-left space-y-1">
            <p className="text-xs text-neutral-400">Registered Business Address: 184, 200 Pensby Road, Heswall, Birkenhead, Wirral CH60 7RJ</p>
            <p className="text-xs text-neutral-300">&copy; {new Date().getFullYear()} DPB Care Consultancy. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
