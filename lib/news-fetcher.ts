import {
  getNewsCache,
  updateCache,
  setFetchingState,
  shouldThrottleRequest,
  updateLastRequestTime,
  getThrottleDelay,
  isPageCached,
} from "./news-cache"

// Maximum number of pages to fetch
const MAX_PAGES = 4

/**
 * Fetch a single page of news data
 */
export async function fetchNewsPage(page: number): Promise<{
  news: any[]
  totalPages: number
  lastUpdated: Date
}> {
  // Throttle requests if needed
  if (shouldThrottleRequest()) {
    const delay = getThrottleDelay()
    await new Promise((resolve) => setTimeout(resolve, delay))
  }

  // Update the last request time
  updateLastRequestTime()

  // Fetch the data
  const params = new URLSearchParams({
    page: page.toString(),
    type: "global",
  })

  const response = await fetch(`/api/global-news?${params.toString()}`)

  if (!response.ok) {
    throw new Error(`Error fetching news: ${response.status}`)
  }

  const data = await response.json()

  if (data.error && !data.news) {
    throw new Error(data.error)
  }

  return {
    news: data.news,
    totalPages: data.pagination.totalPages,
    lastUpdated: new Date(data.lastUpdated),
  }
}

/**
 * Background fetch all pages
 */
export async function backgroundFetchAllPages(
  startPage = 1,
  onProgress?: (page: number, totalPages: number) => void,
): Promise<void> {
  const cache = getNewsCache()

  // Don't start a new fetch if one is already in progress
  if (cache.isFetching) {
    return
  }

  setFetchingState(true)

  try {
    // First, fetch the current page if not already cached
    if (!isPageCached(startPage)) {
      try {
        const { news, totalPages, lastUpdated } = await fetchNewsPage(startPage)
        updateCache(startPage, news, Math.max(totalPages, 1), lastUpdated)

        if (onProgress) {
          onProgress(startPage - 1, Math.max(totalPages, 1))
        }
      } catch (error) {
        console.error(`Error fetching initial page ${startPage}:`, error)
        // Continue with default values if initial fetch fails
        if (onProgress) {
          onProgress(0, MAX_PAGES)
        }
      }
    }

    // Get the total pages from cache, with a fallback to MAX_PAGES
    const totalPages = Math.max(cache.totalPages || MAX_PAGES, 1)

    // Then fetch all other pages in the background
    for (let page = 1; page <= totalPages; page++) {
      // Skip pages that are already cached
      if (isPageCached(page)) {
        // Still report progress for cached pages
        if (onProgress) {
          onProgress(page - 1, totalPages)
        }
        continue
      }

      try {
        const { news, totalPages: updatedTotalPages, lastUpdated } = await fetchNewsPage(page)
        updateCache(page, news, Math.max(updatedTotalPages, 1), lastUpdated)

        if (onProgress) {
          onProgress(page - 1, Math.max(updatedTotalPages, 1))
        }
      } catch (error) {
        console.error(`Error fetching page ${page}:`, error)
        // Continue with other pages even if one fails
      }
    }
  } finally {
    setFetchingState(false)
  }
}

/**
 * Fetch a specific page, using cache if available
 */
export async function fetchNewsPageWithCache(page: number): Promise<{
  news: any[]
  totalPages: number
  lastUpdated: Date
  fromCache: boolean
}> {
  const cache = getNewsCache()

  // If the page is in the cache, use it
  if (isPageCached(page)) {
    return {
      news: cache.pages[page],
      totalPages: Math.max(cache.totalPages, 1),
      lastUpdated: cache.lastUpdated || new Date(),
      fromCache: true,
    }
  }

  try {
    // Otherwise fetch it
    const { news, totalPages, lastUpdated } = await fetchNewsPage(page)
    updateCache(page, news, Math.max(totalPages, 1), lastUpdated)

    // Start background fetching other pages
    backgroundFetchAllPages(page)

    return {
      news,
      totalPages: Math.max(totalPages, 1),
      lastUpdated,
      fromCache: false,
    }
  } catch (error) {
    console.error(`Error in fetchNewsPageWithCache for page ${page}:`, error)

    // If we have any cached data, return the first available page
    if (Object.keys(cache.pages).length > 0) {
      const firstAvailablePage = Object.keys(cache.pages)[0]
      return {
        news: cache.pages[firstAvailablePage],
        totalPages: Math.max(cache.totalPages, 1),
        lastUpdated: cache.lastUpdated || new Date(),
        fromCache: true,
      }
    }

    // If no cached data is available, throw the error
    throw error
  }
}
