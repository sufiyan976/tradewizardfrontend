import { NextResponse } from "next/server"

// Finnhub API configuration
const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;
const FINNHUB_API_URL = "https://finnhub.io/api/v1"

// Cache for storing news data
let newsCache = {
  data: null as any[] | null,
  timestamp: 0,
  categories: {} as Record<string, any[]>,
  lastApiError: null as string | null,
  apiLimitReached: false,
}

// Constants
const CACHE_DURATION = 60 * 60 * 1000 // 60 minutes in milliseconds
const MAX_PAGES = 4
const ITEMS_PER_PAGE = 10
const API_RESET_TIME = 24 * 60 * 60 * 1000 // 24 hours in milliseconds

// Function to generate historical/archived news items
function generateHistoricalNews(count = 40) {
  const categories = ["global", "economic", "corporate", "policy"]
  const sources = ["TradeWizard Archives", "Market Historical Data", "Financial Archives", "Bloomberg Historical"]

  const headlines = [
    "Global Markets: Historical Performance Analysis",
    "Market Trends: A Look Back at Key Movements",
    "Economic Indicators: Historical Context and Analysis",
    "Sector Performance: Historical Perspective",
    "Market Volatility: Historical Patterns and Insights",
    "Global Trade: Historical Impact on Markets",
    "Central Bank Policies: Historical Market Effects",
    "Commodity Markets: Historical Price Analysis",
    "Currency Markets: Historical Exchange Rate Trends",
    "Investment Strategies: Historical Performance Review",
  ]

  const summaries = [
    "This archived article examines historical market performance, providing context for current trends and potential future movements based on past patterns.",
    "A retrospective analysis of key market trends, highlighting important movements that have shaped the current market landscape.",
    "Historical economic indicators provide valuable context for understanding current market conditions and potential future developments.",
    "This archived report analyzes historical sector performance, offering insights into cyclical patterns and long-term trends across various industries.",
    "An examination of historical market volatility patterns, providing perspective on current market conditions and potential future volatility.",
    "This historical analysis explores the impact of global trade developments on market performance over time, offering context for current trade dynamics.",
    "A review of historical central bank policies and their effects on markets, providing context for understanding current policy implications.",
    "This archived analysis examines historical commodity price movements, offering insights into supply-demand dynamics and market cycles.",
    "A historical perspective on currency exchange rate trends, highlighting key patterns and relationships that have influenced global markets.",
    "This historical review evaluates the performance of various investment strategies across different market conditions, offering insights for current portfolio management.",
  ]

  return Array(count)
    .fill(0)
    .map((_, index) => {
      // Create timestamps that go progressively further back in time
      const now = Date.now()
      const dayOffset = index + 1 // Start from 1 day ago and go back
      const timestamp = Math.floor((now - dayOffset * 24 * 60 * 60 * 1000) / 1000)

      return {
        id: `historical-${index}`,
        headline: headlines[index % headlines.length],
        summary: summaries[index % summaries.length],
        datetime: timestamp,
        source: sources[index % sources.length],
        url: "#",
        category: categories[index % categories.length],
        related: "",
        image: "",
        isFallback: true,
        isHistorical: true,
      }
    })
}

