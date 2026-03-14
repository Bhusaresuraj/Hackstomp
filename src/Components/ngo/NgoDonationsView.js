'use client';

import { useEffect, useState } from 'react';
import { IndianRupee, Calendar, CreditCard, User } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function NgoDonationsView({ ngoId }) {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDonations = async () => {
      if (!ngoId) return;
      
      setLoading(true);
      const { data, error } = await supabase
        .from('donations')
        .select('*')
        .eq('ngo_id', ngoId)
        .order('created_at', { ascending: false });

      if (error) {
        setError(error.message);
      } else {
        setDonations(data || []);
      }
      setLoading(false);
    };

    fetchDonations();
  }, [ngoId]);

  if (loading) {
    return (
      <div className="rounded-3xl border border-teal-100 bg-white p-8 text-sm text-slate-600 shadow-xl">
        Loading donation history...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-sm text-red-700 shadow-xl">
        Failed to load donations: {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-teal-100 bg-white p-6 shadow-xl">
        <p className="text-sm font-bold uppercase tracking-[0.24em] text-teal-700">
          Financials
        </p>
        <h2 className="mt-2 text-3xl font-extrabold text-teal-950">
          Donations Received
        </h2>
        <p className="mt-3 text-sm text-slate-500">
          A history of all secure transactions made to your NGO.
        </p>
      </div>

      <div className="rounded-3xl border border-teal-100 bg-white shadow-xl overflow-hidden">
        {donations.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-500">
            No donations received yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-teal-50 text-xs font-semibold uppercase tracking-wider text-teal-800">
                <tr>
                  <th className="px-6 py-4">Transaction ID</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Date & Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-teal-100 bg-white">
                {donations.map((donation) => (
                  <tr key={donation.id} className="transition hover:bg-slate-50">
                    <td className="px-6 py-4 font-mono text-xs text-slate-500">{donation.payment_id}</td>
                    <td className="px-6 py-4 font-bold text-teal-700">₹{donation.amount}</td>
                    <td className="px-6 py-4">{new Date(donation.created_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}