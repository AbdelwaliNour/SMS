import { useQuery } from '@tanstack/react-query';
import Layout from '@/components/layout/Layout';
import { DashboardSkeleton } from '@/components/dashboard/DashboardSkeleton';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Bell, Users, GraduationCap, School, TrendingUp, BarChart3, Target, FileCheck, MessageSquare, CalendarCheck, UserCheck, Clock, AlertCircle } from 'lucide-react';
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

      {/* Modern Academic Performance Section */}
      <div className="card-modern glass-morphism p-8 mb-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-blue-500/5"></div>
        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-3 bg-emerald-500/10 rounded-xl">
              <BarChart3 className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gradient">Academic Performance</h2>
              <p className="text-muted-foreground">Track student progress and achievements</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-morphism p-6 rounded-xl border border-border/30 hover:border-emerald-500/30 transition-all duration-300 group">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-emerald-500/10 rounded-lg">
                  <Target className="h-5 w-5 text-emerald-600" />
                </div>
                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                  Excellent
                </Badge>
              </div>
              <h3 className="font-semibold text-lg mb-2">Average Scores</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold text-emerald-600">85%</span>
                  <TrendingUp className="h-5 w-5 text-emerald-500" />
                </div>
                <Progress value={85} className="h-3 bg-emerald-500/10" />
                <p className="text-sm text-muted-foreground">Overall Performance</p>
              </div>
            </div>

            <div className="glass-morphism p-6 rounded-xl border border-border/30 hover:border-blue-500/30 transition-all duration-300 group">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <FileCheck className="h-5 w-5 text-blue-600" />
                </div>
                <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/20">
                  Outstanding
                </Badge>
              </div>
              <h3 className="font-semibold text-lg mb-2">Assignments</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold text-blue-600">92%</span>
                  <TrendingUp className="h-5 w-5 text-blue-500" />
                </div>
                <Progress value={92} className="h-3 bg-blue-500/10" />
                <p className="text-sm text-muted-foreground">Completion Rate</p>
              </div>
            </div>

            <div className="glass-morphism p-6 rounded-xl border border-border/30 hover:border-purple-500/30 transition-all duration-300 group">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <MessageSquare className="h-5 w-5 text-purple-600" />
                </div>
                <Badge variant="outline" className="bg-purple-500/10 text-purple-600 border-purple-500/20">
                  Good
                </Badge>
              </div>
              <h3 className="font-semibold text-lg mb-2">Participation</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold text-purple-600">78%</span>
                  <TrendingUp className="h-5 w-5 text-purple-500" />
                </div>
                <Progress value={78} className="h-3 bg-purple-500/10" />
                <p className="text-sm text-muted-foreground">Active Participation</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Attendance Overview Section */}
      <div className="card-modern glass-morphism p-8 mb-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-orange-500/5"></div>
        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-3 bg-green-500/10 rounded-xl">
              <CalendarCheck className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gradient">Today's Attendance</h2>
              <p className="text-muted-foreground">Real-time attendance tracking and insights</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="glass-morphism p-6 rounded-xl border border-border/30 hover:border-green-500/30 transition-all duration-300 group hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-500/10 rounded-xl">
                  <UserCheck className="h-6 w-6 text-green-600" />
                </div>
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              </div>
              <h3 className="font-semibold text-lg mb-2 text-green-600">Present</h3>
              <div className="space-y-2">
                <span className="text-3xl font-bold text-green-600">{stats?.students?.present || 0}</span>
                <p className="text-sm text-muted-foreground">Students in class</p>
                <div className="w-full bg-green-500/10 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full w-[90%]"></div>
                </div>
              </div>
            </div>

            <div className="glass-morphism p-6 rounded-xl border border-border/30 hover:border-amber-500/30 transition-all duration-300 group hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-amber-500/10 rounded-xl">
                  <Clock className="h-6 w-6 text-amber-600" />
                </div>
                <div className="w-3 h-3 bg-amber-500 rounded-full animate-pulse"></div>
              </div>
              <h3 className="font-semibold text-lg mb-2 text-amber-600">Late</h3>
              <div className="space-y-2">
                <span className="text-3xl font-bold text-amber-600">3</span>
                <p className="text-sm text-muted-foreground">Late arrivals</p>
                <div className="w-full bg-amber-500/10 rounded-full h-2">
                  <div className="bg-amber-500 h-2 rounded-full w-[15%]"></div>
                </div>
              </div>
            </div>

            <div className="glass-morphism p-6 rounded-xl border border-border/30 hover:border-red-500/30 transition-all duration-300 group hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-red-500/10 rounded-xl">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                </div>
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              </div>
              <h3 className="font-semibold text-lg mb-2 text-red-600">Absent</h3>
              <div className="space-y-2">
                <span className="text-3xl font-bold text-red-600">2</span>
                <p className="text-sm text-muted-foreground">Not present</p>
                <div className="w-full bg-red-500/10 rounded-full h-2">
                  <div className="bg-red-500 h-2 rounded-full w-[10%]"></div>
                </div>
              </div>
            </div>

            <div className="glass-morphism p-6 rounded-xl border border-border/30 hover:border-blue-500/30 transition-all duration-300 group hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-500/10 rounded-xl">
                  <School className="h-6 w-6 text-blue-600" />
                </div>
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              </div>
              <h3 className="font-semibold text-lg mb-2 text-blue-600">On Leave</h3>
              <div className="space-y-2">
                <span className="text-3xl font-bold text-blue-600">1</span>
                <p className="text-sm text-muted-foreground">Approved leave</p>
                <div className="w-full bg-blue-500/10 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full w-[5%]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Enrollment Trends Chart */}
        <div className="card-modern glass-morphism p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-cyan-500/5"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-blue-500/10 rounded-xl">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gradient">Enrollment Trends</h3>
                  <p className="text-muted-foreground">Monthly student registration</p>
                </div>
              </div>
              <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/20">
                +15% this month
              </Badge>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={[
                  { month: 'Jan', students: 120, target: 100 },
                  { month: 'Feb', students: 135, target: 120 },
                  { month: 'Mar', students: 148, target: 140 },
                  { month: 'Apr', students: 162, target: 160 },
                  { month: 'May', students: 178, target: 180 },
                  { month: 'Jun', students: 195, target: 200 }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="month" className="text-muted-foreground" />
                  <YAxis className="text-muted-foreground" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '12px',
                      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                    }} 
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="students" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={3}
                    dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 6 }}
                    name="Enrolled Students"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="target" 
                    stroke="hsl(var(--muted-foreground))" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ fill: 'hsl(var(--muted-foreground))', strokeWidth: 2, r: 4 }}
                    name="Target"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Grade Distribution Chart */}
        <div className="card-modern glass-morphism p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-teal-500/5"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-emerald-500/10 rounded-xl">
                  <BarChart3 className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gradient">Grade Distribution</h3>
                  <p className="text-muted-foreground">Student performance overview</p>
                </div>
              </div>
              <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                Excellent
              </Badge>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'A Grade', value: 35, color: '#10b981' },
                      { name: 'B Grade', value: 28, color: '#3b82f6' },
                      { name: 'C Grade', value: 22, color: '#f59e0b' },
                      { name: 'D Grade', value: 12, color: '#ef4444' },
                      { name: 'F Grade', value: 3, color: '#6b7280' }
                    ]}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    innerRadius={40}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {[
                      { name: 'A Grade', value: 35, color: '#10b981' },
                      { name: 'B Grade', value: 28, color: '#3b82f6' },
                      { name: 'C Grade', value: 22, color: '#f59e0b' },
                      { name: 'D Grade', value: 12, color: '#ef4444' },
                      { name: 'F Grade', value: 3, color: '#6b7280' }
                    ].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '12px',
                      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                    }} 
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Section */}
      <div className="card-modern glass-morphism p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5"></div>
        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-3 bg-purple-500/10 rounded-xl">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gradient">Quick Actions</h2>
              <p className="text-muted-foreground">Manage your school efficiently</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button 
              onClick={goToAddStudent}
              className="p-6 h-auto flex flex-col items-center space-y-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg transition-all duration-300 hover:scale-105"
            >
              <Users className="h-6 w-6" />
              <span className="font-medium">Add Student</span>
            </Button>
            
            <Button 
              variant="outline"
              className="p-6 h-auto flex flex-col items-center space-y-2 glass-morphism border-border/30 hover:border-emerald-500/30 transition-all duration-300 hover:scale-105"
            >
              <School className="h-6 w-6" />
              <span className="font-medium">New Class</span>
            </Button>
            
            <Button 
              variant="outline"
              className="p-6 h-auto flex flex-col items-center space-y-2 glass-morphism border-border/30 hover:border-amber-500/30 transition-all duration-300 hover:scale-105"
            >
              <FileCheck className="h-6 w-6" />
              <span className="font-medium">Reports</span>
            </Button>
            
            <Button 
              variant="outline"
              className="p-6 h-auto flex flex-col items-center space-y-2 glass-morphism border-border/30 hover:border-red-500/30 transition-all duration-300 hover:scale-105"
            >
              <Bell className="h-6 w-6" />
              <span className="font-medium">Alerts</span>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}