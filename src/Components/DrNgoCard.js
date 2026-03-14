'use client';

import { MapPin, ShieldCheck, Phone } from "lucide-react";

export default function DrNgoCard({ ngo }) {
alert("information",ngo)
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition flex flex-col justify-between">

      {/* NGO Header */}

      <div className="flex items-center gap-4">

        <img
          src={ngo.logo_url || "/ngo.png"}
          className="w-14 h-14 rounded-full object-cover"
        />

        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            {ngo.name}
          </h3>

          {ngo.verified && (
            <div className="flex items-center text-green-600 text-sm gap-1">
              <ShieldCheck size={16} />
              Verified NGO
            </div>
          )}
        </div>

      </div>

      {/* Description */}

      <p className="text-gray-600 text-sm mt-4 line-clamp-3">
        {ngo.description || "No description provided"}
      </p>

      {/* Info */}

      <div className="mt-4 text-sm text-gray-500 space-y-1">

        <div className="flex items-center gap-2">
          <MapPin size={14} />
          {ngo.location || "Location not specified"}
        </div>

        <div>
          Drives Conducted: <span className="font-medium">{ngo.total_drives}</span>
        </div>

        <div>
          Impact Score: <span className="font-medium">{ngo.success_score}</span>
        </div>

      </div>

      {/* Contact */}

      <div className="mt-4 flex items-center justify-between">

        <a
          href={`mailto:${ngo.contact_email}`}
          className="text-blue-600 text-sm hover:underline"
        >
          Contact
        </a>

        <div className="flex items-center text-gray-500 text-sm gap-1">
          <Phone size={14} />
          {ngo.contact_phone}
        </div>

      </div>

    </div>
  );
}