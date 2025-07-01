import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Attendance, Student } from '@shared/schema';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProfileAvatar } from '@/components/ui/profile-avatar';
import { 
  Search, 
  Filter, 
  Plus, 
  CheckCircle, 
  Clock, 
  XCircle,
  Calendar,
  Edit
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AttendanceTableProps {
  onAddAttendance: () => void;
}

export default function AttendanceTable({ onAddAttendance }: AttendanceTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const { data: attendance, isLoading } = useQuery<Attendance[]>({
    queryKey: ['/api/attendance'],
  });

  const { data: students } = useQuery<Student[]>({
    queryKey: ['/api/students'],
  });

  const getStudentInfo = (studentId: number) => {
    return students?.find(s => s.id === studentId);
  };

  // Filter attendance data
  const filteredAttendance = attendance?.filter(record => {
    let matches = true;

    // Search filter
    if (searchTerm) {
      const student = getStudentInfo(record.studentId);
      const fullName = student ? `${student.firstName} ${student.lastName}`.toLowerCase() : '';
      const studentId = student?.studentId?.toLowerCase() || '';
      matches = matches && (
        fullName.includes(searchTerm.toLowerCase()) ||
        studentId.includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter) {
      matches = matches && record.status === statusFilter;
    }

    // Date filter
    if (dateFilter && record.date) {
      const recordDate = new Date(record.date);
      const today = new Date();
      
      switch (dateFilter) {
        case 'today':
          matches = matches && recordDate.toDateString() === today.toDateString();
          break;
        case 'week':
          const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
          matches = matches && recordDate.getTime() >= weekAgo.getTime();
          break;
        case 'month':
          const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
          matches = matches && recordDate.getTime() >= monthAgo.getTime();
          break;
      }
    }

    return matches;
  }) || [];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'present':
        return (
          <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
            <CheckCircle className="h-3 w-3 mr-1" />
            Present
          </Badge>
        );
      case 'late':
        return (
          <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20">
            <Clock className="h-3 w-3 mr-1" />
            Late
          </Badge>
        );
      case 'absent':
        return (
          <Badge className="bg-red-500/10 text-red-600 border-red-500/20">
            <XCircle className="h-3 w-3 mr-1" />
            Absent
          </Badge>
        );
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    const isYesterday = date.toDateString() === yesterday.toDateString();
    
    if (isToday) {
      return {
        label: 'Today',
        time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
        isToday: true
      };
    } else if (isYesterday) {
      return {
        label: 'Yesterday',
        time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
        isToday: false
      };
    } else {
      return {
        label: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
        isToday: false
      };
    }
  };

  if (isLoading) {
    return (
      <Card className="glass-morphism border-border/30">
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-morphism border-border/30">
      <CardHeader className="pb-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <CardTitle className="text-xl font-semibold text-primary">Attendance Records</CardTitle>
          
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            
            {/* Filters */}
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Status</SelectItem>
                  <SelectItem value="present">Present</SelectItem>
                  <SelectItem value="late">Late</SelectItem>
                  <SelectItem value="absent">Absent</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Dates</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button onClick={onAddAttendance} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
              <Plus className="h-4 w-4 mr-2" />
              Record Attendance
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6 pt-0">
        {filteredAttendance.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold text-muted-foreground mb-2">
              {attendance?.length === 0 ? 'No Attendance Records' : 'No Records Found'}
            </h3>
            <p className="text-muted-foreground mb-6">
              {attendance?.length === 0 
                ? 'Start recording attendance to see data here' 
                : 'Try adjusting your search or filter criteria'}
            </p>
            {attendance?.length === 0 && (
              <Button onClick={onAddAttendance} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                <Plus className="h-4 w-4 mr-2" />
                Record First Attendance
              </Button>
            )}
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredAttendance.map((record) => {
              const student = getStudentInfo(record.studentId);
              const dateInfo = formatDate(typeof record.date === 'string' ? record.date : record.date.toISOString());
              const age = student?.dateOfBirth 
                ? new Date().getFullYear() - new Date(student.dateOfBirth).getFullYear() 
                : null;

              return (
                <Card key={record.id} className="glass-morphism border-border/30 hover:border-primary/30 transition-all duration-300 group">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      {/* Student Info */}
                      <div className="flex items-center space-x-4">
                        <ProfileAvatar
                          src={student?.profilePhoto || undefined}
                          name={student ? `${student.firstName} ${student.lastName}` : 'Unknown Student'}
                          size="md"
                        />
                        
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-1">
                            <h3 className="text-base font-semibold text-foreground">
                              {student ? `${student.firstName} ${student.lastName}` : 'Unknown Student'}
                            </h3>
                            {age && (
                              <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                                {age}y
                              </Badge>
                            )}
                            {student?.gender && (
                              <Badge variant="outline" className={`text-xs ${
                                student.gender === 'male' 
                                  ? 'border-blue-300 text-blue-600 dark:border-blue-600 dark:text-blue-400' 
                                  : 'border-pink-300 text-pink-600 dark:border-pink-600 dark:text-pink-400'
                              }`}>
                                {student.gender.charAt(0).toUpperCase() + student.gender.slice(1)}
                              </Badge>
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-3 text-xs text-muted-foreground opacity-80">
                            <span className="font-medium text-xs">{student?.studentId || `#${record.studentId}`}</span>
                            {student?.section && (
                              <span className="text-xs">Section: {student.section}</span>
                            )}
                            {student?.class && (
                              <span className="text-xs">Class: {student.class}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Date, Status, and Actions */}
                      <div className="flex items-center space-x-6">
                        {/* Date */}
                        <div className="text-center">
                          <Badge 
                            variant={dateInfo.isToday ? 'default' : 'secondary'} 
                            className={`text-xs font-semibold mb-1 ${
                              dateInfo.isToday 
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' 
                                : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                            }`}
                          >
                            {dateInfo.label}
                          </Badge>
                          <div className="text-xs font-medium text-foreground">
                            {dateInfo.time}
                          </div>
                        </div>
                        
                        {/* Status */}
                        <div className="text-center">
                          {getStatusBadge(record.status)}
                        </div>
                        
                        {/* Notes */}
                        <div className="min-w-0 max-w-xs">
                          {record.note ? (
                            <div className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-lg border">
                              <p className="leading-relaxed truncate" title={record.note}>
                                {record.note}
                              </p>
                            </div>
                          ) : (
                            <div className="text-xs text-muted-foreground/70 italic">
                              No notes
                            </div>
                          )}
                        </div>
                        
                        {/* Actions */}
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}