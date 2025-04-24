"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Contact() {
  return (
    <div className="container mx-auto px-4 py-12" id="contact">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl text-gray-500 dark:text-gray-400">
            We're here to help with any questions about our platform
          </p>
        </div>

        <Card className="mb-12">
          <CardHeader className="flex flex-row items-center gap-4 pb-2">
            <Mail className="h-8 w-8 text-blue-500" />
            <CardTitle>Email Us</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <p className="text-gray-500 dark:text-gray-400 mb-6 text-center">
              Have questions or need assistance? Send us an email and we'll get back to you as soon as possible.
            </p>
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8"
              onClick={() => (window.location.href = "mailto:tradewizardteam@gmail.com")}
            >
              <Mail className="h-5 w-5 mr-2" />
              Email Us Now
            </Button>
            <p className="text-sm text-gray-400 mt-6">
              Clicking the button will open your default email client with our address pre-filled.
            </p>
          </CardContent>
        </Card>

        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Customer Support</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Our team is dedicated to providing you with the best support possible.
          </p>
          <p className="text-gray-500 dark:text-gray-400">
            We typically respond to all inquiries within 24-48 hours during business days.
          </p>
        </div>
      </div>
    </div>
  )
}
