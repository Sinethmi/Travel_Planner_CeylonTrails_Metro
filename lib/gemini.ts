import { PlannerInput, Itinerary, Activity } from './types';
import { SRI_LANKA_DESTINATIONS, haversineKm } from './srilanka';

const GEMINI_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';

function buildPrompt(input: PlannerInput, days: number): string {
  const knownLocations = SRI_LANKA_DESTINATIONS.map(
    d => `${d.name} (${d.region}) [lat:${d.lat}, lng:${d.lng}] — vibes: ${d.vibe.join(', ')}`,
  ).join('\n');

  return `You are an expert Sri Lankan travel planner.

USER REQUEST
- Destination/Region: ${input.destination}
- Dates: ${input.startDate} to ${input.endDate} (${days} day${days > 1 ? 's' : ''})
- Travelers: ${input.travelers}
- Budget: ${input.budget}
- Travel Vibes: ${input.vibes.join(', ')}
- Notes: ${input.notes || 'none'}

KNOWN SRI LANKAN HUBS (reuse exact coordinates when relevant):
${knownLocations}

RULES
- Return a logical day-by-day plan (${days} days) optimised for short travel between activities.
- 3–5 activities per day with realistic times in 24h "HH:MM" format.
- Each activity: title, description, location (a real place in Sri Lanka), lat, lng, durationMins, cost, and a one-line "tip".
- Use lat/lng from KNOWN HUBS when activity is at one; otherwise provide plausible coordinates within Sri Lanka.
- Match the budget tier (${input.budget}) realistically in cost estimates (USD).
- Reflect the vibes (${input.vibes.join(', ')}) clearly in activity choices and a per-day "theme".
- Include the total budget estimate (USD) for the whole trip.

OUTPUT
Reply with ONLY valid minified JSON (no markdown, no commentary) of shape:
{
  "title": string,
  "summary": string,
  "totalBudget": string,
  "days": [
    {
      "day": number,
      "date": "YYYY-MM-DD",
      "theme": string,
      "activities": [
        {
          "time": "HH:MM",
          "title": string,
          "description": string,
          "location": string,
          "lat": number,
          "lng": number,
          "durationMins": number,
          "cost": string,
          "tip": string
        }
      ]
    }
  ]
}`;
}

function diffDaysInclusive(startDate: string, endDate: string): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const ms = end.getTime() - start.getTime();
  return Math.max(1, Math.floor(ms / 86400000) + 1);
}

function dateForDay(startDate: string, offset: number): string {
  const d = new Date(startDate);
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0, 10);
}

function extractJson(text: string): unknown {
  const fence = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const raw = fence ? fence[1] : text;
  const start = raw.indexOf('{');
  const end = raw.lastIndexOf('}');
  const slice = start >= 0 && end > start ? raw.slice(start, end + 1) : raw;
  return JSON.parse(slice);
}

function optimiseRoute(activities: Activity[]): Activity[] {
  if (activities.length <= 2) return activities;
  const first = activities[0];
  const remaining = activities.slice(1);
  const ordered: Activity[] = [first];
  const pool = [...remaining];
  while (pool.length) {
    const last = ordered[ordered.length - 1];
    if (last.lat == null || last.lng == null) {
      ordered.push(pool.shift()!);
      continue;
    }
    let bestIdx = 0;
    let bestDist = Infinity;
    pool.forEach((a, i) => {
      if (a.lat == null || a.lng == null) return;
      const d = haversineKm(
        { lat: last.lat!, lng: last.lng! },
        { lat: a.lat!, lng: a.lng! },
      );
      if (d < bestDist) {
        bestDist = d;
        bestIdx = i;
      }
    });
    ordered.push(pool.splice(bestIdx, 1)[0]);
  }
  return ordered;
}

