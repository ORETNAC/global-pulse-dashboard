# Global Pulse Dashboard

A full-stack dashboard application that displays comprehensive country information including weather data and news headlines. Built with Next.js, TypeScript, and shadcn/ui.

**Live Demo:** [https://global-pulse-dashboard-three.vercel.app](https://global-pulse-dashboard-three.vercel.app)

## Features

- 🔍 **Smart Country Search** - Autocomplete with 240+ countries, keyboard navigation, and flag previews
- 🌍 **Country Information** - Population, capital, region with flag display
- ☀️ **Real-time Weather** - Current conditions and 3-day forecast for capital cities
- 📰 **Latest News** - Recent headlines from NewsData.io
- 📊 **Temperature Charts** - Visual 3-day forecast using Recharts
- ⚡ **Fast Performance** - Two-layer caching (backend + frontend)
- 🔒 **Security First** - Input validation, CSP headers, server-side API calls only

## Tech Stack

**Frontend:**

- Next.js 16 (App Router)
- React 19
- TypeScript (strict mode)
- TanStack Query (React Query) for data fetching
- shadcn/ui components
- Recharts for data visualization
- Tailwind CSS v4

**Backend:**

- Next.js API Routes
- In-memory caching with TTL

**APIs:**

- [REST Countries API](https://restcountries.com) - Country metadata
- [Open-Meteo API](https://api.open-meteo.com) - Weather data
- [NewsData.io API](https://newsdata.io) - News headlines (requires API key)

**Development Tools:**

- ESLint (Next.js + Unicorn rules)
- Prettier
- Husky + lint-staged (pre-commit hooks)

## Architecture

### Data Flow

```
Client Components
  ↓ (TanStack Query)
Next.js API Routes (/api/*)
  ↓ (fetch + cache)
External APIs
  ↓
Response with 15-min cache
```

### Component Structure

```
app/
├── api/
│   ├── countries/route.ts       # List all countries
│   └── country/[name]/route.ts  # Unified country data
├── components/
│   ├── country-search.tsx       # Autocomplete search
│   ├── country-card.tsx         # Country info display
│   ├── weather-card.tsx         # Current weather
│   ├── temperature-chart.tsx    # 3-day forecast chart
│   ├── news-list.tsx            # News headlines
│   ├── loading-state.tsx        # Loading UI
│   ├── error-state.tsx          # Error UI
│   └── empty-state.tsx          # Empty state UI
├── lib/
│   ├── types.ts                 # TypeScript definitions
│   ├── cache.ts                 # In-memory cache
│   └── api-clients.ts           # External API clients
├── page.tsx                     # Main dashboard (container)
├── layout.tsx                   # Root layout
└── providers.tsx                # TanStack Query provider
```

## Getting Started

### Prerequisites

- Node.js 20+
- npm, yarn, pnpm, or bun
- NewsData.io API key (free tier)

### Installation

1. **Clone the repository**

   ```bash
   git clone git@github.com:ORETNAC/global-pulse-dashboard.git
   cd global-pulse-dashboard
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` and add your NewsData.io API key:

   ```
   NEWSDATA_API_KEY=your_actual_key_here
   ```

   Get a free API key at [https://newsdata.io](https://newsdata.io)

4. **Run the development server**

   ```bash
   npm run dev
   ```

5. **Open the app**

   Navigate to [http://localhost:3000](http://localhost:3000)

### Building for Production

```bash
npm run build
npm run start
```

## API Endpoints

### `GET /api/countries`

Returns a simplified list of all countries.

**Response:**

```json
[
  {
    "name": "Japan",
    "code": "JP",
    "flag": "https://flagcdn.com/jp.svg"
  }
]
```

### `GET /api/country/:name`

Returns unified country data including weather and news.

**Parameters:**

- `name` - Country name (e.g., "Japan", "Brazil", "France")

**Response:**

```json
{
  "country": {
    "name": "Japan",
    "capital": "Tokyo",
    "population": 123210000,
    "region": "Asia",
    "flag": "https://flagcdn.com/jp.svg",
    "coordinates": { "lat": 35.68, "lng": 139.75 }
  },
  "weather": {
    "temperature": 20.4,
    "conditions": "Clear sky",
    "forecast": [{ "date": "2025-11-07", "tempMax": 22.1, "tempMin": 14.2 }]
  },
  "news": [
    {
      "title": "Article title",
      "url": "https://...",
      "source": "News Source",
      "publishedAt": "2025-11-06 08:15:00"
    }
  ]
}
```

## Design Decisions

### Two-Layer Caching Strategy

**Backend Cache:**

- In-memory Map with 15-minute TTL
- Reduces external API calls
- Returns `X-Cache: HIT/MISS` headers

**Frontend Cache:**

- TanStack Query with 1-minute stale time
- Automatic background refetching
- Built-in loading/error states

**Why?**

- Respects API rate limits (NewsData.io: 200 req/day)
- Improves performance
- Better user experience

### Security Approach

**Input Validation:**

- Max length checks (100 characters)
- Character allowlist (letters, spaces, hyphens)
- Sanitization before API calls

**API Key Management:**

- Server-side only (no `NEXT_PUBLIC_` prefix)
- All external API calls through backend routes
- Generic error messages to clients

**CSP Headers:**

- Configured in `next.config.ts`
- Restricts resource loading
- Different policies for dev/prod

### Component Architecture

**Container/Presentational Pattern:**

- `page.tsx` = Container (manages state, fetches data)
- All other components = Presentational (receive props)
- Easy to test and reuse

**Why shadcn/ui?**

- Built on Tailwind (no style conflicts)
- Copy-paste components (no runtime overhead)
- Recharts integration for charts

Required in production:

- `NEWSDATA_API_KEY` - NewsData.io API key

## Development Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run start      # Run production build
npm run lint       # Check code quality
npm run lint:fix   # Fix linting issues
npm run prettier   # Format code
```

## License

MIT

## Acknowledgments

- Built as part of a full-stack developer assessment
- APIs: REST Countries, Open-Meteo, NewsData.io
- UI Components: shadcn/ui
- Framework: Next.js
