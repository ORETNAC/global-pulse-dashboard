import { NextRequest, NextResponse } from 'next/server';
import type { CountryPulseResponse } from '@/app/lib/types';
import { getCached, setCache } from '@/app/lib/cache';
import { fetchCountryData, fetchWeatherData, fetchNewsData, getWeatherCondition } from '@/app/lib/api-clients';

interface RouteParameters {
  params: Promise<{
    name: string;
  }>;
}

// Maximum length for country name input
const MAX_COUNTRY_NAME_LENGTH = 100;

/**
 * Validates country name input
 * @param name - Country name to validate
 * @returns Object with valid flag and sanitized name
 */
function validateCountryName(name: string): {
  valid: boolean;
  sanitized: string;
  error?: string;
} {
  // Trim whitespace
  const trimmed = name.trim();

  // Check if empty
  if (!trimmed) {
    return { valid: false, sanitized: '', error: 'Country name is required' };
  }

  // Check length
  if (trimmed.length > MAX_COUNTRY_NAME_LENGTH) {
    return {
      valid: false,
      sanitized: '',
      error: 'Country name is too long',
    };
  }

  // Sanitize: only allow letters, spaces, hyphens, and apostrophes
  // This prevents injection attacks while allowing names like "Côte d'Ivoire"
  const sanitized = trimmed.replaceAll(/[^\s'A-Za-zÀ-ÿ-]/g, '');

  // Check if sanitization removed significant content
  if (sanitized.length < trimmed.length * 0.5) {
    return {
      valid: false,
      sanitized: '',
      error: 'Country name contains invalid characters',
    };
  }

  return { valid: true, sanitized };
}

/**
 * GET /api/country/[name]
 * Fetches unified country data including weather and news
 */
export async function GET(_request: NextRequest, { params }: RouteParameters): Promise<NextResponse> {
  try {
    // Next.js 16: params is now a Promise and must be awaited
    const resolvedParameters = await params;

    // Validate and sanitize input
    const validation = validateCountryName(resolvedParameters.name);

    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const countryName = validation.sanitized;

    // Check cache first
    const cacheKey = `country:${countryName.toLowerCase()}`;
    const cached = getCached<CountryPulseResponse>(cacheKey);

    if (cached) {
      // Return cached data with a header indicating cache hit
      return NextResponse.json(cached, {
        headers: { 'X-Cache': 'HIT' },
      });
    }

    // Fetch country data first (need coordinates for weather)
    const countryData = await fetchCountryData(countryName);

    // Validate that country has required data
    if (!countryData.capitalInfo?.latlng || !countryData.capital?.[0]) {
      return NextResponse.json({ error: 'Country capital data not available' }, { status: 404 });
    }

    // Fetch weather and news in parallel for better performance
    const [weatherData, newsData] = await Promise.all([
      fetchWeatherData(countryData.capitalInfo.latlng),
      fetchNewsData(countryData.name.common),
    ]);

    // Transform to unified response format
    // TypeScript now knows capital[0] exists due to validation above
    const response: CountryPulseResponse = {
      country: {
        name: countryData.name.common,
        capital: countryData.capital[0],
        population: countryData.population,
        region: countryData.region,
        flag: countryData.flags.svg,
        coordinates: {
          lat: countryData.capitalInfo.latlng[0],
          lng: countryData.capitalInfo.latlng[1],
        },
      },
      weather: {
        temperature: weatherData.current_weather.temperature,
        conditions: getWeatherCondition(weatherData.current_weather.weathercode),
        forecast: weatherData.daily.time.slice(0, 3).map((date, index) => ({
          date,
          tempMax: weatherData.daily.temperature_2m_max[index] ?? 0,
          tempMin: weatherData.daily.temperature_2m_min[index] ?? 0,
        })),
      },
      news: newsData.results.slice(0, 5).map((article) => ({
        title: article.title,
        url: article.link,
        source: article.source_name,
        publishedAt: article.pubDate,
      })),
    };

    // Cache the response
    setCache(cacheKey, response);

    // Return response with cache miss header
    return NextResponse.json(response, {
      headers: { 'X-Cache': 'MISS' },
    });
  } catch (error) {
    // Get params safely for error logging
    const resolvedParameters = await params;

    // Log detailed error server-side (for debugging)
    console.error('API Error:', {
      country: resolvedParameters.name,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    });

    // Return generic error message to client (security best practice)
    const errorMessage =
      error instanceof Error && error.message.includes('not found') ? 'Country not found' : 'Failed to fetch country data';

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
