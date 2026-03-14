'use client';

import { useState, useEffect } from 'react';
import DoctorSidebar from '@/Components/DoctorSidebar'; // Adjust path if your component is elsewhere
import DoctorProfileCard from '@/Components/DoctorProfileCard'; // Adjust path
import StatCard from '@/Components/StatCard'; // Adjust path
import DrNgoCard from '@/Components/DrNgoCard'; // Updated to use Doctor-specific card
import BlogCard from '@/Components/BlogCard'; // Adjust path
import DoctorBlogModal from '@/Components/DoctorBlogModal'; // Adjust path
import DoctorProfileModal from '@/Components/DoctorProfileModal'; // Adjust path
import { X, Send, MessageCircle, CheckCircle2, XCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function DoctorsPage() {
  const [doctor, setDoctor] = useState(null);
  const [verifyStatus, setVerifyStatus] = useState('idle');
  const [verifyMessage, setVerifyMessage] = useState('');
  const [showBlogModal, setShowBlogModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const [allNgos, setAllNgos] = useState([]);
  const [connections, setConnections] = useState([]);
  const [requests, setRequests] = useState([]);
  const [messageModalNgo, setMessageModalNgo] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    async function setupDoctor() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        window.location.href = '/login';
        return;
      }
      
      const userId = session.user.id;
      
      let { data: doctorData } = await supabase
        .from('doctors')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
        
      if (!doctorData) {
        // Automatically create a base profile if they are a new doctor
        const { data: newDoctor } = await supabase
          .from('doctors')
          .insert({
            id: userId,
            name: session.user.user_metadata?.full_name || 'Doctor',
            email: session.user.email,
            verified: false
          })
          .select()
          .single();
        doctorData = newDoctor;
      }
      
      setDoctor(doctorData);

      // Load Network Data
      let { data: ngosData } = await supabase.from('ngos').select('*');
      let { data: connectionsData } = await supabase.from('ngo_doctors').select('*').eq('doctor_id', userId);
      let { data: requestsData } = await supabase.from('ngo_connection_requests').select('*').eq('doctor_id', userId);
      
      setAllNgos(ngosData || []);
      setConnections(connectionsData || []);
      setRequests(requestsData || []);
    }
    setupDoctor();
  }, []);

  const verifyDoctor = async () => {
    if (!doctor?.id) return;
    setVerifyStatus('loading');
    setVerifyMessage('');
    
    const { error } = await supabase.from('doctors').update({ verified: true }).eq('id', doctor.id);
    if (error) { setVerifyStatus('error'); setVerifyMessage(error.message); return; }
    setVerifyStatus('success'); setVerifyMessage('Verified with NMC successfully!');
    setDoctor({ ...doctor, verified: true });
  };

  const addBlog = (newBlog) => {
    setBlogs((prevBlogs) => [newBlog, ...prevBlogs]);
  };

  const handleConnect = async (ngoId) => {
    if (!doctor?.id) {
      alert('Please wait for your doctor profile to load before connecting.');
      return;
    }

    const { error } = await supabase.from('ngo_connection_requests').insert({
      ngo_id: ngoId,
      doctor_id: doctor.id,
      requester_role: 'doctor',
      status: 'pending'
    });
    if (!error) {
      setRequests([...requests, { ngo_id: ngoId, doctor_id: doctor.id, status: 'pending' }]);
    } else {
      alert(error.message);
    }
  };

  const respondToRequest = async (request, status) => {
    const { error } = await supabase.from('ngo_connection_requests').update({ status }).eq('id', request.id);
    if (error) {
      alert(error.message);
      return;
    }
    if (status === 'accepted') {
      const { data: newConn, error: connErr } = await supabase.from('ngo_doctors').insert({ ngo_id: request.ngo_id, doctor_id: doctor.id }).select().single();
      if (!connErr && newConn) {
        setConnections([...connections, newConn]);
      }
    }
    setRequests(requests.map(r => r.id === request.id ? { ...r, status } : r));
  };

  const openMessageModal = async (ngo) => {
    if (!doctor?.id) return;
    
    setMessageModalNgo(ngo);
    const { data, error } = await supabase.from('direct_messages').select('*').eq('doctor_id', doctor.id).eq('ngo_id', ngo.id).order('created_at', { ascending: true });
    
    if (error) {
      alert("Database error loading messages: " + error.message);
    }
    setMessages(data || []);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if(!newMessage.trim() || !doctor?.id) return;
    
    const msg = { ngo_id: messageModalNgo.id, doctor_id: doctor.id, sender_type: 'doctor', content: newMessage };
    const { data, error } = await supabase.from('direct_messages').insert(msg).select().single();
    if (error) {
      alert("Failed to send message: " + error.message);
    } else if (data) {
      setMessages([...messages, data]);
      setNewMessage('');
    }
  };

  const connectedNgoIds = new Set(connections.map(c => c.ngo_id));
  const acceptedReqNgos = new Set(requests.filter(r => r.status === 'accepted').map(r => r.ngo_id));
  const connectedNgos = allNgos.filter(n => connectedNgoIds.has(n.id) || acceptedReqNgos.has(n.id));
  const incomingRequests = requests.filter(r => r.requester_role === 'ngo' && r.status === 'pending');
  const incomingReqNgos = new Set(incomingRequests.map(r => r.ngo_id));
  const unconnectedNgos = allNgos.filter(n => !connectedNgoIds.has(n.id) && !acceptedReqNgos.has(n.id) && !incomingReqNgos.has(n.id));

  return (
    <div className="flex min-h-screen bg-teal-50">
      <DoctorSidebar />

      <div className="flex-1 p-8 space-y-8">

        <DoctorProfileCard doctor={doctor} openModal={() => setShowProfileModal(true)} />

        {/* NMC Verification */}
        <div className="rounded-3xl border border-teal-100 bg-white p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-teal-700">
              Verification Status
            </p>
            <h3 className="mt-1 text-xl font-extrabold text-teal-950">
              National Medical Commission (NMC)
            </h3>
          </div>
          <div className="flex items-center gap-4">
            {doctor?.verified ? (
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-sm font-bold uppercase tracking-[0.1em] text-emerald-700 shadow-sm">
                ✅ Verified with NMC
              </span>
            ) : (
              <button
                onClick={verifyDoctor}
                disabled={verifyStatus === 'loading' || !doctor}
                className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-6 py-3 text-sm font-bold text-white shadow-md transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {verifyStatus === 'loading' ? 'Verifying...' : 'Verify with NMC'}
              </button>
            )}
            {verifyMessage && (
              <span className={`text-sm font-medium ${verifyStatus === 'success' ? 'text-emerald-600' : 'text-red-500'}`}>
                {verifyMessage}
              </span>
            )}
          </div>
        </div>

        {/* Stats */}
        <section>
          <p className="px-2 text-sm font-bold uppercase tracking-[0.22em] text-teal-700 mb-4">
            Overview Metrics
          </p>
          <div className="grid md:grid-cols-4 gap-6">
            <StatCard title="NGOs Worked With" value="8" />
            <StatCard title="Patients Helped" value="540+" />
            <StatCard title="Blogs Written" value="12" />
            <StatCard title="Consultations" value="64" />
          </div>
        </section>

        {/* Incoming NGO Requests */}
        {incomingRequests.length > 0 && (
          <section className="rounded-3xl border border-teal-100 bg-white p-6 shadow-xl">
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-teal-700">Incoming</p>
            <h3 className="mt-2 text-2xl font-extrabold text-teal-950 mb-6">NGO Connection Requests</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {incomingRequests.map(req => {
                const ngo = allNgos.find(n => n.id === req.ngo_id);
                if (!ngo) return null;
                return (
                  <div key={req.id} className="bg-white rounded-2xl shadow-sm p-5 border border-teal-100 flex flex-col justify-between">
                    <div className="flex items-center gap-4">
                      <img src={ngo.logo_url || "/ngo.png"} alt={ngo.name} className="w-12 h-12 rounded-full object-cover" />
                      <div>
                        <h4 className="font-bold text-teal-950">{ngo.name}</h4>
                        <p className="text-xs text-slate-500">{ngo.location}</p>
                      </div>
                    </div>
                    <div className="mt-5 flex gap-3">
                      <button onClick={() => respondToRequest(req, 'accepted')} className="flex-1 bg-emerald-600 text-white py-2 rounded-xl hover:bg-emerald-700 transition flex items-center justify-center gap-2 text-sm font-bold">
                        <CheckCircle2 size={16} /> Accept
                      </button>
                      <button onClick={() => respondToRequest(req, 'rejected')} className="flex-1 bg-rose-50 text-rose-700 border border-rose-200 py-2 rounded-xl hover:bg-rose-100 transition flex items-center justify-center gap-2 text-sm font-bold">
                        <XCircle size={16} /> Reject
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Connected NGOs */}
        <section className="rounded-3xl border border-teal-100 bg-white p-6 shadow-xl">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-teal-700">
            Network
          </p>
          <h3 className="mt-2 text-2xl font-extrabold text-teal-950 mb-6">
            Connected NGOs
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            {connectedNgos.length === 0 ? <p className="text-slate-500">No connected NGOs yet.</p> : connectedNgos.map(ngo => (
              <DrNgoCard key={ngo.id} ngo={ngo} status="connected" onMessage={openMessageModal} />
            ))}
          </div>
        </section>

        {/* Discover NGOs */}
        <section className="rounded-3xl border border-teal-100 bg-white p-6 shadow-xl">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-teal-700">Discover</p>
          <h3 className="mt-2 text-2xl font-extrabold text-teal-950 mb-6">Find NGOs to Collaborate With</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {unconnectedNgos.map(ngo => {
                const isPending = requests.some(r => r.ngo_id === ngo.id && r.status === 'pending');
                return <DrNgoCard key={ngo.id} ngo={ngo} status={isPending ? 'pending' : 'unconnected'} onConnect={handleConnect} />
            })}
          </div>
        </section>

        {/* Blogs */}
        <section className="rounded-3xl border border-teal-100 bg-white p-6 shadow-xl">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-teal-700">
                Publications
              </p>
              <h3 className="mt-2 text-2xl font-extrabold text-teal-950">
                Your Blogs
              </h3>
            </div>
            <button
              onClick={() => setShowBlogModal(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-6 py-3 text-sm font-bold text-white shadow-md transition hover:bg-teal-700"
            >
              Write Blog
            </button>
          </div>

          {showBlogModal && (
            <DoctorBlogModal
              doctor={doctor}
              addBlog={addBlog}
              close={() => setShowBlogModal(false)}
            />
          )}

          {showProfileModal && (
            <DoctorProfileModal
              doctor={doctor}
              setDoctor={setDoctor}
              closeModal={() => setShowProfileModal(false)}
            />
          )}

          {(!blogs || blogs.length === 0) ? (
            <div className="rounded-2xl border border-dashed border-teal-200 bg-teal-50 p-8 text-center text-sm text-slate-600">
              No blogs posted yet. Share your medical knowledge to help the community!
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {blogs.map((blog) => (
                <BlogCard key={blog.id} blog={blog} />
              ))}
            </div>
          )}
        </section>

        {/* Messages Modal */}
        {messageModalNgo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-teal-950/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl flex flex-col h-[600px] overflow-hidden">
              <div className="p-5 border-b border-teal-100 bg-teal-50 flex items-center justify-between">
                <h3 className="font-extrabold text-teal-950 text-lg flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-teal-600" />
                  Chat with {messageModalNgo.name}
                </h3>
                <button onClick={() => setMessageModalNgo(null)} className="p-2 hover:bg-teal-200 rounded-full text-teal-700 transition">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50">
                {messages.length === 0 ? (
                  <p className="text-center text-slate-400 text-sm mt-10">Start the conversation!</p>
                ) : (
                  messages.map(msg => (
                    <div key={msg.id} className={`flex ${msg.sender_type === 'doctor' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[75%] p-3 rounded-2xl ${msg.sender_type === 'doctor' ? 'bg-teal-600 text-white rounded-tr-sm shadow-md' : 'bg-white border border-teal-100 text-slate-800 rounded-tl-sm shadow-sm'}`}>
                        <p className="text-sm">{msg.content}</p>
                        <p className={`text-[10px] mt-1 ${msg.sender_type === 'doctor' ? 'text-teal-200' : 'text-slate-400'}`}>{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <form onSubmit={sendMessage} className="p-4 border-t border-teal-100 bg-white flex gap-3">
                <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Type a message..." className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 outline-none focus:ring-2 focus:ring-teal-500" />
                <button type="submit" className="bg-teal-600 text-white p-2 px-4 rounded-xl hover:bg-teal-700 transition flex items-center justify-center">
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
