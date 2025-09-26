import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Student } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { getSectionDisplayName, getGenderDisplayName, formatAgeDisplay, getProfilePhotoUrl } from '@/lib/utils';
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
              <Card key={student.id} className="group relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-card/80 via-card to-card/60 backdrop-blur-xl shadow-lg hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1">
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Modern Shimmer Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
                
                <CardContent className="relative p-0">
                  {/* Header Section with Gradient Background */}
                  <div className="relative p-6 pb-4 bg-gradient-to-r from-primary/10 via-purple/5 to-secondary/10 border-b border-border/30">
                    <div className="flex items-center space-x-4">
                      {/* Modern Avatar with Ring Effect */}
                      <div className="relative">
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-secondary p-0.5 group-hover:animate-pulse">
                          <div className="h-full w-full rounded-full bg-card" />
                        </div>
                        <img
                          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=667eea&color=fff&size=72`}
                          alt={fullName}
                          className="relative w-18 h-18 rounded-full object-cover border-2 border-white/20 shadow-lg group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName.split(' ')[0])}&background=764ba2&color=fff&size=72`;
                          }}
                        />
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-2 border-white rounded-full shadow-md" />
                      </div>
                      
                      {/* Student Info with Enhanced Typography */}
                      <div className="flex-1 space-y-1">
                        <h3 className="font-bold text-xl leading-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent group-hover:from-primary group-hover:to-secondary transition-all duration-300">
                          {fullName}
                        </h3>
                        <p className="text-sm font-medium text-muted-foreground/80 tracking-wider">{student.studentId}</p>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-700 dark:text-blue-300 border-blue-500/30 text-xs font-semibold px-2.5 py-1 rounded-full">
                            {formatAgeDisplay(student.dateOfBirth)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Details Grid with Modern Layout */}
                  <div className="p-6 pt-4 space-y-4">
                    {/* Info Cards Grid */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="text-center p-3 rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 group-hover:border-blue-500/40 transition-all duration-300">
                        <div className="text-xs font-medium text-muted-foreground mb-1">Class</div>
                        <div className="font-bold text-sm text-blue-600 dark:text-blue-400">{student.class}</div>
                      </div>
                      <div className="text-center p-3 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 group-hover:border-green-500/40 transition-all duration-300">
                        <div className="text-xs font-medium text-muted-foreground mb-1">Section</div>
                        <div className="font-bold text-sm text-green-600 dark:text-green-400">{getSectionDisplayName(student.section)}</div>
                      </div>
                      <div className="text-center p-3 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 group-hover:border-purple-500/40 transition-all duration-300">
                        <div className="text-xs font-medium text-muted-foreground mb-1">Gender</div>
                        <div className="font-bold text-sm text-purple-600 dark:text-purple-400">{getGenderDisplayName(student.gender)}</div>
                      </div>
                    </div>

                    {/* Contact Information with Modern Icons */}
                    <div className="space-y-3 p-4 rounded-xl bg-gradient-to-br from-muted/20 to-muted/10 border border-border/30">
                      <div className="flex items-center space-x-3 group/contact hover:bg-white/5 p-2 rounded-lg transition-all duration-200">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                          <Mail className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground/90 truncate">
                            {student.email || 'No email provided'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 group/contact hover:bg-white/5 p-2 rounded-lg transition-all duration-200">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                          <Phone className="h-4 w-4 text-green-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground/90 truncate">
                            {student.phone || 'No phone provided'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Modern Action Buttons */}
                    <div className="flex gap-2 pt-2">
                      <Link to={`/edit-student/${student.id}`} className="flex-1">
                        <Button 
                          size="sm" 
                          className="w-full bg-gradient-to-r from-blue-500/15 to-cyan-500/15 hover:from-blue-500/25 hover:to-cyan-500/25 text-blue-800 dark:text-blue-200 border border-blue-500/40 hover:border-blue-500/60 transition-all duration-300 group/btn font-semibold"
                        >
                          <Edit className="h-4 w-4 mr-2 group-hover/btn:scale-110 transition-transform duration-200" />
                          Edit
                        </Button>
                      </Link>
                      <Link to={`/student-performance?studentId=${student.id}`} className="flex-1">
                        <Button 
                          size="sm" 
                          className="w-full bg-gradient-to-r from-green-500/15 to-emerald-500/15 hover:from-green-500/25 hover:to-emerald-500/25 text-green-800 dark:text-green-200 border border-green-500/40 hover:border-green-500/60 transition-all duration-300 group/btn font-semibold"
                        >
                          <BarChart3 className="h-4 w-4 mr-2 group-hover/btn:scale-110 transition-transform duration-200" />
                          Stats
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-red-500/15 to-pink-500/15 hover:from-red-500/25 hover:to-pink-500/25 text-red-800 dark:text-red-200 border border-red-500/40 hover:border-red-500/60 transition-all duration-300 group/btn font-semibold"
                        onClick={() => handleDelete(student.id)}
                      >
                        <Trash2 className="h-4 w-4 group-hover/btn:scale-110 transition-transform duration-200" />
                      </Button>
                    </div>
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
