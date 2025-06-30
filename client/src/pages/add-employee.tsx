import Layout from '@/components/layout/Layout';
import AddEmployeeForm from '@/components/employees/AddEmployeeForm';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { UserPlus, ArrowLeft } from 'lucide-react';
import { Link } from 'wouter';

export default function AddEmployee() {
  const [, navigate] = useLocation();

  const handleSuccess = () => {
    navigate('/employees');
  };

  const handleCancel = () => {
    navigate('/employees');
  };

  return (
    <Layout>
      <div className="space-y-8">
        {/* Modern Page Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-primary/10 rounded-xl">
                <UserPlus className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gradient">Add New Employee</h1>
                <p className="text-muted-foreground">Create a new employee profile with comprehensive details</p>
              </div>
            </div>
          </div>
          
          <Link href="/employees">
            <Button variant="outline" className="glass-morphism border-border/30 hover:border-primary/30">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Employees
            </Button>
          </Link>
        </div>
        
        <AddEmployeeForm onSuccess={handleSuccess} onCancel={handleCancel} />
      </div>
    </Layout>
  );
}
