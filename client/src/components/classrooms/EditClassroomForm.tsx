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
import { Classroom, Employee } from '@shared/schema';

const classroomFormSchema = z.object({
  name: z.string().min(1, "Classroom name is required"),
  section: z.enum(['primary', 'secondary', 'highschool']),
  capacity: z.number().min(1, "Capacity must be at least 1"),
  teacherId: z.union([z.number(), z.null()]).nullable(),
});

type ClassroomFormValues = z.infer<typeof classroomFormSchema>;

interface EditClassroomFormProps {
  classroom: Classroom;
  teachers: Employee[];
  onSuccess: () => void;
  onCancel: () => void;
}

const EditClassroomForm = ({ classroom, teachers, onSuccess, onCancel }: EditClassroomFormProps) => {
  const { toast } = useToast();

  const form = useForm<ClassroomFormValues>({
    resolver: zodResolver(classroomFormSchema),
    defaultValues: {
      name: classroom.name || '',
      section: classroom.section,
      capacity: classroom.capacity,
      teacherId: classroom.teacherId || null,
    },
  });

  useEffect(() => {
    form.reset({
      name: classroom.name,
      section: classroom.section,
      capacity: classroom.capacity,
      teacherId: classroom.teacherId,
    });
  }, [classroom, form]);

  const onSubmit = async (data: ClassroomFormValues) => {
    try {
      await apiRequest('PATCH', `/api/classrooms/${classroom.id}`, data);
      toast({
        title: 'Success',
        description: 'Classroom updated successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/classrooms'] });
      onSuccess();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update classroom',
        variant: 'destructive',
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="card-modern glass-morphism p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5"></div>
          <div className="relative z-10">
            <h3 className="text-sm font-medium text-gradient mb-4">Classroom Details</h3>
          
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Room Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g. Room 101, Science Lab A" 
                        {...field} 
                        className="glass-morphism border-0 h-11"
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
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
                        <SelectTrigger className="glass-morphism border-0 h-11">
                          <SelectValue placeholder="Select section" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="primary">Primary</SelectItem>
                        <SelectItem value="secondary">Secondary</SelectItem>
                        <SelectItem value="highschool">High School</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
        
        <div className="card-modern glass-morphism p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-blue-500/5"></div>
          <div className="relative z-10">
            <h3 className="text-sm font-medium text-gradient mb-4">Capacity & Assignment</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="capacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Capacity</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Student capacity" 
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        value={field.value}
                        className="glass-morphism border-0 h-11"
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="teacherId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Assign Teacher</FormLabel>
                    <Select 
                      onValueChange={(value) => field.onChange(value === '' ? null : parseInt(value))} 
                      defaultValue={field.value?.toString() || ''}
                    >
                      <FormControl>
                        <SelectTrigger className="glass-morphism border-0 h-11">
                          <SelectValue placeholder="Select a teacher" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="">Not Assigned</SelectItem>
                        {teachers.map((teacher) => (
                          <SelectItem key={teacher.id} value={teacher.id.toString()}>
                            {teacher.firstName} {teacher.lastName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3 pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            className="border-0 hover:bg-muted/50"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            Update Classroom
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EditClassroomForm;