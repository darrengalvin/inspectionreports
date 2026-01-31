'use client';

import React, { useState, useEffect } from 'react';
import { Section, Quote, QuestionResponse } from '../types/inspection';
import { useInspection } from '../context/InspectionContext';

interface Props {
  section: Section;
  onNext: () => void;
  onPrevious: () => void;
  isFirst: boolean;
  isLast: boolean;
}

export default function SectionQuestionnaire({ section, onNext, onPrevious, isFirst, isLast }: Props) {
  const { sectionResponses, updateSectionResponse } = useInspection();
  
  const existingResponse = sectionResponses.get(section.id);
  
  const [score, setScore] = useState(existingResponse?.score || 5);
  const [responses, setResponses] = useState<QuestionResponse[]>(
    existingResponse?.responses || section.questions.map(q => ({ questionId: q.id, finding: '' }))
  );
  const [quotes, setQuotes] = useState<Quote[]>(existingResponse?.quotes || []);
  const [whyThisScore, setWhyThisScore] = useState(existingResponse?.whyThisScore || '');
  const [newQuote, setNewQuote] = useState({ text: '', residentId: '', sentiment: 'neutral' as Quote['sentiment'] });

  // Sync with context when navigating back
  useEffect(() => {
    if (existingResponse) {
      setScore(existingResponse.score);
      setResponses(existingResponse.responses.length > 0 ? existingResponse.responses : 
        section.questions.map(q => ({ questionId: q.id, finding: '' })));
      setQuotes(existingResponse.quotes);
      setWhyThisScore(existingResponse.whyThisScore);
    }
  }, [section.id, existingResponse]);

  const updateResponse = (questionId: string, finding: string) => {
    setResponses(prev => prev.map(r => 
      r.questionId === questionId ? { ...r, finding } : r
    ));
  };

  const addQuote = () => {
    if (newQuote.text.trim() && newQuote.residentId.trim()) {
      setQuotes(prev => [...prev, { ...newQuote }]);
      setNewQuote({ text: '', residentId: '', sentiment: 'neutral' });
    }
  };

  const removeQuote = (index: number) => {
    setQuotes(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    updateSectionResponse(section.id, {
      sectionId: section.id,
      score,
      responses,
      quotes,
      whyThisScore
    });
  };

  const handleNext = () => {
    handleSave();
    onNext();
  };

  const handlePrevious = () => {
    handleSave();
    onPrevious();
  };

  const getScoreColor = (s: number) => {
    if (s >= 7) return 'text-green-600';
    if (s >= 5) return 'text-amber-600';
    return 'text-red-600';
  };

  const getScoreLabel = (s: number) => {
    if (s >= 7) return 'Meeting Standard';
    if (s >= 5) return 'Improvement Needed';
    return 'Inadequate';
  };

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="border-b border-neutral-200 pb-6">
        <p className="text-sm text-neutral-500 uppercase tracking-wide mb-1">
          Section {section.number} of 15
        </p>
        <h2 className="text-2xl font-semibold text-neutral-900">{section.title}</h2>
        <p className="text-neutral-600 mt-2">{section.purpose}</p>
      </div>

      {/* Questions */}
      <div className="space-y-6">
        <h3 className="text-sm font-medium text-neutral-500 uppercase tracking-wide">
          Questions & Findings
        </h3>
        
        {section.questions.map((question, idx) => {
          const response = responses.find(r => r.questionId === question.id);
          return (
            <div key={question.id} className="bg-neutral-50 rounded-lg p-5">
              <div className="flex gap-3">
                <span className="text-sm font-medium text-neutral-400 mt-0.5">
                  {idx + 1}.
                </span>
                <div className="flex-1 space-y-3">
                  <p className="text-neutral-900 font-medium">{question.text}</p>
                  
                  {question.probes && question.probes.length > 0 && (
                    <div className="text-sm text-neutral-500 italic pl-4 border-l-2 border-neutral-200">
                      <p className="font-medium text-neutral-600 not-italic mb-1">Probing questions:</p>
                      {question.probes.map((probe, i) => (
                        <p key={i}>• {probe}</p>
                      ))}
                    </div>
                  )}
                  
                  <textarea
                    value={response?.finding || ''}
                    onChange={(e) => updateResponse(question.id, e.target.value)}
                    placeholder="Record the finding from resident responses..."
                    className="w-full px-4 py-3 border border-neutral-200 rounded-lg text-sm 
                             focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent
                             placeholder:text-neutral-400 resize-none"
                    rows={3}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quotes */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-neutral-500 uppercase tracking-wide">
          Direct Quotes
        </h3>
        
        {quotes.length > 0 && (
          <div className="space-y-3">
            {quotes.map((quote, idx) => (
              <div 
                key={idx} 
                className={`p-4 rounded-lg border-l-4 ${
                  quote.sentiment === 'positive' 
                    ? 'bg-green-50 border-green-500' 
                    : quote.sentiment === 'concern'
                    ? 'bg-red-50 border-red-500'
                    : 'bg-neutral-50 border-neutral-300'
                }`}
              >
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <p className="italic text-neutral-700">"{quote.text}"</p>
                    <p className="text-sm text-neutral-500 mt-1">— {quote.residentId}</p>
                  </div>
                  <button
                    onClick={() => removeQuote(idx)}
                    className="text-neutral-400 hover:text-red-500 text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="bg-neutral-50 rounded-lg p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              value={newQuote.residentId}
              onChange={(e) => setNewQuote(prev => ({ ...prev, residentId: e.target.value }))}
              placeholder="Resident ID (e.g., Resident A)"
              className="px-3 py-2 border border-neutral-200 rounded-lg text-sm
                       focus:outline-none focus:ring-2 focus:ring-neutral-900"
            />
            <select
              value={newQuote.sentiment}
              onChange={(e) => setNewQuote(prev => ({ ...prev, sentiment: e.target.value as Quote['sentiment'] }))}
              className="px-3 py-2 border border-neutral-200 rounded-lg text-sm
                       focus:outline-none focus:ring-2 focus:ring-neutral-900"
            >
              <option value="neutral">Neutral</option>
              <option value="positive">Positive</option>
              <option value="concern">Concern</option>
            </select>
          </div>
          <textarea
            value={newQuote.text}
            onChange={(e) => setNewQuote(prev => ({ ...prev, text: e.target.value }))}
            placeholder="Type the exact quote from the resident..."
            className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm
                     focus:outline-none focus:ring-2 focus:ring-neutral-900 resize-none"
            rows={2}
          />
          <button
            onClick={addQuote}
            disabled={!newQuote.text.trim() || !newQuote.residentId.trim()}
            className="px-4 py-2 bg-neutral-900 text-white text-sm font-medium rounded-lg
                     hover:bg-neutral-800 disabled:bg-neutral-300 disabled:cursor-not-allowed
                     transition-colors"
          >
            Add Quote
          </button>
        </div>
      </div>

      {/* Score */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-neutral-500 uppercase tracking-wide">
          Section Score
        </h3>
        
        <div className="bg-neutral-50 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <span className={`text-4xl font-bold ${getScoreColor(score)}`}>
                {score}/10
              </span>
              <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                score >= 7 ? 'bg-green-100 text-green-700' :
                score >= 5 ? 'bg-amber-100 text-amber-700' :
                'bg-red-100 text-red-700'
              }`}>
                {getScoreLabel(score)}
              </span>
            </div>
          </div>
          
          <input
            type="range"
            min="1"
            max="10"
            value={score}
            onChange={(e) => setScore(parseInt(e.target.value))}
            className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer
                     [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 
                     [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-neutral-900 
                     [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
          />
          
          <div className="flex justify-between text-xs text-neutral-400 mt-2">
            <span>1 - Inadequate</span>
            <span>5 - Needs Improvement</span>
            <span>10 - Excellent</span>
          </div>
        </div>
      </div>

      {/* Why This Score */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-neutral-500 uppercase tracking-wide">
          Why This Score?
        </h3>
        <p className="text-sm text-neutral-600">
          Explain what evidence supports this score. This will appear in the final report.
        </p>
        <textarea
          value={whyThisScore}
          onChange={(e) => setWhyThisScore(e.target.value)}
          placeholder="Based on the findings above, explain why you've given this score. Reference specific evidence and quotes..."
          className="w-full px-4 py-3 border border-neutral-200 rounded-lg text-sm
                   focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent
                   placeholder:text-neutral-400 resize-none"
          rows={5}
        />
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-6 border-t border-neutral-200">
        <button
          onClick={handlePrevious}
          disabled={isFirst}
          className="px-6 py-3 border border-neutral-200 text-neutral-700 font-medium rounded-lg
                   hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed
                   transition-colors"
        >
          Previous Section
        </button>
        
        <button
          onClick={handleNext}
          className="px-6 py-3 bg-neutral-900 text-white font-medium rounded-lg
                   hover:bg-neutral-800 transition-colors"
        >
          {isLast ? 'Finish & Generate Report' : 'Next Section'}
        </button>
      </div>
    </div>
  );
}
