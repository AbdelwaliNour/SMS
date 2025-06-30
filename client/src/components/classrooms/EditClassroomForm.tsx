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
        <div className="relative p-8 rounded-2xl backdrop-blur-xl bg-gradient-to-br from-white/20 via-white/10 to-transparent dark:from-gray-800/30 dark:via-gray-900/20 dark:to-transparent border border-white/20 dark:border-gray-700/30 shadow-2xl overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.15),transparent)]"></div>
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
          <div className="relative z-10">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-blue-500/20 rounded-xl backdrop-blur-sm">
                <div className="w-5 h-5 bg-gradient-to-br from-blue-400 to-blue-600 rounded-md"></div>
              </div>
              <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">Classroom Details</h3>
            </div>
          
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
                        className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-md border-0 h-12 rounded-xl focus:bg-white/40 dark:focus:bg-gray-800/40 focus:ring-2 focus:ring-blue-500/50 transition-all duration-200 placeholder-gray-500 dark:placeholder-gray-400"
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
                        <SelectTrigger className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-md border-0 h-12 rounded-xl focus:bg-white/40 dark:focus:bg-gray-800/40 focus:ring-2 focus:ring-blue-500/50 transition-all duration-200">
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
        
        <div className="relative p-8 rounded-2xl backdrop-blur-xl bg-gradient-to-br from-white/20 via-white/10 to-transparent dark:from-gray-800/30 dark:via-gray-900/20 dark:to-transparent border border-white/20 dark:border-gray-700/30 shadow-2xl overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_80%,rgba(34,197,94,0.1),transparent)] dark:bg-[radial-gradient(circle_at_30%_80%,rgba(34,197,94,0.15),transparent)]"></div>
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-green-500/50 to-transparent"></div>
          <div className="relative z-10">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-green-500/20 rounded-xl backdrop-blur-sm">
                <div className="w-5 h-5 bg-gradient-to-br from-green-400 to-green-600 rounded-md"></div>
              </div>
              <h3 className="text-lg font-semibold bg-gradient-to-r from-green-600 to-blue-600 dark:from-green-400 dark:to-blue-400 bg-clip-text text-transparent">Capacity & Assignment</h3>
            </div>
            
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
                        className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-md border-0 h-12 rounded-xl focus:bg-white/40 dark:focus:bg-gray-800/40 focus:ring-2 focus:ring-green-500/50 transition-all duration-200 placeholder-gray-500 dark:placeholder-gray-400"
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
                        <SelectTrigger className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-md border-0 h-12 rounded-xl focus:bg-white/40 dark:focus:bg-gray-800/40 focus:ring-2 focus:ring-green-500/50 transition-all duration-200">
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
        
        <div className="flex justify-end space-x-4 pt-6">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            className="bg-white/20 dark:bg-gray-800/20 backdrop-blur-md border-0 hover:bg-white/30 dark:hover:bg-gray-800/30 px-6 py-3 rounded-xl transition-all duration-200 text-gray-700 dark:text-gray-300"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            className="bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 hover:from-blue-600 hover:via-purple-600 hover:to-blue-700 text-white shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300 px-6 py-3 rounded-xl backdrop-blur-md border border-white/20"
          >
            <span className="flex items-center space-x-2">
              <span>Update Classroom</span>
              <div className="w-1 h-1 bg-white/70 rounded-full animate-pulse"></div>
            </span>
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EditClassroomForm;