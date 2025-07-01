import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Payment, Student } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProfileAvatar } from '@/components/ui/profile-avatar';
import { 
  Search, 
  Filter, 
  Plus, 
  CheckCircle, 
  Clock, 
  XCircle, 
  Edit, 
  Eye, 
  Download, 
  Calendar,
  DollarSign,
  User,
  FileText,
  MoreHorizontal
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

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

  const getStudent = (studentId: number) => {
    return students?.find(s => s.id === studentId);
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

  // Filter payments based on search and filters
  const filteredPayments = payments?.filter((payment) => {
    const student = getStudent(payment.studentId);
    const studentName = student ? `${student.firstName} ${student.lastName}` : '';
    const studentId = student?.studentId || '';
    
    const matchesSearch = !searchQuery || 
      studentName.toLowerCase().includes(searchQuery.toLowerCase()) || 
      studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      formatCurrency(payment.amount).includes(searchQuery);
    
    const matchesStatus = !statusFilter || payment.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  }) || [];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'partial':
        return <Clock className="h-4 w-4 text-amber-600" />;
      case 'unpaid':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-500/10 text-green-600 border-green-500/20">Paid</Badge>;
      case 'partial':
        return <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20">Partial</Badge>;
      case 'unpaid':
        return <Badge className="bg-red-500/10 text-red-600 border-red-500/20">Unpaid</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Modern Header with Search and Filters */}
      <Card className="glass-morphism border-border/30">
        <CardHeader className="pb-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <CardTitle className="text-xl font-semibold text-primary flex items-center">
                <DollarSign className="h-5 w-5 mr-2" />
                Payment Records
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Track and manage all student payments
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button variant="outline" className="glass-morphism border-border/30 hover:border-primary/30">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Payment
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Add New Payment</DialogTitle>
                    <DialogDescription>
                      Enter payment details to add a new payment record.
                    </DialogDescription>
                  </DialogHeader>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="studentId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Student</FormLabel>
                            <Select onValueChange={(value) => field.onChange(parseInt(value))}>
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
                                placeholder="Enter amount" 
                                {...field}
                                onChange={(e) => field.onChange(parseFloat(e.target.value))}
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
                              <Input 
                                type="date" 
                                {...field}
                              />
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
                            <FormLabel>Description (Optional)</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Enter description" 
                                {...field}
                              />
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
                                <SelectItem value="partial">Partial</SelectItem>
                                <SelectItem value="unpaid">Unpaid</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex justify-end space-x-2">
                        <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                          Add Payment
                        </Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Bar */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by student name, ID, or amount..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 glass-morphism border-border/30 focus:border-primary/50"
              />
            </div>
            
            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48 glass-morphism border-border/30">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Statuses</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="partial">Partial</SelectItem>
                <SelectItem value="unpaid">Unpaid</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Payment Records */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, index) => (
            <Card key={index} className="glass-morphism border-border/30 animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded mb-4"></div>
                <div className="h-8 bg-muted rounded mb-2"></div>
                <div className="h-4 bg-muted rounded mb-4"></div>
                <div className="flex justify-between">
                  <div className="h-6 bg-muted rounded w-16"></div>
                  <div className="h-6 bg-muted rounded w-20"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredPayments.length === 0 ? (
        <Card className="glass-morphism border-border/30">
          <CardContent className="p-12 text-center">
            <div className="p-4 bg-muted/10 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
              <DollarSign className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No Payment Records</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery || statusFilter ? 'No payments match your search criteria.' : 'No payments have been recorded yet.'}
            </p>
            <Button 
              onClick={() => setIsAddModalOpen(true)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add First Payment
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPayments.map((payment, index) => {
            const student = getStudent(payment.studentId);
            return (
              <Card key={payment.id} className="glass-morphism border-border/30 hover:border-primary/30 transition-all duration-300 group">
                <CardContent className="p-6">
                  {/* Student Info Header */}
                  <div className="flex items-center space-x-3 mb-4">
                    <ProfileAvatar
                      src={student?.profilePhoto || undefined}
                      name={student ? `${student.firstName} ${student.lastName}` : 'Unknown Student'}
                      size="md"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm text-foreground">
                        {student ? `${student.firstName} ${student.lastName}` : 'Unknown Student'}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {student?.studentId || `#${payment.studentId}`}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground">#{String(index + 1).padStart(3, '0')}</div>
                    </div>
                  </div>

                  {/* Amount and Status */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-2xl font-bold text-foreground">
                        {formatCurrency(payment.amount)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatDate(payment.date)}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(payment.status)}
                      {getStatusBadge(payment.status)}
                    </div>
                  </div>

                  {/* Description */}
                  {payment.description && (
                    <div className="mb-4 p-3 bg-muted/20 rounded-lg">
                      <div className="flex items-center text-xs text-muted-foreground mb-1">
                        <FileText className="h-3 w-3 mr-1" />
                        Description
                      </div>
                      <p className="text-sm text-foreground">{payment.description}</p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-1">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0 bg-green-500/10 hover:bg-green-500/20 border-green-500/20 hover:border-green-500/30"
                        onClick={() => handleUpdatePayment(payment.id, 'paid')}
                        title="Mark as Paid"
                      >
                        <CheckCircle className="h-3 w-3 text-green-600" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0 bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/20 hover:border-amber-500/30"
                        onClick={() => handleUpdatePayment(payment.id, 'partial')}
                        title="Mark as Partial"
                      >
                        <Clock className="h-3 w-3 text-amber-600" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0 bg-red-500/10 hover:bg-red-500/20 border-red-500/20 hover:border-red-500/30"
                        onClick={() => handleUpdatePayment(payment.id, 'unpaid')}
                        title="Mark as Unpaid"
                      >
                        <XCircle className="h-3 w-3 text-red-600" />
                      </Button>
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Payment
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="h-4 w-4 mr-2" />
                          Download Receipt
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PaymentsTable;