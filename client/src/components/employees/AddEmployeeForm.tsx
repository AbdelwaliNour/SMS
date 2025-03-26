import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { insertEmployeeSchema } from '@shared/schema';
import { useLocation } from 'wouter';

// Extend the schema for client-side validation
const employeeFormSchema = insertEmployeeSchema.extend({
  confirmEmail: z.string().email().optional(),
}).refine(
  (data) => !data.email || !data.confirmEmail || data.email === data.confirmEmail,
  {
    message: "Emails don't match",
    path: ['confirmEmail'],
  }
);

type EmployeeFormValues = z.infer<typeof employeeFormSchema>;

const AddEmployeeForm = () => {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const subjects = [
    { id: "arabic", label: "Arabic" },
    { id: "english", label: "English" },
    { id: "somali", label: "Somali" },
    { id: "math", label: "Math" },
    { id: "socail", label: "Social" },
    { id: "science", label: "Science" },
    { id: "islamic", label: "Islamic" },
  ];

  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: {
      firstName: '',
      middleName: '',
      lastName: '',
      gender: 'male',
      dateOfBirth: '',
      phone: '',
      email: '',
      role: 'teacher',
      section: 'primary',
      salary: 300,
      shift: 'morning',
      subjects: [],
      employeeId: `E-${Math.floor(Math.random() * 10000)}`,
    },
  });

  const selectedRole = form.watch('role');

  const onSubmit = async (data: EmployeeFormValues) => {
    try {
      // Remove confirmEmail as it's not part of the schema
      const { confirmEmail, ...employeeData } = data;
      
      await apiRequest('POST', '/api/employees', employeeData);
      toast({
        title: 'Success',
        description: 'Employee added successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/employees'] });
      navigate('/employees');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add employee',
        variant: 'destructive',
      });
    }
  };

  const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
  ];

  const roleOptions = [
    { value: 'teacher', label: 'Teacher' },
    { value: 'driver', label: 'Driver' },
    { value: 'cleaner', label: 'Cleaner' },
    { value: 'guard', label: 'Guard' },
    { value: 'admin', label: 'Admin' },
    { value: 'staff', label: 'Staff' },
  ];

  const sectionOptions = [
    { value: 'primary', label: 'Primary' },
    { value: 'secondary', label: 'Secondary' },
    { value: 'highschool', label: 'High School' },
  ];

  const shiftOptions = [
    { value: 'morning', label: 'Morning' },
    { value: 'afternoon', label: 'Afternoon' },
    { value: 'evening', label: 'Evening' },
  ];

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-blue text-white rounded-lg shadow-lg w-full max-w-4xl mx-auto overflow-hidden">
      <div className="p-6">
        <h2 className="text-2xl font-homenaje text-center mb-6">Add New Employee</h2>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <Input 
                          placeholder="First Name" 
                          className="bg-white bg-opacity-20 pl-10 border-white border-opacity-20 text-white placeholder-white placeholder-opacity-70" 
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="middleName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Middle Name</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <Input 
                          placeholder="Middle Name" 
                          className="bg-white bg-opacity-20 pl-10 border-white border-opacity-20 text-white placeholder-white placeholder-opacity-70" 
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <Input 
                          placeholder="Last Name" 
                          className="bg-white bg-opacity-20 pl-10 border-white border-opacity-20 text-white placeholder-white placeholder-opacity-70" 
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Birth</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <Input 
                          type="date" 
                          placeholder="Date of Birth" 
                          className="bg-white bg-opacity-20 pl-10 border-white border-opacity-20 text-white placeholder-white placeholder-opacity-70" 
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <Input 
                          type="tel" 
                          placeholder="Phone Number" 
                          className="bg-white bg-opacity-20 pl-10 border-white border-opacity-20 text-white placeholder-white placeholder-opacity-70" 
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <Input 
                          type="email" 
                          placeholder="Email" 
                          className="bg-white bg-opacity-20 pl-10 border-white border-opacity-20 text-white placeholder-white placeholder-opacity-70" 
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <div className="flex space-x-4 mt-2">
                      {genderOptions.map((option) => (
                        <label key={option.value} className="flex items-center">
                          <input
                            type="radio"
                            className="form-radio h-4 w-4 mr-2"
                            value={option.value}
                            checked={field.value === option.value}
                            onChange={() => field.onChange(option.value)}
                          />
                          <span className="flex items-center">
                            {option.value === 'male' ? (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            ) : (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            )}
                            {option.label}
                          </span>
                        </label>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="section"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Section</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-white bg-opacity-20 border-white border-opacity-20 text-white">
                          <SelectValue placeholder="Select section" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {sectionOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-white bg-opacity-20 border-white border-opacity-20 text-white">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {roleOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <FormField
                control={form.control}
                name="employeeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Employee ID</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                        </svg>
                        <Input 
                          placeholder="Employee ID" 
                          className="bg-white bg-opacity-20 pl-10 border-white border-opacity-20 text-white placeholder-white placeholder-opacity-70" 
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormItem>
                <FormLabel>Upload Employee Image</FormLabel>
                <div className="mt-1">
                  <div className="flex items-center">
                    <label className="bg-white bg-opacity-20 p-2 rounded-md cursor-pointer hover:bg-opacity-30 transition-colors flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>Upload</span>
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                    </label>
                    {uploadedImage && (
                      <div className="ml-3">
                        <img src={uploadedImage} alt="Employee" className="h-10 w-10 rounded-full object-cover" />
                      </div>
                    )}
                  </div>
                </div>
              </FormItem>
              <FormField
                control={form.control}
                name="salary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Employee Salary</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <Input 
                          type="number" 
                          placeholder="Salary" 
                          className="bg-white bg-opacity-20 pl-10 border-white border-opacity-20 text-white placeholder-white placeholder-opacity-70" 
                          {...field} 
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <FormField
                control={form.control}
                name="shift"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Shift</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-white bg-opacity-20 border-white border-opacity-20 text-white">
                          <SelectValue placeholder="Select shift" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {shiftOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {selectedRole === 'teacher' && (
                <FormField
                  control={form.control}
                  name="subjects"
                  render={() => (
                    <FormItem>
                      <FormLabel>Subjects</FormLabel>
                      <div className="grid grid-cols-3 gap-2 mt-1">
                        {subjects.map((subject) => (
                          <FormField
                            key={subject.id}
                            control={form.control}
                            name="subjects"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={subject.id}
                                  className="flex flex-row items-start space-x-2 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(subject.id)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value || [], subject.id])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== subject.id
                                              )
                                            )
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="text-sm font-normal">
                                    {subject.label}
                                  </FormLabel>
                                </FormItem>
                              )
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
            
            <div className="flex justify-center mt-6">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate('/employees')}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white border-white border-opacity-20 mr-4"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-white text-blue hover:bg-opacity-90"
              >
                Submit
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default AddEmployeeForm;
