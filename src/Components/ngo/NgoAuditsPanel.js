'use client';

import { useEffect, useState } from 'react';
import { ClipboardList, MapPin } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function NgoAuditsPanel({ activeNgo }) {
  const [audits, setAudits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAudits = async () => {
      if (!activeNgo?.id) return;
      setLoading(true);
      
      const { data: auditsData, error: fetchError } = await supabase
        .from('village_audits')
        .select('*')
        .eq('ngo_id', activeNgo.id)
        .order('created_at', { ascending: false });

      if (fetchError) {
        setError(fetchError.message);
      } else if (auditsData && auditsData.length > 0) {
        // Extract unique worker IDs to fetch their details manually
        const workerIds = [...new Set(auditsData.map((a) => a.worker_id).filter(Boolean))];
        
        const { data: workersData } = await supabase
          .from('workers')
          .select('id, full_name, email')
          .in('id', workerIds);
          
        const workerMap = (workersData || []).reduce((acc, worker) => {
          acc[worker.id] = worker;
          return acc;
        }, {});

        const mergedAudits = auditsData.map((audit) => ({ ...audit, workers: workerMap[audit.worker_id] || null }));
        setAudits(mergedAudits);
      } else {
        setAudits([]);
      }
      setLoading(false);
    };

    fetchAudits();
  }, [activeNgo]);

  if (loading) return <div className="p-8 text-sm text-slate-600">Loading audits...</div>;
  if (error) return <div className="p-8 text-sm text-red-600">Error loading audits: {error}</div>;

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-teal-100 bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-teal-700">Field Operations</p>
            <h3 className="mt-2 text-2xl font-extrabold text-teal-950">Village Health Audits</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">Review ground reports submitted by your linked field workers.</p>
          </div>
          <div className="rounded-2xl bg-teal-50 p-3 text-teal-700">
            <ClipboardList className="h-5 w-5" />
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        {audits.length === 0 ? (
          <div className="col-span-2 rounded-3xl border border-dashed border-teal-200 bg-white p-8 text-center text-sm text-slate-600 shadow-xl">
            No audits have been submitted for your NGO yet.
          </div>
        ) : (
          audits.map((audit) => (
            <article key={audit.id} className="rounded-3xl border border-teal-100 bg-white p-6 shadow-xl">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-xl font-bold text-teal-950">{audit.village_name}</h4>
                  <div className="flex items-center text-sm text-slate-500 mt-1"><MapPin className="h-4 w-4 mr-1" /> {audit.district}</div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${audit.sanitation_status === 'Critical' ? 'bg-red-100 text-red-700' : audit.sanitation_status === 'Poor' ? 'bg-orange-100 text-orange-700' : audit.sanitation_status === 'Average' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                  {audit.sanitation_status} Sanitation
                </span>
              </div>
              <div className="space-y-4">
                <div className="bg-slate-50 p-4 rounded-2xl"><p className="text-xs font-bold text-slate-500 uppercase">Prevalent Diseases</p><p className="text-sm text-teal-900 mt-1 font-medium">{audit.prevalent_diseases || 'None reported'}</p></div>
                <div className="bg-slate-50 p-4 rounded-2xl"><p className="text-xs font-bold text-slate-500 uppercase">Medical Requirements</p><p className="text-sm text-teal-900 mt-1">{audit.medical_requirements}</p></div>
                {audit.additional_notes && <div className="bg-slate-50 p-4 rounded-2xl"><p className="text-xs font-bold text-slate-500 uppercase">Notes</p><p className="text-sm text-slate-700 mt-1">{audit.additional_notes}</p></div>}
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>By: {audit.workers?.full_name || 'Worker'}</span><span>{new Date(audit.created_at).toLocaleDateString()}</span>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}