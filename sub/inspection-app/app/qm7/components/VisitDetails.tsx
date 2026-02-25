'use client';

import React from 'react';
import { useAudit } from '../context/AuditContext';

export default function VisitDetails() {
  const {
    setup,
    visitDetails,
    updateVisitDetails,
    isVisitDetailsValid,
    saveVisitDetails,
    isVisitDetailsSaved,
    setCurrentStep
  } = useAudit();

  const handleSaveAndContinue = () => {
    saveVisitDetails();
    if (isVisitDetailsValid()) {
      setCurrentStep('audit');
    }
  };

  const clientOptions = Array.from({ length: 50 }, (_, i) => i + 1);
  const staffOptions = Array.from({ length: 30 }, (_, i) => i + 1);

  return (
    <div className="min-h-screen bg-white">
      {/* Audit Reference Box - Top Right */}
      {setup.auditNumber && (
        <div className="fixed top-4 right-4 bg-neutral-900 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          <span className="text-xs text-neutral-400 block">Audit Reference</span>
          <span className="text-lg font-semibold">{setup.auditNumber}</span>
        </div>
      )}

      <div className="max-w-2xl mx-auto p-8 pt-16">
        <button
          onClick={() => setCurrentStep('setup')}
          className="mb-6 text-neutral-600 hover:text-neutral-900 text-sm flex items-center gap-2"
        >
          ← Back to Setup
        </button>

        <div className="text-center mb-10">
          <h1 className="text-3xl font-semibold text-neutral-900 mb-3">
            Visit Details
          </h1>
          <p className="text-neutral-600">
            Record the details of your on-site visit.
          </p>
          <p className="text-sm text-neutral-500 mt-2">
            Service: {setup.serviceName}
          </p>
        </div>

        <div className="space-y-6">
          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Date of Visit
              </label>
              <input
                type="date"
                value={visitDetails.dateOfVisit}
                onChange={(e) => updateVisitDetails({ dateOfVisit: e.target.value })}
                className="w-full px-4 py-3 border border-neutral-200 rounded-lg text-base
                         focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Time of Visit
              </label>
              <input
                type="time"
                value={visitDetails.timeOfVisit}
                onChange={(e) => updateVisitDetails({ timeOfVisit: e.target.value })}
                className="w-full px-4 py-3 border border-neutral-200 rounded-lg text-base
                         focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
              />
            </div>
          </div>

          {/* Greeter Name */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Name of Person Greeting You
            </label>
            <input
              type="text"
              value={visitDetails.greeterName}
              onChange={(e) => updateVisitDetails({ greeterName: e.target.value })}
              placeholder="Enter name"
              className="w-full px-4 py-3 border border-neutral-200 rounded-lg text-base
                       focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent
                       placeholder:text-neutral-400"
            />
          </div>

          {/* ID Checked */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              ID Checked?
            </label>
            <div className="flex gap-4">
              <button
                onClick={() => updateVisitDetails({ idChecked: true })}
                className={`flex-1 py-3 rounded-lg border font-medium transition-all
                  ${visitDetails.idChecked === true
                    ? 'bg-green-600 text-white border-green-600'
                    : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-400'
                  }`}
              >
                Yes
              </button>
              <button
                onClick={() => updateVisitDetails({ idChecked: false })}
                className={`flex-1 py-3 rounded-lg border font-medium transition-all
                  ${visitDetails.idChecked === false
                    ? 'bg-red-600 text-white border-red-600'
                    : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-400'
                  }`}
              >
                No
              </button>
            </div>
          </div>

          {/* Clients and Staff Counts */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Number of Clients in Service
              </label>
              <select
                value={visitDetails.clientsInService || ''}
                onChange={(e) => updateVisitDetails({ clientsInService: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-3 border border-neutral-200 rounded-lg text-base
                         focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent
                         bg-white"
              >
                <option value="">Select...</option>
                {clientOptions.map(n => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Number of Staff on Shift
              </label>
              <select
                value={visitDetails.staffOnShift || ''}
                onChange={(e) => updateVisitDetails({ staffOnShift: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-3 border border-neutral-200 rounded-lg text-base
                         focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent
                         bg-white"
              >
                <option value="">Select...</option>
                {staffOptions.map(n => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Other Visitors */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Any Other Visitors in the Service?
            </label>
            <div className="flex gap-4">
              <button
                onClick={() => updateVisitDetails({ hasOtherVisitors: true })}
                className={`flex-1 py-3 rounded-lg border font-medium transition-all
                  ${visitDetails.hasOtherVisitors === true
                    ? 'bg-neutral-900 text-white border-neutral-900'
                    : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-400'
                  }`}
              >
                Yes
              </button>
              <button
                onClick={() => updateVisitDetails({ hasOtherVisitors: false })}
                className={`flex-1 py-3 rounded-lg border font-medium transition-all
                  ${visitDetails.hasOtherVisitors === false
                    ? 'bg-neutral-900 text-white border-neutral-900'
                    : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-400'
                  }`}
              >
                No
              </button>
            </div>
          </div>

          {/* Visitor Names (conditional) */}
          {visitDetails.hasOtherVisitors && (
            <div className="space-y-3 border border-neutral-200 rounded-lg p-4">
              <h3 className="font-medium text-neutral-900">Visitor Names</h3>
              <input
                type="text"
                value={visitDetails.visitorNames[0]}
                onChange={(e) => {
                  const newNames = [...visitDetails.visitorNames];
                  newNames[0] = e.target.value;
                  updateVisitDetails({ visitorNames: newNames });
                }}
                placeholder="1st Visitor Name"
                className="w-full px-4 py-3 border border-neutral-200 rounded-lg text-base
                         focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent
                         placeholder:text-neutral-400"
              />
              <input
                type="text"
                value={visitDetails.visitorNames[1]}
                onChange={(e) => {
                  const newNames = [...visitDetails.visitorNames];
                  newNames[1] = e.target.value;
                  updateVisitDetails({ visitorNames: newNames });
                }}
                placeholder="2nd Visitor Name (optional)"
                className="w-full px-4 py-3 border border-neutral-200 rounded-lg text-base
                         focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent
                         placeholder:text-neutral-400"
              />
              <input
                type="text"
                value={visitDetails.visitorNames[2]}
                onChange={(e) => {
                  const newNames = [...visitDetails.visitorNames];
                  newNames[2] = e.target.value;
                  updateVisitDetails({ visitorNames: newNames });
                }}
                placeholder="3rd Visitor Name (optional)"
                className="w-full px-4 py-3 border border-neutral-200 rounded-lg text-base
                         focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent
                         placeholder:text-neutral-400"
              />
            </div>
          )}

          {/* Client Focus */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-neutral-700">
              Client Focus Names
            </label>
            <input
              type="text"
              value={visitDetails.clientFocus1}
              onChange={(e) => updateVisitDetails({ clientFocus1: e.target.value })}
              placeholder="1st Name of Client Focus"
              className="w-full px-4 py-3 border border-neutral-200 rounded-lg text-base
                       focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent
                       placeholder:text-neutral-400"
            />
            <input
              type="text"
              value={visitDetails.clientFocus2}
              onChange={(e) => updateVisitDetails({ clientFocus2: e.target.value })}
              placeholder="2nd Name of Client Focus (optional)"
              className="w-full px-4 py-3 border border-neutral-200 rounded-lg text-base
                       focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent
                       placeholder:text-neutral-400"
            />
          </div>

          {/* Save Button */}
          <button
            onClick={handleSaveAndContinue}
            disabled={!isVisitDetailsValid()}
            className="w-full mt-4 px-6 py-4 bg-neutral-900 text-white font-medium rounded-lg
                     hover:bg-neutral-800 disabled:bg-neutral-300 disabled:cursor-not-allowed
                     transition-colors text-base"
          >
            {isVisitDetailsSaved ? 'Saved - Continue to Audit' : 'Save & Continue to Audit'}
          </button>
        </div>

        <p className="text-center text-sm text-neutral-500 mt-6">
          All fields marked above are required before proceeding to the audit sections.
        </p>
      </div>
    </div>
  );
}
