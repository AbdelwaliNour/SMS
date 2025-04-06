import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Employee } from '@shared/schema';

const employeeFormSchema = z.object({
  employeeId: z.string().min(1, "Employee ID is required"),
  firstName: z.string().min(1, "First name is required"),
  middleName: z.string().nullable().optional(),
  lastName: z.string().min(1, "Last name is required"),
  gender: z.enum(['male', 'female']),
  role: z.enum(['teacher', 'driver', 'cleaner', 'guard', 'admin', 'staff']),
  section: z.enum(['primary', 'secondary', 'highschool']).nullable(),
  shift: z.enum(['morning', 'afternoon', 'evening']).nullable(),
  phone: z.string().nullable().optional(),
  email: z.string().email("Invalid email address").nullable().optional(),
  subjects: z.array(z.string()).nullable().optional(),
});

type EmployeeFormValues = z.infer<typeof employeeFormSchema>;

interface EditEmployeeFormProps {
  employee: Employee;
  onSuccess: () => void;
  onCancel: () => void;
}

const EditEmployeeForm = ({ employee, onSuccess, onCancel }: EditEmployeeFormProps) => {
  const { toast } = useToast();

  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: {
      employeeId: employee.employeeId || '',
      firstName: employee.firstName || '',
      middleName: employee.middleName || null,
      lastName: employee.lastName || '',
      gender: employee.gender,
      role: employee.role,
      section: employee.section || null,
      shift: employee.shift || null,
      phone: employee.phone || null,
      email: employee.email || null,

      subjects: employee.subjects || null,
    },
  });

  useEffect(() => {
    form.reset({
      employeeId: employee.employeeId,
      firstName: employee.firstName,
      middleName: employee.middleName,
      lastName: employee.lastName,
      gender: employee.gender,
      role: employee.role,
      section: employee.section,
      shift: employee.shift,
      phone: employee.phone,
      email: employee.email,

      subjects: employee.subjects,
    });
  }, [employee, form]);

  const onSubmit = async (data: EmployeeFormValues) => {
    try {
      // If subjects is provided as a string, convert it to an array
      const formattedData = {
        ...data,
        subjects: data.subjects || null,
      };

      await apiRequest('PATCH', `/api/employees/${employee.id}`, formattedData);
      toast({
        title: 'Success',
        description: 'Employee updated successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/employees'] });
      onSuccess();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update employee',
        variant: 'destructive',
      });
    }
  };

  // Prepare subjects data for form
  const subjectsString = employee.subjects ? employee.subjects.join(', ') : '';

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information Section */}
        <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-100 dark:border-gray-800">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">Basic Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <FormField
              control={form.control}
              name="employeeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs text-gray-700 dark:text-gray-300">Employee ID</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g. EMP-2024-001" 
                      {...field} 
                      className="border-gray-200 dark:border-gray-700 focus:border-blue focus:ring-1 focus:ring-blue"
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs text-gray-700 dark:text-gray-300">Role</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="border-gray-200 dark:border-gray-700 focus:border-blue focus:ring-1 focus:ring-blue">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="teacher">Teacher</SelectItem>
                      <SelectItem value="driver">Driver</SelectItem>
                      <SelectItem value="cleaner">Cleaner</SelectItem>
                      <SelectItem value="guard">Guard</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="staff">Staff</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs text-gray-700 dark:text-gray-300">First Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="First name" 
                      {...field} 
                      className="border-gray-200 dark:border-gray-700 focus:border-blue focus:ring-1 focus:ring-blue"
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
                  <FormLabel className="text-xs text-gray-700 dark:text-gray-300">Middle Name (Optional)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Middle name" 
                      {...field} 
                      value={field.value || ''}
                      onChange={(e) => field.onChange(e.target.value || null)}
                      className="border-gray-200 dark:border-gray-700 focus:border-blue focus:ring-1 focus:ring-blue"
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
                  <FormLabel className="text-xs text-gray-700 dark:text-gray-300">Last Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Last name" 
                      {...field} 
                      className="border-gray-200 dark:border-gray-700 focus:border-blue focus:ring-1 focus:ring-blue"
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Contact Information Section */}
        <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-100 dark:border-gray-800">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">Contact Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs text-gray-700 dark:text-gray-300">Gender</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="border-gray-200 dark:border-gray-700 focus:border-blue focus:ring-1 focus:ring-blue">
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
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs text-gray-700 dark:text-gray-300">Phone (Optional)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Phone number" 
                      {...field} 
                      value={field.value || ''}
                      onChange={(e) => field.onChange(e.target.value || null)}
                      className="border-gray-200 dark:border-gray-700 focus:border-blue focus:ring-1 focus:ring-blue"
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs text-gray-700 dark:text-gray-300">Email (Optional)</FormLabel>
                <FormControl>
                  <Input 
                    type="email" 
                    placeholder="Email address" 
                    {...field} 
                    value={field.value || ''}
                    onChange={(e) => field.onChange(e.target.value || null)}
                    className="border-gray-200 dark:border-gray-700 focus:border-blue focus:ring-1 focus:ring-blue"
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
        </div>

        {/* Assignment Section */}
        <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-100 dark:border-gray-800">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">Work Assignment</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <FormField
              control={form.control}
              name="shift"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs text-gray-700 dark:text-gray-300">Shift</FormLabel>
                  <Select 
                    onValueChange={(value) => field.onChange(value || null)} 
                    defaultValue={field.value || undefined}
                  >
                    <FormControl>
                      <SelectTrigger className="border-gray-200 dark:border-gray-700 focus:border-blue focus:ring-1 focus:ring-blue">
                        <SelectValue placeholder="Select shift" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">Not Assigned</SelectItem>
                      <SelectItem value="morning">Morning</SelectItem>
                      <SelectItem value="afternoon">Afternoon</SelectItem>
                      <SelectItem value="evening">Evening</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            
            {form.watch('role') === 'teacher' && (
              <FormField
                control={form.control}
                name="section"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs text-gray-700 dark:text-gray-300">Section</FormLabel>
                    <Select 
                      onValueChange={(value) => field.onChange(value || null)} 
                      defaultValue={field.value || undefined}
                    >
                      <FormControl>
                        <SelectTrigger className="border-gray-200 dark:border-gray-700 focus:border-blue focus:ring-1 focus:ring-blue">
                          <SelectValue placeholder="Select section" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">Not Assigned</SelectItem>
                        <SelectItem value="primary">Primary</SelectItem>
                        <SelectItem value="secondary">Secondary</SelectItem>
                        <SelectItem value="highschool">High School</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            )}
          </div>
          
          {form.watch('role') === 'teacher' && (
            <FormField
              control={form.control}
              name="subjects"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs text-gray-700 dark:text-gray-300">Subjects (comma separated)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g. Math, Science, History" 
                      defaultValue={subjectsString}
                      onChange={(e) => {
                        const value = e.target.value;
                        const subjects = value 
                          ? value.split(',').map(s => s.trim()).filter(Boolean) 
                          : null;
                        field.onChange(subjects);
                      }}
                      className="border-gray-200 dark:border-gray-700 focus:border-blue focus:ring-1 focus:ring-blue"
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          )}
        </div>

        <div className="flex justify-end space-x-3 pt-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            className="border-gray-200 hover:bg-gray-50 text-gray-600"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            className="bg-blue hover:bg-blue/90 text-white shadow-sm hover:shadow"
          >
            Update Employee
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EditEmployeeForm;