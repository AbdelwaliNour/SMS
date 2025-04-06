import { 
  AnimatedSkeleton, 
  StatCardSkeleton, 
  CardSkeleton 
} from "@/components/ui/animated-skeleton";

export function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <AnimatedSkeleton className="h-6 w-48" variant="statistic" />
        <AnimatedSkeleton className="h-9 w-32" variant="statistic" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCardSkeleton className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/40 dark:to-blue-900/30 border-blue/20" />
        <StatCardSkeleton className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/40 dark:to-green-900/30 border-green/20" />
        <StatCardSkeleton className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950/40 dark:to-yellow-900/30 border-yellow/20" />
        <StatCardSkeleton className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/40 dark:to-red-900/30 border-red/20" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CardSkeleton className="h-[420px]" />
        <CardSkeleton className="h-[420px]" />
      </div>
      
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <CardSkeleton className="h-[350px] xl:col-span-2" />
        <CardSkeleton className="h-[350px]" />
      </div>
    </div>
  );
}