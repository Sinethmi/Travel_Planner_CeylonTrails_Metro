# 🇱🇰 CeylonTrails — AI-Powered Sri Lanka Travel Planner

A full-stack **Next.js + Firebase + AI** travel planner that delivers all the features in your spec:

| Spec | Implementation |
| --- | --- |
| Frontend: Next.js | Next.js 14 App Router + Tailwind CSS |
| Backend: Firebase | Firebase Auth + Cloud Firestore + Firebase Storage |
| Authentication: Email/Password + Google | `signInWithEmailAndPassword`, `createUserWithEmailAndPassword`, Google popup |
| Cloud Firestore | `trips/{id}` + `users/{uid}` collections with real-time CRUD |
| AI Itinerary Generation | Google Gemini 1.5 Flash (free) with structured JSON output |
| Contextual Prompting | Budget, duration, vibes, travelers — all passed to the model |
| Route Optimization | Nearest-neighbour reorder using Haversine distance |
| Live Route Visualization | Google Maps JS API + Polyline |
| Smart Search | Autocomplete for Sri Lankan tourist hubs |
| Nearby Discovery | Google Places API (restaurants / hotels / rest stops / parks…) |
| Weather-Aware Planning | OpenWeather current + 5-day, with "Rainy day" alternatives |
| Distance/Time Estimation | Real-time per-leg distance under each activity |
| Cloud Sync | Firestore-backed trips, accessible anywhere |
| Travel Photo Vault | Upload to Firebase Storage, displayed per-trip |
| Personalized Profile | Vibes, dark mode, push toggle, history |
| Push notifications (FCM) | UI toggle wired (FCM activation via Firebase console) |
| Splash · Auth · Dashboard · Planner · Itinerary · Map · Attraction · Nearby · Trips · Profile | All 10 screens delivered |

---

## 🚀 Quick start

```bash
# 1. install
npm install

# 2. copy env
cp .env.local.example .env.local
# (firebase config already filled — only AI / weather / maps keys needed)

# 3. dev
npm run dev
# open http://localhost:3000
```

---

## 🔑 Free API keys (everything used here is free)

### 1. Google Gemini AI — **FREE**
Used for: AI itinerary generation.
- Go to → https://aistudio.google.com/app/apikey
- Click **“Create API Key”** → copy.
- Paste into `.env.local` as `GEMINI_API_KEY=...`
- **Free tier:** 15 requests / minute, 1,500 / day.

> If you skip this, the app gracefully falls back to a hand-tuned local itinerary builder so the planner still works end-to-end.

### 2. Weather — **Open-Meteo · NO KEY NEEDED**
Used for: current weather + 5-day forecast + rainy-day suggestions.
- Already wired in `lib/weather.ts` — **no signup, no API key, no waiting**.
- Free forever for non-commercial use, 10,000 calls/day.
- Endpoint: `https://api.open-meteo.com/v1/forecast` (called server-side).

### 3. Google Maps Platform — **FREE $200 credit / month**
Used for: route polylines, markers, nearby places autocomplete.
- Go to → https://console.cloud.google.com/google/maps-apis
- Create a project → enable **Maps JavaScript API**, **Places API**, **Directions API**.
- Credentials → create API key → restrict to your domain.
- Paste into `.env.local` as `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=...`
- **Free tier:** $200 monthly credit — easily covers solo dev usage.

> Without this key, maps render a styled fallback list (still functional, just non-interactive).

---

## 🔥 Firebase setup

Your project (**TravelApplication / `travelapplication-e3b82`**) is already wired in `.env.local`.

In the Firebase Console for this project:

1. **Authentication** → Sign-in method
   - Enable **Email/Password** ✅
   - Enable **Google** ✅ (set support email)
2. **Firestore Database** → Create database (production mode) → Region: `asia-south1` (recommended).
3. **Storage** → Get started (needed for Travel Photo Vault).
4. **Rules**
   - Paste contents of [`firestore.rules`](./firestore.rules) into Firestore → Rules → Publish.
   - Paste contents of [`storage.rules`](./storage.rules) into Storage → Rules → Publish.

That’s it — Auth, Firestore and Storage are live.

---

## 🗺️ Screens

| # | Route | Purpose |
| - | --- | --- |
| 1 | `/` | **Splash** — branded loader, auth-state routing |
| 2 | `/auth/login` and `/auth/signup` | **Auth** — email/password + Google |
| 3 | `/dashboard` | **Home** — smart search, live weather, featured destinations |
| 4 | `/planner` | **Planner Input** — dates, budget, travelers, vibes, notes |
| 5 | `/itinerary/[id]` | **Itinerary Display** — AI day-by-day timeline with weather + photos |
| 6 | `/map/[id]` | **Route Map** — full Google Maps polyline of every stop |
| 7 | `/attraction/[id]` | **Attraction Details** — info, AI tips, nearby link |
| 8 | `/nearby` | **Nearby Finder** — Places API for restaurants/hotels/etc. |
| 9 | `/trips` | **Saved Trips** — Firestore archive, open/delete |
| 10 | `/profile` | **Profile** — preferences, dark mode toggle, push toggle, vibes |

---

## 🧠 AI prompt design

`lib/gemini.ts` builds a structured prompt with:
- Real Sri Lankan hubs (lat/lng) injected directly into the prompt.
- Strict JSON-only output enforced via `responseMimeType: 'application/json'`.
- A graceful local fallback so the demo never breaks.
- Post-generation **nearest-neighbour route optimisation** reorders activities to minimise travel.

---

## 🏗️ Project layout

```
app/
  api/
    generate-itinerary/   POST  → Gemini call
    weather/              GET   → OpenWeather proxy
  auth/{login,signup}/    Auth pages
  dashboard/              Home Dashboard
  planner/                Planner Input
  itinerary/[id]/         Itinerary Display
  map/[id]/               Route Map
  attraction/[id]/        Attraction Details
  nearby/                 Nearby Finder
  trips/                  Saved Trips
  profile/                Profile
  page.tsx                Splash
  layout.tsx              Root + providers + Toaster
components/
  AuthGate · Navbar · SmartSearch · DestinationCard
  WeatherWidget · RouteMap · PhotoVault
contexts/
  AuthContext · ThemeContext
lib/
  firebase · trips · types · srilanka · gemini · weather
firestore.rules · storage.rules
```

---

## 🌗 Dark mode

System-aware on first load (`prefers-color-scheme`), then user-controlled via the navbar sun/moon button or **Profile → Preferences → Dark mode**. Synced to Firestore so it follows the user across devices.

---

## 📸 Travel Photo Vault

`components/PhotoVault.tsx` uploads images to `gs://<bucket>/trips/{uid}/{tripId}/...` and appends the public download URL to the trip’s `photos[]` array in Firestore. Images appear on the itinerary page sidebar.

---

## ✅ Production build

```bash
npm run build
npm start
```

Deploy anywhere Next.js runs (Vercel one-click, Firebase Hosting, Render, etc.).

---

Made with ☕ + the Sri Lankan sun. Enjoy your journey ✈️🌴
