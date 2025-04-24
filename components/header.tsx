"use client"

import { useEffect, useState } from "react"
import type React from "react"
import axios from "axios"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  BarChart2,
  ChevronDown,
  Globe,
  TrendingUp,
  Activity,
  PieChart,
  Home,
  Clock,
  LineChart,
  ArrowUpRight,
  Zap,
  Newspaper,
  Wrench,
  ExternalLink,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ThemeToggle } from "@/components/theme-toggle"
import { cn } from "@/lib/utils"
import { Logo } from "@/components/logo"
import { MobileNav } from "@/components/mobile-nav"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Logo component for consistent styling across navigation
interface SectionLogoProps {
  path: string
  currentPath?: string
  children: React.ReactNode
  label: string
  isMobile?: boolean
  className?: string
  onClick?: () => void
}

const SectionLogo = ({
  path,
  currentPath,
  children,
  label,
  isMobile = false,
  className,
  onClick,
}: SectionLogoProps) => {
  const isActive = currentPath === path

  return (
    <Link
      href={path}
      className={cn(
        "group flex items-center gap-2 rounded-md transition-all duration-200",
        isMobile ? "px-3 py-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800" : "hover:text-primary",
        isActive && "text-primary font-medium",
        className,
      )}
      onClick={onClick}
    >
      {children && <div className="relative flex items-center justify-center">{children}</div>}
      <span>{label}</span>
    </Link>
  )
}
interface StockItem {
  nsecode: string
  close: number
  volume: number
  per_chg: number
  side: string
}

const INDEX_SYMBOLS = {
  NIFTY: "NIFTY",
  BANKNIFTY: "BANKNIFTY",
  FINNIFTY: "NIFTYFINSERVICE",
}

