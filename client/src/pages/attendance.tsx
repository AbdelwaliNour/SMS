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
  Filter,
  Save
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
  
  // New state for table-based attendance form
  const [studentStatuses, setStudentStatuses] = useState<Record<number, 'present' | 'absent' | 'late'>>({});
  const [studentNotes, setStudentNotes] = useState<Record<number, string>>({});
  const [selectedClass, setSelectedClass] = useState('');

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

  // Functions for the new table-based attendance form
  const updateStudentStatus = (studentId: number, status: 'present' | 'absent' | 'late') => {
    setStudentStatuses(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const updateStudentNotes = (studentId: number, note: string) => {
    setStudentNotes(prev => ({
      ...prev,
      [studentId]: note
    }));
  };

  const handleBulkAttendanceSubmit = async () => {
    try {
      // Filter only students that have a status selected
      const recordsToSubmit = Object.entries(studentStatuses);
      
      if (recordsToSubmit.length === 0) {
        toast({
          title: 'No Records Selected',
          description: 'Please mark attendance status for at least one student',
          variant: 'destructive',
        });
        return;
      }
      
      const attendanceRecords = recordsToSubmit.map(([studentId, status]) => ({
        studentId: parseInt(studentId),
        status,
        note: studentNotes[parseInt(studentId)] || '',
        date: new Date().toISOString(), // Automatically use current date/time
      }));

      // Submit all attendance records
      let successCount = 0;
      let errors = [];
      
      for (const record of attendanceRecords) {
        try {
          await apiRequest('POST', '/api/attendance', record);
          successCount++;
        } catch (recordError: any) {
          console.error('Failed to save record for student:', record.studentId, recordError);
          errors.push({
            studentId: record.studentId,
            error: recordError
          });
        }
      }

      if (successCount > 0) {
        toast({
          title: 'Success',
          description: `Attendance recorded for ${successCount} students${errors.length > 0 ? ` (${errors.length} failed)` : ''}`,
        });
        
        queryClient.invalidateQueries({ queryKey: ['/api/attendance'] });
        setIsAddModalOpen(false);
        
        // Reset the form state
        setStudentStatuses({});
        setStudentNotes({});
      }

      if (errors.length > 0) {
        console.error('Some records failed to save:', errors);
      }
    } catch (error: any) {
      console.error('Bulk attendance submission error:', error);
      toast({
        title: 'Error',
        description: `Failed to save attendance records: ${error?.message || 'Unknown error'}`,
        variant: 'destructive',
      });
    }
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

  const getStudentInfo = (studentId: number) => {
    return students?.find(s => s.id === studentId);
  };

  // Filter attendance data based on current filters
  const filteredAttendance = attendance?.filter(record => {
    let matches = true;

    // Search filter
    if (searchTerm) {
      const student = getStudentInfo(record.studentId);
      const fullName = student ? `${student.firstName} ${student.lastName}`.toLowerCase() : '';
      const studentId = student?.studentId?.toLowerCase() || '';
      matches = matches && (
        fullName.includes(searchTerm.toLowerCase()) ||
        studentId.includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (filters.status) {
      matches = matches && record.status === filters.status;
    }

    // Date filter
    if (filters.date && record.date) {
      const recordDate = new Date(record.date);
      const today = new Date();
      
      switch (filters.date) {
        case 'today':
          matches = matches && recordDate.toDateString() === today.toDateString();
          break;
        case 'week':
          const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
          matches = matches && recordDate >= weekAgo;
          break;
        case 'month':
          const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
          matches = matches && recordDate >= monthAgo;
          break;
      }
    }

    return matches;
  }) || [];

  const columns: ColumnDef<Attendance>[] = [
    {
      accessorKey: 'photo',
      header: 'Photo',
      cell: ({ row }) => {
        const student = getStudentInfo(row.original.studentId);
        const fullName = student ? `${student.firstName} ${student.lastName}` : 'Unknown';
        const profilePhoto = student?.profilePhoto;
        
        return (
          <div className="flex justify-center py-2">
            <div className="relative">
              <img 
                src={profilePhoto || generateUserAvatar(fullName, 48)} 
                alt={fullName} 
                className="w-12 h-12 rounded-xl object-cover ring-2 ring-blue-500/20 shadow-md"
              />
              {student?.gender && (
                <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white shadow-sm flex items-center justify-center text-xs ${
                  student.gender === 'male' ? 'bg-blue-500' : 'bg-pink-500'
                }`}>
                  <span className="text-white font-bold text-xs">{student.gender.charAt(0).toUpperCase()}</span>
                </div>
              )}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'studentId',
      header: 'Student ID',
      cell: ({ row }) => {
        const student = getStudentInfo(row.original.studentId);
        return (
          <div className="py-2">
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {student?.studentId || `#${row.original.studentId}`}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: 'name',
      header: 'Student Name',
      cell: ({ row }) => {
        const student = getStudentInfo(row.original.studentId);
        const fullName = student ? `${student.firstName} ${student.lastName}` : 'Unknown';
        
        return (
          <div className="py-2">
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              {fullName}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: 'age',
      header: 'Age',
      cell: ({ row }) => {
        const student = getStudentInfo(row.original.studentId);
        const age = student?.dateOfBirth ? new Date().getFullYear() - new Date(student.dateOfBirth).getFullYear() : null;
        
        return (
          <div className="py-2 flex justify-center">
            {age ? (
              <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                {age}y
              </Badge>
            ) : (
              <span className="text-gray-400 dark:text-gray-500 text-xs">N/A</span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'section',
      header: 'Section',
      cell: ({ row }) => {
        const student = getStudentInfo(row.original.studentId);
        
        return (
          <div className="py-2 flex justify-center">
            {student?.section ? (
              <Badge variant="outline" className="text-xs border-gray-300 dark:border-gray-600">
                {student.section}
              </Badge>
            ) : (
              <span className="text-gray-400 dark:text-gray-500 text-xs">N/A</span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'class',
      header: 'Class',
      cell: ({ row }) => {
        const student = getStudentInfo(row.original.studentId);
        
        return (
          <div className="py-2 flex justify-center">
            {student?.class ? (
              <Badge variant="outline" className="text-xs border-gray-300 dark:border-gray-600">
                {student.class}
              </Badge>
            ) : (
              <span className="text-gray-400 dark:text-gray-500 text-xs">N/A</span>
            )}
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
        const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
        const isYesterday = date.toDateString() === yesterday.toDateString();
        
        let dateLabel = '';
        if (isToday) {
          dateLabel = 'Today';
        } else if (isYesterday) {
          dateLabel = 'Yesterday';
        } else {
          dateLabel = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }
        
        return (
          <div className="flex flex-col space-y-1 py-2">
            <div className="flex items-center space-x-2">
              <Badge 
                variant={isToday ? 'default' : 'secondary'} 
                className={`text-xs font-semibold ${
                  isToday 
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' 
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                }`}
              >
                {dateLabel}
              </Badge>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
              </span>
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
      accessorKey: 'note',
      header: 'Notes & Comments',
      cell: ({ row }) => {
        const note = row.original.note;
        return (
          <div className="max-w-sm py-2">
            {note ? (
              <div className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600">
                <p className="leading-relaxed">{note}</p>
              </div>
            ) : (
              <div className="flex items-center space-x-2 text-gray-400 dark:text-gray-500 italic text-sm">
                <div className="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                <span>No notes</span>
              </div>
            )}
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
            container: 'bg-emerald-50 dark:bg-emerald-900/20',
            border: 'border-emerald-300 dark:border-emerald-600',
            text: 'text-emerald-800 dark:text-emerald-200',
            dot: 'bg-emerald-500',
            icon: <CheckCircle className="w-4 h-4" />,
            label: 'Present'
          };
        } else if (status === 'late') {
          statusConfig = {
            container: 'bg-amber-50 dark:bg-amber-900/20',
            border: 'border-amber-300 dark:border-amber-600',
            text: 'text-amber-800 dark:text-amber-200',
            dot: 'bg-amber-500',
            icon: <Clock className="w-4 h-4" />,
            label: 'Late'
          };
        } else {
          statusConfig = {
            container: 'bg-red-50 dark:bg-red-900/20',
            border: 'border-red-300 dark:border-red-600',
            text: 'text-red-800 dark:text-red-200',
            dot: 'bg-red-500',
            icon: <XCircle className="w-4 h-4" />,
            label: 'Absent'
          };
        }
        
        return (
          <div className={`flex items-center space-x-3 px-4 py-3 rounded-lg border ${statusConfig.container} ${statusConfig.border} w-fit`}>
            <div className={`w-3 h-3 rounded-full ${statusConfig.dot}`}></div>
            <div className={`${statusConfig.text} flex items-center space-x-2`}>
              {statusConfig.icon}
              <span className="font-semibold text-sm">{statusConfig.label}</span>
            </div>
          </div>
        );
      },
    },
  ];

  // Filter students for the attendance form based on selected class
  const filteredStudentsForForm = students?.filter(student => {
    return selectedClass === '' || student.class === selectedClass;
  }) || [];

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
          
          <div className="flex items-center space-x-4">
            <Button variant="outline" className="glass-morphism border-blue-200 hover:bg-blue-50 dark:border-blue-600 dark:hover:bg-blue-900/30">
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
            <Button variant="outline" className="glass-morphism border-purple-200 hover:bg-purple-50 dark:border-purple-600 dark:hover:bg-purple-900/30">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="glass-morphism border-blue-300 dark:border-blue-500/50 bg-gradient-to-br from-blue-100 via-blue-50 to-cyan-100 dark:from-blue-600/20 dark:via-blue-500/20 dark:to-cyan-600/20 shadow-lg shadow-blue-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-800 dark:text-blue-200">Total Records</CardTitle>
              <ClipboardList className="h-5 w-5 text-blue-700 dark:text-blue-300" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">{attendanceStats.total}</div>
              <div className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                All attendance records
              </div>
            </CardContent>
          </Card>

          <Card className="glass-morphism border-emerald-300 dark:border-emerald-500/50 bg-gradient-to-br from-emerald-100 via-green-50 to-emerald-100 dark:from-emerald-600/20 dark:via-green-500/20 dark:to-emerald-600/20 shadow-lg shadow-emerald-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-emerald-800 dark:text-emerald-200">Present</CardTitle>
              <CheckCircle className="h-5 w-5 text-emerald-700 dark:text-emerald-300" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-900 dark:text-emerald-100">{attendanceStats.present}</div>
              <div className="text-xs text-emerald-700 dark:text-emerald-300 mt-1">
                {attendanceRate}% attendance rate
              </div>
            </CardContent>
          </Card>

          <Card className="glass-morphism border-amber-300 dark:border-amber-500/50 bg-gradient-to-br from-amber-100 via-yellow-50 to-amber-100 dark:from-amber-600/20 dark:via-yellow-500/20 dark:to-amber-600/20 shadow-lg shadow-amber-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-amber-800 dark:text-amber-200">Late Arrivals</CardTitle>
              <Clock className="h-5 w-5 text-amber-700 dark:text-amber-300" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-900 dark:text-amber-100">{attendanceStats.late}</div>
              <div className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                Need attention
              </div>
            </CardContent>
          </Card>

          <Card className="glass-morphism border-red-300 dark:border-red-500/50 bg-gradient-to-br from-red-100 via-rose-50 to-red-100 dark:from-red-600/20 dark:via-rose-500/20 dark:to-red-600/20 shadow-lg shadow-red-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-red-800 dark:text-red-200">Absent</CardTitle>
              <XCircle className="h-5 w-5 text-red-700 dark:text-red-300" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-900 dark:text-red-100">{attendanceStats.absent}</div>
              <div className="text-xs text-red-700 dark:text-red-300 mt-1">
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
                  <CardTitle className="text-gray-900 dark:text-white text-2xl font-bold">
                    Attendance Records
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-blue-200 text-base mt-1">
                    View and manage student attendance data with advanced filtering
                  </CardDescription>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                {/* Search Bar */}
                <div className="relative min-w-[300px]">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search students or ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 glass-morphism border-gray-200 dark:border-white/20 bg-white/70 dark:bg-white/10 focus:bg-white dark:focus:bg-white/20"
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
                  <DialogContent className="glass-morphism border-gray-200 dark:border-white/10 bg-gradient-to-br from-white/98 to-blue-50/50 dark:from-gray-900/95 dark:to-slate-900/95 max-w-7xl w-[95vw]">
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
                    
                    <div className="space-y-6 mt-6">
                      {/* Date Selection Header */}
                      <div className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-xl p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Calendar className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Record Attendance</h3>
                          </div>
                          <div className="flex items-center space-x-6">
                            <div className="flex items-center space-x-2">
                              <label className="text-gray-900 dark:text-white font-medium">Class:</label>
                              <select
                                value={selectedClass}
                                onChange={(e) => setSelectedClass(e.target.value)}
                                className="bg-white dark:bg-white/10 border border-gray-300 dark:border-white/20 rounded-lg px-3 py-2 text-gray-900 dark:text-white focus:border-emerald-500"
                              >
                                <option value="">All Classes</option>
                                {Array.from(new Set(students?.map(s => s.class) || [])).sort().map(cls => (
                                  <option key={cls} value={cls}>{cls}</option>
                                ))}
                              </select>
                            </div>
                            <div className="flex items-center space-x-2">
                              <label className="text-gray-900 dark:text-white font-medium">Date:</label>
                              <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-300 dark:border-emerald-600 rounded-lg px-4 py-2 text-emerald-800 dark:text-emerald-200 font-semibold">
                                {new Date().toLocaleDateString('en-US', { 
                                  weekday: 'long', 
                                  year: 'numeric', 
                                  month: 'long', 
                                  day: 'numeric' 
                                })}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Students Attendance Table */}
                      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                              <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Student</th>
                                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900 dark:text-white">Present</th>
                                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900 dark:text-white">Late</th>
                                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900 dark:text-white">Absent</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Notes</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                              {filteredStudentsForForm.map((student) => (
                                <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                  <td className="px-6 py-4">
                                    <div className="flex items-center space-x-4">
                                      <img 
                                        src={student.profilePhoto || generateUserAvatar(`${student.firstName} ${student.lastName}`, 48)} 
                                        alt={`${student.firstName} ${student.lastName}`} 
                                        className="w-12 h-12 rounded-lg object-cover ring-2 ring-blue-500/20"
                                      />
                                      <div>
                                        <div className="font-semibold text-gray-900 dark:text-white">
                                          {student.firstName} {student.lastName}
                                        </div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                          {student.studentId} • Class {student.class}
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 text-center">
                                    <button
                                      onClick={() => updateStudentStatus(student.id, 'present')}
                                      className={`w-10 h-10 rounded-full transition-all duration-200 ${
                                        studentStatuses[student.id] === 'present'
                                          ? 'bg-emerald-500 text-white scale-110 ring-4 ring-emerald-200'
                                          : 'bg-gray-200 dark:bg-gray-600 hover:bg-emerald-100 dark:hover:bg-emerald-800'
                                      }`}
                                    >
                                      <CheckCircle className="w-5 h-5 mx-auto" />
                                    </button>
                                  </td>
                                  <td className="px-6 py-4 text-center">
                                    <button
                                      onClick={() => updateStudentStatus(student.id, 'late')}
                                      className={`w-10 h-10 rounded-full transition-all duration-200 ${
                                        studentStatuses[student.id] === 'late'
                                          ? 'bg-amber-500 text-white scale-110 ring-4 ring-amber-200'
                                          : 'bg-gray-200 dark:bg-gray-600 hover:bg-amber-100 dark:hover:bg-amber-800'
                                      }`}
                                    >
                                      <Clock className="w-5 h-5 mx-auto" />
                                    </button>
                                  </td>
                                  <td className="px-6 py-4 text-center">
                                    <button
                                      onClick={() => updateStudentStatus(student.id, 'absent')}
                                      className={`w-10 h-10 rounded-full transition-all duration-200 ${
                                        studentStatuses[student.id] === 'absent'
                                          ? 'bg-red-500 text-white scale-110 ring-4 ring-red-200'
                                          : 'bg-gray-200 dark:bg-gray-600 hover:bg-red-100 dark:hover:bg-red-800'
                                      }`}
                                    >
                                      <XCircle className="w-5 h-5 mx-auto" />
                                    </button>
                                  </td>
                                  <td className="px-6 py-4">
                                    <input
                                      type="text"
                                      value={studentNotes[student.id] || ''}
                                      onChange={(e) => updateStudentNotes(student.id, e.target.value)}
                                      placeholder="Add notes..."
                                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-emerald-500 text-sm"
                                    />
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Submit Button */}
                      <div className="flex justify-end space-x-4 pt-4">
                        <Button 
                          variant="outline" 
                          onClick={() => setIsAddModalOpen(false)}
                          className="px-6"
                        >
                          Cancel
                        </Button>
                        <Button 
                          onClick={handleBulkAttendanceSubmit}
                          className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white px-8"
                        >
                          <Save className="h-4 w-4 mr-2" />
                          Save All Attendance
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-600 dark:text-gray-400 mt-4">Loading attendance records...</p>
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
                data={filteredAttendance}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}