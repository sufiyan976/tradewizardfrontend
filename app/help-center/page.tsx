"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, HelpCircle, Mail, AlertCircle, BarChart2 } from "lucide-react"

// Import the help topics data
import { helpTopics, faqData } from "@/data/help-center-data"

// Function to get all articles from all topics
const getAllArticles = () => {
  return helpTopics.flatMap((topic) =>
    topic.articles.map((article) => ({
      ...article,
      topicId: topic.id,
      topicTitle: topic.title,
    })),
  )
}

export default function HelpCenter() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [hasSearched, setHasSearched] = useState(false)
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null)
  const [selectedTopicArticles, setSelectedTopicArticles] = useState<any[]>([])

  // Function to navigate to article and ensure consistent scrolling
  const navigateToArticle = (topicId: string, articleTitle: string) => {
    const articleSlug = encodeURIComponent(articleTitle.toLowerCase().replace(/\s+/g, "-"))

    // Set the scroll flag before navigation
    try {
      sessionStorage.setItem("scrollToArticleContent", "true")
    } catch (e) {
      console.error("Error setting sessionStorage:", e)
    }

    router.push(`/help-center/${topicId}/${articleSlug}`)

    // Scroll to top immediately
    window.scrollTo({
      top: 0,
      behavior: "auto",
    })
  }

  // Update the topic card click handler to ensure scrolling
  const navigateToTopic = (topicId: string) => {
    router.push(`/help-center/${topicId}`)

    // Scroll to top immediately
    window.scrollTo({
      top: 0,
      behavior: "auto",
    })
  }

  // Handle search functionality
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      setHasSearched(false)
      return
    }

    const allArticles = getAllArticles()
    const results = allArticles.filter(
      (article) =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.content.toLowerCase().includes(searchQuery.toLowerCase()),
    )

    setSearchResults(results)
    setHasSearched(true)
    setSelectedTopic(null)
  }

  // Handle topic selection
  const handleTopicSelect = (topicId: string) => {
    // Navigate to the topic page
    router.push(`/help-center/${topicId}`)
  }

  return (
    <div className="container mx-auto px-4 py-12" id="help-center">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <HelpCircle className="h-12 w-12 text-blue-500" />
          </div>
          <h1 className="text-4xl font-bold mb-4">TradeWizard Help Center</h1>
          <p className="text-xl text-gray-500 dark:text-gray-400 mb-8">
            Find answers to your questions about TradeWizard
          </p>

          <div className="max-w-2xl mx-auto relative mb-8">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search for help articles..."
              className="pl-10 py-6 text-lg"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                if (!e.target.value.trim()) {
                  setSearchResults([])
                  setHasSearched(false)
                }
              }}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            />
            <Button className="absolute right-1 top-1/2 transform -translate-y-1/2" onClick={handleSearch}>
              Search
            </Button>
          </div>

          {/* Search Results */}
          {hasSearched && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Search Results</h2>
              {searchResults.length > 0 ? (
                <div className="space-y-4">
                  {searchResults.map((article, index) => (
                    <Card
                      key={index}
                      className="text-left hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => navigateToArticle(article.topicId, article.title)}
                    >
                      <CardHeader>
                        <CardTitle>{article.title}</CardTitle>
                        <CardDescription>From: {article.topicTitle}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-500 dark:text-gray-400">{article.content.substring(0, 150)}...</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center p-8 border rounded-lg">
                  <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">Topic Not Found</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    We couldn't find any articles matching "{searchQuery}".
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 mb-6">
                    Please check out these related topics or try a different search term.
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {helpTopics.slice(0, 3).map((topic, index) => (
                      <Link key={index} href={`/help-center/${topic.id}`}>
                        <Button variant="outline">{topic.title}</Button>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Selected Topic Articles */}
          {selectedTopic && (
            <div className="mb-12">
              <div className="flex items-center mb-6">
                <Button variant="outline" className="mr-4" onClick={() => setSelectedTopic(null)}>
                  Back
                </Button>
                <h2 className="text-2xl font-bold">{helpTopics.find((t) => t.id === selectedTopic)?.title}</h2>
              </div>
              <div className="space-y-4">
                {selectedTopicArticles.map((article, index) => (
                  <Card key={index} className="text-left">
                    <CardHeader>
                      <CardTitle>{article.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-500 dark:text-gray-400">{article.content}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Only show Popular Topics when not searching or viewing a specific topic */}
        {!hasSearched && !selectedTopic && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Popular Topics</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {helpTopics.map((topic, index) => {
                // Replace the Billing & Subscription topic with Market Analysis Tools
                if (topic.id === "billing-subscription") {
                  return (
                    <Card
                      key={index}
                      className="hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => navigateToTopic("market-analysis")}
                    >
                      <CardHeader className="flex flex-row items-start gap-4 pb-2">
                        <BarChart2 className="h-6 w-6 text-blue-500 mt-1" />
                        <div>
                          <CardTitle>Market Analysis Tools</CardTitle>
                          <CardDescription>
                            Learn how to use our advanced market analysis tools effectively
                          </CardDescription>
                        </div>
                      </CardHeader>
                    </Card>
                  )
                }

                // Return other topics as they are
                return (
                  <Card
                    key={index}
                    className="hover:shadow-md transition-shadow cursor-pointer h-full"
                    onClick={() => navigateToTopic(topic.id)}
                  >
                    <CardHeader className="flex flex-row items-start gap-4 pb-2">
                      <topic.icon className="h-6 w-6 text-blue-500 mt-1" />
                      <div>
                        <CardTitle>{topic.title}</CardTitle>
                        <CardDescription>{topic.description}</CardDescription>
                      </div>
                    </CardHeader>
                  </Card>
                )
              })}
            </div>
          </div>
        )}

        {/* Only show FAQs when not searching or viewing a specific topic */}
        {!hasSearched && !selectedTopic && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>

            <Tabs defaultValue="account" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="account">Account</TabsTrigger>
                <TabsTrigger value="trading">Trading</TabsTrigger>
                <TabsTrigger value="billing">Billing</TabsTrigger>
                <TabsTrigger value="technical">Technical</TabsTrigger>
              </TabsList>
              {Object.entries(faqData).map(([category, questions]) => (
                <TabsContent key={category} value={category} className="pt-6">
                  <div className="space-y-4">
                    {questions.map((faq, index) => (
                      <div key={index} className="border-b border-gray-200 dark:border-gray-800 pb-4">
                        <h3 className="font-medium mb-2">{faq.question}</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        )}

        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Still Need Help with TradeWizard?</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
            If you couldn't find the answer you were looking for, our customer support team is ready to assist you.
          </p>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Send us an email and we'll get back to you within 24-48 hours.
          </p>
          <div className="flex items-center justify-center">
            <Link href="/contact" className="flex items-center gap-2 text-blue-600 hover:text-blue-800">
              <Mail className="h-5 w-5" />
              Email Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
