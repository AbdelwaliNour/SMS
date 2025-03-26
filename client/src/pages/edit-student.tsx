import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, useLocation } from 'wouter';
import Layout from '@/components/layout/Layout';
import { Student } from '@shared/schema';
import EditStudentForm from '@/components/students/EditStudentForm';
import { Skeleton } from '@/components/ui/skeleton';

export default function EditStudent() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const [studentId, setStudentId] = useState<number>(parseInt(id));

  const { data: student, isLoading, error } = useQuery<Student>({
    queryKey: ['/api/students', studentId],
    enabled: !!studentId,
  });

  useEffect(() => {
    if (!id || isNaN(parseInt(id))) {
      navigate('/students');
    } else {
      setStudentId(parseInt(id));
    }
  }, [id, navigate]);

  if (isLoading) {
    return (
      <Layout>
        <div className="space-y-6">
          <h1 className="text-2xl font-homenaje">Edit Student</h1>
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
            <Skeleton className="h-8 w-1/3 mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
            <Skeleton className="h-10 w-40 mt-6" />
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !student) {
    return (
      <Layout>
        <div className="space-y-6">
          <h1 className="text-2xl font-homenaje">Edit Student</h1>
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
            <p className="text-red">
              {error ? 'Error loading student data. Please try again.' : 'Student not found.'}
            </p>
            <button
              onClick={() => navigate('/students')}
              className="mt-4 bg-blue hover:bg-blue/90 text-white py-2 px-4 rounded"
            >
              Back to Students
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-homenaje">Edit Student</h1>
        <EditStudentForm student={student} />
      </div>
    </Layout>
  );
}