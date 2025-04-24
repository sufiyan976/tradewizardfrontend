"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ThemeSwitch } from "@/components/theme-switch"
import { Moon, Sun } from "lucide-react"

export default function ThemeDemo() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Ensure component is mounted to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Theme Toggle Demo</CardTitle>
        <CardDescription className="text-center">
          Current theme: <span className="font-bold">{theme}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center space-x-4">
          <Button
            variant={theme === "light" ? "default" : "outline"}
            onClick={() => setTheme("light")}
            className="flex items-center gap-2"
          >
            <Sun className="h-4 w-4" />
            Light
          </Button>
          <Button
            variant={theme === "dark" ? "default" : "outline"}
            onClick={() => setTheme("dark")}
            className="flex items-center gap-2"
          >
            <Moon className="h-4 w-4" />
            Dark
          </Button>
          <Button variant={theme === "system" ? "default" : "outline"} onClick={() => setTheme("system")}>
            System
          </Button>
        </div>

        <div className="flex justify-center mt-4">
          <ThemeSwitch />
        </div>

        <div className="mt-6 p-4 border rounded-md">
          <p className="mb-2">This text adapts to the current theme.</p>
          <p className="text-sm text-muted-foreground">
            Your theme preference is saved in local storage and will persist across sessions.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
