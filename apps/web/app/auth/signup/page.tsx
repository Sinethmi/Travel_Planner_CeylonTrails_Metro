'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';
import { Loader2, Mail, User } from 'lucide-react';
import PasswordField, { isPasswordStrong } from '@/components/PasswordField';

export default function SignupPage() {
  const router = useRouter();
  const { signUp, signInGoogle } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);

  const handle = async (e: FormEvent) => {
    e.preventDefault();
    if (!isPasswordStrong(password)) {
      toast.error('Password must be 8+ chars with uppercase, lowercase and a number');
      return;
    }
    setBusy(true);
    try {
      await signUp(email, password, name);
      toast.success('Account created!');
      router.push('/dashboard');
    } catch (err: unknown) {
      toast.error((err as Error).message || 'Sign up failed');
    } finally {
      setBusy(false);
    }
  };

  const handleGoogle = async () => {
    setBusy(true);
    try {
      await signInGoogle();
      router.push('/dashboard');
    } catch (err: unknown) {
      toast.error((err as Error).message || 'Google sign-in failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <h1 className="font-display text-3xl font-bold">Create your account</h1>
      <p className="text-slate-600 dark:text-slate-400 mt-1">
        Start planning your Sri Lankan adventure.
      </p>

      <form onSubmit={handle} className="mt-8 space-y-4">
        <div>
          <label className="label">Full name</label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input
              required
              value={name}
              onChange={e => setName(e.target.value)}
              className="input pl-10"
              placeholder="Jane Doe"
            />
          </div>
        </div>
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
          showStrength
          minLength={8}
          autoComplete="new-password"
          placeholder="Min 8 chars, A-Z, a-z, 0-9"
        />
        <button type="submit" disabled={busy} className="btn-primary w-full">
          {busy && <Loader2 className="h-4 w-4 animate-spin" />} Create Account
        </button>
      </form>

      <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-wider text-slate-400">
        <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
        or
        <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
      </div>

      <button onClick={handleGoogle} disabled={busy} className="btn-ghost w-full">
        Continue with Google
      </button>

      <p className="text-center mt-6 text-sm text-slate-600 dark:text-slate-400">
        Already have an account?{' '}
        <Link href="/auth/login" className="text-brand-600 font-medium hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
