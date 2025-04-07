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
import { useLocation } from "wouter";

const studentFormSchema = z.object({
  studentId: z
    .string()
    .min(1, ValidationMessages.required)
    .min(3, ValidationMessages.min(3))
    .max(20, ValidationMessages.max(20)),

  firstName: z
    .string()
    .min(1, ValidationMessages.required)
    .min(2, ValidationMessages.min(2))
    .max(50, ValidationMessages.max(50))
    .regex(ValidationPatterns.letters, "Please enter a valid name (letters only)"),

  middleName: z
    .string()
    .max(50, ValidationMessages.max(50))
    .regex(ValidationPatterns.letters, "Please enter a valid name (letters only)")
    .nullable()
    .optional(),

  lastName: z
    .string()
    .min(1, ValidationMessages.required)
    .min(2, ValidationMessages.min(2))
    .max(50, ValidationMessages.max(50))
    .regex(ValidationPatterns.letters, "Please enter a valid name (letters only)"),

  gender: z.enum(["male", "female"]),

  dateOfBirth: z.string().min(1, ValidationMessages.required),

  section: z.enum(["primary", "secondary", "highschool"]),

  class: z.string().min(1, ValidationMessages.required),

  phone: z
    .string()
    .regex(ValidationPatterns.phone, "Please enter a valid phone number")
    .nullable()
    .optional(),

  email: z.string().email(ValidationMessages.email).nullable().optional(),

  fatherName: z.string().min(1, ValidationMessages.required),
  fatherPhone: z.string().regex(ValidationPatterns.phone, "Please enter a valid phone number"),
  fatherEmail: z.string().email(ValidationMessages.email).nullable().optional(),

  motherName: z.string().min(1, ValidationMessages.required),
  motherPhone: z.string().regex(ValidationPatterns.phone, "Please enter a valid phone number"),
  motherEmail: z.string().email(ValidationMessages.email).nullable().optional(),
});

type StudentFormValues = z.infer<typeof studentFormSchema>;

const AddStudentForm = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [, navigate] = useLocation();
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedCertificate, setUploadedCertificate] = useState<string | null>(null);

  const form = useForm<StudentFormValues>({
    resolver: zodResolver(studentFormSchema),
    defaultValues: {
      studentId: `ST-${Math.floor(Math.random() * 10000)}`,
      firstName: "",
      middleName: null,
      lastName: "",
      gender: "male",
      dateOfBirth: "",
      section: "primary",
      class: "One",
      phone: null,
      email: null,
      fatherName: "",
      fatherPhone: "",
      fatherEmail: null,
      motherName: "",
      motherPhone: "",
      motherEmail: null,
    },
  });

  const onSubmit = async (data: StudentFormValues) => {
    setLoading(true);
    try {
      await apiRequest("POST", "/api/students", data);
      toast({
        title: "Success",
        description: "Student added successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/students"] });
      navigate("/students");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add student",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

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

  const handleCertificateUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedCertificate(e.target?.result as string);
      };
      reader.readAsDataURL(file);
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
              name="studentId"
              label="Student ID"
              placeholder="e.g. ST-2024-001"
              isRequired={true}
              description="Unique identifier for the student"
            />

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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
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
              name="dateOfBirth"
              label="Date of Birth"
              type="date"
              isRequired={true}
            />

            <EnhancedFormField
              form={form}
              name="class"
              label="Class"
              type="select"
              isRequired={true}
              options={[
                { value: "One", label: "One" },
                { value: "Two", label: "Two" },
                { value: "Three", label: "Three" },
                { value: "Four", label: "Four" },
                { value: "Five", label: "Five" },
                { value: "Six", label: "Six" },
              ]}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <EnhancedFormField
              form={form}
              name="phone"
              label="Phone"
              type="tel"
              description="Optional"
              placeholder="e.g. +1 (555) 123-4567"
            />

            <EnhancedFormField
              form={form}
              name="email"
              label="Email"
              type="email"
              description="Optional"
              placeholder="e.g. student@example.com"
            />
          </div>
        </div>

        {/* Parent Information Section */}
        <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-100 dark:border-gray-800">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">
            Parent Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <EnhancedFormField
              form={form}
              name="fatherName"
              label="Father's Name"
              isRequired={true}
            />

            <EnhancedFormField
              form={form}
              name="fatherPhone"
              label="Father's Phone"
              type="tel"
              isRequired={true}
            />

            <EnhancedFormField
              form={form}
              name="fatherEmail"
              label="Father's Email"
              type="email"
              description="Optional"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <EnhancedFormField
              form={form}
              name="motherName"
              label="Mother's Name"
              isRequired={true}
            />

            <EnhancedFormField
              form={form}
              name="motherPhone"
              label="Mother's Phone"
              type="tel"
              isRequired={true}
            />

            <EnhancedFormField
              form={form}
              name="motherEmail"
              label="Mother's Email"
              type="email"
              description="Optional"
            />
          </div>
        </div>

        {/* Document Upload Section */}
        <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-100 dark:border-gray-800">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">
            Documents
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Student Photo
              </label>
              <div className="flex items-center">
                <label className="cursor-pointer bg-white dark:bg-gray-800 px-4 py-2 rounded-md border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <span>Upload Photo</span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </label>
                {uploadedImage && (
                  <div className="ml-4">
                    <img
                      src={uploadedImage}
                      alt="Student"
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Birth Certificate
              </label>
              <div className="flex items-center">
                <label className="cursor-pointer bg-white dark:bg-gray-800 px-4 py-2 rounded-md border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <span>Upload Certificate</span>
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleCertificateUpload}
                  />
                </label>
                {uploadedCertificate && (
                  <span className="ml-4 text-sm text-gray-600 dark:text-gray-400">
                    File uploaded
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/students")}
            className="border-gray-200 hover:bg-gray-50 text-gray-600"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-blue hover:bg-blue/90 text-white shadow-sm hover:shadow"
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Student"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AddStudentForm;