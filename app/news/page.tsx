"use client"

import type React from "react"

import { useState, useEffect, useCallback, useRef } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  CalendarIcon,
  Clock,
  ExternalLink,
  AlertCircle,
  Search,
  ChevronLeft,
  ChevronRight,
  RefreshCcw,
  Newspaper,
  BarChart2,
  TrendingUp,
  DollarSign,
  Briefcase,
  FileText,
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

export default function IndianMarketNewsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Get query parameters with defaults
  const page = Number.parseInt(searchParams.get("page") || "1")

  // State for news data
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalPages, setTotalPages] = useState(4)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [fromCache, setFromCache] = useState(false)

  // State for filters
  const [searchQuery, setSearchQuery] = useState("")

  // WebSocket connection
  const wsRef = useRef<WebSocket | null>(null)
  const [wsConnected, setWsConnected] = useState(false)
  const [newNewsCount, setNewNewsCount] = useState(0)
  const [wsNewsData, setWsNewsData] = useState<NewsItem[]>([])

  // Polling interval reference
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Function to update URL with current filters
  const updateUrlParams = useCallback(
    (params: Record<string, string | number | null>) => {
      const newParams = new URLSearchParams(searchParams.toString())

      Object.entries(params).forEach(([key, value]) => {
        if (value === null) {
          newParams.delete(key)
        } else {
          newParams.set(key, String(value))
        }
      })

      router.push(`/news?${newParams.toString()}`)
    },
    [router, searchParams],
  )

  // Initialize WebSocket connection
  const initWebSocket = useCallback(async () => {
    try {
      // Get WebSocket connection details from API
      const response = await fetch("/api/news/websocket")
      if (!response.ok) {
        throw new Error("Failed to get WebSocket connection details")
      }

      const { wsUrl, message, symbols } = await response.json()

      // Close existing connection if any
      if (wsRef.current) {
        wsRef.current.close()
      }

      // Create new WebSocket connection
      const ws = new WebSocket(wsUrl)

      ws.onopen = () => {
        console.log("WebSocket connected")
        setWsConnected(true)

        // Subscribe to news for each symbol
        ws.send(JSON.stringify(message))

        // Subscribe to additional symbols
        if (symbols && Array.isArray(symbols)) {
          symbols.forEach((symbol) => {
            ws.send(
              JSON.stringify({
                type: "subscribe",
                symbol: symbol,
              }),
            )
          })
        }
      }

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data)

        // Handle news data
        if (data.type === "news") {
          // Process and categorize the news
          const processedNews = processWebSocketNews(data)

          if (processedNews) {
            // Update WebSocket news data
            setWsNewsData((prev) => {
              const newData = [processedNews, ...prev]

              // Store in API cache
              storeWebSocketData(newData)

              return newData
            })

            setNewNewsCount((prev) => prev + 1)
          }
        }
      }

      ws.onerror = (error) => {
        console.error("WebSocket error:", error)
        setWsConnected(false)
        // Fall back to polling
        startPolling()
      }

      ws.onclose = () => {
        console.log("WebSocket disconnected")
        setWsConnected(false)
        // Fall back to polling
        startPolling()
      }

      wsRef.current = ws
    } catch (error) {
      console.error("Error initializing WebSocket:", error)
      // Fall back to polling
      startPolling()
    }
  }, [])

  // Process WebSocket news data
  const processWebSocketNews = (data: any): NewsItem | null => {
    if (!data || !data.news) return null

    const newsItem = data.news

    // Check if it's related to Indian markets
    const indianKeywords = [
      "India",
      "Indian",
      "NSE",
      "BSE",
      "Sensex",
      "Nifty",
      "RBI",
      "Reserve Bank of India",
      "Mumbai",
      "Rupee",
      "INR",
      "SEBI",
      "FII",
      "DII",
      "Reliance",
      "TCS",
      "HDFC",
      "ICICI",
      "Infosys",
      "Adani",
      "Tata",
      "Bharti",
      "Bajaj",
      "Mahindra",
      "Maruti",
      "Wipro",
    ]

    const isIndianNews = indianKeywords.some(
      (keyword) =>
        (newsItem.headline?.toLowerCase() || "").includes(keyword.toLowerCase()) ||
        (newsItem.summary?.toLowerCase() || "").includes(keyword.toLowerCase()),
    )

    if (!isIndianNews) return null

    // Categorize the news
    const categoryKeywords: Record<string, string[]> = {
      "market-updates": [
        "market",
        "sensex",
        "nifty",
        "stocks",
        "shares",
        "trading",
        "rally",
        "decline",
        "bull",
        "bear",
      ],
      economic: ["economy", "gdp", "inflation", "growth", "recession", "economic", "fiscal", "monetary"],
      "fii-dii": ["fii", "dii", "foreign", "institutional", "investors", "investment", "fund", "inflow", "outflow"],
      corporate: [
        "earnings",
        "profit",
        "revenue",
        "quarterly",
        "results",
        "company",
        "business",
        "corporate",
        "merger",
        "acquisition",
      ],
      policy: ["rbi", "sebi", "policy", "regulation", "government", "tax", "budget", "reform", "law", "rule"],
    }

    let category = "market-updates" // Default category

    for (const [cat, keywords] of Object.entries(categoryKeywords)) {
      if (
        keywords.some(
          (keyword) =>
            (newsItem.headline?.toLowerCase() || "").includes(keyword.toLowerCase()) ||
            (newsItem.summary?.toLowerCase() || "").includes(keyword.toLowerCase()),
        )
      ) {
        category = cat
        break
      }
    }

    return {
      ...newsItem,
      category,
      id: newsItem.id || Date.now(), // Ensure there's an ID
    }
  }

  // Store WebSocket data in API cache
  const storeWebSocketData = async (newsData: NewsItem[]) => {
    try {
      await fetch("/api/news", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newsData }),
      })
    } catch (error) {
      console.error("Error storing WebSocket data:", error)
    }
  }

  // Start polling for news updates
  const startPolling = useCallback(() => {
    // Clear existing interval if any
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current)
    }

    // Set up new polling interval (every 30 minutes)
    pollingIntervalRef.current = setInterval(
      () => {
        fetchNews(true)
      },
      30 * 60 * 1000,
    ) // 30 minutes
  }, [])

  // Fetch news data
  const fetchNews = useCallback(
    async (isRefresh = false) => {
      if (!isRefresh) {
        setLoading(true)
      }
      setError(null)

      try {
        // Construct query parameters
        const params = new URLSearchParams({
          page: page.toString(),
        })

        const response = await fetch(`/api/news?${params.toString()}`)

        if (!response.ok) {
          throw new Error(`Error fetching news: ${response.status}`)
        }

        const data = await response.json()

        if (data.error && !data.news) {
          throw new Error(data.error)
        }

        // Combine API news with WebSocket news if available
        let combinedNews = data.news

        if (wsNewsData.length > 0 && page === 1) {
          // Add WebSocket news to the first page only
          // Filter out duplicates by ID
          const existingIds = new Set(data.news.map((item: NewsItem) => item.id))
          const uniqueWsNews = wsNewsData.filter((item) => !existingIds.has(item.id))

          // Add the unique WebSocket news to the beginning
          combinedNews = [...uniqueWsNews.slice(0, 5), ...data.news].slice(0, data.pagination.pageSize)
        }

        setNews(combinedNews)
        setTotalPages(data.pagination.totalPages)
        setLastUpdated(new Date(data.lastUpdated))
        setFromCache(data.fromCache || false)
        setNewNewsCount(0)

        // If there's a non-critical error but we still have data
        if (data.error) {
          setError(data.error)
        }
      } catch (err: any) {
        console.error("Error fetching news:", err)

        // If we have WebSocket data and this is the first page, use it as fallback
        if (wsNewsData.length > 0 && page === 1) {
          setNews(wsNewsData.slice(0, 10))
          setTotalPages(Math.min(Math.ceil(wsNewsData.length / 10), 4))
          setLastUpdated(new Date())
          setFromCache(true)
        } else {
          setError(err.message || "Failed to load news. Please try again later.")
        }
      } finally {
        setLoading(false)
      }
    },
    [page, wsNewsData],
  )

  // Initialize data and WebSocket
  useEffect(() => {
    fetchNews()

    // Try to set up WebSocket connection
    initWebSocket()

    // Clean up on unmount
    return () => {
      // Close WebSocket connection
      if (wsRef.current) {
        wsRef.current.close()
      }

      // Clear polling interval
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current)
      }
    }
  }, [fetchNews, initWebSocket])

  // Fetch news when parameters change
  useEffect(() => {
    fetchNews()
  }, [page, fetchNews])

  // Handle page change
  const handlePageChange = (newPage: number) => {
    updateUrlParams({ page: newPage })
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Filter news client-side
  }

  // Filter news based on search query
  const filteredNews = news.filter((item) => {
    return searchQuery
      ? item.headline.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.summary.toLowerCase().includes(searchQuery.toLowerCase())
      : true
  })

  // Format timestamp to readable date
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000)
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Format timestamp to readable time
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp * 1000)
    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
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
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h1 className="text-3xl font-bold">Indian Market News</h1>
        <div className="text-sm text-gray-500 dark:text-gray-400 mt-2 md:mt-0 flex items-center">
          <Clock className="h-4 w-4 mr-1" />
          {lastUpdated ? <>Last updated: {lastUpdated.toLocaleString()}</> : <>Fetching latest news...</>}
          <Button variant="ghost" size="sm" className="ml-2" onClick={() => fetchNews(true)} disabled={loading}>
            <RefreshCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* New News Alert */}
      {newNewsCount > 0 && (
        <Alert className="mb-6 bg-blue-50 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 border-blue-200 dark:border-blue-800">
          <Newspaper className="h-4 w-4" />
          <AlertTitle>New Updates Available</AlertTitle>
          <AlertDescription className="flex justify-between items-center">
            <span>{newNewsCount} new articles available</span>
            <Button size="sm" onClick={() => fetchNews(true)} className="bg-blue-600 hover:bg-blue-700">
              Refresh
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* WebSocket Status */}
      {wsConnected && (
        <div className="mb-4 flex items-center text-sm text-green-600 dark:text-green-400">
          <span className="inline-block h-2 w-2 rounded-full bg-green-500 mr-2"></span>
          Live updates enabled
        </div>
      )}

      {/* Search */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search Indian market news..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </form>

      {/* Cached Data Warning - Only show if explicitly requested */}
      {fromCache && error && (
        <Alert className="mb-6 bg-yellow-50 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Using Cached Data</AlertTitle>
          <AlertDescription>We're currently showing cached news data. {error}</AlertDescription>
        </Alert>
      )}

      {/* News List */}
      {loading ? (
        <div className="space-y-6">
          {Array(10)
            .fill(0)
            .map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-8 w-full max-w-2xl mb-2" />
                  <div className="flex gap-4">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4 mb-4" />
                  <Skeleton className="h-4 w-32" />
                </CardContent>
              </Card>
            ))}
        </div>
      ) : filteredNews.length > 0 ? (
        <div className="space-y-6">
          {filteredNews.map((item) => {
            const CategoryIcon = getCategoryIcon(item.category)
            return (
              <Card key={item.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
                    <div>
                      <CardTitle className="text-xl">{item.headline}</CardTitle>
                      <CardDescription className="flex flex-wrap items-center gap-2 mt-2">
                        <CalendarIcon className="h-4 w-4" />
                        <span>{formatDate(item.datetime)}</span>
                        <Clock className="h-4 w-4 ml-2" />
                        <span>{formatTime(item.datetime)}</span>
                        <span className="ml-2">Source: {item.source}</span>
                      </CardDescription>
                    </div>
                    <Badge
                      variant="outline"
                      className={`${getCategoryColor(item.category)} flex items-center gap-1 whitespace-nowrap`}
                    >
                      <CategoryIcon className="h-3 w-3" />
                      {getCategoryName(item.category)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{item.summary}</p>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-700 flex items-center gap-1 text-sm font-medium"
                  >
                    Read full article <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">No News Found</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            {searchQuery ? `No results found for "${searchQuery}"` : "No news articles available."}
          </p>
          <Button
            onClick={() => {
              setSearchQuery("")
              fetchNews()
            }}
          >
            Reset Search
          </Button>
        </div>
      )}

      {/* Pagination */}
      {!loading && filteredNews.length > 0 && (
        <div className="flex justify-between items-center mt-8">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Showing page {page} of {totalPages}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => handlePageChange(page - 1)} disabled={page <= 1}>
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <Button
                  key={pageNum}
                  variant={pageNum === page ? "default" : "outline"}
                  size="sm"
                  className="w-8 h-8 p-0"
                  onClick={() => handlePageChange(pageNum)}
                >
                  {pageNum}
                </Button>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(page + 1)}
              disabled={page >= totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
