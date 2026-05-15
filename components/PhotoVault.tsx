'use client';

import { useRef, useState } from 'react';
import { uploadTripPhoto } from '@/lib/trips';
import { Camera, Loader2, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PhotoVault({
  tripId,
  userId,
  initialPhotos = [],
}: {
  tripId: string;
  userId: string;
  initialPhotos?: string[];
}) {
  const [photos, setPhotos] = useState<string[]>(initialPhotos);
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (files: FileList | null) => {
    if (!files || !files.length) return;
    setBusy(true);
    try {
      for (const f of Array.from(files)) {
        if (!f.type.startsWith('image/')) continue;
        const url = await uploadTripPhoto(tripId, userId, f);
        setPhotos(p => [...p, url]);
      }
      toast.success('Photo(s) uploaded');
    } catch (err: unknown) {
      toast.error((err as Error).message || 'Upload failed');
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-lg font-bold flex items-center gap-2">
          <ImageIcon className="h-5 w-5 text-brand-500" /> Travel Photo Vault
        </h3>
        <button
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="btn-primary !py-2 !text-sm"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
          Upload
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={e => handleFile(e.target.files)}
        />
      </div>
      {photos.length === 0 ? (
        <div className="text-center py-8 text-slate-500 text-sm">
          No photos yet — upload high-res images from your trip.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {photos.map((url, i) => (
            <a
              key={i}
              href={url}
              target="_blank"
              rel="noreferrer"
              className="aspect-square rounded-xl bg-cover bg-center hover:opacity-90 transition"
              style={{ backgroundImage: `url(${url})` }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
