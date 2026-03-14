'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import {
  Bell,
  BookOpenText,
  BrainCircuit,
  Clock3,
  ClipboardList,
  ExternalLink,
  HandHeart,
  ImagePlus,
  LayoutDashboard,
  PlusCircle,
  ShieldAlert,
  ShieldCheck,
  Stethoscope,
  UserPlus,
  Workflow,
  MessageCircle,
  Send,
} from 'lucide-react';
import RoleDashboardLayout from '@/Components/RoleDashboardLayout';
import NGODashboard from '@/Components/ngo/NGODashboard';
import DriveForm from '@/Components/ngo/DriveForm';
import DriveList from '@/Components/ngo/DriveList';
import BlogEditor from '@/Components/ngo/BlogEditor';
import BlogList from '@/Components/ngo/BlogList';
import ImageUploader from '@/Components/ngo/ImageUploader';
import ModelDecisionPreview from '@/Components/ngo/ModelDecisionPreview';
import NgoProfileModal from '@/Components/ngo/NgoProfileModal';
import DoctorConnectionsPanel from '@/Components/ngo/DoctorConnectionsPanel';
import DonorSupportPanel from '@/Components/ngo/DonorSupportPanel';
import NotificationFeed from '@/Components/ngo/NotificationFeed';
import VillageDecisionCard from '@/Components/ngo/VillageDecisionCard';
import NgoWorkersPanel from '@/Components/ngo/NgoWorkersPanel';
import NgoAuditsPanel from '@/Components/ngo/NgoAuditsPanel';
import { supabase } from '@/lib/supabase';

const baseNavItems = [
  { href: '/Ngos', label: 'Overview', icon: LayoutDashboard },
  { href: '/Ngos/dashboard', label: 'Dashboard', icon: Workflow },
  { href: '/Ngos/audits', label: 'Audits', icon: ClipboardList },
  { href: '/Ngos/drives', label: 'Drives', icon: ShieldCheck },
  { href: '/Ngos/messages', label: 'Messages', icon: MessageCircle },
  { href: '/Ngos/workers', label: 'Workers', icon: UserPlus },
  { href: '/Ngos/doctors', label: 'Doctors', icon: Stethoscope },
  { href: '/Ngos/donors', label: 'Donors', icon: HandHeart },
  { href: '/Ngos/notifications', label: 'Notifications', icon: Bell },
  { href: '/Ngos/decisions', label: 'AI Reports', icon: BrainCircuit },
  { href: '/Ngos/media', label: 'Media', icon: ImagePlus },
  { href: '/Ngos/blogs', label: 'Blogs', icon: BookOpenText },
];

const titles = {
  overview: 'NGO Overview',
  dashboard: 'NGO Dashboard',
  audits: 'Village Audits',
  drives: 'NGO Drives',
  messages: 'Direct Messages',
  workers: 'NGO Workers',
  doctors: 'NGO Doctors',
  donors: 'NGO Donors',
  notifications: 'NGO Notifications',
  decisions: 'NGO AI Reports',
  media: 'NGO Media',
  blogs: 'NGO Blogs',
};

const fallbackLogo =
  'https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&w=1200&q=80';

function formatDate(value) {
  if (!value) return 'No date';
  return new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium' }).format(new Date(value));
}

function normalizeEmail(value) {
  return (value || '').trim().toLowerCase();
}

