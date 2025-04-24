import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-5 w-40 mt-2 md:mt-0" />
      </div>

      <Skeleton className="h-20 w-full mb-8" />

      <div className="mb-6">
        <Skeleton className="h-10 w-full max-w-md" />
      </div>

      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-full" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Skeleton className="h-6 w-48 mb-2" />
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-4 w-3/4" />
          </div>

          <div>
            <Skeleton className="h-6 w-48 mb-2" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array(4)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="flex gap-2">
                    <Skeleton className="h-5 w-5 mt-0.5" />
                    <div className="flex-1">
                      <Skeleton className="h-5 w-32 mb-1" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div>
            <Skeleton className="h-6 w-48 mb-2" />
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-4 w-3/4" />
          </div>

          <Skeleton className="h-24 w-full" />
        </CardContent>
      </Card>
    </div>
  )
}
