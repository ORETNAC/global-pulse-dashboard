'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { NewsArticle } from '@/app/lib/types';

interface NewsListProperties {
  news: NewsArticle[];
  countryName: string;
}

export function NewsList({ news, countryName }: NewsListProperties) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Latest News</CardTitle>
        <CardDescription>Recent headlines from {countryName}</CardDescription>
      </CardHeader>
      <CardContent>
        {news.length === 0 ? (
          <p className="text-gray-500 text-sm">No recent news articles found.</p>
        ) : (
          <div className="space-y-4">
            {news.map((article, index) => (
              <article key={index} className="border-b last:border-b-0 pb-4 last:pb-0">
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group"
                >
                  <h4 className="font-medium text-gray-900 group-hover:text-emerald-600 transition-colors mb-1">
                    {article.title}
                  </h4>
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
  );
}
