"use client"

import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function RefundPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <Link href="/" className="inline-flex items-center gap-2 mb-6 text-blue-500 hover:text-blue-600">
        <ArrowLeft className="h-4 w-4" />
        Back to Home
      </Link>

      <h1 className="text-3xl font-bold mb-6">Refund and Cancellation Policy</h1>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">No Refunds or Cancellations</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          TradeWizard does not offer refunds or cancellations for any of our services or subscription plans.
        </p>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Once a subscription is purchased, it will remain active until the end of the billing period. All sales are
          final.
        </p>
        <p className="text-gray-700 dark:text-gray-300">
          If you have any questions about your subscription, please contact our support team at
          tradewizardteam@gmail.com.
        </p>
      </div>

      <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-3">Important Notice</h3>
        <p className="text-gray-700 dark:text-gray-300">
          By subscribing to any of our services, you acknowledge and agree to our no-refund and no-cancellation policy.
        </p>
      </div>
    </div>
  )
}
