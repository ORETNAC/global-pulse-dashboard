'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { CountryPulseResponse } from '@/app/lib/types';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { CountrySearch } from './components/country-search';
import { CountryCard } from './components/country-card';
import { WeatherCard } from './components/weather-card';
import { TemperatureChart } from './components/temperature-chart';
import { NewsList } from './components/news-list';
import { LoadingState } from './components/loading-state';
import { ErrorState } from './components/error-state';
import { EmptyState } from './components/empty-state';

export default function Home() {
  const [selectedCountry, setSelectedCountry] = useState<string | undefined>();

  // Fetch country data using TanStack Query
  const { data, isLoading, error } = useQuery<CountryPulseResponse>({
    queryKey: ['country', selectedCountry],
    queryFn: async () => {
      if (!selectedCountry) return;

      const response = await fetch(`/api/country/${selectedCountry}`);

      if (!response.ok) {
        throw new Error('Failed to fetch country data');
      }

      return response.json();
    },
    enabled: !!selectedCountry,
  });

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Global Pulse Dashboard</h1>
          <p className="text-gray-600">Explore countries with real-time weather and news</p>
        </div>

        {/* Search */}
        <div className="flex justify-center mb-12">
          <CountrySearch onSelect={setSelectedCountry} />
        </div>

        {/* States */}
        {error && <ErrorState />}
        {isLoading && <LoadingState />}
        {!selectedCountry && !isLoading && <EmptyState />}

        {/* Data Display */}
        {data && !isLoading && (
          <div className="space-y-6">
            {/* Country Info */}
            <CountryCard country={data.country} />

            {/* Weather & Chart Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              <WeatherCard weather={data.weather} capitalName={data.country.capital} />

              <Card>
                <CardHeader>
                  <CardTitle>3-Day Forecast</CardTitle>
                </CardHeader>
                <TemperatureChart weather={data.weather} />
              </Card>
            </div>

            {/* News */}
            <NewsList news={data.news} countryName={data.country.name} />
          </div>
        )}
      </div>
    </main>
  );
}
