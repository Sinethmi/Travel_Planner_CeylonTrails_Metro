import { NextRequest, NextResponse } from 'next/server';
import { getWeatherByCoords } from '@/lib/weather';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lat = parseFloat(searchParams.get('lat') || '');
  const lng = parseFloat(searchParams.get('lng') || '');
  if (Number.isNaN(lat) || Number.isNaN(lng)) {
    return NextResponse.json({ error: 'lat & lng required' }, { status: 400 });
  }
  const data = await getWeatherByCoords(lat, lng);
  return NextResponse.json(data);
}
