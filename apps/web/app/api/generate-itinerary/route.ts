import { NextRequest, NextResponse } from 'next/server';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { generateItinerary } from '@/lib/gemini';
import { Destination } from '@/lib/srilanka';
import { PlannerInput } from '@/lib/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as PlannerInput;
    if (!body.destination || !body.startDate || !body.endDate) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const snap = await getDocs(collection(db, 'destinations'));
    const destinations = snap.docs.map(d => ({
      ...(d.data() as Omit<Destination, 'id'>),
      id: d.id,
    }));

    const itinerary = await generateItinerary(body, destinations);
    return NextResponse.json({ itinerary });
  } catch (err: unknown) {
    console.error('[generate-itinerary]', err);
    return NextResponse.json(
      { error: (err as Error).message || 'Failed to generate' },
      { status: 500 },
    );
  }
}
