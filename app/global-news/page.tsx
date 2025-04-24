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
  Globe,
  CheckCircle2,
} from "lucide-react"
import type { NewsItem } from "@/types/news"
import { fetchNewsPageWithCache, backgroundFetchAllPages } from "@/lib/news-fetcher"
import { loadCacheFromStorage, isCacheValid, getNewsCache, markPageAsStale } from "@/lib/news-cache"

// Category icons mapping
const CATEGORY_ICONS: Record<string, any> = {
  "market-updates": BarChart2,
  economic: TrendingUp,
  "fii-dii": DollarSign,
  corporate: Briefcase,
  policy: FileText,
  global: Globe,
}

export default function GlobalNewsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialRenderRef = useRef(true)

  // Get query parameters with defaults
  const page = Number.parseInt(searchParams.get("page") || "1")

  // State for news data
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalPages, setTotalPages] = useState(4)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [fromCache, setFromCache] = useState(false)

  // State for background loading
  const [backgroundLoading, setBackgroundLoading] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [pagesLoaded, setPagesLoaded] = useState(0)

  // New state for refresh operation
  const [refreshing, setRefreshing] = useState(false)
  const [refreshedPages, setRefreshedPages] = useState<Set<number>>(new Set())

  // State for filters
  const [searchQuery, setSearchQuery] = useState("")

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

      router.push(`/global-news?${newParams.toString()}`)
    },
    [router, searchParams],
  )

  // Load cache from localStorage on initial render
  useEffect(() => {
    if (initialRenderRef.current) {
      initialRenderRef.current = false
      loadCacheFromStorage()
    }
  }, [])

  // Fetch news data with optimized caching
  const fetchNews = useCallback(
    async (isRefresh = false) => {
      if (!isRefresh) {
        setLoading(true)
      } else {
        // For refresh, set refreshing state but don't clear existing content
        setRefreshing(true)
        setRefreshedPages(new Set())
      }
      setError(null)

      try {
        // If refresh is requested, mark all pages as stale but don't reset cache
        if (isRefresh) {
          // Mark all pages as stale instead of resetting the cache
          const cache = getNewsCache()
          Object.keys(cache.pages).forEach((pageKey) => {
            markPageAsStale(Number.parseInt(pageKey))
          })
        }

        // Fetch the current page (using cache if available and not refreshing)
        const { news, totalPages, lastUpdated, fromCache } = await fetchNewsPageWithCache(page, isRefresh)

        // Update state with the fetched data for the current page
        setNews(news)
        setTotalPages(Math.max(totalPages, 1)) // Ensure totalPages is never less than 1
        setLastUpdated(lastUpdated)
        setFromCache(fromCache && !isRefresh)

        // Mark current page as refreshed if this is a refresh operation
        if (isRefresh) {
          setRefreshedPages((prev) => new Set(prev).add(page))
        }

        // Start background fetching of all pages if not from cache or if refreshing
        if (!fromCache || isRefresh) {
          // Ensure we have valid values before starting background loading
          const validTotalPages = Math.max(totalPages, 1)

          setBackgroundLoading(true)
          setPagesLoaded(isRefresh ? 1 : 1) // Start at 1 for the current page
          setLoadingProgress(Math.round((1 / validTotalPages) * 100))

          // Add a small delay before starting background fetch for smoother animation
          setTimeout(() => {
            backgroundFetchAllPages(
              page,
              (currentPage, totalPages, refreshedPage) => {
                const validCurrentPage = Math.max(currentPage, 0)
                const validTotalPages = Math.max(totalPages, 1)

                setPagesLoaded((prev) => Math.max(prev, validCurrentPage + 1))
                setLoadingProgress(
                  Math.round((Math.min(validCurrentPage + 1, validTotalPages) / validTotalPages) * 100),
                )

                // If this is a refresh operation and a page was refreshed, update the refreshed pages set
                if (isRefresh && refreshedPage !== undefined) {
                  setRefreshedPages((prev) => new Set(prev).add(refreshedPage))
                }

                if (validCurrentPage >= validTotalPages - 1) {
                  // Add a small delay before hiding the indicator
                  setTimeout(() => {
                    setBackgroundLoading(false)
                    if (isRefresh) {
                      setRefreshing(false)
                    }
                  }, 500)
                }
              },
              isRefresh,
            ).catch((error) => {
              console.error("Background fetching error:", error)
              setBackgroundLoading(false)
              if (isRefresh) {
                setRefreshing(false)
              }
            })
          }, 300)
        }
      } catch (err: any) {
        console.error("Error fetching news:", err)
        setError(err.message || "Failed to load news. Please try again later.")

        // Try to use cached data if available
        if (isCacheValid()) {
          const cache = getNewsCache()
          if (cache.pages[page]) {
            setNews(cache.pages[page])
            setTotalPages(Math.max(cache.totalPages, 1)) // Ensure totalPages is never less than 1
            setLastUpdated(cache.lastUpdated)
            setFromCache(true)
          }
        }

        // End refreshing state if this was a refresh operation
        if (isRefresh) {
          setRefreshing(false)
        }
      } finally {
        setLoading(false)
      }
    },
    [page],
  )

  // Fetch news when component mounts
  useEffect(() => {
    fetchNews()
  }, [fetchNews])

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

  // Handle manual refresh
  const handleRefresh = () => {
    fetchNews(true)
  }

  // Check if a page has been refreshed
  const isPageRefreshed = (pageNum: number) => {
    return refreshedPages.has(pageNum)
  }

  // Determine if we need to show news items or fallback content
  const newsToDisplay = filteredNews.length > 0 ? filteredNews : []

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Update the page header to be more responsive */}
      <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold">Global Market News</h1>
        <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
          <Clock className="h-4 w-4 mr-1" />
          {lastUpdated ? (
            <span className="flex items-center">
              Last updated: {lastUpdated.toLocaleString()}
              {fromCache && <span className="ml-2 text-blue-500">(Cached)</span>}
              {refreshing && isPageRefreshed(page) && <span className="ml-2 text-green-500">(Updated)</span>}
            </span>
          ) : (
            <>Fetching latest news...</>
          )}
          <Button variant="ghost" size="sm" className="ml-2" onClick={handleRefresh} disabled={loading || refreshing}>
            <RefreshCcw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            {refreshing && <span className="ml-1 text-xs">Updating...</span>}
          </Button>
        </div>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="mb-6 w-full max-w-full">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search global market news..."
            className="pl-10 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </form>

      {/* Error Alert */}
      {error && (
        <Alert className="mb-6 bg-yellow-50 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Warning</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
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
      ) : newsToDisplay.length > 0 ? (
        <div className="space-y-6">
          {newsToDisplay.map((item) => {
            const CategoryIcon = getCategoryIcon(item.category)
            const isFallback = "isFallback" in item && item.isFallback
            const isRefreshed = refreshing && isPageRefreshed(page) && !isFallback

            return (
              <Card
                key={item.id}
                className={`hover:shadow-md transition-shadow ${isFallback ? "border-dashed" : ""} ${
                  isRefreshed ? "border-green-500/50" : ""
                }`}
              >
                {/* Update the card header for better responsiveness */}
                <CardHeader>
                  <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg sm:text-xl break-words">
                        {item.headline}
                        {isFallback && (
                          <span className="text-sm font-normal text-muted-foreground ml-2">(Archived)</span>
                        )}
                      </CardTitle>
                      {isRefreshed && (
                        <Badge
                          variant="outline"
                          className="bg-green-500/10 text-green-500 border-green-500 ml-2 flex items-center gap-1"
                        >
                          <CheckCircle2 className="h-3 w-3" />
                          Updated
                        </Badge>
                      )}
                    </div>
                    <CardDescription className="flex flex-wrap items-center gap-2 mt-2">
                      <span className="flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-1" />
                        <span>{formatDate(item.datetime)}</span>
                      </span>
                      <span className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{formatTime(item.datetime)}</span>
                      </span>
                      <span className="flex items-center">
                        <span>Source: {item.source}</span>
                      </span>
                    </CardDescription>
                    <Badge
                      variant="outline"
                      className={`${getCategoryColor(item.category)} flex items-center gap-1 whitespace-nowrap self-start`}
                    >
                      <CategoryIcon className="h-3 w-3" />
                      {getCategoryName(item.category)}
                    </Badge>
                  </div>
                </CardHeader>
                {/* Update the card content for better text wrapping */}
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 break-words">{item.summary}</p>
                  {!isFallback ? (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-blue-700 flex items-center gap-1 text-sm font-medium"
                    >
                      Read full article <ExternalLink className="h-3.5 w-3.5 flex-shrink-0" />
                    </a>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRefresh}
                      className="text-blue-500 hover:text-blue-700 flex items-center gap-1 text-sm font-medium"
                    >
                      Check for updates <RefreshCcw className="h-3.5 w-3.5 ml-1 flex-shrink-0" />
                    </Button>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        // This should never be shown now due to our fallback content
        <div className="space-y-6">
          {Array(5)
            .fill(0)
            .map((_, index) => {
              const date = new Date()
              date.setDate(date.getDate() - index)
              const timestamp = Math.floor(date.getTime() / 1000)

              return (
                <Card key={`archive-${index}`} className="hover:shadow-md transition-shadow border-dashed">
                  <CardHeader>
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
                      <div>
                        <CardTitle className="text-xl">
                          {`Global Market Insights: ${index === 0 ? "Latest" : "Previous"} Trends`}
                          <span className="text-sm font-normal text-muted-foreground ml-2">(Archived)</span>
                        </CardTitle>
                        <CardDescription className="flex flex-wrap items-center gap-2 mt-2">
                          <span className="flex items-center">
                            <CalendarIcon className="h-4 w-4 mr-1" />
                            <span>{formatDate(timestamp)}</span>
                          </span>
                          <span className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>{formatTime(timestamp)}</span>
                          </span>
                          <span className="flex items-center">
                            <span>Source: TradeWizard Archives</span>
                          </span>
                        </CardDescription>
                      </div>
                      <Badge
                        variant="outline"
                        className={`${getCategoryColor("global")} flex items-center gap-1 whitespace-nowrap`}
                      >
                        <Globe className="h-3 w-3" />
                        {getCategoryName("global")}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {`This archived article contains market analysis and insights from our historical database. Global markets showed ${
                        index % 2 === 0 ? "positive" : "mixed"
                      } signals with key sectors demonstrating resilience amid economic uncertainties.`}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRefresh}
                      className="text-blue-500 hover:text-blue-700 flex items-center gap-1 text-sm font-medium"
                    >
                      Check for updates <RefreshCcw className="h-3.5 w-3.5 ml-1" />
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
        </div>
      )}

      {/* Update the pagination controls to be more responsive */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8">
        <div className="text-sm text-gray-500 dark:text-gray-400 order-2 sm:order-1">
          Showing page {page} of {totalPages}
        </div>
        <div className="flex gap-2 order-1 sm:order-2">
          <Button variant="outline" size="sm" onClick={() => handlePageChange(page - 1)} disabled={page <= 1}>
            <ChevronLeft className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Previous</span>
          </Button>
          <div className="hidden sm:flex items-center gap-1">
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              // Show first page, last page, current page, and pages around current
              let pageNum = i + 1
              if (totalPages > 5) {
                if (page <= 3) {
                  // Near the start
                  pageNum = i + 1
                } else if (page >= totalPages - 2) {
                  // Near the end
                  pageNum = totalPages - 4 + i
                } else {
                  // In the middle
                  pageNum = page - 2 + i
                }
              }

              return (
                <Button
                  key={pageNum}
                  variant={pageNum === page ? "default" : "outline"}
                  size="sm"
                  className={`w-8 h-8 p-0 ${
                    refreshing && isPageRefreshed(pageNum) ? "border-green-500 text-green-500" : ""
                  }`}
                  onClick={() => handlePageChange(pageNum)}
                >
                  {pageNum}
                </Button>
              )
            })}
          </div>
          <div className="sm:hidden flex items-center">
            <span className="px-3">{page}</span>
          </div>
          <Button variant="outline" size="sm" onClick={() => handlePageChange(page + 1)} disabled={page >= totalPages}>
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  )
}
