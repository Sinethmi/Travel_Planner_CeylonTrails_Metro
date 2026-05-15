export interface Destination {
  id: string;
  name: string;
  region: string;
  vibe: string[];
  description: string;
  lat: number;
  lng: number;
  image: string;
  rating: number;
}

const img = (id: string) => `https://picsum.photos/seed/${id}/1200/800`;

export const SRI_LANKA_DESTINATIONS: Destination[] = [
  {
    id: 'sigiriya',
    name: 'Sigiriya Rock Fortress',
    region: 'Central Province',
    vibe: ['History', 'Adventure'],
    description:
      'An ancient rock fortress with frescoes and gardens — a UNESCO World Heritage Site.',
    lat: 7.957,
    lng: 80.7603,
    image: img('sigiriya-ceylon'),
    rating: 4.8,
  },
  {
    id: 'ella',
    name: 'Ella',
    region: 'Uva Province',
    vibe: ['Nature', 'Adventure'],
    description:
      "Hill country town famous for Nine Arch Bridge, Little Adam's Peak and tea trails.",
    lat: 6.8667,
    lng: 81.0466,
    image: img('ella-tea-trails'),
    rating: 4.9,
  },
  {
    id: 'kandy',
    name: 'Kandy',
    region: 'Central Province',
    vibe: ['Cultural', 'History'],
    description:
      'Last royal capital — home to the Temple of the Sacred Tooth Relic and Kandy Lake.',
    lat: 7.2906,
    lng: 80.6337,
    image: img('kandy-lake'),
    rating: 4.7,
  },
  {
    id: 'galle',
    name: 'Galle Fort',
    region: 'Southern Province',
    vibe: ['History', 'Cultural', 'Beach'],
    description:
      'A 17th-century Dutch fort, cobbled streets, ramparts and boutique cafés by the sea.',
    lat: 6.0257,
    lng: 80.2168,
    image: img('galle-fort'),
    rating: 4.7,
  },
  {
    id: 'yala',
    name: 'Yala National Park',
    region: 'Southern Province',
    vibe: ['Wildlife', 'Nature'],
    description:
      "Sri Lanka's most visited park — leopards, elephants and abundant birdlife.",
    lat: 6.3725,
    lng: 81.5185,
    image: img('yala-wildlife'),
    rating: 4.6,
  },
  {
    id: 'mirissa',
    name: 'Mirissa Beach',
    region: 'Southern Province',
    vibe: ['Beach', 'Relaxation'],
    description: 'Crescent beach with whale watching, palm trees and surf spots.',
    lat: 5.9485,
    lng: 80.4566,
    image: img('mirissa-beach'),
    rating: 4.7,
  },
  {
    id: 'nuwara-eliya',
    name: 'Nuwara Eliya',
    region: 'Central Province',
    vibe: ['Nature', 'Relaxation'],
    description: '"Little England" — tea plantations, cool climate and waterfalls.',
    lat: 6.9497,
    lng: 80.7891,
    image: img('nuwara-eliya'),
    rating: 4.6,
  },
  {
    id: 'anuradhapura',
    name: 'Anuradhapura',
    region: 'North Central Province',
    vibe: ['History', 'Cultural'],
    description: 'Ancient capital with sacred stupas and the Sri Maha Bodhi tree.',
    lat: 8.3114,
    lng: 80.4037,
    image: img('anuradhapura'),
    rating: 4.5,
  },
  {
    id: 'polonnaruwa',
    name: 'Polonnaruwa',
    region: 'North Central Province',
    vibe: ['History', 'Cultural'],
    description: 'A medieval capital with extraordinarily preserved ruins.',
    lat: 7.9403,
    lng: 81.0188,
    image: img('polonnaruwa-ruins'),
    rating: 4.6,
  },
  {
    id: 'arugam-bay',
    name: 'Arugam Bay',
    region: 'Eastern Province',
    vibe: ['Beach', 'Adventure'],
    description: 'World-class surf destination with laid-back beach vibes.',
    lat: 6.8403,
    lng: 81.8344,
    image: img('arugam-bay-surf'),
    rating: 4.7,
  },
  {
    id: 'colombo',
    name: 'Colombo',
    region: 'Western Province',
    vibe: ['Cultural', 'Food'],
    description: 'Vibrant commercial capital with markets, temples and modern cafés.',
    lat: 6.9271,
    lng: 79.8612,
    image: img('colombo-city'),
    rating: 4.3,
  },
  {
    id: 'trincomalee',
    name: 'Trincomalee',
    region: 'Eastern Province',
    vibe: ['Beach', 'Nature'],
    description:
      'Natural harbour with Nilaveli & Uppuveli beaches and snorkelling at Pigeon Island.',
    lat: 8.5874,
    lng: 81.2152,
    image: img('trincomalee-coast'),
    rating: 4.6,
  },
];

export function searchDestinations(q: string): Destination[] {
  const s = q.toLowerCase().trim();
  if (!s) return SRI_LANKA_DESTINATIONS;
  return SRI_LANKA_DESTINATIONS.filter(
    d =>
      d.name.toLowerCase().includes(s) ||
      d.region.toLowerCase().includes(s) ||
      d.vibe.some(v => v.toLowerCase().includes(s)),
  );
}

export function findDestination(id: string): Destination | undefined {
  return SRI_LANKA_DESTINATIONS.find(d => d.id === id);
}

export function haversineKm(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
): number {
  const toRad = (x: number) => (x * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(x));
}
