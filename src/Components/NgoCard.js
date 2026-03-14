'use client';
import { useEffect } from "react";
import { MapPin, ShieldCheck, Phone, Mail } from "lucide-react";
import { useRouter } from "next/navigation";


export default function NgoCard({ ngo }) {
    const router = useRouter();
 if (!ngo) return null;

  console.log("ngo data:", ngo);
    
    
  return (
    <div className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition duration-300 overflow-hidden flex flex-col">

      {/* NGO Banner / Image */}

      <div className="h-40 bg-gradient-to-r from-blue-400 to-green-400 flex items-center justify-center">

        <img
        //   src={"/ngo.png"}
                    src={ngo.logo_url || "/ngo.png"}

          className="w-24 h-24 rounded-full border-4 border-white object-cover"
        />

      </div>

      {/* Content */}

      <div className="p-6 flex flex-col flex-1">

        {/* NGO Name */}

        <div className="flex items-center justify-between">

          <h3 className="text-xl font-semibold text-gray-800">
            {ngo.name}
          </h3>

          {ngo.verified && (
            <div className="flex items-center gap-1 text-green-600 text-sm">
              <ShieldCheck size={16} />
            </div>
          )}

        </div>

        {/* Description */}

        <p className="text-gray-600 text-sm mt-3 line-clamp-3">
          {ngo.description}
        </p>

        {/* Location */}

        <div className="flex items-center gap-2 text-gray-500 text-sm mt-3">
          <MapPin size={14} />
          {ngo.location}
        </div>

        {/* Stats */}

        <div className="grid grid-cols-2 gap-4 mt-5">

          <div className="bg-blue-50 rounded-xl p-4 text-center">

            <p className="text-2xl font-bold text-blue-600">
              {ngo.total_drives}
            </p>

            <p className="text-xs text-gray-500">
              Drives
            </p>

          </div>

          <div className="bg-green-50 rounded-xl p-4 text-center">

            <p className="text-2xl font-bold text-green-600">
              {ngo.success_score}
            </p>

            <p className="text-xs text-gray-500">
              Impact Score
            </p>

          </div>

        </div>

        {/* Contact */}

        <div className="mt-5 text-sm text-gray-600 space-y-1">

          <div className="flex items-center gap-2">
            <Mail size={14} />
            {ngo.contact_email}
          </div>

          <div className="flex items-center gap-2">
            <Phone size={14} />
            {ngo.contact_phone}
          </div>

        </div>

        {/* Button */}

       <button
  onClick={() => router.push(`/Doctors/ngos/${ngo.id}`)}
  className="mt-6 bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition"
>
  View NGO
</button>

      </div>

    </div>
  );
}