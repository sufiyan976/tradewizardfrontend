"use client"

import { useTheme } from "next-themes"
import Link from "next/link"
import { useEffect, useState } from "react"
import { BarChart, TrendingUp } from "lucide-react"

interface LogoProps {
  size?: "small" | "medium" | "large"
  withText?: boolean
  className?: string
}

export function Logo({ size = "medium", withText = true, className = "" }: LogoProps) {
  const [mounted, setMounted] = useState(false)
  const { theme } = useTheme()

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Size mappings
  const sizeMap = {
    small: {
      container: "h-5 w-5",
      primary: "h-5 w-5",
      secondary: "h-2.5 w-2.5",
      text: "text-sm",
    },
    medium: {
      container: "h-6 w-6",
      primary: "h-6 w-6",
      secondary: "h-3 w-3",
      text: "text-xl",
    },
    large: {
      container: "h-8 w-8",
      primary: "h-8 w-8",
      secondary: "h-4 w-4",
      text: "text-2xl",
    },
  }

  // Theme-based colors
  const getColors = () => {
    if (!mounted) return { primary: "text-blue-500", secondary: "text-green-500" }

    return theme === "dark"
      ? { primary: "text-blue-400", secondary: "text-green-400" }
      : { primary: "text-blue-600", secondary: "text-green-600" }
  }

  const colors = getColors()
  const sizes = sizeMap[size]

  if (!mounted) {
    // Return a placeholder with the same dimensions to prevent layout shift
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className={`relative ${sizes.container}`}>
          <div className={`${sizes.primary} opacity-0`} />
        </div>
        {withText && <div className={`${sizes.text} font-bold opacity-0`}>TradeWizard</div>}
      </div>
    )
  }

  return (
    <Link href="/" className={`flex items-center gap-2 ${className}`}>
      <div className={`relative ${sizes.container}`}>
        <TrendingUp className={`${sizes.primary} ${colors.primary}`} />
        <BarChart className={`absolute -bottom-1 -right-1 ${sizes.secondary} ${colors.secondary}`} />
      </div>
      {withText && <span className={`${sizes.text} font-bold`}>TradeWizard</span>}
    </Link>
  )
}
