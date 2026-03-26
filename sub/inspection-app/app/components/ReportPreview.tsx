'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from 'recharts';
import { inspectionSections } from '../data/sections';
import type { InspectionData, Quote, Action } from '../types/inspection';

const SECTION_CATEGORIES: { label: string; icon: string; ids: string[] }[] = [
  {
    label: 'Support Quality',
    icon: '🤝',
    ids: ['support-understanding', 'reliability', 'respect-dignity', 'choice-control', 'support-planning', 'practical-support'],
  },
  {
    label: 'Health & Safety',
    icon: '🛡️',
    ids: ['health-wellbeing', 'medication', 'safeguarding'],
  },
  {
    label: 'Professionalism & Communication',
    icon: '💬',
    ids: ['boundaries', 'communication', 'coordination'],
  },
  {
    label: 'Rights & Outcomes',
    icon: '📋',
    ids: ['complaints', 'equality', 'outcomes'],
  },
];

const COLORS = {
  green: '#8bc5a3',
  amber: '#d4b87a',
  red: '#c9908e',
};

function getScoreColor(score: number) {
  if (score >= 7) return COLORS.green;
  if (score >= 5) return COLORS.amber;
  return COLORS.red;
}

function getScoreTextClass(score: number) {
  if (score >= 7) return 'text-emerald-500/80';
  if (score >= 5) return 'text-amber-500/70';
  return 'text-rose-400/80';
}

function getStatusLabel(status: string) {
  if (status === 'meeting-standard') return 'Meeting Standard';
  if (status === 'improvement-needed') return 'Improvement Needed';
  return 'Inadequate';
}

function getStatusBadgeClass(status: string) {
  if (status === 'meeting-standard') return 'text-emerald-600/70 bg-emerald-50/60';
  if (status === 'improvement-needed') return 'text-amber-600/70 bg-amber-50/60';
  return 'text-rose-500/70 bg-rose-50/60';
}

// SVG gauge arc — renders a 180° arc with fill proportional to score
function ScoreGauge({ score, maxScore = 10 }: { score: number; maxScore?: number }) {
  const clamped = Math.min(maxScore, Math.max(0, score));
  const ratio = clamped / maxScore;
  const arcLength = Math.PI * 80; // semicircle with r=80

  return (
    <div className="relative w-44 h-28">
      <svg viewBox="0 0 200 110" className="w-full h-full">
        {/* Tick marks */}
        {[0, 0.25, 0.5, 0.75, 1].map((t) => {
          const angle = Math.PI - t * Math.PI;
          const x1 = 100 + 72 * Math.cos(angle);
          const y1 = 95 - 72 * Math.sin(angle);
          const x2 = 100 + 80 * Math.cos(angle);
          const y2 = 95 - 80 * Math.sin(angle);
          return <line key={t} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#d4d4d4" strokeWidth="2" />;
        })}
        {/* Background arc */}
        <path
          d="M 20 95 A 80 80 0 0 1 180 95"
          fill="none"
          stroke="#e5e5e5"
          strokeWidth="14"
          strokeLinecap="round"
        />
        {/* Filled arc */}
        <path
          d="M 20 95 A 80 80 0 0 1 180 95"
          fill="none"
          stroke={getScoreColor(score)}
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={`${ratio * arcLength} ${arcLength}`}
          className="transition-all duration-700"
        />
        {/* Score text */}
        <text
          x="100"
          y="90"
          textAnchor="middle"
          className={getScoreTextClass(score)}
          fill="currentColor"
          fontSize="36"
          fontWeight="700"
        >
          {score}
        </text>
        <text x="100" y="108" textAnchor="middle" fill="#a3a3a3" fontSize="11">
          out of {maxScore}
        </text>
      </svg>
    </div>
  );
}

