import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const snap = await adminDb.collection('trips').count().get();
    return NextResponse.json(
      { count: snap.data().count },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  } catch {
    return NextResponse.json(
      { error: 'Failed to count trips' },
      { status: 500, headers: { 'Cache-Control': 'no-store' } },
    );
  }
}
