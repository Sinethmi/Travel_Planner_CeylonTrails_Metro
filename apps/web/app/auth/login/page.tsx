'use client';

import { useState, FormEvent, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';
import { Loader2, Mail } from 'lucide-react';
import PasswordField from '@/components/PasswordField';

export default function LoginPage() {
  const router = useRouter();
  const { user, signIn, signInGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (user) router.replace('/dashboard');
  }, [user, router]);

  const handle = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      await signIn(email, password);
      toast.success('Welcome back!');
      router.push('/dashboard');
    } catch (err: unknown) {
      toast.error((err as Error).message || 'Login failed');
    } finally {
      setBusy(false);
    }
  };

  const handleGoogle = async () => {
    setBusy(true);
    try {
      await signInGoogle();
      toast.success('Welcome!');
      router.push('/dashboard');
    } catch (err: unknown) {
      toast.error((err as Error).message || 'Google sign-in failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <h1 className="font-display text-3xl font-bold">Welcome back</h1>
      <p className="text-slate-600 dark:text-slate-400 mt-1">
        Sign in to continue your journey.
      </p>

      <form onSubmit={handle} className="mt-8 space-y-4">
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
              placeholder="you@example.com"
            />
          </div>
        </div>
        <PasswordField
          value={password}
          onChange={setPassword}
          autoComplete="current-password"
        />
        <button type="submit" disabled={busy} className="btn-primary w-full">
          {busy && <Loader2 className="h-4 w-4 animate-spin" />} Sign In
        </button>
      </form>

      <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-wider text-slate-400">
        <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
        or
        <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
      </div>

      <button onClick={handleGoogle} disabled={busy} className="btn-ghost w-full">
        <svg className="h-4 w-4" viewBox="0 0 48 48">
          <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.4-.4-3.5z"/>
          <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.6 8.3 6.3 14.7z"/>
          <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35 26.8 36 24 36c-5.3 0-9.7-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/>
          <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.2-4.1 5.6l6.2 5.2C41.4 36 44 30.5 44 24c0-1.2-.1-2.4-.4-3.5z"/>
        </svg>
        Continue with Google
      </button>

      <p className="text-center mt-6 text-sm text-slate-600 dark:text-slate-400">
        New here?{' '}
        <Link href="/auth/signup" className="text-brand-600 font-medium hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}
