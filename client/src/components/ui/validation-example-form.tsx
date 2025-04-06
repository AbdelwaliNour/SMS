import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { EnhancedFormField, EnhancedSelectField, EnhancedTextareaField, EnhancedFormSection } from '@/components/ui/enhanced-form-field';
import { ValidationRules, createFormResolver } from '@/lib/form-validation';
import { toast } from '@/hooks/use-toast';
import { CheckCircle2, AlertTriangle } from 'lucide-react';

// Define validation schema using our reusable validation rules
const formSchema = z.object({
  firstName: ValidationRules.requiredText('First name', 2, 50),
  lastName: ValidationRules.requiredText('Last name', 2, 50),
  email: ValidationRules.requiredEmail(),
  phone: ValidationRules.phoneNumber(false),
  role: z.string().min(1, 'Please select a role'),
  department: z.string().min(1, 'Please select a department'),
  bio: ValidationRules.optionalText('Bio', 10, 500),
  password: ValidationRules.password(),
  confirmPassword: ValidationRules.passwordConfirmation('password'),
  agreeToTerms: z.boolean().refine(val => val === true, {
    message: 'You must agree to the terms and conditions'
  })
});

type FormValues = z.infer<typeof formSchema>;

export function ValidationExampleForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: createFormResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      role: '',
      department: '',
      bio: '',
      password: '',
      confirmPassword: '',
      agreeToTerms: false
    },
    mode: 'onChange' // Validate on change for immediate feedback
  });
  
  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Success toast
      toast({
        title: "Form Submitted Successfully",
        description: "Your form has been submitted with validation.",
        variant: "default"
      });
      
      // Log form data
      console.log('Form data:', data);
      
      // Reset form
      form.reset();
    } catch (error) {
      // Error toast
      toast({
        title: "Submission Failed",
        description: "There was an error submitting the form. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const roleOptions = [
    { value: 'admin', label: 'Administrator' },
    { value: 'manager', label: 'Manager' },
    { value: 'employee', label: 'Employee' },
    { value: 'guest', label: 'Guest' }
  ];
  
  const departmentOptions = [
    { value: 'it', label: 'Information Technology' },
    { value: 'hr', label: 'Human Resources' },
    { value: 'finance', label: 'Finance' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'operations', label: 'Operations' }
  ];

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Enhanced Form Validation</CardTitle>
        <CardDescription>
          This form demonstrates our enhanced validation with visual feedback and animations.
        </CardDescription>
      </CardHeader>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <EnhancedFormSection 
              title="Personal Information" 
              description="Enter your personal details below"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <EnhancedFormField
                  form={form}
                  name="firstName"
                  label="First Name"
                  placeholder="Enter your first name"
                  required
                />
                
                <EnhancedFormField
                  form={form}
                  name="lastName"
                  label="Last Name"
                  placeholder="Enter your last name"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <EnhancedFormField
                  form={form}
                  name="email"
                  label="Email Address"
                  type="email"
                  placeholder="your.email@example.com"
                  required
                  description="We'll never share your email with anyone else."
                />
                
                <EnhancedFormField
                  form={form}
                  name="phone"
                  label="Phone Number"
                  type="tel"
                  placeholder="(123) 456-7890"
                  description="Optional phone number for contact"
                />
              </div>
            </EnhancedFormSection>
            
            <EnhancedFormSection 
              title="Job Information" 
              description="Tell us about your role and department"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <EnhancedSelectField
                  form={form}
                  name="role"
                  label="Role"
                  options={roleOptions}
                  placeholder="Select your role"
                  required
                />
                
                <EnhancedSelectField
                  form={form}
                  name="department"
                  label="Department"
                  options={departmentOptions}
                  placeholder="Select your department"
                  required
                />
              </div>
              
              <EnhancedTextareaField
                form={form}
                name="bio"
                label="Biography"
                placeholder="Tell us a bit about yourself and your experience..."
                maxLength={500}
                rows={5}
                description="A brief description of your background and experience"
              />
            </EnhancedFormSection>
            
            <EnhancedFormSection 
              title="Account Security" 
              description="Set up your password with strong security"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <EnhancedFormField
                  form={form}
                  name="password"
                  label="Password"
                  type="password"
                  placeholder="Create a strong password"
                  required
                  description="Must contain at least 8 characters, including uppercase, lowercase, number, and special character."
                />
                
                <EnhancedFormField
                  form={form}
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  placeholder="Re-enter your password"
                  required
                />
              </div>
              
              <div className="mt-4">
                <div className="flex items-start space-x-2">
                  <div className="flex items-center h-5 mt-1">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-blue focus:ring-blue/50"
                      checked={form.watch('agreeToTerms')}
                      onChange={(e) => form.setValue('agreeToTerms', e.target.checked)}
                      id="agreeToTerms"
                    />
                  </div>
                  <div>
                    <label htmlFor="agreeToTerms" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      I agree to the <a href="#" className="text-blue hover:underline">Terms and Conditions</a> and <a href="#" className="text-blue hover:underline">Privacy Policy</a>
                    </label>
                    {form.formState.errors.agreeToTerms && (
                      <p className="mt-1 text-sm text-red">
                        {form.formState.errors.agreeToTerms.message?.toString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </EnhancedFormSection>
          </CardContent>
          
          <CardFooter className="flex justify-between border-t pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
              disabled={isSubmitting}
            >
              Clear Form
            </Button>
            <Button 
              type="submit"
              disabled={isSubmitting || !form.formState.isValid}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Form'}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}