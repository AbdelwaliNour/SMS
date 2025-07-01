import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Student } from '@shared/schema';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProfileAvatar } from '@/components/ui/profile-avatar';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { 
  CheckCircle, 
  Clock, 
  XCircle,
  Save,
  Users,
  Calendar
} from 'lucide-react';

interface BulkAttendanceFormProps {
  onComplete: () => void;
}

export default function BulkAttendanceForm({ onComplete }: BulkAttendanceFormProps) {
  const [selectedClass, setSelectedClass] = useState('');
  const [studentStatuses, setStudentStatuses] = useState<Record<number, 'present' | 'absent' | 'late'>>({});
  const [studentNotes, setStudentNotes] = useState<Record<number, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const { data: students } = useQuery<Student[]>({
    queryKey: ['/api/students'],
  });

  // Filter students by selected class
  const filteredStudents = students?.filter(student => {
    if (!selectedClass) return true;
    return student.class === selectedClass;
  }) || [];

  // Get unique classes for filter
  const availableClasses = students 
    ? students.map(s => s.class).filter(Boolean).filter((value, index, arr) => arr.indexOf(value) === index)
    : [];

  const updateStudentStatus = (studentId: number, status: 'present' | 'absent' | 'late') => {
    setStudentStatuses(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const updateStudentNotes = (studentId: number, note: string) => {
    setStudentNotes(prev => ({
      ...prev,
      [studentId]: note
    }));
  };

  const handleBulkSubmit = async () => {
    try {
      setIsSubmitting(true);
      
      // Filter only students that have a status selected
      const recordsToSubmit = Object.entries(studentStatuses);
      
      if (recordsToSubmit.length === 0) {
        toast({
          title: 'No Records Selected',
          description: 'Please mark attendance status for at least one student',
          variant: 'destructive',
        });
        return;
      }
      
      const attendanceRecords = recordsToSubmit.map(([studentId, status]) => ({
        studentId: parseInt(studentId),
        status,
        note: studentNotes[parseInt(studentId)] || '',
        date: new Date().toISOString(),
      }));

      // Submit all attendance records
      let successCount = 0;
      let errors = [];
      
      for (const record of attendanceRecords) {
        try {
          await apiRequest('POST', '/api/attendance', record);
          successCount++;
        } catch (recordError: any) {
          console.error('Failed to save record for student:', record.studentId, recordError);
          errors.push({
            studentId: record.studentId,
            error: recordError
          });
        }
      }

      if (successCount > 0) {
        toast({
          title: 'Success',
          description: `Attendance recorded for ${successCount} students${errors.length > 0 ? ` (${errors.length} failed)` : ''}`,
        });
        
        queryClient.invalidateQueries({ queryKey: ['/api/attendance'] });
        
        // Reset the form state
        setStudentStatuses({});
        setStudentNotes({});
        onComplete();
      }

      if (errors.length > 0) {
        console.error('Some records failed to save:', errors);
      }
    } catch (error: any) {
      console.error('Bulk attendance submission error:', error);
      toast({
        title: 'Error',
        description: `Failed to save attendance records: ${error?.message || 'Unknown error'}`,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusButton = (student: Student, status: 'present' | 'absent' | 'late') => {
    const isSelected = studentStatuses[student.id] === status;
    
    const buttonStyles = {
      present: {
        base: 'border-green-300 text-green-700 hover:bg-green-50 dark:border-green-600 dark:text-green-400 dark:hover:bg-green-900/20',
        selected: 'bg-green-500 text-white border-green-500 hover:bg-green-600'
      },
      late: {
        base: 'border-amber-300 text-amber-700 hover:bg-amber-50 dark:border-amber-600 dark:text-amber-400 dark:hover:bg-amber-900/20',
        selected: 'bg-amber-500 text-white border-amber-500 hover:bg-amber-600'
      },
      absent: {
        base: 'border-red-300 text-red-700 hover:bg-red-50 dark:border-red-600 dark:text-red-400 dark:hover:bg-red-900/20',
        selected: 'bg-red-500 text-white border-red-500 hover:bg-red-600'
      }
    };

    const icons = {
      present: <CheckCircle className="h-4 w-4 mr-1" />,
      late: <Clock className="h-4 w-4 mr-1" />,
      absent: <XCircle className="h-4 w-4 mr-1" />
    };

    const labels = {
      present: 'Present',
      late: 'Late',
      absent: 'Absent'
    };

    return (
      <Button
        variant="outline"
        size="sm"
        className={`min-w-[90px] ${isSelected ? buttonStyles[status].selected : buttonStyles[status].base}`}
        onClick={() => updateStudentStatus(student.id, status)}
      >
        {icons[status]}
        {labels[status]}
      </Button>
    );
  };

  const selectedCount = Object.keys(studentStatuses).length;

  return (
    <Card className="glass-morphism border-border/30 max-w-7xl mx-auto">
      <CardHeader className="pb-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <CardTitle className="text-xl font-semibold text-primary flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Record Bulk Attendance
          </CardTitle>
          
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Class Filter */}
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Classes</SelectItem>
                {availableClasses.map((className) => (
                  <SelectItem key={className} value={className}>
                    Class {className}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <div className="flex items-center space-x-2">
              <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20">
                <Calendar className="h-3 w-3 mr-1" />
                {new Date().toLocaleDateString()}
              </Badge>
              
              {selectedCount > 0 && (
                <Badge className="bg-purple-500/10 text-purple-600 border-purple-500/20">
                  {selectedCount} marked
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6 pt-0">
        {filteredStudents.length === 0 ? (
          <div className="text-center py-12">
            <Users className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold text-muted-foreground mb-2">
              No Students Found
            </h3>
            <p className="text-muted-foreground">
              {selectedClass ? `No students found in class ${selectedClass}` : 'No students available to record attendance'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-muted/30 rounded-lg font-medium text-sm">
              <div className="col-span-1 text-center">Photo</div>
              <div className="col-span-2">Student</div>
              <div className="col-span-1 text-center">Age</div>
              <div className="col-span-1 text-center">Class</div>
              <div className="col-span-1 text-center">Section</div>
              <div className="col-span-3 text-center">Attendance Status</div>
              <div className="col-span-3">Notes</div>
            </div>
            
            {/* Student Rows */}
            {filteredStudents.map((student) => {
              const age = student.dateOfBirth 
                ? new Date().getFullYear() - new Date(student.dateOfBirth).getFullYear() 
                : null;

              return (
                <Card key={student.id} className="glass-morphism border-border/30 hover:border-primary/30 transition-all duration-300">
                  <CardContent className="p-4">
                    <div className="grid grid-cols-12 gap-4 items-center">
                      {/* Photo */}
                      <div className="col-span-1 flex justify-center">
                        <ProfileAvatar
                          src={student.profilePhoto || undefined}
                          name={`${student.firstName} ${student.lastName}`}
                          size="sm"
                        />
                      </div>
                      
                      {/* Student Info */}
                      <div className="col-span-2">
                        <div className="font-semibold text-foreground">
                          {student.firstName} {student.lastName}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {student.studentId}
                        </div>
                      </div>
                      
                      {/* Age */}
                      <div className="col-span-1 text-center">
                        {age ? (
                          <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                            {age}y
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground text-xs">N/A</span>
                        )}
                      </div>
                      
                      {/* Class */}
                      <div className="col-span-1 text-center">
                        {student.class ? (
                          <Badge variant="outline" className="text-xs">
                            {student.class}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground text-xs">N/A</span>
                        )}
                      </div>
                      
                      {/* Section */}
                      <div className="col-span-1 text-center">
                        {student.section ? (
                          <Badge variant="outline" className="text-xs">
                            {student.section}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground text-xs">N/A</span>
                        )}
                      </div>
                      
                      {/* Status Buttons */}
                      <div className="col-span-3 flex justify-center gap-2">
                        {getStatusButton(student, 'present')}
                        {getStatusButton(student, 'late')}
                        {getStatusButton(student, 'absent')}
                      </div>
                      
                      {/* Notes */}
                      <div className="col-span-3">
                        <Input
                          placeholder="Add note (optional)"
                          value={studentNotes[student.id] || ''}
                          onChange={(e) => updateStudentNotes(student.id, e.target.value)}
                          className="text-sm"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            
            {/* Submit Button */}
            <div className="flex justify-end pt-4">
              <Button 
                onClick={handleBulkSubmit}
                disabled={selectedCount === 0 || isSubmitting}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              >
                <Save className="h-4 w-4 mr-2" />
                {isSubmitting ? 'Saving...' : `Save Attendance (${selectedCount})`}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}