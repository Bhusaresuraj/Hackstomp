'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import { motion } from 'framer-motion';
import {
  BadgeCheck,
  CalendarRange,
  HeartHandshake,
  MapPin,
} from 'lucide-react';
import DonorDashboardLayout from '@/Components/DonorDashboardLayout';
import { supabase } from '@/lib/supabase';

const fallbackNgoImage =
  'https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&w=1200&q=80';

function NgoDrivesView({ loading, drives, ngoName }) {
  if (loading) {
    return (
      <div className="rounded-2xl border border-teal-100 bg-teal-50 p-4 text-sm text-slate-600">
        Loading drives for {ngoName}...
      </div>
    );
  }

  if (!drives.length) {
    return (
      <div className="rounded-2xl border border-dashed border-teal-200 bg-teal-50 p-4 text-sm text-slate-600">
        No drives found for this NGO yet.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {drives.map((drive) => (
        <div
          key={drive.id}
          className="rounded-2xl border border-teal-100 bg-teal-50 p-4"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h4 className="text-base font-bold text-teal-950">{drive.title}</h4>
              <p className="mt-2 text-sm leading-6 text-slate-600">{drive.description}</p>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] ${
                drive.success
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-amber-100 text-amber-700'
              }`}
            >
              {drive.success ? 'Successful' : 'Pending'}
            </span>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <div className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm text-slate-700">
              <MapPin className="h-4 w-4 text-teal-700" />
              {drive.location}
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm text-slate-700">
              <CalendarRange className="h-4 w-4 text-teal-700" />
              {drive.drive_date || 'No date'}
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm text-slate-700">
              <HeartHandshake className="h-4 w-4 text-teal-700" />
              {drive.volunteers_count || 0} volunteers
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function NgoCard({
  ngo,
  isSelected,
  drives,
  drivesLoading,
  amount,
  onAmountChange,
  onSelect,
  onViewProfile,
  onDonate,
}) {
  return (
    <motion.article
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className={`overflow-hidden rounded-2xl border bg-white shadow-xl transition-all ${
        isSelected ? 'border-teal-400 ring-4 ring-teal-100' : 'border-teal-100'
      }`}
    >
      <button
        type="button"
        onClick={onSelect}
        className="block w-full text-left"
      >
        <div className="relative h-52 overflow-hidden">
          <img
            src={ngo.logo_url || fallbackNgoImage}
            alt={ngo.name}
            className="h-full w-full object-cover transition duration-500 hover:scale-105"
          />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-teal-950/75 to-transparent" />
          <div className="absolute left-4 top-4 flex flex-wrap gap-2">
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
        </div>
      </button>

      <div className="space-y-5 p-6">
        <div>
          <h3 className="text-xl font-bold text-teal-950">{ngo.name}</h3>
          <p className="mt-3 text-sm leading-7 text-slate-600">{ngo.description}</p>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-xl border border-teal-100 bg-teal-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Success Score
            </p>
            <p className="mt-2 text-3xl font-extrabold text-teal-950">
              {ngo.success_score ?? 0}
            </p>
          </div>
          <div className="rounded-xl border border-teal-100 bg-teal-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Total Drives
            </p>
            <p className="mt-2 text-3xl font-extrabold text-teal-950">
              {ngo.total_drives ?? 0}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <label
            htmlFor={`donation-${ngo.id}`}
            className="text-sm font-semibold text-teal-900"
          >
            Donation amount (INR)
          </label>
          <input
            id={`donation-${ngo.id}`}
            type="number"
            min="1"
            step="1"
            inputMode="numeric"
            placeholder="Enter amount"
            value={amount}
            onChange={(event) => onAmountChange(ngo.id, event.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 outline-none transition focus:border-transparent focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onSelect}
            className="flex-1 rounded-lg border border-teal-200 bg-white px-4 py-3 text-sm font-bold text-teal-700 transition hover:bg-teal-50"
          >
            {isSelected ? 'Refresh Drives' : 'View NGO Drives'}
          </button>
          <button
            type="button"
            onClick={onDonate}
            className="flex-1 rounded-lg bg-teal-600 px-4 py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-teal-700 hover:shadow-lg"
          >
            Donate Securely
          </button>
        </div>

        <Link
          href={`/Donate/ngo/${ngo.id}`}
          onClick={onViewProfile}
          className="flex w-full items-center justify-center rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700 transition hover:border-teal-200 hover:bg-white"
        >
          View NGO Profile
        </Link>

        {isSelected && (
          <NgoDrivesView
            loading={drivesLoading}
            drives={drives}
            ngoName={ngo.name}
          />
        )}
      </div>
    </motion.article>
  );
}

export default function DonatePage() {
  const [isRazorpayReady, setIsRazorpayReady] = useState(false);
  const [donor, setDonor] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [ngos, setNgos] = useState([]);
  const [ngosLoading, setNgosLoading] = useState(true);
  const [ngosError, setNgosError] = useState('');
  const [selectedNgoId, setSelectedNgoId] = useState(null);
  const [ngoDrives, setNgoDrives] = useState([]);
  const [drivesLoading, setDrivesLoading] = useState(false);
  const [amounts, setAmounts] = useState({});

  const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY || 'rzp_live_SQgmlrGay1oEg8';

  useEffect(() => {
    if (typeof window !== 'undefined' && window.Razorpay) {
      setIsRazorpayReady(true);
    }

    let isMounted = true;

    const loadUser = async () => {
      const { data, error } = await supabase.auth.getUser();

      if (!isMounted || error || !data?.user) {
        if (isMounted) {
          setDonor(null);
        }
        return;
      }

      const nextDonor = {
        id: data.user.id,
        name: data.user.user_metadata?.full_name || 'Donor',
        email: data.user.email || 'No email available',
        avatar: data.user.user_metadata?.avatar_url || '',
      };

      setDonor(nextDonor);
    };

    const loadNgos = async () => {
      setNgosLoading(true);
      setNgosError('');

      const { data, error } = await supabase.from('ngos').select('*').order('created_at', {
        ascending: false,
      });

      if (!isMounted) {
        return;
      }

      if (error) {
        setNgosError(error.message);
        setNgos([]);
        setNgosLoading(false);
        return;
      }

      setNgos(data || []);
      setAmounts(
        (data || []).reduce((accumulator, ngo) => {
          accumulator[ngo.id] = '';
          return accumulator;
        }, {})
      );
      setNgosLoading(false);
    };

    loadUser();
    loadNgos();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      loadUser();
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const loadNgoDrives = async (ngoId) => {
    setSelectedNgoId(ngoId);
    setDrivesLoading(true);

    const { data, error } = await supabase
      .from('ngo_drives')
      .select('*')
      .eq('ngo_id', ngoId)
      .order('drive_date', { ascending: false });

    if (error) {
      alert(error.message);
      setNgoDrives([]);
      setDrivesLoading(false);
      return;
    }

    setNgoDrives(data || []);
    setDrivesLoading(false);
  };

  const handleAmountChange = (ngoId, value) => {
    setAmounts((currentAmounts) => ({
      ...currentAmounts,
      [ngoId]: value,
    }));
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setDonor(null);
    setMobileSidebarOpen(false);
    window.location.href = '/login';
  };

  const handleGoogleLogin = async () => {
    const redirectUrl = `${window.location.origin}/auth/callback?next=${encodeURIComponent('/Donate')}`;

    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });
  };

  const handleDonate = (ngo) => {
    if (!donor?.id) {
      alert('Please sign in with Google before donating.');
      return;
    }

    if (typeof window === 'undefined' || !window.Razorpay) {
      alert('Razorpay is still loading. Please try again in a moment.');
      return;
    }

    if (!razorpayKey) {
      alert('Missing Razorpay key. Set NEXT_PUBLIC_RAZORPAY_KEY in your environment.');
      return;
    }

    const rawAmount = Number(amounts[ngo.id]);

    if (!rawAmount || rawAmount <= 0) {
      alert('Please enter a valid donation amount.');
      return;
    }

    const amountInPaise = Math.round(rawAmount * 100);

    const options = {
      key: razorpayKey,
      amount: amountInPaise,
      currency: 'INR',
      name: ngo.name,
      description: 'Donation',
      prefill: {
        name: donor.name,
        email: donor.email,
      },
      handler: async (response) => {
        const donationPayload = {
          donor_id: donor.id,
          ngo_id: ngo.id,
          amount: rawAmount,
          payment_id: response.razorpay_payment_id,
        };

        const { error } = await supabase.from('donations').insert(donationPayload);

        if (error) {
          alert(`Payment captured but donation save failed: ${error.message}`);
          return;
        }

        // Record the Razorpay transaction specifically
        const { error: txError } = await supabase.from('razorpay_transactions').insert({
          payment_id: response.razorpay_payment_id,
          donor_id: donor.id,
          ngo_id: ngo.id,
          amount: rawAmount,
          status: 'success'
        });
        
        if (txError) {
          console.error('Failed to log Razorpay transaction:', txError);
        }

        const { data: existingRelationship } = await supabase
          .from('ngo_donors')
          .select('id')
          .eq('ngo_id', ngo.id)
          .eq('donor_id', donor.id)
          .maybeSingle();

        if (!existingRelationship) {
          await supabase.from('ngo_donors').insert({
            ngo_id: ngo.id,
            donor_id: donor.id,
          });
        }

        setAmounts((currentAmounts) => ({
          ...currentAmounts,
          [ngo.id]: '',
        }));
        alert(`Donation successful. Payment ID: ${response.razorpay_payment_id}`);
      },
      theme: {
        color: '#0d9488',
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  const filteredNgos = useMemo(() => {
    const query = searchValue.trim().toLowerCase();

    if (!query) {
      return ngos;
    }

    return ngos.filter((ngo) =>
      [
        ngo.name,
        ngo.description,
        ngo.location,
        ngo.contact_email,
        ngo.contact_phone,
      ]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(query))
    );
  }, [ngos, searchValue]);

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
        onLoad={() => setIsRazorpayReady(true)}
      />

      <DonorDashboardLayout
        donor={donor}
        mobileOpen={mobileSidebarOpen}
        onMobileOpen={() => setMobileSidebarOpen(true)}
        onMobileClose={() => setMobileSidebarOpen(false)}
        onLogout={handleLogout}
        onSwitchAccount={handleGoogleLogin}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
      >
        <section id="campaigns" className="space-y-5">
          <div className="rounded-3xl border border-teal-100 bg-white p-6 shadow-xl">
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-teal-700">
              NGO Camps
            </p>
            <h2 className="mt-2 text-3xl font-extrabold text-teal-950">
              Browse live NGO camps and support them directly
            </h2>
            <p className="mt-3 text-sm text-slate-500">
              {filteredNgos.length} NGO{filteredNgos.length === 1 ? '' : 's'} match your current search.
            </p>
          </div>

          {ngosLoading ? (
            <div className="rounded-3xl border border-teal-100 bg-white p-8 text-sm text-slate-600 shadow-xl">
              Loading NGOs from Supabase...
            </div>
          ) : ngosError ? (
            <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-sm text-red-700 shadow-xl">
              Failed to load NGOs: {ngosError}
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 2xl:grid-cols-3">
              {filteredNgos.map((ngo) => (
                <NgoCard
                  key={ngo.id}
                  ngo={ngo}
                  isSelected={selectedNgoId === ngo.id}
                  drives={selectedNgoId === ngo.id ? ngoDrives : []}
                  drivesLoading={selectedNgoId === ngo.id && drivesLoading}
                  amount={amounts[ngo.id] || ''}
                  onAmountChange={handleAmountChange}
                  onSelect={() => loadNgoDrives(ngo.id)}
                  onViewProfile={() => loadNgoDrives(ngo.id)}
                  onDonate={() => handleDonate(ngo)}
                />
              ))}
            </div>
          )}
        </section>
      </DonorDashboardLayout>
    </>
  );
}
