'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import DoctorSidebar from "@/Components/DoctorSidebar";
import {
  getNgoById,
  getNgoBlogs,
  getNgoDrives,
  getNgoImages,
  checkDoctorNgoConnection,
  connectDoctorToNgo
} from "../../../../../actions/useractions";

export default function Page() {

  const { id } = useParams();

  const [ngo, setNgo] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [drives, setDrives] = useState([]);
  const [images, setImages] = useState([]);
  const [connected, setConnected] = useState(false);

  

  // temporary doctor id
  const doctorId = id; 

  useEffect(() => {

    async function loadData() {

      const ngoData = await getNgoById(id);
      const blogData = await getNgoBlogs(id);
      const driveData = await getNgoDrives(id);
      const imageData = await getNgoImages(id);

      setNgo(ngoData);
      setBlogs(blogData);
      setDrives(driveData);
      setImages(imageData);

      const connection = await checkDoctorNgoConnection(
        doctorId,
        id
      );

      if (connection) setConnected(true);
    }

    loadData();

  }, [id]);

  async function handleConnect() {

    const connection = await connectDoctorToNgo(
      doctorId,
      id
    );

    if (connection) setConnected(true);
  }

  if (!ngo) return <p className="p-10">Loading NGO...</p>;

  return (

    <div className="flex min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200">

      <DoctorSidebar />

      <div className="flex-1 p-10 space-y-12">

        {/* HEADER */}

        <div className="bg-white rounded-3xl shadow-lg p-8">

          <div className="flex items-center gap-6">

            <img
              src={ngo.logo_url || "/ngo.png"}
              className="w-24 h-24 rounded-full object-cover border"
            />

            <div className="flex-1">

              <h1 className="text-3xl font-bold text-gray-800">
                {ngo.name}
              </h1>

              <p className="text-gray-500 mt-1">
                📍 {ngo.location}
              </p>

              <p className="text-gray-600 mt-4 max-w-2xl">
                {ngo.description}
              </p>

            </div>

          </div>

          {/* IMPACT STATS */}

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-8">

            <div className="bg-blue-50 rounded-xl p-4 text-center">

              <p className="text-2xl font-bold text-blue-600">
                {ngo.total_drives}
              </p>

              <p className="text-sm text-gray-500">
                Health Drives
              </p>

            </div>

            <div className="bg-green-50 rounded-xl p-4 text-center">

              <p className="text-2xl font-bold text-green-600">
                {ngo.success_score}
              </p>

              <p className="text-sm text-gray-500">
                Impact Score
              </p>

            </div>

            <div className="bg-purple-50 rounded-xl p-4 text-center">

              <p className="text-sm text-gray-600">
                {ngo.contact_email}
              </p>

              <p className="text-xs text-gray-500">
                Contact Email
              </p>

            </div>

          </div>

          {/* ACTION BUTTONS */}

          <div className="flex gap-4 mt-8">

            {connected ? (

              <button className="bg-green-600 text-white px-6 py-2 rounded-xl">
                Connected
              </button>

            ) : (

              <button
                onClick={handleConnect}
                className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition"
              >
                Connect with NGO
              </button>

            )}

            <button className="bg-gray-800 text-white px-6 py-2 rounded-xl hover:bg-gray-900">
              Message NGO
            </button>

          </div>

        </div>

        {/* DRIVES */}

        <div>

          <h2 className="text-2xl font-semibold mb-6">
            Upcoming Drives
          </h2>

          {drives.length === 0 ? (

            <div className="bg-white rounded-xl p-6 text-gray-500 shadow">
              No upcoming drives announced.
            </div>

          ) : (

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

              {drives.map((drive) => (

                <div
                  key={drive.id}
                  className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
                >

                  <h3 className="font-semibold text-lg">
                    {drive.title}
                  </h3>

                  <p className="text-gray-600 mt-2">
                    {drive.description}
                  </p>

                  <div className="mt-4 text-sm text-gray-500">

                    <p>📍 {drive.location}</p>
                    <p>📅 {drive.drive_date}</p>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

        {/* BLOGS */}

        <div>

          <h2 className="text-2xl font-semibold mb-6">
            NGO Blogs
          </h2>

          {blogs.length === 0 ? (

            <div className="bg-white rounded-xl p-6 text-gray-500 shadow">
              No blogs posted yet.
            </div>

          ) : (

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

              {blogs.map((blog) => (

                <div
                  key={blog.id}
                  className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
                >

                  <h3 className="font-semibold text-lg">
                    {blog.title}
                  </h3>

                  <p className="text-gray-600 mt-2 line-clamp-4">
                    {blog.content}
                  </p>

                </div>

              ))}

            </div>

          )}

        </div>

        {/* GALLERY */}

        <div>

          <h2 className="text-2xl font-semibold mb-6">
            NGO Gallery
          </h2>

          {images.length === 0 ? (

            <div className="bg-white rounded-xl p-6 text-gray-500 shadow">
              No images uploaded yet.
            </div>

          ) : (

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">

              {images.map((img) => (

                <img
                  key={img.id}
                  src={img.image_url}
                  className="rounded-xl object-cover h-48 w-full hover:scale-105 transition"
                />

              ))}

            </div>

          )}

        </div>

      </div>

    </div>

  );
}