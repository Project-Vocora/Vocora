import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white p-4">
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Skeleton className="h-8 w-24" />
          <div className="flex items-center gap-4">
            <Skeleton className="h-8 w-24 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-64 w-full rounded-xl mb-8" />

          <Skeleton className="h-8 w-40 mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Skeleton className="h-40 w-full rounded-xl" />
            <Skeleton className="h-40 w-full rounded-xl" />
            <Skeleton className="h-40 w-full rounded-xl" />
          </div>

          <Skeleton className="h-8 w-40 mb-4" />
          <Skeleton className="h-40 w-full rounded-xl mb-8" />

          <div className="grid md:grid-cols-2 gap-6">
            <Skeleton className="h-40 w-full rounded-xl" />
            <Skeleton className="h-40 w-full rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  )
}
