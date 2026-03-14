'use client';

import VillageDecisionCard from '@/Components/ngo/VillageDecisionCard';

export default function VillageDecisionsPage() {
  return (
    <main className="min-h-screen bg-teal-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="rounded-3xl border border-teal-100 bg-white p-6 shadow-xl sm:p-8">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-teal-700">
            Example Page
          </p>
          <h1 className="mt-2 text-3xl font-extrabold text-teal-950 sm:text-4xl">
            Village Decision Reports
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
            This standalone page renders the reusable village decision component and
            reads model output directly from the `villages` table in Supabase.
          </p>
        </section>

        <VillageDecisionCard />
      </div>
    </main>
  );
}