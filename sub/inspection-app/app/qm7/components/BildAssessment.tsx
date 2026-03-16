'use client';

import React, { useState } from 'react';

interface BildChecklistItem {
  id: string;
  category: string;
  question: string;
  answer: 'yes' | 'partial' | 'no' | null;
  notes: string;
}

const BILD_CHECKLIST: Omit<BildChecklistItem, 'answer' | 'notes'>[] = [
  { id: 'b1', category: 'PBS Framework', question: 'Is there a written PBS policy aligned with BILD standards?' },
  { id: 'b2', category: 'PBS Framework', question: 'Does the service use a recognised PBS framework (e.g. BILD capability model)?' },
  { id: 'b3', category: 'PBS Framework', question: 'Are PBS plans developed collaboratively with the individual, families, and professionals?' },
  { id: 'b4', category: 'PBS Framework', question: 'Are PBS plans reviewed regularly with evidence-based updates?' },
  { id: 'b5', category: 'Functional Assessment', question: 'Are functional behaviour assessments completed for individuals with behaviours of concern?' },
  { id: 'b6', category: 'Functional Assessment', question: 'Do assessments identify setting events, triggers, and maintaining consequences?' },
  { id: 'b7', category: 'Functional Assessment', question: 'Is baseline data collected before intervention strategies are developed?' },
  { id: 'b8', category: 'Functional Assessment', question: 'Are assessments person-centred, considering quality of life factors?' },
  { id: 'b9', category: 'Proactive Strategies', question: 'Are environmental adjustments documented to reduce triggers?' },
  { id: 'b10', category: 'Proactive Strategies', question: 'Are skills-teaching programmes in place (communication, coping, daily living)?' },
  { id: 'b11', category: 'Proactive Strategies', question: 'Are sensory needs assessed and addressed?' },
  { id: 'b12', category: 'Proactive Strategies', question: 'Are staff trained in recognising early warning signs?' },
  { id: 'b13', category: 'Reactive Strategies', question: 'Are de-escalation techniques documented and staff-trained?' },
  { id: 'b14', category: 'Reactive Strategies', question: 'Is there a clear hierarchy from least to most restrictive interventions?' },
  { id: 'b15', category: 'Reactive Strategies', question: 'Are any physical interventions BILD-certified and proportionate?' },
  { id: 'b16', category: 'Reactive Strategies', question: 'Is every use of restrictive practice recorded, reviewed, and reported?' },
  { id: 'b17', category: 'Staff Training', question: 'Are all staff trained in PBS awareness (within induction)?' },
  { id: 'b18', category: 'Staff Training', question: 'Do staff receive ongoing PBS refresher training annually?' },
  { id: 'b19', category: 'Staff Training', question: 'Are staff competencies in PBS assessed and documented?' },
  { id: 'b20', category: 'Staff Training', question: 'Is the training provider BILD-certified?' },
  { id: 'b21', category: 'Restrictive Practice Reduction', question: 'Does the service have a restrictive practice reduction plan?' },
  { id: 'b22', category: 'Restrictive Practice Reduction', question: 'Is there a named restrictive practice lead or champion?' },
  { id: 'b23', category: 'Restrictive Practice Reduction', question: 'Is restrictive practice data monitored for trends over time?' },
  { id: 'b24', category: 'Restrictive Practice Reduction', question: 'Are post-incident debriefs conducted with staff and individuals?' },
  { id: 'b25', category: 'Governance & Quality', question: 'Does leadership review PBS outcomes at governance level?' },
  { id: 'b26', category: 'Governance & Quality', question: 'Are families and advocates involved in PBS reviews?' },
  { id: 'b27', category: 'Governance & Quality', question: 'Are PBS outcomes measured (quality of life, incident reduction)?' },
  { id: 'b28', category: 'Governance & Quality', question: 'Is the service working towards or holds BILD PBS accreditation?' },
];

const CATEGORIES = [...new Set(BILD_CHECKLIST.map(c => c.category))];

