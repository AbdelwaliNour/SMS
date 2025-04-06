import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface AnimatedSkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'chart' | 'statistic';
}

export const AnimatedSkeleton = ({
  className,
  variant = 'default',
  ...props
}: AnimatedSkeletonProps) => {
  const variants = {
    default: 'animate-pulse bg-gray-200 dark:bg-gray-800',
    chart: 'animate-pulse bg-gray-200 dark:bg-gray-800',
    statistic: 'animate-shimmer bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 bg-[length:400%_100%]',
  };

  return (
    <div
      className={cn(
        'rounded-md',
        variants[variant],
        className
      )}
      {...props}
    />
  );
};

interface StatCardSkeletonProps extends HTMLAttributes<HTMLDivElement> {}

export const StatCardSkeleton = ({ className, ...props }: StatCardSkeletonProps) => (
  <Card className={cn("rounded-lg border p-4", className)} {...props}>
    <div className="flex justify-between items-start mb-2">
      <AnimatedSkeleton className="h-5 w-24" variant="statistic" />
      <AnimatedSkeleton className="h-8 w-8 rounded-full" variant="statistic" />
    </div>
    <AnimatedSkeleton className="h-9 w-24 my-2" variant="statistic" />
    <AnimatedSkeleton className="h-2 w-full mt-2" variant="statistic" />
    <AnimatedSkeleton className="h-3 w-24 mt-3" variant="statistic" />
  </Card>
);

interface CardSkeletonProps extends HTMLAttributes<HTMLDivElement> {}

export const CardSkeleton = ({ className, ...props }: CardSkeletonProps) => (
  <Card className={cn("overflow-hidden", className)} {...props}>
    <CardHeader className="pb-2">
      <AnimatedSkeleton className="h-6 w-40" variant="statistic" />
      <AnimatedSkeleton className="h-4 w-32 mt-1" variant="statistic" />
    </CardHeader>
    <CardContent>
      <AnimatedSkeleton className="h-[calc(100%-48px)] w-full rounded-md" variant="chart" />
    </CardContent>
  </Card>
);