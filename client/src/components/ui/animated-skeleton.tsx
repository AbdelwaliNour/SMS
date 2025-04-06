import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface AnimatedSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  variant?: "shimmer" | "pulse";
}

export const AnimatedSkeleton = ({
  className,
  variant = "shimmer",
  ...props
}: AnimatedSkeletonProps) => {
  return (
    <Skeleton
      className={cn(
        "relative overflow-hidden",
        variant === "shimmer" && "animate-shimmer bg-gradient-to-r from-transparent via-gray-200/30 to-transparent",
        variant === "pulse" && "animate-pulse",
        className
      )}
      {...props}
    />
  );
};

interface CardSkeletonProps extends AnimatedSkeletonProps {
  width?: string | number;
  height?: string | number;
}

export const CardSkeleton = ({
  className,
  variant = "shimmer",
  width,
  height,
  ...props
}: CardSkeletonProps) => {
  return (
    <AnimatedSkeleton
      className={cn("rounded-md", className)}
      style={{
        width: width || "100%",
        height: height || "1rem"
      }}
      variant={variant}
      {...props}
    />
  );
};

interface ChartSkeletonProps extends AnimatedSkeletonProps {
  height?: number | string;
}

export const ChartSkeleton = ({
  className,
  variant = "shimmer",
  height = 300,
  ...props
}: ChartSkeletonProps) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <CardSkeleton className="h-6 w-48" variant={variant} />
        <CardSkeleton className="h-6 w-32" variant={variant} />
      </div>
      <AnimatedSkeleton
        className={cn("rounded-md bg-gray-100 dark:bg-gray-800", className)}
        style={{ height }}
        variant={variant}
        {...props}
      >
        <div className="h-full w-full flex items-center justify-center">
          <svg 
            width="100" 
            height="100" 
            viewBox="0 0 100 100" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="text-gray-300 dark:text-gray-600"
          >
            <rect x="20" y="50" width="10" height="30" rx="2" className="fill-current opacity-20" />
            <rect x="35" y="40" width="10" height="40" rx="2" className="fill-current opacity-40" />
            <rect x="50" y="30" width="10" height="50" rx="2" className="fill-current opacity-60" />
            <rect x="65" y="20" width="10" height="60" rx="2" className="fill-current opacity-80" />
            <rect x="80" y="10" width="10" height="70" rx="2" className="fill-current" />
          </svg>
        </div>
      </AnimatedSkeleton>
    </div>
  );
};

export const StatCardSkeleton = ({
  className,
  variant = "shimmer",
  ...props
}: AnimatedSkeletonProps) => {
  return (
    <div
      className={cn(
        "rounded-lg border p-4 space-y-2",
        className
      )}
      {...props}
    >
      <div className="flex justify-between items-center">
        <CardSkeleton className="h-5 w-24" variant={variant} />
        <CardSkeleton className="h-5 w-12" variant={variant} />
      </div>
      <CardSkeleton className="h-7 w-20 mt-2" variant={variant} />
      <CardSkeleton className="h-2 w-full mt-1" variant={variant} />
    </div>
  );
};

export const SkeletonTable = ({
  className,
  variant = "shimmer",
  rows = 5,
  columns = 4,
  ...props
}: AnimatedSkeletonProps & { rows?: number; columns?: number }) => {
  return (
    <div className={cn("space-y-4", className)} {...props}>
      <div className="flex space-x-4">
        {Array(columns)
          .fill(null)
          .map((_, i) => (
            <CardSkeleton key={i} className="h-6 flex-1" variant={variant} />
          ))}
      </div>
      
      {Array(rows)
        .fill(null)
        .map((_, rowIndex) => (
          <div key={rowIndex} className="flex space-x-4">
            {Array(columns)
              .fill(null)
              .map((_, colIndex) => (
                <CardSkeleton 
                  key={colIndex} 
                  className={cn(
                    "h-10 flex-1",
                    variant === "shimmer" && "opacity-70"
                  )} 
                  variant={variant} 
                />
              ))}
          </div>
        ))}
    </div>
  );
};

export const SkeletonCard = ({
  className,
  variant = "shimmer",
  ...props
}: AnimatedSkeletonProps) => {
  return (
    <div
      className={cn(
        "space-y-3 rounded-lg border border-gray-200 dark:border-gray-800 p-4",
        className
      )}
      {...props}
    >
      <CardSkeleton className="h-6 w-2/3" variant={variant} />
      <CardSkeleton className="h-4 w-full" variant={variant} />
      <CardSkeleton className="h-4 w-full" variant={variant} />
      <CardSkeleton className="h-4 w-2/3" variant={variant} />
    </div>
  );
};

export default AnimatedSkeleton;