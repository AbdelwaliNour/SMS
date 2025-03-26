import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DataTable } from '@/components/ui/data-table';
import { Result, Student, Exam } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { ColumnDef } from '@tanstack/react-table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import FilterSelect from '@/components/ui/filter-select';
import { calculateGrade } from '@/lib/utils';

interface ResultsTableProps {
  onAddResult: () => void;
}

const resultFormSchema = z.object({
  examId: z.number({
    required_error: "Exam ID is required",
  }),
  studentId: z.number({
    required_error: "Student ID is required",
  }),
  subject: z.string({
    required_error: "Subject is required",
  }),
  score: z.number({
    required_error: "Score is required",
  }).min(0, "Score must be at least 0"),
  total: z.number({
    required_error: "Total is required",
  }).min(1, "Total must be at least 1"),
  grade: z.string(),
});

type ResultFormValues = z.infer<typeof resultFormSchema>;

const ResultsTable: React.FC<ResultsTableProps> = ({ onAddResult }) => {
  const { toast } = useToast();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    subject: '',
    class: '',
    section: '',
    type: '',
    year: '',
  });

  const { data: results, isLoading, error, refetch } = useQuery<Result[]>({
    queryKey: ['/api/results'],
  });

  const { data: students } = useQuery<Student[]>({
    queryKey: ['/api/students'],
  });

  const { data: exams } = useQuery<Exam[]>({
    queryKey: ['/api/exams'],
  });

  const form = useForm<ResultFormValues>({
    resolver: zodResolver(resultFormSchema),
    defaultValues: {
      examId: undefined,
      studentId: undefined,
      subject: '',
      score: 0,
      total: 100,
      grade: 'F',
    },
  });

  const watchScore = form.watch('score');
  const watchTotal = form.watch('total');

  // Update grade when score or total changes
  const grade = calculateGrade(watchScore || 0, watchTotal || 100);
  if (grade !== form.getValues('grade')) {
    form.setValue('grade', grade);
  }

  const getStudentName = (studentId: number) => {
    const student = students?.find(s => s.id === studentId);
    return student ? `${student.firstName} ${student.lastName}` : `Student #${studentId}`;
  };

  const getExamName = (examId: number) => {
    const exam = exams?.find(e => e.id === examId);
    return exam ? exam.name : `Exam #${examId}`;
  };

  const subjects = [
    "Arabic", "English", "Islamic", "Somali", "Math", "Science", "ICT", "Socail"
  ];

  const onSubmit = async (data: ResultFormValues) => {
    try {
      await apiRequest('POST', '/api/results', data);
      toast({
        title: 'Success',
        description: 'Result added successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/results'] });
      setIsAddModalOpen(false);
      form.reset();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add result',
        variant: 'destructive',
      });
    }
  };

  const columns: ColumnDef<Result>[] = [
    {
      accessorKey: 'rollNo',
      header: 'Roll No',
      cell: ({ row }) => String(row.index + 1).padStart(2, '0'),
    },
    {
      accessorKey: 'studentId',
      header: 'Student ID',
      cell: ({ row }) => {
        const student = students?.find(s => s.id === row.original.studentId);
        return student?.studentId || `#${row.original.studentId}`;
      },
    },
    {
      accessorKey: 'studentName',
      header: 'Student Name',
      cell: ({ row }) => getStudentName(row.original.studentId),
    },
    {
      accessorKey: 'subject',
      header: ({ column }) => {
        return (
          <div className="flex justify-between items-center">
            <span>{column.id === 'subject' ? 'Subject' : column.id}</span>
          </div>
        );
      },
      cell: ({ row }) => row.original.subject,
    },
    {
      accessorKey: 'score',
      header: 'Score',
      cell: ({ row }) => (
        <div className="border border-blue p-1 text-center rounded bg-white">
          {row.original.score}
        </div>
      ),
    },
    {
      accessorKey: 'total',
      header: 'Total',
      cell: ({ row }) => row.original.total,
    },
    {
      accessorKey: 'grade',
      header: 'Grade',
      cell: ({ row }) => {
        const grade = row.original.grade;
        let bgColor;
        
        if (grade === 'A') bgColor = 'bg-green';
        else if (grade === 'B') bgColor = 'bg-blue';
        else if (grade === 'C') bgColor = 'bg-yellow';
        else bgColor = 'bg-red';
        
        return (
          <span className={`${bgColor} text-white px-2 py-1 rounded-full text-xs`}>
            {grade}
          </span>
        );
      },
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow mb-6">
      <div className="p-4 flex items-center justify-between border-b border-divider dark:border-gray-700">
        <div className="flex items-center">
          <h2 className="text-lg font-homenaje text-gray-800 dark:text-gray-200 mr-4">View Results</h2>
          <span className="text-sm text-gray-500 dark:text-gray-400">Filter BY</span>
        </div>
        <div className="flex space-x-2">
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
            label="Subject"
            options={[
              { value: '', label: 'All' },
              ...subjects.map(subject => ({ value: subject.toLowerCase(), label: subject }))
            ]}
            value={filters.subject}
            onChange={(value) => setFilters({ ...filters, subject: value })}
            placeholder="Subject"
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
          <FilterSelect
            label="Type"
            options={[
              { value: '', label: 'All' },
              { value: 'midterm', label: 'Midterm' },
              { value: 'final', label: 'Final' },
            ]}
            value={filters.type}
            onChange={(value) => setFilters({ ...filters, type: value })}
            placeholder="Type"
          />
          <FilterSelect
            label="Year"
            options={[
              { value: '', label: 'All' },
              { value: '2023', label: '2023' },
              { value: '2022', label: '2022' },
              { value: '2021', label: '2021' },
            ]}
            value={filters.year}
            onChange={(value) => setFilters({ ...filters, year: value })}
            placeholder="Year"
          />
        </div>

        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button 
              className="bg-green hover:bg-green/90 text-white"
              onClick={() => setIsAddModalOpen(true)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Result
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Result</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="examId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Exam</FormLabel>
                      <Select onValueChange={(value) => field.onChange(parseInt(value))} defaultValue={field.value?.toString()}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an exam" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {exams?.map((exam) => (
                            <SelectItem key={exam.id} value={exam.id.toString()}>
                              {exam.name} ({exam.section})
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
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a subject" />
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
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="score"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Score</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="Score" 
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="total"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Total</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="Total" 
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="grade"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Grade (Auto-calculated)</FormLabel>
                      <FormControl>
                        <Input readOnly {...field} />
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
                    Add Result
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      
      {isLoading ? (
        <div className="p-8 text-center">Loading results...</div>
      ) : error ? (
        <div className="p-8 text-center text-red">Error loading results. Please try again.</div>
      ) : (
        <DataTable
          columns={columns}
          data={results || []}
        />
      )}
    </div>
  );
};

export default ResultsTable;
