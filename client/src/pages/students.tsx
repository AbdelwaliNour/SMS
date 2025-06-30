import Layout from '@/components/layout/Layout';
import { useLocation } from 'wouter';
import { useIsMobile } from '@/hooks/use-mobile';
import StudentsTable from '@/components/students/StudentsTable';
import ResponsiveStudentsList from '@/components/students/ResponsiveStudentsList';
import { FloatingActionButton } from '@/components/ui/floating-action-button';
import { Users, Plus } from 'lucide-react';

export default function Students() {
  const [, navigate] = useLocation();
  const isMobile = useIsMobile();
  
  const goToAddStudent = () => {
    navigate('/add-student');
  };

  return (
    <Layout>
      <div className="space-y-8">
        {/* Modern Page Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-xl">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gradient">Students Management</h1>
                <p className="text-muted-foreground">Manage student profiles, enrollment, and academic records</p>
              </div>
            </div>
          </div>
          
          <button 
            onClick={goToAddStudent}
            className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Add Student</span>
          </button>
        </div>
        
        {isMobile ? (
          // Mobile-optimized view with modern styling
          <ResponsiveStudentsList onAddStudent={goToAddStudent} />
        ) : (
          // Desktop view with enhanced table
          <StudentsTable onAddStudent={goToAddStudent} />
        )}

        {/* Modern Floating Action Button */}
        <FloatingActionButton
          onClick={goToAddStudent}
          icon={<Plus className="h-6 w-6" />}
        />
      </div>
    </Layout>
  );
}
