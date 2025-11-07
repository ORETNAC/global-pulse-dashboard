import { NextResponse } from 'next/server';
import { getCached, setCache } from '@/app/lib/cache';

interface CountryListItem {
  name: string;
  code: string;
  flag: string;
}

/**
 * GET /api/countries
 * Returns a simplified list of all countries for autocomplete
 */
export async function GET() {
  try {
    // Check cache first (cache for 1 day - countries don't change often)
    const cacheKey = 'countries:all';
    const cached = getCached<CountryListItem[]>(cacheKey);

    if (cached) {
      return NextResponse.json(cached, {
        headers: { 'X-Cache': 'HIT' },
      });
    }

    // Fetch from REST Countries API with only needed fields
    const response = await fetch(
      'https://restcountries.com/v3.1/all?fields=name,cca2,flags',
      { next: { revalidate: 86_400 } } // Cache for 24 hours
    );

    if (!response.ok) {
      throw new Error('Failed to fetch countries list');
    }

    const data = await response.json();

    // Transform to simplified format
    const countries: CountryListItem[] = data
      .map((country: { name: { common: string }; cca2: string; flags: { svg: string } }) => ({
        name: country.name.common,
        code: country.cca2,
        flag: country.flags.svg,
      }))
      .toSorted((a: CountryListItem, b: CountryListItem) => a.name.localeCompare(b.name));

    // Cache for 24 hours (countries list doesn't change often)
    setCache(cacheKey, countries);

    return NextResponse.json(countries, {
      headers: { 'X-Cache': 'MISS' },
    });
  } catch (error) {
    console.error('Countries API Error:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      { error: 'Failed to fetch countries list' },
      { status: 500 }
    );
  }
}
