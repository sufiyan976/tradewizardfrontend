"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle, Newspaper, BarChart2, TrendingUp, DollarSign, Briefcase, FileText } from "lucide-react"
import type { NewsItem } from "@/types/news"
import Link from "next/link"

// Add the GlobalNewsPreview component to the imports
import GlobalNewsPreview from "@/components/global-news-preview"

// Category icons mapping
const CATEGORY_ICONS: Record<string, any> = {
  "market-updates": BarChart2,
  economic: TrendingUp,
  "fii-dii": DollarSign,
  corporate: Briefcase,
  policy: FileText,
}

// Replace the existing NewsWidget component with this updated version
export default function NewsWidget() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  // Local cache for news data
  const newsCache = useRef<{
    data: NewsItem[] | null
    timestamp: number
  }>({
    data: null,
    timestamp: 0,
  })

  // Add a state to track screen size
  const [isLargeScreen, setIsLargeScreen] = useState(false)

  useEffect(() => {
    const fetchLatestNews = async () => {
      try {
        // Check if we have recent cached data (less than 15 minutes old)
        const currentTime = Date.now()
        const cacheAge = currentTime - newsCache.current.timestamp

        if (newsCache.current.data && cacheAge < 15 * 60 * 1000) {
          // Use cached data
          setNews(newsCache.current.data)
          setLastUpdated(new Date(newsCache.current.timestamp))
          setLoading(false)
          return
        }

        const response = await fetch("/api/news?page=1")

        if (!response.ok) {
          throw new Error(`Error fetching news: ${response.status}`)
        }

        const data = await response.json()

        if (data.error && !data.news) {
          throw new Error(data.error)
        }

        // Store all news items, we'll slice them based on screen size when rendering
        const newsData = data.news

        // Update state and cache
        setNews(newsData)
        setLastUpdated(new Date(data.lastUpdated))

        // Update cache
        newsCache.current = {
          data: newsData,
          timestamp: currentTime,
        }
      } catch (err) {
        console.error("Error fetching news:", err)

        // If we have cached data, use it even if there's an error
        if (newsCache.current.data) {
          setNews(newsCache.current.data)
          setLastUpdated(new Date(newsCache.current.timestamp))
        } else {
          setError("Failed to load news")
        }
      } finally {
        setLoading(false)
      }
    }

    // Initial fetch
    fetchLatestNews()
  }, [])

  // Add a useEffect to detect screen size changes
  useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 1024) // 1024px is the lg breakpoint in Tailwind
    }

    // Initial check
    checkScreenSize()

    // Add event listener for window resize
    window.addEventListener("resize", checkScreenSize)

    // Cleanup
    return () => window.removeEventListener("resize", checkScreenSize)
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
      default:
        return "General"
    }
  }

  // Get category icon
  const getCategoryIcon = (category: string) => {
    return CATEGORY_ICONS[category] || Newspaper
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Newspaper className="h-4 w-4" />
            Indian Market News
          </CardTitle>
          <Link href="/news">
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {Array(isLargeScreen ? 3 : 5)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="border-b pb-3 last:border-0 last:pb-0">
                    <Skeleton className="h-5 w-full mb-2" />
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  </div>
                ))}
            </div>
          ) : error && !news.length ? (
            <div className="flex items-center justify-center py-4 text-gray-500">
              <AlertCircle className="h-4 w-4 mr-2" />
              {error}
            </div>
          ) : (
            <div className="space-y-4">
              {news.slice(0, isLargeScreen ? 3 : 5).map((item) => {
                const CategoryIcon = getCategoryIcon(item.category)
                return (
                  <div key={item.id} className="border-b pb-3 last:border-0 last:pb-0">
                    <div className="flex justify-between items-start gap-2 mb-1">
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium hover:text-blue-600 transition-colors line-clamp-2"
                      >
                        {item.headline}
                      </a>
                      <Badge
                        variant="outline"
                        className={`${getCategoryColor(item.category)} flex items-center gap-1 text-xs whitespace-nowrap`}
                      >
                        <CategoryIcon className="h-3 w-3" />
                        {getCategoryName(item.category)}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center mt-1 text-sm text-gray-500">
                      <span>{item.source}</span>
                      <span>{formatDate(item.datetime)}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {lastUpdated && !loading && !error && (
            <div className="text-xs text-gray-400 mt-4 text-right">Updated: {lastUpdated.toLocaleTimeString()}</div>
          )}
        </CardContent>
      </Card>

      {/* Add the GlobalNewsPreview component */}
      <div className="w-full">
        <GlobalNewsPreview />
      </div>
    </div>
  )
}
