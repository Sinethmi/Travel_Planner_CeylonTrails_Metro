import { NextRequest, NextResponse } from 'next/server';
import { generateItinerary } from '@/lib/gemini';
import { PlannerInput } from '@/lib/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as PlannerInput;
    if (!body.destination || !body.startDate || !body.endDate) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const itinerary = await generateItinerary(body);
    return NextResponse.json({ itinerary });
  } catch (err: unknown) {
    console.error('[generate-itinerary]', err);
    return NextResponse.json(
      { error: (err as Error).message || 'Failed to generate' },
      { status: 500 },
    );
  }
}
