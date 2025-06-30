import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { useQuery } from '@tanstack/react-query';
import StatCard from '@/components/dashboard/StatCard';
import ResultsTable from '@/components/results/ResultsTable';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';

const examFormSchema = z.object({
  name: z.string().min(1, "Exam name is required"),
  section: z.enum(['primary', 'secondary', 'highschool']),
  class: z.string().min(1, "Class is required"),
  date: z.string().min(1, "Date is required"),
  subjects: z.array(z.string()).min(1, "At least one subject must be selected"),
});

type ExamFormValues = z.infer<typeof examFormSchema>;

export default function Exams() {
  const [isAddExamModalOpen, setIsAddExamModalOpen] = useState(false);
  const { toast } = useToast();
  const { data: stats, isLoading } = useQuery({
    queryKey: ['/api/stats'],
  });

  const subjects = [
    { id: "Arabic", label: "Arabic" },
    { id: "English", label: "English" },
    { id: "Islamic", label: "Islamic" },
    { id: "Somali", label: "Somali" },
    { id: "Math", label: "Math" },
    { id: "Science", label: "Science" },
    { id: "ICT", label: "ICT" },
    { id: "Socail", label: "Social" },
  ];

  const form = useForm<ExamFormValues>({
    resolver: zodResolver(examFormSchema),
    defaultValues: {
      name: '',
      section: 'primary',
      class: 'One',
      date: new Date().toISOString().split('T')[0],
      subjects: [],
    },
  });

  const onSubmit = async (data: ExamFormValues) => {
    try {
      await apiRequest('POST', '/api/exams', data);
      toast({
        title: 'Success',
        description: 'Exam created successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/exams'] });
      setIsAddExamModalOpen(false);
      form.reset();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create exam',
        variant: 'destructive',
      });
    }
  };

  const handleAddResult = () => {
    // This is handled inside the ResultsTable component
  };

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-homenaje">Exams & Results Management</h1>
        
        {/* Exam Statistics */}
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
              label: "Sections",
              value: isLoading ? "..." : stats?.classrooms?.sections || 3
            }}
            stat2={{
              label: "Students",
              value: isLoading ? "..." : stats?.students?.total || 750
            }}
          />
          
          <StatCard
            title="EXAMS"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            }
            stat1={{
              label: "Subjects",
              value: isLoading ? "..." : stats?.exams?.subjects || 10
            }}
            stat2={{
              label: "Types",
              value: isLoading ? "..." : stats?.exams?.types || 2
            }}
          />
          
          <StatCard
            title="RESOULT"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            }
            stat1={{
              label: "Highest",
              value: isLoading ? "..." : `${stats?.exams?.highestScore || 99.50}%`
            }}
            stat2={{
              label: "Lowest",
              value: isLoading ? "..." : `${stats?.exams?.lowestScore || 65.55}%`
            }}
          />
        </div>
        
        {/* Create Exam Button */}
        <div className="flex justify-end mb-4">
          <Dialog open={isAddExamModalOpen} onOpenChange={setIsAddExamModalOpen}>
            <DialogTrigger asChild>
              <Button 
                className="bg-green hover:bg-green/90 text-white"
                onClick={() => setIsAddExamModalOpen(true)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Create New Exam
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Exam</DialogTitle>
                <DialogDescription>
                  Create a new exam by specifying the details below.
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Exam Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Midterm Exam 2023" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="section"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Section</FormLabel>
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
                          <FormLabel>Class</FormLabel>
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
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Exam Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="subjects"
                    render={() => (
                      <FormItem>
                        <FormLabel>Subjects</FormLabel>
                        <div className="grid grid-cols-4 gap-2 mt-1">
                          {subjects.map((subject) => (
                            <FormField
                              key={subject.id}
                              control={form.control}
                              name="subjects"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={subject.id}
                                    className="flex flex-row items-start space-x-2 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(subject.id)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...field.value || [], subject.id])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) => value !== subject.id
                                                )
                                              )
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="text-sm font-normal">
                                      {subject.label}
                                    </FormLabel>
                                  </FormItem>
                                )
                              }}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end space-x-2 pt-4">
                    <Button type="button" variant="outline" onClick={() => setIsAddExamModalOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-blue hover:bg-blue/90 text-white">
                      Create Exam
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
        
        {/* Results Table */}
        <ResultsTable onAddResult={handleAddResult} />
      </div>
    </Layout>
  );
}
