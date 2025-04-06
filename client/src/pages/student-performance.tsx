import { useState } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import Layout from '@/components/layout/Layout';
import StudentPerformanceAnalytics from '@/components/reports/StudentPerformanceAnalytics';
import { ChevronLeft, Search, BookOpen, Filter, Users } from 'lucide-react';

const StudentPerformance = () => {
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<number | null>(null);
  const [section, setSection] = useState('all');
  const [status, setStatus] = useState('all');
  
  // Fetch students for selection
  const { data: students, isLoading } = useQuery({
    queryKey: ['/api/students'],
  });
  
  // Filter students based on search and filters
  const filteredStudents = students?.filter(student => {
    const matchesSearch = searchQuery 
      ? `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.studentId.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
      
    const matchesSection = section !== 'all' ? student.section === section : true;
    
    // Additional filters could be added here
    
    return matchesSearch && matchesSection;
  }) || [];
  
  return (
    <Layout>
      <div className="container mx-auto py-8 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-homenaje text-gray-800 dark:text-gray-100">
            {selectedStudent 
              ? 'Student Performance Analysis' 
              : 'Student Performance'}
          </h1>
          
          {selectedStudent && (
            <Button 
              variant="ghost" 
              className="flex items-center"
              onClick={() => setSelectedStudent(null)}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to All Students
            </Button>
          )}
        </div>
        
        {!selectedStudent ? (
          <>
            {/* Search and Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-3 text-gray-500" />
                <Input
                  placeholder="Search students..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={section} onValueChange={setSection}>
                <SelectTrigger>
                  <div className="flex items-center">
                    <BookOpen className="h-4 w-4 mr-2 text-gray-500" />
                    <SelectValue placeholder="Select section" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sections</SelectItem>
                  <SelectItem value="primary">Primary</SelectItem>
                  <SelectItem value="secondary">Secondary</SelectItem>
                  <SelectItem value="highschool">High School</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <div className="flex items-center">
                    <Filter className="h-4 w-4 mr-2 text-gray-500" />
                    <SelectValue placeholder="Select status" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Students</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Overview Analytics */}
            <StudentPerformanceAnalytics />
            
            {/* Student List */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-homenaje text-blue flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Student Directory
                </CardTitle>
                <CardDescription>
                  Select a student to view detailed performance analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8">Loading students...</div>
                ) : filteredStudents.length === 0 ? (
                  <div className="text-center py-8">
                    No students found matching your search criteria.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredStudents.map((student) => (
                      <Card 
                        key={student.id} 
                        className="cursor-pointer hover:border-blue hover:shadow-md transition-all"
                        onClick={() => setSelectedStudent(student.id)}
                      >
                        <CardContent className="p-4 flex items-center space-x-4">
                          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue to-blue/70 flex items-center justify-center text-white font-bold text-lg">
                            {student.firstName.charAt(0)}{student.lastName.charAt(0)}
                          </div>
                          <div>
                            <h3 className="font-homenaje text-lg">
                              {student.firstName} {student.lastName}
                            </h3>
                            <p className="text-sm text-gray-600">
                              ID: {student.studentId} | {student.section.charAt(0).toUpperCase() + student.section.slice(1)}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        ) : (
          <StudentPerformanceAnalytics studentId={selectedStudent} />
        )}
      </div>
    </Layout>
  );
};

export default StudentPerformance;