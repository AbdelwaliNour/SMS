import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
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
  FileBarChart, 
  BarChart3,
  Download,
  Plus,
  Calendar,
  Users,
  GraduationCap,
  DollarSign,
  Building,
  PieChart,
  Target,
  Activity,
  FileText,
  Clock,
  Zap,
  Search,
  Eye,
  Star,
  School
} from 'lucide-react';

const Reports = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReportType, setSelectedReportType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Fetch data for statistics
  const { data: stats = {} } = useQuery({
    queryKey: ['/api/stats'],
  });

  // Mock report statistics
  const totalReports = 24;
  const generatedToday = 8;
  const scheduledReports = 6;
  const recentDownloads = 342;

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                <FileBarChart className="h-6 w-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Reports & Analytics
              </h1>
              <p className="text-muted-foreground flex items-center space-x-2">
                <BarChart3 className="h-4 w-4 text-indigo-500" />
                <span>Generate comprehensive insights and detailed reports</span>
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm" className="hover:bg-indigo-50 hover:border-indigo-200 dark:hover:bg-indigo-900/20 dark:hover:border-indigo-700 transition-all duration-200">
              <Download className="h-4 w-4 mr-2" />
              Export All
            </Button>
            <Button size="sm" className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 shadow-lg transition-all duration-200">
              <Plus className="h-4 w-4 mr-2" />
              Create Report
            </Button>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="glass-morphism border-border/30 hover:border-indigo-300/50 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-100/20 hover:-translate-y-1">
            <CardContent className="p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-indigo-400/10 to-indigo-600/10 rounded-full -translate-y-8 translate-x-8"></div>
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <FileBarChart className="h-4 w-4 text-indigo-600" />
                    <p className="text-sm font-medium text-muted-foreground">Total Reports</p>
                  </div>
                  <p className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-800 bg-clip-text text-transparent">{totalReports}</p>
                </div>
                <div className="flex items-center space-x-1">
                  <TrendingUp className="h-4 w-4 text-emerald-600" />
                  <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 shadow-sm">
                    +15%
                  </Badge>
                </div>
              </div>
              <div className="flex items-center justify-between mt-4 relative z-10">
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></div>
                  <p className="text-xs text-muted-foreground">Available reports</p>
                </div>
                <div className="text-xs font-medium text-indigo-600">Active</div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-morphism border-border/30 hover:border-purple-300/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-100/20 hover:-translate-y-1">
            <CardContent className="p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-400/10 to-purple-600/10 rounded-full -translate-y-8 translate-x-8"></div>
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <Zap className="h-4 w-4 text-purple-600" />
                    <p className="text-sm font-medium text-muted-foreground">Generated Today</p>
                  </div>
                  <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">{generatedToday}</p>
                </div>
                <div className="flex items-center space-x-1">
                  <TrendingUp className="h-4 w-4 text-emerald-600" />
                  <Badge className="bg-purple-100 text-purple-700 border-purple-200 shadow-sm">
                    +8%
                  </Badge>
                </div>
              </div>
              <div className="flex items-center justify-between mt-4 relative z-10">
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-purple-500 animate-pulse"></div>
                  <p className="text-xs text-muted-foreground">Fresh reports</p>
                </div>
                <div className="text-xs font-medium text-purple-600">Today</div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-morphism border-border/30 hover:border-pink-300/50 transition-all duration-300 hover:shadow-xl hover:shadow-pink-100/20 hover:-translate-y-1">
            <CardContent className="p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-pink-400/10 to-pink-600/10 rounded-full -translate-y-8 translate-x-8"></div>
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <Clock className="h-4 w-4 text-pink-600" />
                    <p className="text-sm font-medium text-muted-foreground">Scheduled</p>
                  </div>
                  <p className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-pink-800 bg-clip-text text-transparent">{scheduledReports}</p>
                </div>
                <div className="flex items-center space-x-1">
                  <TrendingUp className="h-4 w-4 text-emerald-600" />
                  <Badge className="bg-pink-100 text-pink-700 border-pink-200 shadow-sm">
                    +12%
                  </Badge>
                </div>
              </div>
              <div className="flex items-center justify-between mt-4 relative z-10">
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-pink-500 animate-pulse"></div>
                  <p className="text-xs text-muted-foreground">Auto-reports</p>
                </div>
                <div className="text-xs font-medium text-pink-600">Pending</div>
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
                    <p className="text-sm font-medium text-muted-foreground">Downloads</p>
                  </div>
                  <p className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent">{recentDownloads}</p>
                </div>
                <div className="flex items-center space-x-1">
                  <TrendingUp className="h-4 w-4 text-emerald-600" />
                  <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 shadow-sm">
                    +25%
                  </Badge>
                </div>
              </div>
              <div className="flex items-center justify-between mt-4 relative z-10">
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  <p className="text-xs text-muted-foreground">Recent activity</p>
                </div>
                <div className="text-xs font-medium text-emerald-600">Popular</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Report Categories */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <PieChart className="h-4 w-4 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Report Categories</h2>
              <p className="text-sm text-muted-foreground">Available report types and generation status</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="glass-morphism border-border/30 hover:border-emerald-300/50 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-100/20 hover:-translate-y-1 relative overflow-hidden">
              <CardContent className="p-6">
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-emerald-400/10 to-emerald-600/10 rounded-full -translate-y-6 translate-x-6"></div>
                <div className="flex items-center justify-between mb-4 relative z-10">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                      <GraduationCap className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <span className="text-lg font-bold text-emerald-700 dark:text-emerald-400">Academic</span>
                      <p className="text-xs text-muted-foreground">Performance & Results</p>
                    </div>
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 shadow-sm px-3 py-1">
                    8 reports
                  </Badge>
                </div>
                <div className="space-y-3 relative z-10">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">Generation Rate</span>
                    <span className="font-bold text-emerald-600">92%</span>
                  </div>
                  <Progress value={92} className="h-3 bg-emerald-100" />
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Student performance data</span>
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
                      <DollarSign className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <span className="text-lg font-bold text-blue-700 dark:text-blue-400">Financial</span>
                      <p className="text-xs text-muted-foreground">Revenue & Expenses</p>
                    </div>
                  </div>
                  <Badge className="bg-blue-100 text-blue-700 border-blue-200 shadow-sm px-3 py-1">
                    6 reports
                  </Badge>
                </div>
                <div className="space-y-3 relative z-10">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">Generation Rate</span>
                    <span className="font-bold text-blue-600">87%</span>
                  </div>
                  <Progress value={87} className="h-3 bg-blue-100" />
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Payment & billing data</span>
                    <span className="flex items-center space-x-1">
                      <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse"></div>
                      <span>Updated</span>
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-morphism border-border/30 hover:border-purple-300/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-100/20 hover:-translate-y-1 relative overflow-hidden">
              <CardContent className="p-6">
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-purple-400/10 to-purple-600/10 rounded-full -translate-y-6 translate-x-6"></div>
                <div className="flex items-center justify-between mb-4 relative z-10">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                      <Users className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <span className="text-lg font-bold text-purple-700 dark:text-purple-400">Operational</span>
                      <p className="text-xs text-muted-foreground">Attendance & Staff</p>
                    </div>
                  </div>
                  <Badge className="bg-purple-100 text-purple-700 border-purple-200 shadow-sm px-3 py-1">
                    10 reports
                  </Badge>
                </div>
                <div className="space-y-3 relative z-10">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">Generation Rate</span>
                    <span className="font-bold text-purple-600">95%</span>
                  </div>
                  <Progress value={95} className="h-3 bg-purple-100" />
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Daily operations data</span>
                    <span className="flex items-center space-x-1">
                      <div className="h-1.5 w-1.5 rounded-full bg-purple-500 animate-pulse"></div>
                      <span>Live</span>
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="reports" className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="reports">Reports</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="schedule">Schedule</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="reports" className="space-y-6">
            <ReportsTable 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedReportType={selectedReportType}
              setSelectedReportType={setSelectedReportType}
              selectedStatus={selectedStatus}
              setSelectedStatus={setSelectedStatus}
            />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Report Generation Trend */}
              <Card className="glass-morphism border-border/30">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-primary flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Report Generation Trend
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Report analytics visualization</p>
                      <p className="text-sm">Would integrate with Recharts</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Report Types Distribution */}
              <Card className="glass-morphism border-border/30">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-primary flex items-center">
                    <PieChart className="h-5 w-5 mr-2" />
                    Report Types Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                        <span className="text-sm">Academic Reports</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">45%</div>
                        <div className="text-xs text-muted-foreground">8 reports</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        <span className="text-sm">Financial Reports</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">25%</div>
                        <div className="text-xs text-muted-foreground">6 reports</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                        <span className="text-sm">Operational Reports</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">30%</div>
                        <div className="text-xs text-muted-foreground">10 reports</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="glass-morphism border-border/30 hover:border-primary/30 transition-all duration-300 cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-emerald-500/10 rounded-lg">
                      <GraduationCap className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Academic Performance</h3>
                      <p className="text-sm text-muted-foreground">Student results analysis</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full hover:bg-emerald-50 hover:border-emerald-200 dark:hover:bg-emerald-900/20 dark:hover:border-emerald-700 transition-colors">
                    <Download className="h-4 w-4 mr-2" />
                    Schedule Report
                  </Button>
                </CardContent>
              </Card>

              <Card className="glass-morphism border-border/30 hover:border-primary/30 transition-all duration-300 cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                      <DollarSign className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Financial Summary</h3>
                      <p className="text-sm text-muted-foreground">Revenue and expenses</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full hover:bg-blue-50 hover:border-blue-200 dark:hover:bg-blue-900/20 dark:hover:border-blue-700 transition-colors">
                    <Download className="h-4 w-4 mr-2" />
                    Schedule Report
                  </Button>
                </CardContent>
              </Card>

              <Card className="glass-morphism border-border/30 hover:border-primary/30 transition-all duration-300 cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-purple-500/10 rounded-lg">
                      <Calendar className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Attendance Report</h3>
                      <p className="text-sm text-muted-foreground">Daily attendance tracking</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full hover:bg-purple-50 hover:border-purple-200 dark:hover:bg-purple-900/20 dark:hover:border-purple-700 transition-colors">
                    <Download className="h-4 w-4 mr-2" />
                    Schedule Report
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

