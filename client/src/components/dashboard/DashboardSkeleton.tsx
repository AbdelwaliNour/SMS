
import { 
  AnimatedSkeleton,
  CardSkeleton
} from "@/components/ui/animated-skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      {/* Welcome Section Skeleton */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <AnimatedSkeleton className="h-8 w-48 mb-2" variant="statistic" />
            <AnimatedSkeleton className="h-4 w-64" variant="statistic" />
          </div>
          <div className="flex items-center space-x-4">
            <AnimatedSkeleton className="h-10 w-10 rounded-lg" variant="statistic" />
            <AnimatedSkeleton className="h-12 w-12 rounded-full" variant="statistic" />
          </div>
        </div>
      </div>
      
      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/40 dark:to-gray-900/30">
            <CardHeader className="pb-2">
              <AnimatedSkeleton className="h-5 w-5" variant="statistic" />
            </CardHeader>
            <CardContent>
              <AnimatedSkeleton className="h-8 w-20 mb-1" variant="statistic" />
              <AnimatedSkeleton className="h-4 w-24" variant="statistic" />
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Table Skeleton */}
      <Card>
        <CardHeader>
          <AnimatedSkeleton className="h-6 w-48" variant="statistic" />
        </CardHeader>
        <CardContent>
          <CardSkeleton className="h-[420px]" />
        </CardContent>
      </Card>
    </div>
  );
}
