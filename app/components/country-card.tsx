'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { CountryData } from '@/app/lib/types';

interface CountryCardProperties {
  country: CountryData;
}

export function CountryCard({ country }: CountryCardProperties) {
  const formattedPopulation = new Intl.NumberFormat('en-US').format(country.population);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start gap-4">
          <img
            src={country.flag}
            alt={`Flag of ${country.name}`}
            className="w-20 h-14 object-cover rounded border border-gray-200"
          />
          <div className="flex-1">
            <CardTitle className="text-2xl">{country.name}</CardTitle>
            <CardDescription>
              {country.region} • {country.capital}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-600">Capital:</span>{' '}
            <span className="text-gray-900">{country.capital}</span>
          </div>
          <div>
            <span className="font-medium text-gray-600">Region:</span>{' '}
            <span className="text-gray-900">{country.region}</span>
          </div>
          <div>
            <span className="font-medium text-gray-600">Population:</span>{' '}
            <span className="text-gray-900">{formattedPopulation}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
