import { useLocation } from 'wouter';
import Layout from '@/components/layout/Layout';
import AddClassroomForm from '@/components/classrooms/AddClassroomForm';
import { School, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';

export default function AddClassroom() {
  const [, setLocation] = useLocation();

  const handleSuccess = () => {
    setLocation('/classrooms');
  };

  const handleCancel = () => {
    setLocation('/classrooms');
  };

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
                <h1 className="text-3xl font-bold text-gradient">Add New Classroom</h1>
                <p className="text-muted-foreground">Create a new classroom with capacity and teacher assignment</p>
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
        
        <AddClassroomForm onSuccess={handleSuccess} onCancel={handleCancel} />
      </div>
    </Layout>
  );
}