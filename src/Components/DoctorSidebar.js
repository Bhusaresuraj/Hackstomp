import { LayoutDashboard, FileText, Users, LogOut } from "lucide-react";
import Link from "next/link";
export default function DoctorSidebar() {
  return (
    <div className="w-64 bg-white shadow-lg p-6 min-h-screen">

      <h2 className="text-2xl font-bold text-blue-700 mb-8">
        Doctor Panel
      </h2>

      <nav className="space-y-5">

        <div className="flex items-center gap-3 text-gray-700 hover:text-green-700 cursor-pointer">
          <LayoutDashboard size={20} />
          Dashboard
        </div>
<Link href="/Doctors/ngos">
        <div className="flex items-center gap-3 text-gray-700 hover:text-green-700 cursor-pointer">
          <Users size={20} />
          NGOs
        </div>
</Link>
        <div className="flex items-center gap-3 text-gray-700 hover:text-green-700 cursor-pointer">
          <FileText size={20} />
          Blogs
        </div>

        <div className="flex items-center gap-3 text-red-500 mt-10 cursor-pointer">
          <LogOut size={20} />
          Logout
        </div>

      </nav>

    </div>
  );
}