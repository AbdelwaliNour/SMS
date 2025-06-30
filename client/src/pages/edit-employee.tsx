import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, useLocation } from 'wouter';
import Layout from '@/components/layout/Layout';
import { Employee } from '@shared/schema';
import EditEmployeeForm from '@/components/employees/EditEmployeeForm';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { UserPen, ArrowLeft, AlertCircle } from 'lucide-react';
import { Link } from 'wouter';

export default function EditEmployee() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const [employeeId, setEmployeeId] = useState<number>(parseInt(id));

  const { data: employee, isLoading, error } = useQuery<Employee>({
    queryKey: [`/api/employees/${employeeId}`],
    enabled: !!employeeId,
  });

  useEffect(() => {
    if (!id || isNaN(parseInt(id))) {
      navigate('/employees');
    } else {
      setEmployeeId(parseInt(id));
    }
  }, [id, navigate]);

  if (isLoading) {
    return (
      <Layout>
        <div className="space-y-8">
          {/* Modern Loading Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-primary/10 rounded-xl">
                  <UserPen className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <Skeleton className="h-8 w-48 mb-2" />
                  <Skeleton className="h-4 w-64" />
                </div>
              </div>
            </div>
            <Skeleton className="h-10 w-32" />
          </div>
          
          {/* Loading Form Skeleton */}
          <div className="space-y-8">
            <div className="card-modern glass-morphism p-8">
              <Skeleton className="h-6 w-40 mb-6" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
            <div className="card-modern glass-morphism p-8">
              <Skeleton className="h-6 w-40 mb-6" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !employee) {
    return (
      <Layout>
        <div className="space-y-8">
          {/* Modern Error Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-red-500/10 rounded-xl">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gradient">Edit Employee</h1>
                  <p className="text-muted-foreground">Unable to load employee information</p>
                </div>
              </div>
            </div>
            
            <Link to="/employees">
              <Button variant="outline" className="glass-morphism border-border/30 hover:border-primary/30">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Employees
              </Button>
            </Link>
          </div>
          
          {/* Error Message */}
          <div className="text-center py-12 glass-morphism rounded-xl border border-red-500/20 bg-red-500/5">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2 text-red-600">
              {error ? 'Error Loading Employee' : 'Employee Not Found'}
            </h3>
            <p className="text-muted-foreground mb-6">
              {error ? 'There was an error loading the employee data. Please try again.' : 'The requested employee could not be found.'}
            </p>
            <div className="flex justify-center space-x-4">
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
                className="glass-morphism border-border/30"
              >
                Try Again
              </Button>
              <Button
                onClick={() => navigate('/employees')}
                className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Employees
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const fullName = `${employee.firstName} ${employee.middleName ? employee.middleName + ' ' : ''}${employee.lastName}`;

  return (
    <Layout>
      <div className="space-y-8">
        {/* Modern Page Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-primary/10 rounded-xl">
                <UserPen className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gradient">Edit Employee</h1>
                <p className="text-muted-foreground">Update {fullName}'s information</p>
              </div>
            </div>
          </div>
          
          <Link to="/employees">
            <Button variant="outline" className="glass-morphism border-border/30 hover:border-primary/30">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Employees
            </Button>
          </Link>
        </div>
        
        <EditEmployeeForm employee={employee} />
      </div>
    </Layout>
  );
}