"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowDownRight, ArrowUpRight, TrendingDown, TrendingUp,
  Clock, AlertCircle, ArrowUpDown, ChevronUp, ChevronDown
} from "lucide-react"

interface StockItem {
  nsecode: string
  close: number
  volume: number
  per_chg: number
  momentumStrength?: number
  side: string
}

type SortKey = "nsecode" | "close" | "per_chg" | "momentumStrength" | "volume"
interface SortConfig {
  key: SortKey
  direction: "asc" | "desc"
}

export default function IntradayBooster() {
  const [advanceBuyStocks, setAdvanceBuyStocks] = useState<StockItem[]>([])
  const [advanceSellStocks, setAdvanceSellStocks] = useState<StockItem[]>([])
  const [displayedBuyStocks, setDisplayedBuyStocks] = useState<StockItem[]>([])
  const [displayedSellStocks, setDisplayedSellStocks] = useState<StockItem[]>([])
  const [initialBuyTop15, setInitialBuyTop15] = useState<StockItem[]>([])
  const [initialSellTop15, setInitialSellTop15] = useState<StockItem[]>([])
  const [marketStatus, setMarketStatus] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())

  const [buySortConfig, setBuySortConfig] = useState<SortConfig>({
    key: "volume",
    direction: "desc",
  })

  const [sellSortConfig, setSellSortConfig] = useState<SortConfig>({
    key: "volume",
    direction: "desc",
  })

  const [userHasSortedBuy, setUserHasSortedBuy] = useState(false)
  const [userHasSortedSell, setUserHasSortedSell] = useState(false)

  const isMarketOpen = () => {
    const now = new Date()
    const day = now.getDay()
    const minutes = now.getHours() * 60 + now.getMinutes()
    return day >= 1 && day <= 5 && minutes >= 555 && minutes < 930
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setMarketStatus(isMarketOpen())
      setCurrentTime(new Date())
      fetchStocks()
    }, 60000)

    setMarketStatus(isMarketOpen())
    fetchStocks()

    return () => clearInterval(interval)
  }, [])

  const formatVolume = (num: number): string => {
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M"
    if (num >= 1_000) return (num / 1_000).toFixed(1) + "K"
    return num.toString()
  }

  const fetchStocks = async () => {
    const baseUrls = [
      process.env.NEXT_PUBLIC_API_URL_PRIMARY, // Backend A
      process.env.NEXT_PUBLIC_API_URL_SECONDARY // Backend B
    ]
  
    let success = false
  
    for (const baseUrl of baseUrls) {
      try {
        const response = await axios.get(`${baseUrl}/stocks`)
        const allData: StockItem[] = response.data
  
        const advanceBuy = allData.filter(
          (s) => s.side === "advanceBuy" && s.close >= 100 && typeof s.momentumStrength === "number"
        )
        const advanceSell = allData.filter(
          (s) => s.side === "advanceSell" && s.close >= 100 && typeof s.momentumStrength === "number"
        )
  
        setAdvanceBuyStocks(advanceBuy)
        setAdvanceSellStocks(advanceSell)
  
        const topBuy = [...advanceBuy].sort((a, b) => b.volume - a.volume).slice(0, 15)
        const topSell = [...advanceSell].sort((a, b) => b.volume - a.volume).slice(0, 15)
  
        setInitialBuyTop15(topBuy)
        setInitialSellTop15(topSell)
  
        success = true
        break // Exit loop on success
      } catch (error) {
        console.warn(`Failed to fetch from ${baseUrl}:`, error)
      }
    }
  
    if (!success) {
      console.error("Error fetching stock data from all sources")
    }
  }
  

  useEffect(() => {
    const sorted =
      !userHasSortedBuy && buySortConfig.key === "volume" && buySortConfig.direction === "desc"
        ? [...initialBuyTop15].sort((a, b) => b.per_chg - a.per_chg)
        : getSortedStocks(initialBuyTop15, buySortConfig)

    setDisplayedBuyStocks(sorted)
  }, [initialBuyTop15, buySortConfig, userHasSortedBuy])

  useEffect(() => {
    const sorted =
      !userHasSortedSell && sellSortConfig.key === "volume" && sellSortConfig.direction === "desc"
        ? [...initialSellTop15].sort((a, b) => a.per_chg - b.per_chg)
        : getSortedStocks(initialSellTop15, sellSortConfig)

    setDisplayedSellStocks(sorted)
  }, [initialSellTop15, sellSortConfig, userHasSortedSell])

  const getSortedStocks = (stocks: StockItem[], config: SortConfig): StockItem[] => {
    const { key, direction } = config
    return [...stocks].sort((a, b) => {
      const aVal = a[key] ?? 0
      const bVal = b[key] ?? 0
      if (typeof aVal === "string" && typeof bVal === "string") {
        return direction === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal)
      }
      return direction === "asc"
        ? Number(aVal) - Number(bVal)
        : Number(bVal) - Number(aVal)
    })
  }

  const handleSort = (key: SortKey, type: "advanceBuy" | "advanceSell") => {
    if (type === "advanceBuy") {
      setUserHasSortedBuy(true)
      const direction = buySortConfig.key === key && buySortConfig.direction === "asc" ? "desc" : "asc"
      setBuySortConfig({ key, direction })
    } else {
      setUserHasSortedSell(true)
      const direction = sellSortConfig.key === key && sellSortConfig.direction === "asc" ? "desc" : "asc"
      setSellSortConfig({ key, direction })
    }
  }

  const renderSortIcon = (column: SortKey, current: SortConfig) => {
    if (current.key !== column) return <ArrowUpDown className="h-4 w-4 ml-1" />
    return current.direction === "asc"
      ? <ChevronUp className="h-4 w-4 ml-1" />
      : <ChevronDown className="h-4 w-4 ml-1" />
  }

  const renderStockTable = (
    stocks: StockItem[],
    type: "advanceBuy" | "advanceSell"
  ) => {
    const isBuy = type === "advanceBuy"
    const config = isBuy ? buySortConfig : sellSortConfig

    return (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-800 text-left">
              {(["nsecode", "close", "per_chg", "momentumStrength", "volume"] as SortKey[]).map((key) => (
                <th key={key} className="py-3 px-4 cursor-pointer" onClick={() => handleSort(key, type)}>
                  <div className="flex items-center">
                    {key === "nsecode" ? "Symbol" :
                      key === "close" ? "Price" :
                        key === "per_chg" ? "Change%" :
                          key === "momentumStrength" ? "M.Strength" : "Volume"}
                    {renderSortIcon(key, config)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {stocks.map((stock, index) => {
              const isPositive = stock.per_chg >= 0
              const changeColor = isPositive ? "text-green-500" : "text-red-500"
              const ChangeIcon = isPositive ? TrendingUp : TrendingDown

              return (
                <tr
                  key={index}
                  className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                >
                  <td className="py-3 px-4 font-medium">{stock.nsecode}</td>
                  <td className="py-4 px-4">₹{stock.close}</td>
                  <td className={`py-3 px-4 ${changeColor} flex items-center`}>
                    <ChangeIcon className="h-4 w-4 mr-1" />
                    {stock.per_chg?.toFixed(2)}%
                  </td>
                  <td className="py-3 px-5">
                    {stock.momentumStrength?.toFixed(2) ?? "N/A"}
                  </td>
                  <td className="py-4 px-6">{formatVolume(stock.volume)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">9:15 Booster</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            High-probability intraday trading opportunities
          </p>
        </div>
        <div className="flex items-center gap-2 mt-4 md:mt-0">
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Last updated: {currentTime.toLocaleTimeString()}
          </Badge>
          <Badge className={marketStatus ? "bg-blue-600" : "bg-red-600"}>
            Market: {marketStatus ? "Open" : "Closed"}
          </Badge>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 mb-8">
        <Card className="w-full lg:w-1/2 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2 text-green-500">
                <ArrowUpRight className="h-5 w-5" />
                Bullish Stocks
              </CardTitle>
              <Badge variant="outline" className="bg-green-500/10 text-green-500">
                {displayedBuyStocks.length} Stocks
              </Badge>
            </div>
            <CardDescription>Stocks showing strong bullish momentum for intraday buying</CardDescription>
          </CardHeader>
          <CardContent>
            {renderStockTable(displayedBuyStocks, "advanceBuy")}
          </CardContent>
        </Card>

        <Card className="w-full lg:w-1/2 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2 text-red-500">
                <ArrowDownRight className="h-5 w-5" />
                Bearish Stocks
              </CardTitle>
              <Badge variant="outline" className="bg-red-500/10 text-red-500">
                {displayedSellStocks.length} Stocks
              </Badge>
            </div>
            <CardDescription>Stocks showing strong bearish momentum for intraday selling</CardDescription>
          </CardHeader>
          <CardContent>
            {renderStockTable(displayedSellStocks, "advanceSell")}
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-yellow-500" />
            Trading Disclaimer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            The information provided in the 9:15 Booster is for informational purposes only and should not be considered as financial advice. Trading in financial markets involves risk, and past performance is not indicative of future results. Always conduct your own research and consider your financial situation before making any investment decisions. The buy/sell signals are generated based on technical indicators and may not always be accurate. Use these recommendations at your own risk.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
