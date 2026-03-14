'use client';

export default function WasteCard({ waste }) {

  return (

    <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition">

      <h3 className="text-lg font-semibold text-gray-800">
        {waste.waste_type} Waste
      </h3>

      <p className="text-gray-600 mt-2">
        {waste.description}
      </p>

      <div className="mt-4 text-sm text-gray-500">

        <p>
          Quantity: <span className="font-medium">{waste.quantity} kg</span>
        </p>

        <p>
          NGO: {waste.ngo_drives?.ngos?.name}
        </p>

        <p>
          Drive: {waste.ngo_drives?.title}
        </p>

        <p>
          Location: {waste.ngo_drives?.location}
        </p>

      </div>

      <button className="mt-5 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
        Make Offer
      </button>

    </div>

  );
}