import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Layout from '@/components/layout/Layout';

import { 
  FileBarChart, 
  Calendar, 
  Download, 
  Users, 
  GraduationCap, 
  School, 
  DollarSign 
} from 'lucide-react';

const Reports = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
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

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="export">Export & Schedule</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reportTypes.map((type) => (
                <Card key={type.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader>
                    <CardTitle className="flex items-center text-lg">
                      {type.icon}
                      <span className="ml-2">{type.name}</span>
                    </CardTitle>
                    <CardDescription>
                      Generate detailed {type.name.toLowerCase()} reports
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Generate Report
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Analytics Dashboard</CardTitle>
                <CardDescription>
                  Comprehensive analytics and insights
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Analytics dashboard coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="export" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Export & Schedule</CardTitle>
                <CardDescription>
                  Schedule automatic reports and export options
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Export and scheduling options coming soon</p>
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