"use client"

import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function DisclaimerPage() {
  const router = useRouter()

  const handleRefundPolicyNavigation = () => {
    router.push("/refund-policy")

    // Add a small delay to ensure navigation completes before scrolling
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }, 100)
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-8">
        <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
      </div>

      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-6">Disclaimer</h1>
          <div className="prose dark:prose-invert max-w-none">
            <h2 className="text-xl font-semibold mt-8 mb-4">Investment Disclaimer</h2>
            <p>
              The information provided on TradeWizard is for general informational purposes only and should not be
              considered as financial advice. All information on this website is provided in good faith, however, we
              make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy,
              validity, reliability, availability, or completeness of any information on the website.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">No Financial Advice</h2>
            <p>
              The information contained on this website is not intended as, and shall not be understood or construed as,
              financial advice. We are not an attorney, accountant, or financial advisor, nor are we holding ourselves
              out to be. The information contained on this website is not a substitute for financial advice from a
              professional who is aware of the facts and circumstances of your individual situation.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">Investment Risks</h2>
            <p>
              Trading and investing in financial markets involves risk. The content on this site should not be
              considered investment advice. Past performance is not a guarantee of future returns. It's possible to lose
              money in the stock market, and users should invest at their own risk.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">Market Data</h2>
            <p>
              While we strive to provide accurate and timely market data, we cannot guarantee the accuracy,
              completeness, or timeliness of the information. Market data may be delayed, and users should verify
              information from other sources before making investment decisions.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">External Links</h2>
            <p>
              This website may contain links to external websites that are not provided or maintained by or in any way
              affiliated with TradeWizard. Please note that we do not guarantee the accuracy, relevance, timeliness, or
              completeness of any information on these external websites.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">Consult with Professionals</h2>
            <p>
              We strongly recommend that before making any investment or trading decisions, you should consult with a
              licensed financial advisor and conduct thorough research. Any investment decision that you make should be
              based on your own research and evaluation of the risks involved.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">Website Under Development</h2>
            <p>
              Please note that TradeWizard is currently under active development. Features, functionality, and content
              may change or be incomplete. We're working diligently to improve the platform and appreciate your patience
              during this process. Some sections may be placeholder content and certain features might not be fully
              operational yet.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">Refunds</h2>
            <p>
              For details regarding refunds, please refer to our{" "}
              <button
                onClick={handleRefundPolicyNavigation}
                className="text-blue-600 hover:text-blue-800 underline cursor-pointer"
              >
                Refund Policy
              </button>
              .
            </p>

            <p className="mt-8">
              Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
