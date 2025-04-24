// Client-side cache for news data
type CachedNewsData = {
  pages: Record<number, any[]>
  allItems: any[]
  timestamp: number
  totalPages: number
  lastUpdated: Date | null
  isFetching: boolean
  pagesFetched: Set<number>
  stalePages: Set<number> // Track which pages need refreshing
}

// Initialize empty cache
const initialCache: CachedNewsData = {
  pages: {},
  allItems: [],
  timestamp: 0,
  totalPages: 0,
  lastUpdated: null,
  isFetching: false,
  pagesFetched: new Set(),
  stalePages: new Set(),
}

// Cache expiration time (3 hours)
export const CACHE_EXPIRY = 3 * 60 * 60 * 1000

// Singleton cache instance
let newsCache: CachedNewsData = { ...initialCache }

// Throttling parameters
const THROTTLE_DELAY = 1000 // 1 second between requests
let lastRequestTime = 0

/**
 * Get the current cache state
 */
export function getNewsCache(): CachedNewsData {
  return newsCache
}

/**
 * Check if the cache is valid
 */
export function isCacheValid(): boolean {
  const now = Date.now()
  return newsCache.timestamp > 0 && now - newsCache.timestamp < CACHE_EXPIRY && Object.keys(newsCache.pages).length > 0
}

/**
 * Reset the cache
 */
export function resetCache(): void {
  // Store the current pages fetched before resetting
  const previousPagesFetched = newsCache.pagesFetched

  // Reset the cache but maintain the pagesFetched information
  newsCache = {
    ...initialCache,
    pagesFetched: previousPagesFetched,
  }
}

/**
 * Mark a page as stale (needs refreshing)
 */
export function markPageAsStale(page: number): void {
  newsCache.stalePages.add(page)
}

/**
 * Check if a page is stale
 */
export function isPageStale(page: number): boolean {
  return newsCache.stalePages.has(page)
}

/**
 * Clear stale status for a page
 */
export function clearStaleStatus(page: number): void {
  newsCache.stalePages.delete(page)
}

/**
 * Get cached news for a specific page
 */
export function getCachedNewsForPage(page: number): any[] | null {
  if (!isCacheValid() || !newsCache.pages[page]) {
    return null
  }
  return newsCache.pages[page]
}

/**
 * Check if a specific page is cached
 */
export function isPageCached(page: number): boolean {
  return Boolean(newsCache.pages[page])
}

/**
 * Update the cache with new data
 */
export function updateCache(page: number, newsItems: any[], totalPages: number, lastUpdated: Date): void {
  // Update the page data
  newsCache.pages[page] = newsItems
  newsCache.pagesFetched.add(page)

  // Clear stale status for this page
  clearStaleStatus(page)

  // Update metadata
  newsCache.timestamp = Date.now()
  newsCache.totalPages = totalPages
  newsCache.lastUpdated = lastUpdated

  // Rebuild the allItems array from all pages
  newsCache.allItems = Object.values(newsCache.pages).flat()

  // Store in localStorage if available
  try {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "global_news_cache",
        JSON.stringify({
          pages: newsCache.pages,
          timestamp: newsCache.timestamp,
          totalPages: newsCache.totalPages,
          lastUpdated: lastUpdated.toISOString(),
          pagesFetched: Array.from(newsCache.pagesFetched),
          stalePages: Array.from(newsCache.stalePages),
        }),
      )
    }
  } catch (error) {
    console.warn("Failed to store news cache in localStorage:", error)
  }
}

/**
 * Load cache from localStorage
 */
export function loadCacheFromStorage(): boolean {
  try {
    if (typeof window !== "undefined") {
      const storedCache = localStorage.getItem("global_news_cache")
      if (storedCache) {
        const parsedCache = JSON.parse(storedCache)
        newsCache.pages = parsedCache.pages || {}
        newsCache.timestamp = parsedCache.timestamp || 0
        newsCache.totalPages = parsedCache.totalPages || 0
        newsCache.lastUpdated = parsedCache.lastUpdated ? new Date(parsedCache.lastUpdated) : null
        newsCache.pagesFetched = new Set(parsedCache.pagesFetched || [])
        newsCache.stalePages = new Set(parsedCache.stalePages || [])
        newsCache.allItems = Object.values(newsCache.pages).flat()
        return true
      }
    }
  } catch (error) {
    console.warn("Failed to load news cache from localStorage:", error)
  }
  return false
}

/**
 * Set fetching state
 */
export function setFetchingState(isFetching: boolean): void {
  newsCache.isFetching = isFetching
}

/**
 * Check if we should throttle the next request
 */
export function shouldThrottleRequest(): boolean {
  const now = Date.now()
  return now - lastRequestTime < THROTTLE_DELAY
}

/**
 * Update the last request time
 */
export function updateLastRequestTime(): void {
  lastRequestTime = Date.now()
}

/**
 * Get the delay needed for the next request
 */
export function getThrottleDelay(): number {
  const now = Date.now()
  const timeSinceLastRequest = now - lastRequestTime
  return Math.max(0, THROTTLE_DELAY - timeSinceLastRequest)
}
