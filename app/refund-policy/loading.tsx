import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <Skeleton className="h-6 w-32 mb-6" />

      <Skeleton className="h-10 w-3/4 mb-6" />

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <Skeleton className="h-8 w-1/2 mb-4" />
        <Skeleton className="h-4 w-full mb-3" />
        <Skeleton className="h-4 w-full mb-3" />
        <Skeleton className="h-4 w-full mb-3" />
        <Skeleton className="h-4 w-3/4" />
      </div>

      <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-6">
        <Skeleton className="h-6 w-1/3 mb-3" />
        <Skeleton className="h-4 w-full" />
      </div>
    </div>
  )
}
