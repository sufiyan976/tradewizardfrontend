"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { BarChart, TrendingUp } from "lucide-react"

export function FooterLogo() {
  const [mounted, setMounted] = useState(false)
  const { theme } = useTheme()

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Theme-based colors
  const getColors = () => {
    if (!mounted) return { primary: "text-blue-500", secondary: "text-green-500" }

    return theme === "dark"
      ? { primary: "text-blue-300", secondary: "text-green-300" }
      : { primary: "text-blue-500", secondary: "text-green-500" }
  }

  const colors = getColors()

  if (!mounted) {
    // Return a placeholder with the same dimensions to prevent layout shift
    return (
      <div className="relative h-5 w-5">
        <div className="h-5 w-5 opacity-0" />
      </div>
    )
  }

  return (
    <div className="relative h-5 w-5">
      <TrendingUp className={`h-5 w-5 ${colors.primary}`} />
      <BarChart className={`absolute -bottom-1 -right-1 h-2.5 w-2.5 ${colors.secondary}`} />
    </div>
  )
}
