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
              <Select value={filters.section || "all"} onValueChange={(value) => setFilters(prev => ({ ...prev, section: value === "all" ? "" : value }))}>
                <SelectTrigger className="glass-morphism border-border/30 w-[180px] h-11">
                  <SelectValue placeholder="All Sections" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sections</SelectItem>
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
              <Card key={classroom.id} className="group relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-card/80 via-card to-card/60 backdrop-blur-xl shadow-lg hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1">
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Modern Shimmer Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
                
                <CardContent className="relative p-0">
                  {/* Header Section with Gradient Background */}
                  <div className="relative p-6 pb-4 bg-gradient-to-r from-primary/10 via-purple/5 to-secondary/10 border-b border-border/30">
                    <div className="flex items-center space-x-4">
                      {/* Modern Icon with Ring Effect */}
                      <div className="relative">
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-secondary p-0.5 group-hover:animate-pulse">
                          <div className="h-full w-full rounded-full bg-card" />
                        </div>
                        <div className="relative w-18 h-18 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 flex items-center justify-center border-2 border-white/20 shadow-lg group-hover:scale-105 transition-transform duration-300">
                          <School className="h-8 w-8 text-primary group-hover:text-secondary transition-colors duration-300" />
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-2 border-white rounded-full shadow-md" />
                      </div>
                      
                      {/* Classroom Info with Enhanced Typography */}
                      <div className="flex-1 space-y-1">
                        <h3 className="font-bold text-xl leading-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent group-hover:from-primary group-hover:to-secondary transition-all duration-300">
                          {classroom.name}
                        </h3>
                        <div className="flex items-center gap-2">
                          <Badge className={`bg-gradient-to-r ${getSectionColor(classroom.section || 'primary')} text-xs font-semibold px-2.5 py-1 rounded-full`}>
                            {getSectionDisplayName(classroom.section || 'primary')}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Details Grid with Modern Layout */}
                  <div className="p-6 pt-4 space-y-4">
                    {/* Info Cards Grid */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-center p-3 rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 group-hover:border-blue-500/40 transition-all duration-300">
                        <div className="text-xs font-medium text-muted-foreground mb-1">Capacity</div>
                        <div className="font-bold text-sm text-blue-600 dark:text-blue-400">{classroom.capacity} students</div>
                      </div>
                      <div className="text-center p-3 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 group-hover:border-green-500/40 transition-all duration-300">
                        <div className="text-xs font-medium text-muted-foreground mb-1">Status</div>
                        <div className="font-bold text-sm text-green-600 dark:text-green-400">Active</div>
                      </div>
                    </div>

                    {/* Teacher Information with Modern Layout */}
                    <div className="p-4 rounded-xl bg-gradient-to-br from-muted/20 to-muted/10 border border-border/30">
                      <div className="flex items-center space-x-3 group/teacher hover:bg-white/5 p-2 rounded-lg transition-all duration-200">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                          <User className="h-4 w-4 text-purple-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-medium text-muted-foreground mb-1">Assigned Teacher</div>
                          {getTeacherInfo(classroom.teacherId) ? (
                            <div className="flex items-center space-x-2">
                              <ProfileAvatar 
                                name={getTeacherInfo(classroom.teacherId)!} 
                                size="sm"
                              />
                              <span className="font-medium text-sm text-foreground/90 truncate">{getTeacherInfo(classroom.teacherId)}</span>
                            </div>
                          ) : (
                            <p className="text-sm text-muted-foreground italic">No teacher assigned</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Created Date */}
                    {classroom.createdAt && (
                      <div className="flex items-center space-x-3 p-3 rounded-xl bg-gradient-to-br from-orange-500/10 to-yellow-500/10 border border-orange-500/20">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center">
                          <Calendar className="h-4 w-4 text-orange-600" />
                        </div>
                        <div className="flex-1">
                          <div className="text-xs font-medium text-muted-foreground">Created Date</div>
                          <div className="font-medium text-sm text-orange-600 dark:text-orange-400">
                            {new Date(classroom.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Modern Action Buttons */}
                    <div className="flex gap-2 pt-2">
                      <Link to={`/edit-classroom/${classroom.id}`} className="flex-1">
                        <Button 
                          size="sm" 
                          className="w-full bg-gradient-to-r from-blue-500/15 to-cyan-500/15 hover:from-blue-500/25 hover:to-cyan-500/25 text-blue-950 dark:text-blue-200 border border-blue-500/40 hover:border-blue-500/60 transition-all duration-300 group/btn font-semibold"
                        >
                          <Edit className="h-4 w-4 mr-2 group-hover/btn:scale-110 transition-transform duration-200" />
                          Edit
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-red-500/15 to-pink-500/15 hover:from-red-500/25 hover:to-pink-500/25 text-red-950 dark:text-red-200 border border-red-500/40 hover:border-red-500/60 transition-all duration-300 group/btn font-semibold"
                        onClick={() => handleDeleteClassroom(classroom.id, classroom.name)}
                      >
                        <Trash2 className="h-4 w-4 group-hover/btn:scale-110 transition-transform duration-200" />
                      </Button>
                    </div>
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