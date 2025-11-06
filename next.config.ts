import type { NextConfig } from "next";

// CSP for development (allows Next.js dev tools)
const cspHeaderDev = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline';
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data: https:;
    font-src 'self' data:;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
`;

// CSP for production (strict security)
const cspHeaderProd = `
    default-src 'self';
    script-src 'self';
    style-src 'self';
    img-src 'self' blob: data: https:;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
`;

const nextConfig: NextConfig = {
  async headers() {
    // Use relaxed CSP in development, strict in production
    const cspHeader = process.env.NODE_ENV === 'production' ? cspHeaderProd : cspHeaderDev;

    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: cspHeader.replace(/\n/g, ''),
          },
        ],
      },
    ]
  },
};

export default nextConfig;
