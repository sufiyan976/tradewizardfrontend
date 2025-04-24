"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Construction, Clock, TrendingUp } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function OIGainerPage() {
  return (
    <div className="container px-4 py-6 sm:py-8 mx-auto max-w-full overflow-hidden">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">OI Gainer Analysis</h1>

      <Alert className="mb-6 border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20">
        <Construction className="h-5 w-5 text-yellow-600 dark:text-yellow-500" />
        <AlertTitle className="text-yellow-600 dark:text-yellow-500">Under Development</AlertTitle>
        <AlertDescription className="text-yellow-600 dark:text-yellow-500">
          This feature is currently under active development and will be available soon.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6">
        <Card className="overflow-hidden">
          <CardHeader className="px-4 sm:px-6">
            <CardTitle className="text-xl flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Coming Soon: OI Gainer Analysis
            </CardTitle>
            <CardDescription className="text-sm">Advanced open interest analysis for options traders</CardDescription>
          </CardHeader>
          <CardContent className="px-4 sm:px-6 space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">What is OI Gainer Analysis?</h3>
              <p className="text-gray-600 dark:text-gray-300">
                OI Gainer Analysis is a specialized tool designed for options traders to track significant changes in
                open interest (OI) across various stocks and indices. Open Interest represents the total number of
                outstanding derivative contracts that have not been settled, and changes in OI can provide valuable
                insights into market sentiment and potential price movements.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Key Features</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300">
                <li>
                  <span className="font-medium">Real-time OI Tracking:</span> Monitor open interest changes as they
                  happen throughout the trading day.
                </li>
                <li>
                  <span className="font-medium">OI Gainers & Losers:</span> Identify stocks with the most significant
                  increases and decreases in open interest.
                </li>
                <li>
                  <span className="font-medium">Call-Put OI Ratio:</span> Analyze the ratio between call and put options
                  to gauge market sentiment.
                </li>
                <li>
                  <span className="font-medium">Strike Price Analysis:</span> Visualize OI concentration across
                  different strike prices.
                </li>
                <li>
                  <span className="font-medium">Historical OI Comparison:</span> Compare current OI levels with
                  historical patterns to identify anomalies.
                </li>
                <li>
                  <span className="font-medium">OI Build-up Patterns:</span> Recognize long build-up, short build-up,
                  long unwinding, and short covering patterns.
                </li>
              </ul>
            </div>

            <div className="flex items-center justify-center py-8">
              <div className="flex flex-col items-center gap-3 text-gray-400">
                <TrendingUp className="h-16 w-16 opacity-20" />
                <p className="text-center">Visual representation of OI data will appear here</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Development Status</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Our development team is actively working on finalizing the OI Gainer Analysis feature. We are currently:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300 mt-2">
                <li>Establishing reliable data feeds for real-time OI information</li>
                <li>Developing algorithms to identify meaningful OI patterns</li>
                <li>Creating intuitive visualizations for complex OI relationships</li>
                <li>Implementing filtering and sorting capabilities for customized analysis</li>
                <li>Optimizing performance for handling large volumes of options data</li>
                <li>Testing the system with historical options data to ensure accuracy</li>
              </ul>
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
              <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                We anticipate launching the OI Gainer Analysis feature in the coming weeks. Thank you for your patience
                as we work to deliver a powerful tool for options traders.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-4 sm:mt-6 text-xs sm:text-sm text-muted-foreground px-1">
        <p className="mt-2">
          <strong>Disclaimer:</strong> This product is intended for informational purposes only and does not constitute
          financial advice. Trading in options involves risk, and you could lose money. Consult with a financial advisor
          before making any investment decisions.
        </p>
      </div>
    </div>
  )
}
