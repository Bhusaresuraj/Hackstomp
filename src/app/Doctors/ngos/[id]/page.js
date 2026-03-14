'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, MapPin, Phone, Mail, ShieldCheck, BadgeCheck, UserPlus } from 'lucide-react';
import DoctorSidebar from '@/Components/DoctorSidebar';
import { supabase } from '@/lib/supabase';

const fallbackNgoImage = 'https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&w=1200&q=80';

export default function DoctorNgoProfileView() {
  const params = useParams();
  const router = useRouter();
  const ngoId = params?.id;

  const [ngo, setNgo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [doctorId, setDoctorId] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    if (!ngoId) return;

    const fetchNgoDetails = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const currentUserId = session?.user?.id;
      
      if (currentUserId) {
        setDoctorId(currentUserId);
      }

      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('ngos')
        .select('*')
        .eq('id', ngoId)
        .maybeSingle();

      if (fetchError) {
        setError(fetchError.message);
      } else if (!data) {
        setError('NGO profile not found or has been removed.');
      } else {
        setNgo(data);

        if (currentUserId) {
          // Check if a connection request already exists
          const { data: reqData } = await supabase
            .from('ngo_connection_requests')
            .select('*')
            .eq('ngo_id', ngoId)
            .eq('doctor_id', currentUserId)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();
            
          if (reqData) {
            setConnectionStatus(reqData.status);
          } else {
            // Fallback check if they are already fully connected in ngo_doctors table
            const { data: connData } = await supabase
               .from('ngo_doctors')
               .select('*')
               .eq('ngo_id', ngoId)
               .eq('doctor_id', currentUserId)
               .maybeSingle();
               
            if (connData) setConnectionStatus('accepted');
          }
        }
      }
      setLoading(false);
    };

    fetchNgoDetails();
  }, [ngoId]);

  const handleConnect = async () => {
    if (!doctorId) return alert('Please sign in to connect.');
    setConnecting(true);
    
    const { error } = await supabase.from('ngo_connection_requests').insert({
      ngo_id: ngoId,
      doctor_id: doctorId,
      requester_role: 'doctor',
      status: 'pending'
    });

    if (error) alert(error.message);
    else setConnectionStatus('pending');
    
    setConnecting(false);
  };

  return (
    <div className="flex min-h-screen bg-teal-50 text-slate-800 font-sans">
      <DoctorSidebar />

      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
        <div className="mx-auto max-w-5xl space-y-8">
          
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>

            {ngo && (
               <button
                  onClick={handleConnect}
                  disabled={connecting || connectionStatus}
                  className={`inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-bold shadow-sm transition ${
                    connectionStatus === 'accepted' ? 'bg-emerald-100 text-emerald-700 cursor-default' :
                    connectionStatus === 'pending' ? 'bg-amber-100 text-amber-700 cursor-default' :
                    'bg-teal-600 text-white hover:bg-teal-700'
                  }`}
               >
                  {connectionStatus === 'accepted' ? <ShieldCheck className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
                  {connectionStatus === 'accepted' ? 'Connected' :
                   connectionStatus === 'pending' ? 'Request Pending' :
                   connecting ? 'Sending Request...' : 'Connect with NGO'}
               </button>
            )}
          </div>

          {loading ? (
            <div className="rounded-3xl border border-teal-100 bg-white p-8 text-sm text-slate-600 shadow-xl">
              Loading NGO details...
            </div>
          ) : error ? (
            <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-sm text-red-700 shadow-xl">
              {error}
            </div>
          ) : ngo ? (
            <>
              <section className="overflow-hidden rounded-3xl border border-teal-100 bg-white shadow-xl">
                <div className="relative h-72 overflow-hidden bg-gradient-to-br from-teal-900 via-teal-700 to-emerald-500">
                  <img
                    src={ngo.logo_url || fallbackNgoImage}
                    alt={ngo.name}
                    onError={(e) => { e.currentTarget.src = fallbackNgoImage; }}
                    className="h-full w-full object-cover opacity-80 mix-blend-overlay"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-teal-950/85 via-teal-900/40 to-transparent" />
                  <div className="absolute left-6 top-6 flex flex-wrap gap-2">
                    <span className="rounded-full bg-white/95 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-teal-800 shadow-sm">
                      {ngo.location}
                    </span>
                    {ngo.verified && (
                      <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-emerald-700 shadow-sm">
                        <BadgeCheck className="h-3.5 w-3.5" />
                        Verified
                      </span>
                    )}
                  </div>
                  <div className="absolute bottom-6 left-6 right-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-100">
                      NGO Collaboration Profile
                    </p>
                    <h1 className="mt-2 max-w-3xl text-4xl font-extrabold text-white sm:text-5xl">
                      {ngo.name}
                    </h1>
                    <p className="mt-3 max-w-3xl text-base leading-8 text-teal-50/90">
                      {ngo.description || "This NGO is focused on improving community health and organizing medical drives."}
                    </p>
                  </div>
                </div>
              </section>

              <div className="grid gap-8 md:grid-cols-2">
                <article className="rounded-3xl border border-teal-100 bg-white p-6 shadow-xl">
                  <p className="text-sm font-bold uppercase tracking-[0.22em] text-teal-700">Contact Details</p>
                  <div className="mt-5 space-y-4">
                    <div className="flex items-center gap-4 rounded-2xl border border-teal-100 bg-teal-50 p-4"><div className="rounded-full bg-white p-2 shadow-sm"><MapPin className="h-5 w-5 text-teal-700" /></div><div><p className="text-xs font-bold text-teal-800 uppercase tracking-wider">Location</p><p className="text-sm font-medium text-slate-700">{ngo.location || 'Not available'}</p></div></div>
                    <div className="flex items-center gap-4 rounded-2xl border border-teal-100 bg-teal-50 p-4"><div className="rounded-full bg-white p-2 shadow-sm"><Phone className="h-5 w-5 text-teal-700" /></div><div><p className="text-xs font-bold text-teal-800 uppercase tracking-wider">Phone</p><p className="text-sm font-medium text-slate-700">{ngo.contact_phone || 'Not available'}</p></div></div>
                    <div className="flex items-center gap-4 rounded-2xl border border-teal-100 bg-teal-50 p-4"><div className="rounded-full bg-white p-2 shadow-sm"><Mail className="h-5 w-5 text-teal-700" /></div><div><p className="text-xs font-bold text-teal-800 uppercase tracking-wider">Email</p><p className="text-sm font-medium text-slate-700">{ngo.contact_email || 'Not available'}</p></div></div>
                  </div>
                </article>

                <article className="rounded-3xl border border-teal-100 bg-white p-6 shadow-xl">
                  <p className="text-sm font-bold uppercase tracking-[0.22em] text-teal-700">Metrics & Status</p>
                  <div className="mt-5 grid grid-cols-2 gap-4">
                    <div className="rounded-2xl border border-teal-100 bg-teal-50 p-5 text-center"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Total Drives</p><p className="mt-2 text-4xl font-extrabold text-teal-950">{ngo.total_drives || 0}</p></div>
                    <div className="rounded-2xl border border-teal-100 bg-teal-50 p-5 text-center"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Success Score</p><p className="mt-2 text-4xl font-extrabold text-teal-950">{ngo.success_score || 0}</p></div>
                    <div className="col-span-2 flex items-center justify-between rounded-2xl border border-teal-100 bg-white p-4 shadow-sm"><div className="flex items-center gap-2 font-bold text-teal-900"><ShieldCheck className="h-5 w-5 text-teal-600" /> Profile Status</div><span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${ngo.verified ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>{ngo.verified ? 'Verified' : 'Pending'}</span></div>
                  </div>
                </article>
              </div>
            </>
          ) : null}
        </div>
      </main>
    </div>
  );
}