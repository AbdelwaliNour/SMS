import Layout from '@/components/layout/Layout';
import { useLocation } from 'wouter';
import { useIsMobile } from '@/hooks/use-mobile';
import StudentsTable from '@/components/students/StudentsTable';
import ResponsiveStudentsList from '@/components/students/ResponsiveStudentsList';

export default function Students() {
  const [, navigate] = useLocation();
  const isMobile = useIsMobile();
  
  const goToAddStudent = () => {
    navigate('/add-student');
  };

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-homenaje">Students Management</h1>
        
        {isMobile ? (
          // Mobile-optimized view 
          <ResponsiveStudentsList onAddStudent={goToAddStudent} />
        ) : (
          // Desktop view with traditional table
          <StudentsTable onAddStudent={goToAddStudent} />
        )}
      </div>
    </Layout>
  );
}
