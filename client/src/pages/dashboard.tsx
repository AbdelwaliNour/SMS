import { useQuery } from '@tanstack/react-query';
import Layout from '@/components/layout/Layout';
import StatCard from '@/components/dashboard/StatCard';
import { DashboardSkeleton } from '@/components/dashboard/DashboardSkeleton';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import StudentsTable from '@/components/students/StudentsTable';
import { useLocation } from 'wouter';

export default function Dashboard() {
  const [, navigate] = useLocation();
  
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
      capacity: number;
      sections: {
        primary: number;
        secondary: number;
        highschool: number;
      };
    };
    employees: {
      total: number;
      teachers: number;
      staff: number;
    };
  }

  const { data: stats, isLoading, error } = useQuery<StatsData>({
    queryKey: ['/api/stats'],
  });

  const goToAddStudent = () => {
    navigate('/add-student');
  };

  if (isLoading) {
    return (
      <Layout>
        <DashboardSkeleton />
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="p-4 border border-red/20 bg-red/5 rounded-lg text-red mb-6">
          <h3 className="text-lg font-medium">Error Loading Dashboard Data</h3>
          <p>There was a problem loading the dashboard data. Please try refreshing the page.</p>
        </div>
        <StudentsTable onAddStudent={goToAddStudent} />
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Facility Card */}
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
            label: "Capacity",
            value: stats?.classrooms?.capacity || 1000
          }}
          stat2={{
            label: "Students",
            value: stats?.students?.total || 750
          }}
        />
        
        {/* Students Card */}
        <StatCard
          title="STUDENTS"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          }
          stat1={{
            label: "Male",
            value: stats?.students?.male || 350
          }}
          stat2={{
            label: "Female",
            value: stats?.students?.female || 400
          }}
        />
        
        {/* Status Card */}
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
            value: stats?.students?.present || 700
          }}
          stat2={{
            label: "Absent",
            value: stats?.students?.absent || 50
          }}
        />
      </div>
      
      {/* Students Table */}
      <StudentsTable onAddStudent={goToAddStudent} />
    </Layout>
  );
}
