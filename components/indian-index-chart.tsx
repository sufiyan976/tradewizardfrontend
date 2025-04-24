"use client"

import { useEffect, useRef, useState } from "react"
import { useTheme } from "next-themes"
import { useInView } from "react-intersection-observer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowDown, ArrowUp, TrendingUp } from "lucide-react"

interface IndexData {
  name: string
  value: number
  previousClose: number
  change: number
  percentChange: number
  color: string
  data: number[]
}

export default function IndianIndexChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [indices, setIndices] = useState<IndexData[]>([])
  const [selectedIndex, setSelectedIndex] = useState<string>("NIFTY 50")
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  const animationRef = useRef<number>(0)
  const { theme } = useTheme()
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  })

  // Generate Indian market data
  useEffect(() => {
    const generateIndicesData = () => {
      const data: IndexData[] = [
        {
          name: "NIFTY 50",
          value: 22456.8,
          previousClose: 22380.5,
          change: 76.3,
          percentChange: 0.34,
          color: "#4f46e5", // indigo
          data: [],
        },
        {
          name: "SENSEX",
          value: 73845.2,
          previousClose: 73650.8,
          change: 194.4,
          percentChange: 0.26,
          color: "#10b981", // emerald
          data: [],
        },
        {
          name: "BANK NIFTY",
          value: 48123.6,
          previousClose: 47980.2,
          change: 143.4,
          percentChange: 0.3,
          color: "#f59e0b", // amber
          data: [],
        },
        {
          name: "NIFTY IT",
          value: 34567.8,
          previousClose: 34789.5,
          change: -221.7,
          percentChange: -0.64,
          color: "#ef4444", // red
          data: [],
        },
      ]

      // Generate historical data points for each index (last 60 minutes)
      data.forEach((index) => {
        let currentValue = index.previousClose
        const dataPoints: number[] = []

        // Generate 60 data points (one per minute for the last hour)
        for (let i = 0; i < 60; i++) {
          // Create realistic market movements
          const volatility = index.name === "BANK NIFTY" ? 0.0008 : 0.0005 // Bank Nifty is more volatile
          const change = (Math.random() - 0.48) * (currentValue * volatility)
          currentValue = Math.max(currentValue * 0.998, currentValue + change)
          dataPoints.push(currentValue)
        }

        // Add the current value as the last point
        dataPoints.push(index.value)
        index.data = dataPoints
      })

      return data
    }

    setIndices(generateIndicesData())

    // Set up interval to simulate real-time updates
    const updateInterval = setInterval(() => {
      setIndices((prevIndices) => {
        return prevIndices.map((index) => {
          // Simulate small price changes
          const volatility = index.name === "BANK NIFTY" ? 0.0012 : 0.0008
          const randomChange = (Math.random() - 0.5) * (index.value * volatility)
          const newValue = Math.max(index.value + randomChange, index.value * 0.998)

          // Calculate new change and percent change
          const newChange = newValue - index.previousClose
          const newPercentChange = (newChange / index.previousClose) * 100

          // Update data points array
          const newData = [...index.data.slice(1), newValue]

          return {
            ...index,
            value: newValue,
            change: newChange,
            percentChange: newPercentChange,
            data: newData,
          }
        })
      })

      setLastUpdated(new Date())
    }, 15000) // Update every 15 seconds

    return () => clearInterval(updateInterval)
  }, [])

  // Animation loop for chart
  useEffect(() => {
    if (!canvasRef.current || !indices.length || !inView) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions with higher resolution
    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)

    let startTime = 0
    let lastUpdateTime = 0

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const elapsed = timestamp - startTime

      // Only update every 40ms for better performance
      if (timestamp - lastUpdateTime > 40) {
        lastUpdateTime = timestamp

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        // Draw background grid
        drawGrid(ctx, rect.width, rect.height)

        // Find the selected index
        const selectedIndexData = indices.find((index) => index.name === selectedIndex)

        if (selectedIndexData) {
          // Draw chart line
          drawLine(ctx, selectedIndexData.data, rect.width, rect.height, selectedIndexData.color, 2)

          // Draw time labels
          drawTimeLabels(ctx, rect.width, rect.height)

          // Draw price labels
          drawPriceLabels(ctx, selectedIndexData.data, rect.width, rect.height)
        }
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animationRef.current)
    }
  }, [indices, selectedIndex, inView, theme])

  // Helper functions
  const getMinValue = (data: number[]) => {
    return Math.min(...data) * 0.9995
  }

  const getMaxValue = (data: number[]) => {
    return Math.max(...data) * 1.0005
  }

  const mapRange = (value: number, inMin: number, inMax: number, outMin: number, outMax: number) => {
    return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin
  }

  const drawLine = (
    ctx: CanvasRenderingContext2D,
    data: number[],
    width: number,
    height: number,
    color: string,
    lineWidth: number,
  ) => {
    if (data.length < 2) return

    const minValue = getMinValue(data)
    const maxValue = getMaxValue(data)

    ctx.beginPath()
    ctx.lineWidth = lineWidth
    ctx.strokeStyle = color

    // Create gradient fill
    const gradient = ctx.createLinearGradient(0, 0, 0, height)
    gradient.addColorStop(0, `${color}20`) // 20% opacity at top
    gradient.addColorStop(1, `${color}05`) // 5% opacity at bottom

    // Draw line
    data.forEach((point, i) => {
      const x = mapRange(i, 0, data.length - 1, 0, width)
      const y = mapRange(point, minValue, maxValue, height - 30, 30)

      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })

    // Stroke the line
    ctx.stroke()

    // Fill area under the line
    ctx.lineTo(mapRange(data.length - 1, 0, data.length - 1, 0, width), height - 30)
    ctx.lineTo(0, height - 30)
    ctx.closePath()
    ctx.fillStyle = gradient
    ctx.fill()

    // Draw data points (only at key intervals for performance)
    data.forEach((point, i) => {
      if (i % 10 === 0 || i === data.length - 1) {
        const x = mapRange(i, 0, data.length - 1, 0, width)
        const y = mapRange(point, minValue, maxValue, height - 30, 30)

        ctx.beginPath()
        ctx.arc(x, y, 2, 0, Math.PI * 2)
        ctx.fillStyle = color
        ctx.fill()
      }
    })
  }

  const drawGrid = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.strokeStyle = theme === "dark" ? "rgba(255, 255, 255, 0.07)" : "rgba(0, 0, 0, 0.07)"
    ctx.lineWidth = 1

    // Draw horizontal grid lines
    for (let i = 30; i < height - 30; i += 60) {
      ctx.beginPath()
      ctx.moveTo(0, i)
      ctx.lineTo(width, i)
      ctx.stroke()
    }

    // Draw vertical grid lines
    for (let i = 0; i < width; i += 80) {
      ctx.beginPath()
      ctx.moveTo(i, 30)
      ctx.lineTo(i, height - 30)
      ctx.stroke()
    }
  }

  const drawTimeLabels = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.fillStyle = theme === "dark" ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.7)"
    ctx.font = "10px Arial"
    ctx.textAlign = "center"

    const now = new Date()
    const timeLabels = []

    // Create time labels for the last hour (in 15-minute intervals)
    for (let i = 0; i < 5; i++) {
      const time = new Date(now.getTime() - (60 - i * 15) * 60 * 1000)
      const formattedTime = time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      timeLabels.push(formattedTime)
    }

    // Add current time
    timeLabels.push(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }))

    // Draw time labels
    timeLabels.forEach((label, i) => {
      const x = mapRange(i, 0, timeLabels.length - 1, 0, width)
      ctx.fillText(label, x, height - 10)
    })
  }

  const drawPriceLabels = (ctx: CanvasRenderingContext2D, data: number[], width: number, height: number) => {
    const minValue = getMinValue(data)
    const maxValue = getMaxValue(data)

    ctx.fillStyle = theme === "dark" ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.7)"
    ctx.font = "10px Arial"
    ctx.textAlign = "right"

    // Draw min and max values
    ctx.fillText(minValue.toFixed(2), width - 5, height - 35)
    ctx.fillText(maxValue.toFixed(2), width - 5, 25)

    // Draw middle value
    const middleValue = (minValue + maxValue) / 2
    ctx.fillText(middleValue.toFixed(2), width - 5, height / 2)
  }

  // Format number with commas for thousands
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-IN").format(num.toFixed(2))
  }

  return (
    <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Real-Time Indian Indices
        </CardTitle>
        <CardDescription>Live market data | Last updated: {lastUpdated.toLocaleTimeString()}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex flex-wrap gap-2">
          {indices.map((index) => (
            <Badge
              key={index.name}
              variant={selectedIndex === index.name ? "default" : "outline"}
              className={`cursor-pointer text-sm py-1.5 px-3 ${selectedIndex === index.name ? "bg-primary" : ""}`}
              onClick={() => setSelectedIndex(index.name)}
            >
              {index.name}
            </Badge>
          ))}
        </div>

        {indices.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {indices
              .filter((index) => index.name === selectedIndex)
              .map((index) => (
                <div key={index.name} className="col-span-1 md:col-span-3 flex flex-wrap justify-between">
                  <div className="flex flex-col">
                    <span className="text-2xl font-bold">{formatNumber(index.value)}</span>
                    <div className="flex items-center gap-1">
                      {index.change >= 0 ? (
                        <span className="text-green-500 flex items-center">
                          <ArrowUp className="h-4 w-4" />+{formatNumber(index.change)} (+
                          {index.percentChange.toFixed(2)}%)
                        </span>
                      ) : (
                        <span className="text-red-500 flex items-center">
                          <ArrowDown className="h-4 w-4" />
                          {formatNumber(index.change)} ({index.percentChange.toFixed(2)}%)
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-end">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Previous Close</span>
                    <span className="font-medium">{formatNumber(index.previousClose)}</span>
                  </div>
                </div>
              ))}
          </div>
        )}

        <div ref={ref} className="relative h-[300px] rounded-lg overflow-hidden">
          <canvas ref={canvasRef} className="w-full h-full" style={{ display: "block" }} />
        </div>
      </CardContent>
    </Card>
  )
}
