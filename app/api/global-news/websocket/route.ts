import { NextResponse } from "next/server"

// Finnhub API configuration
const FINNHUB_API_KEY = "cvh7mahr01qp24kgeu3gcvh7mahr01qp24kgeu40"
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
const API_RESET_TIME = 24 * 60 * 60 * 1000 // 24 hours in milliseconds

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

// Start fetching news periodically in the background
let lastFetchTime = 0
async function fetchNewsIfNeeded() {
  const now = Date.now()

  // Only fetch if it's been more than 5 minutes since the last fetch
  if (now - lastFetchTime > 5 * 60 * 1000 || !newsCache.data) {
    try {
      const news = await fetchGlobalMarketNews()
      newsCache = {
        data: news,
        timestamp: now,
        categories: categorizeNews(news),
        lastApiError: null,
        apiLimitReached: false,
      }
      lastFetchTime = now
      console.log("Global news fetched successfully:", news.length, "items")
    } catch (error: any) {
      console.error("Error fetching global news:", error.message)
      if (error.message.includes("429")) {
        newsCache.apiLimitReached = true
        newsCache.lastApiError = "API rate limit reached"
      }
    }
  }

  return newsCache
}

// Initialize news data
fetchNewsIfNeeded()

// Set up a background fetch every 5 minutes
if (typeof setInterval !== "undefined") {
  setInterval(fetchNewsIfNeeded, 5 * 60 * 1000)
}

export const runtime = "edge"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const page = Number.parseInt(searchParams.get("page") || "1", 10)
  const pageSize = 10

  try {
    // Fetch or use cached news
    const newsData = await fetchNewsIfNeeded()

    if (!newsData.data) {
      return NextResponse.json(
        { error: "No news data available", news: [], pagination: { page, totalPages: 0 } },
        { status: 404 },
      )
    }

    // Calculate pagination
    const totalItems = newsData.data.length
    const totalPages = Math.ceil(totalItems / pageSize)
    const startIndex = (page - 1) * pageSize
    const endIndex = Math.min(startIndex + pageSize, totalItems)
    const paginatedNews = newsData.data.slice(startIndex, endIndex)

    return NextResponse.json({
      news: paginatedNews,
      pagination: {
        page,
        pageSize,
        totalItems,
        totalPages,
      },
      lastUpdated: newsData.timestamp,
      fromCache: true,
    })
  } catch (error: any) {
    console.error("Error in global news API:", error)
    return NextResponse.json({ error: error.message || "Internal server error", news: [] }, { status: 500 })
  }
}
