"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Users, Target, Shield, Award } from "lucide-react"
import { useRouter } from "next/navigation"

export default function AboutUs() {
  const router = useRouter()

  const handleGetStarted = () => {
    // First scroll to top smoothly
    window.scrollTo({ top: 0, behavior: "smooth" })
    // Then navigate to home page
    router.push("/")
  }

  return (
    <div className="container mx-auto px-4 py-12" id="about-us">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <TrendingUp className="h-12 w-12 text-blue-500" />
          </div>
          <h1 className="text-4xl font-bold mb-4">About TradeWizard</h1>
          <p className="text-xl text-gray-500 dark:text-gray-400">
            Empowering traders with advanced analytics and real-time market insights
          </p>
        </div>

        <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
          <p>
            Founded in 2025, TradeWizard has emerged as a leading platform for Indian market analytics and trading
            tools. Our mission is to democratize access to professional-grade trading tools and market insights,
            enabling traders of all experience levels to make more informed decisions in the Indian stock market.
          </p>

          <p>
            What began as a small project by a team of experienced traders and technologists has grown into a
            comprehensive trading platform trusted by thousands of active traders across India. We combine cutting-edge
            technology with deep market expertise to deliver tools that provide genuine value to our users.
          </p>

          <p>
            At TradeWizard, we believe that successful trading is built on a foundation of quality information, powerful
            analytics, and disciplined strategy. Our platform is designed to support each of these pillars, providing
            traders with everything they need to navigate the complexities of the Indian financial markets.
          </p>
        </div>

        <h2 className="text-2xl font-bold mb-6">Our Core Values</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <Target className="h-8 w-8 text-blue-500" />
              <div>
                <CardTitle>Accuracy</CardTitle>
                <CardDescription>
                  We prioritize data accuracy and reliability in all our tools and analytics
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 dark:text-gray-400">
                Our platform is built on robust data infrastructure that ensures the information you receive is
                accurate, timely, and reliable. We maintain direct connections with major Indian exchanges and implement
                rigorous data validation processes.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <Users className="h-8 w-8 text-blue-500" />
              <div>
                <CardTitle>Accessibility</CardTitle>
                <CardDescription>Making professional trading tools accessible to everyone</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 dark:text-gray-400">
                We believe that sophisticated trading tools shouldn't be the exclusive domain of institutional
                investors. Our platform is designed to be intuitive and accessible, with features that cater to both
                novice and experienced traders.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <Shield className="h-8 w-8 text-blue-500" />
              <div>
                <CardTitle>Integrity</CardTitle>
                <CardDescription>Operating with transparency and putting users first</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 dark:text-gray-400">
                We maintain the highest standards of integrity in all aspects of our business. From transparent pricing
                to honest market analysis, we believe in building trust through ethical practices and always putting our
                users' interests first.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <Award className="h-8 w-8 text-blue-500" />
              <div>
                <CardTitle>Innovation</CardTitle>
                <CardDescription>Continuously improving and evolving our platform</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 dark:text-gray-400">
                The financial markets are constantly evolving, and so are we. Our team is dedicated to continuous
                innovation, regularly introducing new features and improvements based on market developments and user
                feedback.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Join Thousands of Traders Across India</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Experience the difference that professional-grade tools and insights can make to your trading journey.
          </p>
          <div className="flex justify-center">
            <button
              onClick={handleGetStarted}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md font-medium cursor-pointer"
            >
              Get Started Today
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
