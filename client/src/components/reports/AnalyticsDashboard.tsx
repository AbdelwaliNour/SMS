import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';

// Colors from our theme
const COLORS = ['#00A1FF', '#00C445', '#FFBE00', '#F62929', '#757575'];

// Define the analytics data structure for TypeScript
interface AnalyticsData {
  demographics: {
    genderDistribution: {
      male: number;
      female: number;
    };
    sectionDistribution: {
      primary: number;
      secondary: number;
      highschool: number;
    };
  };
  attendance: {
    overall: {
      present: number;
      absent: number;
      late: number;
    };
    bySection: {
      primary: {
        present: number;
        absent: number;
      };
      secondary: {
        present: number;
        absent: number;
      };
      highschool: {
        present: number;
        absent: number;
      };
    };
    trends: Array<{
      date: string;
      present: number;
      absent: number;
      late: number;
    }>;
  };
  academic: {
    averageScores: {
      overall: number;
      bySection: {
        primary: number;
        secondary: number;
        highschool: number;
      };
    };
    subjectPerformance: Array<{
      subject: string;
      average: number;
      highest: number;
      lowest: number;
    }>;
    performanceTrends: Array<{
      term: string;
      averageScore: number;
    }>;
  };
  financial: {
    feeCollection: {
      total: number;
      paid: number;
      partial: number;
      unpaid: number;
    };
    collectionBySection: {
      primary: number;
      secondary: number;
      highschool: number;
    };
    monthlyCollection: Array<{
      month: string;
      amount: number;
    }>;
  };
}

