'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';
import { Destination } from '@/lib/types';
import {
  Loader2,
  Plus,
  Pencil,
  Trash2,
  X,
  MapPin,
  Star,
  Database,
  ArrowLeft,
} from 'lucide-react';
import {
  collection,
  getDocs,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Link from 'next/link';

const COLL = 'destinations';
const VIBE_OPTIONS = ['Adventure', 'Nature', 'History', 'Beach', 'Cultural', 'Wildlife', 'Relaxation', 'Food'];

const EMPTY: Omit<Destination, 'id'> & { id: string } = {
  id: '',
  name: '',
  region: '',
  description: '',
  lat: 0,
  lng: 0,
  image: '',
  rating: 4.5,
  vibe: [],
};

export default function DestinationsPage() {
  const router = useRouter();
  const { adminProfile, loading } = useAdminAuth();
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [fetching, setFetching] = useState(true);
  const [form, setForm] = useState<typeof EMPTY | null>(null);
  const [isEdit, setIsEdit] = useState(false);
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !adminProfile) router.replace('/auth/login');
  }, [loading, adminProfile, router]);

  useEffect(() => {
    if (!adminProfile) return;
    loadDestinations();
  }, [adminProfile]);

  async function loadDestinations() {
    setFetching(true);
    try {
      const snap = await getDocs(collection(db, COLL));
      const list = snap.docs.map(d => ({ ...(d.data() as Omit<Destination, 'id'>), id: d.id }));
      list.sort((a, b) => a.name.localeCompare(b.name));
      setDestinations(list);
    } catch {
      toast.error('Failed to load destinations');
    } finally {
      setFetching(false);
    }
  }

  function openAdd() {
    setForm({ ...EMPTY });
    setIsEdit(false);
  }

  function openEdit(d: Destination) {
    setForm({ ...d });
    setIsEdit(true);
  }

  function closeForm() {
    setForm(null);
  }

  async function handleSave() {
    if (!form) return;
    if (!form.id.trim()) { toast.error('ID (slug) is required'); return; }
    if (!form.name.trim()) { toast.error('Name is required'); return; }
    if (!form.region.trim()) { toast.error('Region is required'); return; }
    if (form.vibe.length === 0) { toast.error('At least one vibe is required'); return; }

    setSaving(true);
    try {
      const { id, ...rest } = form;
      if (isEdit) {
        await updateDoc(doc(db, COLL, id), rest as Partial<Omit<Destination, 'id'>>);
        setDestinations(prev => prev.map(d => d.id === id ? { ...d, ...rest } : d));
        toast.success('Destination updated');
      } else {
        await setDoc(doc(db, COLL, id), rest);
        setDestinations(prev => [...prev, { id, ...rest }].sort((a, b) => a.name.localeCompare(b.name)));
        toast.success('Destination created');
      }
      closeForm();
    } catch (err) {
      toast.error((err as Error).message || 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm(`Delete "${destinations.find(d => d.id === id)?.name}"? This cannot be undone.`)) return;
    setDeletingId(id);
    try {
      await deleteDoc(doc(db, COLL, id));
      setDestinations(prev => prev.filter(d => d.id !== id));
      toast.success('Deleted');
    } catch {
      toast.error('Delete failed');
    } finally {
      setDeletingId(null);
    }
  }

  async function handleSeed() {
    if (!confirm('This will overwrite all 12 original destinations. Continue?')) return;
    setSeeding(true);
    try {
      const res = await fetch('/api/seed/destinations', { method: 'POST' });
      if (!res.ok) throw new Error('Seed failed');
      const { seeded } = await res.json();
      toast.success(`Seeded ${seeded} destinations`);
      await loadDestinations();
    } catch {
      toast.error('Seed failed');
    } finally {
      setSeeding(false);
    }
  }

  function toggleVibe(v: string) {
    if (!form) return;
    setForm(f => f ? {
      ...f,
      vibe: f.vibe.includes(v) ? f.vibe.filter(x => x !== v) : [...f.vibe, v],
    } : f);
  }

  if (loading || fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
      </div>
    );
  }

  if (!adminProfile) return null;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="btn-ghost !p-2">
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div>
              <h1 className="font-display text-lg font-bold text-slate-900">Destinations</h1>
              <p className="text-xs text-slate-500">{destinations.length} total</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSeed}
              disabled={seeding}
              className="btn-ghost text-sm px-3 py-2"
            >
              {seeding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Database className="h-4 w-4" />}
              Seed defaults
            </button>
            <button onClick={openAdd} className="btn-primary text-sm px-4 py-2">
              <Plus className="h-4 w-4" /> Add destination
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-6">
        {/* Form */}
        {form && (
          <div className="card p-6 border-brand-200 border-2">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display font-bold text-lg">
                {isEdit ? 'Edit destination' : 'New destination'}
              </h2>
              <button onClick={closeForm} className="btn-ghost !p-2">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="label">ID (slug)</label>
                <input
                  className="input"
                  value={form.id}
                  readOnly={isEdit}
                  onChange={e => setForm(f => f ? { ...f, id: e.target.value.toLowerCase().replace(/\s+/g, '-') } : f)}
                  placeholder="e.g. sigiriya"
                />
                {!isEdit && <p className="text-xs text-slate-400 mt-1">Lowercase, hyphens only. Cannot be changed later.</p>}
              </div>
              <div>
                <label className="label">Name</label>
                <input className="input" value={form.name} onChange={e => setForm(f => f ? { ...f, name: e.target.value } : f)} placeholder="Sigiriya Rock Fortress" />
              </div>
              <div>
                <label className="label">Region</label>
                <input className="input" value={form.region} onChange={e => setForm(f => f ? { ...f, region: e.target.value } : f)} placeholder="Central Province" />
              </div>
              <div>
                <label className="label">Rating (0–5)</label>
                <input type="number" min={0} max={5} step={0.1} className="input" value={form.rating} onChange={e => setForm(f => f ? { ...f, rating: parseFloat(e.target.value) || 0 } : f)} />
              </div>
              <div>
                <label className="label">Latitude</label>
                <input type="number" step="any" className="input" value={form.lat} onChange={e => setForm(f => f ? { ...f, lat: parseFloat(e.target.value) || 0 } : f)} />
              </div>
              <div>
                <label className="label">Longitude</label>
                <input type="number" step="any" className="input" value={form.lng} onChange={e => setForm(f => f ? { ...f, lng: parseFloat(e.target.value) || 0 } : f)} />
              </div>
              <div className="md:col-span-2">
                <label className="label">Image URL</label>
                <input className="input" value={form.image} onChange={e => setForm(f => f ? { ...f, image: e.target.value } : f)} placeholder="https://picsum.photos/seed/my-dest/1200/800" />
              </div>
              <div className="md:col-span-2">
                <label className="label">Description</label>
                <textarea rows={3} className="input resize-none" value={form.description} onChange={e => setForm(f => f ? { ...f, description: e.target.value } : f)} placeholder="Short description shown on destination cards…" />
              </div>
              <div className="md:col-span-2">
                <label className="label">Vibes</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {VIBE_OPTIONS.map(v => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => toggleVibe(v)}
                      className={`px-3 py-1 rounded-full text-sm border font-medium transition ${
                        form.vibe.includes(v)
                          ? 'bg-brand-500 text-white border-brand-500'
                          : 'bg-white border-slate-200 text-slate-600 hover:border-brand-300'
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button onClick={closeForm} className="btn-ghost">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="btn-primary">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : isEdit ? 'Save changes' : 'Create'}
              </button>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-left">
                  <th className="px-5 py-3 font-medium text-slate-500">Destination</th>
                  <th className="px-5 py-3 font-medium text-slate-500">Region</th>
                  <th className="px-5 py-3 font-medium text-slate-500">Vibes</th>
                  <th className="px-5 py-3 font-medium text-slate-500">Coords</th>
                  <th className="px-5 py-3 font-medium text-slate-500">Rating</th>
                  <th className="px-5 py-3 font-medium text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {destinations.map(d => (
                  <tr key={d.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-lg bg-cover bg-center shrink-0 bg-slate-100"
                          style={d.image ? { backgroundImage: `url(${d.image})` } : undefined}
                        />
                        <div>
                          <p className="font-medium text-slate-900">{d.name}</p>
                          <p className="text-xs text-slate-400">{d.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {d.region}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-1">
                        {d.vibe.map(v => (
                          <span key={v} className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200">{v}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-4 font-mono text-xs text-slate-500">
                      {d.lat.toFixed(3)}, {d.lng.toFixed(3)}
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1 text-amber-600 font-semibold">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /> {d.rating}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEdit(d)}
                          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-brand-600 transition"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(d.id)}
                          disabled={deletingId === d.id}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-slate-500 hover:text-red-600 transition disabled:opacity-50"
                        >
                          {deletingId === d.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {destinations.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-5 py-12 text-center text-slate-400">
                      No destinations yet. Click &quot;Seed defaults&quot; to import the original 12.
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
