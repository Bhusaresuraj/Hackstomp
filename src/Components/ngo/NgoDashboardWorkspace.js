'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import {
  Bell,
  BookOpenText,
  BrainCircuit,
  Clock3,
  ExternalLink,
  HandHeart,
  ImagePlus,
  LayoutDashboard,
  ShieldAlert,
  ShieldCheck,
  Stethoscope,
  Workflow,
} from 'lucide-react';
import RoleDashboardLayout from '@/Components/RoleDashboardLayout';
import NGODashboard from '@/Components/ngo/NGODashboard';
import DriveForm from '@/Components/ngo/DriveForm';
import DriveList from '@/Components/ngo/DriveList';
import BlogEditor from '@/Components/ngo/BlogEditor';
import BlogList from '@/Components/ngo/BlogList';
import ImageUploader from '@/Components/ngo/ImageUploader';
import ModelDecisionPreview from '@/Components/ngo/ModelDecisionPreview';
import DoctorConnectionsPanel from '@/Components/ngo/DoctorConnectionsPanel';
import DonorSupportPanel from '@/Components/ngo/DonorSupportPanel';
import NotificationFeed from '@/Components/ngo/NotificationFeed';
import VillageDecisionCard from '@/Components/ngo/VillageDecisionCard';
import { supabase } from '@/lib/supabase';

const baseNavItems = [
  { href: '/Ngos', label: 'Overview', icon: LayoutDashboard },
  { href: '/Ngos/dashboard', label: 'Dashboard', icon: Workflow },
  { href: '/Ngos/drives', label: 'Drives', icon: ShieldCheck },
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
  drives: 'NGO Drives',
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
    setActiveNgo(matchedNgo || ngos[0] || null);
  }, [ngos, user]);

  useEffect(() => {
    if (!activeNgo?.id) return;
    let isMounted = true;
    const loadNgoCmsData = async () => {
      setMediaError('');
      setBlogError('');
      setRelationshipError('');
      const [drivesResponse, blogsResponse, imagesResponse, doctorsResponse, donorsResponse, directoryResponse, requestsResponse, donationsResponse] = await Promise.all([
        supabase.from('ngo_drives').select('*').eq('ngo_id', activeNgo.id).order('created_at', { ascending: false }),
        supabase.from('ngo_blogs').select('*').eq('ngo_id', activeNgo.id).order('created_at', { ascending: false }),
        supabase.from('blog_images').select('*').eq('ngo_id', activeNgo.id).order('created_at', { ascending: false }),
        supabase.from('ngo_doctors').select('*').eq('ngo_id', activeNgo.id).order('created_at', { ascending: false }),
        supabase.from('ngo_donors').select('*').eq('ngo_id', activeNgo.id).order('created_at', { ascending: false }),
        supabase.from('doctors').select('id, name, email, specialization, hospital, verified').order('name', { ascending: true }),
        supabase.from('ngo_connection_requests').select('*').eq('ngo_id', activeNgo.id).order('created_at', { ascending: false }),
        supabase.from('donations').select('id, donor_id, ngo_id, amount, payment_id, created_at').eq('ngo_id', activeNgo.id).order('created_at', { ascending: false }),
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
    return [...doctorNotifications, ...donationNotifications].sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
  }, [doctorRequests, donations]);

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
    !activeNgo?.id ? 'No NGO row is available in the `ngos` table.' : null,
    user?.email && activeNgo?.id && normalizeEmail(activeNgo.contact_email) !== normalizeEmail(user.email)
      ? 'This login is not linked to the active NGO. Set `ngos.contact_email` equal to your logged-in email.'
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

  const commonLayoutProps = {
    user,
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
          <div className="rounded-2xl border border-dashed border-teal-200 bg-teal-50 p-6 text-sm text-slate-600">
            No NGO records were returned from Supabase. Logged-in email: <span className="font-semibold text-teal-900">{user?.email || 'No email found'}</span>. Check that the `ngos` table has rows and your read policies allow `select`.
          </div>
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
  if (activeView === 'drives') content = <section className="space-y-6"><DriveForm key={driveEditorRecord?.id || 'new-drive'} initialValues={driveEditorRecord} onSubmit={handleDriveSubmit} onCancel={() => setDriveEditorRecord(null)} submitting={driveSubmitting} disabled={!ngoCmsReady} /><DriveList drives={filteredDrives} onEdit={setDriveEditorRecord} onDelete={handleDriveDelete} /></section>;
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
    </RoleDashboardLayout>
  );
}
