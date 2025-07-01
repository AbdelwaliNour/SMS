import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { useQuery } from '@tanstack/react-query';
import { Attendance, Student } from '@shared/schema';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { ColumnDef } from '@tanstack/react-table';
import FilterSelect from '@/components/ui/filter-select';
import { formatDate, generateUserAvatar } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import StatCard from '@/components/dashboard/StatCard';
import { CheckCircle, Clock, XCircle, Users, School, ClipboardList } from 'lucide-react';

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
      accessorKey: 'student',
      header: 'Student',
      cell: ({ row }) => {
        const student = getStudentInfo(row.original.studentId);
        const fullName = student ? `${student.firstName} ${student.lastName}` : 'Unknown';
        const profilePhoto = student?.profilePhoto;
        
        return (
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img 
                src={profilePhoto || generateUserAvatar(fullName, 48)} 
                alt={fullName} 
                className="w-12 h-12 rounded-full object-cover ring-2 ring-white/10 shadow-md"
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-white"></div>
            </div>
            <div className="flex flex-col">
              <div className="font-semibold text-gray-900 dark:text-white">
                {fullName}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                ID: {student?.studentId || `#${row.original.studentId}`}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'date',
      header: 'Date & Time',
      cell: ({ row }) => {
        const date = new Date(row.original.date);
        return (
          <div className="flex flex-col">
            <div className="font-medium text-gray-900 dark:text-white">
              {date.toLocaleDateString('en-US', { 
                weekday: 'short', 
                month: 'short', 
                day: 'numeric' 
              })}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {date.toLocaleDateString('en-US', { year: 'numeric' })}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.original.status;
        let statusConfig;
        
        if (status === 'present') {
          statusConfig = {
            bg: 'bg-emerald-50 dark:bg-emerald-900/20',
            text: 'text-emerald-700 dark:text-emerald-300',
            dot: 'bg-emerald-500',
            icon: <CheckCircle className="w-4 h-4" />
          };
        } else if (status === 'late') {
          statusConfig = {
            bg: 'bg-amber-50 dark:bg-amber-900/20',
            text: 'text-amber-700 dark:text-amber-300',
            dot: 'bg-amber-500',
            icon: <Clock className="w-4 h-4" />
          };
        } else {
          statusConfig = {
            bg: 'bg-red-50 dark:bg-red-900/20',
            text: 'text-red-700 dark:text-red-300',
            dot: 'bg-red-500',
            icon: <XCircle className="w-4 h-4" />
          };
        }
        
        return (
          <div className={`flex items-center space-x-2 px-3 py-2 rounded-full ${statusConfig.bg} w-fit`}>
            <div className={`w-2 h-2 rounded-full ${statusConfig.dot}`}></div>
            <span className={`text-sm font-medium ${statusConfig.text} flex items-center space-x-1`}>
              {statusConfig.icon}
              <span>{status.charAt(0).toUpperCase() + status.slice(1)}</span>
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: 'note',
      header: 'Notes',
      cell: ({ row }) => {
        const note = row.original.note;
        return (
          <div className="max-w-xs">
            {note ? (
              <div className="text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 px-3 py-2 rounded-lg">
                {note}
              </div>
            ) : (
              <span className="text-gray-400 dark:text-gray-500 italic text-sm">No notes</span>
            )}
          </div>
        );
      },
    },
    {
      id: 'actions',
      header: 'Quick Actions',
      cell: ({ row }) => {
        const currentStatus = row.original.status;
        
        return (
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1 bg-gray-50 dark:bg-gray-800 rounded-lg p-1">
              <Button
                variant="ghost"
                size="sm"
                className={`w-8 h-8 p-0 rounded transition-all ${
                  currentStatus === 'present' 
                    ? 'bg-emerald-500 text-white shadow-md scale-110' 
                    : 'hover:bg-emerald-100 dark:hover:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 hover:scale-105'
                }`}
                onClick={() => handleUpdateAttendance(row.original.id, 'present')}
                title="Mark Present"
              >
                <CheckCircle className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={`w-8 h-8 p-0 rounded transition-all ${
                  currentStatus === 'late' 
                    ? 'bg-amber-500 text-white shadow-md scale-110' 
                    : 'hover:bg-amber-100 dark:hover:bg-amber-900/30 text-amber-600 dark:text-amber-400 hover:scale-105'
                }`}
                onClick={() => handleUpdateAttendance(row.original.id, 'late')}
                title="Mark Late"
              >
                <Clock className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={`w-8 h-8 p-0 rounded transition-all ${
                  currentStatus === 'absent' 
                    ? 'bg-red-500 text-white shadow-md scale-110' 
                    : 'hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 hover:scale-105'
                }`}
                onClick={() => handleUpdateAttendance(row.original.id, 'absent')}
                title="Mark Absent"
              >
                <XCircle className="w-4 h-4" />
              </Button>
            </div>
          </div>
        );
      },
    },
  ];

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Attendance Management</h1>
            <p className="text-blue-100">Track and manage student attendance efficiently</p>
          </div>
        </div>
        
        {/* Attendance Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="FACILITY"
            icon={<School className="h-8 w-8 text-blue-400" />}
            stat1={{
              label: "Capacity",
              value: statsLoading ? "..." : (stats as any)?.classrooms?.capacity || 1000
            }}
            stat2={{
              label: "Students",
              value: statsLoading ? "..." : (stats as any)?.students?.total || 750
            }}
          />
          
          <StatCard
            title="STUDENTS"
            icon={<Users className="h-8 w-8 text-blue-400" />}
            stat1={{
              label: "Male",
              value: statsLoading ? "..." : (stats as any)?.students?.male || 350
            }}
            stat2={{
              label: "Female",
              value: statsLoading ? "..." : (stats as any)?.students?.female || 400
            }}
          />
          
          <StatCard
            title="STATUS"
            icon={<ClipboardList className="h-8 w-8 text-blue-400" />}
            stat1={{
              label: "Present",
              value: statsLoading ? "..." : (stats as any)?.students?.present || 700
            }}
            stat2={{
              label: "Absent",
              value: statsLoading ? "..." : (stats as any)?.students?.absent || 50
            }}
          />
        </div>
        
        {/* Attendance Table */}
        <div className="glass-morphism rounded-xl shadow-xl border border-white/10 overflow-hidden">
          <div className="p-6 border-b border-white/10 bg-gradient-to-r from-blue-600/10 to-purple-600/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <ClipboardList className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white mb-1">Attendance Records</h2>
                  <p className="text-sm text-blue-100">Track and manage student attendance</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
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
                </div>
                
                <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg border border-blue-500 px-6"
                      onClick={() => setIsAddModalOpen(true)}
                    >
                      <ClipboardList className="h-4 w-4 mr-2" />
                      Add Attendance
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="glass-morphism border-white/10">
                    <DialogHeader>
                      <DialogTitle className="text-white">Add Attendance Record</DialogTitle>
                      <DialogDescription className="text-blue-100">
                        Record student attendance for the selected date.
                      </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                          control={form.control}
                          name="studentId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white">Student</FormLabel>
                              <Select onValueChange={(value) => field.onChange(parseInt(value))} defaultValue={field.value?.toString()}>
                                <FormControl>
                                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
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
                              <FormLabel className="text-white">Date</FormLabel>
                              <FormControl>
                                <Input 
                                  type="date" 
                                  {...field} 
                                  className="bg-white/10 border-white/20 text-white"
                                />
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
                              <FormLabel className="text-white">Status</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
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
                              <FormLabel className="text-white">Note (Optional)</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Any notes about the attendance" 
                                  {...field} 
                                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="flex justify-end space-x-2 pt-4">
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => setIsAddModalOpen(false)}
                            className="border-white/20 text-white hover:bg-white/10"
                          >
                            Cancel
                          </Button>
                          <Button 
                            type="submit" 
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            Add Record
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm">
            {isLoading ? (
              <div className="p-8 text-center text-white">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-4"></div>
                Loading attendance records...
              </div>
            ) : error ? (
              <div className="p-8 text-center text-red-400">
                Error loading attendance records. Please try again.
              </div>
            ) : (
              <DataTable
                columns={columns}
                data={attendance || []}
              />
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}