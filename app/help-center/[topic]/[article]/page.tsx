"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, CheckCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Import the help topics data
import { helpTopics } from "@/data/help-center-data"

export default function ArticlePage() {
  const router = useRouter()
  const params = useParams()
  const topicId = params.topic as string
  const articleSlug = params.article as string

  const [article, setArticle] = useState<any>(null)
  const [topic, setTopic] = useState<any>(null)
  const [feedbackSubmitted, setFeedbackSubmitted] = useState<"positive" | "negative" | null>(null)
  const articleContentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const foundTopic = helpTopics.find((t) => t.id === topicId)

    if (foundTopic) {
      setTopic(foundTopic)

      const normalizedSlug = decodeURIComponent(articleSlug).replace(/-/g, " ")

      const boosterArticle = foundTopic.articles.find(
        (a) => a.title.toLowerCase().includes("9:15") || a.title.toLowerCase().includes("booster"),
      )

      if (normalizedSlug.includes("9 15") || normalizedSlug.includes("915")) {
        if (boosterArticle) {
          setArticle(boosterArticle)
        } else {
          findArticleByNormalizedTitle()
        }
      } else {
        findArticleByNormalizedTitle()
      }

      function findArticleByNormalizedTitle() {
        const foundArticle = foundTopic.articles.find((a) => {
          const normalizedTitle = a.title
            .toLowerCase()
            .replace(/[^\w\s]/g, "")
            .replace(/\s+/g, " ")
            .trim()

          const normalizedParam = normalizedSlug
            .toLowerCase()
            .replace(/[^\w\s]/g, "")
            .replace(/\s+/g, " ")
            .trim()

          return (
            normalizedTitle === normalizedParam ||
            normalizedTitle.includes(normalizedParam) ||
            normalizedParam.includes(normalizedTitle)
          )
        })

        if (foundArticle) {
          setArticle(foundArticle)
        } else {
          router.push(`/help-center/${topicId}`)
        }
      }
    } else {
      router.push("/help-center")
    }
  }, [topicId, articleSlug, router])

  useEffect(() => {
    if (article && articleContentRef.current) {
      const shouldScrollToContent = sessionStorage.getItem("scrollToArticleContent") === "true"

      if (shouldScrollToContent) {
        sessionStorage.removeItem("scrollToArticleContent")

        setTimeout(() => {
          window.scrollTo({
            top: articleContentRef.current?.getBoundingClientRect().top + window.scrollY - 100,
            behavior: "smooth",
          })
        }, 100)
      }
    }
  }, [article])

  const handlePositiveFeedback = () => {
    setFeedbackSubmitted("positive")
  }

  const handleNegativeFeedback = () => {
    setFeedbackSubmitted("negative")
    setTimeout(() => {
      router.push("/contact")
    }, 1000)
  }

  const navigateBackToTopic = () => {
    router.push(`/help-center/${topicId}`)
  }

  if (!article || !topic) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto text-center">
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  // Generate detailed content for the article
  const generateDetailedContent = () => {
    return [article.content]
  }

  const detailedContent = generateDetailedContent()

  const isHTML = (str: string) => {
    return /<\/?[a-z][\s\S]*>/i.test(str)
  }

  const formatContent = (content: string) => {
    let formattedContent = content
      .replace(/^## (.*$)/gm, '<h2 class="text-xl font-semibold mt-6 mb-3">$1</h2>')
      .replace(/^### (.*$)/gm, '<h3 class="text-lg font-semibold mt-5 mb-2">$1</h3>')
      .replace(/^#### (.*$)/gm, '<h4 class="text-base font-semibold mt-4 mb-2">$1</h4>')
      .replace(/^- (.*$)/gm, '<li class="ml-4">$1</li>')
      .replace(/^\* (.*$)/gm, '<li class="ml-4">$1</li>')
      .replace(/^\d+\. (.*$)/gm, '<li class="ml-4 list-decimal">$1</li>')
      .split("\n\n")
      .map((para) => {
        if (para.trim() && !para.includes("<h") && !para.includes("<li")) {
          return `<p class="mb-4">${para}</p>`
        }
        return para
      })
      .join("\n")

    formattedContent = formattedContent
      .replace(
        /<li class="ml-4">(.+?)<\/li>\n<li class="ml-4">(.+?)<\/li>/gs,
        '<ul class="list-disc mb-4 pl-5">\n<li class="ml-4">$1</li>\n<li class="ml-4">$2</li>\n</ul>',
      )
      .replace(
        /<li class="ml-4 list-decimal">(.+?)<\/li>\n<li class="ml-4 list-decimal">(.+?)<\/li>/gs,
        '<ol class="list-decimal mb-4 pl-5">\n<li class="ml-4 list-decimal">$1</li>\n<li class="ml-4 list-decimal">$2</li>\n</ol>',
      )
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")

    return formattedContent
  }

  return (
    <div className="container mx-auto px-4 py-12" id="help-center-article">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center mb-4">
          <Button variant="outline" className="mr-4" onClick={navigateBackToTopic}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to {topic.title}
          </Button>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">{article.title}</CardTitle>
          </CardHeader>
          <CardContent ref={articleContentRef}>
            {detailedContent.map((paragraph, index) =>
              isHTML(paragraph) ? (
                <div key={index} dangerouslySetInnerHTML={{ __html: paragraph }} />
              ) : (
                <div key={index} dangerouslySetInnerHTML={{ __html: formatContent(paragraph) }} />
              ),
            )}
          </CardContent>
        </Card>

        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mb-8">
          {feedbackSubmitted === "positive" ? (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>Glad to hear it! Thanks for your feedback.</AlertDescription>
            </Alert>
          ) : feedbackSubmitted === "negative" ? (
            <Alert>
              <AlertDescription>Redirecting you to our contact page...</AlertDescription>
            </Alert>
          ) : (
            <div className="flex gap-3">
              <Button onClick={handlePositiveFeedback}>Yes, it helped</Button>
              <Button variant="outline" onClick={handleNegativeFeedback}>
                No, I need more help
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
