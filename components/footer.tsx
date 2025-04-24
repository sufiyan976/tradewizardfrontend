"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Send, Instagram, Youtube, Mail } from "lucide-react"
import { FooterLogo } from "@/components/footer-logo"

export default function Footer() {
  const router = useRouter()

  // Function to handle navigation with scroll
  const handleNavigation = (path: string) => {
    router.push(path)

    // Add a small delay to ensure navigation completes before scrolling
    setTimeout(() => {
      // Extract the section ID from the path
      const sectionId = path.split("/").pop()
      const element = document.getElementById(sectionId || "")

      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" })
      } else {
        // If no specific element, scroll to top
        window.scrollTo({ top: 0, behavior: "smooth" })
      }
    }, 100)
  }

  return (
    <footer className="w-full border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-2">
                <FooterLogo />
                <span className="font-bold">TradeWizard</span>
              </div>
            </Link>
            <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md">
              TradeWizard provides advanced trading tools and real-time market data to help you make informed trading
              decisions in the Indian stock market.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Community</h3>
            <div className="flex flex-wrap gap-4 mb-4">
              <Link
                href="https://t.me/tradewitharhu"
                className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              >
                <Send className="h-5 w-5" />
                <span className="sr-only">Telegram</span>
              </Link>
              <Link
                href="https://www.instagram.com/tradewitharhu"
                className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              >
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                <Youtube className="h-5 w-5" />
                <span className="sr-only">YouTube</span>
              </Link>
            </div>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:tradewizardteam@gmail.com"
                  className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white flex items-center gap-1"
                >
                  <Mail className="h-4 w-4" />
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={() => handleNavigation("/disclaimer")}
                  className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white text-left"
                >
                  Disclaimer
                </button>
              </li>
              {/* <li>
                <button
                  onClick={() => handleNavigation("/refund-policy")}
                  className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white text-left"
                >
                  Refund Policy
                </button>
              </li>*/}
              <li>
                <button
                  onClick={() => handleNavigation("/news")}
                  className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white text-left"
                >
                  Market News
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation("/help-center")}
                  className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white text-left"
                >
                  Help Center
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation("/tools")}
                  className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white text-left"
                >
                  Tools Guide
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={() => handleNavigation("/about-us")}
                  className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white text-left"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation("/contact")}
                  className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white text-left"
                >
                  Contact
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation("/privacy-policy")}
                  className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white text-left"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation("/terms-of-service")}
                  className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white text-left"
                >
                  Terms of Service
                </button>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 text-center text-gray-500 dark:text-gray-400">
          <p>© {new Date().getFullYear()} TradeWizard. All rights reserved.</p>
          <p className="mt-2 text-sm">
            Trading involves risk. This is not financial advice. Please consult with a licensed financial advisor.
          </p>
        </div>
      </div>
    </footer>
  )
}
