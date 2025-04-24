"use client"

import type React from "react"

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { Logo } from "@/components/logo"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useState } from "react"

// Import the icons and components needed for the mobile navigation
import {
  Activity,
  Globe,
  PieChart,
  Home,
  Clock,
  LineChart,
  BarChart2,
  TrendingUp,
  Zap,
  ArrowUpRight,
  Newspaper,
  Wrench,
} from "lucide-react"

interface SectionLogoProps {
  path: string
  currentPath?: string
  children: React.ReactNode
  label: string
  onClick?: () => void
}

const SectionLogo = ({ path, currentPath, children, label, onClick }: SectionLogoProps) => {
  const isActive = currentPath === path

  return (
    <Link
      href={path}
      className={cn(
        "group flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800",
        isActive && "text-primary font-medium",
      )}
      onClick={onClick}
    >
      {children && <div className="relative flex items-center justify-center">{children}</div>}
      <span>{label}</span>
    </Link>
  )
}

export function MobileNav({ currentPath }: { currentPath: string }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Logo components for each section
  const HomeLogo = () => (
    <div className="relative">
      <Home className="h-5 w-5 text-indigo-500" />
    </div>
  )

  const MomentumMatrixLogo = () => (
    <div className="relative">
      <PieChart className="h-5 w-5 text-purple-500" />
      <LineChart className="absolute -bottom-1 -right-1 h-3 w-3 text-purple-700" />
    </div>
  )

  const IntradayBoosterLogo = () => (
    <div className="relative">
      <Clock className="h-5 w-5 text-amber-500" />
      <Zap className="absolute -top-1 -right-1 h-3 w-3 text-amber-600" />
    </div>
  )

  const MarketBeatsLogo = () => (
    <div className="relative">
      <Activity className="h-5 w-5 text-green-500" />
      <ArrowUpRight className="absolute -top-1 -right-1 h-3 w-3 text-green-700" />
    </div>
  )

  const SwingTradeLogo = () => (
    <div className="relative">
      <Globe className="h-5 w-5 text-blue-500" />
      <TrendingUp className="absolute -bottom-1 -right-1 h-3 w-3 text-blue-700" />
    </div>
  )

  const OIGainerLogo = () => (
    <div className="relative">
      <BarChart2 className="h-5 w-5 text-emerald-500" />
      <TrendingUp className="absolute -top-1 -right-1 h-3 w-3 text-emerald-700" />
    </div>
  )

  const NewsLogo = () => (
    <div className="relative">
      <Newspaper className="h-5 w-5 text-slate-500" />
    </div>
  )

  const ToolsLogo = () => (
    <div className="relative">
      <Wrench className="h-5 w-5 text-gray-500" />
    </div>
  )

  return (
    <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(true)}>
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0">
        <div className="flex items-center justify-between p-4 border-b">
          <Logo size="small" />
        </div>
        <nav className="grid gap-6 p-4 pt-2">
          <SectionLogo path="/" currentPath={currentPath} label="Home" onClick={() => setIsMenuOpen(false)}>
            <HomeLogo />
          </SectionLogo>

          <SectionLogo
            path="/intraday-booster"
            currentPath={currentPath}
            label="9:15 Booster"
            onClick={() => setIsMenuOpen(false)}
          >
            <IntradayBoosterLogo />
          </SectionLogo>

          <SectionLogo
            path="/swing-trade"
            currentPath={currentPath}
            label="Swing Trade"
            onClick={() => setIsMenuOpen(false)}
          >
            <SwingTradeLogo />
          </SectionLogo>

          <SectionLogo
            path="/market-beats"
            currentPath={currentPath}
            label="Market Beats"
            onClick={() => setIsMenuOpen(false)}
          >
            <MarketBeatsLogo />
          </SectionLogo>

          <SectionLogo
            path="/momentum-matrix"
            currentPath={currentPath}
            label="Momentum Matrix"
            onClick={() => setIsMenuOpen(false)}
          >
            <MomentumMatrixLogo />
          </SectionLogo>

          <SectionLogo
            path="/oi-gainer"
            currentPath={currentPath}
            label="OI Gainer"
            onClick={() => setIsMenuOpen(false)}
          >
            <OIGainerLogo />
          </SectionLogo>

          {/* Add More Features dropdown for mobile */}
          <div className="border-t pt-2">
            <p className="px-3 py-1 text-xs text-gray-500 dark:text-gray-400">More Features</p>

            <SectionLogo path="/news" currentPath={currentPath} label="News" onClick={() => setIsMenuOpen(false)}>
              <NewsLogo />
            </SectionLogo>

            <SectionLogo
              path="/global-news"
              currentPath={currentPath}
              label="Global News"
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="relative">
                <Globe className="h-5 w-5 text-slate-500" />
              </div>
            </SectionLogo>

            <SectionLogo path="/tools" currentPath={currentPath} label="Tools" onClick={() => setIsMenuOpen(false)}>
              <ToolsLogo />
            </SectionLogo>
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  )
}
