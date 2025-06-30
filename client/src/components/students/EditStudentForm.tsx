import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { insertStudentSchema, Student } from '@shared/schema';
import { useLocation } from 'wouter';
import { EnhancedFormField } from '@/components/ui/enhanced-form-field';
import { ValidationMessages, ValidationPatterns } from '@/lib/form-validation';
import { User, Phone, Mail, Heart, FileImage, Award, Save, Loader2, UserCheck } from 'lucide-react';

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
    .nullable()
    .optional(),

  email: z
    .string()
    .email("Please enter a valid email address")
    .nullable()
    .optional(),

  fatherName: z
    .string()
    .min(1, ValidationMessages.required)
    .min(2, ValidationMessages.min(2))
    .max(100, ValidationMessages.max(100)),

  fatherPhone: z
    .string()
    .min(1, ValidationMessages.required)
    .min(10, ValidationMessages.min(10))
    .max(15, ValidationMessages.max(15))
    .regex(ValidationPatterns.phone, "Please enter a valid phone number"),

  fatherEmail: z
    .string()
    .email("Please enter a valid email address")
    .nullable()
    .optional(),

  motherName: z
    .string()
    .min(1, ValidationMessages.required)
    .min(2, ValidationMessages.min(2))
    .max(100, ValidationMessages.max(100)),

  motherPhone: z
    .string()
    .min(1, ValidationMessages.required)
    .min(10, ValidationMessages.min(10))
    .max(15, ValidationMessages.max(15))
    .regex(ValidationPatterns.phone, "Please enter a valid phone number"),

  motherEmail: z
    .string()
    .email("Please enter a valid email address")
    .nullable()
    .optional(),
});

type StudentFormValues = z.infer<typeof studentFormSchema>;

interface EditStudentFormProps {
  student: Student;
}

