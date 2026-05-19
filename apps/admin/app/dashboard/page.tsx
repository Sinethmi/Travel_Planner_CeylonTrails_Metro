'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/contexts/AuthContext';
import { listAllUsers, updateUserRole } from '@/lib/admin';
import { UserProfile } from '@/lib/types';
import toast from 'react-hot-toast';
import { BookMarked, Loader2, LogOut, MapPin, ShieldCheck, User, Users } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const router = useRouter();
  const { adminProfile, signOut, loading } = useAdminAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [fetching, setFetching] = useState(true);
  const [updatingUid, setUpdatingUid] = useState<string | null>(null);
  const [tripsCount, setTripsCount] = useState<number | null>(null);

  useEffect(() => {
    if (!loading && !adminProfile) router.replace('/auth/login');
  }, [loading, adminProfile, router]);

  useEffect(() => {
    if (!adminProfile) return;
    listAllUsers()
      .then(setUsers)
      .catch(() => toast.error('Failed to load users'))
      .finally(() => setFetching(false));
  }, [adminProfile]);

  useEffect(() => {
    if (!adminProfile) return;

    fetch('/api/trips/count', { cache: 'no-store' })
      .then(async res => {
        if (!res.ok) throw new Error('bad response');
        const json = (await res.json()) as { count: number };
        if (typeof json.count !== 'number') throw new Error('invalid payload');
        setTripsCount(json.count);
      })
      .catch(() => {
        setTripsCount(null);
        toast.error('Failed to load trips count');
      });
  }, [adminProfile]);

  const handleRoleToggle = async (user: UserProfile) => {
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    setUpdatingUid(user.uid);
    try {
      await updateUserRole(user.uid, newRole);
      setUsers(prev => prev.map(u => u.uid === user.uid ? { ...u, role: newRole } : u));
      toast.success(`${user.displayName || user.email} is now ${newRole}`);
    } catch {
      toast.error('Failed to update role');
    } finally {
      setUpdatingUid(null);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/auth/login');
  };

  if (loading || fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
      </div>
    );
  }

  if (!adminProfile) return null;

  const adminCount = users.filter(u => u.role === 'admin').length;
  const userCount = users.filter(u => u.role === 'user').length;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
              <ShieldCheck className="h-4 w-4 text-white" />
            </div>
            <span className="font-display text-lg font-bold text-slate-900">CeylonTrails Admin</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-500">
              {adminProfile.displayName || adminProfile.email}
            </span>
            <button onClick={handleSignOut} className="btn-ghost text-sm px-3 py-2">
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8 sm:grid-cols-3 lg:grid-cols-5">
          <div className="card p-5">
            <div className="flex items-center gap-3 mb-1">
              <Users className="h-5 w-5 text-brand-600" />
              <span className="text-sm font-medium text-slate-500">Total Users</span>
            </div>
            <p className="text-3xl font-bold text-slate-900">{users.length}</p>
          </div>
          <div className="card p-5">
            <div className="flex items-center gap-3 mb-1">
              <BookMarked className="h-5 w-5 text-brand-600" />
              <span className="text-sm font-medium text-slate-500">Total Trips</span>
            </div>
            <p className="text-3xl font-bold text-slate-900">{tripsCount ?? '—'}</p>
          </div>
          <Link href="/destinations" className="card p-5 hover:border-brand-300 transition-colors">
            <div className="flex items-center gap-3 mb-1">
              <MapPin className="h-5 w-5 text-brand-600" />
              <span className="text-sm font-medium text-slate-500">Destinations</span>
            </div>
            <p className="text-3xl font-bold text-slate-900">Manage</p>
          </Link>
          <div className="card p-5">
            <div className="flex items-center gap-3 mb-1">
              <User className="h-5 w-5 text-slate-500" />
              <span className="text-sm font-medium text-slate-500">Regular Users</span>
            </div>
            <p className="text-3xl font-bold text-slate-900">{userCount}</p>
          </div>
          <div className="card p-5">
            <div className="flex items-center gap-3 mb-1">
              <ShieldCheck className="h-5 w-5 text-brand-600" />
              <span className="text-sm font-medium text-slate-500">Admins</span>
            </div>
            <p className="text-3xl font-bold text-slate-900">{adminCount}</p>
          </div>
        </div>

        {/* Users Table */}
        <div className="card overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-900">User Management</h2>
            <p className="text-sm text-slate-500 mt-0.5">Manage roles for all registered users</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-left">
                  <th className="px-6 py-3 font-medium text-slate-500">User</th>
                  <th className="px-6 py-3 font-medium text-slate-500">Email</th>
                  <th className="px-6 py-3 font-medium text-slate-500">Role</th>
                  <th className="px-6 py-3 font-medium text-slate-500">Joined</th>
                  <th className="px-6 py-3 font-medium text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map(u => (
                  <tr key={u.uid} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-semibold text-xs">
                          {(u.displayName || u.email).charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-slate-900">
                          {u.displayName || '—'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{u.email}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                          u.role === 'admin'
                            ? 'bg-brand-50 text-brand-700 border border-brand-200'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}
                      >
                        {u.role === 'admin' ? <ShieldCheck className="h-3 w-3" /> : <User className="h-3 w-3" />}
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-6 py-4">
                      {u.uid === adminProfile.uid ? (
                        <span className="text-xs text-slate-400 italic">You</span>
                      ) : (
                        <button
                          onClick={() => handleRoleToggle(u)}
                          disabled={updatingUid === u.uid}
                          className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors disabled:opacity-50 ${
                            u.role === 'admin'
                              ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
                              : 'bg-brand-50 text-brand-700 hover:bg-brand-100 border border-brand-200'
                          }`}
                        >
                          {updatingUid === u.uid ? (
                            <Loader2 className="h-3 w-3 animate-spin inline" />
                          ) : u.role === 'admin' ? (
                            'Revoke Admin'
                          ) : (
                            'Make Admin'
                          )}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
