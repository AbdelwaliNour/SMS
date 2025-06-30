import { useQuery } from '@tanstack/react-query';
import Layout from '@/components/layout/Layout';
import { DashboardSkeleton } from '@/components/dashboard/DashboardSkeleton';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Bell, Users, GraduationCap, School, TrendingUp } from 'lucide-react';
import StudentsTable from '@/components/students/StudentsTable';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function Dashboard() {
  const [, navigate] = useLocation();

  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['/api/stats'],
  });

  const goToAddStudent = () => {
    navigate('/add-student');
  };

  const generateLineData = () => [
    { month: 'Jan', students: 150, attendance: 92 },
    { month: 'Feb', students: 165, attendance: 94 },
    { month: 'Mar', students: 180, attendance: 91 },
    { month: 'Apr', students: 195, attendance: 95 },
    { month: 'May', students: 210, attendance: 93 },
    { month: 'Jun', students: 225, attendance: 96 },
  ];

  const generatePieData = () => [
    { name: 'Primary', value: stats?.students?.primary || 0 },
    { name: 'Secondary', value: stats?.students?.secondary || 0 },
    { name: 'High School', value: stats?.students?.highschool || 0 },
  ];

  if (isLoading) {
    return (
      <Layout>
        <DashboardSkeleton />
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="p-4 border border-red/20 bg-red/5 rounded-lg text-red mb-6">
          <h3 className="text-lg font-medium">Error Loading Dashboard Data</h3>
          <p>There was a problem loading the dashboard data. Please try refreshing the page.</p>
        </div>
        <StudentsTable onAddStudent={goToAddStudent} />
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Modern Welcome Section */}
      <div className="card-modern glass-morphism p-8 mb-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5"></div>
        <div className="relative z-10 flex items-center justify-between">
          <div className="space-y-3">
            <h1 className="text-4xl font-bold text-gradient mb-2">Welcome Back!</h1>
            <p className="text-muted-foreground text-lg">Here's what's happening in your school today</p>
            <div className="flex items-center space-x-4 mt-4">
              <Badge variant="secondary" className="px-3 py-1">
                <GraduationCap className="h-4 w-4 mr-2" />
                {stats?.students?.total || 0} Students Enrolled
              </Badge>
              <Badge variant="outline" className="px-3 py-1">
                <School className="h-4 w-4 mr-2" />
                Academic Year 2024-25
              </Badge>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="icon" className="rounded-xl hover:bg-primary/10 glass-morphism border-border/30">
              <Bell className="h-5 w-5" />
            </Button>
            <Avatar className="h-14 w-14 ring-2 ring-primary/20 ring-offset-2 ring-offset-background" />
          </div>
        </div>
      </div>

      {/* Modern Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="card-modern card-modern-hover relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <CardHeader className="pb-2 relative z-10">
            <div className="flex items-center justify-between">
              <div className="p-3 bg-blue-500/10 rounded-xl">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20 animate-pulse">
                <TrendingUp className="h-3 w-3 mr-1" />
                +12%
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats?.students?.total || 0}</h2>
              <p className="text-sm text-muted-foreground font-medium">Total Students</p>
              <Progress value={85} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-modern card-modern-hover relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <CardHeader className="pb-2 relative z-10">
            <div className="flex items-center justify-between">
              <div className="p-3 bg-green-500/10 rounded-xl">
                <GraduationCap className="h-6 w-6 text-green-600" />
              </div>
              <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/20">
                <TrendingUp className="h-3 w-3 mr-1" />
                98%
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-green-600 dark:text-green-400">{stats?.students?.present || 0}</h2>
              <p className="text-sm text-muted-foreground font-medium">Present Today</p>
              <Progress value={92} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-modern card-modern-hover relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <CardHeader className="pb-2 relative z-10">
            <div className="flex items-center justify-between">
              <div className="p-3 bg-yellow-500/10 rounded-xl">
                <School className="h-6 w-6 text-yellow-600" />
              </div>
              <Badge variant="outline" className="bg-purple-500/10 text-purple-600 border-purple-500/20">
                <TrendingUp className="h-3 w-3 mr-1" />
                +5
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{stats?.classrooms?.total || 0}</h2>
              <p className="text-sm text-muted-foreground font-medium">Total Classes</p>
              <Progress value={75} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-modern card-modern-hover relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <CardHeader className="pb-2 relative z-10">
            <div className="flex items-center justify-between">
              <div className="p-3 bg-red-500/10 rounded-xl">
                <Users className="h-6 w-6 text-red-600" />
              </div>
              <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">
                <TrendingUp className="h-3 w-3 mr-1" />
                +8%
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-red-600 dark:text-red-400">{stats?.employees?.total || 0}</h2>
              <p className="text-sm text-muted-foreground font-medium">Total Staff</p>
              <Progress value={68} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Academic Performance Card */}
      <Card className="mb-8 hover:shadow-lg transition-all duration-300">
        <CardHeader className="border-b border-border/20">
          <CardTitle className="font-aldrich text-xl text-blue">Academic Performance Overview</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h3 className="font-medium">Average Scores</h3>
              <Progress value={85} className="h-2" />
              <p className="text-sm text-muted-foreground">85% Overall Performance</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">Assignments Completed</h3>
              <Progress value={92} className="h-2" />
              <p className="text-sm text-muted-foreground">92% Completion Rate</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">Class Participation</h3>
              <Progress value={78} className="h-2" />
              <p className="text-sm text-muted-foreground">78% Active Participation</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attendance Overview Card */}
      <Card className="mb-8 hover:shadow-lg transition-all duration-300">
        <CardHeader className="border-b border-border/20">
          <CardTitle className="font-aldrich text-xl text-blue">Attendance Overview</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-green/10 rounded-lg">
              <h3 className="font-medium mb-2">Present Today</h3>
              <p className="text-2xl font-bold text-green">{stats?.students?.present || 0}</p>
            </div>
            <div className="p-4 bg-yellow/10 rounded-lg">
              <h3 className="font-medium mb-2">Late</h3>
              <p className="text-2xl font-bold text-yellow">3</p>
            </div>
            <div className="p-4 bg-red/10 rounded-lg">
              <h3 className="font-medium mb-2">Absent</h3>
              <p className="text-2xl font-bold text-red">2</p>
            </div>
            <div className="p-4 bg-blue/10 rounded-lg">
              <h3 className="font-medium mb-2">On Leave</h3>
              <p className="text-2xl font-bold text-blue">1</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Students Table */}
      <Card className="hover:shadow-lg transition-all duration-300">
        <CardHeader className="border-b border-border/20">
          <div className="flex items-center justify-between">
            <CardTitle className="font-aldrich text-xl text-blue">Recent Students</CardTitle>
            <Button onClick={goToAddStudent} className="bg-blue hover:bg-blue/90">
              Add Student
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <StudentsTable onAddStudent={goToAddStudent} />
        </CardContent>
      </Card>
    </Layout>
  );
}