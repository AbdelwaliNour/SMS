import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { useQuery } from '@tanstack/react-query';
import { Attendance, Student } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
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
  Save,
  Target,
  AlertTriangle,
  PieChart,
  UserCheck,
  UserX
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { ProfileAvatar } from '@/components/ui/profile-avatar';
import AttendanceTable from '@/components/attendance/AttendanceTable';

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

  const handleAddAttendance = () => {
    setIsAddModalOpen(true);
  };

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['/api/stats'],
  });

  const { data: attendance, isLoading } = useQuery<Attendance[]>({
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

  // Calculate comprehensive attendance statistics
  const totalStudents = students?.length || 0;
  const todayAttendance = attendance?.filter(a => {
    const recordDate = new Date(a.date);
    const today = new Date();
    return recordDate.toDateString() === today.toDateString();
  }) || [];

  const attendanceStats = {
    total: attendance?.length || 0,
    present: attendance?.filter(a => a.status === 'present').length || 0,
    absent: attendance?.filter(a => a.status === 'absent').length || 0,
    late: attendance?.filter(a => a.status === 'late').length || 0,
    todayPresent: todayAttendance.filter(a => a.status === 'present').length,
    todayAbsent: todayAttendance.filter(a => a.status === 'absent').length,
    todayLate: todayAttendance.filter(a => a.status === 'late').length,
  };

  const attendanceRate = attendanceStats.total > 0 
    ? Math.round((attendanceStats.present / attendanceStats.total) * 100)
    : 0;

  const todayAttendanceRate = todayAttendance.length > 0
    ? Math.round((attendanceStats.todayPresent / todayAttendance.length) * 100)
    : 0;

  if (isLoading || statsLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto p-6 space-y-8 max-w-7xl">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-xl">
                <ClipboardList className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent dark:from-white dark:to-gray-300">
                  Attendance Management
                </h1>
                <p className="text-muted-foreground text-lg">
                  Track student attendance with comprehensive analytics and insights
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button variant="outline" className="glass-morphism border-border/30 hover:border-primary/30">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Attendance Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Today's Attendance Rate */}
          <Card className="glass-morphism border-border/30 hover:border-primary/30 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground font-medium">Today's Attendance</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <h3 className="text-2xl font-bold text-blue-600">{todayAttendanceRate}%</h3>
                    <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +5.2%
                    </Badge>
                  </div>
                  <Progress value={todayAttendanceRate} className="mt-3 h-2" />
                </div>
                <div className="p-3 bg-blue-500/10 rounded-xl">
                  <Target className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Overall Attendance Rate */}
          <Card className="glass-morphism border-border/30 hover:border-primary/30 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground font-medium">Overall Rate</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <h3 className="text-2xl font-bold text-green-600">{attendanceRate}%</h3>
                    <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +2.8%
                    </Badge>
                  </div>
                </div>
                <div className="p-3 bg-green-500/10 rounded-xl">
                  <BarChart3 className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Total Records */}
          <Card className="glass-morphism border-border/30 hover:border-primary/30 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground font-medium">Total Records</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <h3 className="text-2xl font-bold text-purple-600">{attendanceStats.total}</h3>
                    <Badge className="bg-purple-500/10 text-purple-600 border-purple-500/20">
                      <ClipboardList className="h-3 w-3 mr-1" />
                      {todayAttendance.length} today
                    </Badge>
                  </div>
                </div>
                <div className="p-3 bg-purple-500/10 rounded-xl">
                  <School className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Active Students */}
          <Card className="glass-morphism border-border/30 hover:border-primary/30 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground font-medium">Active Students</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <h3 className="text-2xl font-bold text-orange-600">{totalStudents}</h3>
                    <Badge className="bg-orange-500/10 text-orange-600 border-orange-500/20">
                      <Users className="h-3 w-3 mr-1" />
                      enrolled
                    </Badge>
                  </div>
                </div>
                <div className="p-3 bg-orange-500/10 rounded-xl">
                  <Users className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Attendance Status Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Present Students */}
          <Card className="glass-morphism border-border/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-500/10 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-green-600 text-[23px]">Present Students</h3>
                    <p className="text-sm text-muted-foreground">Students marked present</p>
                  </div>
                </div>
                <Badge className="bg-green-500/10 text-green-600 border-green-500/20 text-sm px-3 py-1">
                  {attendanceStats.present}
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Attendance Rate</span>
                  <span className="font-medium">{attendanceRate}%</span>
                </div>
                <Progress value={attendanceRate} className="h-2 bg-green-500/10" />
              </div>
            </CardContent>
          </Card>

          {/* Late Students */}
          <Card className="glass-morphism border-border/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-amber-500/10 rounded-lg">
                    <Clock className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-amber-600 text-[23px]">Late Arrivals</h3>
                    <p className="text-sm text-muted-foreground">Students marked late</p>
                  </div>
                </div>
                <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 text-sm px-3 py-1">
                  {attendanceStats.late}
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Late Rate</span>
                  <span className="font-medium">
                    {attendanceStats.total > 0 ? Math.round((attendanceStats.late / attendanceStats.total) * 100) : 0}%
                  </span>
                </div>
                <Progress 
                  value={attendanceStats.total > 0 ? (attendanceStats.late / attendanceStats.total) * 100 : 0} 
                  className="h-2 bg-amber-500/10" 
                />
              </div>
            </CardContent>
          </Card>

          {/* Absent Students */}
          <Card className="glass-morphism border-border/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-red-500/10 rounded-lg">
                    <XCircle className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-red-600">Absent Students</h3>
                    <p className="text-sm text-muted-foreground">Students marked absent</p>
                  </div>
                </div>
                <Badge className="bg-red-500/10 text-red-600 border-red-500/20 text-sm px-3 py-1">
                  {attendanceStats.absent}
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Absence Rate</span>
                  <span className="font-medium">
                    {attendanceStats.total > 0 ? Math.round((attendanceStats.absent / attendanceStats.total) * 100) : 0}%
                  </span>
                </div>
                <Progress 
                  value={attendanceStats.total > 0 ? (attendanceStats.absent / attendanceStats.total) * 100 : 0} 
                  className="h-2 bg-red-500/10" 
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Attendance Management Tabs */}
        <Tabs defaultValue="records" className="space-y-6">
          <TabsList className="glass-morphism border-border/30 bg-background/50">
            <TabsTrigger value="records" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <ClipboardList className="h-4 w-4 mr-2" />
              Attendance Records
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="reports" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <PieChart className="h-4 w-4 mr-2" />
              Reports
            </TabsTrigger>
          </TabsList>

          <TabsContent value="records" className="space-y-6">
            <AttendanceTable onAddAttendance={handleAddAttendance} />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Attendance Trends Chart */}
              <Card className="glass-morphism border-border/30">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-primary flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Attendance Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Attendance trend visualization</p>
                      <p className="text-sm">Would integrate with Recharts</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Daily Statistics */}
              <Card className="glass-morphism border-border/30">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-primary flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    Today's Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span className="text-sm">Present</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{attendanceStats.todayPresent}</div>
                        <div className="text-xs text-muted-foreground">
                          {todayAttendance.length > 0 ? Math.round((attendanceStats.todayPresent / todayAttendance.length) * 100) : 0}%
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                        <span className="text-sm">Late</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{attendanceStats.todayLate}</div>
                        <div className="text-xs text-muted-foreground">
                          {todayAttendance.length > 0 ? Math.round((attendanceStats.todayLate / todayAttendance.length) * 100) : 0}%
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <span className="text-sm">Absent</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{attendanceStats.todayAbsent}</div>
                        <div className="text-xs text-muted-foreground">
                          {todayAttendance.length > 0 ? Math.round((attendanceStats.todayAbsent / todayAttendance.length) * 100) : 0}%
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Quick Reports */}
              <Card className="glass-morphism border-border/30 hover:border-primary/30 transition-all duration-300 cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                      <Calendar className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Daily Report</h3>
                      <p className="text-sm text-muted-foreground">Today's attendance summary</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Generate Report
                  </Button>
                </CardContent>
              </Card>

              <Card className="glass-morphism border-border/30 hover:border-primary/30 transition-all duration-300 cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-green-500/10 rounded-lg">
                      <Users className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Student Attendance</h3>
                      <p className="text-sm text-muted-foreground">Individual attendance records</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Generate Report
                  </Button>
                </CardContent>
              </Card>

              <Card className="glass-morphism border-border/30 hover:border-primary/30 transition-all duration-300 cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-purple-500/10 rounded-lg">
                      <School className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Monthly Summary</h3>
                      <p className="text-sm text-muted-foreground">Comprehensive monthly overview</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Generate Report
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Add Attendance Dialog */}
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogContent className="glass-morphism border-border/30 max-w-md">
            <DialogHeader>
              <DialogTitle>Record Attendance</DialogTitle>
              <DialogDescription>
                Add a new attendance record for a student
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="studentId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Student</FormLabel>
                      <Select onValueChange={(value) => field.onChange(parseInt(value))}>
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
                            <SelectValue placeholder="Select attendance status" />
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
                        <Input placeholder="Add a note..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsAddModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Record Attendance</Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}