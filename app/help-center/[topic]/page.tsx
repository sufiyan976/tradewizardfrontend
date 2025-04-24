"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, FileText } from "lucide-react"

// Import the help topics data
import { helpTopics } from "@/data/help-center-data"

export default function TopicPage() {
  const router = useRouter()
  const params = useParams()
  const topicId = params.topic as string

  const [topic, setTopic] = useState<any>(null)

  useEffect(() => {
    // Find the topic based on the URL parameter
    const foundTopic = helpTopics.find((t) => t.id === topicId)
    if (foundTopic) {
      setTopic(foundTopic)
    } else {
      // Redirect to help center if topic not found
      router.push("/help-center")
    }
  }, [topicId, router])

  // Function to navigate to article and ensure consistent scrolling
  const navigateToArticle = (articleTitle: string) => {
    // Special handling for the 9:15 Booster Tool article
    let articleSlug

    if (articleTitle.includes("9:15")) {
      // Use a consistent slug for the 9:15 Booster article
      articleSlug = "using-the-915-booster-tool"
    } else {
      // Normal slug generation for other articles
      articleSlug = encodeURIComponent(articleTitle.toLowerCase().replace(/\s+/g, "-"))
    }

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

  // Enhance the back button to also scroll to top of the help center
  const navigateBackToHelpCenter = () => {
    router.push("/help-center")
    // No need to manipulate scroll here, let React handle it
  }

  if (!topic) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto text-center">
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12" id="help-center-topic">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center mb-8">
          <Button variant="outline" className="mr-4" onClick={navigateBackToHelpCenter}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Help Center
          </Button>
          <h1 className="text-3xl font-bold">{topic.title}</h1>
        </div>

        <p className="text-gray-500 dark:text-gray-400 mb-8">{topic.description}</p>

        <div className="grid grid-cols-1 gap-6">
          {topic.articles.map((article: any, index: number) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-start gap-4 pb-2">
                <FileText className="h-6 w-6 text-blue-500 mt-1" />
                <div>
                  <CardTitle>{article.title}</CardTitle>
                  <CardDescription>{article.content.substring(0, 120)}...</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="pt-2">
                <Button variant="outline" className="w-full" onClick={() => navigateToArticle(article.title)}>
                  Read Article
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
