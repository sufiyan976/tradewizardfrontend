import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, Clock, User, ArrowRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function Blog() {
  return (
    <div className="container mx-auto px-4 py-12" id="blog">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">TradeFinder Blog</h1>
          <p className="text-xl text-gray-500 dark:text-gray-400">
            Expert insights on Indian markets, trading strategies, and financial analysis
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 mb-12">
          <Card className="overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/3 relative h-60 md:h-auto">
                <Image
                  src="/placeholder.svg?height=400&width=600"
                  alt="Featured blog post"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="md:w-2/3">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge className="bg-blue-500 hover:bg-blue-600">Featured</Badge>
                    <div className="flex items-center text-sm text-gray-500">
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      March 15, 2024
                    </div>
                  </div>
                  <CardTitle className="text-2xl">Understanding the Impact of RBI Policy on Indian Markets</CardTitle>
                  <CardDescription>
                    A comprehensive analysis of how the Reserve Bank of India's monetary policy decisions affect various
                    sectors of the Indian stock market.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500 dark:text-gray-400">
                    The Reserve Bank of India's monetary policy decisions have far-reaching implications for the Indian
                    stock market. In this in-depth analysis, we explore how changes in repo rates, cash reserve ratios,
                    and other policy tools influence different sectors, from banking to real estate to consumer goods.
                  </p>
                </CardContent>
                <CardFooter className="flex justify-between items-center">
                  <div className="flex items-center text-sm text-gray-500">
                    <User className="h-4 w-4 mr-1" />
                    By Rajesh Sharma
                    <Clock className="h-4 w-4 ml-4 mr-1" />
                    10 min read
                  </div>
                  <Link href="#" className="text-blue-500 hover:text-blue-700 flex items-center">
                    Read More <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </CardFooter>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {[
            {
              title: "Technical Analysis: Moving Averages for Indian Stocks",
              description: "Learn how to use moving averages to identify trends in Indian equities",
              date: "March 10, 2024",
              author: "Priya Patel",
              readTime: "8 min read",
              category: "Technical Analysis",
            },
            {
              title: "Sector Rotation Strategy for Indian Markets",
              description: "How to capitalize on sector rotation in the Indian market cycle",
              date: "March 5, 2024",
              author: "Vikram Singh",
              readTime: "12 min read",
              category: "Investment Strategy",
            },
            {
              title: "Understanding Options Trading in Indian Markets",
              description: "A beginner's guide to options trading on NSE and BSE",
              date: "February 28, 2024",
              author: "Ananya Desai",
              readTime: "15 min read",
              category: "Options Trading",
            },
            {
              title: "Budget Impact: What It Means for Your Portfolio",
              description: "Analyzing the impact of the latest Union Budget on various sectors",
              date: "February 20, 2024",
              author: "Rahul Kapoor",
              readTime: "10 min read",
              category: "Market Analysis",
            },
            {
              title: "Risk Management Techniques for Indian Traders",
              description: "Essential risk management strategies for the volatile Indian market",
              date: "February 15, 2024",
              author: "Neha Sharma",
              readTime: "9 min read",
              category: "Risk Management",
            },
            {
              title: "Fundamental Analysis of Indian Banking Stocks",
              description: "Key metrics to evaluate when investing in Indian banking sector",
              date: "February 10, 2024",
              author: "Arjun Mehta",
              readTime: "14 min read",
              category: "Fundamental Analysis",
            },
          ].map((post, index) => (
            <Card key={index} className="overflow-hidden flex flex-col">
              <div className="relative h-48">
                <Image src="/placeholder.svg?height=300&width=400" alt={post.title} fill className="object-cover" />
              </div>
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline" className="text-xs">
                    {post.category}
                  </Badge>
                  <div className="flex items-center text-xs text-gray-500">
                    <CalendarIcon className="h-3 w-3 mr-1" />
                    {post.date}
                  </div>
                </div>
                <CardTitle className="text-lg">{post.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-gray-500 dark:text-gray-400 text-sm">{post.description}</p>
              </CardContent>
              <CardFooter className="flex justify-between items-center border-t pt-4">
                <div className="flex items-center text-xs text-gray-500">
                  <User className="h-3 w-3 mr-1" />
                  {post.author}
                </div>
                <div className="flex items-center text-xs text-gray-500">
                  <Clock className="h-3 w-3 mr-1" />
                  {post.readTime}
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="flex justify-center">
          <Link
            href="#"
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md font-medium flex items-center"
          >
            View All Articles
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
