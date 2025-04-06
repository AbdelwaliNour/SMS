import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DataTable } from '@/components/ui/data-table';
import { Student } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { generateUserAvatar, getSectionDisplayName, getGenderDisplayName } from '@/lib/utils';
import { Link } from 'wouter';
import { ColumnDef } from '@tanstack/react-table';
import FilterSelect from '@/components/ui/filter-select';
import StudentsTableSkeleton from './StudentsTableSkeleton';

interface StudentsTableProps {
  onAddStudent: () => void;
}

const StudentsTable: React.FC<StudentsTableProps> = ({ onAddStudent }) => {
  const { toast } = useToast();
  const [filters, setFilters] = useState({
    gender: '',
    section: '',
    class: ''
  });

  const { data: students, isLoading, error, refetch } = useQuery<Student[]>({
    queryKey: ['/api/students'],
  });

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this student?')) return;
    
    try {
      await apiRequest('DELETE', `/api/students/${id}`);
      toast({
        title: 'Success',
        description: 'Student deleted successfully',
      });
      refetch();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete student',
        variant: 'destructive',
      });
    }
  };

  const columns: ColumnDef<Student>[] = [
    {
      accessorKey: 'image',
      header: 'Student Image',
      cell: ({ row }) => {
        const student = row.original;
        const fullName = `${student.firstName} ${student.lastName}`;
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
      accessorKey: 'studentId',
      header: 'Student ID',
    },
    {
      accessorKey: 'name',
      header: 'Student Name',
      cell: ({ row }) => {
        const student = row.original;
        return `${student.firstName} ${student.middleName ? student.middleName + ' ' : ''}${student.lastName}`;
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
      cell: ({ row }) => getSectionDisplayName(row.original.section),
    },
    {
      accessorKey: 'class',
      header: 'Class',
    },
    {
      id: 'actions',
      header: 'Action',
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            <Link to={`/edit-student/${row.original.id}`}>
              <Button variant="ghost" size="sm" className="text-blue">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </Button>
            </Link>
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
          <h2 className="text-lg font-homenaje text-gray-800 dark:text-gray-200 mr-4">View Students</h2>
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
            label="Class"
            options={[
              { value: '', label: 'All' },
              { value: 'One', label: 'One' },
              { value: 'Two', label: 'Two' },
              { value: 'Three', label: 'Three' },
              { value: 'Four', label: 'Four' },
              { value: 'Five', label: 'Five' },
              { value: 'Six', label: 'Six' },
            ]}
            value={filters.class}
            onChange={(value) => setFilters({ ...filters, class: value })}
            placeholder="Class"
          />
        </div>
        <Button 
          onClick={onAddStudent} 
          className="bg-blue hover:bg-blue/90 text-white"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Student
        </Button>
      </div>
      
      {isLoading ? (
        <StudentsTableSkeleton />
      ) : error ? (
        <div className="p-8 text-center text-red">Error loading students. Please try again.</div>
      ) : (
        <DataTable
          columns={columns}
          data={students || []}
        />
      )}
    </div>
  );
};

export default StudentsTable;
