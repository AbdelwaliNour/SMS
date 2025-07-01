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
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
              <Trophy className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Student Performance</h1>
              <p className="text-sm text-muted-foreground">Track and analyze student academic performance</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button size="sm" className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Performance
            </Button>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="glass-morphism border-border/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                  <p className="text-2xl font-bold text-primary">{totalStudents}</p>
                </div>
                <div className="flex items-center space-x-1">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
                    +12%
                  </Badge>
                </div>
              </div>
              <div className="flex items-center space-x-2 mt-4">
                <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                <p className="text-xs text-muted-foreground">Active learners</p>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-morphism border-border/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Average Score</p>
                  <p className="text-2xl font-bold text-primary">82.5%</p>
                </div>
                <div className="flex items-center space-x-1">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
                    +5.2%
                  </Badge>
                </div>
              </div>
              <div className="flex items-center space-x-2 mt-4">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <p className="text-xs text-muted-foreground">Class performance</p>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-morphism border-border/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Top Performers</p>
                  <p className="text-2xl font-bold text-primary">{excellentPerformers}</p>
                </div>
                <div className="flex items-center space-x-1">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
                    +8%
                  </Badge>
                </div>
              </div>
              <div className="flex items-center space-x-2 mt-4">
                <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                <p className="text-xs text-muted-foreground">Excellence track</p>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-morphism border-border/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Improvement Rate</p>
                  <p className="text-2xl font-bold text-primary">78%</p>
                </div>
                <div className="flex items-center space-x-1">
                  <TrendingDown className="h-4 w-4 text-red-600" />
                  <Badge variant="secondary" className="bg-red-100 text-red-700 border-red-200">
                    -2%
                  </Badge>
                </div>
              </div>
              <div className="flex items-center space-x-2 mt-4">
                <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                <p className="text-xs text-muted-foreground">Growth tracking</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Distribution */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="glass-morphism border-border/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Award className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium">Excellent</span>
                </div>
                <Badge className="bg-green-100 text-green-700 border-green-200">
                  {excellentPerformers} students
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>90-100%</span>
                  <span className="font-medium">{Math.round((excellentPerformers / totalStudents) * 100)}%</span>
                </div>
                <Progress value={(excellentPerformers / totalStudents) * 100} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-morphism border-border/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-medium">Good</span>
                </div>
                <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                  {goodPerformers} students
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>70-89%</span>
                  <span className="font-medium">{Math.round((goodPerformers / totalStudents) * 100)}%</span>
                </div>
                <Progress value={(goodPerformers / totalStudents) * 100} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-morphism border-border/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5 text-amber-600" />
                  <span className="text-sm font-medium">Needs Support</span>
                </div>
                <Badge className="bg-amber-100 text-amber-700 border-amber-200">
                  {needsSupport} students
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Below 70%</span>
                  <span className="font-medium">{Math.round((needsSupport / totalStudents) * 100)}%</span>
                </div>
                <Progress value={(needsSupport / totalStudents) * 100} className="h-2" />
              </div>
            </CardContent>
          </Card>
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
            <Card key={student.id} className="glass-morphism border-border/30 hover:border-primary/30 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12 border-2 border-white/20">
                      <AvatarImage src={student.profilePhoto || undefined} />
                      <AvatarFallback className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white font-semibold">
                        {student.firstName.charAt(0)}{student.lastName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-lg">{student.firstName} {student.lastName}</h3>
                      <p className="text-sm text-muted-foreground">{student.studentId}</p>
                    </div>
                  </div>
                  <Badge className={performanceBadge.class}>
                    {performanceBadge.label}
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Average Score</span>
                    <span className="font-semibold">{avgScore}%</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Age</span>
                    <Badge variant="outline" className="text-xs">
                      {calculateAge(student.dateOfBirth)} years
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Section</span>
                    <span className="capitalize font-medium">{student.section}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Total Exams</span>
                    <span className="font-semibold">{studentResults.length}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-border/30">
                  <Button variant="outline" size="sm" className="w-full">
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
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