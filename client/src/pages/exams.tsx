import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Trophy, 
  TrendingUp, 
  BookOpen, 
  Users, 
  BarChart3, 
  Award,
  Search,
  Filter,
  Plus,
  FileText,
  Target,
  Calendar,
  GraduationCap
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { Result, Student, Exam } from '@shared/schema';
import { calculateGrade } from '@/lib/utils';
import ResultsTable from '@/components/results/ResultsTable';

const examFormSchema = z.object({
  name: z.string().min(1, "Exam name is required"),
  section: z.enum(['primary', 'secondary', 'highschool']),
  class: z.string().min(1, "Class is required"),
  date: z.string().min(1, "Date is required"),
  subjects: z.array(z.string()).min(1, "At least one subject must be selected"),
});

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

type ExamFormValues = z.infer<typeof examFormSchema>;
type ResultFormValues = z.infer<typeof resultFormSchema>;

export default function Exams() {
  const [isAddExamModalOpen, setIsAddExamModalOpen] = useState(false);
  const [isAddResultModalOpen, setIsAddResultModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const { toast } = useToast();
  
  const { data: stats, isLoading } = useQuery({
    queryKey: ['/api/stats'],
  });

  const { data: results, isLoading: resultsLoading } = useQuery<Result[]>({
    queryKey: ['/api/results'],
  });

  const { data: students } = useQuery<Student[]>({
    queryKey: ['/api/students'],
  });

  const { data: exams } = useQuery<Exam[]>({
    queryKey: ['/api/exams'],
  });

  const subjects = [
    { id: "Arabic", label: "Arabic" },
    { id: "English", label: "English" },
    { id: "Islamic", label: "Islamic" },
    { id: "Somali", label: "Somali" },
    { id: "Math", label: "Math" },
    { id: "Science", label: "Science" },
    { id: "ICT", label: "ICT" },
    { id: "Social", label: "Social" },
  ];

  const examForm = useForm<ExamFormValues>({
    resolver: zodResolver(examFormSchema),
    defaultValues: {
      name: '',
      section: 'primary',
      class: 'One',
      date: new Date().toISOString().split('T')[0],
      subjects: [],
    },
  });

  const resultForm = useForm<ResultFormValues>({
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

  const watchScore = resultForm.watch('score');
  const watchTotal = resultForm.watch('total');

  // Update grade when score or total changes
  const grade = calculateGrade(watchScore || 0, watchTotal || 100);
  if (grade !== resultForm.getValues('grade')) {
    resultForm.setValue('grade', grade);
  }

  const onSubmitExam = async (data: ExamFormValues) => {
    try {
      await apiRequest('POST', '/api/exams', data);
      toast({
        title: 'Success',
        description: 'Exam created successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/exams'] });
      setIsAddExamModalOpen(false);
      examForm.reset();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create exam',
        variant: 'destructive',
      });
    }
  };

  const onSubmitResult = async (data: ResultFormValues) => {
    try {
      await apiRequest('POST', '/api/results', data);
      toast({
        title: 'Success',
        description: 'Result added successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/results'] });
      setIsAddResultModalOpen(false);
      resultForm.reset();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add result',
        variant: 'destructive',
      });
    }
  };

  const getStudentName = (studentId: number) => {
    const student = students?.find(s => s.id === studentId);
    return student ? `${student.firstName} ${student.lastName}` : `Student #${studentId}`;
  };

  const getExamName = (examId: number) => {
    const exam = exams?.find(e => e.id === examId);
    return exam ? exam.name : `Exam #${examId}`;
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'bg-gradient-to-r from-green-500 to-emerald-500 text-white';
      case 'B': return 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white';
      case 'C': return 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white';
      case 'D': return 'bg-gradient-to-r from-orange-500 to-red-500 text-white';
      case 'F': return 'bg-gradient-to-r from-red-500 to-rose-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  // Filter results based on search and filters
  const filteredResults = results?.filter(result => {
    const student = students?.find(s => s.id === result.studentId);
    const studentName = student ? `${student.firstName} ${student.lastName}` : '';
    const matchesSearch = searchTerm === '' || 
      studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student?.studentId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSubject = subjectFilter === 'all' || result.subject.toLowerCase() === subjectFilter.toLowerCase();
    const matchesStatus = statusFilter === 'all' || result.grade === statusFilter;
    
    return matchesSearch && matchesSubject && matchesStatus;
  }) || [];

  // Calculate statistics
  const totalResults = results?.length || 0;
  const averageScore = results?.length ? 
    Math.round((results.reduce((sum, r) => sum + ((r.score / r.total) * 100), 0) / results.length) * 10) / 10 : 0;
  const highestScore = results?.length ? 
    Math.max(...results.map(r => (r.score / r.total) * 100)) : 0;
  const gradeDistribution = results?.reduce((acc, r) => {
    acc[r.grade] = (acc[r.grade] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  return (
    <Layout>
      <div className="space-y-8">
        {/* Modern Page Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-500/10 rounded-xl">
                <Award className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gradient">Academic Results</h1>
                <p className="text-muted-foreground">Track exam results, performance, and academic analytics</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              onClick={() => setIsAddResultModalOpen(true)}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Result
            </Button>
            <Button variant="outline" className="glass-morphism border-border/30 hover:border-primary/30">
              <FileText className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Academic Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Results */}
          <Card className="glass-morphism border-border/30 hover:border-primary/30 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground font-medium">Total Results</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <h3 className="text-2xl font-bold text-blue-600">{totalResults}</h3>
                    <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +5.2%
                    </Badge>
                  </div>
                </div>
                <div className="p-3 bg-blue-500/10 rounded-xl">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Average Score */}
          <Card className="glass-morphism border-border/30 hover:border-primary/30 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground font-medium">Average Score</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <h3 className="text-2xl font-bold text-green-600">{averageScore}%</h3>
                    <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +3.1%
                    </Badge>
                  </div>
                </div>
                <div className="p-3 bg-green-500/10 rounded-xl">
                  <Target className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pass Rate */}
          <Card className="glass-morphism border-border/30 hover:border-primary/30 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground font-medium">Pass Rate</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <h3 className="text-2xl font-bold text-emerald-600">
                      {totalResults > 0 ? Math.round(((gradeDistribution.A || 0) + (gradeDistribution.B || 0) + (gradeDistribution.C || 0)) / totalResults * 100) : 0}%
                    </h3>
                    <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +1.8%
                    </Badge>
                  </div>
                </div>
                <div className="p-3 bg-emerald-500/10 rounded-xl">
                  <Trophy className="h-6 w-6 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Total Students */}
          <Card className="glass-morphism border-border/30 hover:border-primary/30 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground font-medium">Total Students</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <h3 className="text-2xl font-bold text-purple-600">{students?.length || 0}</h3>
                    <Badge className="bg-purple-500/10 text-purple-600 border-purple-500/20">
                      <Users className="h-3 w-3 mr-1" />
                      Active
                    </Badge>
                  </div>
                </div>
                <div className="p-3 bg-purple-500/10 rounded-xl">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Academic Performance Analysis */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Excellent Performance */}
          <Card className="glass-morphism border-border/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-500/10 rounded-lg">
                    <Trophy className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-green-600 text-[23px]">Excellent Students</h3>
                    <p className="text-sm text-muted-foreground">Grade A achievers</p>
                  </div>
                </div>
                <Badge className="bg-green-500/10 text-green-600 border-green-500/20 text-sm px-3 py-1">
                  {gradeDistribution.A || 0}
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Excellence Rate</span>
                  <span className="font-medium">{totalResults > 0 ? Math.round(((gradeDistribution.A || 0) / totalResults) * 100) : 0}%</span>
                </div>
                <Progress value={totalResults > 0 ? ((gradeDistribution.A || 0) / totalResults) * 100 : 0} className="h-2 bg-green-500/10" />
              </div>
            </CardContent>
          </Card>

          {/* Good Performance */}
          <Card className="glass-morphism border-border/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-amber-500/10 rounded-lg">
                    <Target className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-amber-600 text-[23px]">Good Performance</h3>
                    <p className="text-sm text-muted-foreground">Grade B & C students</p>
                  </div>
                </div>
                <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 text-sm px-3 py-1">
                  {(gradeDistribution.B || 0) + (gradeDistribution.C || 0)}
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Good Rate</span>
                  <span className="font-medium">{totalResults > 0 ? Math.round((((gradeDistribution.B || 0) + (gradeDistribution.C || 0)) / totalResults) * 100) : 0}%</span>
                </div>
                <Progress value={totalResults > 0 ? (((gradeDistribution.B || 0) + (gradeDistribution.C || 0)) / totalResults) * 100 : 0} className="h-2 bg-amber-500/10" />
              </div>
            </CardContent>
          </Card>

          {/* Needs Improvement */}
          <Card className="glass-morphism border-border/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-red-500/10 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-red-600 text-[23px]">Needs Support</h3>
                    <p className="text-sm text-muted-foreground">Requires improvement</p>
                  </div>
                </div>
                <Badge className="bg-red-500/10 text-red-600 border-red-500/20 text-sm px-3 py-1">
                  {(gradeDistribution.D || 0) + (gradeDistribution.F || 0)}
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Support Rate</span>
                  <span className="font-medium">{totalResults > 0 ? Math.round((((gradeDistribution.D || 0) + (gradeDistribution.F || 0)) / totalResults) * 100) : 0}%</span>
                </div>
                <Progress value={totalResults > 0 ? (((gradeDistribution.D || 0) + (gradeDistribution.F || 0)) / totalResults) * 100 : 0} className="h-2 bg-red-500/10" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Academic Results Tabs */}
        <Tabs defaultValue="results" className="space-y-6">
          <TabsList className="glass-morphism border-border/30 bg-background/50">
            <TabsTrigger value="results" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Award className="h-4 w-4 mr-2" />
              Results
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="reports" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <BookOpen className="h-4 w-4 mr-2" />
              Reports
            </TabsTrigger>
          </TabsList>

          <TabsContent value="results" className="space-y-6">
            <ResultsTable onAddResult={() => setIsAddResultModalOpen(true)} />
          </TabsContent>

          {/* Exams Tab */}
          <TabsContent value="exams" className="space-y-6">
            <Card className="glass-morphism border-border/20">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-4">
                  <BookOpen className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Exam Management</h3>
                <p className="text-muted-foreground text-center mb-6">
                  Create and manage exam schedules, subjects, and configurations.
                </p>
                <Button
                  onClick={() => setIsAddExamModalOpen(true)}
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Exam
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Performance Trend Chart */}
              <Card className="glass-morphism border-border/30">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-primary flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Performance Trend
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Performance chart visualization</p>
                      <p className="text-sm">Would integrate with Recharts</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Subject Performance */}
              <Card className="glass-morphism border-border/30">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-primary flex items-center">
                    <BookOpen className="h-5 w-5 mr-2" />
                    Subject Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        <span className="text-sm">Mathematics</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">85%</div>
                        <div className="text-xs text-muted-foreground">Average</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span className="text-sm">English</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">78%</div>
                        <div className="text-xs text-muted-foreground">Average</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                        <span className="text-sm">Science</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">82%</div>
                        <div className="text-xs text-muted-foreground">Average</div>
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
                      <h3 className="font-semibold">Monthly Report</h3>
                      <p className="text-sm text-muted-foreground">Academic performance</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    Generate Report
                  </Button>
                </CardContent>
              </Card>

              <Card className="glass-morphism border-border/30 hover:border-primary/30 transition-all duration-300 cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-green-500/10 rounded-lg">
                      <Trophy className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Grade Report</h3>
                      <p className="text-sm text-muted-foreground">Performance analysis</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    Generate Report
                  </Button>
                </CardContent>
              </Card>

              <Card className="glass-morphism border-border/30 hover:border-primary/30 transition-all duration-300 cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-purple-500/10 rounded-lg">
                      <Users className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Student Report</h3>
                      <p className="text-sm text-muted-foreground">Individual progress</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    Generate Report
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Create Exam Dialog */}
        <Dialog open={isAddExamModalOpen} onOpenChange={setIsAddExamModalOpen}>
          <DialogContent className="max-w-2xl glass-morphism">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <BookOpen className="h-4 w-4 text-white" />
                </div>
                Create New Exam
              </DialogTitle>
              <DialogDescription>
                Set up a new examination with subjects and scheduling details.
              </DialogDescription>
            </DialogHeader>
            <Form {...examForm}>
              <form onSubmit={examForm.handleSubmit(onSubmitExam)} className="space-y-6">
                <FormField
                  control={examForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Exam Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Midterm Exam 2025" {...field} className="glass-morphism" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={examForm.control}
                    name="section"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Section</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="glass-morphism">
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
                    control={examForm.control}
                    name="class"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Class</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="glass-morphism">
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
                  control={examForm.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Exam Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} className="glass-morphism" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={examForm.control}
                  name="subjects"
                  render={() => (
                    <FormItem>
                      <FormLabel>Subjects</FormLabel>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                        {subjects.map((subject) => (
                          <FormField
                            key={subject.id}
                            control={examForm.control}
                            name="subjects"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-2 space-y-0">
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
                            )}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex justify-end space-x-3 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsAddExamModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white"
                  >
                    Create Exam
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* Add Result Dialog */}
        <Dialog open={isAddResultModalOpen} onOpenChange={setIsAddResultModalOpen}>
          <DialogContent className="max-w-lg glass-morphism">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                  <Award className="h-4 w-4 text-white" />
                </div>
                Add Result
              </DialogTitle>
              <DialogDescription>
                Record a student's exam result and performance.
              </DialogDescription>
            </DialogHeader>
            <Form {...resultForm}>
              <form onSubmit={resultForm.handleSubmit(onSubmitResult)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={resultForm.control}
                    name="examId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Exam</FormLabel>
                        <Select onValueChange={(value) => field.onChange(parseInt(value))}>
                          <FormControl>
                            <SelectTrigger className="glass-morphism">
                              <SelectValue placeholder="Select exam" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {exams?.map((exam) => (
                              <SelectItem key={exam.id} value={exam.id.toString()}>
                                {exam.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={resultForm.control}
                    name="studentId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Student</FormLabel>
                        <Select onValueChange={(value) => field.onChange(parseInt(value))}>
                          <FormControl>
                            <SelectTrigger className="glass-morphism">
                              <SelectValue placeholder="Select student" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {students?.map((student) => (
                              <SelectItem key={student.id} value={student.id.toString()}>
                                {student.firstName} {student.lastName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={resultForm.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject</FormLabel>
                      <Select onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger className="glass-morphism">
                            <SelectValue placeholder="Select subject" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {subjects.map((subject) => (
                            <SelectItem key={subject.id} value={subject.id}>
                              {subject.label}
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
                    control={resultForm.control}
                    name="score"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Score</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="85" 
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            className="glass-morphism"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={resultForm.control}
                    name="total"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Total</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="100" 
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 100)}
                            className="glass-morphism"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="p-4 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-800 dark:to-slate-700 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground mb-1">Calculated Grade</p>
                  <Badge className={`${getGradeColor(grade)} text-lg px-4 py-1`}>
                    {grade}
                  </Badge>
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsAddResultModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
                  >
                    Add Result
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
