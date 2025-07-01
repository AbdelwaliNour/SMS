import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { useQuery } from '@tanstack/react-query';
import { Classroom, Employee } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getSectionDisplayName } from '@/lib/utils';
import ClassroomsGridSkeleton from '@/components/classrooms/ClassroomsGridSkeleton';
import { ProfileAvatar } from '@/components/ui/profile-avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  School, 
  Plus, 
  Edit, 
  Trash2, 
  Users, 
  User, 
  MapPin, 
  Calendar,
  Filter,
  Search
} from 'lucide-react';

export default function Classrooms() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    section: '',
  });
  const { toast } = useToast();

  const { data: classrooms, isLoading, error } = useQuery<Classroom[]>({
    queryKey: ['/api/classrooms'],
  });

  const { data: employees } = useQuery<Employee[]>({
    queryKey: ['/api/employees'],
  });

  const teachers = employees?.filter(employee => employee.role === 'teacher') || [];

  const getTeacherInfo = (teacherId: number | null | undefined) => {
    if (!teacherId) return null;
    const teacher = teachers.find(t => t.id === teacherId);
    return teacher ? `${teacher.firstName} ${teacher.lastName}` : null;
  };

  const handleDeleteClassroom = async (classroomId: number, classroomName: string) => {
    if (!confirm(`Are you sure you want to delete classroom "${classroomName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await apiRequest('DELETE', `/api/classrooms/${classroomId}`);
      await queryClient.invalidateQueries({ queryKey: ['/api/classrooms'] });
      toast({
        title: "Success",
        description: `Classroom "${classroomName}" has been deleted successfully`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete classroom. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Filter classrooms based on search and filters
  const filteredClassrooms = classrooms?.filter(classroom => {
    const matchesSearch = classroom.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSection = !filters.section || classroom.section === filters.section;
    return matchesSearch && matchesSection;
  }) || [];

  const getSectionColor = (section: string) => {
    switch (section) {
      case 'primary':
        return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'secondary':
        return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'highschool':
        return 'bg-purple-500/10 text-purple-600 border-purple-500/20';
      default:
        return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
    }
  };

  const getCapacityStatus = (capacity: number) => {
    if (capacity >= 40) return 'bg-red-500/10 text-red-600 border-red-500/20';
    if (capacity >= 30) return 'bg-orange-500/10 text-orange-600 border-orange-500/20';
    return 'bg-green-500/10 text-green-600 border-green-500/20';
  };

  return (
    <Layout>
      <div className="space-y-8">
        {/* Modern Page Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-primary/10 rounded-xl">
                <School className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gradient">Classroom Management</h1>
                <p className="text-muted-foreground">Manage school rooms and teacher assignments</p>
              </div>
            </div>
          </div>
          
          <Link to="/add-classroom">
            <Button className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90">
              <Plus className="h-4 w-4 mr-2" />
              Add Classroom
            </Button>
          </Link>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search classrooms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="glass-morphism border-border/30 pl-10 h-11"
            />
          </div>
          
          <div className="flex gap-3 items-center">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={filters.section} onValueChange={(value) => setFilters(prev => ({ ...prev, section: value }))}>
                <SelectTrigger className="glass-morphism border-border/30 w-[180px] h-11">
                  <SelectValue placeholder="All Sections" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Sections</SelectItem>
                  <SelectItem value="primary">Primary School</SelectItem>
                  <SelectItem value="secondary">Secondary School</SelectItem>
                  <SelectItem value="highschool">High School</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Classroom Grid */}
        {error && (
          <div className="text-center text-red-500 py-8">
            Error loading classrooms. Please try again.
          </div>
        )}

        {isLoading ? (
          <ClassroomsGridSkeleton />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClassrooms.map((classroom) => (
              <Card key={classroom.id} className="group glass-morphism border-border/30 hover:border-primary/30 transition-all duration-300 hover:shadow-xl">
                <CardContent className="p-6 space-y-4">
                  {/* Classroom Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2.5 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
                        <School className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{classroom.name}</h3>
                        <Badge className={`text-xs ${getSectionColor(classroom.section || 'primary')}`}>
                          {getSectionDisplayName(classroom.section || 'primary')}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link to={`/edit-classroom/${classroom.id}`}>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-blue-500/10 hover:text-blue-600">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0 hover:bg-red-500/10 hover:text-red-600"
                        onClick={() => handleDeleteClassroom(classroom.id, classroom.name)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Classroom Details */}
                  <div className="space-y-3">
                    {/* Capacity */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Capacity</span>
                      </div>
                      <Badge className={`text-xs ${getCapacityStatus(classroom.capacity || 0)}`}>
                        {classroom.capacity} students
                      </Badge>
                    </div>

                    {/* Teacher Assignment */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Teacher</span>
                      </div>
                      <div className="text-sm">
                        {getTeacherInfo(classroom.teacherId) ? (
                          <div className="flex items-center space-x-2">
                            <ProfileAvatar 
                              name={getTeacherInfo(classroom.teacherId)!} 
                              size="sm"
                            />
                            <span className="font-medium">{getTeacherInfo(classroom.teacherId)}</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground italic">Not assigned</span>
                        )}
                      </div>
                    </div>

                    {/* Created Date */}
                    {classroom.createdAt && (
                      <div className="flex items-center justify-between pt-2 border-t border-border/20">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">Created</span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(classroom.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!isLoading && filteredClassrooms.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
              <School className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No classrooms found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || filters.section 
                ? "Try adjusting your search or filters" 
                : "Get started by adding your first classroom"
              }
            </p>
            <Link to="/add-classroom">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Classroom
              </Button>
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
}