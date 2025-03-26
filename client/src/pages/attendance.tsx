import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { useQuery } from '@tanstack/react-query';
import { Attendance, Student } from '@shared/schema';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { ColumnDef } from '@tanstack/react-table';
import FilterSelect from '@/components/ui/filter-select';
import { formatDate, generateUserAvatar, getGenderDisplayName, getSectionDisplayName } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import StatCard from '@/components/dashboard/StatCard';

const attendanceFormSchema = z.object({
  studentId: z.number({
    required_error: "Student ID is required",
  }),
  date: z.string({
    required_error: "Date is required",
  }),
  status: z.enum(['present', 'absent', 'late'], {
    required_error: "Status is required",
  }),
  note: z.string().optional(),
});

type AttendanceFormValues = z.infer<typeof attendanceFormSchema>;

export default function AttendancePage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { toast } = useToast();
  const [filters, setFilters] = useState({
    status: '',
    date: '',
    section: '',
    class: '',
  });

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['/api/stats'],
  });

  const { data: attendance, isLoading, error, refetch } = useQuery<Attendance[]>({
    queryKey: ['/api/attendance'],
  });

  const { data: students } = useQuery<Student[]>({
    queryKey: ['/api/students'],
  });

  const form = useForm<AttendanceFormValues>({
    resolver: zodResolver(attendanceFormSchema),
    defaultValues: {
      studentId: undefined,
      date: new Date().toISOString().split('T')[0],
      status: 'present',
      note: '',
    },
  });

  const onSubmit = async (data: AttendanceFormValues) => {
    try {
      await apiRequest('POST', '/api/attendance', data);
      toast({
        title: 'Success',
        description: 'Attendance record added successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/attendance'] });
      setIsAddModalOpen(false);
      form.reset();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add attendance record',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateAttendance = async (id: number, status: 'present' | 'absent' | 'late') => {
    try {
      await apiRequest('PATCH', `/api/attendance/${id}`, { status });
      toast({
        title: 'Success',
        description: 'Attendance status updated successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/attendance'] });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update attendance status',
        variant: 'destructive',
      });
    }
  };

  const getStudentInfo = (studentId: number) => {
    return students?.find(s => s.id === studentId);
  };

  const columns: ColumnDef<Attendance>[] = [
    {
      accessorKey: 'studentImage',
      header: 'Student Image',
      cell: ({ row }) => {
        const student = getStudentInfo(row.original.studentId);
        const fullName = student ? `${student.firstName} ${student.lastName}` : 'Unknown';
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
      cell: ({ row }) => {
        const student = getStudentInfo(row.original.studentId);
        return student?.studentId || `#${row.original.studentId}`;
      },
    },
    {
      accessorKey: 'studentName',
      header: 'Student Name',
      cell: ({ row }) => {
        const student = getStudentInfo(row.original.studentId);
        return student ? `${student.firstName} ${student.lastName}` : 'Unknown Student';
      },
    },
    {
      accessorKey: 'date',
      header: 'Date',
      cell: ({ row }) => formatDate(row.original.date),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.original.status;
        let bgColor;
        
        if (status === 'present') bgColor = 'bg-green';
        else if (status === 'late') bgColor = 'bg-yellow';
        else bgColor = 'bg-red';
        
        return (
          <span className={`${bgColor} text-white px-2 py-1 rounded-full text-xs`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        );
      },
    },
    {
      accessorKey: 'note',
      header: 'Note',
      cell: ({ row }) => row.original.note || 'N/A',
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        return (
          <div className="flex space-x-1">
            <Button
              variant="outline"
              size="sm"
              className="bg-green hover:bg-green/90 text-white border-none w-6 h-6 p-0"
              onClick={() => handleUpdateAttendance(row.original.id, 'present')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-yellow hover:bg-yellow/90 text-white border-none w-6 h-6 p-0"
              onClick={() => handleUpdateAttendance(row.original.id, 'late')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-red hover:bg-red/90 text-white border-none w-6 h-6 p-0"
              onClick={() => handleUpdateAttendance(row.original.id, 'absent')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-homenaje">Attendance Management</h1>
        
        {/* Attendance Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="FACILITY"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            }
            stat1={{
              label: "Capacity",
              value: statsLoading ? "..." : stats?.classrooms?.capacity || 1000
            }}
            stat2={{
              label: "Students",
              value: statsLoading ? "..." : stats?.students?.total || 750
            }}
          />
          
          <StatCard
            title="STUDENTS"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            }
            stat1={{
              label: "Male",
              value: statsLoading ? "..." : stats?.students?.male || 350
            }}
            stat2={{
              label: "Female",
              value: statsLoading ? "..." : stats?.students?.female || 400
            }}
          />
          
          <StatCard
            title="STATUS"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                />
              </svg>
            }
            stat1={{
              label: "Present",
              value: statsLoading ? "..." : stats?.students?.present || 700
            }}
            stat2={{
              label: "Absent",
              value: statsLoading ? "..." : stats?.students?.absent || 50
            }}
          />
        </div>
        
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow mb-6">
          <div className="p-4 flex items-center justify-between border-b border-divider dark:border-gray-700">
            <div className="flex items-center">
              <h2 className="text-lg font-homenaje text-gray-800 dark:text-gray-200 mr-4">Attendance Records</h2>
              <span className="text-sm text-gray-500 dark:text-gray-400">Filter BY</span>
            </div>
            <div className="flex space-x-2">
              <FilterSelect
                label="Status"
                options={[
                  { value: '', label: 'All' },
                  { value: 'present', label: 'Present' },
                  { value: 'absent', label: 'Absent' },
                  { value: 'late', label: 'Late' },
                ]}
                value={filters.status}
                onChange={(value) => setFilters({ ...filters, status: value })}
                placeholder="Status"
              />
              <FilterSelect
                label="Date"
                options={[
                  { value: '', label: 'All' },
                  { value: 'today', label: 'Today' },
                  { value: 'week', label: 'This Week' },
                  { value: 'month', label: 'This Month' },
                ]}
                value={filters.date}
                onChange={(value) => setFilters({ ...filters, date: value })}
                placeholder="Date"
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
            
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
              <DialogTrigger asChild>
                <Button 
                  className="bg-blue hover:bg-blue/90 text-white"
                  onClick={() => setIsAddModalOpen(true)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Attendance
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Attendance Record</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="studentId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Student</FormLabel>
                          <Select onValueChange={(value) => field.onChange(parseInt(value))} defaultValue={field.value?.toString()}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a student" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {students?.map((student) => (
                                <SelectItem key={student.id} value={student.id.toString()}>
                                  {student.firstName} {student.lastName} ({student.studentId})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="present">Present</SelectItem>
                              <SelectItem value="absent">Absent</SelectItem>
                              <SelectItem value="late">Late</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="note"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Note (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="Any notes about the attendance" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex justify-end space-x-2 pt-4">
                      <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" className="bg-blue hover:bg-blue/90 text-white">
                        Add Record
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
          
          {isLoading ? (
            <div className="p-8 text-center">Loading attendance records...</div>
          ) : error ? (
            <div className="p-8 text-center text-red">Error loading attendance records. Please try again.</div>
          ) : (
            <DataTable
              columns={columns}
              data={attendance || []}
            />
          )}
        </div>
      </div>
    </Layout>
  );
}