const AnalyticsDashboard = () => {
  const [activeTab, setActiveTab] = useState('academic');
  const [timeRange, setTimeRange] = useState('all');
  
  const { data: analytics, isLoading, error } = useQuery<AnalyticsData>({
    queryKey: ['/api/analytics', { period: timeRange }],
  });

  if (isLoading) {
    return <AnalyticsSkeleton />;
  }
  
  if (error) {
    return (
      <Card className="border-red bg-red/5">
        <CardHeader>
          <CardTitle className="text-red">Error Loading Analytics</CardTitle>
          <CardDescription>There was an error loading the analytics data. Please try again later.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-homenaje text-gray-800 dark:text-gray-200">Advanced Analytics</h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">Time Range:</span>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Last Week</SelectItem>
              <SelectItem value="month">Last Month</SelectItem>
              <SelectItem value="quarter">Last Quarter</SelectItem>
              <SelectItem value="year">Last Year</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="academic">Academic</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
        </TabsList>

        {/* Academic Analytics */}
        <TabsContent value="academic" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-homenaje text-blue">Subject Performance</CardTitle>
                <CardDescription>Average scores by subject</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={analytics?.academic.subjectPerformance}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="subject" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="average" fill="#00A1FF" name="Average Score" />
                    <Bar dataKey="highest" fill="#00C445" name="Highest Score" />
                    <Bar dataKey="lowest" fill="#F62929" name="Lowest Score" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-homenaje text-green">Performance Trend</CardTitle>
                <CardDescription>Average scores over time</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={analytics?.academic.performanceTrends}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="term" />
                    <YAxis domain={[60, 90]} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="averageScore" stroke="#00A1FF" strokeWidth={2} name="Average Score" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-homenaje text-yellow">Scores by Section</CardTitle>
              <CardDescription>Average score comparison by school section</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { 
                      name: 'Primary', 
                      average: analytics?.academic.averageScores.bySection.primary || 0
                    },
                    { 
                      name: 'Secondary', 
                      average: analytics?.academic.averageScores.bySection.secondary || 0
                    },
                    { 
                      name: 'High School', 
                      average: analytics?.academic.averageScores.bySection.highschool || 0
                    },
                  ]}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis dataKey="name" type="category" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="average" fill="#FFBE00" name="Average Score" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Attendance Analytics */}
        <TabsContent value="attendance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-homenaje text-blue">Attendance Distribution</CardTitle>
                <CardDescription>Overall attendance breakdown</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Present', value: analytics?.attendance.overall.present || 0 },
                        { name: 'Absent', value: analytics?.attendance.overall.absent || 0 },
                        { name: 'Late', value: analytics?.attendance.overall.late || 0 },
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      <Cell fill="#00C445" />
                      <Cell fill="#F62929" />
                      <Cell fill="#FFBE00" />
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-homenaje text-green">Attendance Trends</CardTitle>
                <CardDescription>Daily attendance patterns</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={analytics?.attendance.trends}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="present" 
                      stroke="#00C445" 
                      fill="#00C445" 
                      fillOpacity={0.3} 
                      name="Present" 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="absent" 
                      stroke="#F62929" 
                      fill="#F62929" 
                      fillOpacity={0.3} 
                      name="Absent" 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="late" 
                      stroke="#FFBE00" 
                      fill="#FFBE00" 
                      fillOpacity={0.3} 
                      name="Late" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-homenaje text-yellow">Attendance by Section</CardTitle>
              <CardDescription>Present vs absent students by section</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    {
                      name: 'Primary',
                      present: analytics?.attendance.bySection.primary.present || 0,
                      absent: analytics?.attendance.bySection.primary.absent || 0,
                    },
                    {
                      name: 'Secondary',
                      present: analytics?.attendance.bySection.secondary.present || 0,
                      absent: analytics?.attendance.bySection.secondary.absent || 0,
                    },
                    {
                      name: 'High School',
                      present: analytics?.attendance.bySection.highschool.present || 0,
                      absent: analytics?.attendance.bySection.highschool.absent || 0,
                    },
                  ]}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="present" fill="#00C445" name="Present" />
                  <Bar dataKey="absent" fill="#F62929" name="Absent" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Financial Analytics */}
        <TabsContent value="financial" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-homenaje text-blue">Fee Collection Status</CardTitle>
                <CardDescription>Payment status distribution</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Paid', value: analytics?.financial.feeCollection.paid || 0 },
                        { name: 'Partial', value: analytics?.financial.feeCollection.partial || 0 },
                        { name: 'Unpaid', value: analytics?.financial.feeCollection.unpaid || 0 },
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      <Cell fill="#00C445" />
                      <Cell fill="#FFBE00" />
                      <Cell fill="#F62929" />
                    </Pie>
                    <Tooltip formatter={(value) => ['$' + value, 'Amount']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-homenaje text-green">Monthly Collection</CardTitle>
                <CardDescription>Fee collection trend by month</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={analytics?.financial.monthlyCollection}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => ['$' + value, 'Amount']} />
                    <Legend />
                    <Line type="monotone" dataKey="amount" stroke="#00A1FF" strokeWidth={2} name="Collection Amount" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-homenaje text-yellow">Revenue by Section</CardTitle>
              <CardDescription>Fee collection by school section</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { name: 'Primary', amount: analytics?.financial.collectionBySection.primary || 0 },
                    { name: 'Secondary', amount: analytics?.financial.collectionBySection.secondary || 0 },
                    { name: 'High School', amount: analytics?.financial.collectionBySection.highschool || 0 },
                  ]}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => ['$' + value, 'Amount']} />
                  <Legend />
                  <Bar dataKey="amount" fill="#FFBE00" name="Collection Amount" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Loading skeleton for analytics
const AnalyticsSkeleton = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-10 w-48" />
      </div>

      <Skeleton className="h-12 w-full" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-32" />
          </CardHeader>
          <CardContent className="h-80">
            <Skeleton className="h-full w-full" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-32" />
          </CardHeader>
          <CardContent className="h-80">
            <Skeleton className="h-full w-full" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-32" />
        </CardHeader>
        <CardContent className="h-80">
          <Skeleton className="h-full w-full" />
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsDashboard;