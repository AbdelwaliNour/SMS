import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Employee } from '@shared/schema';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import EditEmployeeForm from './EditEmployeeForm';
import { Badge } from '@/components/ui/badge';
import { getGenderDisplayName } from '@/lib/utils';
import { ProfileAvatar } from '@/components/ui/profile-avatar';
import EmployeesTableSkeleton from './EmployeesTableSkeleton';

interface EmployeesTableProps {
  onAddEmployee: () => void;
}

const EmployeesTable: React.FC<EmployeesTableProps> = ({ onAddEmployee }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const { toast } = useToast();

  const { data: employees, isLoading, error, refetch } = useQuery<Employee[]>({
    queryKey: ['/api/employees'],
  });

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this employee?')) return;
    
    try {
      await apiRequest('DELETE', `/api/employees/${id}`);
      toast({
        title: 'Success',
        description: 'Employee deleted successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/employees'] });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete employee',
        variant: 'destructive',
      });
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    const variants: Record<string, string> = {
      teacher: 'blue',
      admin: 'yellow',
      driver: 'green',
      guard: 'red',
      staff: 'secondary',
      cleaner: 'secondary',
    };
    return variants[role] || 'secondary';
  };

  const getRoleDisplayName = (role: string) => {
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  const columns: ColumnDef<Employee>[] = [
    {
      accessorKey: 'avatar',
      header: '',
      cell: ({ row }) => {
        const employee = row.original;
        const fullName = `${employee.firstName} ${employee.lastName}`;
        return (
          <div className="flex justify-center">
            <ProfileAvatar 
              name={fullName}
              size="md"
              fallbackIcon="user"
            />
          </div>
        );
      },
    },
    {
      accessorKey: 'employeeId',
      header: 'Employee ID',
    },
    {
      accessorKey: 'firstName',
      header: 'Name',
      cell: ({ row }) => {
        const firstName = row.original.firstName;
        const middleName = row.original.middleName 
          ? `${row.original.middleName.charAt(0)}. ` 
          : '';
        const lastName = row.original.lastName;
        return `${firstName} ${middleName}${lastName}`;
      },
    },
    {
      accessorKey: 'role',
      header: 'Role',
      cell: ({ row }) => {
        const role = row.original.role;
        const variant = getRoleBadgeVariant(role);
        return (
          <Badge variant={variant as any} className="capitalize">
            {getRoleDisplayName(role)}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'gender',
      header: 'Gender',
      cell: ({ row }) => getGenderDisplayName(row.original.gender),
    },
    {
      accessorKey: 'section',
      header: 'Section',
      cell: ({ row }) => row.original.section || 'N/A',
    },
    {
      accessorKey: 'shift',
      header: 'Shift',
      cell: ({ row }) => row.original.shift 
        ? row.original.shift.charAt(0).toUpperCase() + row.original.shift.slice(1) 
        : 'N/A',
    },
    {
      accessorKey: 'phone',
      header: 'Phone',
      cell: ({ row }) => row.original.phone || 'N/A',
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="text-blue border-blue/30 hover:bg-blue/10 hover:text-blue rounded-full w-8 h-8 p-0"
              onClick={() => {
                setSelectedEmployee(row.original);
                setIsEditModalOpen(true);
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-red border-red/30 hover:bg-red/10 hover:text-red rounded-full w-8 h-8 p-0"
              onClick={() => handleDelete(row.original.id)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <>
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow mb-6">
        <div className="p-4 flex items-center justify-between border-b border-divider dark:border-gray-700">
          <div className="flex items-center">
            <h2 className="text-lg font-homenaje text-gray-800 dark:text-gray-200 mr-4">Employees List</h2>
          </div>
          <Button 
            className="bg-blue hover:bg-blue/90 text-white rounded-full shadow-md hover:shadow-lg transition-all"
            onClick={onAddEmployee}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Employee
          </Button>
        </div>
        
        {isLoading ? (
          <EmployeesTableSkeleton />
        ) : error ? (
          <div className="p-8">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-6 py-4 rounded-xl shadow-sm flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="font-bold text-lg mb-1">Unable to load employees</h3>
                <p>There was an error loading the employee data. Please refresh the page or try again later.</p>
              </div>
            </div>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={employees || []}
            searchable
            filterColumn="role"
          />
        )}
      </div>

      {/* Edit Employee Dialog */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Edit Employee</DialogTitle>
          </DialogHeader>
          {selectedEmployee && (
            <EditEmployeeForm 
              employee={selectedEmployee} 
              onSuccess={() => {
                setIsEditModalOpen(false);
                setSelectedEmployee(null);
                refetch();
              }}
              onCancel={() => {
                setIsEditModalOpen(false);
                setSelectedEmployee(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EmployeesTable;