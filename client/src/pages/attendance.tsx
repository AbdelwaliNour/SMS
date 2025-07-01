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
import { generateUserAvatar } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { 
  CheckCircle, 
  Clock, 
  XCircle, 
  Users, 
  School, 
  ClipboardList, 
  Calendar,
  Plus,
  TrendingUp,
  BarChart3,
  Download,
  Search,
  Filter
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  const [filters, setFilters] = useState({
    status: '',
    date: '',
    section: '',
  });

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['/api/stats'],
  });

  const { data: attendance, isLoading, error } = useQuery<Attendance[]>({
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
      form.reset({
        studentId: undefined,
        date: new Date().toISOString().split('T')[0],
        status: 'present',
        note: '',
      });
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

  // Calculate attendance statistics
  const attendanceStats = {
    total: attendance?.length || 0,
    present: attendance?.filter(a => a.status === 'present').length || 0,
    absent: attendance?.filter(a => a.status === 'absent').length || 0,
    late: attendance?.filter(a => a.status === 'late').length || 0,
  };

  const attendanceRate = attendanceStats.total > 0 
    ? Math.round((attendanceStats.present / attendanceStats.total) * 100)
    : 0;

  const columns: ColumnDef<Attendance>[] = [
    {
      accessorKey: 'student',
      header: 'Student Information',
      cell: ({ row }) => {
        const student = getStudentInfo(row.original.studentId);
        const fullName = student ? `${student.firstName} ${student.lastName}` : 'Unknown';
        const profilePhoto = student?.profilePhoto;
        
        return (
          <div className="flex items-center space-x-4 py-2">
            <div className="relative">
              <img 
                src={profilePhoto || generateUserAvatar(fullName, 56)} 
                alt={fullName} 
                className="w-14 h-14 rounded-full object-cover ring-2 ring-blue-500/20 shadow-lg"
              />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full border-2 border-white flex items-center justify-center">
                <span className="text-white text-xs font-bold">
                  {student?.section?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="font-semibold text-lg text-gray-900 dark:text-white">
                {fullName}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center space-x-2">
                <span>ID: {student?.studentId || `#${row.original.studentId}`}</span>
                {student?.section && (
                  <Badge variant="outline" className="text-xs">
                    {student.section.charAt(0).toUpperCase() + student.section.slice(1)}
                  </Badge>
                )}
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
        const today = new Date();
        const isToday = date.toDateString() === today.toDateString();
        
        return (
          <div className="flex flex-col space-y-1">
            <div className={`font-medium ${isToday ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-white'}`}>
              {date.toLocaleDateString('en-US', { 
                weekday: 'short', 
                month: 'short', 
                day: 'numeric' 
              })}
              {isToday && <span className="ml-2 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full">Today</span>}
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
      header: 'Attendance Status',
      cell: ({ row }) => {
        const status = row.original.status;
        let statusConfig;
        
        if (status === 'present') {
          statusConfig = {
            bg: 'bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20',
            border: 'border-emerald-200 dark:border-emerald-700',
            text: 'text-emerald-700 dark:text-emerald-300',
            dot: 'bg-emerald-500',
            icon: <CheckCircle className="w-4 h-4" />,
            label: 'Present'
          };
        } else if (status === 'late') {
          statusConfig = {
            bg: 'bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20',
            border: 'border-amber-200 dark:border-amber-700',
            text: 'text-amber-700 dark:text-amber-300',
            dot: 'bg-amber-500',
            icon: <Clock className="w-4 h-4" />,
            label: 'Late'
          };
        } else {
          statusConfig = {
            bg: 'bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20',
            border: 'border-red-200 dark:border-red-700',
            text: 'text-red-700 dark:text-red-300',
            dot: 'bg-red-500',
            icon: <XCircle className="w-4 h-4" />,
            label: 'Absent'
          };
        }
        
        return (
          <div className={`flex items-center space-x-3 px-4 py-3 rounded-lg border ${statusConfig.bg} ${statusConfig.border} w-fit shadow-sm`}>
            <div className={`w-3 h-3 rounded-full ${statusConfig.dot} animate-pulse`}></div>
            <div className={`${statusConfig.text} flex items-center space-x-2`}>
              {statusConfig.icon}
              <span className="font-medium">{statusConfig.label}</span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'note',
      header: 'Notes & Comments',
      cell: ({ row }) => {
        const note = row.original.note;
        return (
          <div className="max-w-xs">
            {note ? (
              <div className="text-sm text-gray-700 dark:text-gray-300 bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-800 dark:to-slate-800 px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                <p className="leading-relaxed">{note}</p>
              </div>
            ) : (
              <span className="text-gray-400 dark:text-gray-500 italic text-sm flex items-center space-x-2">
                <span className="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full"></span>
                <span>No additional notes</span>
              </span>
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
            <div className="flex space-x-1 bg-white dark:bg-gray-800 rounded-xl p-1.5 border border-gray-200 dark:border-gray-700 shadow-sm">
              <Button
                variant="ghost"
                size="sm"
                className={`w-9 h-9 p-0 rounded-lg transition-all duration-200 ${
                  currentStatus === 'present' 
                    ? 'bg-emerald-500 text-white shadow-lg scale-105 ring-2 ring-emerald-200' 
                    : 'hover:bg-emerald-50 dark:hover:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 hover:scale-105'
                }`}
                onClick={() => handleUpdateAttendance(row.original.id, 'present')}
                title="Mark Present"
              >
                <CheckCircle className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={`w-9 h-9 p-0 rounded-lg transition-all duration-200 ${
                  currentStatus === 'late' 
                    ? 'bg-amber-500 text-white shadow-lg scale-105 ring-2 ring-amber-200' 
                    : 'hover:bg-amber-50 dark:hover:bg-amber-900/30 text-amber-600 dark:text-amber-400 hover:scale-105'
                }`}
                onClick={() => handleUpdateAttendance(row.original.id, 'late')}
                title="Mark Late"
              >
                <Clock className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={`w-9 h-9 p-0 rounded-lg transition-all duration-200 ${
                  currentStatus === 'absent' 
                    ? 'bg-red-500 text-white shadow-lg scale-105 ring-2 ring-red-200' 
                    : 'hover:bg-red-50 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 hover:scale-105'
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
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">
              Attendance Management
            </h1>
            <p className="text-blue-100 text-lg">
              Monitor student attendance and track patterns across your institution
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 backdrop-blur-sm"
            >
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
            <Button
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 backdrop-blur-sm"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </Button>
          </div>
        </div>
        
        {/* Statistics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="glass-morphism border-white/10 bg-gradient-to-br from-blue-500/10 to-cyan-500/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white/90">Total Students</CardTitle>
              <Users className="h-5 w-5 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{(stats as any)?.students?.total || 0}</div>
              <div className="text-xs text-blue-200 mt-1">
                <TrendingUp className="h-3 w-3 inline mr-1" />
                Active enrollment
              </div>
            </CardContent>
          </Card>

          <Card className="glass-morphism border-white/10 bg-gradient-to-br from-emerald-500/10 to-green-500/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white/90">Present Today</CardTitle>
              <CheckCircle className="h-5 w-5 text-emerald-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{attendanceStats.present}</div>
              <div className="text-xs text-emerald-200 mt-1">
                {attendanceRate}% attendance rate
              </div>
            </CardContent>
          </Card>

          <Card className="glass-morphism border-white/10 bg-gradient-to-br from-amber-500/10 to-yellow-500/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white/90">Late Arrivals</CardTitle>
              <Clock className="h-5 w-5 text-amber-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{attendanceStats.late}</div>
              <div className="text-xs text-amber-200 mt-1">
                Punctuality tracking
              </div>
            </CardContent>
          </Card>

          <Card className="glass-morphism border-white/10 bg-gradient-to-br from-red-500/10 to-rose-500/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white/90">Absent</CardTitle>
              <XCircle className="h-5 w-5 text-red-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{attendanceStats.absent}</div>
              <div className="text-xs text-red-200 mt-1">
                Requires follow-up
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Main Attendance Table */}
        <Card className="glass-morphism border-white/10 overflow-hidden shadow-2xl">
          <CardHeader className="bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-cyan-600/20 border-b border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-500/20 rounded-xl">
                  <ClipboardList className="h-7 w-7 text-blue-400" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold text-white">Attendance Records</CardTitle>
                  <CardDescription className="text-blue-100 mt-1">
                    Comprehensive attendance tracking and management system
                  </CardDescription>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 h-4 w-4" />
                  <Input
                    placeholder="Search students..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 w-64"
                  />
                </div>

                {/* Filters */}
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-white/70" />
                  <FilterSelect
                    label="Status"
                    options={[
                      { value: '', label: 'All Status' },
                      { value: 'present', label: 'Present' },
                      { value: 'absent', label: 'Absent' },
                      { value: 'late', label: 'Late' },
                    ]}
                    value={filters.status}
                    onChange={(value) => setFilters({ ...filters, status: value })}
                    placeholder="Filter by status"
                  />
                  <FilterSelect
                    label="Date"
                    options={[
                      { value: '', label: 'All Dates' },
                      { value: 'today', label: 'Today' },
                      { value: 'week', label: 'This Week' },
                      { value: 'month', label: 'This Month' },
                    ]}
                    value={filters.date}
                    onChange={(value) => setFilters({ ...filters, date: value })}
                    placeholder="Filter by date"
                  />
                </div>
                
                {/* Add Attendance Button */}
                <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-xl border border-blue-500/50 px-6 py-3 font-semibold"
                      onClick={() => setIsAddModalOpen(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Record Attendance
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="glass-morphism border-white/10 bg-gradient-to-br from-gray-900/90 to-slate-900/90 max-w-md">
                    <DialogHeader>
                      <DialogTitle className="text-white text-xl flex items-center space-x-2">
                        <Calendar className="h-5 w-5 text-blue-400" />
                        <span>Record New Attendance</span>
                      </DialogTitle>
                      <DialogDescription className="text-blue-100">
                        Add a new attendance record for a student on the selected date.
                      </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">
                        <FormField
                          control={form.control}
                          name="studentId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white font-medium">Select Student</FormLabel>
                              <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value?.toString()}>
                                <FormControl>
                                  <SelectTrigger className="bg-white/10 border-white/20 text-white focus:border-blue-400">
                                    <SelectValue placeholder="Choose a student" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {students?.map((student) => (
                                    <SelectItem key={student.id} value={student.id.toString()}>
                                      <div className="flex items-center space-x-3">
                                        <img 
                                          src={student.profilePhoto || generateUserAvatar(`${student.firstName} ${student.lastName}`, 32)}
                                          alt={`${student.firstName} ${student.lastName}`}
                                          className="w-6 h-6 rounded-full"
                                        />
                                        <span>{student.firstName} {student.lastName}</span>
                                        <span className="text-xs text-gray-500">({student.studentId})</span>
                                      </div>
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
                              <FormLabel className="text-white font-medium">Attendance Date</FormLabel>
                              <FormControl>
                                <Input 
                                  type="date" 
                                  {...field} 
                                  className="bg-white/10 border-white/20 text-white focus:border-blue-400"
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
                              <FormLabel className="text-white font-medium">Attendance Status</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger className="bg-white/10 border-white/20 text-white focus:border-blue-400">
                                    <SelectValue placeholder="Select status" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="present">
                                    <div className="flex items-center space-x-2">
                                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                                      <span>Present</span>
                                    </div>
                                  </SelectItem>
                                  <SelectItem value="late">
                                    <div className="flex items-center space-x-2">
                                      <Clock className="h-4 w-4 text-amber-500" />
                                      <span>Late</span>
                                    </div>
                                  </SelectItem>
                                  <SelectItem value="absent">
                                    <div className="flex items-center space-x-2">
                                      <XCircle className="h-4 w-4 text-red-500" />
                                      <span>Absent</span>
                                    </div>
                                  </SelectItem>
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
                              <FormLabel className="text-white font-medium">Additional Notes</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Optional notes or comments..." 
                                  {...field} 
                                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-blue-400"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="flex justify-end space-x-3 pt-6 border-t border-white/10">
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
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Record
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-0 bg-white/5 backdrop-blur-sm">
            {isLoading ? (
              <div className="p-12 text-center text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-6"></div>
                <h3 className="text-lg font-semibold mb-2">Loading Attendance Records</h3>
                <p className="text-blue-200">Please wait while we fetch the latest data...</p>
              </div>
            ) : error ? (
              <div className="p-12 text-center">
                <XCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-red-400 mb-2">Error Loading Data</h3>
                <p className="text-red-300">Unable to load attendance records. Please try refreshing the page.</p>
              </div>
            ) : attendance?.length === 0 ? (
              <div className="p-12 text-center">
                <ClipboardList className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">No Attendance Records</h3>
                <p className="text-blue-200 mb-4">Start by recording attendance for your students.</p>
                <Button 
                  onClick={() => setIsAddModalOpen(true)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Record
                </Button>
              </div>
            ) : (
              <DataTable
                columns={columns}
                data={attendance || []}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}