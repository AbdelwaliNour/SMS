import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Student } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { getSectionDisplayName, getGenderDisplayName } from '@/lib/utils';
import { Link } from 'wouter';
import { Search, Edit, BarChart3, Trash2, Users, Filter, Mail, Phone } from 'lucide-react';
import StudentsTableSkeleton from './StudentsTableSkeleton';
import { ProfileAvatar } from '@/components/ui/profile-avatar';

interface StudentsTableProps {
  onAddStudent: () => void;
}

const StudentsTable: React.FC<StudentsTableProps> = ({ onAddStudent }) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    gender: '',
    section: '',
    class: ''
  });

  const { data: students, isLoading, error, refetch } = useQuery<Student[]>({
    queryKey: ['/api/students'],
  });

  // Filter students based on search and filters
  const filteredStudents = students?.filter((student) => {
    const fullName = `${student.firstName} ${student.middleName || ''} ${student.lastName}`.toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase()) || 
                         student.studentId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesGender = !filters.gender || student.gender === filters.gender;
    const matchesSection = !filters.section || student.section === filters.section;
    const matchesClass = !filters.class || student.class === filters.class;
    
    return matchesSearch && matchesGender && matchesSection && matchesClass;
  }) || [];

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this student?')) return;
    
    try {
      await apiRequest('DELETE', `/api/students/${id}`);
      toast({
        title: 'Success',
        description: 'Student deleted successfully',
      });
      refetch();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete student',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return <StudentsTableSkeleton />;
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Error loading students. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Modern Search and Filter Header */}
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search students by name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 glass-morphism border-border/30 bg-background/50"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="glass-morphism border-border/30"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            {filteredStudents.length} students
          </Badge>
        </div>
      </div>

      {/* Students Grid */}
      {filteredStudents.length === 0 ? (
        <div className="text-center py-12 glass-morphism rounded-xl border border-border/30">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No students found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm ? 'Try adjusting your search criteria' : 'Get started by adding your first student'}
          </p>
          <Button onClick={onAddStudent} className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90">
            <Users className="h-4 w-4 mr-2" />
            Add Student
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map((student) => {
            const fullName = `${student.firstName} ${student.middleName ? student.middleName + ' ' : ''}${student.lastName}`;
            
            return (
              <Card key={student.id} className="card-modern glass-morphism hover:border-primary/30 transition-all duration-300 group overflow-hidden">
                <CardContent className="p-6">
                  {/* Student Header */}
                  <div className="flex items-center space-x-4 mb-4">
                    <ProfileAvatar name={fullName} size="lg" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg leading-tight">{fullName}</h3>
                      <p className="text-sm text-muted-foreground">{student.studentId}</p>
                    </div>
                  </div>

                  {/* Student Details */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Class</span>
                      <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/20">
                        {student.class}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Section</span>
                      <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">
                        {getSectionDisplayName(student.section)}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Gender</span>
                      <Badge variant="outline" className="bg-purple-500/10 text-purple-600 border-purple-500/20">
                        {getGenderDisplayName(student.gender)}
                      </Badge>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-2 mb-6 p-4 bg-muted/20 rounded-lg">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <span>{student.email || 'No email'}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      <span>{student.phone || 'No phone'}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <Link to={`/edit-student/${student.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full hover:bg-blue-500/10 hover:text-blue-600 hover:border-blue-500/30">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </Link>
                    <Link to={`/student-performance?studentId=${student.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full hover:bg-green-500/10 hover:text-green-600 hover:border-green-500/30">
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Stats
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      className="hover:bg-red-500/10 hover:text-red-600 hover:border-red-500/30"
                      onClick={() => handleDelete(student.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StudentsTable;
