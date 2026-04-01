import { Skeleton } from "@/components/ui/skeleton";

interface PageLoadingProps {
  titleWidth?: string;
  lines?: number;
}

export function PageLoading({
  titleWidth = "w-72",
  lines = 3,
}: PageLoadingProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Skeleton className="h-5 w-28" />
        <Skeleton className={`h-11 ${titleWidth}`} />
        {Array.from({ length: lines }).map((_, index) => (
          <Skeleton key={index} className="h-4 w-full max-w-2xl" />
        ))}
      </div>
      <div className="grid gap-4">
        <Skeleton className="h-40 w-full rounded-[1.5rem]" />
        <Skeleton className="h-56 w-full rounded-[1.5rem]" />
      </div>
    </div>
  );
}
