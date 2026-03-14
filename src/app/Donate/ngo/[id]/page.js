'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  BadgeCheck,
  CalendarRange,
  Mail,
  HeartHandshake,
  IndianRupee,
  MapPin,
  Phone,
  ShieldCheck,
  Stethoscope,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

const fallbackNgoImage =
  'https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&w=1200&q=80';

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount || 0);
}

export default function page() {
  const params = useParams();
  const router = useRouter();
  const ngoId = params?.id;

  const [isRazorpayReady, setIsRazorpayReady] = useState(false);
  const [donor, setDonor] = useState(null);
  const [ngo, setNgo] = useState(null);
  const [drives, setDrives] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [amount, setAmount] = useState('');
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
  const [drivesError, setDrivesError] = useState('');
  const [blogsError, setBlogsError] = useState('');

  const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY || 'rzp_live_SQgmlrGay1oEg8';

  useEffect(() => {
    if (typeof window !== 'undefined' && window.Razorpay) {
      setIsRazorpayReady(true);
    }

    let isMounted = true;

    const loadPageData = async () => {
      setLoading(true);
      setErrorMessage('');

      const [{ data: userData }, ngoResponse, drivesResponse, blogsResponse, mediaResponse] =
        await Promise.all([
          supabase.auth.getUser(),
          supabase.from('ngos').select('*').eq('id', ngoId).maybeSingle(),
          supabase
            .from('ngo_drives')
            .select('*')
            .eq('ngo_id', ngoId)
            .order('drive_date', { ascending: false }),
          supabase
            .from('ngo_blogs')
            .select('*')
            .eq('ngo_id', ngoId)
            .order('created_at', { ascending: false }),
          supabase
            .from('blog_images')
            .select('*')
            .eq('ngo_id', ngoId)
            .order('created_at', { ascending: false }),
        ]);

      if (!isMounted) {
        return;
      }

      if (ngoResponse.error || !ngoResponse.data) {
        setErrorMessage(ngoResponse.error?.message || 'NGO profile not found.');
        setLoading(false);
        return;
      }

      setDonor(
        userData?.user
          ? {
              id: userData.user.id,
              name: userData.user.user_metadata?.full_name || 'Donor',
              email: userData.user.email || 'No email available',
            }
          : null
      );
      setNgo(ngoResponse.data);
      setDrives(drivesResponse.error ? [] : drivesResponse.data || []);
      setBlogs(blogsResponse.error ? [] : blogsResponse.data || []);
      setMedia(mediaResponse?.error ? [] : mediaResponse?.data || []);
      setDrivesError(drivesResponse.error?.message || '');
      setBlogsError(blogsResponse.error?.message || '');
      setLoading(false);
    };

    loadPageData();

    return () => {
      isMounted = false;
    };
  }, [ngoId]);

  const handleDonate = () => {
    if (!ngo) {
      return;
    }

    if (isPaymentProcessing) {
      return;
    }

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

    const rawAmount = Number(amount);

    if (!rawAmount || rawAmount <= 0) {
      alert('Please enter a valid donation amount.');
      return;
    }

    setIsPaymentProcessing(true);

    const options = {
      key: razorpayKey,
      amount: Math.round(rawAmount * 100),
      currency: 'INR',
      name: ngo.name,
      description: 'Donation',
      prefill: {
        name: donor.name,
        email: donor.email,
      },
      readonly: {
        name: Boolean(donor.name),
        email: Boolean(donor.email),
      },
      notes: {
        donor_id: donor.id,
        ngo_id: ngo.id,
        ngo_name: ngo.name,
      },
      modal: {
        ondismiss: () => {
          setIsPaymentProcessing(false);
        },
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
          setIsPaymentProcessing(false);
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

        alert(`Donation successful. Payment ID: ${response.razorpay_payment_id}`);
        setAmount('');
        setIsPaymentProcessing(false);
      },
      theme: {
        color: '#0d9488',
      },
    };

    try {
      const razorpay = new window.Razorpay(options);

      razorpay.on('payment.failed', (response) => {
        setIsPaymentProcessing(false);
        alert(
          response.error?.description || 'Payment failed. Please try again.'
        );
      });

      razorpay.open();
    } catch (error) {
      setIsPaymentProcessing(false);
      alert(error.message || 'Unable to open Razorpay checkout.');
    }
  };

  const statCards = useMemo(
    () => [
      { label: 'Total Drives', value: ngo?.total_drives ?? drives.length, icon: ShieldCheck },
      { label: 'Success Score', value: ngo?.success_score ?? 0, icon: HeartHandshake },
      { label: 'Published Blogs', value: blogs.length, icon: Stethoscope },
    ],
    [blogs.length, drives.length, ngo]
  );

  const recentImages = useMemo(() => {
    const images = [];
    
    media.forEach((m) => {
      const url = m.image_url || m.url || m.media_url;
      if (url && !images.find((i) => i.url === url)) {
        images.push({ id: `media-${m.id}`, url, title: m.caption || 'NGO Media' });
      }
    });
    drives.forEach((drive) => {
      if (drive.image_url && !images.find((i) => i.url === drive.image_url)) images.push({ id: `drive-${drive.id}`, url: drive.image_url, title: drive.title });
      else if (drive.media_url && !images.find((i) => i.url === drive.media_url)) images.push({ id: `drive-m-${drive.id}`, url: drive.media_url, title: drive.title });
    });
    blogs.forEach((blog) => {
      if (blog.image_url && !images.find((i) => i.url === blog.image_url)) images.push({ id: `blog-${blog.id}`, url: blog.image_url, title: blog.title });
      else if (blog.media_url && !images.find((i) => i.url === blog.media_url)) images.push({ id: `blog-m-${blog.id}`, url: blog.media_url, title: blog.title });
    });
    if (ngo?.logo_url && !images.find((i) => i.url === ngo.logo_url)) {
      images.push({ id: `ngo-logo-${ngo.id}`, url: ngo.logo_url, title: ngo.name });
    }
    return images.slice(0, 12); // Show up to 12 recent images in the gallery
  }, [drives, blogs, ngo, media]);

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
        onLoad={() => setIsRazorpayReady(true)}
        onError={() => {
          setIsRazorpayReady(false);
          setErrorMessage('Unable to load Razorpay Checkout. Please refresh and try again.');
        }}
      />

      <main className="min-h-screen bg-teal-50 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-8">
          <div className="flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => router.push('/Donate')}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Donor Page
            </button>

            <Link
              href="/Donate"
              className="rounded-2xl bg-teal-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-teal-700"
            >
              All NGOs
            </Link>
          </div>

          {loading ? (
            <div className="rounded-3xl border border-teal-100 bg-white p-8 text-sm text-slate-600 shadow-xl">
              Loading NGO profile...
            </div>
          ) : errorMessage ? (
            <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-sm text-red-700 shadow-xl">
              {errorMessage}
            </div>
          ) : ngo ? (
            <>
              <section className="overflow-hidden rounded-3xl border border-teal-100 bg-white shadow-xl">
                <div className="relative h-72 overflow-hidden bg-gradient-to-br from-teal-900 via-teal-700 to-emerald-500">
                  <img
                    src={ngo.logo_url || fallbackNgoImage}
                    alt={ngo.name}
                    onError={(event) => {
                      event.currentTarget.onerror = null;
                      event.currentTarget.src = fallbackNgoImage;
                    }}
                    className="h-full w-full object-cover opacity-80 mix-blend-overlay"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-teal-950/85 via-teal-900/40 to-transparent" />
                  <div className="absolute left-6 top-6 flex flex-wrap gap-2">
                    <span className="rounded-full bg-white/95 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-teal-800 shadow-sm">
                      {ngo.location}
                    </span>
                    {ngo.verified ? (
                      <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-emerald-700 shadow-sm">
                        <BadgeCheck className="h-3.5 w-3.5" />
                        Verified
                      </span>
                    ) : null}
                  </div>
                  <div className="absolute bottom-6 left-6 right-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-100">
                      NGO Profile
                    </p>
                    <h1 className="mt-2 max-w-3xl text-4xl font-extrabold text-white sm:text-5xl">
                      {ngo.name}
                    </h1>
                    <p className="mt-3 max-w-3xl text-base leading-8 text-teal-50/90">
                      {ngo.description}
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 p-6 md:grid-cols-3">
                  {statCards.map((stat) => {
                    const Icon = stat.icon;
                    return (
                      <article
                        key={stat.label}
                        className="rounded-2xl border border-teal-100 bg-teal-50 p-5"
                      >
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                          {stat.label}
                        </p>
                        <div className="mt-4 flex items-center gap-3">
                          <Icon className="h-5 w-5 text-teal-700" />
                          <p className="text-4xl font-extrabold text-teal-950">{stat.value}</p>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>

              <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
                <section className="space-y-8">
                  <article className="rounded-3xl border border-teal-100 bg-white p-6 shadow-xl">
                    <p className="text-sm font-bold uppercase tracking-[0.22em] text-teal-700">
                      Contact Details
                    </p>
                    <div className="mt-5 grid gap-4 md:grid-cols-2">
                      <div className="rounded-2xl border border-teal-100 bg-teal-50 p-4 text-sm text-slate-700">
                        <div className="flex items-center gap-2 font-semibold text-teal-900">
                          <MapPin className="h-4 w-4 text-teal-700" />
                          Location
                        </div>
                        <p className="mt-2">{ngo.location || 'Not available'}</p>
                      </div>
                      <div className="rounded-2xl border border-teal-100 bg-teal-50 p-4 text-sm text-slate-700">
                        <div className="flex items-center gap-2 font-semibold text-teal-900">
                          <Phone className="h-4 w-4 text-teal-700" />
                          Contact Phone
                        </div>
                        <p className="mt-2">{ngo.contact_phone || 'Not available'}</p>
                      </div>
                      <div className="rounded-2xl border border-teal-100 bg-teal-50 p-4 text-sm text-slate-700">
                        <div className="flex items-center gap-2 font-semibold text-teal-900">
                          <Mail className="h-4 w-4 text-teal-700" />
                          Contact Email
                        </div>
                        <p className="mt-2">{ngo.contact_email || 'Not available'}</p>
                      </div>
                      <div className="rounded-2xl border border-teal-100 bg-teal-50 p-4 text-sm text-slate-700">
                        <div className="flex items-center gap-2 font-semibold text-teal-900">
                          <ShieldCheck className="h-4 w-4 text-teal-700" />
                          Profile Status
                        </div>
                        <p className="mt-2">
                          {ngo.verified ? 'Verified NGO profile' : 'Profile pending verification'}
                        </p>
                      </div>
                    </div>
                  </article>

                  <article className="rounded-3xl border border-teal-100 bg-white p-6 shadow-xl">
                    <p className="text-sm font-bold uppercase tracking-[0.22em] text-teal-700">
                      NGO Drives
                    </p>
                    <div className="mt-5 space-y-4">
              {drivesError ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  Database Error: {drivesError}
                </div>
              ) : drives.length ? (
                        drives.map((drive) => (
                          <div
                            key={drive.id}
                            className="rounded-2xl border border-teal-100 bg-teal-50 p-4"
                          >
                            <div className="flex flex-wrap items-start justify-between gap-3">
                              <div>
                                <h3 className="text-lg font-bold text-teal-950">{drive.title}</h3>
                                {(drive.image_url || drive.media_url) && (
                                  <div className="mt-3 mb-3 h-48 w-full overflow-hidden rounded-xl bg-teal-100">
                                    <img
                                      src={drive.image_url || drive.media_url}
                                      alt={drive.title}
                                      className="h-full w-full object-cover"
                                    />
                                  </div>
                                )}
                                <p className="mt-2 text-sm leading-6 text-slate-600">
                                  {drive.description}
                                </p>
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
                        ))
                      ) : (
                        <div className="rounded-2xl border border-dashed border-teal-200 bg-teal-50 p-4 text-sm text-slate-600">
                          No drives found for this NGO yet.
                        </div>
                      )}
                    </div>
                  </article>

                  <article className="rounded-3xl border border-teal-100 bg-white p-6 shadow-xl">
                    <p className="text-sm font-bold uppercase tracking-[0.22em] text-teal-700">
                      NGO Blogs
                    </p>
                    <div className="mt-5 space-y-4">
              {blogsError ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  Database Error: {blogsError}
                </div>
              ) : blogs.length ? (
                        blogs.map((blog) => (
                          <div
                            key={blog.id}
                            className="rounded-2xl border border-teal-100 bg-teal-50 p-4"
                          >
                            <h3 className="text-lg font-bold text-teal-950">{blog.title}</h3>
                            
                            {/* Render blog image if it exists on the blog record */}
                            {(blog.image_url || blog.media_url) && (
                              <div className="mt-3 h-48 w-full overflow-hidden rounded-xl bg-teal-100">
                                <img
                                  src={blog.image_url || blog.media_url}
                                  alt={blog.title}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                            )}

                            <p className="mt-3 text-sm leading-7 text-slate-600">
                              {blog.content}
                            </p>
                          </div>
                        ))
                      ) : (
                        <div className="rounded-2xl border border-dashed border-teal-200 bg-teal-50 p-4 text-sm text-slate-600">
                          No blog posts published by this NGO yet.
                        </div>
                      )}
                    </div>
                  </article>

                  <article className="rounded-3xl border border-teal-100 bg-white p-6 shadow-xl">
                    <p className="text-sm font-bold uppercase tracking-[0.22em] text-teal-700">
                      Recent Images
                    </p>
                    <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3">
                      {recentImages.length ? (
                        recentImages.map((img) => (
                          <div
                            key={img.id}
                            className="relative h-32 overflow-hidden rounded-xl border border-teal-100 bg-teal-50 shadow-sm"
                          >
                            <img src={img.url} alt={img.title} className="h-full w-full object-cover transition duration-300 hover:scale-105" />
                          </div>
                        ))
                      ) : (
                        <div className="col-span-full rounded-2xl border border-dashed border-teal-200 bg-teal-50 p-4 text-sm text-slate-600">
                          No recent images found for this NGO.
                        </div>
                      )}
                    </div>
                  </article>
                </section>

                <aside className="space-y-8">
                  <article className="rounded-3xl border border-teal-100 bg-white p-6 shadow-xl">
                    <p className="text-sm font-bold uppercase tracking-[0.22em] text-teal-700">
                      Donate To This NGO
                    </p>
                    <h2 className="mt-2 text-2xl font-extrabold text-teal-950">
                      Support {ngo.name}
                    </h2>
                    <div className="mt-6 space-y-3">
                      <label
                        htmlFor="ngo-donation-amount"
                        className="text-sm font-semibold text-teal-900"
                      >
                        Donation amount (INR)
                      </label>
                      <input
                        id="ngo-donation-amount"
                        type="number"
                        min="1"
                        step="1"
                        inputMode="numeric"
                        placeholder="Enter amount"
                        value={amount}
                        onChange={(event) => setAmount(event.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 outline-none transition focus:border-transparent focus:ring-2 focus:ring-teal-500"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handleDonate}
                      disabled={isPaymentProcessing || (typeof window !== 'undefined' && !window.Razorpay && !isRazorpayReady)}
                      className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-teal-600 px-5 py-3 text-sm font-bold text-white shadow-md transition hover:bg-teal-700"
                    >
                      <IndianRupee className="h-4 w-4" />
                      {isPaymentProcessing ? 'Opening Razorpay...' : 'Donate Securely'}
                    </button>

                    <p className="mt-4 text-sm text-slate-500">
                      {donor
                        ? `Signed in as ${donor.email}`
                        : 'Sign in with Google on the donor page before donating.'}
                    </p>
                    <p className="mt-2 text-sm text-slate-500">
                      Your payment opens Razorpay Checkout and the donation is saved against this NGO.
                    </p>
                  </article>
                </aside>
              </div>
            </>
          ) : null}
        </div>
      </main>
    </>
  );
}
