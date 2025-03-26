import StatCard from './StatCard';
import { useQuery } from '@tanstack/react-query';

// Type definition for stats data
interface StatsData {
  students: {
    total: number;
    male: number;
    female: number;
    present: number;
    absent: number;
  };
  classrooms: {
    total: number;
    sections: number;
  };
  employees: {
    total: number;
    teachers: number;
    others: number;
    shifts: number;
  };
  finance: {
    paidStudents: number;
    unpaidStudents: number;
    collectedAmount: number;
    uncollectedAmount: number;
  };
  exams: {
    subjects: number;
    types: number;
    highestScore: number;
    lowestScore: number;
  };
}

const StatsGrid = () => {
  const { data: stats, isLoading, error } = useQuery<StatsData>({
    queryKey: ['/api/stats'],
    
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-900 rounded-lg shadow h-48 animate-pulse"></div>
        ))}
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-8">
        <p>Error loading statistics. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <StatCard
        title="FACILITY"
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
        }
        stat1={{
          label: "Employees",
          value: stats.employees.total
        }}
        stat2={{
          label: "Shifts",
          value: stats.employees.shifts
        }}
      />
      
      <StatCard
        title="EMPLOYEES"
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        }
        stat1={{
          label: "Teachers",
          value: stats.employees.teachers
        }}
        stat2={{
          label: "Others",
          value: stats.employees.others
        }}
      />
      
      <StatCard
        title="STATUS"
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
            />
          </svg>
        }
        stat1={{
          label: "Present",
          value: stats.students.present
        }}
        stat2={{
          label: "Absent",
          value: stats.students.absent
        }}
      />
    </div>
  );
};

export default StatsGrid;
