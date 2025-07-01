import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Classroom, Employee } from '@shared/schema';
import { Save, X, School } from 'lucide-react';
import { EnhancedFormField } from '@/components/ui/enhanced-form-field';

const classroomFormSchema = z.object({
  name: z.string().min(1, "Classroom name is required"),
  section: z.enum(['primary', 'secondary', 'highschool']),
  capacity: z.number().min(1, "Capacity must be at least 1"),
  teacherId: z.string().transform(val => val === "" ? null : parseInt(val)),
});

type ClassroomFormValues = z.infer<typeof classroomFormSchema>;

interface EditClassroomFormProps {
  classroom: Classroom;
  teachers: Employee[];
  onSuccess: () => void;
  onCancel: () => void;
}

const EditClassroomForm = ({ classroom, teachers, onSuccess, onCancel }: EditClassroomFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<ClassroomFormValues>({
    resolver: zodResolver(classroomFormSchema),
    defaultValues: {
      name: classroom.name || '',
      section: classroom.section,
      capacity: classroom.capacity || 30,
      teacherId: classroom.teacherId ? classroom.teacherId.toString() : '',
    },
  });

  useEffect(() => {
    form.reset({
      name: classroom.name,
      section: classroom.section,
      capacity: classroom.capacity,
      teacherId: classroom.teacherId ? classroom.teacherId.toString() : '',
    });
  }, [classroom, form]);

  const onSubmit = async (data: ClassroomFormValues) => {
    setIsSubmitting(true);
    try {
      await apiRequest('PATCH', `/api/classrooms/${classroom.id}`, data);
      await queryClient.invalidateQueries({ queryKey: ['/api/classrooms'] });
      toast({
        title: 'Success',
        description: 'Classroom updated successfully',
      });
      onSuccess();
    } catch (error) {
      console.error('Update error:', error);
      toast({
        title: 'Error',
        description: 'Failed to update classroom',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Information Section */}
          <div className="card-modern glass-morphism p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5"></div>
            <div className="relative z-10">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <School className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gradient">Classroom Information</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <EnhancedFormField
                  form={form}
                  name="name"
                  label="Classroom Name"
                  placeholder="Room A-101"
                  isRequired={true}
                  description="Unique identifier for the classroom"
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
                  description="Educational level for this classroom"
                />

                <EnhancedFormField
                  form={form}
                  name="capacity"
                  label="Capacity"
                  type="number"
                  placeholder="30"
                  isRequired={true}
                  description="Maximum number of students"
                />

                <EnhancedFormField
                  form={form}
                  name="teacherId"
                  label="Assigned Teacher"
                  type="select"
                  options={[
                    { value: "", label: "No teacher assigned" },
                    ...teachers.map(teacher => ({
                      value: teacher.id.toString(),
                      label: `${teacher.firstName} ${teacher.lastName}`,
                    })),
                  ]}
                  description="Primary teacher for this classroom"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting}
                className="px-6 py-2 bg-white/10 border-2 border-gray-300 hover:bg-red-50 hover:border-red-300 text-gray-700 font-medium rounded-lg transition-all duration-200"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg border-2 border-blue-600 hover:border-blue-700 transition-all duration-200 shadow-lg"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Update Classroom
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EditClassroomForm;