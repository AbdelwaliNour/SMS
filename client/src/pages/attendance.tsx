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
      id: 'select',
      header: ({ table }) => (
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={table.getIsAllPageRowsSelected()}
            onChange={(value) => table.toggleAllPageRowsSelected(!!value.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Select All</span>
        </div>
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={row.getIsSelected()}
          onChange={(value) => row.toggleSelected(!!value.target.checked)}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'student',
      header: ({ column }) => (
        <div className="flex items-center space-x-2">
          <Users className="w-4 h-4 text-gray-500" />
          <span className="font-semibold">Student Details</span>
        </div>
      ),
      cell: ({ row }) => {
        const student = getStudentInfo(row.original.studentId);
        const fullName = student ? `${student.firstName} ${student.lastName}` : 'Unknown';
        const profilePhoto = student?.profilePhoto;
        const age = student?.dateOfBirth ? new Date().getFullYear() - new Date(student.dateOfBirth).getFullYear() : null;
        
        return (
          <div className="flex items-center space-x-4 py-3">
            <div className="relative">
              <img 
                src={profilePhoto || generateUserAvatar(fullName, 60)} 
                alt={fullName} 
                className="w-15 h-15 rounded-2xl object-cover ring-2 ring-blue-500/20 shadow-lg hover:ring-blue-500/40 transition-all duration-200"
              />
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                <span className="text-white text-xs font-bold">
                  {student?.section?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              {student?.gender && (
                <div className={`absolute -bottom-1 -left-1 w-5 h-5 rounded-full border-2 border-white shadow-sm flex items-center justify-center text-xs ${
                  student.gender === 'male' ? 'bg-blue-500' : 'bg-pink-500'
                }`}>
                  <span className="text-white font-bold">{student.gender.charAt(0).toUpperCase()}</span>
                </div>
              )}
            </div>
            <div className="flex flex-col space-y-1 min-w-0 flex-1">
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white truncate">{fullName}</h3>
                {age && (
                  <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                    {age}y
                  </Badge>
                )}
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <span className="text-gray-600 dark:text-gray-400 font-medium">
                  ID: {student?.studentId || `#${row.original.studentId}`}
                </span>
                {student?.section && (
                  <Badge variant="outline" className="text-xs border-gray-300 dark:border-gray-600">
                    {student.section.charAt(0).toUpperCase() + student.section.slice(1)} Section
                  </Badge>
                )}
                {student?.class && (
                  <Badge variant="outline" className="text-xs border-gray-300 dark:border-gray-600">
                    Class {student.class}
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
      header: ({ column }) => (
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-gray-500" />
          <span className="font-semibold">Date & Time</span>
        </div>
      ),
      cell: ({ row }) => {
        const date = new Date(row.original.date);
        const today = new Date();
        const isToday = date.toDateString() === today.toDateString();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const isYesterday = date.toDateString() === yesterday.toDateString();
        
        return (
          <div className="flex flex-col space-y-2 py-2">
            <div className="flex items-center space-x-2">
              <div className={`px-3 py-1.5 rounded-lg font-semibold text-sm ${
                isToday 
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                  : isYesterday 
                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
              }`}>
                {isToday ? 'Today' : isYesterday ? 'Yesterday' : date.toLocaleDateString('en-US', { 
                  weekday: 'short', 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </div>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>{date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'status',
      header: ({ column }) => (
        <div className="flex items-center space-x-2">
          <ClipboardList className="w-4 h-4 text-gray-500" />
          <span className="font-semibold">Attendance Status</span>
        </div>
      ),
      cell: ({ row }) => {
        const status = row.original.status;
        let statusConfig;
        
        if (status === 'present') {
          statusConfig = {
            container: 'bg-gradient-to-r from-emerald-50 via-green-50 to-emerald-50 dark:from-emerald-900/20 dark:via-green-900/20 dark:to-emerald-900/20',
            border: 'border-emerald-300 dark:border-emerald-600',
            text: 'text-emerald-800 dark:text-emerald-200',
            dot: 'bg-emerald-500 shadow-emerald-500/50',
            icon: <CheckCircle className="w-5 h-5" />,
            label: 'Present',
            glow: 'shadow-lg shadow-emerald-500/20'
          };
        } else if (status === 'late') {
          statusConfig = {
            container: 'bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-50 dark:from-amber-900/20 dark:via-yellow-900/20 dark:to-amber-900/20',
            border: 'border-amber-300 dark:border-amber-600',
            text: 'text-amber-800 dark:text-amber-200',
            dot: 'bg-amber-500 shadow-amber-500/50',
            icon: <Clock className="w-5 h-5" />,
            label: 'Late Arrival',
            glow: 'shadow-lg shadow-amber-500/20'
          };
        } else {
          statusConfig = {
            container: 'bg-gradient-to-r from-red-50 via-rose-50 to-red-50 dark:from-red-900/20 dark:via-rose-900/20 dark:to-red-900/20',
            border: 'border-red-300 dark:border-red-600',
            text: 'text-red-800 dark:text-red-200',
            dot: 'bg-red-500 shadow-red-500/50',
            icon: <XCircle className="w-5 h-5" />,
            label: 'Absent',
            glow: 'shadow-lg shadow-red-500/20'
          };
        }
        
        return (
          <div className={`flex items-center space-x-4 px-5 py-4 rounded-xl border-2 ${statusConfig.container} ${statusConfig.border} ${statusConfig.glow} w-fit min-w-[160px]`}>
            <div className={`w-4 h-4 rounded-full ${statusConfig.dot} shadow-lg animate-pulse`}></div>
            <div className={`${statusConfig.text} flex items-center space-x-2`}>
              {statusConfig.icon}
              <span className="font-bold text-sm">{statusConfig.label}</span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'note',
      header: ({ column }) => (
        <div className="flex items-center space-x-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
          </svg>
          <span className="font-semibold">Notes & Comments</span>
        </div>
      ),
      cell: ({ row }) => {
        const note = row.original.note;
        return (
          <div className="max-w-sm py-2">
            {note ? (
              <div className="group relative">
                <div className="text-sm text-gray-700 dark:text-gray-300 bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 shadow-sm hover:shadow-md transition-all duration-200">
                  <div className="flex items-start space-x-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                    </svg>
                    <p className="leading-relaxed text-sm font-medium">{note}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3 text-gray-400 dark:text-gray-500 italic text-sm py-3">
                <div className="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                <span>No notes recorded</span>
              </div>
            )}
          </div>
        );
      },
    },
    {
      id: 'actions',
      header: ({ column }) => (
        <div className="flex items-center space-x-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span className="font-semibold">Quick Actions</span>
        </div>
      ),
      cell: ({ row }) => {
        const currentStatus = row.original.status;
        
        return (
          <div className="flex items-center space-x-2 py-2">
            <div className="flex space-x-1.5 bg-white dark:bg-gray-800 rounded-2xl p-2 border-2 border-gray-200 dark:border-gray-600 shadow-lg">
              <Button
                variant="ghost"
                size="sm"
                className={`w-10 h-10 p-0 rounded-xl transition-all duration-300 transform hover:scale-110 ${
                  currentStatus === 'present' 
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 scale-105 ring-2 ring-emerald-300' 
                    : 'hover:bg-emerald-50 dark:hover:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 hover:shadow-md'
                }`}
                onClick={() => handleUpdateAttendance(row.original.id, 'present')}
                title="Mark Present"
              >
                <CheckCircle className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={`w-10 h-10 p-0 rounded-xl transition-all duration-300 transform hover:scale-110 ${
                  currentStatus === 'late' 
                    ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30 scale-105 ring-2 ring-amber-300' 
                    : 'hover:bg-amber-50 dark:hover:bg-amber-900/30 text-amber-600 dark:text-amber-400 hover:shadow-md'
                }`}
                onClick={() => handleUpdateAttendance(row.original.id, 'late')}
                title="Mark Late"
              >
                <Clock className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={`w-10 h-10 p-0 rounded-xl transition-all duration-300 transform hover:scale-110 ${
                  currentStatus === 'absent' 
                    ? 'bg-red-500 text-white shadow-lg shadow-red-500/30 scale-105 ring-2 ring-red-300' 
                    : 'hover:bg-red-50 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 hover:shadow-md'
                }`}
                onClick={() => handleUpdateAttendance(row.original.id, 'absent')}
                title="Mark Absent"
              >
                <XCircle className="w-5 h-5" />
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
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-600 to-purple-600 dark:from-white dark:via-blue-100 dark:to-purple-200 bg-clip-text text-transparent">
              Attendance Management
            </h1>
            <p className="text-gray-600 dark:text-blue-100 text-lg">
              Monitor student attendance and track patterns across your institution
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              className="border-gray-300 dark:border-white/20 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 backdrop-blur-sm"
            >
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
            <Button
              variant="outline"
              className="border-gray-300 dark:border-white/20 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 backdrop-blur-sm"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </Button>
          </div>
        </div>
        
        {/* Statistics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="glass-morphism border-gray-200 dark:border-white/10 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-500/10 dark:to-cyan-500/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700 dark:text-white/90">Total Students</CardTitle>
              <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">{(stats as any)?.students?.total || 0}</div>
              <div className="text-xs text-gray-600 dark:text-blue-200 mt-1">
                <TrendingUp className="h-3 w-3 inline mr-1" />
                Active enrollment
              </div>
            </CardContent>
          </Card>

          <Card className="glass-morphism border-gray-200 dark:border-white/10 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-500/10 dark:to-green-500/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700 dark:text-white/90">Present Today</CardTitle>
              <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">{attendanceStats.present}</div>
              <div className="text-xs text-gray-600 dark:text-emerald-200 mt-1">
                {attendanceRate}% attendance rate
              </div>
            </CardContent>
          </Card>

          <Card className="glass-morphism border-gray-200 dark:border-white/10 bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-500/10 dark:to-yellow-500/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700 dark:text-white/90">Late Arrivals</CardTitle>
              <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">{attendanceStats.late}</div>
              <div className="text-xs text-gray-600 dark:text-amber-200 mt-1">
                Punctuality tracking
              </div>
            </CardContent>
          </Card>

          <Card className="glass-morphism border-gray-200 dark:border-white/10 bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-500/10 dark:to-rose-500/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700 dark:text-white/90">Absent</CardTitle>
              <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">{attendanceStats.absent}</div>
              <div className="text-xs text-gray-600 dark:text-red-200 mt-1">
                Requires follow-up
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Main Attendance Table */}
        <Card className="glass-morphism border-gray-200 dark:border-white/10 overflow-hidden shadow-2xl">
          <CardHeader className="bg-gradient-to-r from-blue-100/80 via-purple-100/80 to-cyan-100/80 dark:from-blue-600/20 dark:via-purple-600/20 dark:to-cyan-600/20 border-b border-gray-200 dark:border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-200/50 dark:bg-blue-500/20 rounded-xl">
                  <ClipboardList className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">Attendance Records</CardTitle>
                  <CardDescription className="text-gray-600 dark:text-blue-100 mt-1">
                    Comprehensive attendance tracking and management system
                  </CardDescription>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-white/50 h-4 w-4" />
                  <Input
                    placeholder="Search students..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/90 dark:bg-white/10 border-gray-300 dark:border-white/20 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-white/50 w-64"
                  />
                </div>

                {/* Filters */}
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-gray-600 dark:text-white/70" />
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
                  <DialogContent className="glass-morphism border-gray-200 dark:border-white/10 bg-gradient-to-br from-white/98 to-blue-50/50 dark:from-gray-900/95 dark:to-slate-900/95 max-w-2xl">
                    <DialogHeader className="space-y-4 pb-6 border-b border-gray-200 dark:border-white/10">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
                          <Calendar className="h-7 w-7 text-white" />
                        </div>
                        <div>
                          <DialogTitle className="text-gray-900 dark:text-white text-2xl font-bold">
                            Record Student Attendance
                          </DialogTitle>
                          <DialogDescription className="text-gray-600 dark:text-blue-100 text-base mt-1">
                            Create a new attendance record with detailed information and notes
                          </DialogDescription>
                        </div>
                      </div>
                    </DialogHeader>
                    
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-6">
                        {/* Student Selection Section */}
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6">
                          <div className="flex items-center space-x-3 mb-4">
                            <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Student Information</h3>
                          </div>
                          <FormField
                            control={form.control}
                            name="studentId"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-900 dark:text-white font-medium text-base">Select Student</FormLabel>
                                <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value?.toString()}>
                                  <FormControl>
                                    <SelectTrigger className="bg-white dark:bg-white/10 border-gray-300 dark:border-white/20 text-gray-900 dark:text-white focus:border-blue-500 h-14 text-base">
                                      <SelectValue placeholder="Choose a student from the list" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent className="max-h-60">
                                    {students?.map((student) => (
                                      <SelectItem key={student.id} value={student.id.toString()} className="py-3">
                                        <div className="flex items-center space-x-4">
                                          <img 
                                            src={student.profilePhoto || generateUserAvatar(`${student.firstName} ${student.lastName}`, 40)}
                                            alt={`${student.firstName} ${student.lastName}`}
                                            className="w-10 h-10 rounded-full ring-2 ring-blue-200"
                                          />
                                          <div className="flex flex-col">
                                            <span className="font-semibold">{student.firstName} {student.lastName}</span>
                                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                                              <span>ID: {student.studentId}</span>
                                              <span>•</span>
                                              <span>{student.section}</span>
                                              <span>•</span>
                                              <span>Class {student.class}</span>
                                            </div>
                                          </div>
                                        </div>
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        {/* Date and Status Section */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-xl p-6">
                            <div className="flex items-center space-x-3 mb-4">
                              <Calendar className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Date Selection</h3>
                            </div>
                            <FormField
                              control={form.control}
                              name="date"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-gray-900 dark:text-white font-medium text-base">Attendance Date</FormLabel>
                                  <FormControl>
                                    <Input 
                                      type="date" 
                                      {...field} 
                                      className="bg-white dark:bg-white/10 border-gray-300 dark:border-white/20 text-gray-900 dark:text-white focus:border-emerald-500 h-12 text-base"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6">
                            <div className="flex items-center space-x-3 mb-4">
                              <ClipboardList className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Attendance Status</h3>
                            </div>
                            <FormField
                              control={form.control}
                              name="status"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-gray-900 dark:text-white font-medium text-base">Student Status</FormLabel>
                                  <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                      <SelectTrigger className="bg-white dark:bg-white/10 border-gray-300 dark:border-white/20 text-gray-900 dark:text-white focus:border-purple-500 h-12 text-base">
                                        <SelectValue placeholder="Select attendance status" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="present" className="py-3">
                                        <div className="flex items-center space-x-3">
                                          <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                                            <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                          </div>
                                          <div>
                                            <div className="font-semibold">Present</div>
                                            <div className="text-sm text-gray-500">Student attended class</div>
                                          </div>
                                        </div>
                                      </SelectItem>
                                      <SelectItem value="late" className="py-3">
                                        <div className="flex items-center space-x-3">
                                          <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                                            <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                                          </div>
                                          <div>
                                            <div className="font-semibold">Late Arrival</div>
                                            <div className="text-sm text-gray-500">Student arrived after start time</div>
                                          </div>
                                        </div>
                                      </SelectItem>
                                      <SelectItem value="absent" className="py-3">
                                        <div className="flex items-center space-x-3">
                                          <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                                            <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                                          </div>
                                          <div>
                                            <div className="font-semibold">Absent</div>
                                            <div className="text-sm text-gray-500">Student did not attend</div>
                                          </div>
                                        </div>
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>

                        {/* Notes Section */}
                        <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl p-6">
                          <div className="flex items-center space-x-3 mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                            </svg>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Additional Information</h3>
                          </div>
                          <FormField
                            control={form.control}
                            name="note"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-900 dark:text-white font-medium text-base">Notes & Comments</FormLabel>
                                <FormControl>
                                  <textarea
                                    placeholder="Add any relevant notes, reasons for absence, or additional comments..."
                                    {...field}
                                    rows={4}
                                    className="w-full px-4 py-3 bg-white dark:bg-white/10 border border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-white/50 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 resize-none text-base"
                                  />
                                </FormControl>
                                <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                  Optional: Provide context or additional details about the attendance record
                                </div>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-between items-center pt-6">
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            All fields marked with * are required
                          </div>
                          <div className="flex space-x-4">
                            <Button 
                              type="button" 
                              variant="outline" 
                              onClick={() => setIsAddModalOpen(false)}
                              className="border-gray-300 dark:border-white/20 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 px-6 py-3 text-base"
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              Cancel
                            </Button>
                            <Button 
                              type="submit" 
                              className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 hover:from-blue-700 hover:via-purple-700 hover:to-blue-800 text-white font-semibold px-8 py-3 text-base shadow-lg hover:shadow-xl transition-all duration-200"
                            >
                              <Plus className="h-5 w-5 mr-2" />
                              Create Attendance Record
                            </Button>
                          </div>
                        </div>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-0 bg-gray-50/50 dark:bg-white/5 backdrop-blur-sm">
            {isLoading ? (
              <div className="p-12 text-center text-gray-900 dark:text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto mb-6"></div>
                <h3 className="text-lg font-semibold mb-2">Loading Attendance Records</h3>
                <p className="text-gray-600 dark:text-blue-200">Please wait while we fetch the latest data...</p>
              </div>
            ) : error ? (
              <div className="p-12 text-center">
                <XCircle className="h-12 w-12 text-red-500 dark:text-red-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-2">Error Loading Data</h3>
                <p className="text-red-500 dark:text-red-300">Unable to load attendance records. Please try refreshing the page.</p>
              </div>
            ) : attendance?.length === 0 ? (
              <div className="p-12 text-center">
                <ClipboardList className="h-12 w-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Attendance Records</h3>
                <p className="text-gray-600 dark:text-blue-200 mb-4">Start by recording attendance for your students.</p>
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