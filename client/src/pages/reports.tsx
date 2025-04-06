import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Layout from '@/components/layout/Layout';
import AnalyticsDashboard from '../components/reports/AnalyticsDashboard';
import ReportExportOptions from '../components/reports/ReportExportOptions';
import ReportScheduler from '../components/reports/ReportScheduler';
import ComprehensiveDashboard from '../components/reports/ComprehensiveDashboard';
import ComparativeAnalysis from '../components/reports/ComparativeAnalysis';

import { 
  FileBarChart, 
  Calendar, 
  Download, 
  Users, 
  GraduationCap, 
  School, 
  DollarSign, 
  BarChart2, 
  BarChart as BarChartIcon, 
  FileBarChart2, 
  PieChart as PieChartIcon 
} from 'lucide-react';

const Reports = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [analysisView, setAnalysisView] = useState('comprehensive');
  const [selectedReport, setSelectedReport] = useState('academic');
  
  const reportTypes = [
    { id: 'academic', name: 'Academic Performance', icon: <GraduationCap className="h-5 w-5" /> },
    { id: 'attendance', name: 'Attendance Report', icon: <Calendar className="h-5 w-5" /> },
    { id: 'financial', name: 'Financial Summary', icon: <DollarSign className="h-5 w-5" /> },
    { id: 'student', name: 'Student Demographics', icon: <Users className="h-5 w-5" /> },
    { id: 'classroom', name: 'Classroom Utilization', icon: <School className="h-5 w-5" /> },
  ];

  return (
    <Layout>
      <div className="container mx-auto py-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-homenaje text-gray-800 dark:text-gray-100">Reports & Analytics</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Generate insights and detailed reports
            </p>
          </div>
          {activeTab !== 'dashboard' && (
            <div className="mt-4 md:mt-0 flex space-x-2">
              <Select value={selectedReport} onValueChange={setSelectedReport}>
                <SelectTrigger className="w-[240px]">
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  {reportTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      <div className="flex items-center">
                        {type.icon}
                        <span className="ml-2">{type.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button className="bg-blue hover:bg-blue/90 text-white">
                <FileBarChart className="h-4 w-4 mr-2" />
                Generate
              </Button>
            </div>
          )}
        </div>

        <Separator />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="dashboard" className="data-[state=active]:bg-blue/10 data-[state=active]:text-blue">
                <FileBarChart className="h-4 w-4 mr-2" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="comparative" className="data-[state=active]:bg-blue/10 data-[state=active]:text-blue">
                <BarChartIcon className="h-4 w-4 mr-2" />
                Comparative
              </TabsTrigger>
              <TabsTrigger value="export" className="data-[state=active]:bg-blue/10 data-[state=active]:text-blue">
                <Download className="h-4 w-4 mr-2" />
                Export
              </TabsTrigger>
              <TabsTrigger value="schedule" className="data-[state=active]:bg-blue/10 data-[state=active]:text-blue">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="dashboard" className="border-none p-0">
            <div className="mb-4 flex justify-end">
              <Card className="p-1">
                <Tabs value={analysisView} onValueChange={setAnalysisView} className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="comprehensive" className="px-3 text-xs">
                      <FileBarChart2 className="h-3 w-3 mr-1" />
                      Comprehensive
                    </TabsTrigger>
                    <TabsTrigger value="detailed" className="px-3 text-xs">
                      <PieChartIcon className="h-3 w-3 mr-1" />
                      Detailed
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </Card>
            </div>
            
            {analysisView === 'comprehensive' ? (
              <ComprehensiveDashboard />
            ) : (
              <Card>
                <CardHeader className="bg-gradient-to-r from-blue/10 to-blue/5 rounded-t-lg">
                  <CardTitle className="text-xl font-homenaje text-blue">
                    Detailed Analytics Dashboard
                  </CardTitle>
                  <CardDescription>
                    Interactive data visualization and insights
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <ScrollArea className="h-[calc(100vh-350px)] pr-4">
                    <AnalyticsDashboard />
                  </ScrollArea>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="comparative" className="border-none p-0">
            <ComparativeAnalysis />
          </TabsContent>

          <TabsContent value="export" className="border-none p-0">
            <Card>
              <CardHeader className="bg-gradient-to-r from-blue/10 to-blue/5 rounded-t-lg">
                <CardTitle className="text-xl font-homenaje text-blue">
                  Export Reports
                </CardTitle>
                <CardDescription>
                  Generate and download reports in various formats
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="flex items-center space-x-3 p-4 bg-blue/5 rounded-lg">
                    {reportTypes.find(r => r.id === selectedReport)?.icon}
                    <div>
                      <h3 className="font-homenaje text-lg text-blue">
                        {reportTypes.find(r => r.id === selectedReport)?.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Configure export settings for this report
                      </p>
                    </div>
                  </div>
                  
                  <ReportExportOptions reportType={selectedReport} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schedule" className="border-none p-0">
            <Card>
              <CardHeader className="bg-gradient-to-r from-green/10 to-green/5 rounded-t-lg">
                <CardTitle className="text-xl font-homenaje text-green">
                  Schedule Reports
                </CardTitle>
                <CardDescription>
                  Set up automatic report generation and delivery
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="flex items-center space-x-3 p-4 bg-green/5 rounded-lg">
                    {reportTypes.find(r => r.id === selectedReport)?.icon}
                    <div>
                      <h3 className="font-homenaje text-lg text-green">
                        {reportTypes.find(r => r.id === selectedReport)?.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Configure schedule settings for this report
                      </p>
                    </div>
                  </div>
                  
                  <ReportScheduler reportType={selectedReport} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Reports;