import { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="relative hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-brand-600 to-emerald-800 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-30 [background-image:url('https://picsum.photos/seed/ceylontrails-auth/1600/1200')] bg-cover bg-center mix-blend-overlay" />
        <div className="relative z-10">
          <div className="font-display text-2xl font-bold">CeylonTrails</div>
        </div>
        <div className="relative z-10 max-w-md">
          <h2 className="font-display text-4xl font-bold leading-tight">
            Plan your perfect Sri Lankan adventure with AI.
          </h2>
          <p className="mt-4 text-white/80">
            From the misty hills of Ella to the surf of Arugam Bay — get personalised, day-by-day
            itineraries crafted just for you.
          </p>
        </div>
        <div className="relative z-10 text-white/60 text-sm">
          © {new Date().getFullYear()} CeylonTrails
        </div>
      </div>
      <div className="flex items-center justify-center p-6 lg:p-12 bg-slate-50 dark:bg-slate-950">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
