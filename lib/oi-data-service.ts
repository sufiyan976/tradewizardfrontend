import type { OIGainerStock } from "@/types/oi-data"

// This would be replaced with actual API calls in a production environment
export async function fetchOIGainers(): Promise<OIGainerStock[]> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Mock data for OI gainers
  return [
    {
      symbol: "RELIANCE",
      oiChange: 1245678,
      oiChangePercent: 15.4,
      price: 2876.45,
      priceChange: 42.35,
      priceChangePercent: 1.49,
      volume: 3456789,
    },
    {
      symbol: "HDFCBANK",
      oiChange: 987654,
      oiChangePercent: 12.8,
      price: 1678.9,
      priceChange: 23.45,
      priceChangePercent: 1.42,
      volume: 2345678,
    },
    {
      symbol: "INFY",
      oiChange: 876543,
      oiChangePercent: 10.5,
      price: 1567.8,
      priceChange: 18.9,
      priceChangePercent: 1.22,
      volume: 1987654,
    },
    {
      symbol: "TCS",
      oiChange: 765432,
      oiChangePercent: 9.8,
      price: 3456.7,
      priceChange: 32.1,
      priceChangePercent: 0.94,
      volume: 1876543,
    },
    {
      symbol: "ICICIBANK",
      oiChange: 654321,
      oiChangePercent: 8.7,
      price: 987.65,
      priceChange: 12.35,
      priceChangePercent: 1.27,
      volume: 1765432,
    },
    {
      symbol: "SBIN",
      oiChange: 543210,
      oiChangePercent: 7.6,
      price: 654.3,
      priceChange: 8.75,
      priceChangePercent: 1.35,
      volume: 1654321,
    },
    {
      symbol: "TATAMOTORS",
      oiChange: 432109,
      oiChangePercent: 6.5,
      price: 789.45,
      priceChange: 9.8,
      priceChangePercent: 1.26,
      volume: 1543210,
    },
    {
      symbol: "AXISBANK",
      oiChange: 321098,
      oiChangePercent: 5.4,
      price: 876.55,
      priceChange: 7.65,
      priceChangePercent: 0.88,
      volume: 1432109,
    },
    {
      symbol: "WIPRO",
      oiChange: 210987,
      oiChangePercent: 4.3,
      price: 456.7,
      priceChange: 5.45,
      priceChangePercent: 1.21,
      volume: 1321098,
    },
    {
      symbol: "BHARTIARTL",
      oiChange: 109876,
      oiChangePercent: 3.2,
      price: 987.6,
      priceChange: 6.75,
      priceChangePercent: 0.69,
      volume: 1210987,
    },
    // Add a few entries with negative OI changes for better representation
    {
      symbol: "SUNPHARMA",
      oiChange: -98765,
      oiChangePercent: -5.4,
      price: 1234.56,
      priceChange: -15.67,
      priceChangePercent: -1.25,
      volume: 876543,
    },
    {
      symbol: "KOTAKBANK",
      oiChange: -76543,
      oiChangePercent: -4.3,
      price: 2345.67,
      priceChange: -12.34,
      priceChangePercent: -0.52,
      volume: 765432,
    },
  ]
}
