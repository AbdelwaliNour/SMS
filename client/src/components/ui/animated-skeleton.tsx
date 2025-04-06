import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { cva, type VariantProps } from "class-variance-authority";

// Define variants for our animated skeleton
const animatedSkeletonVariants = cva(
  "relative isolate overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:border-t before:border-slate-100 before:bg-gradient-to-r before:from-transparent before:via-slate-200/60 dark:before:via-slate-700/30 before:to-transparent",
  {
    variants: {
      variant: {
        default: "bg-slate-100 dark:bg-slate-800/60",
        card: "bg-slate-100 dark:bg-slate-800/80 rounded-lg",
        chart: "bg-slate-100 dark:bg-slate-800/40 rounded-md",
        statistic: "bg-slate-100 dark:bg-slate-800/60 rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface AnimatedSkeletonProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof animatedSkeletonVariants> {
  loading?: boolean;
  children?: React.ReactNode;
}

export function AnimatedSkeleton({
  className,
  variant,
  loading = true,
  children,
  ...props
}: AnimatedSkeletonProps) {
  if (!loading) {
    return <>{children}</>;
  }

  return (
    <div
      className={cn(animatedSkeletonVariants({ variant }), className)}
      {...props}
      style={{
        ...props.style,
      }}
    />
  );
}

// Predefined skeleton components
export function ChartSkeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("space-y-3", className)} {...props}>
      <AnimatedSkeleton className="h-6 w-1/3" variant="statistic" />
      <AnimatedSkeleton className="h-4 w-1/4" variant="statistic" />
      <AnimatedSkeleton className="mt-4 h-[240px] w-full" variant="chart" />
    </div>
  );
}

export function CardSkeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <AnimatedSkeleton
      className={cn("h-full rounded-xl border border-slate-200 dark:border-slate-800", className)}
      variant="card"
      {...props}
    >
      <div className="p-6">
        <AnimatedSkeleton className="h-5 w-1/3 rounded" variant="statistic" />
        <AnimatedSkeleton className="mt-2 h-4 w-1/2 rounded" variant="statistic" />
        <div className="mt-6">
          <AnimatedSkeleton className="h-64 w-full rounded" variant="chart" />
        </div>
      </div>
    </AnimatedSkeleton>
  );
}

export function StatCardSkeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <AnimatedSkeleton
      className={cn("h-[120px] rounded-xl border border-slate-200 dark:border-slate-800", className)}
      variant="card"
      {...props}
    >
      <div className="p-6">
        <AnimatedSkeleton className="h-9 w-9 rounded-full" variant="statistic" />
        <AnimatedSkeleton className="mt-3 h-5 w-1/2 rounded" variant="statistic" />
        <AnimatedSkeleton className="mt-2 h-6 w-1/3 rounded" variant="statistic" />
      </div>
    </AnimatedSkeleton>
  );
}

export function TableRowSkeleton() {
  return (
    <div className="flex items-center space-x-4 py-3">
      <AnimatedSkeleton className="h-12 w-12 rounded-full" variant="statistic" />
      <div className="space-y-2">
        <AnimatedSkeleton className="h-4 w-[200px]" variant="statistic" />
        <AnimatedSkeleton className="h-4 w-[160px]" variant="statistic" />
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <StatCardSkeleton />
      <StatCardSkeleton />
      <StatCardSkeleton />
      <StatCardSkeleton />
      <div className="md:col-span-2 lg:col-span-4">
        <CardSkeleton className="h-[400px]" />
      </div>
      <div className="md:col-span-1 lg:col-span-2">
        <CardSkeleton className="h-[400px]" />
      </div>
      <div className="md:col-span-1 lg:col-span-2">
        <CardSkeleton className="h-[400px]" />
      </div>
    </div>
  );
}