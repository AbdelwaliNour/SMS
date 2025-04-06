import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import StudentPerformanceHeatMap from '@/components/performance/StudentPerformanceHeatMap';
import StudentPerformanceSummary from '@/components/performance/StudentPerformanceSummary';
import { useIsMobile } from '@/hooks/use-mobile';
import { useQuery } from '@tanstack/react-query';
import { Student } from '@shared/schema';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProfileAvatar } from '@/components/ui/profile-avatar';
import { Button } from '@/components/ui/button';
import { Download, Printer } from 'lucide-react';
import { getSectionDisplayName } from '@/lib/utils';

export default function StudentPerformance() {
  const isMobile = useIsMobile();
  const [selectedStudent, setSelectedStudent] = useState<number | null>(null);
  
  // Fetch students for dropdown
  const { data: students, isLoading: isLoadingStudents } = useQuery<Student[]>({
    queryKey: ['/api/students'],
  });
  
  // Get selected student details
  const selectedStudentDetails = selectedStudent && students 
    ? students.find(s => s.id === selectedStudent) 
    : null;
  
  const handlePrint = () => {
    window.print();
  };
  
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-2xl font-homenaje">Student Performance</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Analyze and visualize student performance data
            </p>
          </div>
          
          {/* Student selector */}
          {students && students.length > 0 && (
            <div className="mt-4 md:mt-0 w-full md:w-auto">
              <Select
                value={selectedStudent?.toString() || ''}
                onValueChange={(value) => setSelectedStudent(parseInt(value))}
              >
                <SelectTrigger className="w-full md:w-60">
                  <SelectValue placeholder="Select a student" />
                </SelectTrigger>
                <SelectContent>
                  {students.map(student => (
                    <SelectItem key={student.id} value={student.id.toString()}>
                      <div className="flex items-center">
                        <ProfileAvatar 
                          name={`${student.firstName} ${student.lastName}`}
                          size="sm"
                          className="mr-2"
                        />
                        {student.firstName} {student.lastName}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        
        {isLoadingStudents ? (
          <div className="flex justify-center items-center h-60">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue"></div>
          </div>
        ) : !selectedStudent ? (
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-10 text-center">
            <h2 className="text-xl font-homenaje mb-3">Select a Student</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Please select a student from the dropdown above to view their performance data
            </p>
            
            {!students || students.length === 0 ? (
              <p className="text-red">
                No student data available. Please add students to the system first.
              </p>
            ) : (
              <div className="flex flex-wrap justify-center gap-4 max-w-2xl mx-auto">
                {students.slice(0, 8).map(student => (
                  <Button
                    key={student.id}
                    variant="outline"
                    className="flex flex-col items-center p-4 h-auto"
                    onClick={() => setSelectedStudent(student.id)}
                  >
                    <ProfileAvatar name={`${student.firstName} ${student.lastName}`} size="md" />
                    <span className="mt-2 font-medium">{student.firstName} {student.lastName}</span>
                    <span className="text-xs text-gray-500">{getSectionDisplayName(student.section)} - {student.class}</span>
                  </Button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Student info header */}
            {selectedStudentDetails && (
              <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-4 md:p-6">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
                  <div className="flex items-center">
                    <ProfileAvatar 
                      name={`${selectedStudentDetails.firstName} ${selectedStudentDetails.lastName}`}
                      size="lg"
                      className="mr-4"
                    />
                    <div>
                      <h2 className="text-xl font-medium">
                        {selectedStudentDetails.firstName} {selectedStudentDetails.lastName}
                      </h2>
                      <div className="flex flex-col md:flex-row md:items-center gap-y-1 md:gap-x-4 text-gray-500 dark:text-gray-400 mt-1">
                        <span className="flex items-center">
                          <span className="bg-blue/10 text-blue text-xs px-2 py-0.5 rounded mr-2">
                            {selectedStudentDetails.studentId}
                          </span>
                        </span>
                        <span>{getSectionDisplayName(selectedStudentDetails.section)}</span>
                        <span>Class {selectedStudentDetails.class}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex mt-4 md:mt-0 space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="flex items-center"
                      onClick={handlePrint}
                    >
                      <Printer size={16} className="mr-2" />
                      <span>Print Report</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="flex items-center"
                    >
                      <Download size={16} className="mr-2" />
                      <span>Export PDF</span>
                    </Button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Performance Components */}
            <div className="space-y-6 print:space-y-4">
              {/* Summary stats */}
              <StudentPerformanceSummary 
                studentId={selectedStudent} 
                className="print:shadow-none"
              />
              
              {/* Performance heat map */}
              <StudentPerformanceHeatMap 
                studentId={selectedStudent} 
                className="print:shadow-none"
              />
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}