'use client';

import React, { useState } from 'react';
import { useAudit } from '../context/AuditContext';
import { AuditSection as AuditSectionType } from '../types/audit';
import { getWordCount, isNarrativeValid } from '../types/audit';

interface Props {
  section: AuditSectionType;
  onNext: () => void;
  onPrevious: () => void;
  isFirst: boolean;
  isLast: boolean;
}

export default function AuditSection({ section, onNext, onPrevious, isFirst, isLast }: Props) {
  const {
    setup,
    sectionData,
    updateSectionAnswer,
    updateSectionNarrative,
    saveSectionScore,
    saveSectionNarrative,
    getSectionScore,
    setCurrentStep
  } = useAudit();

  const [showNarrative, setShowNarrative] = useState(false);
  const data = sectionData.get(section.id);
  const score = getSectionScore(section.id);
  const narrative = data?.narrative || '';
  const wordCount = getWordCount(narrative);
  const narrativeValid = isNarrativeValid(narrative, section.wordCountMin, section.wordCountMax);
  const allQuestionsAnswered = data?.answers.every(a => a.answer !== null) || false;

  const handleSaveScore = () => {
    saveSectionScore(section.id);
    setShowNarrative(true);
  };

  const handleSaveNarrative = () => {
    if (narrativeValid) {
      saveSectionNarrative(section.id);
      if (isLast) {
        setCurrentStep('report');
      } else {
        onNext();
        setShowNarrative(false);
      }
    }
  };

  const handleContinueWithoutNarrative = () => {
    if (isLast) {
      setCurrentStep('report');
    } else {
      onNext();
      setShowNarrative(false);
    }
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Audit Reference Box - Top Right */}
      {setup.auditNumber && (
        <div className="fixed top-4 right-4 bg-neutral-900 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          <span className="text-xs text-neutral-400 block">Audit Reference</span>
          <span className="text-lg font-semibold">{setup.auditNumber}</span>
        </div>
      )}

      <div className="max-w-3xl mx-auto p-8 pt-16">
        {/* Section Header */}
        <div className="mb-8">
          <p className="text-sm text-neutral-500 uppercase tracking-wide mb-2">
            {section.countryPrefix} Audit Section
          </p>
          <h1 className="text-2xl font-semibold text-neutral-900 mb-2">
            {section.countryPrefix} {section.title}
          </h1>
          <p className="text-neutral-600">
            ({section.maxScore} points)
          </p>
        </div>

        {/* Score Display */}
        <div className="bg-neutral-50 rounded-xl p-6 mb-8 flex items-center justify-between">
          <div>
            <p className="text-sm text-neutral-500">Current Score</p>
            <p className="text-3xl font-bold text-neutral-900">
              {score} / {section.maxScore}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-neutral-500">Completion</p>
            <p className="text-lg font-medium text-neutral-700">
              {data?.answers.filter(a => a.answer !== null).length || 0} / {section.questions.length} answered
            </p>
          </div>
        </div>

        {/* Questions */}
        {!showNarrative && (
          <div className="space-y-4 mb-8">
            {section.questions.map((question, index) => {
              const answer = data?.answers.find(a => a.questionId === question.id);
              return (
                <div
                  key={question.id}
                  className="border border-neutral-200 rounded-lg p-4 hover:border-neutral-300 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <p className="text-sm text-neutral-500 mb-1">
                        Question {question.number}
                      </p>
                      <p className="text-neutral-900">
                        {question.text}
                      </p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => updateSectionAnswer(section.id, question.id, true)}
                        className={`px-4 py-2 rounded-lg font-medium text-sm transition-all
                          ${answer?.answer === true
                            ? 'bg-green-600 text-white'
                            : 'bg-white text-neutral-700 border border-neutral-200 hover:border-green-400'
                          }`}
                      >
                        Yes (+1)
                      </button>
                      <button
                        onClick={() => updateSectionAnswer(section.id, question.id, false)}
                        className={`px-4 py-2 rounded-lg font-medium text-sm transition-all
                          ${answer?.answer === false
                            ? 'bg-red-600 text-white'
                            : 'bg-white text-neutral-700 border border-neutral-200 hover:border-red-400'
                          }`}
                      >
                        No (0)
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Save Score Button */}
        {!showNarrative && (
          <div className="mb-8">
            <button
              onClick={handleSaveScore}
              disabled={!allQuestionsAnswered}
              className="w-full px-6 py-4 bg-neutral-900 text-white font-medium rounded-lg
                       hover:bg-neutral-800 disabled:bg-neutral-300 disabled:cursor-not-allowed
                       transition-colors text-base"
            >
              {allQuestionsAnswered
                ? `Save Score (${score}/${section.maxScore}) & Add Narrative`
                : `Answer all questions to save (${data?.answers.filter(a => a.answer !== null).length || 0}/${section.questions.length})`
              }
            </button>
          </div>
        )}

        {/* Narrative Section */}
        {showNarrative && (
          <div className="border border-neutral-200 rounded-xl p-6 mb-8">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">
              {section.countryPrefix} {section.title} - Narrative
            </h2>
            <p className="text-sm text-neutral-600 mb-4">
              Write your narrative for this section. Required word count: {section.wordCountMin} - {section.wordCountMax} words.
            </p>
            <textarea
              value={narrative}
              onChange={(e) => updateSectionNarrative(section.id, e.target.value)}
              placeholder="Enter your detailed narrative for this section..."
              rows={10}
              className="w-full px-4 py-3 border border-neutral-200 rounded-lg text-base
                       focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent
                       placeholder:text-neutral-400 resize-none"
            />
            <div className="flex items-center justify-between mt-3">
              <div className={`text-sm ${
                wordCount < section.wordCountMin
                  ? 'text-amber-600'
                  : wordCount > section.wordCountMax
                    ? 'text-red-600'
                    : 'text-green-600'
              }`}>
                {wordCount} / {section.wordCountMin}-{section.wordCountMax} words
                {wordCount < section.wordCountMin && ` (${section.wordCountMin - wordCount} more needed)`}
                {wordCount > section.wordCountMax && ` (${wordCount - section.wordCountMax} too many)`}
              </div>
              {narrativeValid && (
                <span className="text-green-600 text-sm font-medium">Ready to save</span>
              )}
            </div>

            <div className="mt-6 space-y-3">
              <button
                onClick={handleSaveNarrative}
                disabled={!narrativeValid}
                className="w-full px-6 py-4 bg-neutral-900 text-white font-medium rounded-lg
                         hover:bg-neutral-800 disabled:bg-neutral-300 disabled:cursor-not-allowed
                         transition-colors text-base"
              >
                {narrativeValid
                  ? isLast ? 'Save Narrative & View Report' : 'Save Narrative & Continue'
                  : 'Complete word count to save'
                }
              </button>
              <button
                onClick={handleContinueWithoutNarrative}
                className="w-full px-6 py-3 text-neutral-600 hover:text-neutral-900 text-sm"
              >
                Continue without saving narrative (you can return later)
              </button>
              <button
                onClick={() => setShowNarrative(false)}
                className="w-full px-6 py-3 text-neutral-600 hover:text-neutral-900 text-sm"
              >
                ← Back to Questions
              </button>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex gap-4">
          {!isFirst && (
            <button
              onClick={() => {
                onPrevious();
                setShowNarrative(false);
              }}
              className="flex-1 px-6 py-3 border border-neutral-200 text-neutral-700 font-medium rounded-lg
                       hover:bg-neutral-50 transition-colors"
            >
              ← Previous Section
            </button>
          )}
          {isFirst && (
            <button
              onClick={() => setCurrentStep('visit-details')}
              className="flex-1 px-6 py-3 border border-neutral-200 text-neutral-700 font-medium rounded-lg
                       hover:bg-neutral-50 transition-colors"
            >
              ← Back to Visit Details
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
