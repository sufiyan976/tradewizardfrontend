"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Construction, Clock } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function MomentumMatrix() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
        <h1 className="text-3xl font-bold">Momentum Matrix</h1>
        <div className="text-sm text-gray-500 dark:text-gray-400 mt-2 md:mt-0">Coming Soon</div>
      </div>

      <Alert className="mb-8 border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20">
        <Construction className="h-5 w-5 text-yellow-600 dark:text-yellow-500" />
        <AlertTitle className="text-yellow-600 dark:text-yellow-500">Under Development</AlertTitle>
        <AlertDescription className="text-yellow-600 dark:text-yellow-500">
          This feature is currently under active development and will be available soon.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 gap-6 mb-8">
        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Coming Soon: Momentum Matrix
            </CardTitle>
            <CardDescription>A comprehensive sector and stock momentum analysis tool</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">What is Momentum Matrix?</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Momentum Matrix is an advanced analytical tool designed to help traders identify sectors and stocks with
                strong momentum. By analyzing various technical indicators and market trends, this tool provides a
                comprehensive view of market momentum across different sectors of the Indian stock market.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Key Features</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300">
                <li>
                  <span className="font-medium">Sector Performance Analysis:</span> Visual representation of sector-wise
                  performance with daily percentage changes.
                </li>
                <li>
                  <span className="font-medium">Volume Leaders:</span> Identification of sectors with significant
                  trading volumes, indicating potential market interest.
                </li>
                <li>
                  <span className="font-medium">Top Performing Stocks:</span> Detailed breakdown of the best-performing
                  stocks within each sector.
                </li>
                <li>
                  <span className="font-medium">Momentum Strength Indicator:</span> Proprietary M-Strength score that
                  quantifies momentum based on volume and price action.
                </li>
                <li>
                  <span className="font-medium">Interactive Sector Navigation:</span> Seamless navigation between
                  sectors to analyze stock-specific momentum.
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Development Status</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Our development team is actively working on finalizing the Momentum Matrix feature. We are currently:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300 mt-2">
                <li>Optimizing the data processing algorithms for real-time market analysis</li>
                <li>Enhancing the visual representation of momentum indicators</li>
                <li>Implementing advanced filtering capabilities for sector and stock selection</li>
                <li>Fine-tuning the M-Strength calculation methodology for improved accuracy</li>
                <li>Conducting extensive testing with historical market data</li>
              </ul>
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
              <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                We anticipate launching the Momentum Matrix feature in the coming weeks. Thank you for your patience as
                we work to deliver a powerful and reliable tool for your trading arsenal.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-yellow-500" />
            Trading Disclaimer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            The information provided in the Momentum Matrix is for informational purposes only and should not be
            considered as financial advice. Trading in financial markets involves risk, and past performance is not
            indicative of future results. Always conduct your own research and consider your financial situation before
            making any investment decisions. The sector analysis and stock information are generated based on technical
            and fundamental indicators and may not always be accurate. Use these recommendations at your own risk.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
