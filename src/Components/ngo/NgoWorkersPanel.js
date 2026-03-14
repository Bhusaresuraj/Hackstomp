'use client';

import { useState } from 'react';
import { UserPlus, CheckCircle2, ShieldAlert } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function NgoWorkersPanel({ activeNgo }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [recentWorkers, setRecentWorkers] = useState([]);

  const handleCreateWorker = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!activeNgo?.id) {
      setError('No active NGO profile found.');
      setLoading(false);
      return;
    }

    // Register the worker in Supabase Auth and assign their role
    const { error: signUpError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          full_name: name,
          role: 'worker',
          ngo_id: activeNgo.id, // Binds the worker to this specific NGO
        },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
    } else {
      setRecentWorkers((prev) => [{ name, email, password, id: Date.now() }, ...prev]);
      setSuccess(`Worker account for ${name} created successfully! They can now log in using these credentials.`);
      setName('');
      setEmail('');
      setPassword('');
    }
    setLoading(false);
  };

  return (
    <section id="workers" className="space-y-6">
      <div className="rounded-3xl border border-teal-100 bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-teal-700">
              Worker Management
            </p>
            <h3 className="mt-2 text-2xl font-extrabold text-teal-950">
              Register Field Workers
            </h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Create accounts for your field workers so they can log in and submit village audits directly on behalf of your NGO.
            </p>
          </div>
          <div className="rounded-2xl bg-teal-50 p-3 text-teal-700">
            <UserPlus className="h-5 w-5" />
          </div>
        </div>
      </div>

      <form onSubmit={handleCreateWorker} className="rounded-3xl border border-teal-100 bg-white p-6 shadow-xl sm:p-8">
        {success && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-800 shadow-sm">
            <CheckCircle2 className="h-6 w-6" />
            <p className="font-semibold">{success}</p>
          </div>
        )}

        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700 shadow-sm">
            <ShieldAlert className="h-6 w-6" />
            <p className="font-semibold">{error}</p>
          </div>
        )}

        <div className="grid gap-5 md:grid-cols-2">
          <label className="space-y-2 md:col-span-2">
            <span className="text-sm font-semibold text-teal-900">Worker Full Name</span>
            <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Ramesh Kumar" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-teal-400 focus:bg-white focus:ring-2 focus:ring-teal-100" />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-teal-900">Email Address</span>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="worker@example.com" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-teal-400 focus:bg-white focus:ring-2 focus:ring-teal-100" />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-teal-900">Temporary Password</span>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min 6 characters" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-teal-400 focus:bg-white focus:ring-2 focus:ring-teal-100" />
          </label>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            disabled={loading || !activeNgo?.id}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-8 py-3 text-sm font-bold text-white shadow-md transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <UserPlus className="h-5 w-5" />
            {loading ? 'Creating Worker...' : 'Create Worker Account'}
          </button>
        </div>
      </form>

      {recentWorkers.length > 0 && (
        <div className="rounded-3xl border border-teal-100 bg-white p-6 shadow-xl sm:p-8">
          <h3 className="text-xl font-extrabold text-teal-950 mb-2">Recently Added Workers</h3>
          <p className="text-sm text-amber-600 mb-5 font-medium">
            ⚠️ Please save these credentials now. For security reasons, passwords are not stored in plain text and will disappear when you refresh the page.
          </p>
          <div className="overflow-hidden rounded-xl border border-teal-100">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-teal-50 text-xs font-semibold uppercase tracking-wider text-teal-800">
                <tr>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Temporary Password</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-teal-100 bg-white">
                {recentWorkers.map((w) => (
                  <tr key={w.id} className="transition hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium text-teal-900">{w.name}</td>
                    <td className="px-6 py-4">{w.email}</td>
                    <td className="px-6 py-4 font-mono font-medium text-slate-800 bg-slate-100 rounded px-2">{w.password}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}