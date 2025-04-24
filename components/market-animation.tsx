"use client"

import { useEffect, useRef, useState } from "react"
import { useTheme } from "next-themes"
import { useInView } from "react-intersection-observer"
import axios from "axios"

interface DataPoint {
  value: number
  timestamp: number
  color: string
}

interface ChartLine {
  data: DataPoint[]
  color: string
  width: number
  name: string
  visible: boolean
}

interface Ticker {
  symbol: string
  price: number
  change: string
}

export default function MarketAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [chartLines, setChartLines] = useState<ChartLine[]>([])
  const [tickers, setTickers] = useState<Ticker[]>([])
  const animationRef = useRef<number>(0)
  const { theme } = useTheme()
  const [ref, inView] = useInView({ triggerOnce: false, threshold: 0.1 })

  useEffect(() => {
    fetchTopNiftyStocks()
    const interval = setInterval(fetchTopNiftyStocks, 60000)
    return () => clearInterval(interval)
  }, [])

  const fetchTopNiftyStocks = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/stocks`)
      const stocks = response.data.filter((s: any) => s.side === "nifty50CloseAbove20" && s.close > 20)
      const sorted = [...stocks].sort((a, b) => b.volume - a.volume).slice(0, 6)

      const formatted = sorted.map((s) => ({
        symbol: s.nsecode,
        price: s.close,
        change: `${s.per_chg > 0 ? "+" : ""}${s.per_chg.toFixed(2)}%`
      }))
      setTickers(formatted)
    } catch (err) {
      console.error("Error fetching nifty50CloseAbove20 stocks", err)
    }
  }

  useEffect(() => {
    const generateChartData = () => {
      const lines: ChartLine[] = []
      const stockNames = ["NIFTY 50", "SENSEX", "BANKNIFTY", "RELIANCE"]
      const colors = ["#4f46e5", "#10b981", "#f59e0b", "#ef4444"]
      const baseValues = [22400, 73600, 48000, 2450]

      for (let i = 0; i < 4; i++) {
        let value = baseValues[i]
        const data: DataPoint[] = []
        for (let j = 0; j < 80; j++) {
          const change = (Math.random() - 0.48) * (value * 0.002)
          value = Math.max(value * 0.95, value + change)
          data.push({
            value,
            timestamp: Date.now() - (80 - j) * 1000 * 60 * 5,
            color: value > data[data.length - 1]?.value ? "#10b981" : "#ef4444",
          })
        }
        lines.push({ data, color: colors[i], width: 2, name: stockNames[i], visible: true })
      }
      return lines
    }
    setChartLines(generateChartData())
  }, [])

  useEffect(() => {
    if (!canvasRef.current || !chartLines.length || !inView) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

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
      if (timestamp - lastUpdateTime > 40) {
        lastUpdateTime = timestamp

        ctx.clearRect(0, 0, canvas.width, canvas.height)
        drawGrid(ctx, rect.width, rect.height)

        chartLines.forEach((line, index) => {
          if (!line.visible) return
          const progress = Math.min(1, elapsed / 1800)
          const pointsToDraw = Math.floor(line.data.length * progress)

          drawLine(ctx, line.data.slice(0, pointsToDraw), rect.width, rect.height, line.color, line.width)

          const lastPoint = line.data[pointsToDraw - 1]
          if (lastPoint) {
            const x = mapRange(pointsToDraw - 1, 0, line.data.length - 1, 0, rect.width)
            const y = mapRange(lastPoint.value, getMinValue(line.data), getMaxValue(line.data), rect.height - 30, 30)

            ctx.fillStyle = line.color
            ctx.font = "bold 12px Arial"
            ctx.fillText(line.name, x + 5, y - 5)
            ctx.fillText(`₹${lastPoint.value.toFixed(0)}`, x + 5, y + 15)
          }
        })

        drawPriceTickers(ctx, rect.width, rect.height, elapsed)
      }

      animationRef.current = requestAnimationFrame(animate)
    }
    animationRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationRef.current)
  }, [chartLines, inView, theme, tickers])

  const getMinValue = (data: DataPoint[]) => Math.min(...data.map((d) => d.value)) * 0.995
  const getMaxValue = (data: DataPoint[]) => Math.max(...data.map((d) => d.value)) * 1.005
  const mapRange = (value: number, inMin: number, inMax: number, outMin: number, outMax: number) =>
    ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin

  const drawLine = (ctx: CanvasRenderingContext2D, data: DataPoint[], width: number, height: number, color: string, lineWidth: number) => {
    if (data.length < 2) return
    const minValue = getMinValue(data)
    const maxValue = getMaxValue(data)
    ctx.beginPath()
    ctx.lineWidth = lineWidth
    ctx.strokeStyle = color
    data.forEach((point, i) => {
      const x = mapRange(i, 0, data.length - 1, 0, width)
      const y = mapRange(point.value, minValue, maxValue, height - 30, 30)
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    })
    ctx.stroke()
  }

  const drawGrid = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.strokeStyle = theme === "dark" ? "rgba(255, 255, 255, 0.07)" : "rgba(0, 0, 0, 0.07)"
    ctx.lineWidth = 1
    for (let i = 30; i < height - 30; i += 60) {
      ctx.beginPath()
      ctx.moveTo(0, i)
      ctx.lineTo(width, i)
      ctx.stroke()
    }
    for (let i = 0; i < width; i += 80) {
      ctx.beginPath()
      ctx.moveTo(i, 30)
      ctx.lineTo(i, height - 30)
      ctx.stroke()
    }
  }

  const drawPriceTickers = (ctx: CanvasRenderingContext2D, width: number, height: number, elapsed: number) => {
    const tickerWidth = 160
    const tickerHeight = 25
    const offset = (elapsed / 60) % (tickers.length * tickerWidth)
    ctx.font = "12px Arial"
    tickers.forEach((ticker, i) => {
      const x = width - offset + i * tickerWidth
      if (x < -tickerWidth || x > width) return
      const isPositive = ticker.change.startsWith("+")
      ctx.fillStyle = theme === "dark" ? "rgba(0, 0, 0, 0.6)" : "rgba(255, 255, 255, 0.6)"
      ctx.fillRect(x, height - tickerHeight, tickerWidth - 10, tickerHeight)
      ctx.fillStyle = theme === "dark" ? "#fff" : "#000"
      ctx.fillText(ticker.symbol, x + 5, height - 8)
      ctx.fillStyle = isPositive ? "#10b981" : "#ef4444"
      ctx.fillText(`₹${ticker.price} (${ticker.change})`, x + 70, height - 8)
    })
  }

  return (
    <div ref={ref} className="relative h-[300px] rounded-lg overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-full" style={{ display: "block" }} />
      <div className="absolute top-2 left-2 bg-background/80 backdrop-blur-sm p-2 rounded text-xs font-medium">
        Indian Market Visualization
      </div>
    </div>
  )
}
