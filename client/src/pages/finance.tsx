import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { useQuery } from '@tanstack/react-query';
import StatCard from '@/components/dashboard/StatCard';
import PaymentsTable from '@/components/finance/PaymentsTable';
import { formatCurrency } from '@/lib/utils';

export default function Finance() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['/api/stats'],
  });

  const handleAddPayment = () => {
    // This is handled inside the PaymentsTable component with dialog
  };

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-homenaje">Finance Management</h1>
        
        {/* Financial Statistics */}
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
              label: "Pay Students",
              value: isLoading ? "..." : stats?.finance?.paidStudents || 700
            }}
            stat2={{
              label: "Free Students",
              value: isLoading ? "..." : stats?.finance?.unpaidStudents || 50
            }}
          />
          
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
              label: "Paid",
              value: isLoading ? "..." : stats?.finance?.paidStudents || 650
            }}
            stat2={{
              label: "Unpaid",
              value: isLoading ? "..." : stats?.finance?.unpaidStudents || 50
            }}
          />
          
          <StatCard
            title="FEES"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
              value: isLoading ? "..." : formatCurrency(stats?.finance?.collectedAmount || 10000)
            }}
            stat2={{
              label: "UnCollected",
              value: isLoading ? "..." : formatCurrency(stats?.finance?.uncollectedAmount || 1000)
            }}
          />
        </div>
        
        {/* Payments Table */}
        <PaymentsTable onAddPayment={handleAddPayment} />
      </div>
    </Layout>
  );
}