// Modify the GET function to ensure all pages have content
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  // Get query parameters with defaults
  const page = Number.parseInt(searchParams.get("page") || "1")
  const limit = Number.parseInt(searchParams.get("limit") || "10") // Added limit parameter

  // Validate page number
  if (page < 1 || page > MAX_PAGES) {
    return NextResponse.json({ error: `Page number must be between 1 and ${MAX_PAGES}` }, { status: 400 })
  }

  try {
    const currentTime = Date.now()

    // Check if API limit was reached and if it's time to reset
    if (newsCache.apiLimitReached && currentTime - newsCache.timestamp > API_RESET_TIME) {
      newsCache.apiLimitReached = false
      newsCache.lastApiError = null
    }

    // Check if we need to refresh the cache
    const shouldRefreshCache =
      !newsCache.data || (currentTime - newsCache.timestamp > CACHE_DURATION && !newsCache.apiLimitReached)

    if (shouldRefreshCache) {
      try {
        // Fetch fresh data from Finnhub
        const data = await fetchGlobalMarketNews()

        // Update cache
        newsCache = {
          ...newsCache,
          data,
          timestamp: currentTime,
          categories: categorizeNews(data),
          lastApiError: null,
          apiLimitReached: false,
        }
      } catch (error: any) {
        // Check if the error is due to API limit
        if (error.message.includes("429") || error.message.includes("rate limit")) {
          newsCache.apiLimitReached = true
          newsCache.lastApiError = error.message

          // Don't throw here, we'll use cached data
          console.warn("API limit reached, using cached data:", error.message)
        } else {
          throw error // Re-throw other errors
        }
      }
    }

    // Get all data or use fallback if no data is available
    let filteredData = newsCache.data || []

    // Generate historical news data
    const historicalNews = generateHistoricalNews()

    // If we have no data or not enough data for all pages, append historical news
    if (filteredData.length < MAX_PAGES * ITEMS_PER_PAGE) {
      // Calculate how many items we need
      const requiredItems = MAX_PAGES * ITEMS_PER_PAGE
      const missingItems = requiredItems - filteredData.length

      // Append enough historical news to fill all pages
      if (missingItems > 0) {
        const additionalItems = historicalNews.slice(0, missingItems)
        filteredData = [...filteredData, ...additionalItems]
      }
    }

    // Sort all news by datetime (newest first)
    filteredData.sort((a, b) => b.datetime - a.datetime)

    // If limit=1 is specified, just return the most recent news item
    if (limit === 1 && filteredData.length > 0) {
      return NextResponse.json({
        news: [filteredData[0]],
        pagination: {
          total: filteredData.length,
          page: 1,
          pageSize: 1,
          totalPages: MAX_PAGES,
        },
        lastUpdated: newsCache.timestamp,
        fromCache: currentTime - newsCache.timestamp > CACHE_DURATION,
      })
    }

    // Calculate pagination
    const totalItems = filteredData.length
    const totalPages = MAX_PAGES // Always show 4 pages
    const startIndex = (page - 1) * ITEMS_PER_PAGE
    const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalItems)

    // Get items for the current page
    let paginatedData = filteredData.slice(startIndex, endIndex)

    // If we still don't have enough items for this page, add more historical news
    if (paginatedData.length < ITEMS_PER_PAGE) {
      const additionalHistorical = historicalNews.slice(0, ITEMS_PER_PAGE - paginatedData.length)
      paginatedData = [...paginatedData, ...additionalHistorical]
    }

    // Return the paginated data with metadata
    return NextResponse.json({
      news: paginatedData,
      pagination: {
        total: Math.max(totalItems, MAX_PAGES * ITEMS_PER_PAGE), // Ensure we report enough items for all pages
        page,
        pageSize: ITEMS_PER_PAGE,
        totalPages,
      },
      lastUpdated: newsCache.timestamp,
      fromCache: currentTime - newsCache.timestamp > CACHE_DURATION,
    })
  } catch (error: any) {
    console.error("Error fetching news:", error)

    // If we have cached data, return it even if there's an error
    if (newsCache.data && newsCache.data.length > 0) {
      const filteredData = newsCache.data

      // If limit=1 is specified, just return the most recent news item
      if (limit === 1 && filteredData.length > 0) {
        return NextResponse.json({
          news: [filteredData[0]],
          pagination: {
            total: filteredData.length,
            page: 1,
            pageSize: 1,
            totalPages: MAX_PAGES,
          },
          lastUpdated: newsCache.timestamp,
          fromCache: true,
        })
      }

      const totalItems = filteredData.length
      const startIndex = (page - 1) * ITEMS_PER_PAGE
      const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalItems)
      const paginatedData = filteredData.slice(startIndex, endIndex)

      return NextResponse.json({
        news: paginatedData,
        pagination: {
          total: totalItems,
          page,
          pageSize: ITEMS_PER_PAGE,
          totalPages: MAX_PAGES,
        },
        lastUpdated: newsCache.timestamp,
        fromCache: true,
      })
    }

    // If no cached data is available, return historical news data
    const historicalData = generateHistoricalNews()
    const startIndex = (page - 1) * ITEMS_PER_PAGE
    const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, historicalData.length)
    const paginatedData = historicalData.slice(startIndex, endIndex)

    return NextResponse.json({
      news: paginatedData,
      pagination: {
        total: historicalData.length,
        page,
        pageSize: ITEMS_PER_PAGE,
        totalPages: MAX_PAGES,
      },
      lastUpdated: Date.now(),
      fromCache: false,
      isHistorical: true,
    })
  }
}

// Function to fetch global market news from Finnhub
async function fetchGlobalMarketNews() {
  // Use category=general to get general market news
  const url = `${FINNHUB_API_URL}/news?category=general&minId=10&token=${FINNHUB_API_KEY}`

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Finnhub API error: ${response.status} ${response.statusText}`)
  }

  const allNews = await response.json()

  // Filter for global market news
  // Exclude Indian market news to avoid overlap with the Indian news section
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
  ]

  const globalMarketNews = allNews.filter((item: any) => {
    const headline = item.headline?.toLowerCase() || ""
    const summary = item.summary?.toLowerCase() || ""
    const related = item.related?.toLowerCase() || ""

    // Exclude news that contains Indian market keywords
    return !indianKeywords.some(
      (keyword) =>
        headline.includes(keyword.toLowerCase()) ||
        summary.includes(keyword.toLowerCase()) ||
        related.includes(keyword.toLowerCase()),
    )
  })

  return globalMarketNews.map((item: any) => ({
    ...item,
    category: "global", // Mark all as global category
  }))
}

// Function to categorize news articles
function categorizeNews(news: any[]) {
  const categories: Record<string, any[]> = {
    global: [],
    economic: [],
    corporate: [],
    policy: [],
  }

  // Keywords for each category
  const categoryKeywords: Record<string, string[]> = {
    economic: ["economy", "gdp", "inflation", "growth", "recession", "economic", "fiscal", "monetary"],
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
    policy: ["fed", "central bank", "policy", "regulation", "government", "tax", "budget", "reform", "law", "rule"],
  }

  // Categorize each news item
  news.forEach((item) => {
    const headline = item.headline?.toLowerCase() || ""
    const summary = item.summary?.toLowerCase() || ""

    // Check each category
    let categorized = false
    for (const [category, keywords] of Object.entries(categoryKeywords)) {
      if (keywords.some((keyword) => headline.includes(keyword) || summary.includes(keyword))) {
        categories[category].push({ ...item, category })
        categorized = true
        break
      }
    }

    // If not categorized, put in global as default
    if (!categorized) {
      categories["global"].push({ ...item, category: "global" })
    }
  })

  return categories
}
