"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle, Newspaper, BarChart2, TrendingUp, DollarSign, Briefcase, FileText, Globe } from "lucide-react"
import Link from "next/link"
import { loadCacheFromStorage, getCachedNewsForPage, isCacheValid } from "@/lib/news-cache"

// Category icons mapping
const CATEGORY_ICONS: Record<string, any> = {
  "market-updates": BarChart2,
  economic: TrendingUp,
  "fii-dii": DollarSign,
  corporate: Briefcase,
  policy: FileText,
  global: Globe,
}

// Local storage key for caching
const CACHE_KEY = "global_news_latest"
const CACHE_EXPIRY = 60 * 60 * 1000 // 1 hour in milliseconds

export default function GlobalNewsPreview() {
  const [latestNews, setLatestNews] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [fromCache, setFromCache] = useState(false)

  useEffect(() => {
    const fetchLatestNewsItem = async () => {
      try {
        // First, try to use the optimized global cache
        loadCacheFromStorage()

        if (isCacheValid()) {
          const cachedNews = getCachedNewsForPage(1)
          if (cachedNews && cachedNews.length > 0) {
            setLatestNews(cachedNews[0])
            setLastUpdated(new Date())
            setFromCache(false) // Hide cache status from user
            setLoading(false)
            return
          }
        }

        // Check local storage cache as fallback
        const cachedData = localStorage.getItem(CACHE_KEY)
        if (cachedData) {
          const { data, timestamp } = JSON.parse(cachedData)
          const cacheAge = Date.now() - timestamp

          // Use cached data if it's less than the expiry time
          if (cacheAge < CACHE_EXPIRY && data) {
            setLatestNews(data)
            setLastUpdated(new Date(timestamp))
            setFromCache(false) // Hide cache status from user
            setLoading(false)

            // Silently refresh in background if cache is older than 15 minutes
            if (cacheAge > 15 * 60 * 1000) {
              fetchFreshDataInBackground()
            }
            return
          }
        }

        // If no valid cache, fetch just one item
        const response = await fetch("/api/global-news?page=1&limit=1")

        if (!response.ok) {
          throw new Error(`Error fetching news: ${response.status}`)
        }

        const data = await response.json()

        if (data.error && !data.news) {
          throw new Error(data.error)
        }

        // Store the latest news item
        const newsItem = data.news && data.news.length > 0 ? data.news[0] : null

        // If no news item is available, create a fallback
        if (!newsItem) {
          const fallbackItem = {
            id: "fallback-latest",
            headline: "Global Market Update",
            summary: "Market data is currently being refreshed. Check back soon for the latest global market insights.",
            datetime: Math.floor(Date.now() / 1000),
            source: "TradeWizard",
            url: "#",
            category: "global",
            isFallback: true,
          }

          setLatestNews(fallbackItem)
          setLastUpdated(new Date())
        } else {
          setLatestNews(newsItem)
          setLastUpdated(new Date(data.lastUpdated))
          setFromCache(false)
        }

        // Cache the result
        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({
            data: newsItem || {
              id: "fallback-latest",
              headline: "Global Market Update",
              summary:
                "Market data is currently being refreshed. Check back soon for the latest global market insights.",
              datetime: Math.floor(Date.now() / 1000),
              source: "TradeWizard",
              url: "#",
              category: "global",
              isFallback: true,
            },
            timestamp: Date.now(),
          }),
        )
      } catch (err) {
        console.error("Error fetching latest news:", err)
        setError("Failed to load latest news")

        // Create fallback item on error
        const fallbackItem = {
          id: "fallback-latest",
          headline: "Global Market Update",
          summary: "Market data is currently being refreshed. Check back soon for the latest global market insights.",
          datetime: Math.floor(Date.now() / 1000),
          source: "TradeWizard",
          url: "#",
          category: "global",
          isFallback: true,
        }

        setLatestNews(fallbackItem)
        setLastUpdated(new Date())
      } finally {
        setLoading(false)
      }
    }

    // Add a function to fetch fresh data in the background without UI updates
    const fetchFreshDataInBackground = async () => {
      try {
        const response = await fetch("/api/global-news?page=1&limit=1")
        if (!response.ok) return

        const data = await response.json()
        if (data.error || !data.news || !data.news.length) return

        // Silently update cache without changing UI
        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({
            data: data.news[0],
            timestamp: Date.now(),
          }),
        )
      } catch (err) {
        console.error("Background fetch error:", err)
      }
    }

    fetchLatestNewsItem()
  }, [])

  // Format timestamp to readable date
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000)
    return date.toLocaleDateString("en-IN", {
      month: "short",
      day: "numeric",
    })
  }

  // Get category badge color
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "market-updates":
        return "bg-blue-500/10 text-blue-500 border-blue-500"
      case "economic":
        return "bg-green-500/10 text-green-500 border-green-500"
      case "fii-dii":
        return "bg-purple-500/10 text-purple-500 border-purple-500"
      case "corporate":
        return "bg-orange-500/10 text-orange-500 border-orange-500"
      case "policy":
        return "bg-red-500/10 text-red-500 border-red-500"
      case "global":
        return "bg-indigo-500/10 text-indigo-500 border-indigo-500"
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500"
    }
  }

  // Get category display name
  const getCategoryName = (categoryId: string) => {
    switch (categoryId) {
      case "market-updates":
        return "Market Updates"
      case "economic":
        return "Economic News"
      case "fii-dii":
        return "FII/DII Activity"
      case "corporate":
        return "Corporate News"
      case "policy":
        return "Policy Updates"
      case "global":
        return "Global Markets"
      default:
        return "General"
    }
  }

  // Get category icon
  const getCategoryIcon = (category: string) => {
    return CATEGORY_ICONS[category] || Newspaper
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Globe className="h-4 w-4" />
          Global Market News
        </CardTitle>
        <Link href="/global-news">
          <Button variant="ghost" size="sm">
            View All
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            <div className="border-b pb-3">
              <Skeleton className="h-5 w-full mb-2" />
              <div className="flex justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-4 text-gray-500">
            <AlertCircle className="h-4 w-4 mr-2" />
            {error}
          </div>
        ) : latestNews ? (
          <div className="space-y-4">
            <div className="border-b pb-3">
              <div className="flex flex-row justify-between items-start gap-2 mb-1">
                {latestNews.isFallback ? (
                  <span className="font-medium line-clamp-2 flex-1">
                    {latestNews.headline}
                    <span className="text-xs font-normal text-muted-foreground ml-2">
                      {latestNews.isHistorical ? "(Archived)" : "(Placeholder)"}
                    </span>
                  </span>
                ) : (
                  <a
                    href={latestNews.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium hover:text-blue-600 transition-colors line-clamp-2 flex-1"
                  >
                    {latestNews.headline}
                  </a>
                )}
                <Badge
                  variant="outline"
                  className={`${getCategoryColor(latestNews.category)} flex items-center gap-1 text-xs whitespace-nowrap ml-2 shrink-0`}
                >
                  {(() => {
                    const CategoryIcon = getCategoryIcon(latestNews.category)
                    return <CategoryIcon className="h-3 w-3" />
                  })()}
                  {getCategoryName(latestNews.category)}
                </Badge>
              </div>
              <div className="flex justify-between items-center mt-1 text-sm text-gray-500">
                <span>{latestNews.source}</span>
                <span>{formatDate(latestNews.datetime)}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-gray-500">No global news available</p>
          </div>
        )}

        {lastUpdated && !loading && !error && (
          <div className="text-xs text-gray-400 mt-4 text-right">Updated: {lastUpdated.toLocaleTimeString()}</div>
        )}
      </CardContent>
    </Card>
  )
}
