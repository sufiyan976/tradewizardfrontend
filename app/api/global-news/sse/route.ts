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
      console.error("Error fetching global news for SSE:", error.message)
      newsCache.lastApiError = error.message
    }
  }

  return newsCache
}

export const runtime = "edge"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)

  // Set up SSE headers
  const headers = {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  }

  const stream = new ReadableStream({
    async start(controller) {
      // Send initial data
      const newsData = await getNewsData()

      const initialData = JSON.stringify({
        news: newsData.data || [],
        lastUpdated: newsData.timestamp,
        fromCache: true,
      })

      controller.enqueue(`data: ${initialData}\n\n`)

      // Keep connection alive with a comment every 30 seconds
      const keepAliveInterval = setInterval(() => {
        controller.enqueue(`: keep-alive ${Date.now()}\n\n`)
      }, 30000)

      // Send news updates every 5 minutes
      const updateInterval = setInterval(
        async () => {
          try {
            const updatedNews = await getNewsData()

            if (updatedNews.data) {
              const data = JSON.stringify({
                news: updatedNews.data,
                lastUpdated: updatedNews.timestamp,
                fromCache: true,
              })

              controller.enqueue(`data: ${data}\n\n`)
            }
          } catch (error) {
            console.error("Error sending SSE update:", error)
            controller.enqueue(`data: ${JSON.stringify({ error: "Failed to update news" })}\n\n`)
          }
        },
        5 * 60 * 1000,
      )

      // Clean up on close
      req.signal.addEventListener("abort", () => {
        clearInterval(keepAliveInterval)
        clearInterval(updateInterval)
      })
    },
  })

  return new Response(stream, { headers })
}
