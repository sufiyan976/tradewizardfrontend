"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart2, Globe, Activity, X, ChevronDown, ChevronUp, Info, CheckCircle2, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import MarketAnimation from "@/components/market-animation"
import NewsWidget from "@/components/news-widget"
import { useRouter } from "next/navigation"

export default function Home() {
  const [showLearnMore, setShowLearnMore] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const router = useRouter()
  const tradingFeaturesRef = useRef<HTMLElement>(null)

  // Check if screen is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768) // 768px is the md breakpoint in Tailwind
    }

    // Initial check
    checkIfMobile()

    // Add event listener for window resize
    window.addEventListener("resize", checkIfMobile)

    // Cleanup
    return () => window.removeEventListener("resize", checkIfMobile)
  }, [])

  const toggleLearnMore = () => {
    setShowLearnMore(!showLearnMore)
  }

  const scrollToFeatures = () => {
    tradingFeaturesRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl font-bold mb-4">Discover the Best Trading Opportunities</h1>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              TradeWizard helps you identify potential trading opportunities with advanced analytics and real-time
              market data.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white dark:text-white" onClick={scrollToFeatures}>
                Get Started
              </Button>
              <Button
                variant="outline"
                className="border-blue-600 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-950"
                onClick={toggleLearnMore}
              >
                {showLearnMore ? (
                  <>
                    Hide Details
                    <ChevronUp className="ml-2 h-4 w-4" />
                  </>
                ) : (
                  <>
                    Learn More
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
          {/* Only show animation if not in mobile mode or if learn more is not shown on mobile */}
          {(!isMobile || (isMobile && !showLearnMore)) && <MarketAnimation />}
        </div>
      </section>

      {showLearnMore && (
        <section className="mb-12 animate-in fade-in duration-300">
          <Card className="border-blue-600/20 bg-blue-100 dark:bg-blue-950/10">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-2xl text-blue-600 dark:text-blue-400">About TradeWizard</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleLearnMore}
                  className="text-gray-500 dark:text-gray-400 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <CardDescription>Your comprehensive guide to effective trading</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-2 flex items-center">
                  <Info className="mr-2 h-5 w-5" />
                  What is TradeWizard?
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  TradeWizard is a comprehensive trading platform designed to help traders of all levels identify
                  potential trading opportunities across various financial markets. Our platform combines advanced
                  analytics, real-time market data, and intuitive visualization tools to provide you with actionable
                  insights for making informed trading decisions.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-2 flex items-center">
                    <CheckCircle2 className="mr-2 h-5 w-5" />
                    Key Features
                  </h3>
                  <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                    <li className="flex items-start">
                      <span className="text-blue-600 dark:text-blue-400 mr-2">•</span>
                      <span>
                        <strong>Market Overview:</strong> Get a quick snapshot of global markets, including indices,
                        stocks, cryptocurrencies, and more.
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 dark:text-blue-400 mr-2">•</span>
                      <span>
                        <strong>Intraday Booster:</strong> Discover high-probability intraday trading opportunities with
                        clear entry, target, and stop-loss levels.
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 dark:text-blue-400 mr-2">•</span>
                      <span>
                        <strong>Sector Scope:</strong> Analyze sector performance and identify trending sectors for
                        potential investments.
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 dark:text-blue-400 mr-2">•</span>
                      <span>
                        <strong>Market Pulse:</strong> Stay updated with market breadth, volatility, and institutional
                        activity.
                      </span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-2 flex items-center">
                    <CheckCircle2 className="mr-2 h-5 w-5" />
                    How to Use TradeWizard
                  </h3>
                  <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                    <li className="flex items-start">
                      <span className="text-blue-600 dark:text-blue-400 mr-2">1.</span>
                      <span>
                        <strong>Explore Markets:</strong> Browse through different market segments to get a
                        comprehensive view of the financial landscape.
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 dark:text-blue-400 mr-2">2.</span>
                      <span>
                        <strong>Analyze Sectors:</strong> Identify strong and weak sectors to focus your trading
                        strategy.
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 dark:text-blue-400 mr-2">3.</span>
                      <span>
                        <strong>Find Opportunities:</strong> Use the Intraday Booster to discover potential trading
                        setups with defined risk parameters.
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 dark:text-blue-400 mr-2">4.</span>
                      <span>
                        <strong>Stay Informed:</strong> Keep track of market-moving news and events through the Market
                        Pulse section.
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              <Alert className="bg-blue-50 dark:bg-blue-950/30 border-blue-600/30">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Important Note</AlertTitle>
                <AlertDescription>
                  Trading involves risk. The information provided on TradeWizard is for educational and informational
                  purposes only and should not be considered as financial advice. Always conduct your own research and
                  consider your financial situation before making any investment decisions.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </section>
      )}

      <section className="mb-12" ref={tradingFeaturesRef}>
        <h2 className="text-2xl font-bold mb-6">Trading Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card
            className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => {
              window.scrollTo({ top: 0, behavior: "smooth" })
              router.push("/intraday-booster")
            }}
          >
            <CardHeader>
              <BarChart2 className="h-10 w-10 text-blue-500 mb-2" />
              <CardTitle>Intraday Booster</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 dark:text-gray-400">
                Discover high-probability intraday trading opportunities with clear entry levels. Identify potential
                trading setups with defined risk parameters for day trading.
              </p>
            </CardContent>
          </Card>
          <Card
            className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => {
              window.scrollTo({ top: 0, behavior: "smooth" })
              router.push("/swing-trade")
            }}
          >
            <CardHeader>
              <Globe className="h-10 w-10 text-blue-500 mb-2" />
              <CardTitle>Swing Trade</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 dark:text-gray-400">
                Discover medium-term trading opportunities with our swing trading analysis. Identify potential multi-day
                price movements with defined entry and exit points.
              </p>
            </CardContent>
          </Card>
          <Card
            className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => {
              window.scrollTo({ top: 0, behavior: "smooth" })
              router.push("/market-beats")
            }}
          >
            <CardHeader>
              <Activity className="h-10 w-10 text-blue-500 mb-2" />
              <CardTitle>Market Beats</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 dark:text-gray-400">
                Stay updated with market breadth, volatility, and institutional activity. Get real-time insights into
                market sentiment and key indicators driving market movements.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-3">
            <h2 className="text-2xl font-bold mb-6">Latest News</h2>
            <NewsWidget />
          </div>
        </div>
      </section>
    </div>
  )
}
