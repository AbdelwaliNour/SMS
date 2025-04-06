import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { ResponsiveCard } from '@/components/ui/responsive-card';
import { AnimatedSkeleton } from '@/components/ui/animated-skeleton';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface StudentPerformanceSummaryProps {
  studentId: number;
  className?: string;
}

interface StatCardProps {
  title: string;
  value: number;
  maxValue?: number;
  unit?: string;
  color: 'green' | 'blue' | 'yellow' | 'red';
  icon?: React.ReactNode;
  changeDirection?: 'up' | 'down' | 'none';
  changeValue?: number;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  maxValue = 100,
  unit = '%',
  color,
  icon,
  changeDirection = 'none',
  changeValue,
}) => {
  // Color mapping for different states
  const colorClasses = {
    green: {
      bg: 'bg-gradient-to-r from-green-500/20 to-green-400/10',
      text: 'text-green',
      border: 'border-green/20',
      progress: 'bg-green',
    },
    blue: {
      bg: 'bg-gradient-to-r from-blue-500/20 to-blue-400/10',
      text: 'text-blue',
      border: 'border-blue/20',
      progress: 'bg-blue',
    },
    yellow: {
      bg: 'bg-gradient-to-r from-yellow-500/20 to-yellow-400/10',
      text: 'text-yellow',
      border: 'border-yellow/20',
      progress: 'bg-yellow',
    },
    red: {
      bg: 'bg-gradient-to-r from-red-500/20 to-red-400/10',
      text: 'text-red',
      border: 'border-red/20',
      progress: 'bg-red',
    },
  };

  // Calculate percentage for progress bar
  const percentage = Math.min(Math.round((value / maxValue) * 100), 100);

  return (
    <div className={cn(
      'rounded-lg border p-4',
      colorClasses[color].bg,
      colorClasses[color].border
    )}>
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</h3>
        {icon && (
          <div className={cn('p-2 rounded-full', colorClasses[color].bg)}>
            {icon}
          </div>
        )}
      </div>
      
      <div className="flex items-baseline">
        <span className={cn('text-2xl font-bold', colorClasses[color].text)}>
          {value}
        </span>
        <span className="text-sm ml-1 text-gray-600 dark:text-gray-400">
          {unit}
        </span>
      </div>
      
      <div className="mt-2">
        <Progress 
          value={percentage} 
          indicatorClassName={colorClasses[color].progress} 
          className="h-1.5 bg-gray-200/50"
        />
      </div>
      
      {changeDirection !== 'none' && changeValue !== undefined && (
        <div className="mt-2 flex items-center text-xs">
          <span className={cn(
            'flex items-center',
            changeDirection === 'up' ? 'text-green' : changeDirection === 'down' ? 'text-red' : ''
          )}>
            {changeDirection === 'up' && (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            )}
            {changeDirection === 'down' && (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
            {changeValue}{unit} from previous term
          </span>
        </div>
      )}
    </div>
  );
};

export default function StudentPerformanceSummary({ 
  studentId, 
  className 
}: StudentPerformanceSummaryProps) {
  // In a real application, we would fetch data from the API
  // Here we're using a loading state to simulate data fetching
  const { isLoading } = useQuery({
    queryKey: ['/api/results/student/summary', studentId],
    enabled: false, // Disable the actual query since we're using mock data for the demo
  });

  // Generate mock data based on studentId for demo purposes
  // In a real app, this would come from the API
  const generateMockData = () => {
    // Use studentId to generate consistent values for the same student
    const baseAverage = 65 + (studentId % 20);
    const baseAttendance = 80 + (studentId % 15);
    
    return {
      overallAverage: baseAverage,
      attendanceRate: baseAttendance,
      assignmentsCompleted: 85 + (studentId % 10),
      participationScore: 70 + (studentId % 25),
      changeFromPrevious: (studentId % 10) - 4, // This will give a range from -4 to +5
    };
  };
  
  const performanceData = generateMockData();
  
  return (
    <ResponsiveCard
      title="Performance Summary"
      description="Key performance indicators for the current academic period"
      className={className}
    >
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <AnimatedSkeleton key={i} className="h-28" variant="statistic" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            title="Overall Grade Average"
            value={performanceData.overallAverage}
            color={
              performanceData.overallAverage >= 90 ? 'green' :
              performanceData.overallAverage >= 75 ? 'blue' :
              performanceData.overallAverage >= 60 ? 'yellow' : 'red'
            }
            changeDirection={performanceData.changeFromPrevious > 0 ? 'up' : performanceData.changeFromPrevious < 0 ? 'down' : 'none'}
            changeValue={Math.abs(performanceData.changeFromPrevious)}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            }
          />
          
          <StatCard 
            title="Attendance Rate"
            value={performanceData.attendanceRate}
            color={
              performanceData.attendanceRate >= 90 ? 'green' :
              performanceData.attendanceRate >= 75 ? 'blue' :
              performanceData.attendanceRate >= 60 ? 'yellow' : 'red'
            }
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            }
          />
          
          <StatCard 
            title="Assignments Completed"
            value={performanceData.assignmentsCompleted}
            color={
              performanceData.assignmentsCompleted >= 90 ? 'green' :
              performanceData.assignmentsCompleted >= 75 ? 'blue' :
              performanceData.assignmentsCompleted >= 60 ? 'yellow' : 'red'
            }
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            }
          />
          
          <StatCard 
            title="Participation Score"
            value={performanceData.participationScore}
            color={
              performanceData.participationScore >= 90 ? 'green' :
              performanceData.participationScore >= 75 ? 'blue' :
              performanceData.participationScore >= 60 ? 'yellow' : 'red'
            }
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
              </svg>
            }
          />
        </div>
      )}
    </ResponsiveCard>
  );
}