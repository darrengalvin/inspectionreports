'use client';

import { useState, type FormEvent } from 'react';

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

const SERVICE_OPTIONS = [
  { value: '', label: 'What are you interested in?' },
  { value: 'qm7-audit', label: 'QM7 Quality Management Audit' },
  { value: 'housing-inspection', label: 'Supported Housing Inspection' },
  { value: 'placement-assessment', label: 'Placement Assessment & Matching' },
  { value: 'training-audit', label: 'Training Craft Audit' },
  { value: 'bild-assessment', label: 'BILD PBS Pre-Mock Assessment' },
  { value: 're-audit', label: 'Re-Audit / Follow-Up Visit' },
  { value: 'general', label: 'General Enquiry' },
];

export default function ContactForm() {
  const [status, setStatus] = useState<FormStatus>('idle');
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    organisation: '',
    service: '',
    country: '',
    message: '',
  });

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus('submitting');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, submittedAt: new Date().toISOString() }),
      });

      if (!res.ok) throw new Error('Failed to submit');
      setStatus('success');
      setForm({ name: '', email: '', phone: '', organisation: '', service: '', country: '', message: '' });
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-10 text-center">
        <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-5">
          <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Enquiry Received</h3>
        <p className="text-neutral-400 mb-6">
          Thanks for getting in touch. Dave will review your enquiry and get back to you shortly.
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="text-sm text-neutral-400 hover:text-white underline transition-colors"
        >
          Submit another enquiry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-8 sm:p-10 text-left">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
        <div>
          <label htmlFor="contact-name" className="block text-sm font-medium text-neutral-300 mb-1.5">
            Your Name <span className="text-red-400">*</span>
          </label>
          <input
            id="contact-name"
            type="text"
            required
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
            placeholder="Full name"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-colors"
          />
        </div>
        <div>
          <label htmlFor="contact-email" className="block text-sm font-medium text-neutral-300 mb-1.5">
            Email Address <span className="text-red-400">*</span>
          </label>
          <input
            id="contact-email"
            type="email"
            required
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
            placeholder="you@organisation.co.uk"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-colors"
          />
        </div>
        <div>
          <label htmlFor="contact-phone" className="block text-sm font-medium text-neutral-300 mb-1.5">
            Phone Number
          </label>
          <input
            id="contact-phone"
            type="tel"
            value={form.phone}
            onChange={(e) => update('phone', e.target.value)}
            placeholder="Optional"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-colors"
          />
        </div>
        <div>
          <label htmlFor="contact-org" className="block text-sm font-medium text-neutral-300 mb-1.5">
            Organisation
          </label>
          <input
            id="contact-org"
            type="text"
            value={form.organisation}
            onChange={(e) => update('organisation', e.target.value)}
            placeholder="Company or service name"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-colors"
          />
        </div>
        <div>
          <label htmlFor="contact-service" className="block text-sm font-medium text-neutral-300 mb-1.5">
            Service Interested In <span className="text-red-400">*</span>
          </label>
          <select
            id="contact-service"
            required
            value={form.service}
            onChange={(e) => update('service', e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-colors appearance-none"
            style={{ colorScheme: 'dark' }}
          >
            {SERVICE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-neutral-800 text-white">
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="contact-country" className="block text-sm font-medium text-neutral-300 mb-1.5">
            Country / Region
          </label>
          <select
            id="contact-country"
            value={form.country}
            onChange={(e) => update('country', e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-colors appearance-none"
            style={{ colorScheme: 'dark' }}
          >
            <option value="" className="bg-neutral-800 text-white">Select region...</option>
            <option value="england" className="bg-neutral-800 text-white">England</option>
            <option value="scotland" className="bg-neutral-800 text-white">Scotland</option>
            <option value="wales" className="bg-neutral-800 text-white">Wales</option>
            <option value="northern-ireland" className="bg-neutral-800 text-white">Northern Ireland</option>
          </select>
        </div>
      </div>

      <div className="mb-6">
        <label htmlFor="contact-message" className="block text-sm font-medium text-neutral-300 mb-1.5">
          Tell us about your needs <span className="text-red-400">*</span>
        </label>
        <textarea
          id="contact-message"
          required
          rows={4}
          value={form.message}
          onChange={(e) => update('message', e.target.value)}
          placeholder="What service do you run? What challenges are you facing? Any specific dates you need an audit by?"
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-colors resize-none"
        />
      </div>

      {status === 'error' && (
        <div className="mb-5 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-300 text-sm">
          Something went wrong. Please try again or email directly at dave@dpbcareconsultancy.co.uk
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="w-full sm:w-auto bg-white text-neutral-900 px-8 py-3.5 rounded-xl font-medium text-base hover:bg-neutral-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {status === 'submitting' ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Sending...
            </>
          ) : (
            'Send Enquiry'
          )}
        </button>
        <p className="text-neutral-500 text-xs">
          Dave typically responds within 24 hours.
        </p>
      </div>
    </form>
  );
}
