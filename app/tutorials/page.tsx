import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  BookOpen,
  Clock,
  Play,
  Star,
  Filter,
  BarChart2,
  PieChart,
  TrendingUp,
  Activity,
  Shield,
  FileText,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Tutorials() {
  return (
    <div className="container mx-auto px-4 py-12" id="tutorials">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Trading Tutorials</h1>
          <p className="text-xl text-gray-500 dark:text-gray-400">
            Learn how to trade effectively in the Indian markets with our step-by-step guides
          </p>
        </div>

        <Tabs defaultValue="all" className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <TabsList>
              <TabsTrigger value="all">All Tutorials</TabsTrigger>
              <TabsTrigger value="beginner">Beginner</TabsTrigger>
              <TabsTrigger value="intermediate">Intermediate</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>
            <div className="flex items-center">
              <Filter className="h-4 w-4 mr-2 text-gray-500" />
              <span className="text-sm text-gray-500">Filter</span>
            </div>
          </div>

          <TabsContent value="all">
            <div className="grid grid-cols-1 gap-8 mb-12">
              <Card className="overflow-hidden">
                <div className="md:flex">
                  <div className="md:w-2/5 relative h-60 md:h-auto">
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
                      <Play className="h-12 w-12 text-white" />
                    </div>
                    <Image
                      src="/placeholder.svg?height=400&width=600"
                      alt="Featured tutorial"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="md:w-3/5">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <Badge className="bg-blue-500 hover:bg-blue-600">Featured</Badge>
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                          ))}
                          <span className="text-sm ml-2">(128 ratings)</span>
                        </div>
                      </div>
                      <CardTitle className="text-2xl">Getting Started with Indian Stock Market Trading</CardTitle>
                      <CardDescription>
                        A comprehensive guide for beginners to understand the basics of trading in the Indian stock
                        market
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-500 dark:text-gray-400">
                        This tutorial covers everything you need to know to start trading in the Indian stock market,
                        including account setup, understanding market terminology, reading charts, and placing your
                        first trade.
                      </p>
                      <div className="flex items-center mt-4 text-sm text-gray-500">
                        <BookOpen className="h-4 w-4 mr-1" />
                        10 Lessons
                        <Clock className="h-4 w-4 ml-4 mr-1" />2 hours total
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Link
                        href="#"
                        className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-sm font-medium"
                      >
                        Start Learning
                      </Link>
                    </CardFooter>
                  </div>
                </div>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: "Technical Analysis Fundamentals",
                  description: "Learn how to read charts and identify patterns in Indian stocks",
                  lessons: 8,
                  duration: "1.5 hours",
                  level: "Beginner",
                  icon: BarChart2,
                },
                {
                  title: "Understanding Market Indicators",
                  description: "Master key technical indicators for Indian market analysis",
                  lessons: 6,
                  duration: "1 hour",
                  level: "Intermediate",
                  icon: Activity,
                },
                {
                  title: "Candlestick Patterns for Indian Markets",
                  description: "Identify and interpret candlestick patterns for better trading decisions",
                  lessons: 12,
                  duration: "2.5 hours",
                  level: "Intermediate",
                  icon: TrendingUp,
                },
                {
                  title: "Options Trading Strategies",
                  description: "Advanced options strategies tailored for Indian derivatives market",
                  lessons: 15,
                  duration: "3 hours",
                  level: "Advanced",
                  icon: PieChart,
                },
                {
                  title: "Risk Management Techniques",
                  description: "Learn how to protect your capital in volatile Indian markets",
                  lessons: 7,
                  duration: "1.2 hours",
                  level: "Beginner",
                  icon: Shield,
                },
                {
                  title: "Fundamental Analysis for Long-term Investing",
                  description: "Evaluate Indian companies using fundamental analysis methods",
                  lessons: 10,
                  duration: "2 hours",
                  level: "Intermediate",
                  icon: FileText,
                },
              ].map((tutorial, index) => (
                <Card key={index} className="overflow-hidden flex flex-col">
                  <div className="relative h-40 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    <tutorial.icon className="h-12 w-12 text-blue-500" />
                  </div>
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline">{tutorial.level}</Badge>
                    </div>
                    <CardTitle className="text-lg">{tutorial.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">{tutorial.description}</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <BookOpen className="h-4 w-4 mr-1" />
                      {tutorial.lessons} Lessons
                      <Clock className="h-4 w-4 ml-4 mr-1" />
                      {tutorial.duration}
                    </div>
                  </CardContent>
                  <CardFooter className="border-t pt-4">
                    <Link href="#" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      View Tutorial
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="beginner">
            <div className="flex items-center justify-center h-40 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-gray-500 dark:text-gray-400">Beginner tutorials would be displayed here</p>
            </div>
          </TabsContent>

          <TabsContent value="intermediate">
            <div className="flex items-center justify-center h-40 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-gray-500 dark:text-gray-400">Intermediate tutorials would be displayed here</p>
            </div>
          </TabsContent>

          <TabsContent value="advanced">
            <div className="flex items-center justify-center h-40 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-gray-500 dark:text-gray-400">Advanced tutorials would be displayed here</p>
            </div>
          </TabsContent>
        </Tabs>

        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center mb-12">
          <h2 className="text-2xl font-bold mb-4">Can't Find What You're Looking For?</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
            We're constantly adding new tutorials based on user requests. Let us know what topics you'd like us to cover
            next.
          </p>
          <Link
            href="/contact"
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md font-medium inline-block"
          >
            Request a Tutorial
          </Link>
        </div>
      </div>
    </div>
  )
}
