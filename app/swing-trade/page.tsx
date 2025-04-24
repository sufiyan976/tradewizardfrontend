"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Layers, LineChart, AlertCircle } from "lucide-react"

interface StockItem {
  nsecode: string
  close: number
  volume: number
  per_chg: number
  side: string
}

type SortKey = keyof StockItem
type SortDirection = "asc" | "desc"

export default function SwingTrade() {
  const [stocks, setStocks] = useState<StockItem[]>([])
  const [loading, setLoading] = useState(true)
  const [sortConfig, setSortConfig] = useState<{
    [key: string]: { key: SortKey | null; direction: SortDirection }
  }>({
    fiftyTwoWeekHigh: { key: null, direction: "desc" },
    vcpPattern: { key: null, direction: "desc" },
    fiftyEmaSupport: { key: null, direction: "desc" },
  })
  
  useEffect(() => {
    fetchStocks()
    const interval = setInterval(fetchStocks, 60000)
    return () => clearInterval(interval)
  }, [])

  const formatVolume = (num: number): string => {
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M"
    if (num >= 1_000) return (num / 1_000).toFixed(1) + "K"
    return num.toString()
  }
  
  const fetchStocks = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/stocks`)
      setStocks(response.data)
    } catch (error) {
      console.error("Error fetching stocks:", error)
    } finally {
      setLoading(false)
    }
  }

  const toggleSort = (tab: string, key: SortKey) => {
    setSortConfig((prev) => {
      const current = prev[tab]
      const newDirection =
        current?.key === key && current.direction === "asc" ? "desc" : "asc"
      return {
        ...prev,
        [tab]: { key, direction: newDirection },
      }
    })
  }

  const getArrow = (tab: string, key: SortKey) => {
    if (sortConfig[tab]?.key !== key) return "⇅"
    return sortConfig[tab]?.direction === "asc" ? "▲" : "▼"
  }

  const filterAndSort = (side: string) => {
    const { key, direction } = sortConfig[side]
  
    // Step 1: Filter side + close >= 100
    const filtered = stocks.filter((s) => s.side === side && s.close >= 100)
  
    // Step 2: Sort by volume DESC and slice top 15
    const topByVolume = [...filtered].sort((a, b) => b.volume - a.volume).slice(0, 15)
  
    // Step 3: By default, sort by % change DESC unless user has clicked something
    if (!key) {
      return [...topByVolume].sort((a, b) => b.per_chg - a.per_chg)
    }
  
    // Step 4: If user clicked something, apply sorting on displayed 15 stocks
    return [...topByVolume].sort((a, b) => {
      const valA = a[key]
      const valB = b[key]
  
      if (typeof valA === "string" && typeof valB === "string") {
        return direction === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA)
      }
  
      return direction === "asc"
        ? (valA as number) - (valB as number)
        : (valB as number) - (valA as number)
    })
  }
  
  
  
  const renderTable = (stocksToDisplay: StockItem[], tab: string) => (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-800">
            <th className="text-left py-4 px-6 cursor-pointer" onClick={() => toggleSort(tab, "nsecode")}>
              Symbol {getArrow(tab, "nsecode")}
            </th>
            <th className="text-left py-4 px-6 cursor-pointer" onClick={() => toggleSort(tab, "close")}>
              Price {getArrow(tab, "close")}
            </th>
            <th className="text-left py-4 px-6 cursor-pointer" onClick={() => toggleSort(tab, "per_chg")}>
              Change%{getArrow(tab, "per_chg")}
            </th>
            <th className="text-left py-4 px-6 cursor-pointer" onClick={() => toggleSort(tab, "volume")}>
              Volume{getArrow(tab, "volume")}
            </th>
          </tr>
        </thead>
        <tbody>
          {stocksToDisplay.map((stock, index) => (
            <tr
              key={index}
              className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <td className="py-4 px-6 font-medium">{stock.nsecode}</td>
              <td className="py-4 px-6">₹{stock.close}</td>
              <td className={`py-4 px-6 ${stock.per_chg >= 0 ? "text-green-500" : "text-red-500"}`}>
                {stock.per_chg.toFixed(2)}%
              </td>
              <td className="py-4 px-6">{formatVolume(stock.volume)}</td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  const high52 = filterAndSort("fiftyTwoWeekHigh")
  const vcp = filterAndSort("vcpPattern")
  const ema50 = filterAndSort("fiftyEmaSupport")

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h1 className="text-3xl font-bold">Swing Trade Opportunities</h1>
        <div className="text-sm text-gray-500 dark:text-gray-400 mt-2 md:mt-0">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>

      <Tabs defaultValue="52-week-high" className="w-full mb-8">
        <div className="mb-6">
          <TabsList className="bg-white dark:bg-gray-900">
            <TabsTrigger value="52-week-high">52 Weeks High</TabsTrigger>
            <TabsTrigger value="vcp">VCP</TabsTrigger>
            <TabsTrigger value="50-ema-support">50 EMA Support</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="52-week-high">
          <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
            <CardHeader className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="h-5 w-5 text-blue-500" />
                <h2 className="text-xl font-semibold">52 Weeks High Breakout Stocks</h2>
              </div>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
              Stocks that have recently broken out to new 52-week highs with strong momentum and volume. These stocks
              often continue their uptrend, making them potential swing trade candidates.
              </p>
            </CardHeader>
            <CardContent>{renderTable(high52, "fiftyTwoWeekHigh")}
            <div className="mt-8 bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="text-left">
                    <h3 className="font-semibold text-lg mb-1">Looking for more trading opportunities?</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                       Discover additional potential swing trade candidates with Chartink's advanced screeners.
                    </p>
                  </div>
                  <a
                    href="https://chartink.com/screener/52-week-high-stocks"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 flex items-center gap-2 whitespace-nowrap"
                  >
                    <span>Explore More Stocks</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-external-link"
                    >
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                      <polyline points="15 3 21 3 21 9"></polyline>
                      <line x1="10" y1="14" x2="21" y2="3"></line>
                    </svg>
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vcp">
          <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
            <CardHeader className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <Layers className="h-5 w-5 text-purple-500" />
                <h2 className="text-xl font-semibold">Volume Contraction Pattern (VCP) Stocks</h2>
              </div>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
              Stocks showing the Volume Contraction Pattern - a period of tight price consolidation with decreasing volume followed by a breakout. This pattern often precedes significant price movements.
              </p>
            </CardHeader>
            <CardContent>{renderTable(vcp, "vcpPattern")}
            <div className="mt-8 bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="text-left">
                    <h3 className="font-semibold text-lg mb-1">Looking for more trading opportunities?</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Discover additional potential swing trade candidates with Chartink's advanced screeners.
                    </p>
                  </div>
                  <a
                    href="https://chartink.com/screener/volatility-compression"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 flex items-center gap-2 whitespace-nowrap"
                  >
                    <span>Explore More Stocks</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-external-link"
                    >
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                      <polyline points="15 3 21 3 21 9"></polyline>
                      <line x1="10" y1="14" x2="21" y2="3"></line>
                    </svg>
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="50-ema-support">
          <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
            <CardHeader className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <LineChart className="h-5 w-5 text-green-500" />
                <h2 className="text-xl font-semibold">50 EMA Support Bounce Stocks</h2>
              </div>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
              Stocks that have recently bounced off their 50-day Exponential Moving Average (EMA) support level. This technical pattern often indicates a continuation of the existing uptrend.
              </p>
            </CardHeader>
            <CardContent>{renderTable(ema50, "fiftyEmaSupport")}
            <div className="mt-8 bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="text-left">
                    <h3 className="font-semibold text-lg mb-1">Looking for more trading opportunities?</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Discover additional potential swing trade candidates with Chartink's advanced screeners.
                    </p>
                  </div>
                  <a
                    href="https://chartink.com/screener/ema-50-support-1"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 flex items-center gap-2 whitespace-nowrap"
                  >
                    <span>Explore More Stocks</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-external-link"
                    >
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                      <polyline points="15 3 21 3 21 9"></polyline>
                      <line x1="10" y1="14" x2="21" y2="3"></line>
                    </svg>
                  </a>
                </div>
                </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-yellow-500" />
            Trading Disclaimer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 dark:text-gray-400">
          The information provided in the Swing Trade section is for informational purposes only and should not be
            considered as financial advice. Trading in financial markets involves risk, and past performance is not
            indicative of future results. Always conduct your own research and consider your financial situation before
            making any investment decisions. The trading patterns and stock information are generated based on technical
            indicators and may not always be accurate. Use these recommendations at your own risk.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
