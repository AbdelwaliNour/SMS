import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { useQuery } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
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
  teacherId: z.string().min(1, "Teacher is required"),
  classroomId: z.string().min(1, "Classroom is required"),
  section: z.enum(['primary', 'intermediate', 'secondary']),
  class: z.string().min(1, "Class is required"),
});

type TimeTableFormValues = z.infer<typeof timeTableFormSchema>;

export default function TimeTable() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSection, setSelectedSection] = useState('all');
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedDay, setSelectedDay] = useState('all');
  const { toast } = useToast();
  
  // Enhanced timetable data with more subjects and teachers
  const timeTableData = [
    { id: 1, day: 'Monday', startTime: '08:00', endTime: '09:00', subject: 'Mathematics', teacher: 'Mr. Johnson', classroom: 'Room 101', section: 'primary', class: 'Three' },
    { id: 2, day: 'Monday', startTime: '09:00', endTime: '10:00', subject: 'English', teacher: 'Mrs. Smith', classroom: 'Room 102', section: 'primary', class: 'Three' },
    { id: 3, day: 'Monday', startTime: '10:00', endTime: '11:00', subject: 'Science', teacher: 'Mr. Davis', classroom: 'Room 103', section: 'primary', class: 'Three' },
    { id: 4, day: 'Tuesday', startTime: '08:00', endTime: '09:00', subject: 'Arabic', teacher: 'Mr. Ahmed', classroom: 'Room 101', section: 'primary', class: 'Three' },
    { id: 5, day: 'Tuesday', startTime: '09:00', endTime: '10:00', subject: 'Islamic Studies', teacher: 'Mr. Farooq', classroom: 'Room 102', section: 'primary', class: 'Three' },
    { id: 6, day: 'Wednesday', startTime: '08:00', endTime: '09:00', subject: 'History', teacher: 'Mrs. Brown', classroom: 'Room 104', section: 'intermediate', class: 'Seven' },
    { id: 7, day: 'Wednesday', startTime: '09:00', endTime: '10:00', subject: 'Geography', teacher: 'Mr. Wilson', classroom: 'Room 105', section: 'intermediate', class: 'Seven' },
    { id: 8, day: 'Thursday', startTime: '08:00', endTime: '09:00', subject: 'Physics', teacher: 'Dr. Thompson', classroom: 'Lab 201', section: 'secondary', class: 'Eleven' },
    { id: 9, day: 'Thursday', startTime: '09:00', endTime: '10:00', subject: 'Chemistry', teacher: 'Dr. Martin', classroom: 'Lab 202', section: 'secondary', class: 'Eleven' },
    { id: 10, day: 'Friday', startTime: '08:00', endTime: '09:00', subject: 'Physical Education', teacher: 'Coach Anderson', classroom: 'Sports Hall', section: 'primary', class: 'Four' },
  ];

  const form = useForm<TimeTableFormValues>({
    resolver: zodResolver(timeTableFormSchema),
    defaultValues: {
      day: 'Monday',
      startTime: '08:00',
      endTime: '09:00',
      subject: 'Mathematics',
      teacherId: '1',
      classroomId: '1',
      section: 'primary',
      class: 'One',
    },
  });

  const onSubmit = async (data: TimeTableFormValues) => {
    try {
      console.log('TimeTable Entry:', data);
      
      toast({
        title: 'Success',
        description: 'Timetable entry added successfully',
      });
      
      setIsAddModalOpen(false);
      form.reset();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add timetable entry',
        variant: 'destructive',
      });
    }
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const subjects = ['Mathematics', 'English', 'Science', 'Arabic', 'Islamic Studies', 'History', 'Geography', 'Physics', 'Chemistry', 'Physical Education'];
  const teachers = [
    { id: '1', name: 'Mr. Johnson' },
    { id: '2', name: 'Mrs. Smith' },
    { id: '3', name: 'Mr. Davis' },
    { id: '4', name: 'Mr. Ahmed' },
    { id: '5', name: 'Mr. Farooq' },
    { id: '6', name: 'Mrs. Brown' },
    { id: '7', name: 'Mr. Wilson' },
    { id: '8', name: 'Dr. Thompson' },
    { id: '9', name: 'Dr. Martin' },
    { id: '10', name: 'Coach Anderson' },
  ];
  const classrooms = [
    { id: '1', name: 'Room 101' },
    { id: '2', name: 'Room 102' },
    { id: '3', name: 'Room 103' },
    { id: '4', name: 'Room 104' },
    { id: '5', name: 'Room 105' },
    { id: '6', name: 'Lab 201' },
    { id: '7', name: 'Lab 202' },
    { id: '8', name: 'Sports Hall' },
  ];

  // Statistics calculations
  const totalSchedules = timeTableData.length;
  const todaySchedules = timeTableData.filter(entry => entry.day === new Date().toLocaleDateString('en-US', { weekday: 'long' })).length;
  const uniqueSubjects = Array.from(new Set(timeTableData.map(entry => entry.subject))).length;
  const primarySchedules = timeTableData.filter(entry => entry.section === 'primary').length;
  const intermediateSchedules = timeTableData.filter(entry => entry.section === 'intermediate').length;
  const secondarySchedules = timeTableData.filter(entry => entry.section === 'secondary').length;

  // Filter data based on search and filters
  const filteredData = timeTableData.filter(entry => {
    const matchesSearch = searchTerm === '' || 
      entry.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.teacher.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.classroom.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSection = selectedSection === 'all' || entry.section === selectedSection;
    const matchesClass = selectedClass === 'all' || entry.class === selectedClass;
    const matchesDay = selectedDay === 'all' || entry.day === selectedDay;
    
    return matchesSearch && matchesSection && matchesClass && matchesDay;
  });

  return (
    <Layout>
      <div className="space-y-8 p-6">
        {/* Enhanced Header */}
        <div className="glass-morphism rounded-3xl p-8 border border-border/30 bg-gradient-to-br from-teal-50/80 via-cyan-50/50 to-blue-50/80 dark:from-teal-950/30 dark:via-cyan-950/20 dark:to-blue-950/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="p-4 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl shadow-lg">
                  <Calendar className="h-8 w-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent">
                  Timetable Management
                </h1>
                <p className="flex items-center text-muted-foreground mt-2 text-lg">
                  <Clock className="h-4 w-4 text-teal-500 mr-2" />
                  <span>Organize and manage class schedules efficiently</span>
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
                <DialogContent className="max-w-4xl">
                  <DialogHeader>
                    <DialogTitle className="flex items-center">
                      <Plus className="h-5 w-5 mr-2 text-teal-600" />
                      Add New Schedule Entry
                    </DialogTitle>
                    <DialogDescription>
                      Create a new timetable entry by filling out the form below.
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
                              <FormLabel>Day of Week</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className="glass-morphism border-border/30">
                                    <SelectValue placeholder="Select day" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {days.map((day) => (
                                    <SelectItem key={day} value={day}>
                                      {day}
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
                          name="subject"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Subject</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className="glass-morphism border-border/30">
                                    <SelectValue placeholder="Select subject" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {subjects.map((subject) => (
                                    <SelectItem key={subject} value={subject}>
                                      {subject}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="startTime"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Start Time</FormLabel>
                              <FormControl>
                                <Input type="time" {...field} className="glass-morphism border-border/30" />
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
                              <FormLabel>End Time</FormLabel>
                              <FormControl>
                                <Input type="time" {...field} className="glass-morphism border-border/30" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="teacherId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Teacher</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className="glass-morphism border-border/30">
                                    <SelectValue placeholder="Select teacher" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {teachers.map((teacher) => (
                                    <SelectItem key={teacher.id} value={teacher.id}>
                                      {teacher.name}
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
                          name="classroomId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Classroom</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className="glass-morphism border-border/30">
                                    <SelectValue placeholder="Select classroom" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {classrooms.map((classroom) => (
                                    <SelectItem key={classroom.id} value={classroom.id}>
                                      {classroom.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="section"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Section</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className="glass-morphism border-border/30">
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
                          name="class"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Class</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className="glass-morphism border-border/30">
                                    <SelectValue placeholder="Select class" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="One">One</SelectItem>
                                  <SelectItem value="Two">Two</SelectItem>
                                  <SelectItem value="Three">Three</SelectItem>
                                  <SelectItem value="Four">Four</SelectItem>
                                  <SelectItem value="Five">Five</SelectItem>
                                  <SelectItem value="Six">Six</SelectItem>
                                  <SelectItem value="Seven">Seven</SelectItem>
                                  <SelectItem value="Eight">Eight</SelectItem>
                                  <SelectItem value="Nine">Nine</SelectItem>
                                  <SelectItem value="Ten">Ten</SelectItem>
                                  <SelectItem value="Eleven">Eleven</SelectItem>
                                  <SelectItem value="Twelve">Twelve</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="flex justify-end space-x-3 pt-6">
                        <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit" className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Schedule
                        </Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="glass-morphism border-border/30 bg-gradient-to-br from-teal-50/50 to-cyan-50/30 dark:from-teal-950/20 dark:to-cyan-950/10 hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Schedules</p>
                  <p className="text-3xl font-bold text-teal-600">{totalSchedules}</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full dark:bg-green-900/20">+12%</span>
                  </div>
                </div>
                <div className="p-3 bg-teal-100 rounded-2xl dark:bg-teal-900/20">
                  <Calendar className="h-6 w-6 text-teal-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-morphism border-border/30 bg-gradient-to-br from-cyan-50/50 to-blue-50/30 dark:from-cyan-950/20 dark:to-blue-950/10 hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Today's Classes</p>
                  <p className="text-3xl font-bold text-cyan-600">{todaySchedules}</p>
                  <div className="flex items-center mt-2">
                    <ArrowUpRight className="h-4 w-4 text-blue-500 mr-1" />
                    <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full dark:bg-blue-900/20">Active</span>
                  </div>
                </div>
                <div className="p-3 bg-cyan-100 rounded-2xl dark:bg-cyan-900/20">
                  <Clock className="h-6 w-6 text-cyan-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-morphism border-border/30 bg-gradient-to-br from-blue-50/50 to-indigo-50/30 dark:from-blue-950/20 dark:to-indigo-950/10 hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Subjects</p>
                  <p className="text-3xl font-bold text-blue-600">{uniqueSubjects}</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full dark:bg-green-900/20">+2 new</span>
                  </div>
                </div>
                <div className="p-3 bg-blue-100 rounded-2xl dark:bg-blue-900/20">
                  <BookOpen className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-morphism border-border/30 bg-gradient-to-br from-indigo-50/50 to-purple-50/30 dark:from-indigo-950/20 dark:to-purple-950/10 hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Teachers</p>
                  <p className="text-3xl font-bold text-indigo-600">{teachers.length}</p>
                  <div className="flex items-center mt-2">
                    <ArrowUpRight className="h-4 w-4 text-purple-500 mr-1" />
                    <span className="text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded-full dark:bg-purple-900/20">Available</span>
                  </div>
                </div>
                <div className="p-3 bg-indigo-100 rounded-2xl dark:bg-indigo-900/20">
                  <Users className="h-6 w-6 text-indigo-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Section Distribution Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="glass-morphism border-border/30 hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-teal-700 dark:text-teal-300 text-[25px]">Primary Classes</h3>
                <div className="flex items-center">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full dark:bg-green-900/20">+8%</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-teal-600">{primarySchedules}</span>
                  <span className="text-sm text-muted-foreground">schedules</span>
                </div>
                <Progress value={(primarySchedules / totalSchedules) * 100} className="h-3 bg-teal-100 dark:bg-teal-900/20" />
                <p className="text-sm text-muted-foreground">
                  {Math.round((primarySchedules / totalSchedules) * 100)}% of total schedules
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-morphism border-border/30 hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-cyan-700 dark:text-cyan-300 text-[25px]">Intermediate Classes</h3>
                <div className="flex items-center">
                  <ArrowUpRight className="h-4 w-4 text-blue-500 mr-1" />
                  <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full dark:bg-blue-900/20">+5%</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-cyan-600">{intermediateSchedules}</span>
                  <span className="text-sm text-muted-foreground">schedules</span>
                </div>
                <Progress value={(intermediateSchedules / totalSchedules) * 100} className="h-3 bg-cyan-100 dark:bg-cyan-900/20" />
                <p className="text-sm text-muted-foreground">
                  {Math.round((intermediateSchedules / totalSchedules) * 100)}% of total schedules
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-morphism border-border/30 hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-blue-700 dark:text-blue-300 text-[25px]">Secondary Classes</h3>
                <div className="flex items-center">
                  <TrendingUp className="h-4 w-4 text-indigo-500 mr-1" />
                  <span className="text-xs text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full dark:bg-indigo-900/20">+15%</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-blue-600">{secondarySchedules}</span>
                  <span className="text-sm text-muted-foreground">schedules</span>
                </div>
                <Progress value={(secondarySchedules / totalSchedules) * 100} className="h-3 bg-blue-100 dark:bg-blue-900/20" />
                <p className="text-sm text-muted-foreground">
                  {Math.round((secondarySchedules / totalSchedules) * 100)}% of total schedules
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="schedules" className="space-y-6">
          <TabsList className="glass-morphism border-border/30 p-1 text-white">
            <TabsTrigger value="schedules" className="data-[state=active]:bg-teal-100 data-[state=active]:text-teal-700 dark:data-[state=active]:bg-teal-900/30">
              Schedules
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-cyan-100 data-[state=active]:text-cyan-700 dark:data-[state=active]:bg-cyan-900/30">
              Analytics
            </TabsTrigger>
            <TabsTrigger value="reports" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 dark:data-[state=active]:bg-blue-900/30">
              Reports
            </TabsTrigger>
          </TabsList>

          <TabsContent value="schedules" className="space-y-6">
            {/* Search and Filter Controls */}
            <Card className="glass-morphism border-border/30">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search by subject, teacher, or classroom..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 glass-morphism border-border/30"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Select value={selectedSection} onValueChange={setSelectedSection}>
                      <SelectTrigger className="w-40 glass-morphism border-border/30">
                        <SelectValue placeholder="Section" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Sections</SelectItem>
                        <SelectItem value="primary">Primary</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="secondary">Secondary</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={selectedClass} onValueChange={setSelectedClass}>
                      <SelectTrigger className="w-32 glass-morphism border-border/30">
                        <SelectValue placeholder="Class" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Classes</SelectItem>
                        <SelectItem value="One">One</SelectItem>
                        <SelectItem value="Two">Two</SelectItem>
                        <SelectItem value="Three">Three</SelectItem>
                        <SelectItem value="Four">Four</SelectItem>
                        <SelectItem value="Five">Five</SelectItem>
                        <SelectItem value="Six">Six</SelectItem>
                        <SelectItem value="Seven">Seven</SelectItem>
                        <SelectItem value="Eight">Eight</SelectItem>
                        <SelectItem value="Nine">Nine</SelectItem>
                        <SelectItem value="Ten">Ten</SelectItem>
                        <SelectItem value="Eleven">Eleven</SelectItem>
                        <SelectItem value="Twelve">Twelve</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={selectedDay} onValueChange={setSelectedDay}>
                      <SelectTrigger className="w-32 glass-morphism border-border/30">
                        <SelectValue placeholder="Day" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Days</SelectItem>
                        {days.map((day) => (
                          <SelectItem key={day} value={day}>{day}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Timetable Cards */}
            <div className="grid gap-4">
              {filteredData.length === 0 ? (
                <Card className="glass-morphism border-border/30">
                  <CardContent className="p-12 text-center">
                    <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-muted-foreground mb-2">No schedules found</h3>
                    <p className="text-muted-foreground mb-4">No schedules match your current filters.</p>
                    <Button 
                      onClick={() => setIsAddModalOpen(true)}
                      className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add First Schedule
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                filteredData.map((schedule) => (
                  <Card key={schedule.id} className="glass-morphism border-border/30 hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="p-3 bg-gradient-to-br from-teal-100 to-cyan-100 dark:from-teal-900/20 dark:to-cyan-900/20 rounded-xl">
                            <BookOpen className="h-6 w-6 text-teal-600" />
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center space-x-3">
                              <h3 className="text-lg font-semibold">{schedule.subject}</h3>
                              <div className="flex items-center space-x-2">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  schedule.section === 'primary' ? 'bg-teal-100 text-teal-700 dark:bg-teal-900/20' :
                                  schedule.section === 'intermediate' ? 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/20' :
                                  'bg-blue-100 text-blue-700 dark:bg-blue-900/20'
                                }`}>
                                  {schedule.section === 'primary' ? 'Primary' : 
                                   schedule.section === 'intermediate' ? 'Intermediate' : 'Secondary'}
                                </span>
                                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-xs font-medium">
                                  Class {schedule.class}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                              <span className="flex items-center">
                                <Calendar className="h-4 w-4 mr-1" />
                                {schedule.day}
                              </span>
                              <span className="flex items-center">
                                <Clock className="h-4 w-4 mr-1" />
                                {schedule.startTime} - {schedule.endTime}
                              </span>
                              <span className="flex items-center">
                                <Users className="h-4 w-4 mr-1" />
                                {schedule.teacher}
                              </span>
                              <span>{schedule.classroom}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm" className="hover:bg-teal-50 hover:border-teal-200 dark:hover:bg-teal-900/20 dark:hover:border-teal-700 transition-colors">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="hover:bg-red-50 hover:border-red-200 dark:hover:bg-red-900/20 dark:hover:border-red-700 transition-colors">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card className="glass-morphism border-border/30">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-teal-600" />
                  Schedule Analytics
                </CardTitle>
                <CardDescription>Comprehensive insights into schedule distribution and usage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-muted-foreground mb-2">Analytics Dashboard</h3>
                  <p className="text-muted-foreground">Advanced analytics and charts will be available here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <Card className="glass-morphism border-border/30">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Download className="h-5 w-5 mr-2 text-teal-600" />
                  Schedule Reports
                </CardTitle>
                <CardDescription>Generate and export comprehensive schedule reports</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-muted-foreground mb-2">Report Generation</h3>
                  <p className="text-muted-foreground">Schedule reports and export options will be available here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>


      </div>
    </Layout>
  );
}