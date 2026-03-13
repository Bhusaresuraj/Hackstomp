'use client';

import { HandHeart, IndianRupee, Wallet } from 'lucide-react';

function formatCurrency(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

export default function DonorSupportPanel({ donations = [], connectedDonors = [] }) {
  const totalRaised = donations.reduce((sum, donation) => sum + Number(donation.amount || 0), 0);

  return (
    <section id="donors" className="space-y-6">
      <div className="rounded-3xl border border-teal-100 bg-white p-6 shadow-xl">
        <p className="text-sm font-bold uppercase tracking-[0.22em] text-teal-700">
          Donors
        </p>
        <h3 className="mt-2 text-2xl font-extrabold text-teal-950">
          Track donor support and funding activity
        </h3>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-3xl border border-teal-100 bg-white p-6 shadow-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Total Raised
          </p>
          <div className="mt-4 flex items-center gap-3">
            <IndianRupee className="h-5 w-5 text-teal-700" />
            <p className="text-4xl font-extrabold text-teal-950">{formatCurrency(totalRaised)}</p>
          </div>
        </div>
        <div className="rounded-3xl border border-teal-100 bg-white p-6 shadow-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Connected Donors
          </p>
          <div className="mt-4 flex items-center gap-3">
            <HandHeart className="h-5 w-5 text-teal-700" />
            <p className="text-4xl font-extrabold text-teal-950">{connectedDonors.length}</p>
          </div>
        </div>
        <div className="rounded-3xl border border-teal-100 bg-white p-6 shadow-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Donation Events
          </p>
          <div className="mt-4 flex items-center gap-3">
            <Wallet className="h-5 w-5 text-teal-700" />
            <p className="text-4xl font-extrabold text-teal-950">{donations.length}</p>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-teal-100 bg-white p-6 shadow-xl">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-teal-700">
          Recent Donations
        </p>
        <div className="mt-5 space-y-4">
          {donations.length ? (
            donations.map((donation) => (
              <article
                key={donation.payment_id || donation.id}
                className="rounded-2xl border border-teal-100 bg-teal-50 p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold text-teal-950">
                      Donor ID: {donation.donor_id}
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      Payment ID: {donation.payment_id || 'Not available'}
                    </p>
                  </div>
                  <span className="rounded-full bg-white px-3 py-1 text-sm font-bold text-teal-800">
                    {formatCurrency(donation.amount)}
                  </span>
                </div>
              </article>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-teal-200 bg-teal-50 p-5 text-sm text-slate-600">
              No donations recorded for this NGO yet.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
