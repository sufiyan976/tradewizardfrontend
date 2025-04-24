export interface NewsItem {
  id: number
  category: string
  datetime: number
  headline: string
  image: string
  related: string
  source: string
  summary: string
  url: string
}

export interface NewsResponse {
  news: NewsItem[]
  pagination: {
    total: number
    page: number
    pageSize: number
    totalPages: number
  }
  categories: string[]
  lastUpdated: number
  fromCache?: boolean
  error?: string
}
