"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  AlertCircle,
  ExternalLink,
  BarChart2,
  TrendingUp,
  DollarSign,
  Briefcase,
  FileText,
  Newspaper,
} from "lucide-react"
import type { NewsItem } from "@/types/news"

// Category icons mapping
const CATEGORY_ICONS: Record<string, any> = {
  "market-updates": BarChart2,
  economic: TrendingUp,
  "fii-dii": DollarSign,
  corporate: Briefcase,
  policy: FileText,
}

export default function MarketBeatsNews() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  useEffect(() => {
    const fetchMarketBeatsNews = async () => {
      try {
        const response = await fetch("/api/news?section=market-beats")

        if (!response.ok) {
          throw new Error(`Error fetching news: ${response.status}`)
        }

        const data = await response.json()

        if (data.error && !data.news) {
          throw new Error(data.error)
        }

        setNews(data.news)
        setLastUpdated(new Date(data.lastUpdated))
      } catch (err) {
        console.error("Error fetching market beats news:", err)
        setError("Failed to load market news")
      } finally {
        setLoading(false)
      }
    }

    fetchMarketBeatsNews()

    // Refresh every 15 minutes
    const intervalId = setInterval(fetchMarketBeatsNews, 15 * 60 * 1000)

    return () => clearInterval(intervalId)
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Newspaper className="h-5 w-5" />
          Market News & Events
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="border-b border-gray-200 dark:border-gray-800 pb-4 last:border-0 last:pb-0">
                  <Skeleton className="h-5 w-full mb-2" />
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </div>
              ))}
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-4 text-gray-500">
            <AlertCircle className="h-4 w-4 mr-2" />
            {error}
          </div>
        ) : (
          <div className="space-y-4">
            {news.map((item) => {
              const CategoryIcon = getCategoryIcon(item.category)
              return (
                <div
                  key={item.id}
                  className="border-b border-gray-200 dark:border-gray-800 pb-4 last:border-0 last:pb-0"
                >
                  <h3 className="font-medium mb-1 hover:text-blue-600 transition-colors">
                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="flex items-start gap-2">
                      <span>{item.headline}</span>
                      <ExternalLink className="h-3.5 w-3.5 flex-shrink-0 mt-1" />
                    </a>
                  </h3>
                  <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                    <span>{formatDate(item.datetime)}</span>
                    <Badge
                      variant="outline"
                      className={`${getCategoryColor(item.category)} flex items-center gap-1 text-xs`}
                    >
                      <CategoryIcon className="h-3 w-3" />
                      {getCategoryName(item.category)}
                    </Badge>
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
  )
}
