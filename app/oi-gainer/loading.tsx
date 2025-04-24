import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="container px-4 py-8 mx-auto">
      <Skeleton className="h-10 w-[250px] mb-6" />

      <div className="grid gap-6">
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="p-6">
            <Skeleton className="h-7 w-[200px] mb-4" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
          <div className="p-6 pt-0">
            <div className="grid gap-4">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="grid grid-cols-5 gap-4">
                    <Skeleton className="h-10 col-span-1" />
                    <Skeleton className="h-10 col-span-1" />
                    <Skeleton className="h-10 col-span-1" />
                    <Skeleton className="h-10 col-span-1" />
                    <Skeleton className="h-10 col-span-1" />
                  </div>
                ))}
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="p-6">
            <Skeleton className="h-7 w-[250px] mb-4" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
          <div className="p-6 pt-0">
            <div className="grid gap-4">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="grid grid-cols-7 gap-4">
                    <Skeleton className="h-10 col-span-1" />
                    <Skeleton className="h-10 col-span-1" />
                    <Skeleton className="h-10 col-span-1" />
                    <Skeleton className="h-10 col-span-1" />
                    <Skeleton className="h-10 col-span-1" />
                    <Skeleton className="h-10 col-span-1" />
                    <Skeleton className="h-10 col-span-1" />
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