// Compact section progress bar
function SectionProgressBar({ score, maxScore = 10 }: { score: number; maxScore?: number }) {
  const pct = Math.round((score / maxScore) * 100);
  return (
    <div className="flex items-center gap-3 w-full">
      <div className="flex-1 h-2 bg-neutral-200 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: getScoreColor(score) }}
        />
      </div>
      <span className={`text-sm font-semibold tabular-nums ${getScoreTextClass(score)}`}>
        {score}/{maxScore}
      </span>
    </div>
  );
}

interface ReportPreviewProps {
  data: InspectionData;
  onBack: () => void;
}

export default function ReportPreview({ data, onBack }: ReportPreviewProps) {
  const [aiSummary, setAiSummary] = useState<{
    headline: string;
    strengths: string[];
    concerns: string[];
    actions: string[];
  } | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [selectedSection, setSelectedSection] = useState<string | null>(null);

  const meetingStandard = data.sections.filter((s) => s.status === 'meeting-standard').length;
  const needsImprovement = data.sections.filter((s) => s.status === 'improvement-needed').length;
  const inadequate = data.sections.filter((s) => s.status === 'inadequate').length;
  const totalSections = data.sections.length;

  // Radar chart data
  const radarData = useMemo(() =>
    data.sections.map((section) => {
      const info = inspectionSections.find((s) => s.id === section.sectionId);
      const words = info?.title?.split(' ') || [section.sectionId];
      const label = words.length <= 2 ? words.join(' ') : words.slice(0, 2).join(' ');
      return { subject: label, score: section.score, fullMark: 10 };
    }),
    [data.sections]
  );

  // Donut chart data
  const donutData = [
    { name: 'Meeting Standard', value: meetingStandard, color: COLORS.green },
    { name: 'Improvement Needed', value: needsImprovement, color: COLORS.amber },
    { name: 'Inadequate', value: inadequate, color: COLORS.red },
  ].filter((d) => d.value > 0);

  // All quotes across sections, sorted: concerns first
  const allQuotes = useMemo(() => {
    const quotes: (Quote & { sectionTitle: string })[] = [];
    data.sections.forEach((section) => {
      const info = inspectionSections.find((s) => s.id === section.sectionId);
      section.quotes.forEach((q) => {
        quotes.push({ ...q, sectionTitle: info?.title || section.sectionId });
      });
    });
    return quotes.sort((a, b) => {
      const order = { concern: 0, positive: 1, neutral: 2 };
      return (order[a.sentiment] ?? 2) - (order[b.sentiment] ?? 2);
    });
  }, [data.sections]);

  const concernQuotes = allQuotes.filter((q) => q.sentiment === 'concern');
  const positiveQuotes = allQuotes.filter((q) => q.sentiment === 'positive');

  // Lowest-scoring sections for "key concerns"
  const keyConcerns = useMemo(() =>
    [...data.sections]
      .filter((s) => s.score < 7)
      .sort((a, b) => a.score - b.score)
      .slice(0, 3),
    [data.sections]
  );

  // Fallback summary when AI is unavailable
  const fallbackSummary = useMemo(() => {
    const avgScore = data.overallScore;
    const best = [...data.sections].sort((a, b) => b.score - a.score).slice(0, 2);
    const worst = [...data.sections].sort((a, b) => a.score - b.score).slice(0, 2);

    const bestNames = best.map((s) => inspectionSections.find((i) => i.id === s.sectionId)?.title).filter(Boolean);
    const worstNames = worst.map((s) => inspectionSections.find((i) => i.id === s.sectionId)?.title).filter(Boolean);

    const verdictText = avgScore >= 7 ? 'meeting standard overall' : avgScore >= 5 ? 'requiring improvement in key areas' : 'with significant concerns identified';

    return {
      headline: `${data.propertyName} is ${verdictText}, scoring ${data.overallScore}/10 across ${totalSections} assessed areas.`,
      strengths: bestNames.map((n) => `${n} scored well`),
      concerns: worstNames.filter((_, i) => worst[i].score < 7).map((n, i) => `${n} scored ${worst[i].score}/10`),
    };
  }, [data, totalSections]);

  // Fetch AI summary
  useEffect(() => {
    let cancelled = false;
    const fetchSummary = async () => {
      setAiLoading(true);
      try {
        const res = await fetch('/api/report-summary', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        if (cancelled || !res.ok) {
          if (!cancelled) setAiLoading(false);
          return;
        }
        const json = await res.json();
        if (!cancelled && json.success && json.summary) setAiSummary(json.summary);
      } catch {
        // Falls back to generated summary
      } finally {
        if (!cancelled) setAiLoading(false);
      }
    };
    fetchSummary();
    return () => { cancelled = true; };
  }, [data.id]);

  const summary = aiSummary || (!aiLoading ? fallbackSummary : null);

  const toggleSection = (id: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-white print:bg-white">
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .print-break { page-break-before: always; }
          .print-avoid-break { page-break-inside: avoid; }
          .print-expand { max-height: none !important; overflow: visible !important; }
          .print-hide { display: none !important; }
        }
      `}</style>

      <div className="max-w-5xl mx-auto p-4 sm:p-8 lg:p-12">
        {/* Back button */}
        <button
          onClick={onBack}
          className="no-print mb-6 text-neutral-500 hover:text-neutral-900 text-sm flex items-center gap-1.5 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to questionnaire
        </button>

        {/* Consultancy Header */}
        <header className="pb-8 mb-8 border-b-2 border-neutral-900 print-avoid-break">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-6">
            <div>
              <p className="text-xs font-semibold text-neutral-900 uppercase tracking-[0.2em] mb-3">
                Quality Inspection Report
              </p>
              <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">{data.propertyName}</h1>
              <p className="text-neutral-500 mt-1 text-sm">Prepared for {data.providerName}</p>
            </div>
            <div className="text-left sm:text-right text-sm text-neutral-500 space-y-0.5">
              <p><span className="text-neutral-400">Date of inspection:</span> {data.date}</p>
              <p><span className="text-neutral-400">Sample:</span> {data.residentsInterviewed} of {data.totalResidents} residents</p>
              {data.inspector && (
                <p><span className="text-neutral-400">Lead inspector:</span> {data.inspector.name}</p>
              )}
              <p className="font-mono text-xs text-neutral-400 mt-1">{data.id}</p>
            </div>
          </div>
        </header>

        {/* About this inspection */}
        <div className="mb-10 text-sm text-neutral-600 leading-relaxed print-avoid-break">
          <h2 className="text-base font-semibold text-neutral-900 mb-2">About this inspection</h2>
          <p className="mb-2">
            This report presents the findings of an independent quality inspection of <strong>{data.propertyName}</strong>,
            operated by <strong>{data.providerName}</strong>. The inspection was conducted on {data.date} through
            structured interviews with {data.residentsInterviewed} of {data.totalResidents} residents, observation,
            and review of relevant documentation.
          </p>
          <p className="mb-2">
            The assessment covers 15 areas of supported housing quality, aligned with CQC Key Lines of Enquiry,
            the Regulator of Social Housing Consumer Standards, the Housing Ombudsman Complaint Handling Code,
            and the Supported Housing National Statement of Expectations.
          </p>
          <p>
            Each area is scored 1–10. Scores of 7+ indicate the service is meeting standard. Scores of 5–6
            indicate improvement is needed. Scores below 5 indicate the area is inadequate and requires
            urgent attention. This report should be read in conjunction with the required actions set out below.
          </p>
        </div>

        {/* ── Dashboard: Gauge + Donut | Radar ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-10 print-avoid-break">
          {/* Left: Gauge + verdict donut */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="flex flex-col items-center p-6 bg-neutral-50 rounded-2xl border border-neutral-100">
              <ScoreGauge score={data.overallScore} />
              <p className="text-sm font-semibold text-neutral-700 mt-1 capitalize">
                {data.overallVerdict.replace(/-/g, ' ')}
              </p>
            </div>
            <div className="flex flex-col items-center p-5 bg-neutral-50 rounded-2xl border border-neutral-100">
              {donutData.length > 0 ? (
                <ResponsiveContainer width="100%" height={100}>
                  <PieChart>
                    <Pie
                      data={donutData}
                      cx="50%"
                      cy="50%"
                      innerRadius={30}
                      outerRadius={44}
                      paddingAngle={3}
                      dataKey="value"
                      strokeWidth={0}
                    >
                      {donutData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} sections`, '']} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[100px] flex items-center text-neutral-400 text-sm">No sections scored</div>
              )}
              <div className="flex flex-wrap gap-4 mt-2 justify-center text-xs text-neutral-600">
                {meetingStandard > 0 && (
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS.green }} />
                    {meetingStandard} meeting standard
                  </span>
                )}
                {needsImprovement > 0 && (
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS.amber }} />
                    {needsImprovement} improvement needed
                  </span>
                )}
                {inadequate > 0 && (
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS.red }} />
                    {inadequate} inadequate
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right: Radar chart */}
          <div className="lg:col-span-3 p-6 bg-neutral-50 rounded-2xl border border-neutral-100 flex flex-col items-center">
            <p className="text-xs text-neutral-400 uppercase tracking-widest mb-2 self-start">Quality profile</p>
            {radarData.length >= 3 ? (
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="72%">
                  <PolarGrid stroke="#e5e5e5" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#737373' }} />
                  <PolarRadiusAxis domain={[0, 10]} tick={{ fontSize: 9 }} axisLine={false} />
                  <Radar
                    name="Score"
                    dataKey="score"
                    stroke="#93b5c6"
                    fill="#93b5c6"
                    fillOpacity={0.12}
                    strokeWidth={1.5}
                    dot={{ r: 2.5, fill: '#93b5c6' }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex-1 flex items-center text-neutral-400 text-sm">
                Score 3+ sections to see the quality profile
              </div>
            )}
          </div>
        </div>

        {/* ── Executive Summary ── */}
        <div className="mb-10 p-6 rounded-2xl border border-neutral-200 bg-gradient-to-br from-neutral-50 via-white to-stone-50 print-avoid-break">
          <h2 className="text-base font-semibold text-neutral-900 mb-3 flex items-center gap-2">
            <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            Executive Summary
          </h2>
          {aiLoading && !summary ? (
            <div className="flex items-center gap-2 text-neutral-400 py-2">
              <div className="w-3.5 h-3.5 border-2 border-neutral-200 border-t-neutral-500 rounded-full animate-spin" />
              <span className="text-sm">Generating summary...</span>
            </div>
          ) : summary ? (
            <div className="space-y-4">
              <p className="text-neutral-700 leading-relaxed">{summary.headline}</p>
              <div className="grid sm:grid-cols-2 gap-4">
                {summary.strengths.length > 0 && (
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">Strengths</p>
                    {summary.strengths.map((s, i) => (
                      <p key={i} className="text-sm text-neutral-700 flex items-start gap-1.5">
                        <span className="text-emerald-400/70 mt-0.5 flex-shrink-0">&#10003;</span> {s}
                      </p>
                    ))}
                  </div>
                )}
                {summary.concerns.length > 0 && (
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">Concerns</p>
                    {summary.concerns.map((c, i) => (
                      <p key={i} className="text-sm text-neutral-700 flex items-start gap-1.5">
                        <span className="text-amber-400/60 mt-0.5 flex-shrink-0">&#9888;</span> {c}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </div>

        {/* ── Heat strip: all sections at a glance ── */}
        <div className="mb-10 print-avoid-break">
          <h2 className="text-base font-semibold text-neutral-900 mb-3">Section scores</h2>
          <div className="flex gap-1 rounded-xl overflow-hidden">
            {data.sections.map((section) => {
              const info = inspectionSections.find((s) => s.id === section.sectionId);
              return (
                <div
                  key={section.sectionId}
                  className="flex-1 min-w-0 group relative"
                  style={{ backgroundColor: getScoreColor(section.score) + '22' }}
                >
                  <div
                    className="h-10 flex items-center justify-center transition-all"
                    style={{ backgroundColor: getScoreColor(section.score) + '33' }}
                  >
                    <span className="text-xs font-bold" style={{ color: getScoreColor(section.score) }}>
                      {section.score}
                    </span>
                  </div>
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 bg-neutral-900 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10">
                    {info?.title}: {section.score}/10
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex justify-between text-[10px] text-neutral-400 mt-1 px-0.5">
            {data.sections.map((section, i) => (
              <span key={section.sectionId} className="flex-1 min-w-0 text-center truncate">
                {i + 1}
              </span>
            ))}
          </div>
        </div>

        {/* ── Key quotes ── */}
        {allQuotes.length > 0 && (
          <div className="mb-10 print-avoid-break">
            <h2 className="text-base font-semibold text-neutral-900 mb-3">Resident voices</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {concernQuotes.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">Concerns raised</p>
                  {concernQuotes.slice(0, 4).map((q, i) => (
                    <div key={i} className="p-3 bg-rose-50/40 rounded-lg border-l-3 border-rose-200">
                      <p className="text-sm italic text-neutral-600">&ldquo;{q.text}&rdquo;</p>
                      <p className="text-xs text-neutral-400 mt-1">{q.sectionTitle} &middot; {q.residentId}</p>
                    </div>
                  ))}
                </div>
              )}
              {positiveQuotes.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">Positive feedback</p>
                  {positiveQuotes.slice(0, 4).map((q, i) => (
                    <div key={i} className="p-3 bg-emerald-50/40 rounded-lg border-l-3 border-emerald-200">
                      <p className="text-sm italic text-neutral-600">&ldquo;{q.text}&rdquo;</p>
                      <p className="text-xs text-neutral-400 mt-1">{q.sectionTitle} &middot; {q.residentId}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Section details — categorised card grid ── */}
        <div className="print-break">
          <h2 className="text-base font-semibold text-neutral-900 mb-6">Section details</h2>

          {SECTION_CATEGORIES.map((category) => {
            const categorySections = category.ids
              .map((id) => {
                const section = data.sections.find((s) => s.sectionId === id);
                const info = inspectionSections.find((s) => s.id === id);
                const globalIndex = data.sections.findIndex((s) => s.sectionId === id);
                return section && info ? { section, info, globalIndex } : null;
              })
              .filter(Boolean) as { section: typeof data.sections[0]; info: typeof inspectionSections[0]; globalIndex: number }[];

            if (categorySections.length === 0) return null;

            const catAvg = Math.round(
              categorySections.reduce((sum, c) => sum + c.section.score, 0) / categorySections.length * 10
            ) / 10;

            return (
              <div key={category.label} className="mb-8">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-base">{category.icon}</span>
                  <h3 className="text-sm font-semibold text-neutral-700 uppercase tracking-wide">{category.label}</h3>
                  <span className={`text-xs font-semibold ml-auto tabular-nums ${getScoreTextClass(catAvg)}`}>
                    avg {catAvg}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {categorySections.map(({ section, info, globalIndex }) => {
                    const isSelected = selectedSection === section.sectionId;
                    const hasFindings = section.responses.some((r) => r.finding);
                    const hasQuotes = section.quotes.length > 0;
                    const hasDetail = hasFindings || hasQuotes || section.whyThisScore;

                    return (
                      <button
                        key={section.sectionId}
                        onClick={() => hasDetail && setSelectedSection(isSelected ? null : section.sectionId)}
                        className={`text-left p-4 rounded-xl border transition-all ${
                          isSelected
                            ? 'border-neutral-300 bg-neutral-50/60 ring-1 ring-neutral-200'
                            : 'border-neutral-150 bg-white hover:border-neutral-300 hover:shadow-sm'
                        } ${hasDetail ? 'cursor-pointer' : 'cursor-default'}`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="min-w-0">
                            <p className="text-[10px] text-neutral-400 font-medium mb-0.5">S{globalIndex + 1}</p>
                            <p className="text-sm font-semibold text-neutral-900 leading-tight">{info.title}</p>
                          </div>
                          <div className="flex flex-col items-center flex-shrink-0">
                            <span className={`text-lg font-bold tabular-nums leading-none ${getScoreTextClass(section.score)}`}>
                              {section.score}
                            </span>
                            <span className="text-[9px] text-neutral-400">/10</span>
                          </div>
                        </div>
                        <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{ width: `${(section.score / 10) * 100}%`, backgroundColor: getScoreColor(section.score) }}
                          />
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${getStatusBadgeClass(section.status)}`}>
                            {getStatusLabel(section.status)}
                          </span>
                          {hasDetail && (
                            <span className="text-[10px] text-neutral-400">
                              {isSelected ? 'Close' : 'View details'}
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Inline detail panel for selected section within this category */}
                {categorySections.map(({ section, info }) => {
                  if (selectedSection !== section.sectionId) return null;
                  const hasFindings = section.responses.some((r) => r.finding);
                  const hasQuotes = section.quotes.length > 0;

                  return (
                    <div key={`detail-${section.sectionId}`} className="mt-3 p-5 bg-neutral-50/80 rounded-xl border border-neutral-200 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-sm font-semibold text-neutral-900">{info.title}</h4>
                        <button
                          onClick={() => setSelectedSection(null)}
                          className="text-neutral-400 hover:text-neutral-600 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>

                      <div className="space-y-4">
                        {hasFindings && (
                          <div>
                            <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wide mb-2">Findings</p>
                            <div className="space-y-2">
                              {section.responses.filter((r) => r.finding).map((response) => {
                                const question = info.questions.find((q) => q.id === response.questionId);
                                return (
                                  <div key={response.questionId} className="flex gap-3 text-sm">
                                    <span className="text-neutral-300 flex-shrink-0 mt-0.5">Q</span>
                                    <div>
                                      <p className="text-neutral-500">{question?.text}</p>
                                      <p className="text-neutral-800 mt-0.5">{response.finding}</p>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {hasQuotes && (
                          <div>
                            <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wide mb-2">Quotes</p>
                            <div className="space-y-2">
                              {section.quotes.map((quote, qIdx) => (
                                <div
                                  key={qIdx}
                                  className={`p-3 rounded-lg flex gap-2.5 text-sm ${
                                quote.sentiment === 'positive' ? 'bg-emerald-50/40' :
                                quote.sentiment === 'concern' ? 'bg-rose-50/40' :
                                'bg-white'
                                  }`}
                                >
                                  <span className="flex-shrink-0 mt-0.5 text-xs">
                                    {quote.sentiment === 'positive' ? '✓' : quote.sentiment === 'concern' ? '⚠' : '○'}
                                  </span>
                                  <div>
                                    <p className="italic text-neutral-700">&ldquo;{quote.text}&rdquo;</p>
                                    <p className="text-xs text-neutral-500 mt-1">— {quote.residentId}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {section.whyThisScore && (
                          <div className="bg-white p-4 rounded-lg border border-neutral-100">
                            <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wide mb-1">Inspector&apos;s rationale</p>
                            <p className="text-sm text-neutral-700 leading-relaxed">{section.whyThisScore}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}

          {/* Print-only: flat list of all section details */}
          <div className="hidden print:block space-y-6 mt-6">
            {data.sections.map((section, index) => {
              const sectionInfo = inspectionSections.find((s) => s.id === section.sectionId);
              const hasFindings = section.responses.some((r) => r.finding);
              const hasQuotes = section.quotes.length > 0;
              if (!hasFindings && !hasQuotes && !section.whyThisScore) return null;
              return (
                <div key={section.sectionId} className="print-avoid-break">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs text-neutral-400 font-medium">S{index + 1}</span>
                    <h4 className="text-sm font-semibold text-neutral-900">{sectionInfo?.title}</h4>
                    <span className={`text-xs font-semibold ml-auto ${getScoreTextClass(section.score)}`}>{section.score}/10</span>
                  </div>
                  {hasFindings && (
                    <div className="mb-2">
                      <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wide mb-1">Findings</p>
                      {section.responses.filter((r) => r.finding).map((response) => {
                        const question = sectionInfo?.questions.find((q) => q.id === response.questionId);
                        return (
                          <div key={response.questionId} className="flex gap-2 text-sm mb-1">
                            <span className="text-neutral-300 flex-shrink-0">Q</span>
                            <div>
                              <p className="text-neutral-500">{question?.text}</p>
                              <p className="text-neutral-800">{response.finding}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  {hasQuotes && (
                    <div className="mb-2">
                      <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wide mb-1">Quotes</p>
                      {section.quotes.map((quote, qIdx) => (
                        <p key={qIdx} className="text-sm italic text-neutral-600 mb-1">&ldquo;{quote.text}&rdquo; — {quote.residentId}</p>
                      ))}
                    </div>
                  )}
                  {section.whyThisScore && (
                    <div>
                      <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wide mb-1">Rationale</p>
                      <p className="text-sm text-neutral-700">{section.whyThisScore}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Recommendations ── */}
        {data.actions && data.actions.length > 0 && (
          <div className="mt-10 print-avoid-break">
            <h2 className="text-base font-semibold text-neutral-900 mb-1">Recommendations</h2>
            <p className="text-sm text-neutral-500 mb-4">
              The following actions are required as a result of this inspection. {data.providerName} is
              expected to provide a written response and action plan within 14 working days.
            </p>
            <div className="border border-neutral-200 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-neutral-50/80 text-left">
                    <th className="px-4 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wide w-16">Ref</th>
                    <th className="px-4 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wide">Recommendation</th>
                    <th className="px-4 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wide w-20 text-center">Priority</th>
                    <th className="px-4 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wide w-24 text-right">Deadline</th>
                  </tr>
                </thead>
                <tbody>
                  {data.actions.map((action: Action, i: number) => (
                    <tr key={action.id} className={i > 0 ? 'border-t border-neutral-100' : ''}>
                      <td className="px-4 py-3 text-neutral-400 font-mono text-xs align-top">{i + 1}</td>
                      <td className="px-4 py-3 align-top">
                        <p className="font-medium text-neutral-900">{action.title}</p>
                        {action.description && (
                          <p className="text-neutral-600 mt-0.5">{action.description}</p>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center align-top">
                        <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded ${
                          action.priority === 'high' ? 'bg-rose-50/60 text-rose-500/80' :
                          action.priority === 'medium' ? 'bg-amber-50/60 text-amber-500/80' :
                          'bg-neutral-50 text-neutral-500'
                        }`}>
                          {action.priority}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-neutral-500 align-top whitespace-nowrap">
                        {action.deadline}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Next steps ── */}
        <div className="mt-10 print-avoid-break">
          <h2 className="text-base font-semibold text-neutral-900 mb-2">Next steps</h2>
          <div className="bg-neutral-50 rounded-xl p-5 text-sm text-neutral-700 space-y-3">
            <div className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-neutral-900 text-white text-xs flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
              <p><strong>Provider response</strong> — {data.providerName} should review this report and provide a written response
                and action plan within <strong>14 working days</strong> of receipt.</p>
            </div>
            <div className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-neutral-900 text-white text-xs flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
              <p><strong>Action plan review</strong> — We will review the submitted action plan and confirm whether the proposed
                actions are sufficient to address the findings in this report.</p>
            </div>
            <div className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-neutral-900 text-white text-xs flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
              <p><strong>Follow-up inspection</strong> — A follow-up inspection
                {data.followUpDate ? ` is scheduled for ${data.followUpDate}` : ' will be scheduled'}
                {' '}to verify that improvements have been implemented and are being sustained.</p>
            </div>
            {inadequate > 0 && (
              <div className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-rose-300/60 text-rose-600 text-xs flex items-center justify-center flex-shrink-0 mt-0.5">!</span>
                <p className="text-neutral-600">
                  <strong>{inadequate} area{inadequate > 1 ? 's were' : ' was'} rated inadequate.</strong> These
                  require urgent attention. We may escalate to the relevant regulatory body if sufficient progress
                  is not demonstrated within the stated deadlines.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ── Provider response section (print-friendly blank space) ── */}
        <div className="mt-10 print-avoid-break">
          <h2 className="text-base font-semibold text-neutral-900 mb-2">Provider response</h2>
          <p className="text-sm text-neutral-500 mb-3">
            This section is for {data.providerName} to acknowledge receipt and outline their response.
          </p>
          <div className="border border-neutral-200 rounded-xl p-5 space-y-4 text-sm">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-1">Received by</p>
                <div className="border-b border-neutral-300 pb-1 text-neutral-400 min-h-[24px]" />
              </div>
              <div>
                <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-1">Date received</p>
                <div className="border-b border-neutral-300 pb-1 text-neutral-400 min-h-[24px]" />
              </div>
              <div>
                <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-1">Role / position</p>
                <div className="border-b border-neutral-300 pb-1 text-neutral-400 min-h-[24px]" />
              </div>
              <div>
                <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-1">Action plan due by</p>
                <div className="border-b border-neutral-300 pb-1 text-neutral-400 min-h-[24px]" />
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-1">Initial comments</p>
              <div className="border border-neutral-200 rounded-lg min-h-[80px] p-3 text-neutral-400" />
            </div>
            <div>
              <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-1">Signature</p>
              <div className="border-b border-neutral-300 pb-1 min-h-[24px] w-64" />
            </div>
          </div>
        </div>

        {/* ── Footer / Letterhead ── */}
        <footer className="mt-14 pt-5 border-t-2 border-neutral-900 print-avoid-break">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
            <div>
              <Image src="/dpb-logo.png" alt="DPB Care Consultancy" width={400} height={400} className="h-16 w-auto" />
            </div>
            <div className="text-left sm:text-right text-xs text-neutral-500 space-y-0.5">
              <p className="font-medium text-neutral-700">DPB Care Consultancy</p>
              <p>184, 200 Pensby Road, Heswall</p>
              <p>Birkenhead, Wirral CH60 7RJ</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-between text-xs text-neutral-500 pt-3 border-t border-neutral-200 mb-3">
            <p>{data.id} &middot; Confidential &middot; Not for distribution without consent</p>
            <p>{new Date().toLocaleDateString('en-GB', {
              day: 'numeric', month: 'long', year: 'numeric',
            })}</p>
          </div>
          {data.inspector && (
            <div className="text-xs text-neutral-500">
              <p>
                <strong>{data.inspector.name}</strong> &middot; {data.inspector.role}
              </p>
            </div>
          )}
          <p className="text-[10px] text-neutral-400 mt-3 leading-relaxed">
            This report is confidential and has been prepared solely for the use of {data.providerName}. It
            contains findings and recommendations based on evidence gathered during the inspection. The
            contents should not be shared with third parties without prior written consent. All resident
            identifiers have been anonymised.
          </p>
          <p className="text-[10px] text-neutral-300 mt-2">
            &copy; {new Date().getFullYear()} DPB Care Consultancy. All rights reserved.
          </p>
        </footer>

        {/* ── Export ── */}
        <div className="mt-8 text-center no-print">
          <button
            onClick={() => window.print()}
            className="px-8 py-3 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:bg-neutral-800 transition-colors"
          >
            Print / Export as PDF
          </button>
        </div>
      </div>
    </div>
  );
}
