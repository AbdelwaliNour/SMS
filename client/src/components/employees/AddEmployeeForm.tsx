import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ValidationMessages, ValidationPatterns } from "@/lib/form-validation";
import { cn, generateEmployeeId } from "@/lib/utils";
import { format } from "date-fns";
import { 
  CalendarIcon, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  DollarSign,
  School,
  Users,
  Badge as BadgeIcon,
  Save,
  X,
  UserPlus
} from "lucide-react";

// Enhanced form schema with more detailed validations
const employeeFormSchema = z.object({
  employeeId: z
    .string()
    .min(1, ValidationMessages.required)
    .min(3, ValidationMessages.min(3))
    .max(20, ValidationMessages.max(20)),

  firstName: z
    .string()
    .min(1, ValidationMessages.required)
    .min(2, ValidationMessages.min(2))
    .max(50, ValidationMessages.max(50))
    .regex(
      ValidationPatterns.letters,
      "Please enter a valid name (letters only)",
    ),

  middleName: z
    .string()
    .max(50, ValidationMessages.max(50))
    .regex(
      ValidationPatterns.letters,
      "Please enter a valid name (letters only)",
    )
    .optional(),

  lastName: z
    .string()
    .min(1, ValidationMessages.required)
    .min(2, ValidationMessages.min(2))
    .max(50, ValidationMessages.max(50))
    .regex(
      ValidationPatterns.letters,
      "Please enter a valid name (letters only)",
    ),

  gender: z.enum(["male", "female"]),

  dateOfBirth: z.date().optional(),

  phone: z
    .string()
    .optional(),

  email: z
    .string()
    .email("Please enter a valid email address")
    .optional()
    .or(z.literal("")),

  address: z
    .string()
    .max(200, ValidationMessages.max(200))
    .optional(),

  role: z.enum(["teacher", "admin", "staff", "principal"]),

  section: z.enum(["primary", "secondary", "highschool"]),

  shift: z.enum(["morning", "afternoon", "evening"]),

  salary: z
    .coerce.number()
    .min(1, "Salary is required and must be positive"),

  profilePhoto: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
});

type EmployeeFormData = z.infer<typeof employeeFormSchema>;

interface AddEmployeeFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function AddEmployeeForm({ onSuccess, onCancel }: AddEmployeeFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: {
      employeeId: generateEmployeeId(),
      firstName: "",
      middleName: "",
      lastName: "",
      gender: "male",
      phone: "",
      email: "",
      address: "",
      role: "teacher",
      section: "primary",
      shift: "morning",
      salary: 0,
      profilePhoto: "",
    },
  });

  const onSubmit = async (data: EmployeeFormData) => {
    setIsSubmitting(true);
    try {
      const submitData = {
        ...data,
        middleName: data.middleName || null,
        phone: data.phone || null,
        email: data.email || null,
        address: data.address || null,
        dateOfBirth: data.dateOfBirth ? data.dateOfBirth.toISOString().split('T')[0] : null,
        subjects: null, // Add the missing subjects field
      };

      await apiRequest("POST", "/api/employees", submitData);
      
      toast({
        title: "Success",
        description: "Employee added successfully",
      });
      
      queryClient.invalidateQueries({ queryKey: ["/api/employees"] });
      form.reset();
      onSuccess?.();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add employee",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
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
              <FormField
                control={form.control}
                name="employeeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Employee ID</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Auto-generated" 
                        {...field} 
                        className="glass-morphism border-border/30 h-11"
                        disabled={true}
                      />
                    </FormControl>
                    <p className="text-xs text-muted-foreground">Auto-generated unique identifier</p>
                    <FormMessage />
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
                        <SelectTrigger className="glass-morphism border-border/30 h-11">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">First Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="John" 
                        {...field} 
                        className="glass-morphism border-border/30 h-11"
                      />
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
                    <FormLabel className="text-sm font-medium">Middle Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Optional" 
                        {...field} 
                        className="glass-morphism border-border/30 h-11"
                      />
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
                    <FormLabel className="text-sm font-medium">Last Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Doe" 
                        {...field} 
                        className="glass-morphism border-border/30 h-11"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Date of Birth</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "glass-morphism border-border/30 h-11 w-full justify-start text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? format(field.value, "PPP") : "Select date"}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Address</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Street address" 
                        {...field} 
                        className="glass-morphism border-border/30 h-11"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
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
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Phone Number</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="+1 (555) 123-4567" 
                        {...field} 
                        className="glass-morphism border-border/30 h-11"
                      />
                    </FormControl>
                    <p className="text-xs text-muted-foreground">Optional - Contact number</p>
                    <FormMessage />
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
                        placeholder="john.doe@school.edu" 
                        {...field} 
                        className="glass-morphism border-border/30 h-11"
                      />
                    </FormControl>
                    <p className="text-xs text-muted-foreground">Optional - Professional email</p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="profilePhoto"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Profile Picture</FormLabel>
                    <FormControl>
                      <Input 
                        type="url"
                        placeholder="https://example.com/photo.jpg" 
                        {...field} 
                        className="glass-morphism border-border/30 h-11"
                      />
                    </FormControl>
                    <p className="text-xs text-muted-foreground">Optional - URL to profile picture</p>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        {/* Employment Details Section */}
        <div className="card-modern glass-morphism p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5"></div>
          <div className="relative z-10">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <Briefcase className="h-5 w-5 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gradient">Employment Details</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Job Role</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="glass-morphism border-border/30 h-11">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="teacher">Teacher</SelectItem>
                        <SelectItem value="admin">Administrator</SelectItem>
                        <SelectItem value="staff">Staff Member</SelectItem>
                        <SelectItem value="principal">Principal</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="section"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Section</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="glass-morphism border-border/30 h-11">
                          <SelectValue placeholder="Select section" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="primary">Primary School</SelectItem>
                        <SelectItem value="secondary">Secondary School</SelectItem>
                        <SelectItem value="highschool">High School</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="shift"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Work Shift</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="glass-morphism border-border/30 h-11">
                          <SelectValue placeholder="Select shift" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="morning">Morning (8:00 AM - 2:00 PM)</SelectItem>
                        <SelectItem value="afternoon">Afternoon (2:00 PM - 8:00 PM)</SelectItem>
                        <SelectItem value="evening">Evening (6:00 PM - 10:00 PM)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="salary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Salary</FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        placeholder="50000" 
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                        className="glass-morphism border-border/30 h-11"
                      />
                    </FormControl>
                    <p className="text-xs text-muted-foreground">Annual salary in USD</p>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-border/30">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            className="px-6 py-2 bg-gray-100 border-2 border-gray-400 hover:bg-red-100 hover:border-red-400 hover:text-red-700 text-gray-800 font-medium rounded-lg transition-all duration-200 shadow-sm"
          >
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 px-8"
          >
            {isSubmitting ? (
              <>
                <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Adding...
              </>
            ) : (
              <>
                <UserPlus className="h-4 w-4 mr-2" />
                Add Employee
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}