// External API response types

export interface RestCountryResponse {
  name: {
    common: string;
    official: string;
  };
  capital: string[];
  population: number;
  region: string;
  subregion: string;
  latlng: [number, number];
  capitalInfo: {
    latlng: [number, number];
  };
  flags: {
    svg: string;
    png: string;
  };
}

export interface OpenMeteoResponse {
  latitude: number;
  longitude: number;
  current_weather: {
    temperature: number;
    windspeed: number;
    weathercode: number;
    time: string;
  };
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
  };
}

export interface NewsDataResponse {
  status: string;
  totalResults: number;
  results: Array<{
    title: string;
    link: string;
    source_name: string;
    pubDate: string;
    description: string;
  }>;
}

// Application types

export interface CountryData {
  name: string;
  capital: string;
  population: number;
  region: string;
  flag: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface WeatherData {
  temperature: number;
  conditions: string;
  forecast: Array<{
    date: string;
    tempMax: number;
    tempMin: number;
  }>;
}

export interface NewsArticle {
  title: string;
  url: string;
  source: string;
  publishedAt: string;
}

export interface CountryPulseResponse {
  country: CountryData;
  weather: WeatherData;
  news: NewsArticle[];
}

// Cache types

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
}
