'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';
import { Loader2, Mail, ShieldCheck } from 'lucide-react';
import PasswordField from '@/components/PasswordField';

export default function AdminLoginPage() {
  const router = useRouter();
  const { signIn } = useAdminAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);

  const handle = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      await signIn(email, password);
      toast.success('Welcome, Admin!');
      router.push('/dashboard');
    } catch (err: unknown) {
      toast.error((err as Error).message || 'Login failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center">
          <ShieldCheck className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">Admin Sign In</h1>
          <p className="text-sm text-slate-500">Restricted to admin accounts only</p>
        </div>
      </div>

      <form onSubmit={handle} className="space-y-4">
        <div>
          <label className="label">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="input pl-10"
              placeholder="admin@ceylontrails.com"
              autoComplete="email"
            />
          </div>
        </div>

        <PasswordField
          value={password}
          onChange={setPassword}
          autoComplete="current-password"
        />

        <button type="submit" disabled={busy} className="btn-primary w-full mt-2">
          {busy ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ShieldCheck className="h-4 w-4" />
          )}
          {busy ? 'Verifying…' : 'Sign In as Admin'}
        </button>
      </form>

      <p className="mt-6 text-center text-xs text-slate-400">
        Access restricted. Unauthorised login attempts are logged.
      </p>
    </div>
  );
}
