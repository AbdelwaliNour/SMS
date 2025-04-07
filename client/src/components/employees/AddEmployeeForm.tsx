import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { ValidationMessages, ValidationPatterns } from "@/lib/form-validation";
import { EnhancedFormField } from "@/components/ui/enhanced-form-field";

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
    .nullable()
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

  role: z.enum(["teacher", "driver", "cleaner", "guard", "admin", "staff"]),

  section: z.enum(["primary", "secondary", "highschool"]).nullable(),

  shift: z.enum(["morning", "afternoon", "evening"]).nullable(),

  phone: z
    .string()
    .regex(ValidationPatterns.phone, "Please enter a valid phone number")
    .nullable()
    .optional(),

  email: z.string().email(ValidationMessages.email).nullable().optional(),

  subjects: z.array(z.string()).nullable().optional(),
});

type EmployeeFormValues = z.infer<typeof employeeFormSchema>;

const AddEmployeeForm = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: {
      employeeId: "",
      firstName: "",
      middleName: null,
      lastName: "",
      gender: "male",
      role: "teacher",
      section: null,
      shift: null,
      phone: null,
      email: null,
      subjects: null,
    },
  });

  const onSubmit = async (data: EmployeeFormValues) => {
    setLoading(true);
    try {
      // If subjects is provided as a string, convert it to an array
      const formattedData = {
        ...data,
        subjects: data.subjects || null,
      };

      await apiRequest("POST", "/api/employees", formattedData);
      toast({
        title: "Success",
        description: "Employee added successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/employees"] });
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add employee",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information Section */}
        <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-100 dark:border-gray-800">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">
            Basic Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <EnhancedFormField
              form={form}
              name="employeeId"
              label="Employee ID"
              placeholder="e.g. EMP-2024-001"
              isRequired={true}
              description="Unique identifier for the employee"
            />

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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <EnhancedFormField
              form={form}
              name="firstName"
              label="First Name"
              isRequired={true}
            />

            <EnhancedFormField
              form={form}
              name="middleName"
              label="Middle Name"
              description="Optional"
            />

            <EnhancedFormField
              form={form}
              name="lastName"
              label="Last Name"
              isRequired={true}
            />
          </div>
        </div>

        {/* Contact Information Section */}
        <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-100 dark:border-gray-800">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">
            Contact Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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

            <EnhancedFormField
              form={form}
              name="phone"
              label="Phone"
              type="tel"
              description="Optional"
              placeholder="e.g. +1 (555) 123-4567"
            />
          </div>

          <EnhancedFormField
            form={form}
            name="email"
            label="Email"
            type="email"
            description="Optional"
            placeholder="e.g. john.doe@example.com"
          />
        </div>

        {/* Assignment Section */}
        <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-100 dark:border-gray-800">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">
            Work Assignment
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <EnhancedFormField
              form={form}
              name="shift"
              label="Shift"
              type="select"
              options={[
                { value: "morning", label: "Morning" },
                { value: "afternoon", label: "Afternoon" },
                { value: "evening", label: "Evening" },
              ]}
              description="Work schedule"
            />

            {form.watch("role") === "teacher" && (
              <EnhancedFormField
                form={form}
                name="section"
                label="Section"
                type="select"
                options={[
                  { value: "primary", label: "Primary" },
                  { value: "secondary", label: "Secondary" },
                  { value: "highschool", label: "High School" },
                ]}
                description="Teaching section"
              />
            )}
          </div>

          {form.watch("role") === "teacher" && (
            <EnhancedFormField
              form={form}
              name="subjects"
              label="Subjects"
              type="text"
              placeholder="e.g. Math, Science, History"
              description="Enter subjects separated by commas"
              onChange={(value) => {
                const subjects = value
                  ? value
                      .toString()
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean)
                  : null;
                form.setValue("subjects", subjects);
              }}
            />
          )}
        </div>

        <div className="flex justify-end space-x-3 pt-2">
          <Button
            type="submit"
            className="bg-blue hover:bg-blue/90 text-white shadow-sm hover:shadow"
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Employee"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AddEmployeeForm;
