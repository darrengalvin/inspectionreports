'use client';

import React, { useState } from 'react';
import { savedAnalysis } from '../data/saved-analysis';

interface AnalysisResult {
  success: boolean;
  analysis?: string;
  model?: string;
  error?: string;
}

export default function AIAnalysis() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [showSaved, setShowSaved] = useState(false);

  const runAnalysis = async () => {
    setIsLoading(true);
    setResult(null);
    setShowSaved(false);

    try {
      const response = await fetch('/api/analyze-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to connect to API'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getRiskColor = (level: string) => {
    if (level === 'Critical') return 'bg-red-100 text-red-800';
    if (level === 'High') return 'bg-orange-100 text-orange-800';
    if (level === 'Medium') return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  // Parse markdown-style formatting for display
  const formatAnalysis = (text: string) => {
    return text
      .split('\n')
      .map((line, i) => {
        // Headers
        if (line.startsWith('### ')) {
          return <h4 key={i} className="text-lg font-semibold text-neutral-900 mt-6 mb-2">{line.replace('### ', '')}</h4>;
        }
        if (line.startsWith('## ')) {
          return <h3 key={i} className="text-xl font-bold text-neutral-900 mt-8 mb-3">{line.replace('## ', '')}</h3>;
        }
        if (line.startsWith('# ')) {
          return <h2 key={i} className="text-2xl font-bold text-neutral-900 mt-8 mb-4">{line.replace('# ', '')}</h2>;
        }
        // Bold text within lines
        const boldPattern = /\*\*(.+?)\*\*/g;
        if (boldPattern.test(line)) {
          const parts = line.split(boldPattern);
          return (
            <p key={i} className="text-neutral-700 mb-2">
              {parts.map((part, j) => j % 2 === 1 ? <strong key={j}>{part}</strong> : part)}
            </p>
          );
        }
        // Numbered list
        if (/^\d+[\.\)]/.test(line)) {
          return <p key={i} className="ml-4 mb-2 text-neutral-700">{line}</p>;
        }
        // Bullet points
        if (line.startsWith('- ') || line.startsWith('• ') || line.startsWith('  -') || line.startsWith('  •')) {
          const indent = line.startsWith('  ') ? 'ml-8' : 'ml-4';
          return <p key={i} className={`${indent} mb-1 text-neutral-700`}>{line.trim()}</p>;
        }
        // Empty lines
        if (line.trim() === '') {
          return <div key={i} className="h-2" />;
        }
        // Regular text
        return <p key={i} className="text-neutral-700 mb-2 leading-relaxed">{line}</p>;
      });
  };

  const renderSavedAnalysis = () => (
    <div className="space-y-8">
      {/* Executive Summary */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-200">
        <h2 className="text-2xl font-bold text-neutral-900 mb-4">Executive Summary</h2>
        <div className="flex items-center gap-4 mb-6">
          <div className="text-5xl font-bold text-purple-600">{savedAnalysis.executiveSummary.score}/100</div>
          <div className="flex-1">
            <div className="h-4 bg-neutral-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-blue-500" 
                style={{ width: `${savedAnalysis.executiveSummary.score}%` }}
              />
            </div>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold text-green-800 mb-2">Top Strengths</h3>
            {savedAnalysis.executiveSummary.strengths.map((s, i) => (
              <p key={i} className="text-sm text-green-700 mb-1">✓ {s}</p>
            ))}
          </div>
          <div>
            <h3 className="font-semibold text-red-800 mb-2">Critical Gaps</h3>
            {savedAnalysis.executiveSummary.criticalGaps.map((g, i) => (
              <p key={i} className="text-sm text-red-700 mb-1">✗ {g}</p>
            ))}
          </div>
        </div>
      </div>

      {/* Strengths */}
      <div>
        <h2 className="text-xl font-bold text-neutral-900 mb-4 flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">✓</span>
          Detailed Strengths
        </h2>
        <div className="space-y-3">
          {savedAnalysis.strengths.map((s, i) => (
            <div key={i} className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-900">{s.area}</h3>
              <p className="text-green-800 text-sm mt-1">{s.description}</p>
              <p className="text-green-600 text-xs mt-2 font-medium">📋 {s.regulatoryRef}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Gaps */}
      <div>
        <h2 className="text-xl font-bold text-neutral-900 mb-4 flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600">!</span>
          Gap Analysis
        </h2>
        <div className="space-y-3">
          {savedAnalysis.gaps.map((g, i) => (
            <div key={i} className="bg-white border border-neutral-200 rounded-lg p-4 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-neutral-900">{g.area}</h3>
                <span className={`text-xs font-medium px-2 py-1 rounded ${getRiskColor(g.riskLevel)}`}>
                  {g.riskLevel} Risk
                </span>
              </div>
              <p className="text-neutral-700 text-sm">{g.description}</p>
              <p className="text-neutral-500 text-xs mt-2">📋 {g.regulatoryRef}</p>
              <p className="text-red-600 text-xs mt-1 font-medium">⚠️ Potential harm: {g.potentialHarm}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Missing Questions */}
      <div>
        <h2 className="text-xl font-bold text-neutral-900 mb-4 flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">+</span>
          Suggested Additional Questions
        </h2>
        <div className="space-y-6">
          {savedAnalysis.missingQuestions.map((theme, i) => (
            <div key={i} className="bg-blue-50 border border-blue-200 rounded-lg p-5">
              <h3 className="font-bold text-blue-900 mb-4">{theme.theme}</h3>
              <div className="space-y-4">
                {theme.questions.map((q, j) => (
                  <div key={j} className="bg-white rounded-lg p-4 border border-blue-100">
                    <p className="font-medium text-neutral-900 mb-2">"{q.text}"</p>
                    {q.probes && q.probes.length > 0 && (
                      <div className="ml-4 text-sm text-neutral-600 mb-2">
                        <p className="font-medium text-neutral-500">Probing questions:</p>
                        {q.probes.map((probe, k) => (
                          <p key={k} className="italic">• {probe}</p>
                        ))}
                      </div>
                    )}
                    <p className="text-xs text-blue-600 font-medium">📋 {q.regulatoryRef}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Risk Matrix */}
      <div>
        <h2 className="text-xl font-bold text-neutral-900 mb-4">Risk Matrix</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-neutral-100">
                <th className="text-left p-3 font-semibold">Gap</th>
                <th className="text-center p-3 font-semibold">Impact</th>
                <th className="text-center p-3 font-semibold">Likelihood</th>
                <th className="text-center p-3 font-semibold">Risk Score</th>
                <th className="text-center p-3 font-semibold">Priority</th>
              </tr>
            </thead>
            <tbody>
              {savedAnalysis.riskMatrix.map((r, i) => (
                <tr key={i} className="border-b border-neutral-100">
                  <td className="p-3 font-medium">{r.gap}</td>
                  <td className="p-3 text-center">{r.impact}/5</td>
                  <td className="p-3 text-center">{r.likelihood}/5</td>
                  <td className="p-3 text-center font-bold">{r.riskScore}</td>
                  <td className="p-3 text-center">
                    <span className={`text-xs font-medium px-2 py-1 rounded ${getRiskColor(r.priority)}`}>
                      {r.priority}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Implementation Roadmap */}
      <div>
        <h2 className="text-xl font-bold text-neutral-900 mb-4">Implementation Roadmap</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="font-bold text-red-900 mb-2">🚨 Immediate (Critical)</h3>
            {savedAnalysis.implementationRoadmap.immediate.map((item, i) => (
              <p key={i} className="text-sm text-red-800 mb-1">• {item}</p>
            ))}
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <h3 className="font-bold text-orange-900 mb-2">⚡ High Priority (1 month)</h3>
            {savedAnalysis.implementationRoadmap.highPriority.map((item, i) => (
              <p key={i} className="text-sm text-orange-800 mb-1">• {item}</p>
            ))}
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-bold text-yellow-900 mb-2">📋 Medium Priority (3 months)</h3>
            {savedAnalysis.implementationRoadmap.mediumPriority.map((item, i) => (
              <p key={i} className="text-sm text-yellow-800 mb-1">• {item}</p>
            ))}
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-bold text-green-900 mb-2">✨ Enhancement</h3>
            {savedAnalysis.implementationRoadmap.enhancement.map((item, i) => (
              <p key={i} className="text-sm text-green-800 mb-1">• {item}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50 px-4 py-3 bg-purple-600 text-white font-medium rounded-xl
                 shadow-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
        AI Question Analysis
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-200">
          <div>
            <h2 className="text-xl font-semibold text-neutral-900">AI Question Analysis</h2>
            <p className="text-sm text-neutral-600 mt-1">
              Evaluating inspection questions against authoritative UK care guidance
            </p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {showSaved && (
            renderSavedAnalysis()
          )}

          {!result && !isLoading && !showSaved && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">AI Question Analysis</h3>
              <p className="text-neutral-600 mb-6 max-w-md mx-auto">
                Evaluate your inspection questions against authoritative UK care and housing guidance 
                including CQC, Housing Ombudsman, Care Act, and more.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
                <button
                  onClick={() => setShowSaved(true)}
                  className="px-6 py-3 bg-neutral-900 text-white font-medium rounded-lg
                           hover:bg-neutral-800 transition-colors"
                >
                  View Saved Analysis
                </button>
                <button
                  onClick={runAnalysis}
                  className="px-6 py-3 bg-purple-600 text-white font-medium rounded-lg
                           hover:bg-purple-700 transition-colors"
                >
                  Run New Analysis (GPT-5.2)
                </button>
              </div>
              
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 max-w-lg mx-auto">
                <p className="text-sm text-purple-800">
                  <strong>GPT-5.2 Extended Thinking:</strong> New analysis uses OpenAI's latest model with 
                  extended reasoning capabilities for deep, comprehensive analysis. This may take 1-2 minutes.
                </p>
              </div>
            </div>
          )}

          {isLoading && (
            <div className="text-center py-12">
              <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">Analysing Questions...</h3>
              <p className="text-neutral-600">
                The AI is reviewing all 15 sections against authoritative guidance.
                <br />This may take up to a minute.
              </p>
            </div>
          )}

          {result && !result.success && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-red-900 mb-2">Analysis Failed</h3>
              <p className="text-red-700 mb-4">{result.error}</p>
              <p className="text-sm text-red-600 mb-4">
                Make sure the OPENAI_API_KEY environment variable is set in your Vercel project settings.
              </p>
              <button
                onClick={runAnalysis}
                className="px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700"
              >
                Try Again
              </button>
            </div>
          )}

          {result && result.success && result.analysis && (
            <div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-green-800 font-medium">Analysis Complete</span>
                </div>
                {result.model && (
                  <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                    Model: {result.model}
                  </span>
                )}
              </div>
              
              <div className="prose prose-neutral max-w-none">
                {formatAnalysis(result.analysis)}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {(result?.success || showSaved) && (
          <div className="p-4 border-t border-neutral-200 flex justify-between items-center">
            <button
              onClick={() => { setResult(null); setShowSaved(false); }}
              className="px-4 py-2 text-neutral-600 hover:text-neutral-900"
            >
              ← Back
            </button>
            <div className="flex gap-2">
              {!showSaved && (
                <button
                  onClick={() => setShowSaved(true)}
                  className="px-4 py-2 border border-neutral-200 text-neutral-700 font-medium rounded-lg hover:bg-neutral-50"
                >
                  View Saved
                </button>
              )}
              {showSaved && (
                <button
                  onClick={runAnalysis}
                  className="px-4 py-2 border border-purple-200 text-purple-700 font-medium rounded-lg hover:bg-purple-50"
                >
                  Run New Analysis
                </button>
              )}
              <button
                onClick={() => {
                  const text = result?.analysis || JSON.stringify(savedAnalysis, null, 2);
                  navigator.clipboard.writeText(text);
                  alert('Analysis copied to clipboard');
                }}
                className="px-4 py-2 bg-neutral-900 text-white font-medium rounded-lg hover:bg-neutral-800"
              >
                Copy to Clipboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
