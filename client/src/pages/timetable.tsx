import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import type { Schedule, Employee, Classroom } from '@shared/schema';
import { 
  Calendar, 
  Clock, 
  BookOpen, 
  Users, 
  Plus, 
  Download, 
  Search,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Edit,
  Trash2
} from 'lucide-react';

// Form schema for time table entries
const timeTableFormSchema = z.object({
  day: z.string().min(1, "Day is required"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  subject: z.string().min(1, "Subject is required"),
  teacherName: z.string().min(1, "Teacher name is required"),
  classroomName: z.string().min(1, "Classroom name is required"),
  section: z.enum(['primary', 'intermediate', 'secondary']),
  class: z.string().min(1, "Class is required"),
  notes: z.string().optional(),
});

type TimeTableFormValues = z.infer<typeof timeTableFormSchema>;

export default function TimeTable() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSection, setSelectedSection] = useState('all');
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedDay, setSelectedDay] = useState('all');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch schedules from API
  const { data: schedules = [], isLoading: schedulesLoading } = useQuery<Schedule[]>({
    queryKey: ['/api/schedules'],
  });

  // Fetch employees for teacher dropdown
  const { data: employees = [], isLoading: employeesLoading } = useQuery<Employee[]>({
    queryKey: ['/api/employees'],
  });

  // Fetch classrooms for classroom dropdown
  const { data: classrooms = [], isLoading: classroomsLoading } = useQuery<Classroom[]>({
    queryKey: ['/api/classrooms'],
  });

  // Create schedule mutation
  const createScheduleMutation = useMutation({
    mutationFn: async (scheduleData: any) => {
      const response = await apiRequest('POST', '/api/schedules', scheduleData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/schedules'] });
      toast({
        title: 'Success',
        description: 'Schedule created successfully',
      });
      setIsAddModalOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create schedule',
        variant: 'destructive',
      });
    },
  });

  // Update schedule mutation
  const updateScheduleMutation = useMutation({
    mutationFn: async ({ id, ...scheduleData }: any) => {
      const response = await apiRequest('PATCH', `/api/schedules/${id}`, scheduleData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/schedules'] });
      toast({
        title: 'Success',
        description: 'Schedule updated successfully',
      });
      setIsEditModalOpen(false);
      setEditingSchedule(null);
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update schedule',
        variant: 'destructive',
      });
    },
  });

  // Delete schedule mutation
  const deleteScheduleMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/schedules/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/schedules'] });
      toast({
        title: 'Success',
        description: 'Schedule deleted successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete schedule',
        variant: 'destructive',
      });
    },
  });

  const form = useForm<TimeTableFormValues>({
    resolver: zodResolver(timeTableFormSchema),
    defaultValues: {
      day: 'Monday',
      startTime: '08:00',
      endTime: '09:00',
      subject: 'Mathematics',
      teacherName: '',
      classroomName: '',
      section: 'primary',
      class: 'One',
      notes: '',
    },
  });

  const onSubmit = async (data: TimeTableFormValues) => {
    try {
      createScheduleMutation.mutate(data);
      form.reset();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add timetable entry',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (schedule: Schedule) => {
    setEditingSchedule(schedule);
    form.reset({
      day: schedule.day,
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      subject: schedule.subject,
      teacherName: schedule.teacherName,
      classroomName: schedule.classroomName,
      section: schedule.section,
      class: schedule.class,
      notes: schedule.notes || '',
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (data: TimeTableFormValues) => {
    if (!editingSchedule) return;
    try {
      updateScheduleMutation.mutate({ id: editingSchedule.id, ...data });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update timetable entry',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (scheduleId: number) => {
    if (confirm('Are you sure you want to delete this schedule?')) {
      deleteScheduleMutation.mutate(scheduleId);
    }
  };

  // Calculate statistics
  const totalSchedules = schedules.length;
  const sectionCounts = {
    primary: schedules.filter(s => s.section === 'primary').length,
    intermediate: schedules.filter(s => s.section === 'intermediate').length,
    secondary: schedules.filter(s => s.section === 'secondary').length,
  };

  // Filter schedules based on search and filters
  const filteredSchedules = schedules.filter(schedule => {
    const matchesSearch = searchTerm === '' || 
      schedule.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      schedule.teacherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      schedule.classroomName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      schedule.class.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSection = selectedSection === 'all' || schedule.section === selectedSection;
    const matchesClass = selectedClass === 'all' || schedule.class === selectedClass;
    const matchesDay = selectedDay === 'all' || schedule.day === selectedDay;
    
    return matchesSearch && matchesSection && matchesClass && matchesDay;
  });

  if (schedulesLoading) {
    return (
      <Layout>
        <div className="h-screen flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" aria-label="Loading"/>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-teal-500 via-cyan-500 to-blue-500 flex items-center justify-center shadow-lg">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent">
                Timetable Management
              </h1>
              <p className="text-muted-foreground flex items-center space-x-2">
                <Clock className="h-4 w-4 text-teal-500" />
                <span>Manage class schedules and academic timetables efficiently</span>
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm" className="hover:bg-teal-50 hover:border-teal-200 dark:hover:bg-teal-900/20 dark:hover:border-teal-700 transition-all duration-200">
              <Download className="h-4 w-4 mr-2" />
              Export Schedule
            </Button>
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 hover:from-teal-600 hover:via-cyan-600 hover:to-blue-600 shadow-lg transition-all duration-200">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Schedule
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto backdrop-blur-xl bg-white/95 dark:bg-gray-900/95 border border-white/20 shadow-2xl">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                    Add New Schedule
                  </DialogTitle>
                  <DialogDescription className="text-gray-600 dark:text-gray-400">
                    Create a new class schedule entry with all required details.
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="day"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-semibold text-gray-700 dark:text-gray-300">Day</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-11 bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500">
                                  <SelectValue placeholder="Select a day" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Monday">Monday</SelectItem>
                                <SelectItem value="Tuesday">Tuesday</SelectItem>
                                <SelectItem value="Wednesday">Wednesday</SelectItem>
                                <SelectItem value="Thursday">Thursday</SelectItem>
                                <SelectItem value="Friday">Friday</SelectItem>
                                <SelectItem value="Saturday">Saturday</SelectItem>
                                <SelectItem value="Sunday">Sunday</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="section"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-semibold text-gray-700 dark:text-gray-300">Section</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-11 bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500">
                                  <SelectValue placeholder="Select section" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="primary">Primary</SelectItem>
                                <SelectItem value="intermediate">Intermediate</SelectItem>
                                <SelectItem value="secondary">Secondary</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="startTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-semibold text-gray-700 dark:text-gray-300">Start Time</FormLabel>
                            <FormControl>
                              <Input 
                                type="time" 
                                {...field} 
                                className="h-11 bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="endTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-semibold text-gray-700 dark:text-gray-300">End Time</FormLabel>
                            <FormControl>
                              <Input 
                                type="time" 
                                {...field} 
                                className="h-11 bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="subject"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-semibold text-gray-700 dark:text-gray-300">Subject</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="e.g., Mathematics, English, Science" 
                                {...field} 
                                className="h-11 bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="class"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-semibold text-gray-700 dark:text-gray-300">Class</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="e.g., Grade 1, Grade 5, Class 10" 
                                {...field} 
                                className="h-11 bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="teacherName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-semibold text-gray-700 dark:text-gray-300">Teacher Name</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="e.g., Dr. Smith, Mrs. Johnson" 
                                {...field} 
                                className="h-11 bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="classroomName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-semibold text-gray-700 dark:text-gray-300">Classroom</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="e.g., Room 101, Lab A, Library" 
                                {...field} 
                                className="h-11 bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold text-gray-700 dark:text-gray-300">Notes (Optional)</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Additional notes or special instructions..." 
                              className="bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 min-h-[80px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setIsAddModalOpen(false)}
                        disabled={createScheduleMutation.isPending}
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="submit"
                        disabled={createScheduleMutation.isPending}
                        className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white"
                      >
                        {createScheduleMutation.isPending ? 'Adding...' : 'Add Schedule'}
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="glass-morphism border-border/30 hover:border-teal-300/50 transition-all duration-300 hover:shadow-xl hover:shadow-teal-100/20 hover:-translate-y-1">
            <CardContent className="p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-teal-400/10 to-teal-600/10 rounded-full -translate-y-8 translate-x-8"></div>
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <Calendar className="h-4 w-4 text-teal-600" />
                    <Badge variant="secondary" className="bg-teal-100/80 text-teal-700 border-teal-200/50 dark:bg-teal-900/30 dark:text-teal-300 dark:border-teal-700/50">
                      Active
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">Total Schedules</p>
                  <div className="flex items-baseline space-x-2 mt-1">
                    <h3 className="text-2xl font-bold">{totalSchedules}</h3>
                    <span className="text-xs text-green-600 flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +12%
                    </span>
                  </div>
                </div>
                <div className="p-3 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl shadow-lg">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-morphism border-border/30 hover:border-cyan-300/50 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-100/20 hover:-translate-y-1">
            <CardContent className="p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-cyan-400/10 to-cyan-600/10 rounded-full -translate-y-8 translate-x-8"></div>
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <Users className="h-4 w-4 text-cyan-600" />
                    <Badge variant="secondary" className="bg-cyan-100/80 text-cyan-700 border-cyan-200/50 dark:bg-cyan-900/30 dark:text-cyan-300 dark:border-cyan-700/50">
                      Primary
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">Primary Section</p>
                  <div className="flex items-baseline space-x-2 mt-1">
                    <h3 className="text-2xl font-bold">{sectionCounts.primary}</h3>
                    <Progress value={(sectionCounts.primary / totalSchedules) * 100 || 0} className="w-16 h-2" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {totalSchedules > 0 ? Math.round((sectionCounts.primary / totalSchedules) * 100) : 0}% of total
                  </p>
                </div>
                <div className="p-3 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl shadow-lg">
                  <Users className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-morphism border-border/30 hover:border-blue-300/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-100/20 hover:-translate-y-1">
            <CardContent className="p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-400/10 to-blue-600/10 rounded-full -translate-y-8 translate-x-8"></div>
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <BookOpen className="h-4 w-4 text-blue-600" />
                    <Badge variant="secondary" className="bg-blue-100/80 text-blue-700 border-blue-200/50 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700/50">
                      Intermediate
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">Intermediate Section</p>
                  <div className="flex items-baseline space-x-2 mt-1">
                    <h3 className="text-2xl font-bold">{sectionCounts.intermediate}</h3>
                    <Progress value={(sectionCounts.intermediate / totalSchedules) * 100 || 0} className="w-16 h-2" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {totalSchedules > 0 ? Math.round((sectionCounts.intermediate / totalSchedules) * 100) : 0}% of total
                  </p>
                </div>
                <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-morphism border-border/30 hover:border-indigo-300/50 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-100/20 hover:-translate-y-1">
            <CardContent className="p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-indigo-400/10 to-indigo-600/10 rounded-full -translate-y-8 translate-x-8"></div>
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <Clock className="h-4 w-4 text-indigo-600" />
                    <Badge variant="secondary" className="bg-indigo-100/80 text-indigo-700 border-indigo-200/50 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-700/50">
                      Secondary
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">Secondary Section</p>
                  <div className="flex items-baseline space-x-2 mt-1">
                    <h3 className="text-2xl font-bold">{sectionCounts.secondary}</h3>
                    <Progress value={(sectionCounts.secondary / totalSchedules) * 100 || 0} className="w-16 h-2" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {totalSchedules > 0 ? Math.round((sectionCounts.secondary / totalSchedules) * 100) : 0}% of total
                  </p>
                </div>
                <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
                  <Clock className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="schedules" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border border-white/20">
            <TabsTrigger value="schedules" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white">
              Schedules
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white">
              Analytics
            </TabsTrigger>
            <TabsTrigger value="reports" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white">
              Reports
            </TabsTrigger>
          </TabsList>

          <TabsContent value="schedules" className="space-y-6">
            {/* Search and Filters */}
            <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-900/90 border-white/20 shadow-xl">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Search & Filter</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search by subject, teacher, classroom, or class..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Select value={selectedSection} onValueChange={setSelectedSection}>
                      <SelectTrigger className="w-[140px] bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700">
                        <SelectValue placeholder="Section" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Sections</SelectItem>
                        <SelectItem value="primary">Primary</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="secondary">Secondary</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={selectedDay} onValueChange={setSelectedDay}>
                      <SelectTrigger className="w-[120px] bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700">
                        <SelectValue placeholder="Day" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Days</SelectItem>
                        <SelectItem value="Monday">Monday</SelectItem>
                        <SelectItem value="Tuesday">Tuesday</SelectItem>
                        <SelectItem value="Wednesday">Wednesday</SelectItem>
                        <SelectItem value="Thursday">Thursday</SelectItem>
                        <SelectItem value="Friday">Friday</SelectItem>
                        <SelectItem value="Saturday">Saturday</SelectItem>
                        <SelectItem value="Sunday">Sunday</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Schedules Cards */}
            <div className="space-y-6">
              {filteredSchedules.length === 0 ? (
                <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-900/90 border-white/20 shadow-xl">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Calendar className="h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">No schedules found</h3>
                    <p className="text-gray-500 text-center mb-4">
                      {schedules.length === 0 
                        ? "Get started by creating your first schedule entry."
                        : "Try adjusting your search or filter criteria."
                      }
                    </p>
                    {schedules.length === 0 && (
                      <Button 
                        onClick={() => setIsAddModalOpen(true)}
                        className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add First Schedule
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredSchedules.map((schedule) => (
                    <Card key={schedule.id} className="relative overflow-hidden backdrop-blur-sm bg-white/90 dark:bg-gray-900/90 border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 group">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                                schedule.section === 'primary' 
                                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                                  : schedule.section === 'intermediate'
                                  ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'
                                  : 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                              }`}>
                                {schedule.section}
                              </div>
                              <div className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                                {schedule.day}
                              </div>
                            </div>
                            <CardTitle className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">
                              {schedule.subject}
                            </CardTitle>
                            <CardDescription className="text-sm text-gray-600 dark:text-gray-400">
                              Class {schedule.class} • {schedule.startTime} - {schedule.endTime}
                            </CardDescription>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(schedule)}
                              className="h-8 w-8 p-0 text-gray-400 hover:text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-900/20"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(schedule.id)}
                              className="h-8 w-8 p-0 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <Users className="h-4 w-4" />
                            <span>{schedule.teacherName}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <BookOpen className="h-4 w-4" />
                            <span>{schedule.classroomName}</span>
                          </div>
                          {schedule.notes && (
                            <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {schedule.notes}
                              </p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                      <div className={`absolute inset-x-0 bottom-0 h-1 ${
                        schedule.section === 'primary' 
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                          : schedule.section === 'intermediate'
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500'
                          : 'bg-gradient-to-r from-purple-500 to-violet-500'
                      }`}></div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-900/90 border-white/20 shadow-xl">
              <CardHeader>
                <CardTitle>Schedule Analytics</CardTitle>
                <CardDescription>Insights and statistics about your timetable data</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">
                  Analytics dashboard coming soon with detailed insights about schedule distribution, 
                  teacher workload, and classroom utilization.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-900/90 border-white/20 shadow-xl">
              <CardHeader>
                <CardTitle>Schedule Reports</CardTitle>
                <CardDescription>Generate and export various timetable reports</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">
                  Report generation features coming soon including weekly schedules, 
                  teacher timetables, and classroom booking reports.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Edit Schedule Dialog */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto backdrop-blur-xl bg-white/95 dark:bg-gray-900/95 border border-white/20 shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                Edit Schedule
              </DialogTitle>
              <DialogDescription className="text-gray-600 dark:text-gray-400">
                Update the schedule details below.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleEditSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="day"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold text-gray-700 dark:text-gray-300">Day</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-11 bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500">
                              <SelectValue placeholder="Select a day" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Monday">Monday</SelectItem>
                            <SelectItem value="Tuesday">Tuesday</SelectItem>
                            <SelectItem value="Wednesday">Wednesday</SelectItem>
                            <SelectItem value="Thursday">Thursday</SelectItem>
                            <SelectItem value="Friday">Friday</SelectItem>
                            <SelectItem value="Saturday">Saturday</SelectItem>
                            <SelectItem value="Sunday">Sunday</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="section"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold text-gray-700 dark:text-gray-300">Section</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-11 bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500">
                              <SelectValue placeholder="Select section" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="primary">Primary</SelectItem>
                            <SelectItem value="intermediate">Intermediate</SelectItem>
                            <SelectItem value="secondary">Secondary</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="startTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold text-gray-700 dark:text-gray-300">Start Time</FormLabel>
                        <FormControl>
                          <Input 
                            type="time" 
                            {...field} 
                            className="h-11 bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="endTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold text-gray-700 dark:text-gray-300">End Time</FormLabel>
                        <FormControl>
                          <Input 
                            type="time" 
                            {...field} 
                            className="h-11 bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold text-gray-700 dark:text-gray-300">Subject</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g., Mathematics, English, Science" 
                            {...field} 
                            className="h-11 bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="class"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold text-gray-700 dark:text-gray-300">Class</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g., Grade 1, Grade 5, Class 10" 
                            {...field} 
                            className="h-11 bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="teacherName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold text-gray-700 dark:text-gray-300">Teacher Name</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g., Dr. Smith, Mrs. Johnson" 
                            {...field} 
                            className="h-11 bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="classroomName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold text-gray-700 dark:text-gray-300">Classroom</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g., Room 101, Lab A, Library" 
                            {...field} 
                            className="h-11 bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-gray-700 dark:text-gray-300">Notes (Optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Additional notes or special instructions..." 
                          className="bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 min-h-[80px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setIsEditModalOpen(false);
                      setEditingSchedule(null);
                    }}
                    disabled={updateScheduleMutation.isPending}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    disabled={updateScheduleMutation.isPending}
                    className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white"
                  >
                    {updateScheduleMutation.isPending ? 'Updating...' : 'Update Schedule'}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}