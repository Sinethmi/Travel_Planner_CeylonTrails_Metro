// Open-Meteo: free forever, no API key, no rate-limit hassle.
// Docs: https://open-meteo.com/en/docs

export interface WeatherResponse {
  name: string;
  temp: number;
  feelsLike: number;
  humidity: number;
  description: string;
  icon: string;
  wind: number;
  isRainy: boolean;
  forecast?: { date: string; temp: number; icon: string; description: string }[];
}

// WMO weather code → label + emoji-style icon code (matches OpenWeather-ish strings for UI compat)
function wmo(code: number): { description: string; icon: string; rainy: boolean } {
  const map: Record<number, [string, string, boolean]> = {
    0: ['clear sky', '01d', false],
    1: ['mainly clear', '01d', false],
    2: ['partly cloudy', '02d', false],
    3: ['overcast', '03d', false],
    45: ['fog', '50d', false],
    48: ['depositing rime fog', '50d', false],
    51: ['light drizzle', '09d', true],
    53: ['drizzle', '09d', true],
    55: ['dense drizzle', '09d', true],
    56: ['freezing drizzle', '09d', true],
    57: ['freezing drizzle', '09d', true],
    61: ['light rain', '10d', true],
    63: ['rain', '10d', true],
    65: ['heavy rain', '10d', true],
    66: ['freezing rain', '13d', true],
    67: ['freezing rain', '13d', true],
    71: ['light snow', '13d', false],
    73: ['snow', '13d', false],
    75: ['heavy snow', '13d', false],
    77: ['snow grains', '13d', false],
    80: ['rain showers', '09d', true],
    81: ['rain showers', '09d', true],
    82: ['violent rain showers', '09d', true],
    85: ['snow showers', '13d', false],
    86: ['snow showers', '13d', false],
    95: ['thunderstorm', '11d', true],
    96: ['thunderstorm with hail', '11d', true],
    99: ['thunderstorm with hail', '11d', true],
  };
  const v = map[code];
  return v ? { description: v[0], icon: v[1], rainy: v[2] } : { description: 'unknown', icon: '01d', rainy: false };
}

interface OpenMeteoCurrent {
  temperature_2m: number;
  apparent_temperature: number;
  relative_humidity_2m: number;
  weather_code: number;
  wind_speed_10m: number;
}
interface OpenMeteoDaily {
  time: string[];
  temperature_2m_max: number[];
  weather_code: number[];
}
interface OpenMeteoGeo {
  results?: { name: string; admin1?: string; country?: string }[];
}

export async function getWeatherByCoords(
  lat: number,
  lng: number,
): Promise<WeatherResponse | null> {
  try {
    const url =
      `https://api.open-meteo.com/v1/forecast` +
      `?latitude=${lat}&longitude=${lng}` +
      `&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m` +
      `&daily=temperature_2m_max,weather_code` +
      `&forecast_days=5&timezone=auto`;

    const res = await fetch(url, { next: { revalidate: 600 } });
    if (!res.ok) return demoWeather();
    const data = (await res.json()) as {
      current?: OpenMeteoCurrent;
      daily?: OpenMeteoDaily;
    };
    const cur = data.current;
    if (!cur) return demoWeather();

    const curCode = wmo(cur.weather_code);

    let name = 'Sri Lanka';
    try {
      const geo = await fetch(
        `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${lat}&longitude=${lng}&language=en&count=1`,
      );
      if (geo.ok) {
        const g = (await geo.json()) as OpenMeteoGeo;
        const r = g.results?.[0];
        if (r) name = r.name + (r.admin1 ? `, ${r.admin1}` : '');
      }
    } catch { /* keep default */ }

    const forecast = data.daily
      ? data.daily.time.map((date, i) => {
          const c = wmo(data.daily!.weather_code[i] ?? 0);
          return {
            date,
            temp: Math.round(data.daily!.temperature_2m_max[i] ?? 0),
            icon: c.icon,
            description: c.description,
          };
        })
      : [];

    return {
      name,
      temp: Math.round(cur.temperature_2m),
      feelsLike: Math.round(cur.apparent_temperature),
      humidity: Math.round(cur.relative_humidity_2m),
      description: curCode.description,
      icon: curCode.icon,
      wind: Math.round(cur.wind_speed_10m),
      isRainy: curCode.rainy,
      forecast,
    };
  } catch {
    return demoWeather();
  }
}

function demoWeather(): WeatherResponse {
  return {
    name: 'Sri Lanka',
    temp: 28,
    feelsLike: 31,
    humidity: 78,
    description: 'partly cloudy',
    icon: '02d',
    wind: 12,
    isRainy: false,
    forecast: [],
  };
}
