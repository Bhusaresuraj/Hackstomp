'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  BookOpen,
  HeartHandshake,
  Home,
  LayoutDashboard,
  LogOut,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function DoctorSidebar() {
  const pathname = usePathname();
  const [user, setUser] = useState(null);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  useEffect(() => {
    let isMounted = true;

    const loadUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (!isMounted) return;
      if (!data?.user) {
        setUser(null);
        return;
      }

      setUser({
        name: data.user.user_metadata?.full_name || 'Doctor',
        email: data.user.email || 'Sign in to personalize',
        avatar: data.user.user_metadata?.avatar_url || '',
      });
    };

    loadUser();

    const { data: subscription } = supabase.auth.onAuthStateChange(() => {
      loadUser();
    });

    return () => {
      isMounted = false;
      subscription?.subscription?.unsubscribe?.();
    };
  }, []);

  const navItems = [
    { href: '/Doctors', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/Doctors/ngos', label: 'NGO Collaborations', icon: HeartHandshake },
    { href: '/Blogs', label: 'Health Portal', icon: BookOpen },
  ];

  return (
    <aside className="w-72 flex-shrink-0 hidden md:flex min-h-screen sticky top-0">
      <div className="flex h-full w-full flex-col border-r border-teal-800/60 bg-gradient-to-b from-teal-950 via-teal-900 to-emerald-900 px-5 py-6 text-white shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-teal-700 shadow-lg">
            <span className="text-lg font-bold">S</span>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-teal-200">
              Seva Swasthya
            </p>
            <h1 className="text-xl font-bold text-white">Doctor Panel</h1>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-teal-800/50 bg-white/5 p-4">
          <div className="flex items-center gap-3">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="h-14 w-14 rounded-2xl object-cover ring-2 ring-teal-300/30"
              />
            ) : (
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-xl font-bold text-white ring-2 ring-teal-300/20">
                {user?.name?.charAt(0) || 'D'}
              </div>
            )}
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">
                {user?.name || 'Doctor'}
              </p>
              <p className="truncate text-xs text-teal-100/80">
                {user?.email || 'Sign in to personalize'}
              </p>
            </div>
          </div>
        </div>

        <nav className="mt-8 space-y-2 flex-1">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (pathname?.startsWith(item.href + '/') && item.href !== '/Doctors');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                  isActive
                    ? 'bg-white text-teal-900 shadow-lg'
                    : 'text-teal-50 hover:bg-white/10'
                }`}
              >
                <span className="flex items-center gap-3">
                  <Icon className="h-4 w-4" />
                  {item.label}
                </span>
                <span className={isActive ? 'text-teal-700' : 'text-teal-200/80'}>
                  {String(index + 1).padStart(2, '0')}
                </span>
              </Link>
            );
          })}

          <Link
            href="/"
            className="flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold text-teal-50 transition hover:bg-white/10"
          >
            <span className="flex items-center gap-3">
              <Home className="h-4 w-4" />
              Home
            </span>
            <span className="text-teal-200/80">00</span>
          </Link>
        </nav>

        <button
          type="button"
          onClick={handleLogout}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-bold text-white transition hover:bg-white/15"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}
