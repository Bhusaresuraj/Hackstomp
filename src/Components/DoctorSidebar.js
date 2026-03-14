'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, HeartHandshake, LogOut, BookOpen } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function DoctorSidebar() {
  const pathname = usePathname();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  const navItems = [
    { href: '/Doctors', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/Doctors/ngos', label: 'NGO Collaborations', icon: HeartHandshake },
    { href: '/Blogs', label: 'Health Portal', icon: BookOpen },
  ];

  return (
    <aside className="w-72 flex-shrink-0 border-r border-teal-100 bg-white shadow-sm hidden md:flex flex-col min-h-screen sticky top-0">
      <div className="flex flex-col h-full px-6 py-8">
        <h2 className="text-2xl font-extrabold tracking-tight text-teal-950">
          SevaSwathya <span className="block text-sm font-semibold text-teal-600 uppercase tracking-widest mt-1">Doctor Portal</span>
        </h2>

        <nav className="mt-10 space-y-3 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            // Highlight if exactly matches or if it's a sub-route (like /Doctors/ngos/[id])
            const isActive = pathname === item.href || (pathname?.startsWith(item.href + '/') && item.href !== '/Doctors');
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex w-full items-center gap-3 rounded-2xl px-4 py-4 text-sm font-bold transition-all ${
                  isActive
                    ? 'bg-teal-50 text-teal-700 shadow-sm border border-teal-100'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-teal-600 border border-transparent'
                }`}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto pt-6 border-t border-teal-50">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-2xl px-4 py-4 text-sm font-bold text-red-600 transition-all hover:bg-red-50 hover:text-red-700 border border-transparent"
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </button>
        </div>
      </div>
    </aside>
  );
}