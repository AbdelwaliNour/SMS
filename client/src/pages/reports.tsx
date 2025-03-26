import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { formatDate } from '@/lib/utils';

export default function Reports() {
  const [activeTab, setActiveTab] = useState('academic');
  const [reportType, setReportType] = useState('results');
  const [selectedPeriod, setSelectedPeriod] = useState('term1');
  const [selectedClass, setSelectedClass] = useState('All');
  const [selectedSection, setSelectedSection] = useState('All');
  
  const { data: stats, isLoading } = useQuery({
    queryKey: ['/api/stats'],
  });
  
  // Generate report function
  const generateReport = () => {
    // This would trigger a real report generation in a full implementation
    alert('Generating report...');
    console.log({
      type: reportType,
      period: selectedPeriod,
      class: selectedClass,
      section: selectedSection
    });
  };
  
  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-homenaje">Reports & Analysis</h1>
        
        {/* Report Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-homenaje text-blue">Academic Reports</CardTitle>
              <CardDescription>Student performance and results</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{isLoading ? "..." : stats?.exams?.subjects || 8}</div>
              <p className="text-sm text-muted-foreground">Subjects tracked</p>
            </CardContent>
            <CardFooter className="pt-0">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={() => {
                  setActiveTab('academic');
                  setReportType('results');
                }}
              >
                View Reports
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-homenaje text-green">Attendance Reports</CardTitle>
              <CardDescription>Student and teacher attendance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{isLoading ? "..." : stats?.students?.present || 700}</div>
              <p className="text-sm text-muted-foreground">Present students today</p>
            </CardContent>
            <CardFooter className="pt-0">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={() => {
                  setActiveTab('attendance');
                  setReportType('student-attendance');
                }}
              >
                View Reports
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-homenaje text-yellow">Financial Reports</CardTitle>
              <CardDescription>Fee collection and expenses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">${isLoading ? "..." : stats?.finance?.collectedAmount || 10000}</div>
              <p className="text-sm text-muted-foreground">Total collected fees</p>
            </CardContent>
            <CardFooter className="pt-0">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={() => {
                  setActiveTab('financial');
                  setReportType('fee-collection');
                }}
              >
                View Reports
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        {/* Report Generator */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow">
          <div className="p-4 border-b border-divider dark:border-gray-700">
            <h2 className="text-lg font-homenaje text-gray-800 dark:text-gray-200">Report Generator</h2>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="p-4">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="academic">Academic Reports</TabsTrigger>
              <TabsTrigger value="attendance">Attendance Reports</TabsTrigger>
              <TabsTrigger value="financial">Financial Reports</TabsTrigger>
            </TabsList>
            
            <TabsContent value="academic" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Report Type</label>
                  <Select value={reportType} onValueChange={setReportType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select report type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="results">Exam Results</SelectItem>
                      <SelectItem value="transcript">Student Transcripts</SelectItem>
                      <SelectItem value="progress">Progress Reports</SelectItem>
                      <SelectItem value="subject-performance">Subject Performance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Period</label>
                  <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="term1">Term 1</SelectItem>
                      <SelectItem value="term2">Term 2</SelectItem>
                      <SelectItem value="term3">Term 3</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Section</label>
                  <Select value={selectedSection} onValueChange={setSelectedSection}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select section" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Sections</SelectItem>
                      <SelectItem value="primary">Primary</SelectItem>
                      <SelectItem value="secondary">Secondary</SelectItem>
                      <SelectItem value="highschool">High School</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Class</label>
                  <Select value={selectedClass} onValueChange={setSelectedClass}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Classes</SelectItem>
                      <SelectItem value="One">One</SelectItem>
                      <SelectItem value="Two">Two</SelectItem>
                      <SelectItem value="Three">Three</SelectItem>
                      <SelectItem value="Four">Four</SelectItem>
                      <SelectItem value="Five">Five</SelectItem>
                      <SelectItem value="Six">Six</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex justify-end mt-4">
                <Button onClick={generateReport} className="bg-blue hover:bg-blue/90 text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Generate Report
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="attendance" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Report Type</label>
                  <Select value={reportType} onValueChange={setReportType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select report type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student-attendance">Student Attendance</SelectItem>
                      <SelectItem value="teacher-attendance">Teacher Attendance</SelectItem>
                      <SelectItem value="absence-report">Absence Report</SelectItem>
                      <SelectItem value="late-comers">Late Comers Report</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date Range</label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input type="date" placeholder="Start date" defaultValue={new Date().toISOString().split('T')[0]} />
                    <Input type="date" placeholder="End date" defaultValue={new Date().toISOString().split('T')[0]} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Section</label>
                  <Select value={selectedSection} onValueChange={setSelectedSection}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select section" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Sections</SelectItem>
                      <SelectItem value="primary">Primary</SelectItem>
                      <SelectItem value="secondary">Secondary</SelectItem>
                      <SelectItem value="highschool">High School</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Class</label>
                  <Select value={selectedClass} onValueChange={setSelectedClass}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Classes</SelectItem>
                      <SelectItem value="One">One</SelectItem>
                      <SelectItem value="Two">Two</SelectItem>
                      <SelectItem value="Three">Three</SelectItem>
                      <SelectItem value="Four">Four</SelectItem>
                      <SelectItem value="Five">Five</SelectItem>
                      <SelectItem value="Six">Six</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex justify-end mt-4">
                <Button onClick={generateReport} className="bg-blue hover:bg-blue/90 text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Generate Report
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="financial" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Report Type</label>
                  <Select value={reportType} onValueChange={setReportType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select report type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fee-collection">Fee Collection</SelectItem>
                      <SelectItem value="fee-due">Fee Due</SelectItem>
                      <SelectItem value="expense">Expense Report</SelectItem>
                      <SelectItem value="income-statement">Income Statement</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date Range</label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input type="date" placeholder="Start date" defaultValue={new Date().toISOString().split('T')[0]} />
                    <Input type="date" placeholder="End date" defaultValue={new Date().toISOString().split('T')[0]} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Section</label>
                  <Select value={selectedSection} onValueChange={setSelectedSection}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select section" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Sections</SelectItem>
                      <SelectItem value="primary">Primary</SelectItem>
                      <SelectItem value="secondary">Secondary</SelectItem>
                      <SelectItem value="highschool">High School</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Format</label>
                  <Select defaultValue="pdf">
                    <SelectTrigger>
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="excel">Excel</SelectItem>
                      <SelectItem value="csv">CSV</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex justify-end mt-4">
                <Button onClick={generateReport} className="bg-blue hover:bg-blue/90 text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Generate Report
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Recent Reports */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow">
          <div className="p-4 border-b border-divider dark:border-gray-700">
            <h2 className="text-lg font-homenaje text-gray-800 dark:text-gray-200">Recent Reports</h2>
          </div>
          
          <div className="p-4">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Report Name</th>
                    <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Type</th>
                    <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Generated On</th>
                    <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Generated By</th>
                    <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="py-3 px-4 text-sm text-gray-700 dark:text-gray-300 font-medium">
                      Term 1 Exam Results
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700 dark:text-gray-300">
                      <span className="px-2 py-1 bg-blue/10 text-blue rounded-full text-xs">Academic</span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700 dark:text-gray-300">
                      {formatDate(new Date())}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700 dark:text-gray-300">
                      Admin
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-blue"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Download
                      </Button>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="py-3 px-4 text-sm text-gray-700 dark:text-gray-300 font-medium">
                      Monthly Attendance Report
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700 dark:text-gray-300">
                      <span className="px-2 py-1 bg-green/10 text-green rounded-full text-xs">Attendance</span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700 dark:text-gray-300">
                      {formatDate(new Date(Date.now() - 86400000))}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700 dark:text-gray-300">
                      Admin
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-blue"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Download
                      </Button>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="py-3 px-4 text-sm text-gray-700 dark:text-gray-300 font-medium">
                      Quarterly Fee Collection
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700 dark:text-gray-300">
                      <span className="px-2 py-1 bg-yellow/10 text-yellow rounded-full text-xs">Financial</span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700 dark:text-gray-300">
                      {formatDate(new Date(Date.now() - 172800000))}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700 dark:text-gray-300">
                      Admin
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-blue"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Download
                      </Button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}