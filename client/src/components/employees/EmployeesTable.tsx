import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Employee } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import EditEmployeeForm from './EditEmployeeForm';
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
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
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
              <Card key={employee.id} className="card-modern glass-morphism hover:border-primary/30 transition-all duration-300 group overflow-hidden">
                <CardContent className="p-6">
                  {/* Employee Header */}
                  <div className="flex items-center space-x-4 mb-4">
                    <ProfileAvatar name={fullName} size="lg" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg leading-tight">{fullName}</h3>
                      <p className="text-sm text-muted-foreground">{employee.employeeId}</p>
                    </div>
                  </div>

                  {/* Employee Details */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Role</span>
                      <Badge variant="outline" className={getRoleColor(employee.role)}>
                        {getRoleDisplayName(employee.role)}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Section</span>
                      <Badge variant="outline" className={getSectionColor(employee.section)}>
                        {getSectionDisplayName(employee.section)}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Gender</span>
                      <Badge variant="outline" className="bg-orange-500/10 text-orange-600 border-orange-500/20">
                        {getGenderDisplayName(employee.gender)}
                      </Badge>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-2 mb-6 p-4 bg-muted/20 rounded-lg">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <span className="truncate">{employee.email || 'No email'}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      <span>{employee.phone || 'No phone'}</span>
                    </div>
                  </div>

                  {/* Employment Details */}
                  <div className="space-y-2 mb-6 p-4 bg-primary/5 rounded-lg border border-primary/10">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Start Date</span>
                      <span className="font-medium">
                        {employee.dateOfJoining ? new Date(employee.dateOfJoining).toLocaleDateString() : 'Not set'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Salary</span>
                      <span className="font-medium text-green-600">
                        ${employee.salary?.toLocaleString() || 'Not set'}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 hover:bg-blue-500/10 hover:text-blue-600 hover:border-blue-500/30"
                      onClick={() => {
                        setSelectedEmployee(employee);
                        setIsEditModalOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="hover:bg-red-500/10 hover:text-red-600 hover:border-red-500/30"
                      onClick={() => handleDelete(employee.id)}
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

      {/* Edit Dialog */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="glass-morphism border-border/30 max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-gradient">Edit Employee</DialogTitle>
            <DialogDescription>
              Update the employee information below.
            </DialogDescription>
          </DialogHeader>
          {selectedEmployee && (
            <EditEmployeeForm
              employee={selectedEmployee}
              onSuccess={() => {
                setIsEditModalOpen(false);
                refetch();
              }}
              onCancel={() => setIsEditModalOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmployeesTable;