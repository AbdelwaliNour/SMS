import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Employee } from '@shared/schema';
import { useLocation } from 'wouter';
import { User, Phone, Mail, Heart, FileImage, Award, Save, Loader2, UserCheck, Briefcase } from 'lucide-react';

const employeeFormSchema = z.object({
  employeeId: z.string().min(1, "Employee ID is required"),
  firstName: z.string().min(1, "First name is required"),
  middleName: z.string().nullable().optional(),
  lastName: z.string().min(1, "Last name is required"),
  gender: z.enum(['male', 'female']),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  phone: z.string().nullable().optional(),
  email: z.string().email("Invalid email address").nullable().optional(),
  role: z.enum(['teacher', 'driver', 'cleaner', 'guard', 'admin', 'staff']),
  section: z.enum(['primary', 'secondary', 'highschool']).nullable().optional(),
  shift: z.enum(['morning', 'afternoon', 'evening']).nullable().optional(),
  salary: z.number().min(0, "Salary must be positive"),
});

type EmployeeFormValues = z.infer<typeof employeeFormSchema>;

interface EditEmployeeFormProps {
  employee: Employee;
}

const EditEmployeeForm = ({ employee }: EditEmployeeFormProps) => {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [loading, setLoading] = useState(false);

  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: {
      employeeId: '',
      firstName: '',
      middleName: null,
      lastName: '',
      gender: 'male',
      dateOfBirth: '',
      phone: null,
      email: null,
      role: 'staff',
      section: null,
      shift: null,
      salary: 0,
    },
  });

  // Populate form with employee data when component mounts
  useEffect(() => {
    if (employee) {
      form.reset({
        employeeId: employee.employeeId || '',
        firstName: employee.firstName || '',
        middleName: employee.middleName || null,
        lastName: employee.lastName || '',
        gender: employee.gender || 'male',
        dateOfBirth: employee.dateOfBirth || '',
        phone: employee.phone || null,
        email: employee.email || null,
        role: employee.role || 'staff',
        section: employee.section || null,
        shift: employee.shift || null,
        salary: employee.salary || 0,
      });
    }
  }, [employee, form]);

  const onSubmit = async (data: EmployeeFormValues) => {
    setLoading(true);
    try {
      await apiRequest('PATCH', `/api/employees/${employee.id}`, data);
      toast({
        title: 'Success',
        description: 'Employee updated successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/employees'] });
      queryClient.invalidateQueries({ queryKey: [`/api/employees/${employee.id}`] });
      navigate('/employees');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update employee',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const onCancel = () => {
    navigate('/employees');
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Personal Information Section */}
        <div className="relative p-8 rounded-2xl backdrop-blur-xl bg-gradient-to-br from-white/20 via-white/10 to-transparent dark:from-gray-800/30 dark:via-gray-900/20 dark:to-transparent border border-white/20 dark:border-gray-700/30 shadow-2xl overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.15),transparent)]"></div>
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
          <div className="relative z-10">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-blue-500/20 rounded-xl backdrop-blur-sm">
                <User className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">Personal Information</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <FormField
                control={form.control}
                name="employeeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Employee ID</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g. EMP-001" 
                        {...field} 
                        className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-md border-0 h-12 rounded-xl focus:bg-white/40 dark:focus:bg-gray-800/40 focus:ring-2 focus:ring-blue-500/50 transition-all duration-200 placeholder-gray-500 dark:placeholder-gray-400"
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Gender</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-md border-0 h-12 rounded-xl focus:bg-white/40 dark:focus:bg-gray-800/40 focus:ring-2 focus:ring-blue-500/50 transition-all duration-200">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">First Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="First name" 
                        {...field} 
                        className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-md border-0 h-12 rounded-xl focus:bg-white/40 dark:focus:bg-gray-800/40 focus:ring-2 focus:ring-blue-500/50 transition-all duration-200 placeholder-gray-500 dark:placeholder-gray-400"
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="middleName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Middle Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Middle name (optional)" 
                        {...field}
                        value={field.value || ''}
                        className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-md border-0 h-12 rounded-xl focus:bg-white/40 dark:focus:bg-gray-800/40 focus:ring-2 focus:ring-blue-500/50 transition-all duration-200 placeholder-gray-500 dark:placeholder-gray-400"
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Last Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Last name" 
                        {...field} 
                        className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-md border-0 h-12 rounded-xl focus:bg-white/40 dark:focus:bg-gray-800/40 focus:ring-2 focus:ring-blue-500/50 transition-all duration-200 placeholder-gray-500 dark:placeholder-gray-400"
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
        
        {/* Contact Information Section */}
        <div className="relative p-8 rounded-2xl backdrop-blur-xl bg-gradient-to-br from-white/20 via-white/10 to-transparent dark:from-gray-800/30 dark:via-gray-900/20 dark:to-transparent border border-white/20 dark:border-gray-700/30 shadow-2xl overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_80%,rgba(34,197,94,0.1),transparent)] dark:bg-[radial-gradient(circle_at_30%_80%,rgba(34,197,94,0.15),transparent)]"></div>
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-green-500/50 to-transparent"></div>
          <div className="relative z-10">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-green-500/20 rounded-xl backdrop-blur-sm">
                <Phone className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold bg-gradient-to-r from-green-600 to-blue-600 dark:from-green-400 dark:to-blue-400 bg-clip-text text-transparent">Contact Information</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Date of Birth</FormLabel>
                    <FormControl>
                      <Input 
                        type="date" 
                        {...field} 
                        className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-md border-0 h-12 rounded-xl focus:bg-white/40 dark:focus:bg-gray-800/40 focus:ring-2 focus:ring-green-500/50 transition-all duration-200"
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Phone Number</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="+252 XX XXX XXXX" 
                        {...field}
                        value={field.value || ''}
                        className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-md border-0 h-12 rounded-xl focus:bg-white/40 dark:focus:bg-gray-800/40 focus:ring-2 focus:ring-green-500/50 transition-all duration-200 placeholder-gray-500 dark:placeholder-gray-400"
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Email Address</FormLabel>
                    <FormControl>
                      <Input 
                        type="email" 
                        placeholder="email@example.com" 
                        {...field}
                        value={field.value || ''}
                        className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-md border-0 h-12 rounded-xl focus:bg-white/40 dark:focus:bg-gray-800/40 focus:ring-2 focus:ring-green-500/50 transition-all duration-200 placeholder-gray-500 dark:placeholder-gray-400"
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
        
        {/* Employment Information Section */}
        <div className="relative p-8 rounded-2xl backdrop-blur-xl bg-gradient-to-br from-white/20 via-white/10 to-transparent dark:from-gray-800/30 dark:via-gray-900/20 dark:to-transparent border border-white/20 dark:border-gray-700/30 shadow-2xl overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(168,85,247,0.1),transparent)] dark:bg-[radial-gradient(circle_at_70%_20%,rgba(168,85,247,0.15),transparent)]"></div>
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
          <div className="relative z-10">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-purple-500/20 rounded-xl backdrop-blur-sm">
                <Briefcase className="h-5 w-5 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">Employment Information</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Role</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-md border-0 h-12 rounded-xl focus:bg-white/40 dark:focus:bg-gray-800/40 focus:ring-2 focus:ring-purple-500/50 transition-all duration-200">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="teacher">Teacher</SelectItem>
                        <SelectItem value="driver">Driver</SelectItem>
                        <SelectItem value="cleaner">Cleaner</SelectItem>
                        <SelectItem value="guard">Security Guard</SelectItem>
                        <SelectItem value="admin">Administrator</SelectItem>
                        <SelectItem value="staff">Support Staff</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="salary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Monthly Salary</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Salary amount" 
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        value={field.value}
                        className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-md border-0 h-12 rounded-xl focus:bg-white/40 dark:focus:bg-gray-800/40 focus:ring-2 focus:ring-purple-500/50 transition-all duration-200 placeholder-gray-500 dark:placeholder-gray-400"
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="section"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Section Assignment</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value || ''}>
                      <FormControl>
                        <SelectTrigger className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-md border-0 h-12 rounded-xl focus:bg-white/40 dark:focus:bg-gray-800/40 focus:ring-2 focus:ring-purple-500/50 transition-all duration-200">
                          <SelectValue placeholder="Select section" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="">Not Assigned</SelectItem>
                        <SelectItem value="primary">Primary School</SelectItem>
                        <SelectItem value="secondary">Secondary School</SelectItem>
                        <SelectItem value="highschool">High School</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="shift"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Work Shift</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value || ''}>
                      <FormControl>
                        <SelectTrigger className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-md border-0 h-12 rounded-xl focus:bg-white/40 dark:focus:bg-gray-800/40 focus:ring-2 focus:ring-purple-500/50 transition-all duration-200">
                          <SelectValue placeholder="Select shift" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="">Not Assigned</SelectItem>
                        <SelectItem value="morning">Morning Shift</SelectItem>
                        <SelectItem value="afternoon">Afternoon Shift</SelectItem>
                        <SelectItem value="evening">Evening Shift</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 pt-6">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            disabled={loading}
            className="bg-white/20 dark:bg-gray-800/20 backdrop-blur-md border-0 hover:bg-white/30 dark:hover:bg-gray-800/30 px-6 py-3 rounded-xl transition-all duration-200 text-gray-700 dark:text-gray-300"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={loading}
            className="bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 hover:from-blue-600 hover:via-purple-600 hover:to-blue-700 text-white shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300 px-6 py-3 rounded-xl backdrop-blur-md border border-white/20"
          >
            <span className="flex items-center space-x-2">
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Update Employee</span>
                </>
              )}
              <div className="w-1 h-1 bg-white/70 rounded-full animate-pulse"></div>
            </span>
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EditEmployeeForm;