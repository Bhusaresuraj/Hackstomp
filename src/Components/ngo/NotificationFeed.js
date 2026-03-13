'use client';

import { BellRing } from 'lucide-react';

export default function NotificationFeed({ notifications = [] }) {
  return (
    <section id="notifications" className="space-y-6">
      <div className="rounded-3xl border border-teal-100 bg-white p-6 shadow-xl">
        <p className="text-sm font-bold uppercase tracking-[0.22em] text-teal-700">
          Notifications
        </p>
        <h3 className="mt-2 text-2xl font-extrabold text-teal-950">
          Real-time NGO activity feed
        </h3>
      </div>

      <div className="rounded-3xl border border-teal-100 bg-white p-6 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-teal-50 p-3 text-teal-700">
            <BellRing className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-teal-700">
              Activity Stream
            </p>
            <p className="text-sm text-slate-600">
              Doctor connection events and donor contributions appear here.
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {notifications.length ? (
            notifications.map((notification) => (
              <article
                key={notification.id}
                className="rounded-2xl border border-teal-100 bg-teal-50 p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-bold text-teal-950">{notification.title}</p>
                    <p className="mt-2 text-sm text-slate-600">{notification.message}</p>
                  </div>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-teal-800">
                    {notification.type}
                  </span>
                </div>
                <p className="mt-3 text-xs text-slate-500">{notification.timeLabel}</p>
              </article>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-teal-200 bg-teal-50 p-5 text-sm text-slate-600">
              No notifications yet.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
