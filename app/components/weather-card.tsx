'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { WeatherData } from '@/app/lib/types';

interface WeatherCardProperties {
  weather: WeatherData;
  capitalName: string;
}

export function WeatherCard({ weather, capitalName }: WeatherCardProperties) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Weather in {capitalName}</CardTitle>
        <CardDescription>Current conditions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="text-4xl font-bold text-gray-900">
            {weather.temperature.toFixed(1)}°C
          </div>
          <div className="text-sm text-gray-600">{weather.conditions}</div>
        </div>
      </CardContent>
    </Card>
  );
}
