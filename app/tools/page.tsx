"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart2,
  PieChart,
  Activity,
  Globe,
  Calendar,
  LineChart,
  Layers,
  TrendingUp,
  AlertCircle,
  Info,
  CheckCircle2,
} from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function Tools() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="container mx-auto px-4 py-8" id="tools">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h1 className="text-3xl font-bold">TradeWizard Tools Guide</h1>
        <div className="text-sm text-gray-500 dark:text-gray-400 mt-2 md:mt-0">Comprehensive guide to all features</div>
      </div>

      <Alert className="mb-8 bg-blue-50 dark:bg-blue-950/30 border-blue-600/30">
        <Info className="h-4 w-4" />
        <AlertTitle>Getting Started</AlertTitle>
        <AlertDescription>
          This guide provides detailed information about all the tools and features available on TradeWizard. Use the
          tabs below to navigate to specific sections.
        </AlertDescription>
      </Alert>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-8">
        <TabsList className="bg-white dark:bg-gray-900 mb-6 flex flex-wrap h-auto py-1">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="momentum-matrix">Momentum Matrix</TabsTrigger>
          <TabsTrigger value="915-booster">9:15 Booster</TabsTrigger>
          <TabsTrigger value="market-beats">Market Beats</TabsTrigger>
          <TabsTrigger value="swing-trade">Swing Trade</TabsTrigger>
          <TabsTrigger value="oi-gainer">OI Gainer</TabsTrigger>
          <TabsTrigger value="navigation">Navigation</TabsTrigger>
        </TabsList>

        {/* Overview Section */}
        <TabsContent value="overview">
          <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5 text-blue-500" />
                TradeWizard Platform Overview
              </CardTitle>
              <CardDescription>Understanding the core features and navigation of TradeWizard</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">What is TradeWizard?</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  TradeWizard is a comprehensive trading platform designed to help traders identify potential trading
                  opportunities across various segments of the Indian stock market. The platform combines advanced
                  analytics, real-time market data, and intuitive visualization tools to provide actionable insights for
                  making informed trading decisions.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Core Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-2">
                    <PieChart className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Momentum Matrix</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Analyze sector performance and identify trending sectors for potential investments.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <BarChart2 className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium">9:15 Booster</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Discover high-probability intraday trading opportunities with clear entry, target, and stop-loss
                        levels.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Activity className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Market Beats</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Stay updated with market breadth, volatility, and institutional activity.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Globe className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Swing Trade</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Identify potential swing trading opportunities using various technical patterns and indicators.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Getting Started</h3>
                <ol className="list-decimal list-inside space-y-2 text-gray-600 dark:text-gray-300">
                  <li>
                    <span className="font-medium">Explore the Dashboard:</span> Start by exploring the homepage
                    dashboard to get a quick overview of market conditions.
                  </li>
                  <li>
                    <span className="font-medium">Check Sector Performance:</span> Use the Momentum Matrix to identify
                    which sectors are performing well.
                  </li>
                  <li>
                    <span className="font-medium">Find Trading Opportunities:</span> Navigate to 9:15 Booster or Swing
                    Trade sections based on your trading style.
                  </li>
                  <li>
                    <span className="font-medium">Stay Informed:</span> Regularly check Market Beats and News sections
                    to stay updated with market developments.
                  </li>
                </ol>
              </div>

              <Alert className="bg-yellow-50 dark:bg-yellow-950/30 border-yellow-600/30">
                <AlertCircle className="h-4 w-4 text-yellow-500" />
                <AlertTitle>Important Note</AlertTitle>
                <AlertDescription className="text-gray-600 dark:text-gray-300">
                  TradeWizard provides information for educational and informational purposes only. Always conduct your
                  own research and consider consulting with a financial advisor before making investment decisions.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Momentum Matrix Section */}
        <TabsContent value="momentum-matrix">
          <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5 text-blue-500" />
                Momentum Matrix
              </CardTitle>
              <CardDescription>Analyzing sector performance and identifying trending sectors</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">What is Momentum Matrix?</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Momentum Matrix provides a comprehensive analysis of different sectors in the Indian stock market. It
                  helps you identify which sectors are trending, allowing you to focus your trading strategy on the most
                  promising areas of the market.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Key Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Sector Performance Visualization</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Visual representation of sector performance with percentage changes to quickly identify
                        outperforming sectors.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Sector Metrics</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Key performance indicators including volume leaders and daily performance metrics.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Top Performing Stocks</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Detailed list of top-performing stocks within each sector with relevant metrics.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Interactive Sector Selection</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Click on any sector to view its top-performing stocks and detailed metrics.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">How to Use Momentum Matrix</h3>
                <ol className="list-decimal list-inside space-y-2 text-gray-600 dark:text-gray-300">
                  <li>
                    <span className="font-medium">Identify Trending Sectors:</span> Look for sectors with strong
                    positive percentage changes.
                  </li>
                  <li>
                    <span className="font-medium">Analyze Volume Leaders:</span> Check which sectors have high trading
                    volumes, indicating strong interest.
                  </li>
                  <li>
                    <span className="font-medium">Explore Top Stocks:</span> Click on a sector to view its
                    top-performing stocks.
                  </li>
                  <li>
                    <span className="font-medium">Compare Metrics:</span> Analyze key metrics like P/E ratios, market
                    cap, and 52-week ranges to identify potential opportunities.
                  </li>
                </ol>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
                <h3 className="text-lg font-semibold mb-2">Pro Tip</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Focus on sectors showing both strong performance and high trading volumes. This combination often
                  indicates sustainable momentum rather than short-term fluctuations. Consider sector rotation
                  strategies by monitoring which sectors are gaining momentum while others are cooling off.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 9:15 Booster Section */}
        <TabsContent value="915-booster">
          <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart2 className="h-5 w-5 text-blue-500" />
                9:15 Booster
              </CardTitle>
              <CardDescription>Finding high-probability intraday trading opportunities</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">What is 9:15 Booster?</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  9:15 Booster is designed to help day traders identify high-probability trading opportunities in the
                  Indian stock market. It provides a curated list of stocks with clear entry, target, and stop-loss
                  levels for both bullish and bearish setups.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Key Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Bullish Buy Opportunities</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Stocks showing strong bullish momentum with potential for intraday gains.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Bearish Sell Opportunities</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Stocks showing strong bearish momentum with potential for intraday shorting.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Defined Risk Parameters</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Clear buy/sell ranges, target prices, and stop-loss levels for risk management.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Signal Strength Indicators</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Categorization of signals as "Strong Buy/Sell" or "Buy/Sell" based on conviction level.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">How to Use 9:15 Booster</h3>
                <ol className="list-decimal list-inside space-y-2 text-gray-600 dark:text-gray-300">
                  <li>
                    <span className="font-medium">Check Market Conditions:</span> Before using 9:15 Booster, assess the
                    overall market sentiment and volatility to ensure favorable conditions for day trading.
                  </li>
                  <li>
                    <span className="font-medium">Select Trading Direction:</span> Choose between bullish or bearish
                    setups based on your market outlook and trading preference.
                  </li>
                  <li>
                    <span className="font-medium">Review Signal Strength:</span> Prioritize "Strong Buy/Sell" signals
                    which indicate higher conviction levels.
                  </li>
                  <li>
                    <span className="font-medium">Set Entry, Target, and Stop-Loss:</span> Use the provided price levels
                    to set up your trades with proper risk management.
                  </li>
                </ol>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
                <h3 className="text-lg font-semibold mb-2">Pro Tip</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Always maintain a proper risk-to-reward ratio (minimum 1:2) for intraday trades. Consider the stock's
                  liquidity and average daily range before placing trades. It's advisable to focus on a few high-quality
                  setups rather than taking multiple positions simultaneously.
                </p>
              </div>

              <Alert className="bg-yellow-50 dark:bg-yellow-950/30 border-yellow-600/30">
                <AlertCircle className="h-4 w-4 text-yellow-500" />
                <AlertTitle>Risk Warning</AlertTitle>
                <AlertDescription className="text-gray-600 dark:text-gray-300">
                  Intraday trading involves significant risk and may not be suitable for all investors. The signals
                  provided are based on technical analysis and may not always result in profitable trades. Always use
                  proper risk management techniques and never risk more than you can afford to lose.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Market Beats Section */}
        <TabsContent value="market-beats">
          <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-500" />
                Market Beats
              </CardTitle>
              <CardDescription>Monitoring market breadth, volatility, and institutional activity</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">What is Market Beats?</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Market Beats provides a comprehensive overview of the current market conditions, including market
                  breadth, volatility, institutional activity, and key market signals. This information helps traders
                  understand the underlying strength or weakness of the market beyond just index movements.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Key Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Market Breadth</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Advances vs. Declines ratio to gauge the overall market participation and strength.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Market Volatility</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        India VIX (Volatility Index) to assess market fear and potential price swings.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium">FII/DII Activity</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Foreign and Domestic Institutional Investors' buying/selling patterns.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Market Movers</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Top gainers and losers to identify stocks with significant price movements.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">How to Use Market Beats</h3>
                <ol className="list-decimal list-inside space-y-2 text-gray-600 dark:text-gray-300">
                  <li>
                    <span className="font-medium">Assess Market Breadth:</span> A healthy market typically shows more
                    advances than declines. A divergence between market breadth and index movement can signal potential
                    reversals.
                  </li>
                  <li>
                    <span className="font-medium">Monitor Volatility:</span> High volatility (VIX) often indicates fear
                    in the market and potential for larger price swings. Low volatility suggests complacency.
                  </li>
                  <li>
                    <span className="font-medium">Track Institutional Activity:</span> Sustained buying by FIIs/DIIs can
                    indicate strong market momentum, while consistent selling might signal caution.
                  </li>
                  <li>
                    <span className="font-medium">Review Market News:</span> Stay updated with the latest market-moving
                    news to understand the factors driving market sentiment.
                  </li>
                </ol>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
                <h3 className="text-lg font-semibold mb-2">Pro Tip</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Pay special attention to divergences between market breadth and index movements. For example, if the
                  index is making new highs but market breadth is deteriorating (fewer stocks participating in the
                  rally), it could signal a potential market top. Similarly, if the index is falling but breadth is
                  improving, it might indicate a bottoming process.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Swing Trade Section */}
        <TabsContent value="swing-trade">
          <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-blue-500" />
                Swing Trade
              </CardTitle>
              <CardDescription>Identifying medium-term trading opportunities using technical patterns</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">What is Swing Trade?</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  The Swing Trade section helps identify potential medium-term trading opportunities that typically last
                  from a few days to a few weeks. It focuses on three powerful technical patterns: 52 Weeks High
                  breakouts, Volume Contraction Patterns (VCP), and 50 EMA Support bounces.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Key Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-start gap-2">
                    <Calendar className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium">52 Weeks High</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Stocks breaking out to new 52-week highs with strong momentum and volume, which often continue
                        their uptrend.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Layers className="h-5 w-5 text-purple-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium">VCP (Volume Contraction Pattern)</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Stocks showing tight price consolidation with decreasing volume, often preceding significant
                        breakouts.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <LineChart className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium">50 EMA Support</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Stocks bouncing off their 50-day Exponential Moving Average support, indicating potential
                        continuation of the uptrend.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">How to Use Swing Trade</h3>
                <ol className="list-decimal list-inside space-y-2 text-gray-600 dark:text-gray-300">
                  <li>
                    <span className="font-medium">Select a Pattern:</span> Choose from 52 Weeks High, VCP, or 50 EMA
                    Support based on your trading preference and market conditions.
                  </li>
                  <li>
                    <span className="font-medium">Analyze the Stocks:</span> Review the listed stocks and their metrics
                    to identify the most promising opportunities.
                  </li>
                  <li>
                    <span className="font-medium">Conduct Further Analysis:</span> Before trading, perform additional
                    technical analysis on the selected stocks to confirm the pattern.
                  </li>
                  <li>
                    <span className="font-medium">Set Risk Parameters:</span> Determine your entry, stop-loss, and
                    target levels based on the stock's volatility and your risk tolerance.
                  </li>
                </ol>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
                <h3 className="text-lg font-semibold mb-2">Pattern-Specific Tips</h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-blue-500">52 Weeks High</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Look for stocks breaking out with above-average volume. The stronger the volume on the breakout,
                      the more likely the trend will continue. Consider using the previous high as a reference for
                      setting stop-loss levels.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-purple-500">VCP (Volume Contraction Pattern)</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      The ideal VCP shows progressively tighter price ranges with decreasing volume, followed by a
                      breakout on high volume. This pattern works best in stocks with strong fundamentals and prior
                      uptrends.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-green-500">50 EMA Support</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      The most reliable bounces occur when the stock touches the 50 EMA but doesn't close significantly
                      below it. Look for a reversal candlestick pattern at the 50 EMA for additional confirmation.
                    </p>
                  </div>
                </div>
              </div>

              <Alert className="bg-yellow-50 dark:bg-yellow-950/30 border-yellow-600/30">
                <AlertCircle className="h-4 w-4 text-yellow-500" />
                <AlertTitle>Risk Management</AlertTitle>
                <AlertDescription className="text-gray-600 dark:text-gray-300">
                  Swing trading carries significant risk, especially during volatile market conditions. Always use
                  proper position sizing and stop-loss orders. Consider the overall market trend before entering swing
                  trades, as trading against the primary market trend reduces the probability of success.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        {/* OI Gainer Section */}
        <TabsContent value="oi-gainer">
          <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-500" />
                OI Gainer
              </CardTitle>
              <CardDescription>Tracking significant open interest changes in the options market</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">What is OI Gainer?</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  The OI Gainer tool helps you track stocks with significant open interest changes in the options
                  market. This can be a valuable indicator for identifying potential trading opportunities and market
                  sentiment. Open Interest (OI) represents the total number of outstanding derivative contracts that
                  have not been settled.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Key Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Real-time OI Tracking</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Monitor open interest changes across stocks in real-time to identify significant movements.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Percentage & Absolute Changes</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        View both percentage and absolute value changes in open interest for comprehensive analysis.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Price Correlation</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Analyze the correlation between OI changes and price movements to identify potential trends.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Customizable Analysis</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Sort data columns and search for specific stocks to customize your analysis.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">How to Use OI Gainer</h3>
                <ol className="list-decimal list-inside space-y-2 text-gray-600 dark:text-gray-300">
                  <li>
                    <span className="font-medium">Navigate to OI Gainer:</span> Access the OI Gainer page from the main
                    navigation menu.
                  </li>
                  <li>
                    <span className="font-medium">Review Significant Changes:</span> Look for stocks with substantial OI
                    changes (both positive and negative).
                  </li>
                  <li>
                    <span className="font-medium">Sort by Relevance:</span> Use the column headers to sort data based on
                    your analysis needs.
                  </li>
                  <li>
                    <span className="font-medium">Analyze Price Correlation:</span> Compare OI changes with price
                    movements to identify potential trading setups.
                  </li>
                  <li>
                    <span className="font-medium">Search for Specific Stocks:</span> Use the search function to find
                    particular stocks you're interested in.
                  </li>
                </ol>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
                <h3 className="text-lg font-semibold mb-2">Interpreting OI Changes</h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-green-500">Increasing OI + Increasing Price</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      When open interest increases along with price, it typically indicates new buying interest and
                      suggests bullish sentiment. This pattern often confirms an uptrend.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-red-500">Increasing OI + Decreasing Price</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      When open interest increases while price decreases, it often indicates new short positions being
                      established, suggesting bearish sentiment. This pattern typically confirms a downtrend.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-yellow-500">Decreasing OI + Price Movement</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      When open interest decreases, it indicates positions being closed. If price rises with decreasing
                      OI, it may suggest short covering. If price falls with decreasing OI, it may indicate long
                      liquidation.
                    </p>
                  </div>
                </div>
              </div>

              <Alert className="bg-yellow-50 dark:bg-yellow-950/30 border-yellow-600/30">
                <AlertCircle className="h-4 w-4 text-yellow-500" />
                <AlertTitle>Risk Warning</AlertTitle>
                <AlertDescription className="text-gray-600 dark:text-gray-300">
                  This product is intended for informational purposes only and does not constitute financial advice.
                  Trading in options involves risk, and you could lose money. Consult with a financial advisor before
                  making any investment decisions.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Navigation Section */}
        <TabsContent value="navigation">
          <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-500" />
                Navigation Guide
              </CardTitle>
              <CardDescription>Understanding the TradeWizard interface and navigation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Main Navigation</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  TradeWizard features a clean, intuitive navigation system that allows you to quickly access all the
                  platform's features.
                </p>
                <div className="mt-4 space-y-3">
                  <div className="flex items-start gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Home</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        The dashboard providing an overview of market conditions and key features.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <PieChart className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Momentum Matrix</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Sector analysis and performance tracking.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <BarChart2 className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium">9:15 Booster</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Intraday trading opportunities with defined risk parameters.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Activity className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Market Beats</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Market breadth, volatility, and institutional activity tracking.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Globe className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Swing Trade</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Medium-term trading opportunities based on technical patterns.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Additional Features</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium">News</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Latest market news and events affecting the Indian stock market. Access this through the "More"
                        dropdown in the header.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Tools</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        This comprehensive guide to all features available on TradeWizard. Access this through the
                        "More" dropdown in the header.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Market Overview</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Quick snapshot of major indices, stocks, and commodities on the homepage.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Mobile Navigation</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  TradeWizard is fully responsive and optimized for mobile devices. On smaller screens, the main
                  navigation collapses into a hamburger menu that can be accessed by tapping the menu icon in the
                  top-left corner.
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
                <h3 className="text-lg font-semibold mb-2">Keyboard Shortcuts</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium">Home Page:</span>
                    <span className="text-gray-500 dark:text-gray-400">Alt + H</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Momentum Matrix:</span>
                    <span className="text-gray-500 dark:text-gray-400">Alt + S</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">9:15 Booster:</span>
                    <span className="text-gray-500 dark:text-gray-400">Alt + I</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Market Beats:</span>
                    <span className="text-gray-500 dark:text-gray-400">Alt + M</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Swing Trade:</span>
                    <span className="text-gray-500 dark:text-gray-400">Alt + T</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">News:</span>
                    <span className="text-gray-500 dark:text-gray-400">Alt + N</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
