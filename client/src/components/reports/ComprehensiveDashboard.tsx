import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AnimatedSkeleton, CardSkeleton, ChartSkeleton } from '@/components/ui/animated-skeleton';

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

import {
  Download,
  TrendingUp,
  TrendingDown,
  Users,
  Percent,
  DollarSign,
  Calendar,
  GraduationCap,
  BookOpen,
  School
} from 'lucide-react';

// Colors from our theme
const COLORS = ['#00A1FF', '#00C445', '#FFBE00', '#F62929', '#757575'];

const ComprehensiveDashboard = () => {
  const [period, setPeriod] = useState('year');
  const [view, setView] = useState<'overview' | 'academic' | 'attendance' | 'finance'>('overview');
  
  // Fetch analytics data
  const { data: analytics, isLoading } = useQuery({
    queryKey: ['/api/analytics', { period }],
  });
  
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <CardSkeleton className="h-9 w-48" variant="shimmer" />
          <div className="flex gap-2">
            <CardSkeleton className="h-10 w-36" variant="shimmer" />
            <CardSkeleton className="h-10 w-24" variant="shimmer" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <CardSkeleton key={i} className="h-32" variant="shimmer" />
          ))}
        </div>
        
        <ChartSkeleton height={400} variant="shimmer" />
      </div>
    );
  }
  
  // Generate sample data for the component
  // This would be replaced with the actual API response in production
  
  // Generate enrollment data
  const generateEnrollmentData = () => {
    return {
      students: {
        total: 1245,
        change: 8.2,
        bySection: {
          primary: 582,
          secondary: 421,
          highschool: 242
        },
        byGender: {
          male: 630,
          female: 615
        }
      },
      overview: {
        teacherCount: 75,
        classroomCount: 45,
        studentTeacherRatio: 16.6,
        avgClassSize: 27.7
      },
      attendance: {
        overall: 94.2,
        bySection: {
          primary: 95.1,
          secondary: 93.7,
          highschool: 92.9
        },
        latestTrend: [
          { month: 'Jan', rate: 93.2 },
          { month: 'Feb', rate: 94.5 },
          { month: 'Mar', rate: 95.1 },
          { month: 'Apr', rate: 94.8 },
          { month: 'May', rate: 93.9 },
          { month: 'Jun', rate: 94.2 }
        ]
      },
      payments: {
        collection: 92.4,
        outstanding: 86500,
        bySection: {
          primary: 96.2,
          secondary: 91.5,
          highschool: 88.7
        },
        latestTrend: [
          { month: 'Jan', amount: 87000 },
          { month: 'Feb', amount: 92500 },
          { month: 'Mar', amount: 89000 },
          { month: 'Apr', amount: 97500 },
          { month: 'May', amount: 94000 },
          { month: 'Jun', amount: 95500 }
        ]
      },
      academics: {
        overallGrade: 81.5,
        bySection: {
          primary: 84.2,
          secondary: 79.8,
          highschool: 80.5
        },
        bySubject: [
          { subject: 'Mathematics', score: 78.5 },
          { subject: 'Science', score: 82.1 },
          { subject: 'English', score: 85.3 },
          { subject: 'History', score: 79.2 },
          { subject: 'Geography', score: 80.5 },
          { subject: 'Computer Science', score: 87.1 },
        ]
      }
    };
  };
  
  const dashboardData = generateEnrollmentData();
  
  // Format helpers
  const formatPercentage = (value: number) => `${value.toFixed(1)}%`;
  const formatNumber = (value: number) => value.toLocaleString();
  const formatCurrency = (value: number) => `$${value.toLocaleString()}`;
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h2 className="text-2xl font-homenaje text-gray-800 dark:text-gray-200">
          School Performance Dashboard
        </h2>
        
        <div className="flex flex-wrap gap-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="term">Current Term</SelectItem>
              <SelectItem value="year">Academic Year</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" className="gap-1">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex justify-between items-center">
              <span className="text-blue font-homenaje flex items-center">
                <Users className="h-4 w-4 mr-1" />
                Total Students
              </span>
              <Badge variant="outline">
                {dashboardData.students.change > 0 ? (
                  <TrendingUp className="h-3 w-3 text-green mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red mr-1" />
                )}
                {dashboardData.students.change > 0 ? '+' : ''}
                {dashboardData.students.change}%
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue">
              {formatNumber(dashboardData.students.total)}
            </div>
            <div className="mt-1 text-sm text-muted-foreground flex justify-between">
              <span>Across all sections</span>
              <span className="font-medium">{period === 'year' ? '2024-2025' : 'Current'}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-green">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex justify-between items-center">
              <span className="text-green font-homenaje flex items-center">
                <Percent className="h-4 w-4 mr-1" />
                Attendance Rate
              </span>
              <Badge variant="outline">School-wide</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green">
              {formatPercentage(dashboardData.attendance.overall)}
            </div>
            <Progress value={dashboardData.attendance.overall} className="h-2 mt-2" />
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-yellow">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex justify-between items-center">
              <span className="text-yellow font-homenaje flex items-center">
                <DollarSign className="h-4 w-4 mr-1" />
                Fee Collection
              </span>
              <Badge variant="outline">
                {formatPercentage(dashboardData.payments.collection)}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow">
              {formatCurrency(dashboardData.payments.latestTrend[dashboardData.payments.latestTrend.length - 1].amount)}
            </div>
            <div className="mt-1 text-sm text-muted-foreground flex justify-between">
              <span>Latest period</span>
              <span className="font-medium text-red">
                {formatCurrency(dashboardData.payments.outstanding)} outstanding
              </span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-blue">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex justify-between items-center">
              <span className="text-blue font-homenaje flex items-center">
                <GraduationCap className="h-4 w-4 mr-1" />
                Academic Score
              </span>
              <Badge variant="outline">Average</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue">
              {dashboardData.academics.overallGrade.toFixed(1)}
            </div>
            <Progress 
              value={dashboardData.academics.overallGrade} 
              className="h-2 mt-2"
              style={{
                background: 'linear-gradient(to right, #F62929 0%, #FFBE00 60%, #00C445 80%, #00A1FF 100%)'
              }}
            />
          </CardContent>
        </Card>
      </div>
      
      <Tabs 
        defaultValue={view} 
        value={view} 
        onValueChange={(v) => setView(v as 'overview' | 'academic' | 'attendance' | 'finance')}
        className="mt-8"
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="gap-1">
            <School className="h-4 w-4" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="academic" className="gap-1">
            <GraduationCap className="h-4 w-4" />
            <span className="hidden sm:inline">Academic</span>
          </TabsTrigger>
          <TabsTrigger value="attendance" className="gap-1">
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Attendance</span>
          </TabsTrigger>
          <TabsTrigger value="finance" className="gap-1">
            <DollarSign className="h-4 w-4" />
            <span className="hidden sm:inline">Finance</span>
          </TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-homenaje text-blue">
                  Student Distribution
                </CardTitle>
                <CardDescription>
                  Enrollment by section and gender
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <div className="grid grid-cols-2 gap-4 h-full">
                  <div>
                    <h4 className="text-sm font-medium mb-2">By Section</h4>
                    <ResponsiveContainer width="100%" height="85%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Primary', value: dashboardData.students.bySection.primary },
                            { name: 'Secondary', value: dashboardData.students.bySection.secondary },
                            { name: 'High School', value: dashboardData.students.bySection.highschool }
                          ]}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {[0, 1, 2].map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [formatNumber(value as number), 'Students']} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-2">By Gender</h4>
                    <ResponsiveContainer width="100%" height="85%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Male', value: dashboardData.students.byGender.male },
                            { name: 'Female', value: dashboardData.students.byGender.female }
                          ]}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          <Cell fill={COLORS[0]} />
                          <Cell fill={COLORS[2]} />
                        </Pie>
                        <Tooltip formatter={(value) => [formatNumber(value as number), 'Students']} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-homenaje text-green">
                  School Overview
                </CardTitle>
                <CardDescription>
                  Key indicators and ratios
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b">
                    <div className="flex items-center">
                      <Users className="h-5 w-5 text-blue mr-2" />
                      <span className="font-medium">Teachers</span>
                    </div>
                    <span className="text-xl font-bold">{dashboardData.overview.teacherCount}</span>
                  </div>
                  
                  <div className="flex justify-between items-center pb-2 border-b">
                    <div className="flex items-center">
                      <School className="h-5 w-5 text-yellow mr-2" />
                      <span className="font-medium">Classrooms</span>
                    </div>
                    <span className="text-xl font-bold">{dashboardData.overview.classroomCount}</span>
                  </div>
                  
                  <div className="flex justify-between items-center pb-2 border-b">
                    <div className="flex items-center">
                      <BookOpen className="h-5 w-5 text-green mr-2" />
                      <span className="font-medium">Student-Teacher Ratio</span>
                    </div>
                    <span className="text-xl font-bold">{dashboardData.overview.studentTeacherRatio.toFixed(1)}:1</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Users className="h-5 w-5 text-red mr-2" />
                      <span className="font-medium">Average Class Size</span>
                    </div>
                    <span className="text-xl font-bold">{dashboardData.overview.avgClassSize.toFixed(1)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg font-homenaje text-blue">
                  Multi-Metric Comparison
                </CardTitle>
                <CardDescription>
                  Key performance indicators by school section
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      {
                        name: 'Primary',
                        students: dashboardData.students.bySection.primary,
                        attendance: dashboardData.attendance.bySection.primary,
                        feesCollection: dashboardData.payments.bySection.primary,
                        academicScore: dashboardData.academics.bySection.primary
                      },
                      {
                        name: 'Secondary',
                        students: dashboardData.students.bySection.secondary,
                        attendance: dashboardData.attendance.bySection.secondary,
                        feesCollection: dashboardData.payments.bySection.secondary,
                        academicScore: dashboardData.academics.bySection.secondary
                      },
                      {
                        name: 'High School',
                        students: dashboardData.students.bySection.highschool,
                        attendance: dashboardData.attendance.bySection.highschool,
                        feesCollection: dashboardData.payments.bySection.highschool,
                        academicScore: dashboardData.academics.bySection.highschool
                      }
                    ]}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" orientation="left" stroke={COLORS[0]} />
                    <YAxis yAxisId="right" orientation="right" stroke={COLORS[1]} />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="students" name="Students" fill={COLORS[0]} />
                    <Bar yAxisId="right" dataKey="attendance" name="Attendance (%)" fill={COLORS[1]} />
                    <Bar yAxisId="right" dataKey="feesCollection" name="Fees Collection (%)" fill={COLORS[2]} />
                    <Bar yAxisId="right" dataKey="academicScore" name="Academic Score" fill={COLORS[3]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Academic Tab */}
        <TabsContent value="academic" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-homenaje text-blue">
                  Academic Performance by Section
                </CardTitle>
                <CardDescription>
                  Average scores across all subjects
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { name: 'Primary', score: dashboardData.academics.bySection.primary },
                      { name: 'Secondary', score: dashboardData.academics.bySection.secondary },
                      { name: 'High School', score: dashboardData.academics.bySection.highschool }
                    ]}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 100]} label={{ value: 'Score', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Bar dataKey="score" fill={COLORS[0]}>
                      {[0, 1, 2].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-homenaje text-green">
                  Subject Performance
                </CardTitle>
                <CardDescription>
                  Average scores by subject
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={dashboardData.academics.bySubject}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    layout="vertical"
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 100]} />
                    <YAxis type="category" dataKey="subject" width={100} />
                    <Tooltip />
                    <Bar dataKey="score" fill={COLORS[0]}>
                      {dashboardData.academics.bySubject.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.score >= 85 ? COLORS[1] : entry.score >= 75 ? COLORS[0] : COLORS[3]} 
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg font-homenaje text-blue">
                  Academic Insights
                </CardTitle>
                <CardDescription>
                  Key findings and recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-blue/5 border-blue/20">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-blue text-base font-homenaje">Strengths</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm">
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Computer Science scores are consistently high across all sections</li>
                        <li>English performance is above average</li>
                        <li>Primary section shows strong overall academic results</li>
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-yellow/5 border-yellow/20">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-yellow text-base font-homenaje">Areas for Improvement</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm">
                      <ul className="list-disc pl-5 space-y-1">
                        <li>History scores need attention across all sections</li>
                        <li>Secondary section mathematics results are below target</li>
                        <li>Gender gap in science performance requires further analysis</li>
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-green/5 border-green/20">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-green text-base font-homenaje">Recommendations</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm">
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Implement additional support for history in all sections</li>
                        <li>Enhance mathematics curriculum in secondary classes</li>
                        <li>Develop cross-section academic collaboration program</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Attendance Tab */}
        <TabsContent value="attendance" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-homenaje text-blue">
                  Attendance Trends
                </CardTitle>
                <CardDescription>
                  Monthly attendance rates
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={dashboardData.attendance.latestTrend}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[85, 100]} label={{ value: 'Attendance (%)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip formatter={(value) => [`${value}%`, 'Attendance Rate']} />
                    <Legend />
                    <Line type="monotone" dataKey="rate" stroke={COLORS[0]} activeDot={{ r: 8 }} strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-homenaje text-green">
                  Attendance by Section
                </CardTitle>
                <CardDescription>
                  Comparative analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Primary</span>
                      <span className="text-sm font-medium">{formatPercentage(dashboardData.attendance.bySection.primary)}</span>
                    </div>
                    <Progress value={dashboardData.attendance.bySection.primary} className="h-2.5" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Secondary</span>
                      <span className="text-sm font-medium">{formatPercentage(dashboardData.attendance.bySection.secondary)}</span>
                    </div>
                    <Progress value={dashboardData.attendance.bySection.secondary} className="h-2.5" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">High School</span>
                      <span className="text-sm font-medium">{formatPercentage(dashboardData.attendance.bySection.highschool)}</span>
                    </div>
                    <Progress value={dashboardData.attendance.bySection.highschool} className="h-2.5" />
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-bold">Overall</span>
                      <span className="text-sm font-bold">{formatPercentage(dashboardData.attendance.overall)}</span>
                    </div>
                    <Progress value={dashboardData.attendance.overall} className="h-3 bg-blue/20" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg font-homenaje text-blue">
                  Attendance Insights and Actions
                </CardTitle>
                <CardDescription>
                  Analysis and recommended interventions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4">
                    <h3 className="font-homenaje text-blue mb-2">Key Insights</h3>
                    <ul className="list-disc pl-5 space-y-2 text-sm">
                      <li>Primary section has the highest attendance rate at {formatPercentage(dashboardData.attendance.bySection.primary)}</li>
                      <li>March showed the peak attendance at {formatPercentage(dashboardData.attendance.latestTrend[2].rate)}</li>
                      <li>High School attendance has the most room for improvement</li>
                      <li>Overall attendance trend shows stability with minor seasonal fluctuations</li>
                    </ul>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h3 className="font-homenaje text-green mb-2">Recommended Actions</h3>
                    <ul className="list-disc pl-5 space-y-2 text-sm">
                      <li>Implement attendance recognition program for classes with 95%+ rates</li>
                      <li>Target high school with special engagement initiatives</li>
                      <li>Analyze correlation between attendance and academic performance</li>
                      <li>Review weather impact on attendance patterns</li>
                      <li>Enhance parent communication about attendance importance</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Finance Tab */}
        <TabsContent value="finance" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-homenaje text-blue">
                  Fee Collection Trends
                </CardTitle>
                <CardDescription>
                  Monthly collection amount
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={dashboardData.payments.latestTrend}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [formatCurrency(value as number), 'Amount Collected']} />
                    <Area type="monotone" dataKey="amount" stroke={COLORS[2]} fill={COLORS[2]} fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-homenaje text-yellow">
                  Collection Rate by Section
                </CardTitle>
                <CardDescription>
                  Percentage of fees collected
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Primary</span>
                      <span className="text-sm font-medium">{formatPercentage(dashboardData.payments.bySection.primary)}</span>
                    </div>
                    <Progress value={dashboardData.payments.bySection.primary} className="h-2.5" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Secondary</span>
                      <span className="text-sm font-medium">{formatPercentage(dashboardData.payments.bySection.secondary)}</span>
                    </div>
                    <Progress value={dashboardData.payments.bySection.secondary} className="h-2.5" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">High School</span>
                      <span className="text-sm font-medium">{formatPercentage(dashboardData.payments.bySection.highschool)}</span>
                    </div>
                    <Progress value={dashboardData.payments.bySection.highschool} className="h-2.5" />
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-bold">Overall</span>
                      <span className="text-sm font-bold">{formatPercentage(dashboardData.payments.collection)}</span>
                    </div>
                    <Progress value={dashboardData.payments.collection} className="h-3 bg-yellow/20" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg font-homenaje text-blue">
                  Financial Summary
                </CardTitle>
                <CardDescription>
                  Key financial metrics and recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="border rounded-lg p-4">
                    <h3 className="font-homenaje text-blue mb-2">Collection Status</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Total Due:</span>
                        <span className="font-medium">{formatCurrency(dashboardData.payments.outstanding / (1 - dashboardData.payments.collection / 100))}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Collected:</span>
                        <span className="font-medium text-green">{formatCurrency(dashboardData.payments.outstanding / (1 - dashboardData.payments.collection / 100) * dashboardData.payments.collection / 100)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Outstanding:</span>
                        <span className="font-medium text-red">{formatCurrency(dashboardData.payments.outstanding)}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-medium">
                        <span>Collection Rate:</span>
                        <span>{formatPercentage(dashboardData.payments.collection)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h3 className="font-homenaje text-yellow mb-2">Sectional Analysis</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Primary section has highest collection at {formatPercentage(dashboardData.payments.bySection.primary)}</li>
                      <li>High School shows lowest collection rate at {formatPercentage(dashboardData.payments.bySection.highschool)}</li>
                      <li>Collection trend is positive in recent months</li>
                      <li>April showed highest collection of {formatCurrency(dashboardData.payments.latestTrend[3].amount)}</li>
                    </ul>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h3 className="font-homenaje text-green mb-2">Recommendations</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Implement flexible payment options for High School</li>
                      <li>Send reminders for outstanding payments</li>
                      <li>Consider early payment incentives</li>
                      <li>Review fee structure for affordability</li>
                      <li>Explore scholarship options for financially challenged students</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Section Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-blue/5 border-blue/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-homenaje text-blue">
              Primary Section
            </CardTitle>
            <CardDescription>
              Grades 1-5
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue">
              {formatNumber(dashboardData.students.bySection.primary)}
            </div>
            <div className="flex justify-between text-sm mt-2">
              <span>{formatPercentage(dashboardData.students.bySection.primary / dashboardData.students.total * 100)} of total</span>
              <span>{(dashboardData.students.bySection.primary / dashboardData.overview.classroomCount * 3/7).toFixed(1)} avg. class size</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-green/5 border-green/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-homenaje text-green">
              Secondary Section
            </CardTitle>
            <CardDescription>
              Grades 6-8
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green">
              {formatNumber(dashboardData.students.bySection.secondary)}
            </div>
            <div className="flex justify-between text-sm mt-2">
              <span>{formatPercentage(dashboardData.students.bySection.secondary / dashboardData.students.total * 100)} of total</span>
              <span>{(dashboardData.students.bySection.secondary / dashboardData.overview.classroomCount * 3/5).toFixed(1)} avg. class size</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-yellow/5 border-yellow/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-homenaje text-yellow">
              High School Section
            </CardTitle>
            <CardDescription>
              Grades 9-12
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow">
              {formatNumber(dashboardData.students.bySection.highschool)}
            </div>
            <div className="flex justify-between text-sm mt-2">
              <span>{formatPercentage(dashboardData.students.bySection.highschool / dashboardData.students.total * 100)} of total</span>
              <span>{(dashboardData.students.bySection.highschool / dashboardData.overview.classroomCount * 3/4).toFixed(1)} avg. class size</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ComprehensiveDashboard;