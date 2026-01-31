'use client';

import React from 'react';
import { useInspection } from '../context/InspectionContext';

interface Props {
  onComplete: () => void;
}

export default function PropertySetup({ onComplete }: Props) {
  const {
    propertyName,
    setPropertyName,
    providerName,
    setProviderName,
    residentsInterviewed,
    setResidentsInterviewed,
    totalResidents,
    setTotalResidents
  } = useInspection();

  const isValid = propertyName.trim() && providerName.trim() && 
                  residentsInterviewed > 0 && totalResidents > 0;

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-8">
      <div className="max-w-lg w-full">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-semibold text-neutral-900 mb-3">
            New Inspection
          </h1>
          <p className="text-neutral-600">
            Enter the property details to begin the inspection questionnaire.
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Property Name
            </label>
            <input
              type="text"
              value={propertyName}
              onChange={(e) => setPropertyName(e.target.value)}
              placeholder="e.g., Maple House"
              className="w-full px-4 py-3 border border-neutral-200 rounded-lg text-base
                       focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent
                       placeholder:text-neutral-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Provider Name
            </label>
            <input
              type="text"
              value={providerName}
              onChange={(e) => setProviderName(e.target.value)}
              placeholder="e.g., Care Support Ltd"
              className="w-full px-4 py-3 border border-neutral-200 rounded-lg text-base
                       focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent
                       placeholder:text-neutral-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Residents Interviewed
              </label>
              <input
                type="number"
                min="1"
                value={residentsInterviewed || ''}
                onChange={(e) => setResidentsInterviewed(parseInt(e.target.value) || 0)}
                placeholder="e.g., 8"
                className="w-full px-4 py-3 border border-neutral-200 rounded-lg text-base
                         focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent
                         placeholder:text-neutral-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Total Residents
              </label>
              <input
                type="number"
                min="1"
                value={totalResidents || ''}
                onChange={(e) => setTotalResidents(parseInt(e.target.value) || 0)}
                placeholder="e.g., 12"
                className="w-full px-4 py-3 border border-neutral-200 rounded-lg text-base
                         focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent
                         placeholder:text-neutral-400"
              />
            </div>
          </div>

          <button
            onClick={onComplete}
            disabled={!isValid}
            className="w-full mt-4 px-6 py-4 bg-neutral-900 text-white font-medium rounded-lg
                     hover:bg-neutral-800 disabled:bg-neutral-300 disabled:cursor-not-allowed
                     transition-colors text-base"
          >
            Start Inspection
          </button>
        </div>

        <p className="text-center text-sm text-neutral-500 mt-8">
          This will guide you through 15 question areas covering all aspects 
          of supported housing quality.
        </p>
      </div>
    </div>
  );
}