export default function BildAssessment({ onClose }: { onClose: () => void }) {
  const [items, setItems] = useState<BildChecklistItem[]>(
    BILD_CHECKLIST.map(c => ({ ...c, answer: null, notes: '' }))
  );
  const [expandedCategory, setExpandedCategory] = useState<string>(CATEGORIES[0]);

  const updateItem = (id: string, update: Partial<BildChecklistItem>) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, ...update } : item));
  };

  const answered = items.filter(i => i.answer !== null).length;
  const yesCount = items.filter(i => i.answer === 'yes').length;
  const partialCount = items.filter(i => i.answer === 'partial').length;
  const noCount = items.filter(i => i.answer === 'no').length;
  const score = answered > 0 ? Math.round(((yesCount + partialCount * 0.5) / answered) * 100) : 0;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-neutral-200 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-neutral-900">BILD PBS Pre-Mock Assessment</h2>
            <p className="text-sm text-neutral-500 mt-1">
              Self-assessment checklist based on BILD Positive Behaviour Support standards
            </p>
          </div>
          <button onClick={onClose} aria-label="Close BILD assessment" className="text-neutral-400 hover:text-neutral-900">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Score summary */}
        <div className="px-6 py-4 bg-neutral-50 border-b border-neutral-200">
          <div className="flex items-center justify-between text-sm">
            <span className="text-neutral-600">{answered}/{items.length} answered</span>
            <div className="flex items-center gap-4">
              <span className="text-green-600 font-medium">{yesCount} Yes</span>
              <span className="text-amber-600 font-medium">{partialCount} Partial</span>
              <span className="text-red-600 font-medium">{noCount} No</span>
              <span className={`text-lg font-bold ${score >= 70 ? 'text-green-600' : score >= 50 ? 'text-amber-600' : 'text-red-600'}`}>
                {score}%
              </span>
            </div>
          </div>
          <div className="w-full bg-neutral-200 rounded-full h-2 mt-2">
            <div
              className={`h-2 rounded-full transition-all ${score >= 70 ? 'bg-green-500' : score >= 50 ? 'bg-amber-500' : 'bg-red-500'}`}
              style={{ width: `${score}%` }}
            />
          </div>
        </div>

        {/* Checklist */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            {CATEGORIES.map(category => {
              const categoryItems = items.filter(i => i.category === category);
              const isExpanded = expandedCategory === category;
              const catAnswered = categoryItems.filter(i => i.answer !== null).length;

              return (
                <div key={category} className="border border-neutral-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setExpandedCategory(isExpanded ? '' : category)}
                    className="w-full px-5 py-4 bg-neutral-50 text-left flex items-center justify-between hover:bg-neutral-100 transition-colors"
                    aria-expanded={isExpanded}
                  >
                    <span className="font-medium text-neutral-900">{category}</span>
                    <span className="text-xs text-neutral-500">{catAnswered}/{categoryItems.length} answered</span>
                  </button>

                  {isExpanded && (
                    <div className="divide-y divide-neutral-100">
                      {categoryItems.map(item => (
                        <div key={item.id} className="px-5 py-4">
                          <p className="text-sm text-neutral-900 mb-3">{item.question}</p>
                          <div className="flex gap-2 mb-2">
                            {(['yes', 'partial', 'no'] as const).map(ans => (
                              <button
                                key={ans}
                                onClick={() => updateItem(item.id, { answer: ans })}
                                className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${
                                  item.answer === ans
                                    ? ans === 'yes' ? 'bg-green-600 text-white'
                                      : ans === 'partial' ? 'bg-amber-500 text-white'
                                      : 'bg-red-600 text-white'
                                    : 'bg-white text-neutral-600 border border-neutral-200 hover:border-neutral-400'
                                }`}
                                aria-pressed={item.answer === ans}
                              >
                                {ans}
                              </button>
                            ))}
                          </div>
                          <input
                            type="text"
                            value={item.notes}
                            onChange={e => updateItem(item.id, { notes: e.target.value })}
                            placeholder="Notes (optional)"
                            aria-label={`Notes for ${item.question}`}
                            className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm
                                     focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent placeholder:text-neutral-400"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-neutral-200 flex gap-3">
          <button
            onClick={() => window.print()}
            className="flex-1 px-4 py-3 bg-neutral-900 text-white font-medium rounded-lg hover:bg-neutral-800 transition-colors"
          >
            Print Assessment
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-neutral-300 text-neutral-700 font-medium rounded-lg hover:bg-neutral-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
