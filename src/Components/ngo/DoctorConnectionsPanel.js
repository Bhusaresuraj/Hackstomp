'use client';

import { CheckCircle2, Send, Stethoscope, XCircle } from 'lucide-react';

function formatDoctorMeta(doctor) {
  return [doctor.specialization, doctor.hospital].filter(Boolean).join(' • ');
}

export default function DoctorConnectionsPanel({
  doctors = [],
  requests = [],
  connectedDoctors = [],
  onSendRequest,
  onRespondToRequest,
}) {
  const connectedDoctorIds = new Set(connectedDoctors.map((doctor) => doctor.doctor_id));

  return (
    <section id="doctors" className="space-y-6">
      <div className="rounded-3xl border border-teal-100 bg-white p-6 shadow-xl">
        <p className="text-sm font-bold uppercase tracking-[0.22em] text-teal-700">
          Doctors
        </p>
        <h3 className="mt-2 text-2xl font-extrabold text-teal-950">
          Build your medical network
        </h3>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          Send collaboration requests to doctors and accept incoming doctor requests
          from this panel.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr,0.85fr]">
        <div className="rounded-3xl border border-teal-100 bg-white p-6 shadow-xl">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-teal-700">
            Doctor Directory
          </p>
          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            {doctors.length ? (
              doctors.map((doctor) => {
                const existingRequest = requests.find(
                  (request) => request.doctor_id === doctor.id && request.status === 'pending'
                );
                const isConnected = connectedDoctorIds.has(doctor.id);

                return (
                  <article
                    key={doctor.id}
                    className="rounded-2xl border border-teal-100 bg-teal-50 p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h4 className="text-lg font-bold text-teal-950">
                          {doctor.name || 'Doctor'}
                        </h4>
                        <p className="mt-1 text-sm text-slate-600">
                          {doctor.email || 'No email available'}
                        </p>
                      </div>
                      <div className="rounded-2xl bg-white p-3 text-teal-700">
                        <Stethoscope className="h-5 w-5" />
                      </div>
                    </div>

                    <p className="mt-4 text-sm text-slate-600">
                      {formatDoctorMeta(doctor) || 'Profile details will appear once the doctor completes onboarding.'}
                    </p>

                    <div className="mt-5 flex items-center justify-between gap-3">
                      {doctor.verified ? (
                        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">
                          Verified
                        </span>
                      ) : (
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-slate-600">
                          Unverified
                        </span>
                      )}

                      <button
                        type="button"
                        disabled={isConnected || Boolean(existingRequest)}
                        onClick={() => onSendRequest(doctor.id)}
                        className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <Send className="h-4 w-4" />
                        {isConnected
                          ? 'Connected'
                          : existingRequest
                          ? 'Request Pending'
                          : 'Send Request'}
                      </button>
                    </div>
                  </article>
                );
              })
            ) : (
              <div className="rounded-2xl border border-dashed border-teal-200 bg-teal-50 p-5 text-sm text-slate-600">
                No doctors found in the directory yet.
              </div>
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-teal-100 bg-white p-6 shadow-xl">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-teal-700">
            Incoming Requests
          </p>
          <div className="mt-5 space-y-4">
            {requests.filter((request) => request.requester_role === 'doctor').length ? (
              requests
                .filter((request) => request.requester_role === 'doctor')
                .map((request) => (
                  <article
                    key={request.id}
                    className="rounded-2xl border border-teal-100 bg-teal-50 p-4"
                  >
                    <p className="text-sm font-bold text-teal-950">
                      Doctor ID: {request.doctor_id}
                    </p>
                    <p className="mt-2 text-sm text-slate-600">
                      Status: {request.status}
                    </p>

                    {request.status === 'pending' ? (
                      <div className="mt-4 flex gap-3">
                        <button
                          type="button"
                          onClick={() => onRespondToRequest(request, 'accepted')}
                          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-emerald-700"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                          Accept
                        </button>
                        <button
                          type="button"
                          onClick={() => onRespondToRequest(request, 'rejected')}
                          className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-rose-700"
                        >
                          <XCircle className="h-4 w-4" />
                          Reject
                        </button>
                      </div>
                    ) : null}
                  </article>
                ))
            ) : (
              <div className="rounded-2xl border border-dashed border-teal-200 bg-teal-50 p-5 text-sm text-slate-600">
                No incoming doctor requests.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
