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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-4 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Exams & Results
            </h1>
            <p className="text-muted-foreground mt-2">
              Comprehensive examination and academic performance management
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              onClick={() => setIsAddExamModalOpen(true)}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Exam
            </Button>
            <Button
              onClick={() => setIsAddResultModalOpen(true)}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Award className="h-4 w-4 mr-2" />
              Add Result
            </Button>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="glass-morphism border-border/20 hover:shadow-xl transition-all duration-500 group">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Results</CardTitle>
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <FileText className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalResults}</div>
              <p className="text-xs text-muted-foreground">Academic records</p>
            </CardContent>
          </Card>

          <Card className="glass-morphism border-border/20 hover:shadow-xl transition-all duration-500 group">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Average Score</CardTitle>
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Target className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{averageScore}%</div>
              <p className="text-xs text-muted-foreground">Class performance</p>
            </CardContent>
          </Card>

          <Card className="glass-morphism border-border/20 hover:shadow-xl transition-all duration-500 group">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Highest Score</CardTitle>
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Trophy className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round(highestScore)}%</div>
              <p className="text-xs text-muted-foreground">Best performance</p>
            </CardContent>
          </Card>

          <Card className="glass-morphism border-border/20 hover:shadow-xl transition-all duration-500 group">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Exams</CardTitle>
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <GraduationCap className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{exams?.length || 0}</div>
              <p className="text-xs text-muted-foreground">Created exams</p>
            </CardContent>
          </Card>
        </div>

        {/* Grade Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 glass-morphism border-border/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <BarChart3 className="h-4 w-4 text-white" />
                </div>
                Grade Distribution
              </CardTitle>
              <CardDescription>Student performance breakdown by grades</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {['A', 'B', 'C', 'D', 'F'].map((grade) => {
                  const count = gradeDistribution[grade] || 0;
                  const percentage = totalResults > 0 ? (count / totalResults) * 100 : 0;
                  return (
                    <div key={grade} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge className={`${getGradeColor(grade)} min-w-[40px] justify-center`}>
                          {grade}
                        </Badge>
                        <span className="text-sm font-medium">{count} students</span>
                      </div>
                      <div className="flex items-center gap-3 flex-1 max-w-xs">
                        <Progress value={percentage} className="flex-1" />
                        <span className="text-sm text-muted-foreground min-w-[45px]">
                          {Math.round(percentage)}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="glass-morphism border-border/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-white" />
                </div>
                Quick Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Active Students</span>
                <span className="font-semibold">{students?.length || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Subjects</span>
                <span className="font-semibold">{subjects.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Pass Rate</span>
                <span className="font-semibold text-green-600">
                  {totalResults > 0 ? Math.round(((gradeDistribution.A || 0) + (gradeDistribution.B || 0) + (gradeDistribution.C || 0)) / totalResults * 100) : 0}%
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="results" className="space-y-6">
          <TabsList className="glass-morphism border-border/20">
            <TabsTrigger value="results" className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              Results
            </TabsTrigger>
            <TabsTrigger value="exams" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Exams
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Results Tab */}
          <TabsContent value="results" className="space-y-6">
            {/* Search and Filter */}
            <Card className="glass-morphism border-border/20 p-4">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by student name, ID, or subject..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 glass-morphism border-border/30"
                  />
                </div>
                
                <div className="flex items-center gap-3">
                  <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                    <SelectTrigger className="w-40 glass-morphism">
                      <SelectValue placeholder="Subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Subjects</SelectItem>
                      {subjects.map((subject) => (
                        <SelectItem key={subject.id} value={subject.id.toLowerCase()}>
                          {subject.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-32 glass-morphism">
                      <SelectValue placeholder="Grade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Grades</SelectItem>
                      <SelectItem value="A">Grade A</SelectItem>
                      <SelectItem value="B">Grade B</SelectItem>
                      <SelectItem value="C">Grade C</SelectItem>
                      <SelectItem value="D">Grade D</SelectItem>
                      <SelectItem value="F">Grade F</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                    {filteredResults.length} results
                  </Badge>
                </div>
              </div>
            </Card>

            {/* Results Cards */}
            {resultsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i} className="glass-morphism border-border/20 animate-pulse">
                    <CardContent className="p-6">
                      <div className="space-y-3">
                        <div className="h-4 bg-muted rounded w-3/4"></div>
                        <div className="h-3 bg-muted rounded w-1/2"></div>
                        <div className="h-8 bg-muted rounded w-full"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredResults.length === 0 ? (
              <Card className="glass-morphism border-border/20">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mb-4">
                    <Award className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No Results Found</h3>
                  <p className="text-muted-foreground text-center mb-6">
                    {searchTerm || statusFilter !== 'all' || subjectFilter !== 'all' 
                      ? "No results match your current filters."
                      : "No exam results have been recorded yet."
                    }
                  </p>
                  <Button
                    onClick={() => setIsAddResultModalOpen(true)}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Result
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredResults.map((result) => {
                  const student = students?.find(s => s.id === result.studentId);
                  const exam = exams?.find(e => e.id === result.examId);
                  const percentage = Math.round((result.score / result.total) * 100);
                  
                  return (
                    <Card key={result.id} className="glass-morphism border-border/20 hover:shadow-xl transition-all duration-300 group">
                      <CardContent className="p-6 space-y-4">
                        {/* Student Info */}
                        <div className="flex items-center gap-3">
                          <Avatar className="h-12 w-12 ring-2 ring-primary/20">
                            <AvatarImage src={student?.profilePhoto} />
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold">
                              {student ? `${student.firstName[0]}${student.lastName[0]}` : 'ST'}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold truncate">
                              {getStudentName(result.studentId)}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {student?.studentId || `#${result.studentId}`}
                            </p>
                          </div>
                          <Badge className={getGradeColor(result.grade)}>
                            {result.grade}
                          </Badge>
                        </div>

                        {/* Exam Details */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Subject</span>
                            <Badge variant="outline">{result.subject}</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Exam</span>
                            <span className="text-sm text-muted-foreground truncate max-w-[150px]">
                              {getExamName(result.examId)}
                            </span>
                          </div>
                        </div>

                        {/* Score Display */}
                        <div className="bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-800 dark:to-slate-700 rounded-lg p-4 text-center">
                          <div className="text-2xl font-bold text-primary mb-1">
                            {result.score}/{result.total}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {percentage}% Score
                          </div>
                          <Progress 
                            value={percentage} 
                            className="mt-2 h-2"
                          />
                        </div>

                        {/* Date */}
                        <div className="flex items-center justify-center text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(result.createdAt).toLocaleDateString()}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
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

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <Card className="glass-morphism border-border/20">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mb-4">
                  <BarChart3 className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Advanced Analytics</h3>
                <p className="text-muted-foreground text-center">
                  Detailed performance analytics and reporting coming soon.
                </p>
              </CardContent>
            </Card>
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
