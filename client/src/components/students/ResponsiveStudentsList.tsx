import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Student } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { getSectionDisplayName, getGenderDisplayName } from '@/lib/utils';
import { Pencil, Trash2, Phone, Mail, Calendar, MapPin, School } from 'lucide-react';
import { ProfileAvatar } from '@/components/ui/profile-avatar';
import { ResponsiveDataList, DataListColumn } from '@/components/ui/responsive-data-list';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ResponsiveCard } from '@/components/ui/responsive-card';
import { useIsMobile } from '@/hooks/use-mobile';
import FilterSelect from '@/components/ui/filter-select';

interface ResponsiveStudentsListProps {
  onAddStudent: () => void;
}

export default function ResponsiveStudentsList({ onAddStudent }: ResponsiveStudentsListProps) {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const isMobile = useIsMobile();
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

  const handleEdit = (id: number) => {
    navigate(`/edit-student/${id}`);
  };

  const filteredStudents = React.useMemo(() => {
    if (!students) return [];
    
    return students.filter(student => {
      const matchesGender = !filters.gender || student.gender === filters.gender;
      const matchesSection = !filters.section || student.section === filters.section;
      const matchesClass = !filters.class || student.class === filters.class;
      
      return matchesGender && matchesSection && matchesClass;
    });
  }, [students, filters]);

  const columns: DataListColumn<Student>[] = [
    {
      accessorKey: 'fullName',
      header: 'Student',
      primary: true,
      cell: (student) => {
        const fullName = `${student.firstName} ${student.middleName ? student.middleName + ' ' : ''}${student.lastName}`;
        return (
          <div className="flex items-center">
            <ProfileAvatar name={fullName} size="md" className="mr-3" />
            <div>
              <div className="font-medium text-base">{fullName}</div>
              <div className="text-sm text-gray-500">{student.studentId}</div>
            </div>
          </div>
        );
      }
    },
    {
      accessorKey: 'gender',
      header: 'Gender',
      secondary: true,
      cell: (student) => getGenderDisplayName(student.gender),
    },
    {
      accessorKey: 'section',
      header: 'Section',
      secondary: true,
      badge: true,
      badgeVariant: 'outline',
      badgeClassName: 'bg-blue/10 text-blue border-blue/20',
      cell: (student) => getSectionDisplayName(student.section),
    },
    {
      accessorKey: 'class',
      header: 'Class',
      secondary: true,
    },
    {
      accessorKey: 'phone',
      header: 'Phone',
      secondary: true,
      hidden: isMobile,
    },
    {
      accessorKey: 'email',
      header: 'Email',
      secondary: true,
      hidden: isMobile,
    },
    {
      accessorKey: 'actions',
      header: 'Actions',
      action: true,
      cell: (student) => (
        <div className="flex space-x-1">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0 text-blue rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(student.id);
            }}
          >
            <Pencil size={16} />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0 text-green rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/student-performance?studentId=${student.id}`);
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0 text-red rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(student.id);
            }}
          >
            <Trash2 size={16} />
          </Button>
        </div>
      ),
    },
  ];

  const expandedContent = (student: Student) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-1 mb-2">
      <div className="flex items-center">
        <Phone size={16} className="text-gray-500 mr-2" />
        <span className="text-sm text-gray-700 dark:text-gray-300">{student.phone || 'N/A'}</span>
      </div>
      <div className="flex items-center">
        <Mail size={16} className="text-gray-500 mr-2" />
        <span className="text-sm text-gray-700 dark:text-gray-300">{student.email || 'N/A'}</span>
      </div>
      <div className="flex items-center">
        <Calendar size={16} className="text-gray-500 mr-2" />
        <span className="text-sm text-gray-700 dark:text-gray-300">
          {student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString() : 'N/A'}
        </span>
      </div>
      <div className="flex items-center">
        <MapPin size={16} className="text-gray-500 mr-2" />
        <span className="text-sm text-gray-700 dark:text-gray-300">{student.address || 'N/A'}</span>
      </div>
      <div className="flex items-center col-span-2">
        <School size={16} className="text-gray-500 mr-2" />
        <span className="text-sm text-gray-700 dark:text-gray-300">
          {getSectionDisplayName(student.section)} | Class {student.class}
        </span>
      </div>
    </div>
  );

  return (
    <ResponsiveCard
      title="Students List"
      headerAction={
        <Button 
          onClick={onAddStudent} 
          className="bg-blue hover:bg-blue/90 text-white"
          size={isMobile ? "sm" : "default"}
        >
          {!isMobile && (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          )}
          {isMobile ? 'Add' : 'Add Student'}
        </Button>
      }
      padded={false}
    >
      <div className="p-4 flex flex-wrap gap-2 border-b border-gray-200 dark:border-gray-700">
        <FilterSelect
          label="Gender"
          options={[
            { value: '', label: 'All Genders' },
            { value: 'male', label: 'Male' },
            { value: 'female', label: 'Female' },
          ]}
          value={filters.gender}
          onChange={(value) => setFilters({ ...filters, gender: value })}
          placeholder="Gender"
          compact={isMobile}
        />
        <FilterSelect
          label="Section"
          options={[
            { value: '', label: 'All Sections' },
            { value: 'primary', label: 'Primary' },
            { value: 'secondary', label: 'Secondary' },
            { value: 'highschool', label: 'High School' },
          ]}
          value={filters.section}
          onChange={(value) => setFilters({ ...filters, section: value })}
          placeholder="Section"
          compact={isMobile}
        />
        <FilterSelect
          label="Class"
          options={[
            { value: '', label: 'All Classes' },
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
          compact={isMobile}
        />
      </div>

      <ResponsiveDataList
        columns={columns}
        data={filteredStudents}
        keyExtractor={(student) => student.id}
        onItemClick={(student) => handleEdit(student.id)}
        isLoading={isLoading}
        emptyMessage={
          error 
            ? "Failed to load students. Please try again." 
            : "No students found. Add a student to get started."
        }
        expandable={isMobile}
        expandedContent={expandedContent}
      />
    </ResponsiveCard>
  );
}