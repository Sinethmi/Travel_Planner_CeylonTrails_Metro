'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import {
  Compass,
  Home,
  Map,
  Sparkles,
  User as UserIcon,
  LogOut,
  Moon,
  Sun,
  BookMarked,
  MapPin,
} from 'lucide-react';
import toast from 'react-hot-toast';

const links = [
  { href: '/dashboard', label: 'Home', icon: Home },
  { href: '/planner', label: 'Plan', icon: Sparkles },
  { href: '/trips', label: 'Trips', icon: BookMarked },
  { href: '/nearby', label: 'Nearby', icon: MapPin },
  { href: '/profile', label: 'Profile', icon: UserIcon },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOutUser } = useAuth();
  const { dark, toggle } = useTheme();

  const handleLogout = async () => {
    await signOutUser();
    toast.success('Signed out');
    router.push('/auth/login');
  };

  if (!user) return null;

  return (
    <>
      {/* Top nav (desktop) */}
      <header className="hidden md:block sticky top-0 z-40 glass">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 font-display font-bold text-xl">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 text-white">
              <Compass className="h-5 w-5" />
            </span>
            <span>CeylonTrails</span>
          </Link>
          <nav className="flex items-center gap-1">
            {links.map(l => {
              const active = pathname === l.href || pathname.startsWith(l.href + '/');
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition ${
                    active
                      ? 'bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-200'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <l.icon className="h-4 w-4" />
                  {l.label}
                </Link>
              );
            })}
          </nav>
          <div className="flex items-center gap-2">
            <button onClick={toggle} className="btn-ghost !p-2" aria-label="Toggle theme">
              {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <button onClick={handleLogout} className="btn-ghost !p-2" aria-label="Sign out">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Bottom nav (mobile) */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 glass border-t border-slate-200/60 dark:border-slate-800/60">
        <div className="grid grid-cols-5">
          {links.map(l => {
            const active = pathname === l.href || pathname.startsWith(l.href + '/');
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`flex flex-col items-center justify-center py-2.5 text-[11px] gap-0.5 ${
                  active ? 'text-brand-600 dark:text-brand-300' : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                <l.icon className="h-5 w-5" />
                {l.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
