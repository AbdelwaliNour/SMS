
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
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-aldrich mb-2 text-gradient bg-clip-text text-transparent bg-gradient-to-r from-blue to-purple-600">Welcome Back!</h1>
            <p className="text-gray-600 dark:text-gray-400">Here's what's happening in your school today</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="icon" className="rounded-xl hover:bg-blue/10">
              <Bell className="h-5 w-5" />
            </Button>
            <Avatar className="h-12 w-12 ring-2 ring-blue/20" />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue/20 hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="p-2 bg-blue/10 rounded-xl">
                <Users className="h-5 w-5 text-blue" />
              </div>
              <Badge variant="outline" className="bg-green/10 text-green border-green/20">
                <TrendingUp className="h-4 w-4 mr-1" />
                +12%
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <h2 className="text-3xl font-bold text-blue">{stats?.students?.total || 0}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Students</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green/20">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <GraduationCap className="h-5 w-5 text-green" />
              <TrendingUp className="h-4 w-4 text-green" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <h2 className="text-3xl font-bold">{stats?.students?.present || 0}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Present Today</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border-yellow/20">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <School className="h-5 w-5 text-yellow" />
              <TrendingUp className="h-4 w-4 text-green" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <h2 className="text-3xl font-bold">{stats?.classrooms?.total || 0}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Classes</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-red/20">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <Users className="h-5 w-5 text-red" />
              <TrendingUp className="h-4 w-4 text-green" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <h2 className="text-3xl font-bold">{stats?.employees?.total || 0}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Staff</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="font-aldrich text-xl text-blue">Enrollment Trends</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={generateLineData()}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="students" stroke="#00A1FF" strokeWidth={2} dot={{ fill: '#00A1FF' }} />
                <Line type="monotone" dataKey="attendance" stroke="#00C445" strokeWidth={2} dot={{ fill: '#00C445' }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="font-aldrich text-xl text-green">Student Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={generatePieData()}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {generatePieData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={['#00A1FF', '#00C445', '#FFBE00'][index % 3]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

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
