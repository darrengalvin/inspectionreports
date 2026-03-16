import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-neutral-200">
        <div className="max-w-6xl mx-auto px-6 py-6 flex items-center gap-4">
          <svg className="w-12 h-6 text-neutral-900" viewBox="0 0 48 20" fill="currentColor">
            <ellipse cx="12" cy="10" rx="10" ry="8" fill="none" stroke="currentColor" strokeWidth="2.5" />
            <ellipse cx="36" cy="10" rx="10" ry="8" fill="none" stroke="currentColor" strokeWidth="2.5" />
            <path d="M22 10 Q24 6 26 10" fill="none" stroke="currentColor" strokeWidth="2.5" />
          </svg>
          <div>
            <h1 className="text-xl font-black tracking-tight text-neutral-900">DPBCARECONSULTANCY</h1>
            <p className="text-xs tracking-[0.3em] text-neutral-500 font-light">Q U A L I T Y &nbsp; M A T T E R S</p>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-neutral-900 mb-4">Quality Management Suite</h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Comprehensive audit, inspection, and assessment tools for care services.
            Choose a tool below to get started.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* QM7 Audit */}
          <Link href="/qm7" className="group block">
            <div className="border-2 border-neutral-200 rounded-2xl p-8 h-full hover:border-neutral-900 hover:shadow-lg transition-all">
              <div className="w-14 h-14 bg-neutral-900 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="text-white font-bold text-lg">QM7</span>
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">QM7 Quality Audit</h3>
              <p className="text-neutral-600 mb-4">
                Full quality management audit with care systems observation, accreditations,
                8 audit sections, AI action plans, and DPB endorsed certificates.
              </p>
              <ul className="text-sm text-neutral-500 space-y-1.5">
                <li className="flex items-center gap-2"><span className="text-green-500">&#10003;</span> Care Support Systems</li>
                <li className="flex items-center gap-2"><span className="text-green-500">&#10003;</span> Observation Audit</li>
                <li className="flex items-center gap-2"><span className="text-green-500">&#10003;</span> Accreditations (CPI, BILD, STOMP, OMG, RRN)</li>
                <li className="flex items-center gap-2"><span className="text-green-500">&#10003;</span> 100-question audit across 8 sections</li>
                <li className="flex items-center gap-2"><span className="text-green-500">&#10003;</span> AI Action Plans</li>
                <li className="flex items-center gap-2"><span className="text-green-500">&#10003;</span> Pass/Fail Certificates</li>
              </ul>
              <div className="mt-6 text-neutral-900 font-medium group-hover:underline">
                Start Audit &rarr;
              </div>
            </div>
          </Link>

          {/* Supported Housing Inspection */}
          <Link href="/inspection" className="group block">
            <div className="border-2 border-neutral-200 rounded-2xl p-8 h-full hover:border-neutral-900 hover:shadow-lg transition-all">
              <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m1.5.5l-1.5-.5M6.75 7.364V3h-3v18m3-13.636l10.5-3.819" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">Housing Inspection</h3>
              <p className="text-neutral-600 mb-4">
                Supported housing quality inspection tool with section-by-section scoring,
                resident quotes, AI analysis, and comprehensive reports.
              </p>
              <ul className="text-sm text-neutral-500 space-y-1.5">
                <li className="flex items-center gap-2"><span className="text-green-500">&#10003;</span> 15 inspection sections</li>
                <li className="flex items-center gap-2"><span className="text-green-500">&#10003;</span> Resident interviews &amp; quotes</li>
                <li className="flex items-center gap-2"><span className="text-green-500">&#10003;</span> AI-powered analysis</li>
                <li className="flex items-center gap-2"><span className="text-green-500">&#10003;</span> Charts &amp; visualisations</li>
                <li className="flex items-center gap-2"><span className="text-green-500">&#10003;</span> Executive summary generation</li>
              </ul>
              <div className="mt-6 text-neutral-900 font-medium group-hover:underline">
                Start Inspection &rarr;
              </div>
            </div>
          </Link>

          {/* Assessments */}
          <Link href="/assessments" className="group block">
            <div className="border-2 border-neutral-200 rounded-2xl p-8 h-full hover:border-neutral-900 hover:shadow-lg transition-all">
              <div className="w-14 h-14 bg-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">Placement Assessment</h3>
              <p className="text-neutral-600 mb-4">
                Individual matching and placement assessment. Calculates support levels,
                facility matching percentage, and generates transition plans.
              </p>
              <ul className="text-sm text-neutral-500 space-y-1.5">
                <li className="flex items-center gap-2"><span className="text-green-500">&#10003;</span> Support level calculation</li>
                <li className="flex items-center gap-2"><span className="text-green-500">&#10003;</span> Facility &amp; staff matching</li>
                <li className="flex items-center gap-2"><span className="text-green-500">&#10003;</span> Resident compatibility</li>
                <li className="flex items-center gap-2"><span className="text-green-500">&#10003;</span> Match percentage scoring</li>
                <li className="flex items-center gap-2"><span className="text-green-500">&#10003;</span> Transition plan generation</li>
              </ul>
              <div className="mt-6 text-neutral-900 font-medium group-hover:underline">
                Start Assessment &rarr;
              </div>
            </div>
          </Link>
        </div>

        {/* Footer */}
        <footer className="text-center text-sm text-neutral-400 border-t border-neutral-100 pt-8">
          <p>DPB Care Consultancy &mdash; Quality Matters</p>
        </footer>
      </main>
    </div>
  );
}
