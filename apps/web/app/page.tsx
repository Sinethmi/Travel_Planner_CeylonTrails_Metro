'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Compass } from 'lucide-react';

export default function SplashPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    const t = setTimeout(() => {
      router.replace(user ? '/dashboard' : '/auth/login');
    }, 1400);
    return () => clearTimeout(t);
  }, [user, loading, router]);

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-brand-500 via-brand-600 to-emerald-800 flex items-center justify-center">
      <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_20%_20%,white_0,transparent_30%),radial-gradient(circle_at_80%_70%,white_0,transparent_30%)]" />
      <div className="relative z-10 text-center text-white animate-fade-in">
        <div className="mx-auto h-24 w-24 rounded-3xl bg-white/20 backdrop-blur-xl flex items-center justify-center mb-6 animate-pulse-slow">
          <Compass className="h-12 w-12" />
        </div>
        <h1 className="font-display text-5xl font-bold tracking-tight">CeylonTrails</h1>
        <p className="mt-3 text-white/80 text-lg">AI-powered journeys across Sri Lanka</p>
        <div className="mt-10 flex justify-center">
          <div className="h-1 w-32 bg-white/20 rounded-full overflow-hidden">
            <div className="h-full w-1/2 bg-white animate-[slide_1.2s_ease-in-out_infinite]" />
          </div>
        </div>
      </div>
      <style jsx>{`
        @keyframes slide {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  );
}
