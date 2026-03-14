'use client';

import { CheckCircle, Stethoscope, Building2, Award } from "lucide-react";

export default function DoctorProfileCard({ doctor, openModal }) {
 

  if (!doctor) return null;

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col md:flex-row gap-6 items-start md:items-center">

      {/* Profile Image */}

      <div className="flex flex-col items-center">
        <img
          src={doctor.profile_image || "/doctor.jpg"}
          alt="doctor"
          className="w-28 h-28 rounded-full object-cover border-4 border-blue-100"
        />

        {doctor.verified ? (
          <div className="flex items-center gap-1 text-green-600 mt-2 text-sm">
            <CheckCircle size={16} />
            Verified
          </div>
        ) : (
          <div className="text-yellow-600 text-sm mt-2">
            Verification Pending
          </div>
        )}
      </div>

      {/* Doctor Info */}

      <div className="flex-1">

        <h2 className="text-2xl font-bold text-slate-900">
          {doctor.name}
        </h2>

        <p className="text-blue-600 font-medium mt-1">
          {doctor.degree || "Degree not added"}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4 text-sm text-gray-600">

          <div className="flex items-center gap-2">
            <Stethoscope size={16} />
            {doctor.specialization || "Specialization not added"}
          </div>

          <div className="flex items-center gap-2">
            <Award size={16} />
            {doctor.experience_years
              ? `${doctor.experience_years} years experience`
              : "Experience not added"}
          </div>

          <div className="flex items-center gap-2">
            <Building2 size={16} />
            {doctor.hospital || "Hospital not added"}
          </div>

          <div className="flex items-center gap-2">
            Reg No: {doctor.registration_number || "Not provided"}
          </div>

        </div>

        {doctor.bio && (
          <p className="text-gray-600 mt-4 text-sm leading-relaxed">
            {doctor.bio}
          </p>
        )}

      </div>

      {/* Edit Button */}

      <div className="flex items-start">
        <button
          onClick={openModal}
          className="bg-blue-600 text-white px-5 py-2 rounded-xl hover:bg-blue-700 transition"
        >
          Edit Profile
        </button>
      </div>

    </div>
  );
}