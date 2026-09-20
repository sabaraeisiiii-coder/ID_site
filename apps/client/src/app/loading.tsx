import { Skeleton } from "@/components/ui/skeleton";
import { Container } from "@/design-system/primitives";

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 border-b border-border bg-surface"
        style={{ height: "var(--header-height-desktop)" }}>
        <Container className="h-full flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Skeleton className="h-8 w-8 rounded-md" />
            <Skeleton className="h-5 w-16" />
          </div>
          <Skeleton className="hidden md:block h-9 flex-1 max-w-md mx-auto rounded-md" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
        </Container>
      </header>

      <Container className="py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="flex flex-col gap-4">
            <Skeleton className="h-6 w-32 rounded-full" />
            <Skeleton className="h-14 w-3/4" />
            <Skeleton className="h-14 w-1/2" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-2/3" />
            <div className="flex gap-3 mt-4">
              <Skeleton className="h-12 w-36 rounded-md" />
              <Skeleton className="h-12 w-36 rounded-md" />
            </div>
          </div>
          <Skeleton className="aspect-[4/5] sm:aspect-[4/3] w-full rounded-xl" />
        </div>
      </Container>

      <Container className="py-12">
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-2">
              <Skeleton className="aspect-[4/5] w-full rounded-lg" />
              <Skeleton className="h-3 w-1/2" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/3" />
            </div>
          ))}
        </div>
      </Container>

      <div className="mt-auto border-t border-border bg-surface">
        <Container className="py-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-3">
                <Skeleton className="h-4 w-24" />
                {Array.from({ length: 4 }).map((_, j) => (<Skeleton key={j} className="h-3 w-full" />))}
              </div>
            ))}
          </div>
        </Container>
      </div>
    </div>
  );
}
