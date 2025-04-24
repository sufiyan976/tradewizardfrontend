import { NextResponse } from "next/server"

// Finnhub API configuration
const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;
const FINNHUB_API_URL = "https://finnhub.io/api/v1"

// Cache for storing news data
let newsCache = {
  data: null as any[] | null,
  timestamp: 0,
  categories: {} as Record<string, any[]>,
  wsData: [] as any[], // Store WebSocket data
  lastApiError: null as string | null,
  apiLimitReached: false,
}

// Constants
const CACHE_DURATION = 60 * 60 * 1000 // 60 minutes in milliseconds
const MAX_PAGES = 4
const ITEMS_PER_PAGE = 10
const API_RESET_TIME = 24 * 60 * 60 * 1000 // 24 hours in milliseconds

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  // Get query parameters with defaults
  const page = Number.parseInt(searchParams.get("page") || "1")
  const section = searchParams.get("section") || "all" // For different sections like market-beats

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
        const data = await fetchIndianMarketNews()

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

    // Get data based on section
    let filteredData: any[] = []

    if (section === "market-beats") {
      // For Market Beats section, prioritize market updates and economic news
      filteredData = [
        ...(newsCache.categories["market-updates"] || []),
        ...(newsCache.categories["economic"] || []),
        ...(newsCache.categories["fii-dii"] || []),
      ].slice(0, 5) // Only return top 5 items
    } else {
      // For main news section, use all data
      filteredData = newsCache.data || []
    }

    // Calculate pagination (only for main news section)
    if (section !== "market-beats") {
      const totalItems = filteredData.length
      const totalPages = Math.min(Math.ceil(totalItems / ITEMS_PER_PAGE), MAX_PAGES)
      const startIndex = (page - 1) * ITEMS_PER_PAGE
      const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalItems)
      filteredData = filteredData.slice(startIndex, endIndex)

      // Return the paginated data with metadata
      return NextResponse.json({
        news: filteredData,
        pagination: {
          total: totalItems,
          page,
          pageSize: ITEMS_PER_PAGE,
          totalPages,
        },
        lastUpdated: newsCache.timestamp,
        // Don't expose API limit reached to the client
        fromCache: currentTime - newsCache.timestamp > CACHE_DURATION,
      })
    } else {
      // For market beats, just return the data without pagination
      return NextResponse.json({
        news: filteredData,
        lastUpdated: newsCache.timestamp,
      })
    }
  } catch (error: any) {
    console.error("Error fetching news:", error)

    // If we have cached data, return it even if there's an error
    if (newsCache.data) {
      let filteredData: any[] = []

      if (section === "market-beats") {
        // For Market Beats section
        filteredData = [
          ...(newsCache.categories["market-updates"] || []),
          ...(newsCache.categories["economic"] || []),
          ...(newsCache.categories["fii-dii"] || []),
        ].slice(0, 5)

        return NextResponse.json({
          news: filteredData,
          lastUpdated: newsCache.timestamp,
          fromCache: true,
        })
      } else {
        // For main news section
        filteredData = newsCache.data

        const totalItems = filteredData.length
        const totalPages = Math.min(Math.ceil(totalItems / ITEMS_PER_PAGE), MAX_PAGES)
        const startIndex = (page - 1) * ITEMS_PER_PAGE
        const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalItems)
        const paginatedData = filteredData.slice(startIndex, endIndex)

        return NextResponse.json({
          news: paginatedData,
          pagination: {
            total: totalItems,
            page,
            pageSize: ITEMS_PER_PAGE,
            totalPages,
          },
          lastUpdated: newsCache.timestamp,
          fromCache: true,
        })
      }
    }

    // If no cached data is available, return an error
    return NextResponse.json({ error: "Failed to fetch news data" }, { status: 500 })
  }
}

// Function to add WebSocket data to cache
export async function POST(request: Request) {
  try {
    const { newsData } = await request.json()

    if (newsData && Array.isArray(newsData)) {
      // Add new WebSocket data to cache
      newsCache.wsData = [...newsData, ...newsCache.wsData].slice(0, 50) // Keep only the latest 50 items

      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: "Invalid data format" }, { status: 400 })
  } catch (error) {
    console.error("Error updating WebSocket data:", error)
    return NextResponse.json({ error: "Failed to update WebSocket data" }, { status: 500 })
  }
}

// Function to fetch Indian market news from Finnhub
async function fetchIndianMarketNews() {
  // Use market=india parameter to focus on Indian market news
  const url = `${FINNHUB_API_URL}/news?category=general&minId=10&token=${FINNHUB_API_KEY}`

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Finnhub API error: ${response.status} ${response.statusText}`)
  }

  const allNews = await response.json()

  // Filter for Indian market news
  // Look for keywords related to Indian markets in the headline or summary
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

  const indianMarketNews = allNews.filter((item: any) => {
    const headline = item.headline?.toLowerCase() || ""
    const summary = item.summary?.toLowerCase() || ""
    const related = item.related?.toLowerCase() || ""

    return indianKeywords.some(
      (keyword) =>
        headline.includes(keyword.toLowerCase()) ||
        summary.includes(keyword.toLowerCase()) ||
        related.includes(keyword.toLowerCase()),
    )
  })

  // If we don't have enough Indian market news, include some general market news
  if (indianMarketNews.length < 40) {
    const generalMarketNews = allNews
      .filter((item: any) => {
        return !indianMarketNews.includes(item) && (item.category === "general" || item.category === "business")
      })
      .slice(0, 40 - indianMarketNews.length)

    return [...indianMarketNews, ...generalMarketNews]
  }

  return indianMarketNews
}

// Function to categorize news articles
function categorizeNews(news: any[]) {
  const categories: Record<string, any[]> = {
    "market-updates": [],
    economic: [],
    "fii-dii": [],
    corporate: [],
    policy: [],
  }

  // Keywords for each category
  const categoryKeywords: Record<string, string[]> = {
    "market-updates": ["market", "sensex", "nifty", "stocks", "shares", "trading", "rally", "decline", "bull", "bear"],
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

    // If not categorized, put in market-updates as default
    if (!categorized) {
      categories["market-updates"].push({ ...item, category: "market-updates" })
    }
  })

  return categories
}
