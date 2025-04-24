import { Skeleton } from "@/components/ui/skeleton"

export default function DisclaimerLoading() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-8">
        <Skeleton className="h-6 w-32" />
      </div>

      <div className="space-y-8">
        <Skeleton className="h-10 w-48 mb-6" />

        <div className="space-y-6">
          <Skeleton className="h-8 w-64 mb-4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />

          <Skeleton className="h-8 w-64 mt-8 mb-4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />

          <Skeleton className="h-8 w-64 mt-8 mb-4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />

          <Skeleton className="h-8 w-64 mt-8 mb-4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />

          <Skeleton className="h-4 w-48 mt-8" />
        </div>
      </div>
    </div>
  )
}
