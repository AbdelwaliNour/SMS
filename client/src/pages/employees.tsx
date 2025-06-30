import Layout from '@/components/layout/Layout';
import EmployeesTable from '@/components/employees/EmployeesTable';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Users, UserPlus, ArrowLeft } from 'lucide-react';
import { Link } from 'wouter';

export default function Employees() {
  const [, navigate] = useLocation();
  
  const goToAddEmployee = () => {
    navigate('/add-employee');
  };

  return (
    <Layout>
      <div className="space-y-8">
        {/* Modern Page Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-primary/10 rounded-xl">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gradient">Employee Management</h1>
                <p className="text-muted-foreground">Manage staff members, roles, and assignments</p>
              </div>
            </div>
          </div>
          
          <Button 
            onClick={goToAddEmployee}
            className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Add Employee
          </Button>
        </div>
        
        <EmployeesTable onAddEmployee={goToAddEmployee} />
      </div>
    </Layout>
  );
}
