import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { AnimatedSkeleton, CardSkeleton, ChartSkeleton } from '@/components/ui/animated-skeleton';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from 'recharts';

import { FileBarChart, Download, Calendar, BarChart2, BarChart as BarChartIcon, PieChart as PieChartIcon, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';

// Colors from our theme
const COLORS = ['#00A1FF', '#00C445', '#FFBE00', '#F62929', '#757575'];

interface StudentPerformanceAnalyticsProps {
  studentId?: number;
}

const StudentPerformanceAnalytics = ({ studentId }: StudentPerformanceAnalyticsProps) => {
  const [period, setPeriod] = useState('year');
  const [activeChart, setActiveChart] = useState('grades');
  
  // Fetch student performance data
  const { data: performanceData, isLoading } = useQuery({
    queryKey: studentId 
      ? ['/api/results/student', studentId, { period }] 
      : ['/api/results', { period }],
    enabled: studentId !== undefined,
  });
  
  // Fetch student data if studentId is provided
  const { data: student } = useQuery({
    queryKey: ['/api/students', studentId],
    enabled: !!studentId,
  });
  
  // Fetch overall analytics if no studentId is provided
  const { data: analytics, isLoading: isLoadingAnalytics } = useQuery({
    queryKey: ['/api/analytics', { type: 'academic', period }],
    enabled: !studentId,
  });

  if (isLoading || isLoadingAnalytics) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <CardSkeleton className="h-9 w-64" variant="shimmer" />
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
        
        <ChartSkeleton height={350} variant="shimmer" />
      </div>
    );
  }
  
  // Generate sample data for the component
  // This would be replaced with real API data in production
  
  // Sample student grade data
  const generateGradesData = () => {
    if (studentId) {
      // Individual student data
      return [
        { subject: 'Mathematics', score: 82, average: 78 },
        { subject: 'Science', score: 75, average: 76 },
        { subject: 'English', score: 88, average: 80 },
        { subject: 'History', score: 71, average: 73 },
        { subject: 'Geography', score: 85, average: 79 },
        { subject: 'Computer Science', score: 92, average: 81 },
      ];
    } else {
      // Overall class/school data
      return [
        { subject: 'Mathematics', primary: 75, secondary: 78, highschool: 82 },
        { subject: 'Science', primary: 72, secondary: 79, highschool: 85 },
        { subject: 'English', primary: 80, secondary: 82, highschool: 87 },
        { subject: 'History', primary: 71, secondary: 74, highschool: 76 },
        { subject: 'Geography', primary: 73, secondary: 77, highschool: 80 },
        { subject: 'Computer Science', primary: 78, secondary: 83, highschool: 89 },
      ];
    }
  };
  
  // Sample attendance data
  const generateAttendanceData = () => {
    if (studentId) {
      return [
        { month: 'Jan', attendance: 95, average: 92 },
        { month: 'Feb', attendance: 98, average: 93 },
        { month: 'Mar', attendance: 92, average: 94 },
        { month: 'Apr', attendance: 90, average: 91 },
        { month: 'May', attendance: 96, average: 93 },
        { month: 'Jun', attendance: 97, average: 92 },
      ];
    } else {
      return [
        { month: 'Jan', primary: 92, secondary: 94, highschool: 91 },
        { month: 'Feb', primary: 93, secondary: 95, highschool: 92 },
        { month: 'Mar', primary: 94, secondary: 93, highschool: 94 },
        { month: 'Apr', primary: 91, secondary: 92, highschool: 93 },
        { month: 'May', primary: 93, secondary: 96, highschool: 95 },
        { month: 'Jun', primary: 92, secondary: 94, highschool: 93 },
      ];
    }
  };
  
  // Sample behavior data
  const generateBehaviorData = () => {
    if (studentId) {
      return [
        { category: 'Participation', value: 85 },
        { category: 'Teamwork', value: 78 },
        { category: 'Discipline', value: 92 },
        { category: 'Leadership', value: 65 },
        { category: 'Communication', value: 80 },
      ];
    } else {
      return [
        { category: 'Participation', primary: 75, secondary: 80, highschool: 85 },
        { category: 'Teamwork', primary: 80, secondary: 78, highschool: 76 },
        { category: 'Discipline', primary: 90, secondary: 85, highschool: 80 },
        { category: 'Leadership', primary: 60, secondary: 70, highschool: 80 },
        { category: 'Communication', primary: 70, secondary: 75, highschool: 85 },
      ];
    }
  };
  
  // Sample improvement over time data
  const generateImprovementData = () => {
    if (studentId) {
      return [
        { term: 'Term 1', score: 72 },
        { term: 'Term 2', score: 75 },
        { term: 'Term 3', score: 80 },
        { term: 'Term 4', score: 83 },
        { term: 'Term 5', score: 85 },
        { term: 'Term 6', score: 87 },
      ];
    } else {
      return [
        { term: 'Term 1', primary: 70, secondary: 75, highschool: 80 },
        { term: 'Term 2', primary: 72, secondary: 77, highschool: 82 },
        { term: 'Term 3', primary: 73, secondary: 78, highschool: 83 },
        { term: 'Term 4', primary: 75, secondary: 80, highschool: 85 },
        { term: 'Term 5', primary: 76, secondary: 81, highschool: 86 },
        { term: 'Term 6', primary: 78, secondary: 82, highschool: 88 },
      ];
    }
  };
  
  // Generate data based on active chart
  const getChartData = () => {
    switch (activeChart) {
      case 'grades':
        return generateGradesData();
      case 'attendance':
        return generateAttendanceData();
      case 'behavior':
        return generateBehaviorData();
      case 'improvement':
        return generateImprovementData();
      default:
        return [];
    }
  };
  
  // Get student summary metrics
  const getStudentSummary = () => {
    if (studentId) {
      const avgGrade = generateGradesData().reduce((sum, item) => sum + item.score, 0) / generateGradesData().length;
      const avgAttendance = generateAttendanceData().reduce((sum, item) => sum + item.attendance, 0) / generateAttendanceData().length;
      const behaviorAvg = generateBehaviorData().reduce((sum, item) => sum + item.value, 0) / generateBehaviorData().length;
      
      // Calculate improvement
      const improvementData = generateImprovementData();
      const improvement = improvementData[improvementData.length - 1].score - improvementData[0].score;
      
      return {
        avgGrade,
        avgAttendance,
        behaviorAvg,
        improvement
      };
    }
    
    return null;
  };
  
  // Get overall metrics for school-wide view
  const getOverallMetrics = () => {
    const gradesBySection = {
      primary: generateGradesData().reduce((sum, item) => sum + item.primary, 0) / generateGradesData().length,
      secondary: generateGradesData().reduce((sum, item) => sum + item.secondary, 0) / generateGradesData().length,
      highschool: generateGradesData().reduce((sum, item) => sum + item.highschool, 0) / generateGradesData().length,
    };
    
    const attendanceBySection = {
      primary: generateAttendanceData().reduce((sum, item) => sum + item.primary, 0) / generateAttendanceData().length,
      secondary: generateAttendanceData().reduce((sum, item) => sum + item.secondary, 0) / generateAttendanceData().length,
      highschool: generateAttendanceData().reduce((sum, item) => sum + item.highschool, 0) / generateAttendanceData().length,
    };
    
    const behaviorBySection = {
      primary: generateBehaviorData().reduce((sum, item) => sum + item.primary, 0) / generateBehaviorData().length,
      secondary: generateBehaviorData().reduce((sum, item) => sum + item.secondary, 0) / generateBehaviorData().length,
      highschool: generateBehaviorData().reduce((sum, item) => sum + item.highschool, 0) / generateBehaviorData().length,
    };
    
    return {
      gradesBySection,
      attendanceBySection,
      behaviorBySection,
      overallGrade: (gradesBySection.primary + gradesBySection.secondary + gradesBySection.highschool) / 3
    };
  };
  
  const studentSummary = studentId ? getStudentSummary() : null;
  const overallMetrics = !studentId ? getOverallMetrics() : null;
  
  // Format helper
  const formatPercentage = (value: number) => `${value.toFixed(1)}%`;
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h2 className="text-2xl font-homenaje text-gray-800 dark:text-gray-200">
          {studentId && student
            ? `${student.firstName} ${student.lastName}'s Performance`
            : 'Student Performance Analytics'}
        </h2>
        
        <div className="flex flex-wrap gap-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="term">Current Term</SelectItem>
              <SelectItem value="year">Academic Year</SelectItem>
              <SelectItem value="all">All Records</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" className="gap-1">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>
      
      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {studentId && studentSummary ? (
          <>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex justify-between items-center">
                  <span className="text-blue font-homenaje">Average Grade</span>
                  <Badge variant={studentSummary.avgGrade >= 80 ? "success" : studentSummary.avgGrade >= 70 ? "warning" : "destructive"}>
                    {formatPercentage(studentSummary.avgGrade)}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Progress value={studentSummary.avgGrade} className="h-2 mt-1" />
                <p className="text-sm mt-2 text-muted-foreground">
                  {studentSummary.avgGrade >= 80 
                    ? 'Excellent performance overall'
                    : studentSummary.avgGrade >= 70
                      ? 'Good performance with room for improvement'
                      : 'Needs significant improvement'}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex justify-between items-center">
                  <span className="text-green font-homenaje">Attendance Rate</span>
                  <Badge variant={studentSummary.avgAttendance >= 95 ? "success" : studentSummary.avgAttendance >= 90 ? "warning" : "destructive"}>
                    {formatPercentage(studentSummary.avgAttendance)}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Progress value={studentSummary.avgAttendance} className="h-2 mt-1" />
                <p className="text-sm mt-2 text-muted-foreground">
                  {studentSummary.avgAttendance >= 95 
                    ? 'Excellent attendance record'
                    : studentSummary.avgAttendance >= 90
                      ? 'Good attendance with few absences'
                      : 'Attendance needs improvement'}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex justify-between items-center">
                  <span className="text-yellow font-homenaje">Behavior Score</span>
                  <Badge variant={studentSummary.behaviorAvg >= 80 ? "success" : studentSummary.behaviorAvg >= 70 ? "warning" : "destructive"}>
                    {formatPercentage(studentSummary.behaviorAvg)}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Progress value={studentSummary.behaviorAvg} className="h-2 mt-1" />
                <p className="text-sm mt-2 text-muted-foreground">
                  {studentSummary.behaviorAvg >= 80 
                    ? 'Excellent behavior and participation'
                    : studentSummary.behaviorAvg >= 70
                      ? 'Good behavior with room for improvement'
                      : 'Behavior needs significant improvement'}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex justify-between items-center">
                  <span className="text-blue font-homenaje">Progress</span>
                  <div className="flex items-center">
                    {studentSummary.improvement > 0 ? (
                      <ArrowUpRight className="h-4 w-4 text-green mr-1" />
                    ) : studentSummary.improvement < 0 ? (
                      <ArrowDownRight className="h-4 w-4 text-red mr-1" />
                    ) : null}
                    <Badge variant={studentSummary.improvement > 5 ? "success" : studentSummary.improvement > 0 ? "warning" : "destructive"}>
                      {studentSummary.improvement > 0 ? '+' : ''}{studentSummary.improvement.toFixed(1)}
                    </Badge>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Progress value={(studentSummary.improvement + 20) * 2.5} className="h-2 mt-1" />
                <p className="text-sm mt-2 text-muted-foreground">
                  {studentSummary.improvement > 10
                    ? 'Outstanding improvement over time'
                    : studentSummary.improvement > 5
                      ? 'Good progress over the academic period'
                      : studentSummary.improvement > 0
                        ? 'Showing some improvement'
                        : 'No significant progress detected'}
                </p>
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex justify-between items-center">
                  <span className="text-blue font-homenaje">Primary Grades</span>
                  <Badge variant="outline">
                    {formatPercentage(overallMetrics?.gradesBySection.primary || 0)}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Progress value={overallMetrics?.gradesBySection.primary} className="h-2 mt-1" />
                <div className="flex justify-between items-center mt-2">
                  <p className="text-sm text-muted-foreground">Average across all subjects</p>
                  <Badge variant="secondary">{overallMetrics?.gradesBySection.primary.toFixed(0)}/100</Badge>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex justify-between items-center">
                  <span className="text-green font-homenaje">Secondary Grades</span>
                  <Badge variant="outline">
                    {formatPercentage(overallMetrics?.gradesBySection.secondary || 0)}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Progress value={overallMetrics?.gradesBySection.secondary} className="h-2 mt-1" />
                <div className="flex justify-between items-center mt-2">
                  <p className="text-sm text-muted-foreground">Average across all subjects</p>
                  <Badge variant="secondary">{overallMetrics?.gradesBySection.secondary.toFixed(0)}/100</Badge>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex justify-between items-center">
                  <span className="text-yellow font-homenaje">High School Grades</span>
                  <Badge variant="outline">
                    {formatPercentage(overallMetrics?.gradesBySection.highschool || 0)}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Progress value={overallMetrics?.gradesBySection.highschool} className="h-2 mt-1" />
                <div className="flex justify-between items-center mt-2">
                  <p className="text-sm text-muted-foreground">Average across all subjects</p>
                  <Badge variant="secondary">{overallMetrics?.gradesBySection.highschool.toFixed(0)}/100</Badge>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex justify-between items-center">
                  <span className="text-blue font-homenaje">Overall Performance</span>
                  <Badge variant={overallMetrics?.overallGrade! >= 80 ? "success" : "warning"}>
                    {formatPercentage(overallMetrics?.overallGrade || 0)}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Progress value={overallMetrics?.overallGrade} className="h-2 mt-1" />
                <div className="flex justify-between items-center mt-2">
                  <p className="text-sm text-muted-foreground">Average across all sections</p>
                  <Badge variant="secondary">{overallMetrics?.overallGrade.toFixed(1)}/100</Badge>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
      
      {/* Chart Tabs */}
      <Tabs value={activeChart} onValueChange={setActiveChart} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="grades" className="gap-1">
            <BarChart2 className="h-4 w-4" />
            <span className="hidden sm:inline">Grades</span>
          </TabsTrigger>
          <TabsTrigger value="attendance" className="gap-1">
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Attendance</span>
          </TabsTrigger>
          <TabsTrigger value="behavior" className="gap-1">
            <PieChartIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Behavior</span>
          </TabsTrigger>
          <TabsTrigger value="improvement" className="gap-1">
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">Progress</span>
          </TabsTrigger>
        </TabsList>
      
        <TabsContent value="grades">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-homenaje text-blue">
                {studentId ? 'Subject Performance' : 'Subject Performance by Section'}
              </CardTitle>
              <CardDescription>
                {studentId 
                  ? 'Performance comparison with class average by subject' 
                  : 'Performance comparison by section across subjects'}
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={getChartData()} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="subject" />
                  <YAxis domain={[0, 100]} label={{ value: 'Score (0-100)', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Legend />
                  {studentId ? (
                    <>
                      <Bar dataKey="score" name="Student Score" fill={COLORS[0]} />
                      <Bar dataKey="average" name="Class Average" fill={COLORS[2]} />
                    </>
                  ) : (
                    <>
                      <Bar dataKey="primary" name="Primary" fill={COLORS[0]} />
                      <Bar dataKey="secondary" name="Secondary" fill={COLORS[1]} />
                      <Bar dataKey="highschool" name="High School" fill={COLORS[2]} />
                    </>
                  )}
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="attendance">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-homenaje text-green">
                {studentId ? 'Attendance History' : 'Attendance by Section'}
              </CardTitle>
              <CardDescription>
                {studentId 
                  ? 'Monthly attendance record compared to class average' 
                  : 'Monthly attendance record by section'}
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={getChartData()} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[80, 100]} label={{ value: 'Attendance (%)', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Legend />
                  {studentId ? (
                    <>
                      <Line type="monotone" dataKey="attendance" name="Student Attendance" stroke={COLORS[0]} activeDot={{ r: 8 }} />
                      <Line type="monotone" dataKey="average" name="Class Average" stroke={COLORS[2]} />
                    </>
                  ) : (
                    <>
                      <Line type="monotone" dataKey="primary" name="Primary" stroke={COLORS[0]} />
                      <Line type="monotone" dataKey="secondary" name="Secondary" stroke={COLORS[1]} />
                      <Line type="monotone" dataKey="highschool" name="High School" stroke={COLORS[2]} />
                    </>
                  )}
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="behavior">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-homenaje text-yellow">
                {studentId ? 'Behavior Assessment' : 'Behavior Assessment by Section'}
              </CardTitle>
              <CardDescription>
                {studentId 
                  ? 'Performance across different behavioral categories' 
                  : 'Performance across different behavioral categories by section'}
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                {studentId ? (
                  <RadarChart outerRadius={140} data={getChartData()}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="category" />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                    <Radar name="Student" dataKey="value" stroke={COLORS[0]} fill={COLORS[0]} fillOpacity={0.6} />
                    <Legend />
                  </RadarChart>
                ) : (
                  <RadarChart outerRadius={140} data={getChartData()}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="category" />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                    <Radar name="Primary" dataKey="primary" stroke={COLORS[0]} fill={COLORS[0]} fillOpacity={0.6} />
                    <Radar name="Secondary" dataKey="secondary" stroke={COLORS[1]} fill={COLORS[1]} fillOpacity={0.6} />
                    <Radar name="High School" dataKey="highschool" stroke={COLORS[2]} fill={COLORS[2]} fillOpacity={0.6} />
                    <Legend />
                  </RadarChart>
                )}
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="improvement">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-homenaje text-blue">
                {studentId ? 'Performance Trend' : 'Performance Trend by Section'}
              </CardTitle>
              <CardDescription>
                {studentId 
                  ? 'Progression over academic terms' 
                  : 'Progression over academic terms by section'}
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={getChartData()} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="term" />
                  <YAxis domain={[60, 90]} label={{ value: 'Overall Score', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Legend />
                  {studentId ? (
                    <Line type="monotone" dataKey="score" name="Overall Score" stroke={COLORS[0]} strokeWidth={2} />
                  ) : (
                    <>
                      <Line type="monotone" dataKey="primary" name="Primary" stroke={COLORS[0]} />
                      <Line type="monotone" dataKey="secondary" name="Secondary" stroke={COLORS[1]} />
                      <Line type="monotone" dataKey="highschool" name="High School" stroke={COLORS[2]} />
                    </>
                  )}
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {studentId && (
        <Card className="border-l-4 border-l-blue">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-homenaje text-blue">Performance Analysis</CardTitle>
            <CardDescription>Insights and recommendations based on performance data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium">Strengths:</h4>
                <ul className="ml-5 list-disc text-sm">
                  <li>Excellent performance in Computer Science and English</li>
                  <li>Consistent attendance record</li>
                  <li>Good progress over the last three terms</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium">Areas for Improvement:</h4>
                <ul className="ml-5 list-disc text-sm">
                  <li>Mathematics scores are below potential - consider additional support</li>
                  <li>History scores need attention</li>
                  <li>Leadership skills could be further developed</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium">Recommendations:</h4>
                <ul className="ml-5 list-disc text-sm">
                  <li>Consider additional tutorial sessions for History</li>
                  <li>Encourage participation in leadership activities</li>
                  <li>Continue strong performance in Computer Science with advanced projects</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StudentPerformanceAnalytics;