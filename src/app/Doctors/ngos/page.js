'use client';

import { useEffect, useState } from "react";
import DoctorSidebar from "@/Components/DoctorSidebar";
import NgoCard from "@/Components/NgoCard";
import { getAllNgos } from "../../../../actions/useractions";

export default function page() {

  const [ngos, setNgos] = useState([]);

  useEffect(() => {

  async function loadNgos() {

    console.log("Fetching NGOs...");

    const data = await getAllNgos();

    console.log("NGOs fetched:", data);

    setNgos(data);

  }

  loadNgos();
console.log("list of ngos",ngos)
}, []);

  return (

   <div className="flex min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 relative overflow-hidden">

  {/* Decorative blobs */}

  <div className="absolute top-0 left-0 w-96 h-96 bg-blue-300 opacity-20 rounded-full blur-3xl"></div>
  <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-300 opacity-20 rounded-full blur-3xl"></div>

  <DoctorSidebar />

  <div className="flex-1 p-10">

    <h1 className="text-4xl font-bold text-gray-800 mb-2">
      NGOs Working in Communities
    </h1>

    <p className="text-gray-600 mb-10">
      Discover organizations conducting health and sanitation drives across regions.
    </p>

    {/* NGO grid */}
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

{ngos.map((ngo) => (
  <NgoCard key={ngo.id} ngo={ngo} />
))}

</div>

  </div>
</div>
  );
}