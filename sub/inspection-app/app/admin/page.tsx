'use client';

import { useState, useEffect, useCallback, type FormEvent, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { createClient } from '../lib/supabase-browser';

interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  organisation: string;
  service: string;
  country: string;
  message: string;
  submitted_at: string;
  read: boolean;
}

interface AuditRecord {
  id: string;
  audit_number: string;
  service_name: string;
  country: string;
  percentage: number;
  date_completed: string;
  passed: boolean;
  parent_audit_id: string | null;
  follow_up_date: string | null;
  action_plan_items: ActionPlanItem[] | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  audit_data: any;
}

interface ActionPlanItem {
  area: string;
  action: string;
  priority: string;
  deadline: string;
  completed: boolean;
}

interface EndorsedRecord {
  id: string;
  reference_number: string;
  audit_number: string;
  service_name: string;
  percentage: number;
  date_issued: string;
  country: string;
}

interface InspectionRecord {
  id: string;
  property_name: string;
  provider_name: string;
  overall_score: number;
  date_completed: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  report_data: any;
}

interface AssessmentRecord {
  id: string;
  individual_name: string;
  facility_name: string;
  support_level: string;
  overall_percentage: number;
  date_completed: string;
  has_transition_plan: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  assessment_data: any;
}

const SERVICE_LABELS: Record<string, string> = {
  'qm7-audit': 'QM7 Quality Audit',
  'housing-inspection': 'Housing Inspection',
  'placement-assessment': 'Placement Assessment',
  'training-audit': 'Training Craft Audit',
  'bild-assessment': 'BILD PBS Assessment',
  're-audit': 'Re-Audit / Follow-Up',
  'general': 'General Enquiry',
};

type TabId = 'enquiries' | 'audits' | 'endorsed' | 'inspections' | 'assessments';

function GlassesLogo({ className = 'w-12 h-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 20" fill="currentColor">
      <ellipse cx="12" cy="10" rx="10" ry="8" fill="none" stroke="currentColor" strokeWidth="2.5" />
      <ellipse cx="36" cy="10" rx="10" ry="8" fill="none" stroke="currentColor" strokeWidth="2.5" />
      <path d="M22 10 Q24 6 26 10" fill="none" stroke="currentColor" strokeWidth="2.5" />
    </svg>
  );
}

export default function AdminPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-neutral-300 border-t-neutral-900 rounded-full animate-spin" />
      </div>
    }>
      <AdminContent />
    </Suspense>
  );
}

function AdminContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const redirect = searchParams.get('redirect');
  const supabase = createClient();

  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [activeTab, setActiveTab] = useState<TabId>('enquiries');
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [audits, setAudits] = useState<AuditRecord[]>([]);
  const [endorsed, setEndorsed] = useState<EndorsedRecord[]>([]);
  const [inspections, setInspections] = useState<InspectionRecord[]>([]);
  const [assessments, setAssessments] = useState<AssessmentRecord[]>([]);
  const [expandedEnquiry, setExpandedEnquiry] = useState<string | null>(null);
  const [expandedAudit, setExpandedAudit] = useState<string | null>(null);
  const [expandedInspection, setExpandedInspection] = useState<string | null>(null);
  const [expandedAssessment, setExpandedAssessment] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    const [enqRes, auditRes, endorsedRes, inspRes, assessRes] = await Promise.all([
      supabase.from('enquiries').select('*').order('submitted_at', { ascending: false }),
      supabase.from('audit_history').select('*').order('date_completed', { ascending: false }),
      supabase.from('endorsed_services').select('*').order('date_issued', { ascending: false }),
      supabase.from('inspections').select('*').order('date_completed', { ascending: false }),
      supabase.from('assessments').select('*').order('date_completed', { ascending: false }),
    ]);
    if (enqRes.data) setEnquiries(enqRes.data);
    if (auditRes.data) setAudits(auditRes.data);
    if (endorsedRes.data) setEndorsed(endorsedRes.data);
    if (inspRes.data) setInspections(inspRes.data);
    if (assessRes.data) setAssessments(assessRes.data);
  }, [supabase]);

  useEffect(() => {
    async function checkAuth() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setAuthenticated(true);
        loadData();
      }
      setChecking(false);
    }
    checkAuth();
  }, [supabase, loadData]);

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      setError(authError.message);
      setSubmitting(false);
      return;
    }

    setAuthenticated(true);
    loadData();
    setSubmitting(false);

    if (redirect) {
      router.push(redirect);
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setAuthenticated(false);
    setEmail('');
    setPassword('');
    setEnquiries([]);
    setAudits([]);
    setEndorsed([]);
    setInspections([]);
    setAssessments([]);
  }

  async function markAsRead(id: string) {
    await supabase.from('enquiries').update({ read: true }).eq('id', id);
    setEnquiries(prev => prev.map(e => e.id === id ? { ...e, read: true } : e));
  }

  if (checking) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-neutral-300 border-t-neutral-900 rounded-full animate-spin" />
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <GlassesLogo className="w-14 h-7 text-neutral-900 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-neutral-900">Admin Access</h1>
            <p className="text-neutral-500 text-sm mt-1">Sign in to access audit tools</p>
          </div>

          <form onSubmit={handleLogin} className="bg-white rounded-2xl p-8 border border-neutral-200 shadow-sm">
            <div className="mb-4">
              <label htmlFor="admin-email" className="block text-sm font-medium text-neutral-700 mb-1.5">
                Email
              </label>
              <input
                id="admin-email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="dave@dpbcareconsultancy.co.uk"
                className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-neutral-400 focus:ring-2 focus:ring-neutral-100 transition-colors"
                autoFocus
              />
            </div>

            <div className="mb-4">
              <label htmlFor="admin-password" className="block text-sm font-medium text-neutral-700 mb-1.5">
                Password
              </label>
              <input
                id="admin-password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-neutral-400 focus:ring-2 focus:ring-neutral-100 transition-colors"
              />
            </div>

            {error && (
              <p className="mb-4 text-sm text-red-500 text-center bg-red-50 rounded-lg px-3 py-2">{error}</p>
            )}

            <button
              type="submit"
              disabled={submitting || !email || !password}
              className="w-full bg-neutral-900 text-white py-3 rounded-xl font-medium hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="text-center mt-6">
            <Link href="/" className="text-sm text-neutral-400 hover:text-neutral-600 transition-colors">
              &larr; Back to site
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const unreadCount = enquiries.filter(e => !e.read).length;

  const TABS: { id: TabId; label: string; count: number }[] = [
    { id: 'enquiries', label: 'Enquiries', count: unreadCount },
    { id: 'audits', label: 'Audits', count: audits.length },
    { id: 'endorsed', label: 'Endorsed', count: endorsed.length },
    { id: 'inspections', label: 'Inspections', count: inspections.length },
    { id: 'assessments', label: 'Assessments', count: assessments.length },
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <GlassesLogo className="w-10 h-5 text-neutral-900" />
            <div>
              <span className="text-base font-black tracking-tight text-neutral-900">ADMIN</span>
              <span className="text-xs text-neutral-400 font-light ml-2">DPB Care Consultancy</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/" className="text-sm text-neutral-500 hover:text-neutral-700 transition-colors">
              View Site
            </Link>
            <button onClick={handleLogout} className="text-sm text-red-500 hover:text-red-700 transition-colors">
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* Tool Cards */}
        <h2 className="text-lg font-semibold text-neutral-900 mb-5">Tools</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          <Link href="/qm7" className="group">
            <div className="bg-neutral-900 text-white rounded-2xl p-6 hover:shadow-lg transition-all group-hover:scale-[1.02]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl font-bold">QM7</span>
                <svg className="w-5 h-5 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </div>
              <p className="text-neutral-400 text-sm">Quality Management Audit</p>
            </div>
          </Link>
          <Link href="/inspection" className="group">
            <div className="bg-blue-600 text-white rounded-2xl p-6 hover:shadow-lg transition-all group-hover:scale-[1.02]">
              <div className="flex items-center justify-between mb-3">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m1.5.5l-1.5-.5M6.75 7.364V3h-3v18m3-13.636l10.5-3.819" />
                </svg>
                <svg className="w-5 h-5 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </div>
              <p className="text-blue-200 text-sm">Housing Inspection</p>
            </div>
          </Link>
          <Link href="/assessments" className="group">
            <div className="bg-purple-600 text-white rounded-2xl p-6 hover:shadow-lg transition-all group-hover:scale-[1.02]">
              <div className="flex items-center justify-between mb-3">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
                <svg className="w-5 h-5 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </div>
              <p className="text-purple-200 text-sm">Placement Assessment</p>
            </div>
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 border-b border-neutral-200 mb-6">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-neutral-900 text-neutral-900'
                  : 'border-transparent text-neutral-400 hover:text-neutral-600'
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className={`ml-2 text-xs font-bold px-1.5 py-0.5 rounded-full ${
                  activeTab === tab.id ? 'bg-neutral-900 text-white' : 'bg-neutral-200 text-neutral-600'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
          <div className="ml-auto">
            <button
              onClick={loadData}
              className="text-sm text-neutral-500 hover:text-neutral-700 transition-colors flex items-center gap-1.5 px-3 py-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
              </svg>
              Refresh
            </button>
          </div>
        </div>

        {/* Enquiries Tab */}
        {activeTab === 'enquiries' && (
          enquiries.length === 0 ? (
            <EmptyState icon="mail" message="No enquiries yet. They'll appear here when someone submits the contact form." />
          ) : (
            <div className="space-y-3">
              {enquiries.map((enq) => (
                <div
                  key={enq.id}
                  className={`bg-white rounded-2xl border overflow-hidden hover:border-neutral-300 transition-colors ${
                    enq.read ? 'border-neutral-200' : 'border-blue-200 bg-blue-50/30'
                  }`}
                >
                  <button
                    onClick={() => {
                      setExpandedEnquiry(expandedEnquiry === enq.id ? null : enq.id);
                      if (!enq.read) markAsRead(enq.id);
                    }}
                    className="w-full px-6 py-4 flex items-center justify-between text-left"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-neutral-600">
                          {enq.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          {!enq.read && <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />}
                          <span className="font-medium text-neutral-900 text-sm">{enq.name}</span>
                          <span className="text-xs bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded-full flex-shrink-0">
                            {SERVICE_LABELS[enq.service] || enq.service}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-400 truncate">
                          {enq.email} &middot; {new Date(enq.submitted_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                    <svg
                      className={`w-5 h-5 text-neutral-400 flex-shrink-0 transition-transform ${expandedEnquiry === enq.id ? 'rotate-180' : ''}`}
                      fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </button>

                  {expandedEnquiry === enq.id && (
                    <div className="px-6 pb-5 border-t border-neutral-100 pt-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        <div>
                          <span className="text-xs font-medium text-neutral-400 uppercase tracking-wide">Email</span>
                          <p className="text-sm text-neutral-900 mt-0.5">
                            <a href={`mailto:${enq.email}`} className="text-blue-600 hover:underline">{enq.email}</a>
                          </p>
                        </div>
                        {enq.phone && (
                          <div>
                            <span className="text-xs font-medium text-neutral-400 uppercase tracking-wide">Phone</span>
                            <p className="text-sm text-neutral-900 mt-0.5">
                              <a href={`tel:${enq.phone}`} className="text-blue-600 hover:underline">{enq.phone}</a>
                            </p>
                          </div>
                        )}
                        {enq.organisation && (
                          <div>
                            <span className="text-xs font-medium text-neutral-400 uppercase tracking-wide">Organisation</span>
                            <p className="text-sm text-neutral-900 mt-0.5">{enq.organisation}</p>
                          </div>
                        )}
                        {enq.country && (
                          <div>
                            <span className="text-xs font-medium text-neutral-400 uppercase tracking-wide">Region</span>
                            <p className="text-sm text-neutral-900 mt-0.5 capitalize">{enq.country.replace('-', ' ')}</p>
                          </div>
                        )}
                      </div>
                      <div>
                        <span className="text-xs font-medium text-neutral-400 uppercase tracking-wide">Message</span>
                        <p className="text-sm text-neutral-700 mt-1 leading-relaxed whitespace-pre-wrap">{enq.message}</p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center gap-3">
                        <a
                          href={`mailto:${enq.email}?subject=Re: Your DPB Care Consultancy Enquiry`}
                          className="text-sm bg-neutral-900 text-white px-4 py-2 rounded-lg hover:bg-neutral-800 transition-colors"
                        >
                          Reply by Email
                        </a>
                        <span className="text-xs text-neutral-400">
                          {new Date(enq.submitted_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )
        )}

        {/* Audit History Tab */}
        {activeTab === 'audits' && (
          audits.length === 0 ? (
            <EmptyState icon="audit" message="No completed audits yet. They'll appear here once you complete a QM7 audit." />
          ) : (
            <div className="space-y-3">
              {audits.map((audit) => {
                const parentAudit = audit.parent_audit_id
                  ? audits.find(a => a.id === audit.parent_audit_id)
                  : null;
                const childAudits = audits.filter(a => a.parent_audit_id === audit.id);
                const isReaudit = !!audit.parent_audit_id;

                return (
                  <div key={audit.id} className={`bg-white rounded-2xl border overflow-hidden ${
                    isReaudit ? 'border-blue-200 ml-6' : 'border-neutral-200'
                  }`}>
                    <button
                      onClick={() => setExpandedAudit(expandedAudit === audit.id ? null : audit.id)}
                      className="w-full px-6 py-4 text-left hover:bg-neutral-50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {isReaudit && (
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">Re-Audit</span>
                          )}
                          <span className="text-sm font-mono text-neutral-900 font-semibold">{audit.audit_number}</span>
                          <span className="text-sm text-neutral-700">{audit.service_name}</span>
                          <span className="text-xs text-neutral-400 capitalize">{audit.country?.replace('-', ' ')}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-bold text-neutral-900">{audit.percentage}%</span>
                          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                            audit.passed ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {audit.passed ? 'PASS' : 'FAIL'}
                          </span>
                          <span className="text-xs text-neutral-400">
                            {new Date(audit.date_completed).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                          <svg className={`w-4 h-4 text-neutral-400 transition-transform ${expandedAudit === audit.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>

                      {parentAudit && (
                        <div className="mt-3 flex items-center gap-2 text-sm">
                          <span className="text-neutral-500">Previous score:</span>
                          <span className="font-semibold text-neutral-700">{parentAudit.percentage}%</span>
                          <span className="text-neutral-400">→</span>
                          <span className="font-semibold text-neutral-900">{audit.percentage}%</span>
                          <span className={`text-xs font-medium ${
                            audit.percentage > parentAudit.percentage ? 'text-emerald-600' : 'text-red-600'
                          }`}>
                            ({audit.percentage > parentAudit.percentage ? '+' : ''}{audit.percentage - parentAudit.percentage}%)
                          </span>
                        </div>
                      )}

                      {!audit.passed && audit.follow_up_date && (
                        <div className="mt-3 flex items-center gap-2">
                          <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-sm text-amber-700 font-medium">
                            Follow-up due: {new Date(audit.follow_up_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                          </span>
                          {new Date(audit.follow_up_date) < new Date() && childAudits.length === 0 && (
                            <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">Overdue</span>
                          )}
                          {childAudits.length > 0 && (
                            <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">Re-audit completed</span>
                          )}
                        </div>
                      )}

                      {audit.action_plan_items && audit.action_plan_items.length > 0 && (
                        <div className="mt-3 border-t border-neutral-100 pt-3">
                          <p className="text-xs font-medium text-neutral-500 uppercase mb-2">Action Plan ({audit.action_plan_items.length} items)</p>
                          <div className="space-y-1.5">
                            {audit.action_plan_items.map((item, i) => (
                              <div key={i} className="flex items-center gap-2 text-sm">
                                <span className={`w-2 h-2 rounded-full shrink-0 ${
                                  item.priority === 'high' ? 'bg-red-500' : item.priority === 'medium' ? 'bg-amber-500' : 'bg-blue-500'
                                }`} />
                                <span className="text-neutral-700 truncate">{item.area}: {item.action}</span>
                                <span className="text-xs text-neutral-400 ml-auto shrink-0">by {item.deadline}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </button>

                    {expandedAudit === audit.id && audit.audit_data && (
                      <div className="px-6 pb-5 border-t border-neutral-100 bg-neutral-50">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-5">
                          {audit.audit_data.setup && (
                            <div>
                              <h4 className="text-xs font-semibold text-neutral-500 uppercase mb-2">Service Details</h4>
                              <div className="bg-white rounded-lg p-4 space-y-1.5 text-sm">
                                <p><span className="text-neutral-500">Service:</span> <span className="text-neutral-900 font-medium">{audit.audit_data.setup.serviceName}</span></p>
                                <p><span className="text-neutral-500">Type:</span> <span className="text-neutral-900">{audit.audit_data.setup.serviceType}</span></p>
                                {audit.audit_data.setup.keyContact1 && (
                                  <p><span className="text-neutral-500">Contact:</span> <span className="text-neutral-900">{audit.audit_data.setup.keyContact1.name} ({audit.audit_data.setup.keyContact1.email})</span></p>
                                )}
                              </div>
                            </div>
                          )}
                          {audit.audit_data.visitDetails && (
                            <div>
                              <h4 className="text-xs font-semibold text-neutral-500 uppercase mb-2">Visit Details</h4>
                              <div className="bg-white rounded-lg p-4 space-y-1.5 text-sm">
                                <p><span className="text-neutral-500">Date:</span> <span className="text-neutral-900">{audit.audit_data.visitDetails.dateOfVisit}</span></p>
                                <p><span className="text-neutral-500">Greeter:</span> <span className="text-neutral-900">{audit.audit_data.visitDetails.greeterName}</span></p>
                                <p><span className="text-neutral-500">Clients:</span> <span className="text-neutral-900">{audit.audit_data.visitDetails.clientsInService}</span> <span className="text-neutral-500 ml-3">Staff:</span> <span className="text-neutral-900">{audit.audit_data.visitDetails.staffOnShift}</span></p>
                              </div>
                            </div>
                          )}
                          {audit.audit_data.observationAudit && (
                            <div>
                              <h4 className="text-xs font-semibold text-neutral-500 uppercase mb-2">Observation Audit</h4>
                              <div className="bg-white rounded-lg p-4 space-y-1.5 text-sm">
                                <p><span className="text-neutral-500">System:</span> <span className="text-neutral-900 capitalize">{audit.audit_data.observationAudit.careSupportSystem?.replace(/-/g, ' ')}</span></p>
                                <div className="flex gap-3 flex-wrap">
                                  <span className={`text-xs px-2 py-0.5 rounded-full ${audit.audit_data.observationAudit.recentCareNotes ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    Notes: {audit.audit_data.observationAudit.recentCareNotes ? 'Up to date' : 'Overdue'}
                                  </span>
                                  <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${
                                    audit.audit_data.observationAudit.staffSystemSkill === 'excellent' || audit.audit_data.observationAudit.staffSystemSkill === 'good' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                                  }`}>
                                    Skill: {audit.audit_data.observationAudit.staffSystemSkill}
                                  </span>
                                  <span className={`text-xs px-2 py-0.5 rounded-full ${audit.audit_data.observationAudit.effectiveSystem ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {audit.audit_data.observationAudit.effectiveSystem ? 'Effective' : 'Not Effective'}
                                  </span>
                                </div>
                                {audit.audit_data.observationAudit.observationOverview && (
                                  <p className="text-neutral-600 mt-2 text-xs leading-relaxed">{audit.audit_data.observationAudit.observationOverview}</p>
                                )}
                              </div>
                            </div>
                          )}
                          {audit.audit_data.accreditations && (
                            <div>
                              <h4 className="text-xs font-semibold text-neutral-500 uppercase mb-2">Accreditations</h4>
                              <div className="bg-white rounded-lg p-4 flex flex-wrap gap-2">
                                {Object.entries(audit.audit_data.accreditations as Record<string, string>).filter(([k]) => !k.includes('Notes')).map(([key, val]) => (
                                  <span key={key} className={`text-xs px-2 py-1 rounded-full font-medium ${
                                    val === 'yes' ? 'bg-green-100 text-green-700' : val === 'in-progress' ? 'bg-blue-100 text-blue-700' : val === 'expired' ? 'bg-amber-100 text-amber-700' : 'bg-neutral-100 text-neutral-500'
                                  }`}>
                                    {key.replace(/([A-Z])/g, ' $1').toUpperCase()}: {String(val)}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                        {audit.audit_data.sectionSummaries && (
                          <div className="mt-5">
                            <h4 className="text-xs font-semibold text-neutral-500 uppercase mb-3">Section Scores</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {(audit.audit_data.sectionSummaries as Array<{title: string; score: number; maxScore: number; percentage: number; narrative: string}>).map((s, i) => (
                                <div key={i} className="bg-white rounded-lg p-3">
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm font-medium text-neutral-900">{s.title}</span>
                                    <span className={`text-sm font-bold ${s.percentage >= 70 ? 'text-emerald-600' : s.percentage >= 50 ? 'text-amber-600' : 'text-red-600'}`}>{s.score}/{s.maxScore}</span>
                                  </div>
                                  <div className="w-full bg-neutral-200 rounded-full h-1.5 mb-2">
                                    <div className={`h-1.5 rounded-full ${s.percentage >= 70 ? 'bg-emerald-500' : s.percentage >= 50 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${s.percentage}%` }} />
                                  </div>
                                  <p className="text-xs text-neutral-500 line-clamp-2">{s.narrative}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        <div className="mt-5 pt-4 border-t border-neutral-200 flex items-center gap-3">
                          <Link
                            href={`/admin/audit/${audit.id}?mode=report`}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:bg-neutral-800 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                            View Full Report
                          </Link>
                          <Link
                            href={`/admin/audit/${audit.id}?mode=edit`}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-neutral-300 text-neutral-700 text-sm font-medium rounded-lg hover:bg-neutral-50 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                            Edit Audit
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )
        )}

        {/* Endorsed Services Tab */}
        {activeTab === 'endorsed' && (
          endorsed.length === 0 ? (
            <EmptyState icon="endorsed" message="No endorsed services yet. Services that pass the QM7 audit will appear here." />
          ) : (
            <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-neutral-100 text-xs font-medium text-neutral-400 uppercase tracking-wide">
                    <th className="px-6 py-3">Reference</th>
                    <th className="px-6 py-3">Service</th>
                    <th className="px-6 py-3">Score</th>
                    <th className="px-6 py-3">Country</th>
                    <th className="px-6 py-3">Issued</th>
                  </tr>
                </thead>
                <tbody>
                  {endorsed.map((svc) => (
                    <tr key={svc.id} className="border-b border-neutral-50 last:border-0 hover:bg-neutral-50 transition-colors">
                      <td className="px-6 py-3 text-sm font-mono text-neutral-900">{svc.reference_number}</td>
                      <td className="px-6 py-3 text-sm text-neutral-700">{svc.service_name}</td>
                      <td className="px-6 py-3 text-sm font-semibold text-emerald-600">{svc.percentage}%</td>
                      <td className="px-6 py-3 text-sm text-neutral-500 capitalize">{svc.country?.replace('-', ' ')}</td>
                      <td className="px-6 py-3 text-sm text-neutral-400">
                        {new Date(svc.date_issued).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}

        {/* Inspections Tab */}
        {activeTab === 'inspections' && (
          inspections.length === 0 ? (
            <EmptyState icon="inspection" message="No completed inspections yet. They'll appear here when a housing inspection report is generated." />
          ) : (
            <div className="space-y-3">
              {inspections.map((insp) => (
                <div key={insp.id} className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
                  <button
                    onClick={() => setExpandedInspection(expandedInspection === insp.id ? null : insp.id)}
                    className="w-full px-6 py-4 text-left hover:bg-neutral-50 transition-colors flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-medium text-neutral-900">{insp.property_name}</span>
                      <span className="text-sm text-neutral-500">{insp.provider_name || '—'}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-sm font-bold ${insp.overall_score >= 7 ? 'text-emerald-600' : insp.overall_score >= 5 ? 'text-amber-600' : 'text-red-600'}`}>{insp.overall_score}/10</span>
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        insp.overall_score >= 7 ? 'bg-emerald-100 text-emerald-700' : insp.overall_score >= 5 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                      }`}>{insp.overall_score >= 7 ? 'Good' : insp.overall_score >= 5 ? 'Needs Improvement' : 'Inadequate'}</span>
                      <span className="text-xs text-neutral-400">{new Date(insp.date_completed).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      <svg className={`w-4 h-4 text-neutral-400 transition-transform ${expandedInspection === insp.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </button>
                  {expandedInspection === insp.id && insp.report_data && (
                    <div className="px-6 pb-5 border-t border-neutral-100 bg-neutral-50">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-5 mb-5">
                        <div className="bg-white rounded-lg p-4 text-center">
                          <p className="text-xs text-neutral-500 mb-1">Inspector</p>
                          <p className="text-sm font-medium text-neutral-900">{insp.report_data.inspector?.name || 'N/A'}</p>
                        </div>
                        <div className="bg-white rounded-lg p-4 text-center">
                          <p className="text-xs text-neutral-500 mb-1">Residents Interviewed</p>
                          <p className="text-sm font-medium text-neutral-900">{insp.report_data.residentsInterviewed || 0} / {insp.report_data.totalResidents || 0}</p>
                        </div>
                        <div className="bg-white rounded-lg p-4 text-center">
                          <p className="text-xs text-neutral-500 mb-1">Overall Verdict</p>
                          <p className={`text-sm font-bold ${insp.overall_score >= 7 ? 'text-emerald-600' : insp.overall_score >= 5 ? 'text-amber-600' : 'text-red-600'}`}>{insp.report_data.overallVerdict || 'N/A'}</p>
                        </div>
                      </div>
                      {insp.report_data.sections && (
                        <div>
                          <h4 className="text-xs font-semibold text-neutral-500 uppercase mb-3">Section Scores</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                            {(insp.report_data.sections as Array<{title: string; score: number; whyThisScore: string; quotes: Array<{text: string; residentId: string; sentiment: string}>}>).map((s, i) => (
                              <div key={i} className="bg-white rounded-lg p-3">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-xs font-medium text-neutral-900">{s.title}</span>
                                  <span className={`text-xs font-bold ${s.score >= 7 ? 'text-emerald-600' : s.score >= 5 ? 'text-amber-600' : 'text-red-600'}`}>{s.score}/10</span>
                                </div>
                                <div className="w-full bg-neutral-200 rounded-full h-1 mb-1.5">
                                  <div className={`h-1 rounded-full ${s.score >= 7 ? 'bg-emerald-500' : s.score >= 5 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${s.score * 10}%` }} />
                                </div>
                                {s.quotes?.length > 0 && (
                                  <p className="text-xs text-neutral-500 italic truncate">&quot;{s.quotes[0].text}&quot;</p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {insp.report_data.actions && insp.report_data.actions.length > 0 && (
                        <div className="mt-4">
                          <h4 className="text-xs font-semibold text-neutral-500 uppercase mb-2">Actions Required</h4>
                          <div className="space-y-1.5">
                            {(insp.report_data.actions as Array<{priority: string; title: string; description: string; deadline: string}>).map((a, i) => (
                              <div key={i} className="bg-white rounded-lg p-3 flex items-start gap-2">
                                <span className={`w-2 h-2 mt-1.5 rounded-full shrink-0 ${a.priority === 'high' ? 'bg-red-500' : 'bg-amber-500'}`} />
                                <div>
                                  <p className="text-sm font-medium text-neutral-900">{a.title}</p>
                                  <p className="text-xs text-neutral-500">{a.description}</p>
                                </div>
                                <span className="text-xs text-neutral-400 ml-auto shrink-0">by {a.deadline}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )
        )}

        {/* Assessments Tab */}
        {activeTab === 'assessments' && (
          assessments.length === 0 ? (
            <EmptyState icon="assessment" message="No completed assessments yet. They'll appear here when a placement matching is run." />
          ) : (
            <div className="space-y-3">
              {assessments.map((asmt) => (
                <div key={asmt.id} className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
                  <button
                    onClick={() => setExpandedAssessment(expandedAssessment === asmt.id ? null : asmt.id)}
                    className="w-full px-6 py-4 text-left hover:bg-neutral-50 transition-colors flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-neutral-900">{asmt.individual_name}</span>
                      <span className="text-sm text-neutral-500">→ {asmt.facility_name}</span>
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full capitalize ${
                        asmt.support_level === 'high' ? 'bg-red-100 text-red-700' : asmt.support_level === 'medium' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                      }`}>{asmt.support_level || '—'}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-neutral-900">{asmt.overall_percentage}%</span>
                      {asmt.has_transition_plan ? (
                        <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">Transition Plan</span>
                      ) : (
                        <span className="text-xs bg-neutral-100 text-neutral-500 px-2 py-1 rounded-full">No Plan</span>
                      )}
                      <span className="text-xs text-neutral-400">{new Date(asmt.date_completed).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      <svg className={`w-4 h-4 text-neutral-400 transition-transform ${expandedAssessment === asmt.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </button>
                  {expandedAssessment === asmt.id && asmt.assessment_data && (
                    <div className="px-6 pb-5 border-t border-neutral-100 bg-neutral-50">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-5">
                        {asmt.assessment_data.individual && (
                          <div>
                            <h4 className="text-xs font-semibold text-neutral-500 uppercase mb-2">Individual Profile</h4>
                            <div className="bg-white rounded-lg p-4 space-y-1.5 text-sm">
                              <p><span className="text-neutral-500">Name:</span> <span className="text-neutral-900 font-medium">{asmt.assessment_data.individual.name}</span></p>
                              <p><span className="text-neutral-500">DOB:</span> <span className="text-neutral-900">{asmt.assessment_data.individual.dateOfBirth}</span></p>
                              <p><span className="text-neutral-500">Primary Dx:</span> <span className="text-neutral-900">{asmt.assessment_data.individual.primaryDiagnosis}</span></p>
                              {asmt.assessment_data.individual.secondaryDiagnosis && (
                                <p><span className="text-neutral-500">Secondary Dx:</span> <span className="text-neutral-900">{asmt.assessment_data.individual.secondaryDiagnosis}</span></p>
                              )}
                              <p><span className="text-neutral-500">Communication:</span> <span className="text-neutral-900">{asmt.assessment_data.individual.communicationNeeds}</span></p>
                              <p><span className="text-neutral-500">Triggers:</span> <span className="text-neutral-900">{asmt.assessment_data.individual.triggers}</span></p>
                              <p><span className="text-neutral-500">Interests:</span> <span className="text-neutral-900">{asmt.assessment_data.individual.interests}</span></p>
                            </div>
                          </div>
                        )}
                        {asmt.assessment_data.facility && (
                          <div>
                            <h4 className="text-xs font-semibold text-neutral-500 uppercase mb-2">Facility</h4>
                            <div className="bg-white rounded-lg p-4 space-y-1.5 text-sm">
                              <p><span className="text-neutral-500">Name:</span> <span className="text-neutral-900 font-medium">{asmt.assessment_data.facility.name}</span></p>
                              <p><span className="text-neutral-500">Location:</span> <span className="text-neutral-900">{asmt.assessment_data.facility.location}</span></p>
                              <p><span className="text-neutral-500">Beds:</span> <span className="text-neutral-900">{asmt.assessment_data.facility.totalBeds} ({asmt.assessment_data.facility.currentOccupancy} occupied)</span></p>
                              <p><span className="text-neutral-500">Max Support:</span> <span className="text-neutral-900 capitalize">{asmt.assessment_data.facility.maxSupportLevel}</span></p>
                              {asmt.assessment_data.facility.specialisms && (
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {(asmt.assessment_data.facility.specialisms as string[]).map((s, i) => (
                                    <span key={i} className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">{s}</span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                      {asmt.assessment_data.matchingResult && (
                        <div className="mt-5">
                          <h4 className="text-xs font-semibold text-neutral-500 uppercase mb-3">Matching Breakdown</h4>
                          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                            {[
                              { label: 'Support Level', value: asmt.assessment_data.matchingResult.supportLevelMatch },
                              { label: 'Facility', value: asmt.assessment_data.matchingResult.facilityMatch },
                              { label: 'Staff Skill', value: asmt.assessment_data.matchingResult.staffSkillMatch },
                              { label: 'Residents', value: asmt.assessment_data.matchingResult.residentCompatibility },
                              { label: 'Environment', value: asmt.assessment_data.matchingResult.environmentMatch },
                            ].map((m, i) => (
                              <div key={i} className="bg-white rounded-lg p-3 text-center">
                                <p className="text-xs text-neutral-500 mb-1">{m.label}</p>
                                <p className={`text-lg font-bold ${(m.value as number) >= 70 ? 'text-emerald-600' : (m.value as number) >= 50 ? 'text-amber-600' : 'text-red-600'}`}>{m.value as number}%</p>
                              </div>
                            ))}
                          </div>
                          {asmt.assessment_data.matchingResult.notes && (
                            <div className="mt-3 bg-white rounded-lg p-3">
                              <p className="text-xs font-medium text-neutral-500 mb-1.5">Notes</p>
                              {(asmt.assessment_data.matchingResult.notes as string[]).map((n, i) => (
                                <p key={i} className="text-sm text-neutral-700">{n}</p>
                              ))}
                              {asmt.assessment_data.matchingResult.risks?.length > 0 && (
                                <div className="mt-2">
                                  <p className="text-xs font-medium text-red-600 mb-1">Risks</p>
                                  {(asmt.assessment_data.matchingResult.risks as string[]).map((r, i) => (
                                    <p key={i} className="text-sm text-red-600">{r}</p>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )
        )}
      </main>
    </div>
  );
}

function EmptyState({ icon, message }: { icon: string; message: string }) {
  const paths: Record<string, string> = {
    mail: 'M21.75 9v.906a2.25 2.25 0 01-1.183 1.981l-6.478 3.488M2.25 9v.906a2.25 2.25 0 001.183 1.981l6.478 3.488m8.839 2.51l-4.66-2.51m0 0l-1.023-.55a2.25 2.25 0 00-2.134 0l-1.022.55m0 0l-4.661 2.51m16.5 1.615a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V8.844a2.25 2.25 0 011.183-1.98l7.5-4.04a2.25 2.25 0 012.134 0l7.5 4.04a2.25 2.25 0 011.183 1.98V19.5z',
    audit: 'M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z',
    endorsed: 'M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z',
    inspection: 'M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m1.5.5l-1.5-.5M6.75 7.364V3h-3v18m3-13.636l10.5-3.819',
    assessment: 'M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z',
  };

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 p-10 text-center">
      <svg className="w-12 h-12 text-neutral-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={paths[icon] || paths.mail} />
      </svg>
      <p className="text-neutral-500">{message}</p>
    </div>
  );
}
