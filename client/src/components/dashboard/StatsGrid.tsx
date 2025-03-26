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
      <div className="mb-8">
        <div className="h-8 w-64 bg-gray-200 dark:bg-gray-800 rounded-md mb-6 animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-gray-100 dark:bg-gray-900 rounded-xl shadow h-52 animate-pulse">
              <div className="h-full p-6 flex flex-col">
                <div className="flex justify-between mb-4">
                  <div className="h-6 w-1/3 bg-gray-200 dark:bg-gray-800 rounded"></div>
                  <div className="h-8 w-8 rounded-lg bg-gray-200 dark:bg-gray-800"></div>
                </div>
                <div className="flex-grow"></div>
                <div className="grid grid-cols-2 gap-4 mt-auto">
                  <div className="h-20 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
                  <div className="h-20 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="mb-8">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-6 py-4 rounded-xl shadow-sm mb-8 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h3 className="font-bold text-lg mb-1">Unable to load dashboard data</h3>
            <p>There was an error loading the statistics. Please refresh the page or try again later.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <h2 className="text-xl font-homenaje mb-6 text-gray-800 dark:text-gray-200">School Analytics Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Students"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          }
          stat1={{
            label: "Total",
            value: stats.students.total,
            color: 'blue'
          }}
          stat2={{
            label: "Gender Ratio",
            value: `${stats.students.male}/${stats.students.female}`,
            color: 'green'
          }}
          cardColor="blue"
        />
        
        <StatCard
          title="Attendance"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
            value: stats.students.present,
            color: 'green'
          }}
          stat2={{
            label: "Absent",
            value: stats.students.absent,
            color: 'red'
          }}
          cardColor="green"
        />
        
        <StatCard
          title="Staff"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
            value: stats.employees.teachers,
            color: 'blue'
          }}
          stat2={{
            label: "Support Staff",
            value: stats.employees.others,
            color: 'yellow'
          }}
          cardColor="yellow"
        />
        
        <StatCard
          title="Facilities"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          }
          stat1={{
            label: "Classrooms",
            value: stats.classrooms.total
          }}
          stat2={{
            label: "Sections",
            value: stats.classrooms.sections
          }}
          cardColor="blue"
        />
        
        <StatCard
          title="Finance"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
          stat1={{
            label: "Collected",
            value: `$${stats.finance.collectedAmount}`,
            color: 'green'
          }}
          stat2={{
            label: "Outstanding",
            value: `$${stats.finance.uncollectedAmount}`,
            color: 'red'
          }}
          cardColor="green"
        />
        
        <StatCard
          title="Examinations"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          }
          stat1={{
            label: "Subjects",
            value: stats.exams.subjects
          }}
          stat2={{
            label: "Types",
            value: stats.exams.types
          }}
          cardColor="red"
        />
      </div>
    </div>
  );
};

export default StatsGrid;
