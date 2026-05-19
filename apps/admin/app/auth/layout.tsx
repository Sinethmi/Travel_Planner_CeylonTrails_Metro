import { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="relative hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-brand-600 to-emerald-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white to-transparent" />
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-sm font-bold">CT</div>
          <span className="font-display text-xl font-bold">CeylonTrails</span>
        </div>
        <div className="relative z-10 max-w-md">
          <h2 className="font-display text-4xl font-bold leading-tight">
            Admin Control Panel
          </h2>
          <p className="mt-4 text-white/70">
            Manage users, destinations, and platform settings for CeylonTrails.
          </p>
        </div>
        <div className="relative z-10 text-white/50 text-sm">
          © {new Date().getFullYear()} CeylonTrails — Admin Access Only
        </div>
      </div>
      <div className="flex items-center justify-center p-6 lg:p-12 bg-slate-50">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
