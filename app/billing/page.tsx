"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle } from "lucide-react"
import { useAuth } from "@/components/auth/auth-provider"

// Subscription plans
const subscriptionPlans = [
  {
    id: "monthly",
    name: "Monthly",
    price: "₹499",
    priceValue: 499,
    period: "monthly",
    duration: "1 month",
    description:
      "Experience the flexibility of our monthly plan, perfect for those seeking a trial or short-term access. Enjoy pay-as-you-go convenience with no long-term commitments.",
    features: [
      "Basic access to Momentum Matrix",
      "Limited 9:15 Booster signals",
      "End-of-day market data",
      "Basic technical indicators",
      "Mobile app access",
    ],
    popular: false,
  },
  {
    id: "quarterly",
    name: "Quarterly",
    price: "₹1,200",
    priceValue: 1200,
    period: "quarterly",
    duration: "3 months",
    description:
      "Unlock greater value with our quarterly plan. If you're satisfied with our services, this plan offers significant savings and a more consistent experience.",
    features: [
      "Full access to Momentum Matrix",
      "Complete 9:15 Booster signals",
      "Real-time market data",
      "Advanced technical indicators",
      "Swing Trade recommendations",
      "Priority email support",
    ],
    popular: true,
    savings: "Save ₹297 (20%)",
  },
  {
    id: "biannual",
    name: "Biannual",
    price: "₹2,100",
    priceValue: 2100,
    period: "biannual",
    duration: "6 months",
    description:
      "Maximize your savings and commitment with our biannual plan. Get the best value and enjoy uninterrupted access to all features.",
    features: [
      "Premium access to all tools",
      "AI-powered trade recommendations",
      "Advanced portfolio analytics",
      "Volume Contraction Pattern scanner",
      "Priority customer support",
      "Exclusive webinars and tutorials",
    ],
    popular: false,
    savings: "Save ₹894 (30%)",
  },
]

export default function BillingPage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [paymentProcessing, setPaymentProcessing] = useState(false)

  // Get current subscription plan (mock data)
  const currentPlan = {
    id: "quarterly",
    name: "Quarterly",
    price: "₹1,200",
    period: "quarterly",
    renewDate: "June 1, 2024",
  }

  // Handle plan selection
  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId)
    setShowPaymentDialog(true)
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Billing & Subscription</h1>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Current Plan</CardTitle>
              <CardDescription>Your current subscription plan and details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-6">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold">{currentPlan.name} Plan</h3>
                    <Badge className="bg-blue-500">{currentPlan.period}</Badge>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 mt-1">
                    Renews on {currentPlan.renewDate} • {currentPlan.price}/{currentPlan.period}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <h4 className="font-medium mb-2">Plan Features</h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span> Full access to Momentum Matrix </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Complete 9:15 Booster signals</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span> Real-time market data </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span> Advanced technical indicators </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span> Deep Market Insights </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span> Priority email support </span>
                  </li>
                </ul>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mt-4">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <strong>Note:</strong> Subscriptions cannot be canceled mid-term.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Available Subscription Plans</CardTitle>
              <CardDescription>Choose a plan that suits your trading needs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {subscriptionPlans.map((plan) => (
                  <Card
                    key={plan.id}
                    className={`border flex flex-col h-full ${
                      plan.popular ? "border-blue-500" : "border-gray-200 dark:border-gray-800"
                    }`}
                  >
                    <CardHeader className="pb-2">
                      {plan.popular && <Badge className="w-fit mb-2 bg-blue-500">Most Popular</Badge>}
                      <CardTitle>{plan.name}</CardTitle>
                      <div className="flex items-end gap-1">
                        <span className="text-2xl font-bold">{plan.price}</span>
                        <span className="text-gray-500 dark:text-gray-400 text-sm">/{plan.duration}</span>
                      </div>
                      {plan.savings && <span className="text-green-500 text-sm font-medium">{plan.savings}</span>}
                    </CardHeader>
                    <CardContent className="pt-2 flex-1 flex flex-col">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 mb-4">{plan.description}</p>
                      <div className="mt-auto">
                        <Button
                          className={`w-full ${plan.popular ? "bg-blue-600 hover:bg-blue-700" : ""}`}
                          onClick={() => handlePlanSelect(plan.id)}
                          disabled={plan.id === currentPlan.id}
                        >
                          {plan.id === currentPlan.id ? "Current Plan" : "Select Plan"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