function fallbackItinerary(input: PlannerInput): Itinerary {
  const days = diffDaysInclusive(input.startDate, input.endDate);
  const pool = SRI_LANKA_DESTINATIONS.filter(d =>
    input.vibes.length ? d.vibe.some(v => input.vibes.includes(v as never)) : true,
  );
  const picks = pool.length ? pool : SRI_LANKA_DESTINATIONS;
  const budgetPerDay =
    input.budget === 'Budget' ? 35 : input.budget === 'Mid-range' ? 90 : 220;

  const built = Array.from({ length: days }, (_, i) => {
    const base = picks[i % picks.length];
    const second = picks[(i + 2) % picks.length];
    const third = picks[(i + 4) % picks.length];
    const acts: Activity[] = [
      {
        time: '08:30',
        title: `Explore ${base.name}`,
        description: base.description,
        location: base.name,
        lat: base.lat,
        lng: base.lng,
        durationMins: 180,
        cost: `$${Math.round(budgetPerDay * 0.4)}`,
        tip: 'Arrive early to beat the crowds.',
      },
      {
        time: '13:00',
        title: 'Local lunch experience',
        description: `Try a regional rice & curry near ${base.name}.`,
        location: `${base.name} cafés`,
        lat: base.lat + 0.005,
        lng: base.lng + 0.005,
        durationMins: 75,
        cost: `$${Math.round(budgetPerDay * 0.15)}`,
        tip: 'Ask the locals for the catch of the day.',
      },
      {
        time: '15:00',
        title: `Visit ${second.name}`,
        description: second.description,
        location: second.name,
        lat: second.lat,
        lng: second.lng,
        durationMins: 150,
        cost: `$${Math.round(budgetPerDay * 0.25)}`,
        tip: 'Wear comfortable shoes — lots of walking.',
      },
      {
        time: '18:30',
        title: `Sunset at ${third.name}`,
        description: `Wind down with a sunset view near ${third.name}.`,
        location: third.name,
        lat: third.lat,
        lng: third.lng,
        durationMins: 90,
        cost: `$${Math.round(budgetPerDay * 0.2)}`,
        tip: 'Bring a light jacket if you head inland.',
      },
    ];
    return {
      day: i + 1,
      date: dateForDay(input.startDate, i),
      theme: input.vibes[i % Math.max(1, input.vibes.length)] || 'Discover Sri Lanka',
      activities: optimiseRoute(acts),
    };
  });

  return {
    title: `${days}-Day ${input.destination} ${input.vibes[0] || 'Discovery'} Trip`,
    summary: `A curated ${input.budget.toLowerCase()} itinerary for ${input.travelers} traveler${input.travelers > 1 ? 's' : ''} blending ${input.vibes.join(', ') || 'iconic Sri Lankan experiences'}.`,
    totalBudget: `$${budgetPerDay * days} – $${budgetPerDay * days + 100}`,
    days: built,
  };
}

export async function generateItinerary(input: PlannerInput): Promise<Itinerary> {
  const apiKey = process.env.GEMINI_API_KEY;
  const days = diffDaysInclusive(input.startDate, input.endDate);

  if (!apiKey) {
    return fallbackItinerary(input);
  }

  try {
    const res = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: buildPrompt(input, days) }] }],
        generationConfig: {
          temperature: 0.85,
          topP: 0.95,
          maxOutputTokens: 4096,
          responseMimeType: 'application/json',
        },
      }),
    });

    if (!res.ok) {
      console.warn('[Gemini] non-ok response', res.status, await res.text());
      return fallbackItinerary(input);
    }

    const json: {
      candidates?: { content?: { parts?: { text?: string }[] } }[];
    } = await res.json();
    const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) return fallbackItinerary(input);

    const parsed = extractJson(text) as Itinerary;
    parsed.days = parsed.days.map(d => ({ ...d, activities: optimiseRoute(d.activities) }));
    return parsed;
  } catch (err) {
    console.warn('[Gemini] error, using fallback', err);
    return fallbackItinerary(input);
  }
}
