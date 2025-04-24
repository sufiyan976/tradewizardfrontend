import { NextResponse } from "next/server"

// Finnhub API configuration
const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;

export async function GET() {
  try {
    // Return WebSocket connection details
    return NextResponse.json({
      wsUrl: `wss://ws.finnhub.io?token=${FINNHUB_API_KEY}`,
      message: {
        type: "subscribe",
        symbol: "NIFTY:INDICES", // Subscribe to NIFTY index news
      },
      symbols: [
        "RELIANCE:NSE",
        "TCS:NSE",
        "HDFCBANK:NSE",
        "INFY:NSE",
        "ICICIBANK:NSE",
        "NIFTY:INDICES",
        "SENSEX:INDICES",
      ],
    })
  } catch (error) {
    console.error("Error getting WebSocket details:", error)
    return NextResponse.json({ error: "Failed to get WebSocket connection details" }, { status: 500 })
  }
}
