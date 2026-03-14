'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Activity, CheckCircle2, ClipboardList, MapPin, Stethoscope } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function WorkerDashboard() {
  const router = useRouter();
  const [worker, setWorker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [ngos, setNgos] = useState([]);
  const [selectedNgo, setSelectedNgo] = useState('');
  const [linkingNgo, setLinkingNgo] = useState(false);

  const [formData, setFormData] = useState({
    village_name: '',
    district: '',
    prevalent_diseases: '',
    sanitation_status: 'Average',
    medical_requirements: '',
    additional_notes: '',
  });

  useEffect(() => {
    const loadUser = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error || !session?.user) {
        router.push('/login');
        return;
      }

      const currentWorker = {
        id: session.user.id,
        name: session.user.user_metadata?.full_name || 'Health Worker',
        email: session.user.email,
        ngo_id: session.user.user_metadata?.ngo_id || null,
      };

      setWorker(currentWorker);

      if (!currentWorker.ngo_id) {
        const { data } = await supabase.from('ngos').select('id, name, location').order('name');
        setNgos(data || []);
      }
      setLoading(false);
    };

    loadUser();
  }, [router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const handleLinkNgo = async (e) => {
    e.preventDefault();
    if (!selectedNgo) return;
    setLinkingNgo(true);
    setErrorMessage('');

    const { error } = await supabase.auth.updateUser({
      data: { ngo_id: selectedNgo }
    });

    if (error) {
      setErrorMessage(error.message);
      setLinkingNgo(false);
      return;
    }

    // Map the worker to the NGO in the backend explicitly
    const { error: insertError } = await supabase.from('workers').upsert({ 
      id: worker.id, 
      ngo_id: selectedNgo, 
      full_name: worker.name, 
      email: worker.email 
    });

    if (insertError) {
      console.error("Failed to map worker in database:", insertError.message);
      setErrorMessage("Database error: " + insertError.message);
      setLinkingNgo(false);
      return; // Stop here if the database fails
    }

    setWorker((prev) => ({ ...prev, ngo_id: selectedNgo }));
    setLinkingNgo(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    if (!worker?.id) {
      setErrorMessage('User not authenticated.');
      setSubmitting(false);
      return;
    }

    // Failsafe: Ensure the worker is in the workers table before submitting the audit.
    // This auto-repairs any accounts that got stuck in a partially-linked state.
    const { error: workerUpsertError } = await supabase.from('workers').upsert({
      id: worker.id,
      ngo_id: worker.ngo_id,
      full_name: worker.name,
      email: worker.email
    });

    if (workerUpsertError) {
      console.warn("Failsafe worker insert warning:", workerUpsertError.message);
    }

    const { error } = await supabase.from('village_audits').insert({
      worker_id: worker.id,
      ngo_id: worker.ngo_id,
      ...formData
    });

    if (error) {
      setErrorMessage(error.message);
    } else {
      setSuccessMessage('Village audit submitted successfully! Your report has been logged.');
      setFormData({
        village_name: '',
        district: '',
        prevalent_diseases: '',
        sanitation_status: 'Average',
        medical_requirements: '',
        additional_notes: '',
      });
      
      // Clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(''), 5000);
    }
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-teal-50">
        <div className="text-lg font-semibold text-teal-700">Loading workspace...</div>
      </div>
    );
  }

  if (worker && !worker.ngo_id) {
    return (
      <div className="min-h-screen bg-teal-50">
        <header className="bg-white shadow-sm border-b border-teal-100">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
            <div className="flex items-center gap-2 text-teal-800">
              <ClipboardList className="h-6 w-6" />
              <h1 className="text-xl font-extrabold tracking-tight">Worker Portal</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-slate-600 hidden sm:block">{worker?.name}</span>
              <button onClick={handleLogout} className="rounded-lg border border-teal-200 bg-teal-50 px-4 py-2 text-sm font-bold text-teal-700 transition hover:bg-teal-100">
                Sign Out
              </button>
            </div>
          </div>
        </header>
        <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
          <div className="rounded-3xl border border-teal-100 bg-white p-6 shadow-xl sm:p-8">
            <h2 className="text-2xl font-extrabold text-teal-950">Welcome, {worker.name}!</h2>
            <p className="mt-3 text-slate-600">Please select an NGO to collaborate with before you can submit village audits.</p>
            
            {errorMessage && (
              <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleLinkNgo} className="mt-6 space-y-5">
              <label className="space-y-2 block">
                <span className="text-sm font-semibold text-teal-900">Select NGO</span>
                <select required value={selectedNgo} onChange={(e) => setSelectedNgo(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-teal-400 focus:bg-white focus:ring-2 focus:ring-teal-100">
                  <option value="" disabled>Choose an NGO...</option>
                  {ngos.map((ngo) => (
                    <option key={ngo.id} value={ngo.id}>{ngo.name} ({ngo.location})</option>
                  ))}
                </select>
              </label>

              <button type="submit" disabled={linkingNgo || !selectedNgo} className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-8 py-3 text-sm font-bold text-white shadow-md transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-70">
                {linkingNgo ? 'Linking...' : 'Join NGO'}
              </button>
            </form>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-teal-50">
      {/* Top Navigation */}
      <header className="bg-white shadow-sm border-b border-teal-100">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-2 text-teal-800">
            <ClipboardList className="h-6 w-6" />
            <h1 className="text-xl font-extrabold tracking-tight">Worker Portal</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-slate-600 hidden sm:block">
              {worker?.name}
            </span>
            <button
              onClick={handleLogout}
              className="rounded-lg border border-teal-200 bg-teal-50 px-4 py-2 text-sm font-bold text-teal-700 transition hover:bg-teal-100"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <div className="mb-8">
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-teal-700">
            Field Operations
          </p>
          <h2 className="mt-2 text-3xl font-extrabold text-teal-950">
            Village Health Audit Form
          </h2>
          <p className="mt-3 text-slate-600">
            Submit your ground reports to help NGOs and Doctors understand the current medical requirements and sanitary conditions of rural areas.
          </p>
        </div>

        {successMessage && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-800 shadow-sm">
            <CheckCircle2 className="h-6 w-6" />
            <p className="font-semibold">{successMessage}</p>
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700 shadow-sm">
            <p className="font-semibold">Error submitting report: {errorMessage}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8 rounded-3xl border border-teal-100 bg-white p-6 shadow-xl sm:p-8">
          
          {/* Section 1: Location */}
          <section>
            <div className="mb-5 flex items-center gap-2 text-teal-800 border-b border-teal-50 pb-3">
              <MapPin className="h-5 w-5" />
              <h3 className="text-lg font-bold">Location Details</h3>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-semibold text-teal-900">Village Name <span className="text-red-500">*</span></span>
                <input required type="text" name="village_name" value={formData.village_name} onChange={handleChange} placeholder="e.g. Palghar Village" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-teal-400 focus:bg-white focus:ring-2 focus:ring-teal-100" />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-semibold text-teal-900">District / Region <span className="text-red-500">*</span></span>
                <input required type="text" name="district" value={formData.district} onChange={handleChange} placeholder="e.g. Maharashtra" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-teal-400 focus:bg-white focus:ring-2 focus:ring-teal-100" />
              </label>
            </div>
          </section>

          {/* Section 2: Health Status */}
          <section>
            <div className="mb-5 flex items-center gap-2 text-teal-800 border-b border-teal-50 pb-3">
              <Activity className="h-5 w-5" />
              <h3 className="text-lg font-bold">Health & Sanitary Audit</h3>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-semibold text-teal-900">Prevalent Diseases</span>
                <input type="text" name="prevalent_diseases" value={formData.prevalent_diseases} onChange={handleChange} placeholder="e.g. Malaria, Dengue, Waterborne" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-teal-400 focus:bg-white focus:ring-2 focus:ring-teal-100" />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-semibold text-teal-900">Sanitation Status</span>
                <select name="sanitation_status" value={formData.sanitation_status} onChange={handleChange} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-teal-400 focus:bg-white focus:ring-2 focus:ring-teal-100">
                  <option value="Good">Good (Adequate waste disposal)</option>
                  <option value="Average">Average (Needs improvement)</option>
                  <option value="Poor">Poor (High risk of infection)</option>
                  <option value="Critical">Critical (Immediate action required)</option>
                </select>
              </label>
            </div>
          </section>

          {/* Section 3: Requirements */}
          <section>
            <div className="mb-5 flex items-center gap-2 text-teal-800 border-b border-teal-50 pb-3">
              <Stethoscope className="h-5 w-5" />
              <h3 className="text-lg font-bold">Medical Requirements</h3>
            </div>
            <div className="grid gap-5">
              <label className="space-y-2">
                <span className="text-sm font-semibold text-teal-900">Required Interventions / Supplies <span className="text-red-500">*</span></span>
                <textarea required name="medical_requirements" value={formData.medical_requirements} onChange={handleChange} rows={3} placeholder="List required medicines, doctor camps needed, vaccines, etc." className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-teal-400 focus:bg-white focus:ring-2 focus:ring-teal-100" />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-semibold text-teal-900">Additional Notes (Optional)</span>
                <textarea name="additional_notes" value={formData.additional_notes} onChange={handleChange} rows={2} placeholder="Any other observations regarding infrastructure or patient count..." className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-teal-400 focus:bg-white focus:ring-2 focus:ring-teal-100" />
              </label>
            </div>
          </section>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-8 py-4 text-sm font-bold text-white shadow-md transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting Report...
                </>
              ) : (
                <>
                  <ClipboardList className="h-5 w-5" />
                  Submit Village Audit
                </>
              )}
            </button>
          </div>

        </form>
      </main>
    </div>
  );
}