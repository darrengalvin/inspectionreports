'use client';

import React from 'react';
import { useAudit } from '../context/AuditContext';
import { 
  ServiceType, 
  Country, 
  SERVICE_TYPE_LABELS, 
  COUNTRY_LABELS,
  requiresVisitDetails 
} from '../types/audit';

export default function AuditSetup() {
  const {
    setup,
    updateSetup,
    setServiceType,
    setCountry,
    searchQuery,
    setSearchQuery,
    isSetupValid,
    saveSetup,
    isSetupSaved,
    setCurrentStep
  } = useAudit();

  const serviceTypes: ServiceType[] = [
    'prep4life',
    'training-craft-audit',
    'supported-living',
    'day-service'
  ];

  const countries: Country[] = ['england', 'wales', 'scotland', 'northern-ireland'];

  const handleSaveAndContinue = () => {
    saveSetup();
    if (requiresVisitDetails(setup.serviceType)) {
      setCurrentStep('visit-details');
    } else {
      setCurrentStep('audit');
    }
  };

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
        <div className="text-center mb-10">
          <h1 className="text-3xl font-semibold text-neutral-900 mb-3">
            New Audit
          </h1>
          <p className="text-neutral-600">
            Create a new quality management audit by completing the details below.
          </p>
        </div>

        {/* Search Box */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Search Existing Audits
          </label>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by audit number or service name..."
            className="w-full px-4 py-3 border border-neutral-200 rounded-lg text-base
                     focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent
                     placeholder:text-neutral-400"
          />
        </div>

        <div className="space-y-6">
          {/* Service Type Selection */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Service Product Audit Type
            </label>
            <select
              value={setup.serviceType || ''}
              onChange={(e) => setServiceType(e.target.value as ServiceType)}
              className="w-full px-4 py-3 border border-neutral-200 rounded-lg text-base
                       focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent
                       bg-white"
            >
              <option value="">Select service type...</option>
              {serviceTypes.map(type => (
                <option key={type} value={type}>
                  {SERVICE_TYPE_LABELS[type]}
                </option>
              ))}
            </select>
          </div>

          {/* Country Selection */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Country
            </label>
            <p className="text-xs text-neutral-500 mb-2">
              The audit will operate according to this country's regulations and framework
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {countries.map(country => (
                <button
                  key={country}
                  onClick={() => setCountry(country)}
                  className={`px-4 py-3 rounded-lg border text-sm font-medium transition-all
                    ${setup.country === country
                      ? 'bg-neutral-900 text-white border-neutral-900'
                      : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-400'
                    }`}
                >
                  {COUNTRY_LABELS[country]}
                </button>
              ))}
            </div>
          </div>

          {/* Service Name */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Name of Service
            </label>
            <input
              type="text"
              value={setup.serviceName}
              onChange={(e) => updateSetup({ serviceName: e.target.value })}
              placeholder="Enter the service name"
              className="w-full px-4 py-3 border border-neutral-200 rounded-lg text-base
                       focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent
                       placeholder:text-neutral-400"
            />
          </div>

          {/* Key Contact 1 */}
          <div className="border border-neutral-200 rounded-lg p-4">
            <h3 className="font-medium text-neutral-900 mb-4">Key Contact 1</h3>
            <div className="space-y-3">
              <input
                type="text"
                value={setup.keyContact1.name}
                onChange={(e) => updateSetup({
                  keyContact1: { ...setup.keyContact1, name: e.target.value }
                })}
                placeholder="Name and surname"
                className="w-full px-4 py-3 border border-neutral-200 rounded-lg text-base
                         focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent
                         placeholder:text-neutral-400"
              />
              <input
                type="email"
                value={setup.keyContact1.email}
                onChange={(e) => updateSetup({
                  keyContact1: { ...setup.keyContact1, email: e.target.value }
                })}
                placeholder="Email address"
                className="w-full px-4 py-3 border border-neutral-200 rounded-lg text-base
                         focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent
                         placeholder:text-neutral-400"
              />
              <input
                type="tel"
                value={setup.keyContact1.phone}
                onChange={(e) => updateSetup({
                  keyContact1: { ...setup.keyContact1, phone: e.target.value }
                })}
                placeholder="Phone number"
                className="w-full px-4 py-3 border border-neutral-200 rounded-lg text-base
                         focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent
                         placeholder:text-neutral-400"
              />
            </div>
          </div>

          {/* Key Contact 2 */}
          <div className="border border-neutral-200 rounded-lg p-4">
            <h3 className="font-medium text-neutral-900 mb-4">Key Contact 2 (Optional)</h3>
            <div className="space-y-3">
              <input
                type="text"
                value={setup.keyContact2.name}
                onChange={(e) => updateSetup({
                  keyContact2: { ...setup.keyContact2, name: e.target.value }
                })}
                placeholder="Name and surname"
                className="w-full px-4 py-3 border border-neutral-200 rounded-lg text-base
                         focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent
                         placeholder:text-neutral-400"
              />
              <input
                type="email"
                value={setup.keyContact2.email}
                onChange={(e) => updateSetup({
                  keyContact2: { ...setup.keyContact2, email: e.target.value }
                })}
                placeholder="Email address"
                className="w-full px-4 py-3 border border-neutral-200 rounded-lg text-base
                         focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent
                         placeholder:text-neutral-400"
              />
              <input
                type="tel"
                value={setup.keyContact2.phone}
                onChange={(e) => updateSetup({
                  keyContact2: { ...setup.keyContact2, phone: e.target.value }
                })}
                placeholder="Phone number"
                className="w-full px-4 py-3 border border-neutral-200 rounded-lg text-base
                         focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent
                         placeholder:text-neutral-400"
              />
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSaveAndContinue}
            disabled={!isSetupValid()}
            className="w-full mt-4 px-6 py-4 bg-neutral-900 text-white font-medium rounded-lg
                     hover:bg-neutral-800 disabled:bg-neutral-300 disabled:cursor-not-allowed
                     transition-colors text-base"
          >
            {isSetupSaved ? 'Saved - Continue' : 'Save & Continue'}
          </button>
        </div>

        {/* Service type info */}
        {setup.serviceType && (
          <p className="text-center text-sm text-neutral-500 mt-6">
            {requiresVisitDetails(setup.serviceType)
              ? 'You\'ll be asked to complete visit details next.'
              : 'After saving, you\'ll proceed directly to the audit sections.'}
          </p>
        )}
      </div>
    </div>
  );
}
