'use client';

import { Line, LineChart, CartesianGrid, XAxis } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import type { WeatherData } from '@/app/lib/types';

interface TemperatureChartProperties {
  weather: WeatherData;
}

export function TemperatureChart({ weather }: TemperatureChartProperties) {
  // Transform forecast data for the chart
  const chartData = weather.forecast.map((day) => {
    const date = new Date(day.date);
    return {
      date: date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }),
      max: day.tempMax,
      min: day.tempMin,
    };
  });

  const chartConfig = {
    max: {
      label: 'Max Temp',
      color: 'var(--chart-2)', // red for max temp
    },
    min: {
      label: 'Min Temp',
      color: 'var(--chart-1)', // blue for min temp
    },
  } satisfies ChartConfig;

  return (
    <ChartContainer config={chartConfig} className="h-[200px] w-full">
      <LineChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="date"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Line
          dataKey="max"
          type="monotone"
          stroke="var(--color-max)"
          strokeWidth={2}
          dot={false}
        />
        <Line
          dataKey="min"
          type="monotone"
          stroke="var(--color-min)"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ChartContainer>
  );
}
