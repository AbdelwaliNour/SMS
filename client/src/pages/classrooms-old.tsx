import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { useQuery } from '@tanstack/react-query';
import { Classroom, Employee } from '@shared/schema';
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

  const { data: classrooms, isLoading, error, refetch } = useQuery<Classroom[]>({
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
              className="pl-10 glass-morphism border-border/30 bg-background/50"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Select value={filters.section} onValueChange={(value) => setFilters({ ...filters, section: value })}>
              <SelectTrigger className="w-40 glass-morphism border-border/30">
                <SelectValue placeholder="All Sections" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Sections</SelectItem>
                <SelectItem value="primary">Primary</SelectItem>
                <SelectItem value="secondary">Secondary</SelectItem>
                <SelectItem value="highschool">High School</SelectItem>
              </SelectContent>
            </Select>
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              {filteredClassrooms.length} classrooms
            </Badge>
          </div>
        </div>

        {/* Classrooms Grid */}
        {isLoading ? (
          <ClassroomsGridSkeleton />
        ) : error ? (
          <div className="text-center py-12 glass-morphism rounded-xl border border-border/30">
            <School className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Error loading classrooms</h3>
            <p className="text-muted-foreground mb-4">Please try again later</p>
            <Button onClick={() => refetch()} variant="outline">
              Try Again
            </Button>
          </div>
        ) : filteredClassrooms.length === 0 ? (
          <div className="text-center py-12 glass-morphism rounded-xl border border-border/30">
            <School className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No classrooms found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || filters.section ? 'Try adjusting your search criteria' : 'Get started by adding your first classroom'}
            </p>
            <Button 
              onClick={() => setIsAddModalOpen(true)} 
              className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Classroom
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClassrooms.map((classroom) => {
              const teacherName = getTeacherInfo(classroom.teacherId);
              
              return (
                <Card key={classroom.id} className="card-modern glass-morphism hover:border-primary/30 transition-all duration-300 group overflow-hidden">
                  <CardContent className="p-6">
                    {/* Classroom Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <MapPin className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{classroom.name}</h3>
                          <p className="text-sm text-muted-foreground">Room ID: {classroom.id}</p>
                        </div>
                      </div>
                    </div>

                    {/* Classroom Details */}
                    <div className="space-y-4 mb-6">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Section</span>
                        <Badge variant="outline" className={getSectionColor(classroom.section)}>
                          {getSectionDisplayName(classroom.section)}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Capacity</span>
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <Badge variant="outline" className={getCapacityStatus(classroom.capacity)}>
                            {classroom.capacity} students
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Teacher Assignment */}
                    <div className="p-4 bg-muted/20 rounded-lg mb-6">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-muted-foreground">Assigned Teacher</span>
                      </div>
                      <div className="mt-2">
                        {teacherName ? (
                          <div className="flex items-center space-x-2">
                            <ProfileAvatar name={teacherName} size="sm" />
                            <span className="text-sm font-medium">{teacherName}</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2 text-muted-foreground">
                            <User className="h-4 w-4" />
                            <span className="text-sm">Not assigned</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 hover:bg-blue-500/10 hover:text-blue-600 hover:border-blue-500/30"
                        onClick={() => {
                          window.location.href = `/edit-classroom?id=${classroom.id}`;
                        }}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="hover:bg-red-500/10 hover:text-red-600 hover:border-red-500/30"
                        onClick={() => handleDelete(classroom.id)}
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
    </Layout>
  );
}