const EditStudentForm: React.FC<EditStudentFormProps> = ({ student }) => {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [loading, setLoading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedCertificate, setUploadedCertificate] = useState<string | null>(null);

  const form = useForm<StudentFormValues>({
    resolver: zodResolver(studentFormSchema),
    defaultValues: {
      studentId: '',
      firstName: '',
      middleName: null,
      lastName: '',
      gender: 'male',
      dateOfBirth: '',
      section: 'primary',
      class: 'One',
      phone: null,
      email: null,
      fatherName: '',
      fatherPhone: '',
      fatherEmail: null,
      motherName: '',
      motherPhone: '',
      motherEmail: null,
    },
  });

  // Populate form with student data when component mounts
  useEffect(() => {
    if (student) {
      form.reset({
        studentId: student.studentId || '',
        firstName: student.firstName || '',
        middleName: student.middleName || null,
        lastName: student.lastName || '',
        gender: student.gender || 'male',
        dateOfBirth: student.dateOfBirth || '',
        section: student.section || 'primary',
        class: student.class || 'One',
        phone: student.phone || null,
        email: student.email || null,
        fatherName: student.fatherName || '',
        fatherPhone: student.fatherPhone || '',
        fatherEmail: student.fatherEmail || null,
        motherName: student.motherName || '',
        motherPhone: student.motherPhone || '',
        motherEmail: student.motherEmail || null,
      });
    }
  }, [student, form]);

  const onSubmit = async (data: StudentFormValues) => {
    setLoading(true);
    try {
      await apiRequest('PATCH', `/api/students/${student.id}`, data);
      toast({
        title: 'Success',
        description: 'Student updated successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/students'] });
      queryClient.invalidateQueries({ queryKey: ['/api/students', student.id] });
      navigate('/students');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update student',
        variant: 'destructive',
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Information Section */}
        <div className="card-modern glass-morphism p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5"></div>
          <div className="relative z-10">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <User className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gradient">Basic Information</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <EnhancedFormField
                form={form}
                name="firstName"
                label="First Name"
                isRequired={true}
                placeholder="Enter first name"
              />

              <EnhancedFormField
                form={form}
                name="middleName"
                label="Middle Name"
                description="Optional"
                placeholder="Enter middle name"
              />

              <EnhancedFormField
                form={form}
                name="lastName"
                label="Last Name"
                isRequired={true}
                placeholder="Enter last name"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                  { value: "Seven", label: "Seven" },
                  { value: "Eight", label: "Eight" },
                  { value: "Nine", label: "Nine" },
                  { value: "Ten", label: "Ten" },
                  { value: "Eleven", label: "Eleven" },
                  { value: "Twelve", label: "Twelve" },
                ]}
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <EnhancedFormField
                form={form}
                name="phone"
                label="Phone Number"
                placeholder="e.g. +1 234 567 8901"
                description="Optional - Student's phone number"
              />

              <EnhancedFormField
                form={form}
                name="email"
                label="Email Address"
                type="email"
                placeholder="student@example.com"
                description="Optional - Student's email address"
              />
            </div>
          </div>
        </div>

        {/* Parent Information Section */}
        <div className="card-modern glass-morphism p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-red-500/5"></div>
          <div className="relative z-10">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-orange-500/10 rounded-lg">
                <Heart className="h-5 w-5 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gradient">Parent Information</h3>
            </div>

            {/* Father's Information */}
            <div className="space-y-6 mb-8">
              <h4 className="text-lg font-medium text-muted-foreground border-b border-border/30 pb-2">
                Father's Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <EnhancedFormField
                  form={form}
                  name="fatherName"
                  label="Father's Name"
                  isRequired={true}
                  placeholder="Enter father's full name"
                />

                <EnhancedFormField
                  form={form}
                  name="fatherPhone"
                  label="Father's Phone"
                  isRequired={true}
                  placeholder="e.g. +1 234 567 8901"
                />

                <EnhancedFormField
                  form={form}
                  name="fatherEmail"
                  label="Father's Email"
                  type="email"
                  placeholder="father@example.com"
                  description="Optional"
                />
              </div>
            </div>

            {/* Mother's Information */}
            <div className="space-y-6">
              <h4 className="text-lg font-medium text-muted-foreground border-b border-border/30 pb-2">
                Mother's Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <EnhancedFormField
                  form={form}
                  name="motherName"
                  label="Mother's Name"
                  isRequired={true}
                  placeholder="Enter mother's full name"
                />

                <EnhancedFormField
                  form={form}
                  name="motherPhone"
                  label="Mother's Phone"
                  isRequired={true}
                  placeholder="e.g. +1 234 567 8901"
                />

                <EnhancedFormField
                  form={form}
                  name="motherEmail"
                  label="Mother's Email"
                  type="email"
                  placeholder="mother@example.com"
                  description="Optional"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Document Upload Section */}
        <div className="card-modern glass-morphism p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5"></div>
          <div className="relative z-10">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <FileImage className="h-5 w-5 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gradient">Documents & Photo</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Profile Photo Upload */}
              <div className="space-y-4">
                <label className="block text-sm font-medium mb-2">Profile Photo</label>
                <div className="border-2 border-dashed border-border/30 rounded-xl p-6 text-center hover:border-primary/30 transition-colors">
                  {uploadedImage ? (
                    <div className="space-y-4">
                      <img
                        src={uploadedImage}
                        alt="Uploaded profile"
                        className="mx-auto h-24 w-24 object-cover rounded-full"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setUploadedImage(null)}
                      >
                        Remove Photo
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <User className="mx-auto h-12 w-12 text-muted-foreground" />
                      <div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="profile-upload"
                        />
                        <label
                          htmlFor="profile-upload"
                          className="cursor-pointer text-primary hover:text-primary/80"
                        >
                          Click to upload profile photo
                        </label>
                        <p className="text-xs text-muted-foreground mt-2">
                          PNG, JPG up to 10MB
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Certificate Upload */}
              <div className="space-y-4">
                <label className="block text-sm font-medium mb-2">Birth Certificate</label>
                <div className="border-2 border-dashed border-border/30 rounded-xl p-6 text-center hover:border-primary/30 transition-colors">
                  {uploadedCertificate ? (
                    <div className="space-y-4">
                      <Award className="mx-auto h-12 w-12 text-green-600" />
                      <p className="text-sm text-green-600">Certificate uploaded</p>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setUploadedCertificate(null)}
                      >
                        Remove Certificate
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Award className="mx-auto h-12 w-12 text-muted-foreground" />
                      <div>
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={handleCertificateUpload}
                          className="hidden"
                          id="certificate-upload"
                        />
                        <label
                          htmlFor="certificate-upload"
                          className="cursor-pointer text-primary hover:text-primary/80"
                        >
                          Click to upload birth certificate
                        </label>
                        <p className="text-xs text-muted-foreground mt-2">
                          PDF, PNG, JPG up to 10MB
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4 pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/students')}
            className="glass-morphism border-border/30 hover:border-red-500/30 hover:text-red-600"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white px-8"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Updating Student...
              </>
            ) : (
              <>
                <UserCheck className="h-4 w-4 mr-2" />
                Update Student
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EditStudentForm;