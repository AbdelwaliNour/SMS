import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { useQuery } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';

// Form schema for time table entries
const timeTableFormSchema = z.object({
  day: z.string().min(1, "Day is required"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  subject: z.string().min(1, "Subject is required"),
  teacherId: z.string().min(1, "Teacher is required"),
  classroomId: z.string().min(1, "Classroom is required"),
  section: z.enum(['primary', 'secondary', 'highschool']),
  class: z.string().min(1, "Class is required"),
});

type TimeTableFormValues = z.infer<typeof timeTableFormSchema>;

export default function TimeTable() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { toast } = useToast();
  
  // Fake time table data for display
  const timeTableData = [
    { 
      id: 1, 
      day: 'Monday', 
      startTime: '08:00', 
      endTime: '09:00', 
      subject: 'Mathematics', 
      teacher: 'Mr. Johnson',
      classroom: 'Room 101',
      section: 'primary',
      class: 'Three'
    },
    { 
      id: 2, 
      day: 'Monday', 
      startTime: '09:00', 
      endTime: '10:00', 
      subject: 'English', 
      teacher: 'Mrs. Smith',
      classroom: 'Room 102',
      section: 'primary',
      class: 'Three'
    },
    { 
      id: 3, 
      day: 'Monday', 
      startTime: '10:00', 
      endTime: '11:00', 
      subject: 'Science', 
      teacher: 'Mr. Davis',
      classroom: 'Room 103',
      section: 'primary',
      class: 'Three'
    },
    { 
      id: 4, 
      day: 'Tuesday', 
      startTime: '08:00', 
      endTime: '09:00', 
      subject: 'Arabic', 
      teacher: 'Mr. Ahmed',
      classroom: 'Room 101',
      section: 'primary',
      class: 'Three'
    },
    { 
      id: 5, 
      day: 'Tuesday', 
      startTime: '09:00', 
      endTime: '10:00', 
      subject: 'Islamic', 
      teacher: 'Mr. Farooq',
      classroom: 'Room 102',
      section: 'primary',
      class: 'Three'
    },
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
      // Simulating API request
      console.log('TimeTable Entry:', data);
      
      toast({
        title: 'Success',
        description: 'Time table entry added successfully',
      });
      
      setIsAddModalOpen(false);
      form.reset();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add time table entry',
        variant: 'destructive',
      });
    }
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const subjects = ['Mathematics', 'English', 'Science', 'Arabic', 'Islamic', 'Somali', 'ICT', 'Social'];
  const teachers = [
    { id: '1', name: 'Mr. Johnson' },
    { id: '2', name: 'Mrs. Smith' },
    { id: '3', name: 'Mr. Davis' },
    { id: '4', name: 'Mr. Ahmed' },
    { id: '5', name: 'Mr. Farooq' },
  ];
  const classrooms = [
    { id: '1', name: 'Room 101' },
    { id: '2', name: 'Room 102' },
    { id: '3', name: 'Room 103' },
    { id: '4', name: 'Room 104' },
    { id: '5', name: 'Room 105' },
  ];

  // Group time table entries by day
  const groupedByDay = timeTableData.reduce((acc, entry) => {
    if (!acc[entry.day]) {
      acc[entry.day] = [];
    }
    acc[entry.day].push(entry);
    return acc;
  }, {} as Record<string, typeof timeTableData>);

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-homenaje">Time Table Management</h1>
        
        {/* Add Time Table Entry Button */}
        <div className="flex justify-end mb-4">
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button 
                className="bg-blue hover:bg-blue/90 text-white"
                onClick={() => setIsAddModalOpen(true)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Time Table Entry
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Time Table Entry</DialogTitle>
                <DialogDescription>
                  Create a new time table entry by filling out the form below.
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="day"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-black">Day</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
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
                          <FormLabel className="text-black">Subject</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
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
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="startTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-black">Start Time</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} />
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
                          <FormLabel className="text-black">End Time</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="teacherId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-black">Teacher</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
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
                          <FormLabel className="text-black">Classroom</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
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
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="section"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-black">Section</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select section" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="primary">Primary</SelectItem>
                              <SelectItem value="secondary">Secondary</SelectItem>
                              <SelectItem value="highschool">High School</SelectItem>
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
                          <FormLabel className="text-black">Class</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
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
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex justify-end space-x-2 pt-4">
                    <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-blue hover:bg-blue/90 text-white">
                      Add Entry
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
        
        {/* Time Table Display */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow mb-6">
          <div className="p-4 border-b border-divider dark:border-gray-700">
            <h2 className="text-lg font-homenaje text-gray-800 dark:text-gray-200">Weekly Time Table</h2>
          </div>
          
          <div className="p-4">
            {/* Filter Controls */}
            <div className="mb-4 flex space-x-4">
              <div className="w-1/4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Section</label>
                <Select defaultValue="primary">
                  <SelectTrigger>
                    <SelectValue placeholder="Select section" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="primary">Primary</SelectItem>
                    <SelectItem value="secondary">Secondary</SelectItem>
                    <SelectItem value="highschool">High School</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-1/4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Class</label>
                <Select defaultValue="Three">
                  <SelectTrigger>
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="One">One</SelectItem>
                    <SelectItem value="Two">Two</SelectItem>
                    <SelectItem value="Three">Three</SelectItem>
                    <SelectItem value="Four">Four</SelectItem>
                    <SelectItem value="Five">Five</SelectItem>
                    <SelectItem value="Six">Six</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Time Table Grid */}
            <div className="space-y-6">
              {Object.entries(groupedByDay).map(([day, entries]) => (
                <div key={day} className="border border-divider dark:border-gray-700 rounded-lg overflow-hidden">
                  <div className="bg-blue text-white py-2 px-4 font-semibold">
                    {day}
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                          <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Time</th>
                          <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Subject</th>
                          <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Teacher</th>
                          <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Classroom</th>
                          <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {entries.map((entry) => (
                          <tr key={entry.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                            <td className="py-3 px-4 text-sm text-gray-700 dark:text-gray-300">
                              {entry.startTime} - {entry.endTime}
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-700 dark:text-gray-300 font-medium">
                              {entry.subject}
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-700 dark:text-gray-300">
                              {entry.teacher}
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-700 dark:text-gray-300">
                              {entry.classroom}
                            </td>
                            <td className="py-3 px-4 text-sm">
                              <div className="flex space-x-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-blue"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-red"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}