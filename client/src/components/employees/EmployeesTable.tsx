import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Employee } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { Link } from 'wouter';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ProfileAvatar } from '@/components/ui/profile-avatar';
import EmployeesTableSkeleton from './EmployeesTableSkeleton';
import { useLocation } from 'wouter';
import { 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Users, 
  UserPlus, 
  Mail, 
  Phone, 
  MapPin,
  Badge as BadgeIcon,
  Calendar
} from 'lucide-react';

interface EmployeesTableProps {
  onAddEmployee: () => void;
}

const EmployeesTable: React.FC<EmployeesTableProps> = ({ onAddEmployee }) => {
  const [, navigate] = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    role: '',
    section: '',
  });
  const { toast } = useToast();

  const { data: employees, isLoading, error, refetch } = useQuery<Employee[]>({
    queryKey: ['/api/employees'],
  });

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this employee?')) return;

    try {
      await apiRequest('DELETE', `/api/employees/${id}`);
      toast({
        title: 'Success',
        description: 'Employee deleted successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/employees'] });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete employee',
        variant: 'destructive',
      });
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'teacher':
        return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'admin':
        return 'bg-purple-500/10 text-purple-600 border-purple-500/20';
      case 'staff':
        return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'principal':
        return 'bg-red-500/10 text-red-600 border-red-500/20';
      default:
        return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
    }
  };

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

  const getGenderDisplayName = (gender: string) => {
    return gender.charAt(0).toUpperCase() + gender.slice(1);
  };

  const getSectionDisplayName = (section: string) => {
    switch (section) {
      case 'primary':
        return 'Primary';
      case 'secondary':
        return 'Secondary';
      case 'highschool':
        return 'High School';
      default:
        return section;
    }
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'teacher':
        return 'Teacher';
      case 'admin':
        return 'Administrator';
      case 'staff':
        return 'Staff Member';
      case 'principal':
        return 'Principal';
      default:
        return role;
    }
  };

  // Filter employees based on search and filters
  const filteredEmployees = employees?.filter(employee => {
    const fullName = `${employee.firstName} ${employee.lastName}`.toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase()) || 
                         employee.employeeId?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = !filters.role || employee.role === filters.role;
    const matchesSection = !filters.section || employee.section === filters.section;
    return matchesSearch && matchesRole && matchesSection;
  }) || [];

  if (isLoading) {
    return <EmployeesTableSkeleton />;
  }

  if (error) {
    return (
      <div className="text-center py-12 glass-morphism rounded-xl border border-border/30">
        <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Error loading employees</h3>
        <p className="text-muted-foreground mb-4">Please try again later</p>
        <Button onClick={() => refetch()} variant="outline">
          Try Again
        </Button>
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
            placeholder="Search employees by name or ID..."
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
            {filteredEmployees.length} employees
          </Badge>
        </div>
      </div>

      {/* Employees Grid */}
      {filteredEmployees.length === 0 ? (
        <div className="text-center py-12 glass-morphism rounded-xl border border-border/30">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No employees found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || filters.role || filters.section ? 'Try adjusting your search criteria' : 'Get started by adding your first employee'}
          </p>
          <Button onClick={onAddEmployee} className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90">
            <UserPlus className="h-4 w-4 mr-2" />
            Add Employee
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEmployees.map((employee) => {
            const fullName = `${employee.firstName} ${employee.lastName}`;
            
            return (
              <Card key={employee.id} className="group relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-card/80 via-card to-card/60 backdrop-blur-xl shadow-lg hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1">
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
                        <div className="relative">
                          <ProfileAvatar name={fullName} size="lg" className="border-2 border-white/20 shadow-lg group-hover:scale-105 transition-transform duration-300" />
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-2 border-white rounded-full shadow-md" />
                      </div>
                      
                      {/* Employee Info with Enhanced Typography */}
                      <div className="flex-1 space-y-1">
                        <h3 className="font-bold text-xl leading-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent group-hover:from-primary group-hover:to-secondary transition-all duration-300">
                          {fullName}
                        </h3>
                        <p className="text-sm font-medium text-muted-foreground/80 tracking-wider">{employee.employeeId}</p>
                        <div className="flex items-center gap-2">
                          <Badge className={`bg-gradient-to-r ${getRoleColor(employee.role)} text-xs font-semibold px-2.5 py-1 rounded-full`}>
                            {getRoleDisplayName(employee.role)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Details Grid with Modern Layout */}
                  <div className="p-6 pt-4 space-y-4">
                    {/* Info Cards Grid */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="text-center p-3 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 group-hover:border-green-500/40 transition-all duration-300">
                        <div className="text-xs font-medium text-muted-foreground mb-1">Section</div>
                        <div className="font-bold text-sm text-green-600 dark:text-green-400">{getSectionDisplayName(employee.section || 'primary')}</div>
                      </div>
                      <div className="text-center p-3 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 group-hover:border-purple-500/40 transition-all duration-300">
                        <div className="text-xs font-medium text-muted-foreground mb-1">Gender</div>
                        <div className="font-bold text-sm text-purple-600 dark:text-purple-400">{getGenderDisplayName(employee.gender)}</div>
                      </div>
                      <div className="text-center p-3 rounded-xl bg-gradient-to-br from-orange-500/10 to-yellow-500/10 border border-orange-500/20 group-hover:border-orange-500/40 transition-all duration-300">
                        <div className="text-xs font-medium text-muted-foreground mb-1">Status</div>
                        <div className="font-bold text-sm text-orange-600 dark:text-orange-400">Active</div>
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
                            {employee.email || 'No email provided'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 group/contact hover:bg-white/5 p-2 rounded-lg transition-all duration-200">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                          <Phone className="h-4 w-4 text-green-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground/90 truncate">
                            {employee.phone || 'No phone provided'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Employment Details with Modern Cards */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20">
                        <div className="flex items-center space-x-2 mb-2">
                          <Calendar className="h-4 w-4 text-cyan-600" />
                          <div className="text-xs font-medium text-muted-foreground">Joined</div>
                        </div>
                        <div className="font-bold text-sm text-cyan-600 dark:text-cyan-400">
                          {employee.createdAt ? new Date(employee.createdAt).toLocaleDateString() : 'Not set'}
                        </div>
                      </div>
                      <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500/10 to-green-500/10 border border-emerald-500/20">
                        <div className="flex items-center space-x-2 mb-2">
                          <BadgeIcon className="h-4 w-4 text-emerald-600" />
                          <div className="text-xs font-medium text-muted-foreground">Salary</div>
                        </div>
                        <div className="font-bold text-sm text-emerald-600 dark:text-emerald-400">
                          ${employee.salary?.toLocaleString() || 'Not set'}
                        </div>
                      </div>
                    </div>

                    {/* Modern Action Buttons */}
                    <div className="flex gap-2 pt-2">
                      <Link to={`/edit-employee/${employee.id}`} className="flex-1">
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
                        onClick={() => handleDelete(employee.id)}
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

export default EmployeesTable;