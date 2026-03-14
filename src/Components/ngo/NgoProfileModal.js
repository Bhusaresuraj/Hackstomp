'use client';

import { useState } from 'react';

export default function NgoProfileModal({
  ngo,
  submitting,
  onSubmit,
  onClose,
}) {
  const [formValues, setFormValues] = useState({
    name: ngo?.name || '',
    description: ngo?.description || '',
    location: ngo?.location || '',
    contact_phone: ngo?.contact_phone || '',
    logo_url: ngo?.logo_url || '',
  });

  const updateField = (field, value) => {
    setFormValues((current) => ({
      ...current,
      [field]: value,
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4">
      <div className="w-full max-w-3xl rounded-3xl border border-teal-100 bg-white p-6 shadow-2xl sm:p-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-teal-700">
              Edit NGO Profile
            </p>
            <h3 className="mt-2 text-2xl font-extrabold text-teal-950">
              Update your NGO details
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Close
          </button>
        </div>

        <form
          className="mt-8 grid gap-4 md:grid-cols-2"
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit(formValues);
          }}
        >
          <label className="space-y-2 md:col-span-2">
            <span className="text-sm font-semibold text-teal-900">NGO Name</span>
            <input
              value={formValues.name}
              onChange={(event) => updateField('name', event.target.value)}
              required
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-100"
            />
          </label>

          <label className="space-y-2 md:col-span-2">
            <span className="text-sm font-semibold text-teal-900">Description</span>
            <textarea
              value={formValues.description}
              onChange={(event) => updateField('description', event.target.value)}
              rows={4}
              required
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-100"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-teal-900">Location</span>
            <input
              value={formValues.location}
              onChange={(event) => updateField('location', event.target.value)}
              required
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-100"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-teal-900">Contact Phone</span>
            <input
              value={formValues.contact_phone}
              onChange={(event) => updateField('contact_phone', event.target.value)}
              required
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-100"
            />
          </label>

          <label className="space-y-2 md:col-span-2">
            <span className="text-sm font-semibold text-teal-900">Profile Image URL</span>
            <input
              value={formValues.logo_url}
              onChange={(event) => updateField('logo_url', event.target.value)}
              placeholder="Paste public image URL"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-100"
            />
          </label>

          <div className="md:col-span-2 flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-xl bg-teal-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
