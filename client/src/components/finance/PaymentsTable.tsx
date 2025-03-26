import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DataTable } from '@/components/ui/data-table';
import { Payment, Student } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { formatCurrency, formatDate } from '@/lib/utils';
import { ColumnDef } from '@tanstack/react-table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import FilterSelect from '@/components/ui/filter-select';

interface PaymentsTableProps {
  onAddPayment: () => void;
}

const paymentFormSchema = z.object({
  studentId: z.number({
    required_error: "Student ID is required",
  }),
  amount: z.number({
    required_error: "Amount is required",
  }).min(1, "Amount must be at least 1"),
  date: z.string({
    required_error: "Date is required",
  }),
  description: z.string().optional(),
  status: z.enum(['paid', 'unpaid', 'partial'], {
    required_error: "Status is required",
  }),
});

type PaymentFormValues = z.infer<typeof paymentFormSchema>;

const PaymentsTable: React.FC<PaymentsTableProps> = ({ onAddPayment }) => {
  const { toast } = useToast();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    date: '',
  });

  const { data: payments, isLoading, error, refetch } = useQuery<Payment[]>({
    queryKey: ['/api/payments'],
  });

  const { data: students } = useQuery<Student[]>({
    queryKey: ['/api/students'],
  });

  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      studentId: undefined,
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      description: '',
      status: 'paid',
    },
  });

  const handleUpdatePayment = async (id: number, status: 'paid' | 'unpaid' | 'partial') => {
    try {
      await apiRequest('PATCH', `/api/payments/${id}`, { status });
      toast({
        title: 'Success',
        description: 'Payment status updated successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/payments'] });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update payment status',
        variant: 'destructive',
      });
    }
  };

  const getStudentName = (studentId: number) => {
    const student = students?.find(s => s.id === studentId);
    return student ? `${student.firstName} ${student.lastName}` : `Student #${studentId}`;
  };

  const onSubmit = async (data: PaymentFormValues) => {
    try {
      await apiRequest('POST', '/api/payments', data);
      toast({
        title: 'Success',
        description: 'Payment added successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/payments'] });
      setIsAddModalOpen(false);
      form.reset();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add payment',
        variant: 'destructive',
      });
    }
  };

  const columns: ColumnDef<Payment>[] = [
    {
      accessorKey: 'id',
      header: 'Roll No',
      cell: ({ row }) => String(row.index + 1).padStart(2, '0'),
    },
    {
      accessorKey: 'studentId',
      header: 'Student ID',
      cell: ({ row }) => {
        const student = students?.find(s => s.id === row.original.studentId);
        return student?.studentId || `#${row.original.studentId}`;
      },
    },
    {
      accessorKey: 'studentName',
      header: 'Student Name',
      cell: ({ row }) => getStudentName(row.original.studentId),
    },
    {
      accessorKey: 'amount',
      header: 'Amount',
      cell: ({ row }) => formatCurrency(row.original.amount),
    },
    {
      accessorKey: 'date',
      header: 'Date',
      cell: ({ row }) => formatDate(row.original.date),
    },
    {
      accessorKey: 'description',
      header: 'Description',
      cell: ({ row }) => row.original.description || 'N/A',
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.original.status;
        const bgColor = status === 'paid' ? 'bg-green' : status === 'partial' ? 'bg-yellow' : 'bg-red';
        return (
          <span className={`${bgColor} text-white px-2 py-1 rounded-full text-xs`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        );
      },
    },
    {
      id: 'actions',
      header: 'Status',
      cell: ({ row }) => {
        return (
          <div className="flex space-x-1">
            <Button
              variant="outline"
              size="sm"
              className="bg-green hover:bg-green/90 text-white border-none w-6 h-6 p-0"
              onClick={() => handleUpdatePayment(row.original.id, 'paid')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-yellow hover:bg-yellow/90 text-white border-none w-6 h-6 p-0"
              onClick={() => handleUpdatePayment(row.original.id, 'partial')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-red hover:bg-red/90 text-white border-none w-6 h-6 p-0"
              onClick={() => handleUpdatePayment(row.original.id, 'unpaid')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow mb-6">
      <div className="p-4 flex items-center justify-between border-b border-divider dark:border-gray-700">
        <div className="flex items-center">
          <h2 className="text-lg font-homenaje text-gray-800 dark:text-gray-200 mr-4">View Payments</h2>
          <span className="text-sm text-gray-500 dark:text-gray-400">Filter BY</span>
        </div>
        <div className="flex space-x-2">
          <FilterSelect
            label="Status"
            options={[
              { value: '', label: 'All' },
              { value: 'paid', label: 'Paid' },
              { value: 'unpaid', label: 'Unpaid' },
              { value: 'partial', label: 'Partial' },
            ]}
            value={filters.status}
            onChange={(value) => setFilters({ ...filters, status: value })}
            placeholder="Status"
          />
          <FilterSelect
            label="Date"
            options={[
              { value: '', label: 'All' },
              { value: 'today', label: 'Today' },
              { value: 'week', label: 'This Week' },
              { value: 'month', label: 'This Month' },
            ]}
            value={filters.date}
            onChange={(value) => setFilters({ ...filters, date: value })}
            placeholder="Date"
          />
        </div>

        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button 
              className="bg-blue hover:bg-blue/90 text-white"
              onClick={() => setIsAddModalOpen(true)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Payment
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Payment</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="studentId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Student</FormLabel>
                      <Select onValueChange={(value) => field.onChange(parseInt(value))} defaultValue={field.value?.toString()}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a student" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {students?.map((student) => (
                            <SelectItem key={student.id} value={student.id.toString()}>
                              {student.firstName} {student.lastName} ({student.studentId})
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
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="Amount" 
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input placeholder="Description" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="paid">Paid</SelectItem>
                          <SelectItem value="unpaid">Unpaid</SelectItem>
                          <SelectItem value="partial">Partial</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end space-x-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-blue hover:bg-blue/90 text-white">
                    Add Payment
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      
      {isLoading ? (
        <div className="p-8 text-center">Loading payments...</div>
      ) : error ? (
        <div className="p-8 text-center text-red">Error loading payments. Please try again.</div>
      ) : (
        <DataTable
          columns={columns}
          data={payments || []}
        />
      )}
    </div>
  );
};

export default PaymentsTable;
