'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { CountryPulseResponse } from '@/app/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TemperatureChart } from './components/temperature-chart';

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
    enabled: !!selectedCountry, // Only run query if country is selected
  });

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Global Pulse Dashboard</h1>
          <p className="text-gray-600">Explore countries with real-time weather and news</p>
        </div>

        {/* Search Section */}
        <div className="flex justify-center mb-12">
          <div className="w-full max-w-md">
            <input
              type="text"
              placeholder="Type a country name and press Enter..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  const value = event.currentTarget.value.trim();
                  if (value) {
                    setSelectedCountry(value);
                  }
                }
              }}
            />
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8 max-w-2xl mx-auto">
            <p className="text-red-800 text-sm">Failed to load country data. Please try again or select a different country.</p>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading country data...</p>
          </div>
        )}

        {/* Empty State */}
        {!selectedCountry && !isLoading && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🌍</div>
            <p className="text-gray-500 text-lg">Select a country to view its information</p>
          </div>
        )}

        {/* Data Display with shadcn Cards */}
        {data && !isLoading && (
          <div className="space-y-6">
            {/* Country Info Card */}
            <Card>
              <CardHeader>
                <div className="flex items-start gap-4">
                  <img
                    src={data.country.flag}
                    alt={`Flag of ${data.country.name}`}
                    className="w-20 h-14 object-cover rounded border border-gray-200"
                  />
                  <div className="flex-1">
                    <CardTitle className="text-2xl">{data.country.name}</CardTitle>
                    <CardDescription>
                      {data.country.region} • {data.country.capital}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-600">Capital:</span>{' '}
                    <span className="text-gray-900">{data.country.capital}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Region:</span> <span className="text-gray-900">{data.country.region}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Population:</span>{' '}
                    <span className="text-gray-900">{new Intl.NumberFormat('en-US').format(data.country.population)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Weather & Chart Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Weather Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Weather in {data.country.capital}</CardTitle>
                  <CardDescription>Current conditions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-4xl font-bold text-gray-900">{data.weather.temperature.toFixed(1)}°C</div>
                    <div className="text-sm text-gray-600">{data.weather.conditions}</div>
                  </div>
                </CardContent>
              </Card>

              {/* Chart Card */}
              <Card>
                <CardHeader>
                  <CardTitle>3-Day Forecast</CardTitle>
                  <CardDescription>Temperature trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <TemperatureChart weather={data.weather} />
                </CardContent>
              </Card>
            </div>

            {/* News Card */}
            <Card>
              <CardHeader>
                <CardTitle>Latest News</CardTitle>
                <CardDescription>Recent headlines from {data.country.name}</CardDescription>
              </CardHeader>
              <CardContent>
                {data.news.length === 0 ? (
                  <p className="text-gray-500 text-sm">No recent news articles found.</p>
                ) : (
                  <div className="space-y-4">
                    {data.news.map((article, index) => (
                      <article key={index} className="border-b last:border-b-0 pb-4 last:pb-0">
                        <a href={article.url} target="_blank" rel="noopener noreferrer" className="block group">
                          <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors mb-1">{article.title}</h4>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span className="font-medium">{article.source}</span>
                          </div>
                        </a>
                      </article>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </main>
  );
}
