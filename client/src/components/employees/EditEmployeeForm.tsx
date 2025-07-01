import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { ValidationMessages, ValidationPatterns } from '@/lib/form-validation';
import { EnhancedFormField } from '@/components/ui/enhanced-form-field';
import { Employee } from '@shared/schema';
import { useLocation } from 'wouter';
import { User, Phone, Mail, Heart, FileImage, Award, Save, Loader2, UserCheck, Briefcase, X } from 'lucide-react';

const employeeFormSchema = z.object({
  employeeId: z.string().min(1, ValidationMessages.required),
  firstName: z.string()
    .min(1, ValidationMessages.required)
    .regex(ValidationPatterns.name, ValidationMessages.name),
  middleName: z.string().optional(),
  lastName: z.string()
    .min(1, ValidationMessages.required)
    .regex(ValidationPatterns.name, ValidationMessages.name),
  gender: z.enum(['male', 'female']),
  dateOfBirth: z.string().optional(),
  phone: z.string()
    .regex(ValidationPatterns.phone, ValidationMessages.phone)
    .optional()
    .or(z.literal("")),
  email: z.string()
    .email(ValidationMessages.email)
    .optional()
    .or(z.literal("")),
  role: z.enum(['teacher', 'driver', 'cleaner', 'guard', 'admin', 'staff']),
  section: z.enum(['primary', 'secondary', 'highschool']),
  shift: z.enum(['morning', 'afternoon', 'evening']),
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
      middleName: '',
      lastName: '',
      gender: 'male',
      dateOfBirth: '',
      phone: '',
      email: '',
      role: 'teacher',
      section: 'primary',
      shift: 'morning',
      salary: 0,
    },
  });

  useEffect(() => {
    if (employee) {
      form.reset({
        employeeId: employee.employeeId,
        firstName: employee.firstName,
        middleName: employee.middleName || '',
        lastName: employee.lastName,
        gender: employee.gender,
        dateOfBirth: employee.dateOfBirth || '',
        phone: employee.phone || '',
        email: employee.email || '',
        role: employee.role,
        section: employee.section || 'primary',
        shift: employee.shift || 'morning',
        salary: employee.salary,
      });
    }
  }, [employee, form]);

  const onSubmit = async (data: EmployeeFormValues) => {
    setLoading(true);
    try {
      const submitData = {
        ...data,
        middleName: data.middleName || null,
        phone: data.phone || null,
        email: data.email || null,
        dateOfBirth: data.dateOfBirth || null,
        subjects: null, // Add the missing subjects field
      };

      await apiRequest('PATCH', `/api/employees/${employee.id}`, submitData);
      
      toast({
        title: 'Success',
        description: 'Employee updated successfully',
      });
      
      queryClient.invalidateQueries({ queryKey: ['/api/employees'] });
      navigate('/employees');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update employee',
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
    <div className="space-y-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Personal Information Section */}
          <div className="card-modern glass-morphism p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5"></div>
            <div className="relative z-10">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gradient">Personal Information</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <EnhancedFormField
                  form={form}
                  name="employeeId"
                  label="Employee ID"
                  placeholder="Auto-generated"
                  isRequired={true}
                  description="Auto-generated unique identifier"
                  disabled={true}
                />

                <EnhancedFormField
                  form={form}
                  name="gender"
                  label="Gender"
                  type="select"
                  isRequired={true}
                  options={[
                    { value: "male", label: "Male" },
                    { value: "female", label: "Female" },
                  ]}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <EnhancedFormField
                  form={form}
                  name="firstName"
                  label="First Name"
                  placeholder="John"
                  isRequired={true}
                />

                <EnhancedFormField
                  form={form}
                  name="middleName"
                  label="Middle Name"
                  placeholder="Optional"
                />

                <EnhancedFormField
                  form={form}
                  name="lastName"
                  label="Last Name"
                  placeholder="Doe"
                  isRequired={true}
                />
              </div>
            </div>
          </div>

          {/* Contact Information Section */}
          <div className="card-modern glass-morphism p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-blue-500/5"></div>
            <div className="relative z-10">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <Phone className="h-5 w-5 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gradient">Contact Information</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <EnhancedFormField
                  form={form}
                  name="phone"
                  label="Phone Number"
                  placeholder="+1 (555) 123-4567"
                  description="Optional contact number"
                />

                <EnhancedFormField
                  form={form}
                  name="email"
                  label="Email Address"
                  placeholder="john.doe@example.com"
                  description="Optional email address"
                />

                <EnhancedFormField
                  form={form}
                  name="dateOfBirth"
                  label="Date of Birth"
                  type="date"
                  description="Optional birth date"
                />

                <EnhancedFormField
                  form={form}
                  name="profilePhoto"
                  label="Profile Picture"
                  type="url"
                  placeholder="https://example.com/photo.jpg"
                  description="Optional profile picture URL"
                />
              </div>
            </div>
          </div>

          {/* Employment Information Section */}
          <div className="card-modern glass-morphism p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5"></div>
            <div className="relative z-10">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <Briefcase className="h-5 w-5 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gradient">Employment Information</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <EnhancedFormField
                  form={form}
                  name="role"
                  label="Role"
                  type="select"
                  isRequired={true}
                  options={[
                    { value: "teacher", label: "Teacher" },
                    { value: "driver", label: "Driver" },
                    { value: "cleaner", label: "Cleaner" },
                    { value: "guard", label: "Guard" },
                    { value: "admin", label: "Admin" },
                    { value: "staff", label: "Staff" },
                  ]}
                />

                <EnhancedFormField
                  form={form}
                  name="salary"
                  label="Salary"
                  type="number"
                  placeholder="50000"
                  isRequired={true}
                  description="Annual salary amount"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <EnhancedFormField
                  form={form}
                  name="section"
                  label="Section"
                  type="select"
                  isRequired={true}
                  options={[
                    { value: "primary", label: "Primary" },
                    { value: "secondary", label: "Secondary" },
                    { value: "highschool", label: "High School" },
                  ]}
                />

                <EnhancedFormField
                  form={form}
                  name="shift"
                  label="Shift"
                  type="select"
                  isRequired={true}
                  options={[
                    { value: "morning", label: "Morning" },
                    { value: "afternoon", label: "Afternoon" },
                    { value: "evening", label: "Evening" },
                  ]}
                />
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center justify-end space-x-4 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="px-6 py-2 bg-white/10 border-2 border-gray-300 hover:bg-red-50 hover:border-red-300 text-gray-700 font-medium rounded-lg transition-all duration-200"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="btn-primary"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Update Employee
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EditEmployeeForm;