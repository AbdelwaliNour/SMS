import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DataTable } from '@/components/ui/data-table';
import { Employee } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { generateUserAvatar, getSectionDisplayName, getGenderDisplayName } from '@/lib/utils';
import { Link } from 'wouter';
import { ColumnDef } from '@tanstack/react-table';
import FilterSelect from '@/components/ui/filter-select';

interface EmployeesTableProps {
  onAddEmployee: () => void;
}

const EmployeesTable: React.FC<EmployeesTableProps> = ({ onAddEmployee }) => {
  const { toast } = useToast();
  const [filters, setFilters] = useState({
    gender: '',
    section: '',
    shift: ''
  });

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
      refetch();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete employee',
        variant: 'destructive',
      });
    }
  };

  const columns: ColumnDef<Employee>[] = [
    {
      accessorKey: 'image',
      header: 'Image',
      cell: ({ row }) => {
        const employee = row.original;
        const fullName = `${employee.firstName} ${employee.lastName}`;
        return (
          <img 
            src={generateUserAvatar(fullName, 40)} 
            alt={fullName} 
            className="w-10 h-10 rounded-full"
          />
        );
      },
    },
    {
      accessorKey: 'employeeId',
      header: 'Employee ID',
    },
    {
      accessorKey: 'name',
      header: 'Employee Name',
      cell: ({ row }) => {
        const employee = row.original;
        return `${employee.firstName} ${employee.middleName ? employee.middleName + ' ' : ''}${employee.lastName}`;
      },
    },
    {
      accessorKey: 'role',
      header: 'Title',
      cell: ({ row }) => {
        const role = row.original.role;
        return role.charAt(0).toUpperCase() + role.slice(1);
      }
    },
    {
      accessorKey: 'section',
      header: 'Section',
      cell: ({ row }) => getSectionDisplayName(row.original.section || ''),
    },
    {
      accessorKey: 'shift',
      header: 'Shift',
      cell: ({ row }) => {
        const shift = row.original.shift;
        return shift ? shift.charAt(0).toUpperCase() + shift.slice(1) : 'N/A';
      }
    },
    {
      accessorKey: 'salary',
      header: 'Salary',
      cell: ({ row }) => `$${row.original.salary}`,
    },
    {
      id: 'actions',
      header: 'Action',
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-blue" 
              asChild
            >
              <Link to={`/edit-employee/${row.original.id}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-red"
              onClick={() => handleDelete(row.original.id)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow mb-6">
      <div className="p-4 flex items-center justify-between border-b border-divider dark:border-gray-700">
        <div className="flex items-center">
          <h2 className="text-lg font-homenaje text-gray-800 dark:text-gray-200 mr-4">View Employees</h2>
          <span className="text-sm text-gray-500 dark:text-gray-400">Filter BY</span>
        </div>
        <div className="flex space-x-2">
          <FilterSelect
            label="Gender"
            options={[
              { value: '', label: 'All' },
              { value: 'male', label: 'Male' },
              { value: 'female', label: 'Female' },
            ]}
            value={filters.gender}
            onChange={(value) => setFilters({ ...filters, gender: value })}
            placeholder="Gender"
          />
          <FilterSelect
            label="Section"
            options={[
              { value: '', label: 'All' },
              { value: 'primary', label: 'Primary' },
              { value: 'secondary', label: 'Secondary' },
              { value: 'highschool', label: 'High School' },
            ]}
            value={filters.section}
            onChange={(value) => setFilters({ ...filters, section: value })}
            placeholder="Section"
          />
          <FilterSelect
            label="Shift"
            options={[
              { value: '', label: 'All' },
              { value: 'morning', label: 'Morning' },
              { value: 'afternoon', label: 'Afternoon' },
              { value: 'evening', label: 'Evening' },
            ]}
            value={filters.shift}
            onChange={(value) => setFilters({ ...filters, shift: value })}
            placeholder="Shift"
          />
        </div>
        <Button 
          onClick={onAddEmployee} 
          className="bg-blue hover:bg-blue/90 text-white"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Employee
        </Button>
      </div>
      
      {isLoading ? (
        <div className="p-8 text-center">Loading employees...</div>
      ) : error ? (
        <div className="p-8 text-center text-red">Error loading employees. Please try again.</div>
      ) : (
        <DataTable
          columns={columns}
          data={employees || []}
        />
      )}
    </div>
  );
};

export default EmployeesTable;
