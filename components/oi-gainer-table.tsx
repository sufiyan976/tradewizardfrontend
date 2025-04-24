"use client"

import { useState } from "react"
import type { OIGainerStock } from "@/types/oi-data"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, Search } from "lucide-react"

interface OIGainerTableProps {
  data: OIGainerStock[]
}

export default function OIGainerTable({ data }: OIGainerTableProps) {
  const [sortField, setSortField] = useState<keyof OIGainerStock>("oiChangePercent")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [searchTerm, setSearchTerm] = useState("")

  const handleSort = (field: keyof OIGainerStock) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("desc")
    }
  }

  const filteredData = data.filter((item) => item.symbol.toLowerCase().includes(searchTerm.toLowerCase()))

  const sortedData = [...filteredData].sort((a, b) => {
    const aValue = a[sortField]
    const bValue = b[sortField]

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue
    }

    // Handle string sorting for symbol column
    if (sortField === "symbol") {
      return sortDirection === "asc"
        ? aValue.toString().localeCompare(bValue.toString())
        : bValue.toString().localeCompare(aValue.toString())
    }

    return 0
  })

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-IN").format(num)
  }

  return (
    <div className="w-full">
      <div className="flex items-center mb-4">
        <div className="relative w-full max-w-[280px] sm:max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by symbol..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border overflow-x-auto">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px] md:w-[120px]">
                <Button
                  variant="ghost"
                  className={`p-0 h-8 text-xs sm:text-sm font-medium flex items-center ${sortField === "symbol" ? "text-primary" : ""}`}
                  onClick={() => handleSort("symbol")}
                >
                  Stock Symbol
                  {sortField === "symbol" ? (
                    sortDirection === "asc" ? (
                      <span className="ml-2 text-primary">A→Z</span>
                    ) : (
                      <span className="ml-2 text-primary">Z→A</span>
                    )
                  ) : (
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  )}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  className={`p-0 h-8 text-xs sm:text-sm font-medium ${sortField === "oiChange" ? "text-primary" : ""}`}
                  onClick={() => handleSort("oiChange")}
                >
                  OI Change (Contracts)
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  className={`p-0 h-8 text-xs sm:text-sm font-medium ${sortField === "oiChangePercent" ? "text-primary" : ""}`}
                  onClick={() => handleSort("oiChangePercent")}
                >
                  OI Change %
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  className={`p-0 h-8 text-xs sm:text-sm font-medium ${sortField === "price" ? "text-primary" : ""}`}
                  onClick={() => handleSort("price")}
                >
                  LTP
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  className={`p-0 h-8 text-xs sm:text-sm font-medium ${sortField === "priceChangePercent" ? "text-primary" : ""}`}
                  onClick={() => handleSort("priceChangePercent")}
                >
                  Change %
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  className={`p-0 h-8 text-xs sm:text-sm font-medium ${sortField === "volume" ? "text-primary" : ""}`}
                  onClick={() => handleSort("volume")}
                >
                  Volume
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.length > 0 ? (
              sortedData.map((stock) => (
                <TableRow key={stock.symbol}>
                  <TableCell className="font-medium">{stock.symbol}</TableCell>
                  <TableCell>{formatNumber(stock.oiChange)}</TableCell>
                  <TableCell className={stock.oiChangePercent > 0 ? "text-green-500" : "text-red-500"}>
                    {stock.oiChangePercent > 0 ? "+" : ""}
                    {stock.oiChangePercent.toFixed(2)}%
                  </TableCell>
                  <TableCell>₹{stock.price.toFixed(2)}</TableCell>
                  <TableCell className={stock.priceChangePercent > 0 ? "text-green-500" : "text-red-500"}>
                    {stock.priceChangePercent > 0 ? "+" : ""}
                    {stock.priceChangePercent.toFixed(2)}%
                  </TableCell>
                  <TableCell>{formatNumber(stock.volume)}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  No results found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
