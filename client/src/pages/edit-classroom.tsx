import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import Layout from '@/components/layout/Layout';
import EditClassroomForm from '@/components/classrooms/EditClassroomForm';
import { School, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { Classroom, Employee } from '@shared/schema';

export default function EditClassroom() {
  const [location] = useLocation();
  const [classroomId, setClassroomId] = useState<string | null>(null);

  useEffect(() => {
    // Extract classroom ID from URL parameters
    const params = new URLSearchParams(location.split('?')[1] || '');
    const id = params.get('id');
    setClassroomId(id);
  }, [location]);

  const { data: classrooms } = useQuery<Classroom[]>({
    queryKey: ['/api/classrooms'],
  });

  const { data: employees } = useQuery<Employee[]>({
    queryKey: ['/api/employees'],
  });

  const classroom = classrooms?.find(c => c.id.toString() === classroomId);
  const teachers = employees?.filter(employee => employee.role === 'teacher') || [];

  const handleSuccess = () => {
    window.location.href = '/classrooms';
  };

  const handleCancel = () => {
    window.location.href = '/classrooms';
  };

  if (!classroom) {
    return (
      <Layout>
        <div className="space-y-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-primary/10 rounded-xl">
                  <School className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gradient">Edit Classroom</h1>
                  <p className="text-muted-foreground">Loading classroom information...</p>
                </div>
              </div>
            </div>
            
            <Link to="/classrooms">
              <Button variant="outline" className="glass-morphism border-border/30 hover:border-primary/30">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Classrooms
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        {/* Modern Page Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-primary/10 rounded-xl">
                <School className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gradient">Edit Classroom</h1>
                <p className="text-muted-foreground">Update classroom information and settings</p>
              </div>
            </div>
          </div>
          
          <Link to="/classrooms">
            <Button variant="outline" className="glass-morphism border-border/30 hover:border-primary/30">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Classrooms
            </Button>
          </Link>
        </div>
        
        <EditClassroomForm 
          classroom={classroom}
          teachers={teachers}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </div>
    </Layout>
  );
}