// Reports Table Component
interface ReportsTableProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedReportType: string;
  setSelectedReportType: (type: string) => void;
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
}

const ReportsTable = ({ 
  searchQuery, 
  setSearchQuery, 
  selectedReportType, 
  setSelectedReportType,
  selectedStatus,
  setSelectedStatus
}: ReportsTableProps) => {
  const mockReports = [
    {
      id: 1,
      name: "Monthly Academic Performance",
      type: "Academic",
      status: "Completed",
      generatedDate: "2025-01-01",
      size: "2.4 MB",
      downloads: 45,
      category: "Performance"
    },
    {
      id: 2,
      name: "Financial Summary Q4",
      type: "Financial",
      status: "In Progress",
      generatedDate: "2024-12-28",
      size: "1.8 MB",
      downloads: 32,
      category: "Revenue"
    },
    {
      id: 3,
      name: "Daily Attendance Report",
      type: "Operational",
      status: "Completed",
      generatedDate: "2025-01-01",
      size: "856 KB",
      downloads: 78,
      category: "Attendance"
    },
    {
      id: 4,
      name: "Student Demographics Overview",
      type: "Academic",
      status: "Scheduled",
      generatedDate: "2024-12-30",
      size: "1.2 MB",
      downloads: 23,
      category: "Demographics"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search reports by name or type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 glass-morphism border-border/30"
          />
        </div>
        
        <Select value={selectedReportType} onValueChange={setSelectedReportType}>
          <SelectTrigger className="w-full md:w-48 glass-morphism border-border/30">
            <SelectValue placeholder="All Report Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Report Types</SelectItem>
            <SelectItem value="academic">Academic</SelectItem>
            <SelectItem value="financial">Financial</SelectItem>
            <SelectItem value="operational">Operational</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-full md:w-48 glass-morphism border-border/30">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="scheduled">Scheduled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockReports.filter(report => {
          // Search filter
          const matchesSearch = searchQuery === '' || 
            report.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            report.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
            report.category.toLowerCase().includes(searchQuery.toLowerCase());
          
          // Type filter
          const matchesType = selectedReportType === 'all' || 
            report.type.toLowerCase() === selectedReportType.toLowerCase();
          
          // Status filter
          const matchesStatus = selectedStatus === 'all' || 
            report.status.toLowerCase().replace(' ', '-') === selectedStatus.toLowerCase();
          
          return matchesSearch && matchesType && matchesStatus;
        }).map((report) => {
          const getStatusBadge = (status: string) => {
            if (status === 'Completed') return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            if (status === 'In Progress') return 'bg-blue-100 text-blue-700 border-blue-200';
            if (status === 'Scheduled') return 'bg-orange-100 text-orange-700 border-orange-200';
            return 'bg-gray-100 text-gray-700 border-gray-200';
          };

          const getTypeColor = (type: string) => {
            if (type === 'Academic') return 'from-emerald-400 to-emerald-600';
            if (type === 'Financial') return 'from-blue-400 to-blue-600';
            if (type === 'Operational') return 'from-purple-400 to-purple-600';
            return 'from-gray-400 to-gray-600';
          };

          const getStatusIcon = (status: string) => {
            if (status === 'Completed') return <FileText className="h-4 w-4 text-white" />;
            if (status === 'In Progress') return <Activity className="h-4 w-4 text-white" />;
            if (status === 'Scheduled') return <Clock className="h-4 w-4 text-white" />;
            return <FileText className="h-4 w-4 text-white" />;
          };

          return (
            <Card key={report.id} className="glass-morphism border-border/30 hover:border-indigo-300/50 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-100/20 hover:-translate-y-1 relative overflow-hidden group">
              <CardContent className="p-4 relative">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-indigo-400/5 to-purple-500/5 rounded-full -translate-y-6 translate-x-6 group-hover:scale-110 transition-transform duration-300"></div>
                
                <div className="flex items-start justify-between mb-4 relative z-10">
                  <div className="flex items-center space-x-3">
                    <div className={`h-10 w-10 rounded-lg bg-gradient-to-br ${getTypeColor(report.type)} flex items-center justify-center shadow-sm`}>
                      {getStatusIcon(report.status)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-base text-gray-900 dark:text-gray-100">
                        {report.name}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs px-2 py-0.5">
                          {report.type}
                        </Badge>
                        <Badge variant="outline" className="text-xs px-2 py-0.5 bg-blue-50 text-blue-600 border-blue-200">
                          {report.category}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Badge className={`${getStatusBadge(report.status)} shadow-sm px-2 py-1 text-xs`}>
                    {report.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4 relative z-10">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-2 text-center">
                    <div className="text-sm font-bold text-blue-600">{report.size}</div>
                    <div className="text-xs text-muted-foreground">File Size</div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-900/20 dark:to-emerald-800/20 rounded-lg p-2 text-center">
                    <div className="text-sm font-bold text-emerald-600">{report.downloads}</div>
                    <div className="text-xs text-muted-foreground">Downloads</div>
                  </div>
                </div>

                <div className="space-y-2 mb-4 relative z-10">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Generated: {report.generatedDate}</span>
                    <span className="flex items-center space-x-1">
                      <Star className="h-3 w-3 text-yellow-500" />
                      <span>Popular</span>
                    </span>
                  </div>
                </div>

                <div className="flex space-x-2 relative z-10">
                  <Button variant="outline" size="sm" className="flex-1 hover:bg-indigo-50 hover:border-indigo-200 dark:hover:bg-indigo-900/20 dark:hover:border-indigo-700 transition-colors text-xs">
                    <Download className="h-3 w-3 mr-1" />
                    Download
                  </Button>
                  <Button size="sm" className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-sm">
                    <Eye className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {mockReports.length === 0 && (
        <Card className="glass-morphism border-border/20">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-4">
              <FileBarChart className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Generate Your First Report</h3>
            <p className="text-muted-foreground text-center mb-6">
              Create comprehensive reports to analyze your school's performance and operations.
            </p>
            <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-600 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Create Report
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Reports;