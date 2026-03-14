'use client';

import { useEffect, useState } from "react";
import { useSearchParams } from 'next/navigation';
import DoctorBlogModal from "@/Components/DoctorBlogModal";
import DoctorProfileCard from "@/Components/DoctorProfileCard";
import DoctorSidebar from "@/Components/DoctorSidebar";
import NgoCard from "@/Components/NgoCard";
import BlogCard from "@/Components/BlogCard";
import StatCard from "@/Components/StatCard";
import DoctorProfileModal from "@/Components/DoctorProfileModal";
import { createOrFetchDoctor,getDoctorBlogs } from "../../../actions/useractions";

export default function Dashboard() {

  const searchParams = useSearchParams();

  const nameParam = searchParams.get('name');
  const emailParam = searchParams.get('email');

  const doctorName = nameParam ? decodeURIComponent(nameParam) : 'Doctor';
  const doctorEmail = emailParam
    ? decodeURIComponent(emailParam)
    : 'No email available';

  const [doctor, setDoctor] = useState(null);
const [showModal, setShowModal] = useState(false);
 const [blogs, setBlogs] = useState([]);
const [showBlogModal, setShowBlogModal] = useState(false);


const [connectedNgos, setConnectedNgos] = useState([]);
const [otherNgos, setOtherNgos] = useState([]);

useEffect(() => {

  async function setupDoctor() {

    
    const doctorData = await createOrFetchDoctor();

    setDoctor(doctorData);

    if (doctorData) {
      const doctorBlogs = await getDoctorBlogs(doctorData.id);
      setBlogs(doctorBlogs);
    }

  }

  setupDoctor();

}, []);

function addBlog(blog) {
  setBlogs((prev) => [blog, ...prev]);
}





  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200">
      <DoctorSidebar />

      <div className="flex-1 p-8">

      

     <DoctorProfileCard
  doctor={doctor}
  openModal={() => setShowModal(true)}
/>

{showModal && (
  <DoctorProfileModal
    doctor={doctor}
    setDoctor={setDoctor}
    closeModal={() => setShowModal(false)}
  />
)}

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mt-6">
          <StatCard title="NGOs Worked With" value="8" />
          <StatCard title="Patients Helped" value="540+" />
          <StatCard title="Blogs Written" value="12" />
          <StatCard title="Consultations" value="64" />
        </div>

        {/* NGO Activity */}
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <NgoCard />
          <NgoCard />
        </div>

        {/* Blogs */}
        <div className="mt-10">

          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-700">
              Your Blogs
            </h2>

           <button
  onClick={() => setShowBlogModal(true)}
  className="bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600"
>
  Write Blog
</button>
          </div>

          {showBlogModal && (
  <DoctorBlogModal
    doctor={doctor}
    addBlog={addBlog}
    close={() => setShowBlogModal(false)}
  />
)}

        <div className="grid md:grid-cols-2 gap-6">

  {blogs.length === 0 && (
    <p className="text-gray-500">No blogs posted yet</p>
  )}

  {blogs.map((blog) => (
    <BlogCard key={blog.id} blog={blog} />
  ))}

</div>
        </div>

      </div>
    </div>
  );
}