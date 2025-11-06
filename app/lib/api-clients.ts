import type { RestCountryResponse, OpenMeteoResponse, NewsDataResponse } from './types';

/**
 * Fetches country data from REST Countries API
 * @param countryName - Name of the country to fetch
 * @returns Country data from REST Countries API
 */
export async function fetchCountryData(countryName: string): Promise<RestCountryResponse> {
  const response = await fetch(
    `https://restcountries.com/v3.1/name/${encodeURIComponent(countryName)}`,
    { next: { revalidate: 3600 } }, // Cache for 1 hour
  );

  if (!response.ok) {
    throw new Error(`Country not found: ${countryName}`);
  }

  const data = await response.json();

  // REST Countries returns an array, we want the first match
  return Array.isArray(data) ? data[0] : data;
}

/**
 * Fetches weather data from Open-Meteo API
 * @param coordinates - [latitude, longitude] of the location
 * @returns Weather data from Open-Meteo API
 */
export async function fetchWeatherData(coordinates: [number, number]): Promise<OpenMeteoResponse> {
  const [lat, lng] = coordinates;

  const parameters = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lng.toString(),
    current_weather: 'true',
    daily: 'temperature_2m_max,temperature_2m_min',
    timezone: 'auto',
    forecast_days: '3',
  });

  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?${parameters.toString()}`,
    { next: { revalidate: 1800 } }, // Cache for 30 minutes
  );

  if (!response.ok) {
    throw new Error('Weather data unavailable');
  }

  return response.json();
}

/**
 * Fetches news data from NewsData.io API
 * @param countryName - Name of the country to search news for
 * @returns News data from NewsData.io API
 */
export async function fetchNewsData(countryName: string): Promise<NewsDataResponse> {
  const apiKey = process.env.NEWSDATA_API_KEY;

  if (!apiKey) {
    console.warn('NewsData API key not configured');
    return { status: 'success', totalResults: 0, results: [] };
  }

  try {
    const parameters = new URLSearchParams({
      apikey: apiKey,
      q: countryName,
      language: 'en',
      size: '5',
    });

    const response = await fetch(
      `https://newsdata.io/api/1/news?${parameters.toString()}`,
      { next: { revalidate: 900 } }, // Cache for 15 minutes
    );

    const data = await response.json();

    if (data.status === 'error') {
      console.error('NewsData API error:', data.message);
      return { status: 'success', totalResults: 0, results: [] };
    }

    return data;
  } catch (error) {
    console.error('News fetch error:', error);
    return { status: 'success', totalResults: 0, results: [] };
  }
}

/**
 * Maps weather code to human-readable condition string
 * @param code - Weather code from Open-Meteo API
 * @returns Human-readable weather condition
 */
export function getWeatherCondition(code: number): string {
  const conditions: Record<number, string> = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Foggy',
    48: 'Depositing rime fog',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Dense drizzle',
    61: 'Slight rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    71: 'Slight snow',
    73: 'Moderate snow',
    75: 'Heavy snow',
    95: 'Thunderstorm',
    96: 'Thunderstorm with light hail',
    99: 'Thunderstorm with heavy hail',
  };

  return conditions[code] || 'Unknown';
}

/**
 * Gets weather emoji based on condition string
 * @param conditions - Weather condition string
 * @returns Weather emoji
 */
export function getWeatherEmoji(conditions: string): string {
  const lower = conditions.toLowerCase();

  if (lower.includes('clear')) return '☀️';
  if (lower.includes('cloud')) return '⛅';
  if (lower.includes('rain') || lower.includes('drizzle')) return '🌧️';
  if (lower.includes('snow')) return '❄️';
  if (lower.includes('thunder')) return '⛈️';
  if (lower.includes('fog')) return '🌫️';

  return '🌡️';
}