function formatCurrency(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

function isIgnorableRelationshipError(message) {
  if (!message) return false;

  return [
    "Could not find the table 'public.donations' in the schema cache",
    "Could not find the table 'public.ngo_connection_requests' in the schema cache",
    "Could not find the table 'public.ngo_donors' in the schema cache",
    "Could not find the table 'public.ngo_doctors' in the schema cache",
  ].includes(message);
}

function NgoMessagesPanel({ activeNgo, connectedDoctors, doctorDirectory }) {
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const doctorsList = connectedDoctors.map(conn => {
    return doctorDirectory.find(d => d.id === conn.doctor_id) || { id: conn.doctor_id, name: 'Unknown Doctor' };
  });

  useEffect(() => {
    if (!selectedDoctorId || !activeNgo) return;
    const fetchMessages = async () => {
      const { data, error } = await supabase.from('direct_messages').select('*').eq('ngo_id', activeNgo.id).eq('doctor_id', selectedDoctorId).order('created_at', { ascending: true });
      if (error) {
        alert("Database error loading messages: " + error.message);
      }
      setMessages(data || []);
    };
    fetchMessages();
  }, [selectedDoctorId, activeNgo]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedDoctorId) return;
    const msg = { ngo_id: activeNgo.id, doctor_id: selectedDoctorId, sender_type: 'ngo', content: newMessage };
    const { data, error } = await supabase.from('direct_messages').insert(msg).select().single();
    if (error) {
      alert("Failed to send message: " + error.message);
    } else if (data) {
      setMessages([...messages, data]);
      setNewMessage('');
    }
  };

  return (
    <section className="rounded-3xl border border-teal-100 bg-white shadow-xl overflow-hidden flex h-[600px]">
      <div className="w-1/3 bg-teal-50 border-r border-teal-100 overflow-y-auto">
        <div className="p-5 border-b border-teal-100 sticky top-0 bg-teal-50"><h3 className="font-bold text-teal-950">Connected Doctors</h3></div>
        {doctorsList.length === 0 ? (
          <p className="p-5 text-sm text-slate-500">No connected doctors to message.</p>
        ) : (
          <div className="divide-y divide-teal-100">
            {doctorsList.map(doc => (
              <button key={doc.id} onClick={() => setSelectedDoctorId(doc.id)} className={`w-full text-left p-4 hover:bg-teal-100 transition ${selectedDoctorId === doc.id ? 'bg-teal-100 font-bold text-teal-900' : 'text-slate-700'}`}>Dr. {doc.name}</button>
            ))}
          </div>
        )}
      </div>
      
      <div className="flex-1 flex flex-col bg-white">
        {selectedDoctorId ? (
          <>
            <div className="p-5 border-b border-teal-100 shadow-sm z-10 bg-white"><h3 className="font-bold text-teal-950">Chat</h3></div>
            <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-50">
              {messages.length === 0 ? <p className="text-center text-slate-400 text-sm mt-10">No messages yet. Send a hi!</p> : messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.sender_type === 'ngo' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] p-3 rounded-2xl ${msg.sender_type === 'ngo' ? 'bg-teal-600 text-white rounded-tr-sm' : 'bg-white border border-teal-100 text-slate-800 rounded-tl-sm shadow-sm'}`}>
                    <p className="text-sm">{msg.content}</p><p className={`text-[10px] mt-1 ${msg.sender_type === 'ngo' ? 'text-teal-200' : 'text-slate-400'}`}>{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                </div>
              ))}
            </div>
            <form onSubmit={sendMessage} className="p-4 border-t border-teal-100 bg-white flex gap-3">
              <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Type a message..." className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 outline-none focus:ring-2 focus:ring-teal-500" />
              <button type="submit" className="bg-teal-600 text-white p-2 px-4 rounded-xl hover:bg-teal-700 transition flex items-center justify-center"><Send className="w-5 h-5" /></button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-400 flex-col gap-3"><MessageCircle className="w-12 h-12 opacity-20" /><p>Select a doctor to start messaging</p></div>
        )}
      </div>
    </section>
  );
}

function NgoSummaryCard({ ngo }) {
  return (
    <article className="overflow-hidden rounded-3xl border border-teal-100 bg-white shadow-xl">
      <div className="relative h-56 overflow-hidden bg-gradient-to-br from-teal-900 via-teal-700 to-emerald-500">
        <img
          src={ngo.logo_url || fallbackLogo}
          alt={ngo.name}
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src = fallbackLogo;
          }}
          className="h-full w-full object-cover opacity-80 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-teal-950/85 via-teal-900/40 to-transparent" />
        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          <span className="rounded-full bg-white/95 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-teal-800 shadow-sm">
            {ngo.location}
          </span>
          {ngo.verified ? (
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-emerald-700 shadow-sm">
              Verified
            </span>
          ) : null}
        </div>
        <div className="absolute bottom-6 left-6 right-6">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-100">
            NGO Command Center
          </p>
          <h2 className="mt-2 max-w-2xl text-4xl font-extrabold text-white">{ngo.name}</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-teal-50/90">
            {ngo.description || 'Manage operations, coordinate doctors, and track donor impact from one workspace.'}
          </p>
        </div>
      </div>

      <div className="space-y-4 p-6">
        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl border border-teal-100 bg-teal-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Total Drives</p>
            <p className="mt-2 text-3xl font-extrabold text-teal-950">{ngo.total_drives || 0}</p>
          </div>
          <div className="rounded-2xl border border-teal-100 bg-teal-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Success Score</p>
            <p className="mt-2 text-3xl font-extrabold text-teal-950">{ngo.success_score || 0}</p>
          </div>
          <div className="rounded-2xl border border-teal-100 bg-teal-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Contact</p>
            <p className="mt-2 text-sm font-semibold text-teal-950">{ngo.contact_email || 'No email'}</p>
          </div>
        </div>
      </div>
    </article>
  );
}

function NgoRegistrationCard({ user, submitting, onSubmit }) {
  const [formValues, setFormValues] = useState({
    name: '',
    description: '',
    location: '',
    contact_phone: '',
    logo_url: user?.avatar || '',
  });

  const updateField = (field, value) => {
    setFormValues((current) => ({
      ...current,
      [field]: value,
    }));
  };

  return (
    <section className="rounded-3xl border border-teal-100 bg-white p-6 shadow-xl sm:p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-teal-700">
            Register As NGO
          </p>
          <h2 className="mt-2 text-3xl font-extrabold text-teal-950">
            Create your NGO profile to unlock the dashboard
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
            You are signed in as <span className="font-semibold text-teal-950">{user?.email}</span>.
            Complete this form once, and your overview will become live immediately.
          </p>
        </div>
        <div className="rounded-2xl bg-teal-50 p-3 text-teal-700">
          <PlusCircle className="h-5 w-5" />
        </div>
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
            placeholder="Enter NGO name"
            required
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-100"
          />
        </label>

        <label className="space-y-2 md:col-span-2">
          <span className="text-sm font-semibold text-teal-900">Description</span>
          <textarea
            value={formValues.description}
            onChange={(event) => updateField('description', event.target.value)}
            placeholder="Describe your NGO mission and focus areas"
            required
            rows={4}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-100"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-semibold text-teal-900">Location</span>
          <input
            value={formValues.location}
            onChange={(event) => updateField('location', event.target.value)}
            placeholder="City or state"
            required
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-100"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-semibold text-teal-900">Contact Phone</span>
          <input
            value={formValues.contact_phone}
            onChange={(event) => updateField('contact_phone', event.target.value)}
            placeholder="Phone number"
            required
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-100"
          />
        </label>

        <label className="space-y-2 md:col-span-2">
          <span className="text-sm font-semibold text-teal-900">Logo URL</span>
          <input
            value={formValues.logo_url}
            onChange={(event) => updateField('logo_url', event.target.value)}
            placeholder="Optional public logo URL"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-100"
          />
        </label>

        <div className="md:col-span-2 flex items-center justify-between gap-4 rounded-2xl border border-teal-100 bg-teal-50 px-4 py-4">
          <p className="text-sm text-slate-600">
            Your Google email will be used as the NGO contact email automatically.
          </p>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <PlusCircle className="h-4 w-4" />
            {submitting ? 'Creating...' : 'Create NGO Profile'}
          </button>
        </div>
      </form>
    </section>
  );
}

export default function NgoDashboardWorkspace({ activeView = 'overview' }) {
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [ngos, setNgos] = useState([]);
  const [activeNgo, setActiveNgo] = useState(null);
  const [drives, setDrives] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [images, setImages] = useState([]);
  const [connectedDoctors, setConnectedDoctors] = useState([]);
  const [connectedDonors, setConnectedDonors] = useState([]);
  const [doctorDirectory, setDoctorDirectory] = useState([]);
  const [doctorRequests, setDoctorRequests] = useState([]);
  const [donations, setDonations] = useState([]);
  const [workersList, setWorkersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [driveEditorRecord, setDriveEditorRecord] = useState(null);
  const [blogEditorRecord, setBlogEditorRecord] = useState(null);
  const [driveSubmitting, setDriveSubmitting] = useState(false);
  const [blogSubmitting, setBlogSubmitting] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [mediaError, setMediaError] = useState('');
  const [blogError, setBlogError] = useState('');
  const [relationshipError, setRelationshipError] = useState('');
  const [registeringNgo, setRegisteringNgo] = useState(false);
  const [updatingNgo, setUpdatingNgo] = useState(false);
  const [showNgoProfileModal, setShowNgoProfileModal] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const loadUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const currentUser = session?.user || null;
      if (!isMounted) return;
      if (!currentUser) {
        setUser(null);
        setAuthChecked(true);
        return;
      }
      setUser({
        id: currentUser.id,
        name: currentUser.user_metadata?.full_name || 'NGO Lead',
        email: currentUser.email || 'No email available',
        avatar: currentUser.user_metadata?.avatar_url || '',
      });
      setAuthChecked(true);
    };
    loadUser();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) return;
      if (!session?.user) {
        setUser(null);
        setAuthChecked(true);
        return;
      }
      setUser({
        id: session.user.id,
        name: session.user.user_metadata?.full_name || 'NGO Lead',
        email: session.user.email || 'No email available',
        avatar: session.user.user_metadata?.avatar_url || '',
      });
      setAuthChecked(true);
    });
    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    const loadNgos = async () => {
      setLoading(true);
      setErrorMessage('');
      const { data, error } = await supabase.from('ngos').select('*').order('created_at', { ascending: false });
      if (!isMounted) return;
      if (error) {
        setErrorMessage(error.message);
        setNgos([]);
        setLoading(false);
        return;
      }
      setNgos(data || []);
      setLoading(false);
    };
    loadNgos();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!ngos.length) {
      setActiveNgo(null);
      return;
    }
    const matchedNgo = user?.email
      ? ngos.find((ngo) => normalizeEmail(ngo.contact_email) === normalizeEmail(user.email)) || null
      : null;
    setActiveNgo(matchedNgo);
  }, [ngos, user]);

  useEffect(() => {
    if (!activeNgo?.id) return;
    let isMounted = true;
    const loadNgoCmsData = async () => {
      setMediaError('');
      setBlogError('');
      setRelationshipError('');
      const [drivesResponse, blogsResponse, imagesResponse, doctorsResponse, donorsResponse, directoryResponse, requestsResponse, donationsResponse, workersResponse] = await Promise.all([
        supabase.from('ngo_drives').select('*').eq('ngo_id', activeNgo.id).order('created_at', { ascending: false }),
        supabase.from('ngo_blogs').select('*').eq('ngo_id', activeNgo.id).order('created_at', { ascending: false }),
        supabase.from('blog_images').select('*').eq('ngo_id', activeNgo.id).order('created_at', { ascending: false }),
        supabase.from('ngo_doctors').select('*').eq('ngo_id', activeNgo.id).order('created_at', { ascending: false }),
        supabase.from('ngo_donors').select('*').eq('ngo_id', activeNgo.id).order('created_at', { ascending: false }),
        supabase.from('doctors').select('id, name, email, specialization, hospital, verified').order('name', { ascending: true }),
        supabase.from('ngo_connection_requests').select('*').eq('ngo_id', activeNgo.id).order('created_at', { ascending: false }),
        supabase.from('donations').select('id, donor_id, ngo_id, amount, payment_id, created_at').eq('ngo_id', activeNgo.id).order('created_at', { ascending: false }),
        supabase.from('workers').select('*').eq('ngo_id', activeNgo.id).order('created_at', { ascending: false }),
      ]);
      if (!isMounted) return;
      const firstCriticalError = [drivesResponse.error, doctorsResponse.error, donorsResponse.error].find(Boolean);
      if (firstCriticalError) {
        setErrorMessage(firstCriticalError.message);
        return;
      }
      if (blogsResponse.error) setBlogError(blogsResponse.error.message);
      if (imagesResponse.error) setMediaError(imagesResponse.error.message);
      const relationshipIssues = [
        directoryResponse.error?.message,
        requestsResponse.error?.message,
        donationsResponse.error?.message,
      ].filter((message) => message && !isIgnorableRelationshipError(message));
      if (relationshipIssues.length) setRelationshipError(relationshipIssues[0]);
      setDrives(drivesResponse.data || []);
      setBlogs(blogsResponse.error ? [] : blogsResponse.data || []);
      setImages(imagesResponse.error ? [] : imagesResponse.data || []);
      setConnectedDoctors(doctorsResponse.data || []);
      setConnectedDonors(donorsResponse.data || []);
      setDoctorDirectory(directoryResponse.error ? [] : directoryResponse.data || []);
      setDoctorRequests(requestsResponse.error ? [] : requestsResponse.data || []);
      setDonations(donationsResponse.error ? [] : donationsResponse.data || []);
      setWorkersList(workersResponse?.error ? [] : workersResponse?.data || []);
    };
    loadNgoCmsData();
    return () => {
      isMounted = false;
    };
  }, [activeNgo]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setMobileOpen(false);
    window.location.href = '/login';
  };

  const handleGoogleLogin = async () => {
    const redirectUrl = `${window.location.origin}/auth/callback?next=${encodeURIComponent('/Ngos')}`;
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: redirectUrl, queryParams: { access_type: 'offline', prompt: 'consent' } },
    });
  };

  const uploadToNgoMedia = async (file, folder) => {
    const sanitizedName = file.name.replace(/\s+/g, '-');
    const filePath = `${folder}/${activeNgo.id}/${Date.now()}-${sanitizedName}`;
    const { error: uploadError } = await supabase.storage.from('ngo_media').upload(filePath, file, { upsert: false });
    if (uploadError) throw uploadError;
    const { data } = supabase.storage.from('ngo_media').getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handleDriveSubmit = async (payload) => {
    if (!activeNgo?.id) return alert('No NGO is linked to this account. Set your NGO contact_email to your logged-in email first.');
    setDriveSubmitting(true);
    const request = driveEditorRecord
      ? supabase.from('ngo_drives').update({ ...payload, ngo_id: activeNgo.id }).eq('id', driveEditorRecord.id).select().single()
      : supabase.from('ngo_drives').insert({ ...payload, ngo_id: activeNgo.id }).select().single();
    const { data, error } = await request;
    if (error) {
      alert(error.message);
      setDriveSubmitting(false);
      return;
    }
    setDrives((current) => (driveEditorRecord ? current.map((drive) => (drive.id === data.id ? data : drive)) : [data, ...current]));
    setDriveEditorRecord(null);
    setDriveSubmitting(false);
  };

  const handleDriveDelete = async (driveId) => {
    const { error } = await supabase.from('ngo_drives').delete().eq('id', driveId);
    if (error) return alert(error.message);
    setDrives((current) => current.filter((drive) => drive.id !== driveId));
  };

  const handleBlogSubmit = async ({ title, content, cover_image, coverFile }) => {
    if (!activeNgo?.id) return alert('No NGO is linked to this account. Set your NGO contact_email to your logged-in email first.');
    setBlogSubmitting(true);
    let coverImageUrl = cover_image || '';
    try {
      if (coverFile) coverImageUrl = await uploadToNgoMedia(coverFile, 'blog-covers');
    } catch (error) {
      alert(error.message);
      setBlogSubmitting(false);
      return;
    }
    const request = blogEditorRecord
      ? supabase.from('ngo_blogs').update({ ngo_id: activeNgo.id, title, content, cover_image: coverImageUrl }).eq('id', blogEditorRecord.id).select().single()
      : supabase.from('ngo_blogs').insert({ ngo_id: activeNgo.id, title, content, cover_image: coverImageUrl }).select().single();
    const { data, error } = await request;
    if (error) {
      alert(error.message);
      setBlogSubmitting(false);
      return;
    }
    setBlogs((current) => (blogEditorRecord ? current.map((blog) => (blog.id === data.id ? data : blog)) : [data, ...current]));
    setBlogEditorRecord(null);
    setBlogSubmitting(false);
  };

  const handleBlogDelete = async (blogId) => {
    const { error } = await supabase.from('ngo_blogs').delete().eq('id', blogId);
    if (error) return alert(error.message);
    setBlogs((current) => current.filter((blog) => blog.id !== blogId));
  };

  const handleImageUpload = async ({ file, caption }) => {
    if (!activeNgo?.id) return alert('No NGO is linked to this account. Set your NGO contact_email to your logged-in email first.');
    setImageUploading(true);
    try {
      const publicUrl = await uploadToNgoMedia(file, 'gallery');
      const { data, error } = await supabase.from('blog_images').insert({ ngo_id: activeNgo.id, image_url: publicUrl, caption }).select().single();
      if (error) throw error;
      setImages((current) => [data, ...current]);
    } catch (error) {
      alert(error.message);
    } finally {
      setImageUploading(false);
    }
  };

  const filteredDrives = useMemo(() => {
    const query = searchValue.trim().toLowerCase();
    if (!query) return drives;
    return drives.filter((drive) => [drive.title, drive.description, drive.location].filter(Boolean).some((value) => value.toLowerCase().includes(query)));
  }, [drives, searchValue]);

  const filteredBlogs = useMemo(() => {
    const query = searchValue.trim().toLowerCase();
    if (!query) return blogs;
    return blogs.filter((blog) => [blog.title, blog.content].filter(Boolean).some((value) => value.toLowerCase().includes(query)));
  }, [blogs, searchValue]);

  const notifications = useMemo(() => {
    const doctorNotifications = doctorRequests.map((request) => ({
      id: `doctor-${request.id}`,
      type: 'doctor',
      title: request.requester_role === 'doctor' ? 'Doctor requested to connect' : request.status === 'accepted' ? 'Doctor accepted NGO request' : 'Doctor request update',
      message: request.requester_role === 'doctor'
        ? `Doctor ${request.doctor_id} sent a ${request.status} connection request to your NGO.`
        : `Your request for doctor ${request.doctor_id} is currently ${request.status}.`,
      timeLabel: formatDate(request.created_at),
      createdAt: request.created_at || '',
    }));
    const donationNotifications = donations.map((donation) => ({
      id: `donation-${donation.id || donation.payment_id}`,
      type: 'donation',
      title: 'New donor contribution received',
      message: `Donor ${donation.donor_id} contributed INR ${donation.amount || 0}.`,
      timeLabel: formatDate(donation.created_at),
      createdAt: donation.created_at || '',
    }));
    const workerNotifications = workersList.map((w) => ({
      id: `worker-${w.id}`,
      type: 'worker',
      title: 'New Worker Joined',
      message: `${w.full_name} (${w.email}) linked to your NGO.`,
      timeLabel: formatDate(w.created_at),
      createdAt: w.created_at || '',
    }));
    return [...doctorNotifications, ...donationNotifications, ...workerNotifications].sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
  }, [doctorRequests, donations, workersList]);

  const overviewMetrics = useMemo(() => {
    const totalRaised = donations.reduce((sum, donation) => sum + Number(donation.amount || 0), 0);
    const pendingDoctorRequests = doctorRequests.filter((request) => request.status === 'pending').length;
    const latestDrive = drives[0];
    const latestBlog = blogs[0];

    return {
      totalRaised,
      pendingDoctorRequests,
      latestDrive,
      latestBlog,
    };
  }, [donations, doctorRequests, drives, blogs]);

  const navItems = useMemo(
    () => baseNavItems.map((item) => (item.label === 'Notifications' ? { ...item, badge: notifications.length ? String(notifications.length) : '' } : item)),
    [notifications.length]
  );

  const ngoCmsReady = Boolean(activeNgo?.id && user?.email);
  const setupChecklist = [
    !authChecked ? 'Authentication check is still in progress. Wait for the session to load.' : null,
    authChecked && !user?.email ? 'No Supabase session was found for this page. Sign in again with Google and confirm the callback finishes on /Ngos.' : null,
    user?.email && !activeNgo?.id
      ? 'No NGO profile is linked to this Google account yet. Create one from the overview page.'
      : null,
  ].filter(Boolean);

  const handleDoctorRequest = async (doctorId) => {
    if (!activeNgo?.id) return alert('No NGO is linked to this account.');
    if (connectedDoctors.some((doctor) => doctor.doctor_id === doctorId) || doctorRequests.some((request) => request.doctor_id === doctorId && request.status === 'pending')) return;
    const { data, error } = await supabase.from('ngo_connection_requests').insert({ ngo_id: activeNgo.id, doctor_id: doctorId, requester_role: 'ngo', status: 'pending' }).select().single();
    if (error) return alert(error.message);
    setDoctorRequests((current) => [data, ...current]);
  };

  const handleDoctorRequestResponse = async (requestRecord, status) => {
    const { data, error } = await supabase.from('ngo_connection_requests').update({ status }).eq('id', requestRecord.id).select().single();
    if (error) return alert(error.message);
    setDoctorRequests((current) => current.map((request) => (request.id === requestRecord.id ? data : request)));
    if (status === 'accepted' && !connectedDoctors.some((doctor) => doctor.doctor_id === requestRecord.doctor_id)) {
      const { data: relation, error: relationError } = await supabase.from('ngo_doctors').insert({ ngo_id: activeNgo.id, doctor_id: requestRecord.doctor_id }).select().single();
      if (!relationError && relation) setConnectedDoctors((current) => [relation, ...current]);
    }
  };

  const handleNgoRegistration = async (formValues) => {
    if (!user?.email) {
      alert('Sign in with Google first.');
      return;
    }

    setRegisteringNgo(true);

    const { data, error } = await supabase
      .from('ngos')
      .insert({
        name: formValues.name,
        description: formValues.description,
        location: formValues.location,
        contact_email: user.email,
        contact_phone: formValues.contact_phone,
        logo_url: formValues.logo_url || fallbackLogo,
        total_drives: 0,
        success_score: 0,
        verified: false,
      })
      .select()
      .single();

    if (error) {
      alert(error.message);
      setRegisteringNgo(false);
      return;
    }

    setNgos((current) => [data, ...current]);
    setActiveNgo(data);
    setRegisteringNgo(false);
  };

  const handleNgoProfileUpdate = async (formValues) => {
    if (!activeNgo?.id) {
      return;
    }

    setUpdatingNgo(true);

    const { data, error } = await supabase
      .from('ngos')
      .update({
        name: formValues.name,
        description: formValues.description,
        location: formValues.location,
        contact_phone: formValues.contact_phone,
        logo_url: formValues.logo_url || fallbackLogo,
      })
      .eq('id', activeNgo.id)
      .select()
      .single();

    if (error) {
      alert(error.message);
      setUpdatingNgo(false);
      return;
    }

    setNgos((current) => current.map((ngo) => (ngo.id === data.id ? data : ngo)));
    setActiveNgo(data);
    setShowNgoProfileModal(false);
    setUpdatingNgo(false);
  };

  const layoutUser = useMemo(
    () =>
      activeNgo
        ? {
            ...user,
            name: activeNgo.name || user?.name,
            avatar: activeNgo.logo_url || user?.avatar,
          }
        : user,
    [activeNgo, user]
  );

  const commonLayoutProps = {
    user: layoutUser,
    mobileOpen,
    onMobileOpen: () => setMobileOpen(true),
    onMobileClose: () => setMobileOpen(false),
    onLogout: handleLogout,
    onSwitchAccount: handleGoogleLogin,
    searchValue,
    onSearchChange: setSearchValue,
    platformName: 'Seva Swasthya',
    panelTitle: titles[activeView] || 'NGO CMS',
    navItems,
    tipTitle: 'NGO Tip',
    tipText: 'Keep drives, blogs, and media current so doctors and donors always see fresh, actionable activity.',
    searchPlaceholder:
      activeView === 'doctors'
        ? 'Search doctors or hospitals'
        : activeView === 'donors'
        ? 'Search donations or donor activity'
        : activeView === 'notifications'
        ? 'Search alerts or events'
        : activeView === 'blogs'
        ? 'Search blogs or content'
        : activeView === 'media'
        ? 'Search media or captions'
        : 'Search drives, blogs, or media',
  };

  const overviewSection = (
    <div className="space-y-8">
      <section className="rounded-3xl border border-teal-100 bg-white px-6 py-7 shadow-xl sm:px-8">
        {loading ? (
          <div className="rounded-2xl border border-teal-100 bg-teal-50 p-6 text-sm text-slate-600">Loading NGO profile...</div>
        ) : errorMessage ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">{errorMessage}</div>
        ) : activeNgo ? (
          <NgoSummaryCard ngo={activeNgo} />
        ) : (
          <NgoRegistrationCard
            user={user}
            submitting={registeringNgo}
            onSubmit={handleNgoRegistration}
          />
        )}
      </section>

      {activeNgo ? (
        <>
          <section className="grid gap-6 xl:grid-cols-4">
            <article className="rounded-3xl border border-teal-100 bg-white p-6 shadow-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Live Drives</p>
              <p className="mt-3 text-4xl font-extrabold text-teal-950">{drives.length}</p>
              <p className="mt-2 text-sm text-slate-600">Fetched dynamically from `ngo_drives`.</p>
            </article>
            <article className="rounded-3xl border border-teal-100 bg-white p-6 shadow-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Connected Doctors</p>
              <p className="mt-3 text-4xl font-extrabold text-teal-950">{connectedDoctors.length}</p>
              <p className="mt-2 text-sm text-slate-600">Accepted doctor relationships linked to this NGO.</p>
            </article>
            <article className="rounded-3xl border border-teal-100 bg-white p-6 shadow-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Donor Funding</p>
              <p className="mt-3 text-4xl font-extrabold text-teal-950">{formatCurrency(overviewMetrics.totalRaised)}</p>
              <p className="mt-2 text-sm text-slate-600">Total donations saved in Supabase.</p>
            </article>
            <article className="rounded-3xl border border-teal-100 bg-white p-6 shadow-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Pending Requests</p>
              <p className="mt-3 text-4xl font-extrabold text-teal-950">{overviewMetrics.pendingDoctorRequests}</p>
              <p className="mt-2 text-sm text-slate-600">Doctor connection requests awaiting action.</p>
            </article>
          </section>

          <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <article className="rounded-3xl border border-teal-100 bg-white p-6 shadow-xl">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.22em] text-teal-700">Recent Activity</p>
                  <h3 className="mt-2 text-2xl font-extrabold text-teal-950">Dynamic operational snapshot</h3>
                </div>
                <div className="rounded-2xl bg-teal-50 p-3 text-teal-700">
                  <Clock3 className="h-5 w-5" />
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-teal-100 bg-teal-50 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Latest Drive</p>
                  <p className="mt-3 text-xl font-bold text-teal-950">
                    {overviewMetrics.latestDrive?.title || 'No drives yet'}
                  </p>
                  <p className="mt-2 text-sm text-slate-600">
                    {overviewMetrics.latestDrive?.location || 'Create a drive to see live activity here.'}
                  </p>
                </div>
                <div className="rounded-2xl border border-teal-100 bg-teal-50 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Latest Blog</p>
                  <p className="mt-3 text-xl font-bold text-teal-950">
                    {overviewMetrics.latestBlog?.title || 'No blogs yet'}
                  </p>
                  <p className="mt-2 text-sm text-slate-600">
                    {overviewMetrics.latestBlog
                      ? 'Recently published from your NGO content system.'
                      : 'Publish a blog to keep doctors and donors informed.'}
                  </p>
                </div>
              </div>
            </article>

            <article className="rounded-3xl border border-teal-100 bg-white p-6 shadow-xl">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.22em] text-teal-700">Quick Access</p>
                  <h3 className="mt-2 text-2xl font-extrabold text-teal-950">Go straight to live modules</h3>
                </div>
                <div className="rounded-2xl bg-teal-50 p-3 text-teal-700">
                  <ExternalLink className="h-5 w-5" />
                </div>
              </div>

              <div className="mt-6 grid gap-3">
                <Link href="/Ngos/drives" className="rounded-2xl border border-teal-100 bg-teal-50 px-4 py-4 text-sm font-semibold text-teal-900 transition hover:border-teal-300 hover:bg-white">
                  Manage Drives
                </Link>
                <Link href="/Ngos/workers" className="rounded-2xl border border-teal-100 bg-teal-50 px-4 py-4 text-sm font-semibold text-teal-900 transition hover:border-teal-300 hover:bg-white">
                  Manage Field Workers
                </Link>
                <Link href="/Ngos/audits" className="rounded-2xl border border-teal-100 bg-teal-50 px-4 py-4 text-sm font-semibold text-teal-900 transition hover:border-teal-300 hover:bg-white">
                  Review Village Audits
                </Link>
                <Link href="/Ngos/doctors" className="rounded-2xl border border-teal-100 bg-teal-50 px-4 py-4 text-sm font-semibold text-teal-900 transition hover:border-teal-300 hover:bg-white">
                  Review Doctor Requests
                </Link>
                <Link href="/Ngos/donors" className="rounded-2xl border border-teal-100 bg-teal-50 px-4 py-4 text-sm font-semibold text-teal-900 transition hover:border-teal-300 hover:bg-white">
                  Track Donor Funding
                </Link>
                <Link href="/Ngos/notifications" className="rounded-2xl border border-teal-100 bg-teal-50 px-4 py-4 text-sm font-semibold text-teal-900 transition hover:border-teal-300 hover:bg-white">
                  Open Notification Feed
                </Link>
              </div>
            </article>
          </section>
        </>
      ) : null}
    </div>
  );

  let content = null;
  if (activeView === 'overview') content = overviewSection;
  if (activeView === 'dashboard') content = <NGODashboard doctors={connectedDoctors} donors={connectedDonors} drives={drives} blogs={blogs} activeNgo={activeNgo} />;
  if (activeView === 'audits') content = <NgoAuditsPanel activeNgo={activeNgo} />;
  if (activeView === 'messages') content = <NgoMessagesPanel activeNgo={activeNgo} connectedDoctors={connectedDoctors} doctorDirectory={doctorDirectory} />;
  if (activeView === 'drives') content = <section className="space-y-6"><DriveForm key={driveEditorRecord?.id || 'new-drive'} initialValues={driveEditorRecord} onSubmit={handleDriveSubmit} onCancel={() => setDriveEditorRecord(null)} submitting={driveSubmitting} disabled={!ngoCmsReady} /><DriveList drives={filteredDrives} onEdit={setDriveEditorRecord} onDelete={handleDriveDelete} /></section>;
  if (activeView === 'workers') content = <NgoWorkersPanel activeNgo={activeNgo} />;
  if (activeView === 'doctors') content = <DoctorConnectionsPanel doctors={doctorDirectory} requests={doctorRequests} connectedDoctors={connectedDoctors} onSendRequest={handleDoctorRequest} onRespondToRequest={handleDoctorRequestResponse} />;
  if (activeView === 'donors') content = <DonorSupportPanel donations={donations} connectedDonors={connectedDonors} />;
  if (activeView === 'notifications') content = <NotificationFeed notifications={notifications} />;
  if (activeView === 'decisions') content = <section className="space-y-6"><div className="rounded-3xl border border-teal-100 bg-white p-6 shadow-xl"><p className="text-sm font-bold uppercase tracking-[0.22em] text-teal-700">AI Decision Layer</p><h3 className="mt-2 text-2xl font-extrabold text-teal-950">Village intervention recommendations generated by your model</h3><p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">These reports are loaded from the `villages` table and summarize priority score, urgency level, and recommended NGO actions for each village.</p></div><ModelDecisionPreview /><VillageDecisionCard /></section>;
  if (activeView === 'media') content = (
    <section className="space-y-6">
      <div className="rounded-3xl border border-teal-100 bg-white p-6 shadow-xl">
        <p className="text-sm font-bold uppercase tracking-[0.22em] text-teal-700">Media Library</p>
        <h3 className="mt-2 text-2xl font-extrabold text-teal-950">Upload and manage NGO gallery assets</h3>
      </div>
      <ImageUploader onUpload={handleImageUpload} uploading={imageUploading} disabled={!ngoCmsReady} errorMessage={mediaError} images={images.map((image) => ({ ...image, created_at: formatDate(image.created_at) }))} />
    </section>
  );
  if (activeView === 'blogs') content = (
    <section className="space-y-6">
      <div className="rounded-3xl border border-teal-100 bg-white p-6 shadow-xl">
        <p className="text-sm font-bold uppercase tracking-[0.22em] text-teal-700">Blog Studio</p>
        <h3 className="mt-2 text-2xl font-extrabold text-teal-950">Publish updates for doctors, donors, and communities</h3>
        {blogError ? (
          <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            Blogs are unavailable right now: {blogError}
          </div>
        ) : null}
      </div>
      <BlogEditor key={blogEditorRecord?.id || 'new-blog'} initialValues={blogEditorRecord} onSubmit={handleBlogSubmit} onCancel={() => setBlogEditorRecord(null)} submitting={blogSubmitting} disabled={!ngoCmsReady || Boolean(blogError)} />
      <BlogList blogs={filteredBlogs.map((blog) => ({ ...blog, created_at: formatDate(blog.created_at) }))} onEdit={setBlogEditorRecord} onDelete={handleBlogDelete} />
    </section>
  );

  return (
    <RoleDashboardLayout {...commonLayoutProps}>
      {setupChecklist.length ? (
        <section className="mb-8 rounded-3xl border border-amber-200 bg-amber-50 p-6 shadow-xl">
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-amber-700">NGO CMS Status</p>
          <div className="mt-4 space-y-3 text-sm text-amber-900">
            {setupChecklist.map((item) => (
              <div key={item} className="rounded-2xl border border-amber-200 bg-white px-4 py-3">{item}</div>
            ))}
          </div>
        </section>
      ) : null}

      {relationshipError && activeView !== 'overview' ? (
        <section className="mb-8 rounded-3xl border border-amber-200 bg-amber-50 p-6 shadow-xl text-sm text-amber-900">
          Relationship data warning: {relationshipError}
        </section>
      ) : null}

      {relationshipError && activeView === 'overview' ? (
        <section className="mb-8 rounded-3xl border border-amber-200 bg-amber-50 p-6 shadow-xl">
          <div className="flex items-start gap-3 text-amber-900">
            <ShieldAlert className="mt-0.5 h-5 w-5" />
            <div className="text-sm">
              <p className="font-bold uppercase tracking-[0.18em]">Relationship module warning</p>
              <p className="mt-2">{relationshipError}</p>
            </div>
          </div>
        </section>
      ) : null}

      {content}

      {activeView === 'overview' && activeNgo ? (
        <div className="fixed bottom-6 right-6 z-30">
          <button
            type="button"
            onClick={() => setShowNgoProfileModal(true)}
            className="rounded-2xl bg-teal-600 px-5 py-3 text-sm font-bold text-white shadow-xl transition hover:bg-teal-700"
          >
            Edit NGO Profile
          </button>
        </div>
      ) : null}

      {showNgoProfileModal && activeNgo ? (
        <NgoProfileModal
          ngo={activeNgo}
          submitting={updatingNgo}
          onSubmit={handleNgoProfileUpdate}
          onClose={() => setShowNgoProfileModal(false)}
        />
      ) : null}
    </RoleDashboardLayout>
  );
}
