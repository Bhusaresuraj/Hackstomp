'use client';

import { useEffect, useState } from "react";

import WasteCard from "@/Components/WasteCard";
import DoctorSidebar from "@/Components/DoctorSidebar";

import { getWasteReports } from "../../../actions/useractions";

export default function WasteMarketplace() {

  const [wasteReports, setWasteReports] = useState([]);

  useEffect(() => {

    async function loadWaste() {
        alert("hey")
      const data = await getWasteReports();
      setWasteReports(data);
      console.log("waste infor",data);
      

    }

    loadWaste();

  }, []);

  return (

    <div className="flex min-h-screen bg-gradient-to-br from-green-100 via-white to-green-200">

      {/* <DoctorSidebar /> */}

      <div className="flex-1 p-10">

        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Waste Marketplace
        </h1>

        <p className="text-gray-600 mb-10">
          NGOs report waste generated during drives. Buyers can purchase recyclable materials.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

          {wasteReports.map((waste) => (

            <WasteCard
              key={waste.id}
              waste={waste}
            />

          ))}

        </div>

      </div>

    </div>

  );
}