export default function Header() {
  // This would typically come from a router in a real app
  const currentPath = typeof window !== "undefined" ? window.location.pathname : "/"
  const [isMediumScreen, setIsMediumScreen] = useState(false)
  const [activeTab, setActiveTab] = useState("gainers")
  const [indexData, setIndexData] = useState<Record<string, StockItem | null>>({
    NIFTY: null,
    BANKNIFTY: null,
    FINNIFTY: null,
  })

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth
      setIsMediumScreen(width >= 766 && width < 1022)
    }

    checkScreenSize()
    window.addEventListener("resize", checkScreenSize)
    return () => window.removeEventListener("resize", checkScreenSize)
  }, [])

  useEffect(() => {
    const fetchIndexData = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/stocks`)
        const allStocks = response.data as StockItem[]
        const zeroVolumeStocks = allStocks.filter(
          (s) => s.side === "zeroVolume"
        )

        const getStock = (symbol: string) =>
          zeroVolumeStocks.find(
            (s) => s.nsecode.toUpperCase() === symbol.toUpperCase()
          ) || null

        setIndexData({
          NIFTY: getStock(INDEX_SYMBOLS.NIFTY),
          BANKNIFTY: getStock(INDEX_SYMBOLS.BANKNIFTY),
          FINNIFTY: getStock(INDEX_SYMBOLS.FINNIFTY),
        })
      } catch (err) {
        console.error("Error fetching index data:", err)
      }
    }

    fetchIndexData()
    const interval = setInterval(fetchIndexData, 60000)
    return () => clearInterval(interval)
  }, [])
// top gainer, loser, volume section

  const [topGainers, setTopGainers] = useState<StockItem[]>([])
const [topLosers, setTopLosers] = useState<StockItem[]>([])
const [volumeLeaders, setVolumeLeaders] = useState<StockItem[]>([])

const fetchStockLists = async () => {
  try {
    const res = await fetch("http://localhost:5000/stocks")
    const data: StockItem[] = await res.json()

    const gainers = data
      .filter((item) => item.side === "topGainers")
      .sort((a, b) => b.per_chg - a.per_chg)
      .slice(0, 6)

    const losers = data
      .filter((item) => item.side === "topLosers")
      .sort((a, b) => a.per_chg - b.per_chg)
      .slice(0, 6)

      const volumeLeaders = data
      .filter((item) => item.side === "volumeGainers" && item.close >= 100)
      .sort((a, b) => b.volume - a.volume)
      .slice(0, 6)
    

    setTopGainers(gainers)
    setTopLosers(losers)
    setVolumeLeaders(volumeLeaders)
  } catch (err) {
    console.error("Failed to fetch stock data:", err)
  }
}


useEffect(() => {
  fetchStockLists()
  const interval = setInterval(fetchStockLists, 60000)
  return () => clearInterval(interval)
}, [])

  // Check if we're in the medium screen range (766-1022px)
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth
      setIsMediumScreen(width >= 766 && width < 1022)
    }

    // Initial check
    checkScreenSize()

    // Add event listener
    window.addEventListener("resize", checkScreenSize)

    // Cleanup
    return () => window.removeEventListener("resize", checkScreenSize)
  }, [])

  // Logo components for each section
  const HomeLogo = ({ isMobile = false }) => (
    <div className="relative">
      <Home className={cn("text-indigo-500", isMobile ? "h-5 w-5" : "h-4 w-4")} />
    </div>
  )

  const MomentumMatrixLogo = ({ isMobile = false }) => (
    <div className="relative">
      <PieChart className={cn("text-purple-500", isMobile ? "h-5 w-5" : "h-4 w-4")} />
      <LineChart
        className={cn("absolute -bottom-1 -right-1", isMobile ? "h-3 w-3" : "h-2.5 w-2.5", "text-purple-700")}
      />
    </div>
  )

  const IntradayBoosterLogo = ({ isMobile = false }) => (
    <div className="relative">
      <Clock className={cn("text-amber-500", isMobile ? "h-5 w-5" : "h-4 w-4")} />
      <Zap className={cn("absolute -top-1 -right-1", isMobile ? "h-3 w-3" : "h-2.5 w-2.5", "text-amber-600")} />
    </div>
  )

  const MarketBeatsLogo = ({ isMobile = false }) => (
    <div className="relative">
      <Activity className={cn("text-green-500", isMobile ? "h-5 w-5" : "h-4 w-4")} />
      <ArrowUpRight
        className={cn("absolute -top-1 -right-1", isMobile ? "h-3 w-3" : "h-2.5 w-2.5", "text-green-700")}
      />
    </div>
  )

  const SwingTradeLogo = ({ isMobile = false }) => (
    <div className="relative">
      <Globe className={cn("text-blue-500", isMobile ? "h-5 w-5" : "h-4 w-4")} />
      <TrendingUp
        className={cn("absolute -bottom-1 -right-1", isMobile ? "h-3 w-3" : "h-2.5 w-2.5", "text-blue-700")}
      />
    </div>
  )

  const OIGainerLogo = ({ isMobile = false }) => (
    <div className="relative">
      <BarChart2 className={cn("text-emerald-500", isMobile ? "h-5 w-5" : "h-4 w-4")} />
      <TrendingUp
        className={cn("absolute -top-1 -right-1", isMobile ? "h-3 w-3" : "h-2.5 w-2.5", "text-emerald-700")}
      />
    </div>
  )

  const NewsLogo = ({ isMobile = false }) => (
    <div className="relative">
      <Newspaper className={cn("text-slate-500", isMobile ? "h-5 w-5" : "h-4 w-4")} />
    </div>
  )

  const ToolsLogo = ({ isMobile = false }) => (
    <div className="relative">
      <Wrench className={cn("text-gray-500", isMobile ? "h-5 w-5" : "h-4 w-4")} />
    </div>
  )

  // Navigation items for medium screens
  const mediumScreenNavItems = [
    { path: "/", label: "Home", logo: <HomeLogo /> },
    { path: "/intraday-booster", label: "9:15 Booster", logo: <IntradayBoosterLogo /> },
    { path: "/swing-trade", label: "Swing Trade", logo: <SwingTradeLogo /> },
  ]
  const formatChange = (change: number) => {
    const formatted = `${change > 0 ? "+" : ""}${change.toFixed(2)}%`
    return (
      <span className={change >= 0 ? "text-green-500" : "text-red-500"}>
        {formatted}
      </span>
    )
  }

  const formatClose = (close: number) =>
    close.toLocaleString("en-IN", { minimumFractionDigits: 2 })

  const renderIndex = (label: string, data: StockItem | null) => {
    if (!data) return null
    return (
      <div className="flex items-center gap-1 md:gap-2">
        <span className="text-gray-400">{label}</span>
        <span className="font-medium">{formatClose(data.close)}</span>
        {formatChange(data.per_chg)}
      </div>
    )
  }
  // Get the view all link based on active tab
  const getViewAllLink = () => {
    switch (activeTab) {
      case "gainers":
        return "https://chartink.com/screener/copy-top-gainers-3782"
      case "losers":
        return "https://chartink.com/screener/top-losers-25016"
      case "volume":
        return "https://chartink.com/screener/copy-strong-volume-gainers-633"
      default:
        return "https://chartink.com/screener/copy-top-gainers-3782"
    }
  }

  // Get the tooltip text based on active tab
  const getTooltipText = () => {
    switch (activeTab) {
      case "gainers":
        return "View all top gaining stocks on Chartink"
      case "losers":
        return "View all top losing stocks on Chartink"
      case "volume":
        return "View all volume leaders on Chartink"
      default:
        return "View all market data on Chartink"
    }
  }
  const [indices, setIndices] = useState<StockItem[]>([])

  const fetchIndices = async () => {
    try {
      const res = await fetch("http://localhost:5000/stocks")
      const data = await res.json()
      const indexData = data.filter(
        (item: StockItem) =>
          item.side === "zeroVolume" &&
          ["NIFTY", "BANKNIFTY", "NIFTYFINSERVICE"].includes(item.nsecode)
      )
      setIndices(indexData)
    } catch (error) {
      console.error("Failed to fetch index data:", error)
    }
  }
  useEffect(() => {
    fetchIndices()
    const interval = setInterval(fetchIndices, 60000)
    return () => clearInterval(interval)
  }, [])

  const getColor = (code: string) => {
    const item = indices.find(i => i.nsecode === code)
    if (!item) return "text-gray-500"
    return item.close > 0 ? "text-green-500" : "text-red-500"
  }

  const getClose = (code: string) => {
    const item = indices.find(i => i.nsecode === code)
    return item ? `₹${item.close}` : "-"
  }
  return (
    <header className="w-full border-b backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center px-4">
        {/* Mobile menu trigger - visible on small screens */}
        <MobileNav currentPath={currentPath} />

        {/* TradeWizard logo - visible on all screen sizes */}
        <Logo className="mr-4 lg:mr-6" />

        {/* Medium screen navigation - visible only in the medium screen range */}
        {isMediumScreen && (
          <div className="flex items-center">
            <nav className="flex items-center">
              {mediumScreenNavItems.map((item) => (
                <SectionLogo
                  key={item.path}
                  path={item.path}
                  currentPath={currentPath}
                  label={item.label}
                  className="px-2 text-xs font-medium"
                >
                  {item.logo}
                </SectionLogo>
              ))}

              {/* Dropdown for additional items */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-1 px-2 text-xs font-medium h-8 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
                  >
                    More
                    <ChevronDown className="h-3 w-3 ml-1 opacity-70" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 p-1">
                  <DropdownMenuItem asChild className="flex items-center gap-2 py-1.5 px-2 rounded-md">
                    <Link href="/market-beats" className="flex w-full items-center gap-2">
                      <MarketBeatsLogo />
                      <span className="text-sm">Market Beats</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="flex items-center gap-2 py-1.5 px-2 rounded-md">
                    <Link href="/momentum-matrix" className="flex w-full items-center gap-2">
                      <MomentumMatrixLogo />
                      <span className="text-sm">Momentum Matrix</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="flex items-center gap-2 py-1.5 px-2 rounded-md">
                    <Link href="/oi-gainer" className="flex w-full items-center gap-2">
                      <OIGainerLogo />
                      <span className="text-sm">OI Gainer</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="flex items-center gap-2 py-1.5 px-2 rounded-md">
                    <Link href="/news" className="flex w-full items-center gap-2">
                      <NewsLogo />
                      <span className="text-sm">News</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="flex items-center gap-2 py-1.5 px-2 rounded-md">
                    <Link href="/global-news" className="flex w-full items-center gap-2">
                      <Globe className="h-4 w-4" />
                      <span className="text-sm">Global News</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="flex items-center gap-2 py-1.5 px-2 rounded-md">
                    <Link href="/tools" className="flex w-full items-center gap-2">
                      <ToolsLogo />
                      <span className="text-sm">Tools</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </nav>
          </div>
        )}

        {/* Desktop navigation - visible on large screens */}
        <nav className="hidden lg:flex items-center gap-4 xl:gap-6 text-sm">
          <SectionLogo path="/" currentPath={currentPath} label="Home">
            <HomeLogo />
          </SectionLogo>

          <SectionLogo path="/intraday-booster" currentPath={currentPath} label="9:15 Booster">
            <IntradayBoosterLogo />
          </SectionLogo>

          <SectionLogo path="/swing-trade" currentPath={currentPath} label="Swing Trade">
            <SwingTradeLogo />
          </SectionLogo>

          <SectionLogo path="/market-beats" currentPath={currentPath} label="Market Beats">
            <MarketBeatsLogo />
          </SectionLogo>

          <SectionLogo path="/momentum-matrix" currentPath={currentPath} label="Momentum Matrix">
            <MomentumMatrixLogo />
          </SectionLogo>

          <SectionLogo path="/oi-gainer" currentPath={currentPath} label="OI Gainer">
            <OIGainerLogo />
          </SectionLogo>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-1 p-1">
                More
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href="/news" className="flex w-full items-center gap-2">
                  <NewsLogo />
                  News
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/global-news" className="flex w-full items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Global News
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/tools" className="flex w-full items-center gap-2">
                  <ToolsLogo />
                  Tools
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:gap-4">
          <ThemeToggle />
        </div>
      </div>

      {/* Market Beats Section */}
      <div className="border-t bg-gray-50 dark:bg-muted/50">
        <div className="container px-4 py-2">
          <div className="flex items-center overflow-x-auto whitespace-nowrap gap-4 md:gap-6 text-xs md:text-sm">
            {renderIndex("NIFTY", indexData.NIFTY)}
            {renderIndex("BANKNIFTY", indexData.BANKNIFTY)}
            {renderIndex("FINNIFTY", indexData.FINNIFTY)}
          </div>
        </div>
      </div>

      {/* Momentum Matrix Section */}
      <div className="border-t bg-gray-50 dark:bg-muted/30">
        <div className="container px-4 py-2">
          <Tabs defaultValue="gainers" className="w-full" onValueChange={(value) => setActiveTab(value)}>
            <div className="flex items-center justify-between">
              <TabsList className="bg-transparent h-7 md:h-8">
                <TabsTrigger value="gainers" className="text-xs h-7 md:h-8 px-2 md:px-3">
                  Top Gainers
                </TabsTrigger>
                <TabsTrigger value="losers" className="text-xs h-7 md:h-8 px-2 md:px-3">
                  Top Losers
                </TabsTrigger>
                <TabsTrigger value="volume" className="text-xs h-7 md:h-8 px-2 md:px-3">
                  Volume Leaders
                </TabsTrigger>
              </TabsList>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href={getViewAllLink()}
                      className="group inline-flex h-5 items-center rounded-full bg-primary/10 px-2 text-[10px] font-medium text-primary hover:bg-primary/20 transition-all duration-200 hover:scale-105"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span>View All</span>
                      <ExternalLink className="ml-0.5 h-2.5 w-2.5 opacity-70 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="text-xs">
                    {getTooltipText()}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <TabsContent value="gainers" className="mt-0 pt-2">
  <div className="flex items-center overflow-x-auto whitespace-nowrap gap-4 md:gap-6 text-xs">
    {topGainers.map((stock) => (
      <div key={stock.nsecode} className="flex flex-col">
        <span className="font-medium">{stock.nsecode}</span>
        <span className="text-green-500">{`+${stock.per_chg.toFixed(2)}%`}</span>
      </div>
    ))}
  </div>
</TabsContent>

<TabsContent value="losers" className="mt-0 pt-2">
  <div className="flex items-center overflow-x-auto whitespace-nowrap gap-4 md:gap-6 text-xs">
    {topLosers.map((stock) => (
      <div key={stock.nsecode} className="flex flex-col">
        <span className="font-medium">{stock.nsecode}</span>
        <span className="text-red-500">{`${stock.per_chg.toFixed(2)}%`}</span>
      </div>
    ))}
  </div>
</TabsContent>

<TabsContent value="volume" className="mt-0 pt-2">
  <div className="flex items-center overflow-x-auto whitespace-nowrap gap-4 md:gap-6 text-xs">
    {[...volumeLeaders]
      .sort((a, b) => b.volume - a.volume)
      .slice(0, 6)
      .map((stock) => (
        <div key={stock.nsecode} className="flex flex-col">
         <span className="font-medium">{stock.nsecode}</span>
<span className="text-gray-400">
   {(stock.volume / 1_000_000).toFixed(1)}M
</span>

        </div>
      ))}
  </div>
</TabsContent>


          </Tabs>
        </div>
      </div>
    </header>
  )
}
