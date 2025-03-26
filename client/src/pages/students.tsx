import Layout from '@/components/layout/Layout';
import StudentsTable from '@/components/students/StudentsTable';
import { useLocation } from 'wouter';

export default function Students() {
  const [, navigate] = useLocation();
  
  const goToAddStudent = () => {
    navigate('/add-student');
  };

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-homenaje">Students Management</h1>
        <StudentsTable onAddStudent={goToAddStudent} />
      </div>
    </Layout>
  );
}
