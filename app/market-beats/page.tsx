"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import {
  Activity,
  ArrowUpRight,
  Info,
  LineChart,
  BarChart,
  TrendingDown,
  TrendingUp,
  ExternalLink,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import MarketBeatsNews from "@/components/market-beats-news";

type Stock = {
  side: string;
  close: number;
  per_chg: number;
  volume: number;
};

export default function MarketBeatsCombined() {
  const [data1, setData1] = useState({ advancing: 0, declining: 0, count: 0 });
  const [data2, setData2] = useState({ advancing: 0, declining: 0, count: 0 });

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/stocks`);
      const stocks: Stock[] = response.data;

      // Classic Breadth
      const topGainers = stocks.filter((s) => s.side === "topGainers" && s.close >= 100 && s.per_chg > 0);
      const topLosers = stocks.filter((s) => s.side === "topLosers" && s.close >= 100 && s.per_chg < 0);
      const advVol1 = topGainers.reduce((sum, s) => sum + s.volume, 0);
      const decVol1 = topLosers.reduce((sum, s) => sum + s.volume, 0);
      setData1({ advancing: advVol1, declining: decVol1, count: topGainers.length + topLosers.length });

      // Volume Gainers Breadth
      const volumeGainers = stocks.filter(s => s.side === "volumeGainers" );
      const advVolumeGainers = volumeGainers.filter(s => s.per_chg > 0);
      const decVolumeGainers = volumeGainers.filter(s => s.per_chg < 0);

      const advVol2 = advVolumeGainers.reduce((sum, s) => sum + s.volume, 0);
      const decVol2 = decVolumeGainers.reduce((sum, s) => sum + s.volume, 0);

      setData2({ advancing: advVol2, declining: decVol2, count: volumeGainers.length });
    } catch (err) {
      console.error("Fetch error", err);
    }
  };

  const renderBreadth = (title: string, data: { advancing: number; declining: number; count: number }) => {
    const total = data.advancing + data.declining;
    const advPct = total ? ((data.advancing / total) * 100).toFixed(1) : "0";
    const decPct = total ? ((data.declining / total) * 100).toFixed(1) : "0";
    const ratio = data.declining ? (data.advancing / data.declining).toFixed(2) : "0.00";

    const isBull = parseFloat(ratio) > 1.2;
    const isBear = parseFloat(ratio) < 0.8;
    const trend = isBull ? "Bullish" : isBear ? "Bearish" : "Neutral";
    const trendColor = isBull ? "green" : isBear ? "red" : "gray";
    const clamped = Math.max(0.3, Math.min(parseFloat(ratio), 2));
    const trendPercent = ((clamped - 0.3) / (2 - 0.3)) * 100;

    const pieData = [
      { name: "Advancing", value: data.advancing },
      { name: "Declining", value: data.declining },
    ];

    return (
      


      <Card className="w-full overflow-hidden">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Activity className="h-4 w-4 sm:h-5 sm:w-5" />
            {title}
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">Volume-weighted market breadth indicators</CardDescription>
        </CardHeader>
        
        <CardContent className="p-4 sm:p-6 space-y-6">
          <div>
         
            <h3 className="text-base font-medium mb-3">Volume Distribution</h3>
            <div className="space-y-3">
              <div className="flex flex-wrap gap-x-6 gap-y-2">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2" />
                  <span className="font-medium">Advancing:</span>
                  <span className="ml-1">₹{(data.advancing / 10000000).toFixed(2)} Cr ({advPct}%)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-red-500 mr-2" />
                  <span className="font-medium">Declining:</span>
                  <span className="ml-1">₹{(data.declining / 10000000).toFixed(2)} Cr ({decPct}%)</span>
                </div>
              </div>
              <div className="w-full h-6 rounded-full overflow-hidden flex">
                <div className="h-full bg-green-500" style={{ width: `${advPct}%` }}></div>
                <div className="h-full bg-red-500" style={{ width: `${decPct}%` }}></div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-base font-medium mb-3">Market Strength Indicator</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-red-500 font-medium">Bearish</span>
                <span className="text-gray-500 font-medium">Neutral</span>
                <span className="text-green-500 font-medium">Bullish</span>
              </div>
              <div className="relative">
                <div className="w-full h-2 rounded-full overflow-hidden flex">
                  <div className="h-full" style={{ width: "33.3%", background: "linear-gradient(to right, #ef4444, #eab308)" }}></div>
                  <div className="h-full" style={{ width: "33.3%", background: "linear-gradient(to right, #eab308, #84cc16)" }}></div>
                  <div className="h-full" style={{ width: "33.3%", background: "linear-gradient(to right, #84cc16, #22c55e)" }}></div>
                </div>
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-blue-500 border-2 border-white dark:border-gray-800"
                  style={{ left: `${trendPercent}%`, transform: "translate(-50%, -50%)" }}
                />
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-medium">Volume A/D Ratio:</span>
                  <span className={`ml-1 text-${trendColor}-500`}>{ratio}</span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium mr-2">Trend:</span>
                  <Badge className={`bg-${trendColor}-500 hover:bg-${trendColor}-600 text-white`}>
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    {trend}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full flex justify-center py-4">
            <div style={{ width: 200, height: 200, position: "relative" }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={["#22c55e", "#ef4444"][index % 2]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute top-1/2 left-1/2 text-center transform -translate-x-1/2 -translate-y-1/2">
                <p className="text-xl font-bold">{data.count}</p>
                <p className="text-xs text-muted-foreground">Stocks</p>
              </div>
            </div>
          </div>

          <div className="bg-muted/10 p-3 sm:p-4 rounded-lg border border-dashed border-muted-foreground/30">
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
              <p className="text-xs sm:text-sm text-muted-foreground">
                <span className="font-medium">Calculation Method:</span> Market breadth analyzes trading volume of advancing vs declining securities for a more accurate representation of market sentiment.
              </p>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="link" className="text-xs sm:text-sm h-auto p-0 mt-2">Why volume-weighted?</Button>
              </DialogTrigger>
              <DialogContent className="max-w-[90vw] sm:max-w-md p-4 sm:p-6">
                <DialogHeader className="mb-2 sm:mb-4">
                  <DialogTitle className="text-base sm:text-lg">Volume-Weighted Market Breadth</DialogTitle>
                  <DialogDescription className="text-xs sm:text-sm pt-1.5">Unlike traditional indicators that simply count stocks, volume-weighted breadth considers trading volume.</DialogDescription>
                </DialogHeader>
                <div className="text-xs sm:text-sm space-y-2">
                  <p>Volume-weighted analysis gives more importance to heavily traded stocks, providing a better picture of institutional activity and true market participation.</p>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
     
    );
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 py-6 space-y-6 md:space-y-8">
    {/* Title and Intro (moved to top) */}
    <div className="mb-2 md:mb-4">
      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Market Beats</h1>
      <p className="text-sm sm:text-base text-muted-foreground mt-1 sm:mt-2">
        Real-time market insights, breadth data, and sector performance to make informed trading decisions.
      </p>
    </div>
    
      <Tabs defaultValue="classic" className="w-full ">
        <TabsList className="mb-4">
          <TabsTrigger value="classic">Classic Breadth</TabsTrigger>
          <TabsTrigger value="volumeGainers">Advance Volume Breadth</TabsTrigger>
        </TabsList>
        <TabsContent value="classic">{renderBreadth("Classic Breadth Overview", data1)}
        
        </TabsContent>
        <TabsContent value="volumeGainers">{renderBreadth("Volume Gainers Breadth", data2)}</TabsContent>
      </Tabs>
  
{/* Advanced Dashboard - Responsive layout and spacing */}
<Card className="w-full overflow-hidden">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <PieChart className="h-4 w-4 sm:h-5 sm:w-5" />
            Advanced Dashboard
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">Comprehensive market analysis and insights</CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="space-y-4 sm:space-y-6">
            {/* First row of features - Responsive stacking */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
              <div className="flex-1 flex items-start space-x-3 sm:space-x-4">
                <div className="bg-primary/10 p-2 sm:p-3 rounded-lg flex-shrink-0">
                  <BarChart className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-medium mb-0.5 sm:mb-1">Sector Performance Analysis</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Track sector movements to identify trending sectors and spot emerging opportunities.
                  </p>
                </div>
              </div>
              <div className="flex-1 flex items-start space-x-3 sm:space-x-4">
                <div className="bg-primary/10 p-2 sm:p-3 rounded-lg flex-shrink-0">
                  <LineChart className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-medium mb-0.5 sm:mb-1">Market Breadth Indicators</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    View advance-decline ratios and market participation to gauge overall market health.
                  </p>
                </div>
              </div>
            </div>

            {/* Second row of features - Responsive stacking */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
              <div className="flex-1 flex items-start space-x-3 sm:space-x-4">
                <div className="bg-primary/10 p-2 sm:p-3 rounded-lg flex-shrink-0">
                  <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-medium mb-0.5 sm:mb-1">Momentum & Strength Metrics</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Find stocks showing strong momentum and potential breakouts with relative strength indicators.
                  </p>
                </div>
              </div>
              <div className="flex-1 flex items-start space-x-3 sm:space-x-4">
                <div className="bg-primary/10 p-2 sm:p-3 rounded-lg flex-shrink-0">
                  <TrendingDown className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-medium mb-0.5 sm:mb-1">Volatility & Risk Assessment</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Monitor market volatility to better time your entries and exits.
                  </p>
                </div>
              </div>
            </div>

            {/* Info box - Responsive padding and text */}
            <div className="bg-muted/50 p-3 sm:p-4 rounded-lg">
              <p className="text-xs sm:text-sm">
                Get institutional-grade market analytics to make better investment decisions. Quickly assess market
                conditions and find opportunities to improve your trading strategy and timing.
              </p>
            </div>

            {/* External Dashboard Link - Responsive button */}
            <div className="mt-4 sm:mt-6 pt-2 sm:pt-4 flex justify-center">
              <a
                href="https://chartink.com/dashboard/308741"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 sm:gap-2 text-primary hover:text-primary/80 transition-colors"
              >
                <Button variant="outline" size="sm" className="h-8 sm:h-10 text-xs sm:text-sm gap-1 sm:gap-2">
                  <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4" />
                  Open Advanced Dashboard
                </Button>
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="w-full pt-6">
        <MarketBeatsNews />
      </div>
      
    </div>
  );
}
