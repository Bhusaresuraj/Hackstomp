'use client';

import { MapPin, ShieldCheck, Phone, MessageCircle, UserPlus, Clock } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DrNgoCard({ ngo, status, onConnect, onMessage }) {
  const router = useRouter();
  if (!ngo) return null;

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition flex flex-col justify-between border border-teal-100">

      {/* NGO Header */}

      <div className="flex items-center gap-4">

        <img
          src={ngo.logo_url || "/ngo.png"}
          className="w-14 h-14 rounded-full object-cover"
        />

        <div>
          <h3 className="text-lg font-semibold text-teal-950">
            {ngo.name}
          </h3>

          {ngo.verified && (
            <div className="flex items-center text-emerald-600 text-xs font-bold uppercase tracking-wider mt-1 gap-1">
              <ShieldCheck size={14} />
              Verified
            </div>
          )}
        </div>

      </div>

      {/* Description */}

      <p className="text-slate-600 text-sm mt-4 line-clamp-3">
        {ngo.description || "No description provided"}
      </p>

      {/* Info */}

      <div className="mt-4 text-sm text-slate-500 space-y-2">

        <div className="flex items-center gap-2">
          <MapPin size={14} className="text-teal-600" />
          {ngo.location || "Location not specified"}
        </div>
        
        <div className="flex items-center justify-between bg-slate-50 p-2 rounded-lg">
          <span>Drives: <span className="font-bold text-teal-800">{ngo.total_drives || 0}</span></span>
          <span>Score: <span className="font-bold text-teal-800">{ngo.success_score || 0}</span></span>
        </div>

      </div>

      {/* Actions */}
      <div className="mt-5 flex gap-2">
        <button
          onClick={() => router.push(`/Doctors/ngos/${ngo.id}`)}
          className="flex-1 bg-white border border-teal-200 text-teal-700 py-2 rounded-xl hover:bg-teal-50 transition text-sm font-bold shadow-sm"
        >
          View Profile
        </button>
        
        {status === 'connected' && (
          <button onClick={() => onMessage(ngo)} className="flex-1 bg-teal-600 text-white py-2 rounded-xl hover:bg-teal-700 transition flex items-center justify-center gap-2 text-sm font-bold shadow-md">
            <MessageCircle size={16} /> Chat
          </button>
        )}
        
        {status === 'pending' && (
          <button disabled className="flex-1 bg-amber-50 text-amber-600 py-2 rounded-xl border border-amber-200 flex items-center justify-center gap-2 text-sm font-bold cursor-not-allowed">
            <Clock size={16} /> Pending
          </button>
        )}
        
        {status === 'unconnected' && (
          <button onClick={() => onConnect(ngo.id)} className="flex-1 bg-teal-600 text-white py-2 rounded-xl hover:bg-teal-700 transition flex items-center justify-center gap-2 text-sm font-bold shadow-md">
            <UserPlus size={16} /> Connect
          </button>
        )}
      </div>

    </div>
  );
}