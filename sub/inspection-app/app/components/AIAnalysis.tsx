'use client';

import React, { useState } from 'react';

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

  const runAnalysis = async () => {
    setIsLoading(true);
    setResult(null);

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
        // Bold
        if (line.startsWith('**') && line.endsWith('**')) {
          return <p key={i} className="font-semibold text-neutral-900 mt-4 mb-2">{line.replace(/\*\*/g, '')}</p>;
        }
        // Numbered list
        if (/^\d+\./.test(line)) {
          return <p key={i} className="ml-4 mb-1 text-neutral-700">{line}</p>;
        }
        // Bullet points
        if (line.startsWith('- ') || line.startsWith('• ')) {
          return <p key={i} className="ml-4 mb-1 text-neutral-700">{line}</p>;
        }
        // Empty lines
        if (line.trim() === '') {
          return <br key={i} />;
        }
        // Regular text
        return <p key={i} className="text-neutral-700 mb-2">{line}</p>;
      });
  };

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
          {!result && !isLoading && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">Ready to Analyse</h3>
              <p className="text-neutral-600 mb-6 max-w-md mx-auto">
                This will use AI to critically evaluate your inspection questions against official UK care 
                and housing guidance including CQC, Housing Ombudsman, and The Care Act.
              </p>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 max-w-md mx-auto mb-6">
                <p className="text-sm text-amber-800">
                  <strong>Note:</strong> This analysis uses OpenAI's reasoning model and may take 30-60 seconds 
                  to complete as it performs deep analysis.
                </p>
              </div>
              <button
                onClick={runAnalysis}
                className="px-6 py-3 bg-purple-600 text-white font-medium rounded-lg
                         hover:bg-purple-700 transition-colors"
              >
                Run Analysis
              </button>
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
        {result && result.success && (
          <div className="p-4 border-t border-neutral-200 flex justify-between items-center">
            <button
              onClick={() => setResult(null)}
              className="px-4 py-2 text-neutral-600 hover:text-neutral-900"
            >
              Run Again
            </button>
            <button
              onClick={() => {
                if (result.analysis) {
                  navigator.clipboard.writeText(result.analysis);
                  alert('Analysis copied to clipboard');
                }
              }}
              className="px-4 py-2 bg-neutral-900 text-white font-medium rounded-lg hover:bg-neutral-800"
            >
              Copy to Clipboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
