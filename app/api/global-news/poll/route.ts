// Reuse the same cache and fetch function from the main API
let newsCache = {
  data: null as any[] | null,
  timestamp: 0,
  lastApiError: null as string | null,
}

// Finnhub API configuration
const FINNHUB_API_KEY = "cvh7mahr01qp24kgeu3gcvh7mahr01qp24kgeu40"
const FINNHUB_API_URL = "https://finnhub.io/api/v1"

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

// Fetch or use cached news
async function getNewsData() {
  const now = Date.now()

  // Only fetch if it's been more than 5 minutes since the last fetch or if cache is empty
  if (now - newsCache.timestamp > 5 * 60 * 1000 || !newsCache.data) {
    try {
      const news = await fetchGlobalMarketNews()
      newsCache = {
        data: news,
        timestamp: now,
        lastApiError: null,
      }
    } catch (error: any) {
      console.error("Error fetching global news for polling:", error.message)
      newsCache.lastApiError = error.message
    }
  }

  return newsCache
}

export const runtime = "edge"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const lastTimestamp = searchParams.get("lastTimestamp")

  // Get news data
  const newsData = await getNewsData()

  // Check if there are updates since the last poll
  const hasUpdates = !lastTimestamp || Number.parseInt(lastTimestamp) < newsData.timestamp

  // Return appropriate response
  return new Response(
    JSON.stringify({
      news: hasUpdates ? newsData.data : null,
      lastUpdated: newsData.timestamp,
      hasUpdates: hasUpdates,
      fromCache: true,
      error: newsData.lastApiError,
    }),
    {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    },
  )
}
