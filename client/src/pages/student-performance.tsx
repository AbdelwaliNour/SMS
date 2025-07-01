import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Award, 
  BarChart3,
  Download,
  Plus,
  Target,
  Trophy,
  BookOpen,
  Search,
  Eye,
  Calendar,
  Star,
  User
} from 'lucide-react';
import { calculateAge } from '@/lib/utils';
import { Student, Result } from '@shared/schema';

const StudentPerformance = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSection, setSelectedSection] = useState('all');
  const [selectedPerformance, setSelectedPerformance] = useState('all');

  // Fetch data
  const { data: students = [], isLoading: studentsLoading } = useQuery<Student[]>({
    queryKey: ['/api/students'],
  });

  const { data: results = [], isLoading: resultsLoading } = useQuery<Result[]>({
    queryKey: ['/api/results'],
  });

  const { data: stats = {} } = useQuery({
    queryKey: ['/api/stats'],
  });

  // Filter students based on search and filters
  const filteredStudents = students.filter((student: Student) => {
    const matchesSearch = searchQuery 
      ? `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.studentId.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
      
    const matchesSection = selectedSection !== 'all' ? student.section === selectedSection : true;
    
    return matchesSearch && matchesSection;
  });

  // Calculate performance statistics
  const totalStudents = students.length;
  const excellentPerformers = Math.floor(totalStudents * 0.3); // Top 30%
  const goodPerformers = Math.floor(totalStudents * 0.5); // Middle 50%
  const needsSupport = totalStudents - excellentPerformers - goodPerformers; // Bottom 20%

  return (
    <Layout>
      <div className="container mx-auto py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 flex items-center justify-center shadow-lg">
                <Trophy className="h-6 w-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 bg-clip-text text-transparent">
                Academic Performance
              </h1>
              <p className="text-muted-foreground flex items-center space-x-2">
                <Star className="h-4 w-4 text-amber-500" />
                <span>Excellence tracking and student achievement analytics</span>
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm" className="hover:bg-amber-50 hover:border-amber-200 transition-all duration-200">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
            <Button size="sm" className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-600 hover:via-orange-600 hover:to-red-600 shadow-lg transition-all duration-200">
              <Plus className="h-4 w-4 mr-2" />
              Add Assessment
            </Button>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="glass-morphism border-border/30 hover:border-blue-300/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-100/20 hover:-translate-y-1">
            <CardContent className="p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-400/10 to-blue-600/10 rounded-full -translate-y-8 translate-x-8"></div>
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <Users className="h-4 w-4 text-blue-600" />
                    <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                  </div>
                  <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">{totalStudents}</p>
                </div>
                <div className="flex items-center space-x-1">
                  <TrendingUp className="h-4 w-4 text-emerald-600" />
                  <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 shadow-sm">
                    +12%
                  </Badge>
                </div>
              </div>
              <div className="flex items-center justify-between mt-4 relative z-10">
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></div>
                  <p className="text-xs text-muted-foreground">Active learners</p>
                </div>
                <div className="text-xs font-medium text-blue-600">Enrolled</div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-morphism border-border/30 hover:border-emerald-300/50 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-100/20 hover:-translate-y-1">
            <CardContent className="p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-emerald-400/10 to-emerald-600/10 rounded-full -translate-y-8 translate-x-8"></div>
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <Target className="h-4 w-4 text-emerald-600" />
                    <p className="text-sm font-medium text-muted-foreground">Average Score</p>
                  </div>
                  <p className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent">82.5%</p>
                </div>
                <div className="flex items-center space-x-1">
                  <TrendingUp className="h-4 w-4 text-emerald-600" />
                  <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 shadow-sm">
                    +5.2%
                  </Badge>
                </div>
              </div>
              <div className="flex items-center justify-between mt-4 relative z-10">
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  <p className="text-xs text-muted-foreground">Class performance</p>
                </div>
                <div className="text-xs font-medium text-emerald-600">Overall</div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-morphism border-border/30 hover:border-amber-300/50 transition-all duration-300 hover:shadow-xl hover:shadow-amber-100/20 hover:-translate-y-1">
            <CardContent className="p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-amber-400/10 to-amber-600/10 rounded-full -translate-y-8 translate-x-8"></div>
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <Award className="h-4 w-4 text-amber-600" />
                    <p className="text-sm font-medium text-muted-foreground">Top Performers</p>
                  </div>
                  <p className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent">{excellentPerformers}</p>
                </div>
                <div className="flex items-center space-x-1">
                  <TrendingUp className="h-4 w-4 text-emerald-600" />
                  <Badge className="bg-amber-100 text-amber-700 border-amber-200 shadow-sm">
                    +8%
                  </Badge>
                </div>
              </div>
              <div className="flex items-center justify-between mt-4 relative z-10">
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse"></div>
                  <p className="text-xs text-muted-foreground">Excellence track</p>
                </div>
                <div className="text-xs font-medium text-amber-600">90%+</div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-morphism border-border/30 hover:border-purple-300/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-100/20 hover:-translate-y-1">
            <CardContent className="p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-400/10 to-purple-600/10 rounded-full -translate-y-8 translate-x-8"></div>
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <BarChart3 className="h-4 w-4 text-purple-600" />
                    <p className="text-sm font-medium text-muted-foreground">Improvement Rate</p>
                  </div>
                  <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">78%</p>
                </div>
                <div className="flex items-center space-x-1">
                  <TrendingDown className="h-4 w-4 text-red-500" />
                  <Badge className="bg-red-100 text-red-700 border-red-200 shadow-sm">
                    -2%
                  </Badge>
                </div>
              </div>
              <div className="flex items-center justify-between mt-4 relative z-10">
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-purple-500 animate-pulse"></div>
                  <p className="text-xs text-muted-foreground">Growth tracking</p>
                </div>
                <div className="text-xs font-medium text-purple-600">Progress</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Distribution */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <BarChart3 className="h-4 w-4 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Performance Distribution</h2>
              <p className="text-sm text-muted-foreground">Academic achievement levels across all students</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="glass-morphism border-border/30 hover:border-emerald-300/50 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-100/20 hover:-translate-y-1 relative overflow-hidden">
              <CardContent className="p-6">
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-emerald-400/10 to-emerald-600/10 rounded-full -translate-y-6 translate-x-6"></div>
                <div className="flex items-center justify-between mb-4 relative z-10">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                      <Award className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <span className="text-lg font-bold text-emerald-700 dark:text-emerald-400">Excellent</span>
                      <p className="text-xs text-muted-foreground">90-100% Score Range</p>
                    </div>
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 shadow-sm px-3 py-1">
                    {excellentPerformers} students
                  </Badge>
                </div>
                <div className="space-y-3 relative z-10">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">Performance Rate</span>
                    <span className="font-bold text-emerald-600">{Math.round((excellentPerformers / totalStudents) * 100)}%</span>
                  </div>
                  <div className="relative">
                    <Progress value={(excellentPerformers / totalStudents) * 100} className="h-3 bg-emerald-100" />
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full opacity-20"></div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Outstanding achievers</span>
                    <span className="flex items-center space-x-1">
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                      <span>Active</span>
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-morphism border-border/30 hover:border-blue-300/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-100/20 hover:-translate-y-1 relative overflow-hidden">
              <CardContent className="p-6">
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-blue-400/10 to-blue-600/10 rounded-full -translate-y-6 translate-x-6"></div>
                <div className="flex items-center justify-between mb-4 relative z-10">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <Target className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <span className="text-lg font-bold text-blue-700 dark:text-blue-400">Good</span>
                      <p className="text-xs text-muted-foreground">70-89% Score Range</p>
                    </div>
                  </div>
                  <Badge className="bg-blue-100 text-blue-700 border-blue-200 shadow-sm px-3 py-1">
                    {goodPerformers} students
                  </Badge>
                </div>
                <div className="space-y-3 relative z-10">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">Performance Rate</span>
                    <span className="font-bold text-blue-600">{Math.round((goodPerformers / totalStudents) * 100)}%</span>
                  </div>
                  <div className="relative">
                    <Progress value={(goodPerformers / totalStudents) * 100} className="h-3 bg-blue-100" />
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full opacity-20"></div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Solid performers</span>
                    <span className="flex items-center space-x-1">
                      <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse"></div>
                      <span>Stable</span>
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-morphism border-border/30 hover:border-amber-300/50 transition-all duration-300 hover:shadow-xl hover:shadow-amber-100/20 hover:-translate-y-1 relative overflow-hidden">
              <CardContent className="p-6">
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-amber-400/10 to-amber-600/10 rounded-full -translate-y-6 translate-x-6"></div>
                <div className="flex items-center justify-between mb-4 relative z-10">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                      <BookOpen className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <span className="text-lg font-bold text-amber-700 dark:text-amber-400">Needs Support</span>
                      <p className="text-xs text-muted-foreground">Below 70% Score Range</p>
                    </div>
                  </div>
                  <Badge className="bg-amber-100 text-amber-700 border-amber-200 shadow-sm px-3 py-1">
                    {needsSupport} students
                  </Badge>
                </div>
                <div className="space-y-3 relative z-10">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">Performance Rate</span>
                    <span className="font-bold text-amber-600">{Math.round((needsSupport / totalStudents) * 100)}%</span>
                  </div>
                  <div className="relative">
                    <Progress value={(needsSupport / totalStudents) * 100} className="h-3 bg-amber-100" />
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full opacity-20"></div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Improvement focus</span>
                    <span className="flex items-center space-x-1">
                      <div className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse"></div>
                      <span>Priority</span>
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="performance" className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="performance" className="space-y-6">
            <PerformanceTable 
              students={filteredStudents}
              results={results}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedSection={selectedSection}
              setSelectedSection={setSelectedSection}
              selectedPerformance={selectedPerformance}
              setSelectedPerformance={setSelectedPerformance}
              isLoading={studentsLoading}
            />
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
                      <p className="text-sm text-muted-foreground">Performance overview</p>
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
                      <h3 className="font-semibold">Achievement Report</h3>
                      <p className="text-sm text-muted-foreground">Student achievements</p>
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
                      <h3 className="font-semibold">Class Report</h3>
                      <p className="text-sm text-muted-foreground">Class performance</p>
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
      </div>
    </Layout>
  );
};

// Performance Table Component
interface PerformanceTableProps {
  students: Student[];
  results: Result[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedSection: string;
  setSelectedSection: (section: string) => void;
  selectedPerformance: string;
  setSelectedPerformance: (performance: string) => void;
  isLoading: boolean;
}

const PerformanceTable = ({ 
  students, 
  results, 
  searchQuery, 
  setSearchQuery, 
  selectedSection, 
  setSelectedSection,
  selectedPerformance,
  setSelectedPerformance,
  isLoading 
}: PerformanceTableProps) => {
  if (isLoading) {
    return (
      <Card className="glass-morphism border-border/20">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mb-4" />
          <p className="text-muted-foreground">Loading performance data...</p>
        </CardContent>
      </Card>
    );
  }

  if (students.length === 0) {
    return (
      <Card className="glass-morphism border-border/20">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center mb-4">
            <Trophy className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Track Student Performance</h3>
          <p className="text-muted-foreground text-center mb-6">
            Start tracking student academic performance and achievements.
          </p>
          <Button className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Add Performance Record
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search students by name or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 glass-morphism border-border/30"
          />
        </div>
        
        <Select value={selectedSection} onValueChange={setSelectedSection}>
          <SelectTrigger className="w-full md:w-48 glass-morphism border-border/30">
            <SelectValue placeholder="All Sections" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sections</SelectItem>
            <SelectItem value="primary">Primary</SelectItem>
            <SelectItem value="secondary">Secondary</SelectItem>
            <SelectItem value="highschool">High School</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedPerformance} onValueChange={setSelectedPerformance}>
          <SelectTrigger className="w-full md:w-48 glass-morphism border-border/30">
            <SelectValue placeholder="All Performance" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Performance</SelectItem>
            <SelectItem value="excellent">Excellent (90-100%)</SelectItem>
            <SelectItem value="good">Good (70-89%)</SelectItem>
            <SelectItem value="needs-support">Needs Support (&lt;70%)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Performance Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {students.map((student) => {
          const studentResults = results.filter((result: Result) => result.studentId === student.id);
          const avgScore = studentResults.length > 0 
            ? Math.round(studentResults.reduce((acc, result) => acc + result.score, 0) / studentResults.length)
            : 0;
          
          const getPerformanceBadge = (score: number) => {
            if (score >= 90) return { label: 'Excellent', variant: 'success' as const, class: 'bg-green-100 text-green-700 border-green-200' };
            if (score >= 70) return { label: 'Good', variant: 'default' as const, class: 'bg-blue-100 text-blue-700 border-blue-200' };
            return { label: 'Needs Support', variant: 'destructive' as const, class: 'bg-amber-100 text-amber-700 border-amber-200' };
          };

          const performanceBadge = getPerformanceBadge(avgScore);

          return (
            <Card key={student.id} className="glass-morphism border-border/30 hover:border-amber-300/50 transition-all duration-300 hover:shadow-xl hover:shadow-amber-100/20 hover:-translate-y-1 relative overflow-hidden group">
              <CardContent className="p-6 relative">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-amber-400/5 to-orange-500/5 rounded-full -translate-y-8 translate-x-8 group-hover:scale-110 transition-transform duration-300"></div>
                
                <div className="flex items-start justify-between mb-6 relative z-10">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Avatar className="h-16 w-16 border-3 border-white/30 shadow-lg">
                        <AvatarImage src={student.profilePhoto || undefined} />
                        <AvatarFallback className="bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 text-white font-bold text-lg">
                          {student.firstName.charAt(0)}{student.lastName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                        <Star className="h-2.5 w-2.5 text-white" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-xl text-gray-900 dark:text-gray-100 mb-1">
                        {student.firstName} {student.lastName}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs px-2 py-1">
                          {student.studentId}
                        </Badge>
                        <Badge variant="outline" className="text-xs px-2 py-1 bg-blue-50 text-blue-600 border-blue-200">
                          {calculateAge(student.dateOfBirth)} years
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={`${performanceBadge.class} shadow-sm mb-2 px-3 py-1.5 text-sm font-semibold`}>
                      {performanceBadge.label}
                    </Badge>
                    <div className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                      {avgScore}%
                    </div>
                    <p className="text-xs text-muted-foreground">Average Score</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6 relative z-10">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-3 text-center">
                    <div className="text-lg font-bold text-blue-600">{studentResults.length}</div>
                    <div className="text-xs text-muted-foreground">Total Exams</div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg p-3 text-center">
                    <div className="text-lg font-bold text-purple-600 capitalize">{student.section}</div>
                    <div className="text-xs text-muted-foreground">Section</div>
                  </div>
                </div>

                <div className="space-y-3 mb-6 relative z-10">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground flex items-center space-x-2">
                      <BarChart3 className="h-4 w-4" />
                      <span>Performance Trend</span>
                    </span>
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="h-4 w-4 text-emerald-500" />
                      <span className="text-sm font-medium text-emerald-600">+5.2%</span>
                    </div>
                  </div>
                  
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${avgScore}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex space-x-2 relative z-10">
                  <Button variant="outline" size="sm" className="flex-1 hover:bg-amber-50 hover:border-amber-200 transition-colors">
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                  <Button size="sm" className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-sm">
                    <User className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default StudentPerformance;