import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardHeader, CardContent } from "@/components/ui/card"

export default function GlobalNewsLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-6 w-64 mt-2 md:mt-0" />
      </div>

      <Skeleton className="h-12 w-full mb-6" />

      <div className="space-y-6">
        {Array(10)
          .fill(0)
          .map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-8 w-full max-w-2xl mb-2" />
                <div className="flex gap-4">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4 mb-4" />
                <Skeleton className="h-4 w-32" />
              </CardContent>
            </Card>
          ))}
      </div>

      <div className="flex justify-between items-center mt-8">
        <Skeleton className="h-4 w-32" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-24" />
          <div className="flex items-center gap-1">
            {Array(4)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={i} className="h-8 w-8" />
              ))}
          </div>
          <Skeleton className="h-8 w-24" />
        </div>
      </div>
    </div>
  )
}
