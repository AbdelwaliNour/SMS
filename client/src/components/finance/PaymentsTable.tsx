import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Payment, Student } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatCurrency, formatDate } from '@/lib/utils';
import { AddPaymentDialog } from './AddPaymentDialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProfileAvatar } from '@/components/ui/profile-avatar';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
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
  MoreHorizontal,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface PaymentsTableProps {
  onAddPayment?: () => void;
}

const PaymentsTable: React.FC<PaymentsTableProps> = ({ onAddPayment }) => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const { data: payments, isLoading, error, refetch } = useQuery<Payment[]>({
    queryKey: ['/api/payments'],
  });

  const { data: students } = useQuery<Student[]>({
    queryKey: ['/api/students'],
  });

  const handleUpdatePayment = async (id: number, status: string) => {
    try {
      await apiRequest('PATCH', `/api/payments/${id}`, { status });
      toast({
        title: 'Success',
        description: 'Payment status updated successfully.',
      });
      refetch();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update payment status.',
        variant: 'destructive',
      });
    }
  };

  const getStudentInfo = (studentId: number) => {
    return students?.find(student => student.id === studentId);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      paid: { 
        label: 'Paid', 
        className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
        icon: CheckCircle 
      },
      unpaid: { 
        label: 'Unpaid', 
        className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
        icon: XCircle 
      },
      partial: { 
        label: 'Partial', 
        className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
        icon: Clock 
      },
      overdue: { 
        label: 'Overdue', 
        className: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
        icon: AlertTriangle 
      },
      refunded: { 
        label: 'Refunded', 
        className: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
        icon: RefreshCw 
      },
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    if (!config) return null;

    const Icon = config.icon;
    return (
      <Badge className={`${config.className} font-medium`}>
        <Icon className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const getPaymentTypeBadge = (type: string) => {
    const typeConfig = {
      tuition: { label: 'Tuition', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' },
      fees: { label: 'Fees', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' },
      book: { label: 'Books', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' },
      uniform: { label: 'Uniform', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300' },
      transport: { label: 'Transport', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' },
      meal: { label: 'Meal', color: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300' },
      exam: { label: 'Exam', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' },
      library: { label: 'Library', color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300' },
      activity: { label: 'Activity', color: 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300' },
      other: { label: 'Other', color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300' },
    };

    const config = typeConfig[type as keyof typeof typeConfig];
    if (!config) return null;

    return (
      <Badge variant="outline" className={`${config.color} text-xs`}>
        {config.label}
      </Badge>
    );
  };

  // Filter payments based on search and status
  const filteredPayments = payments?.filter(payment => {
    const student = getStudentInfo(payment.studentId);
    const studentName = student ? `${student.firstName} ${student.lastName}` : '';
    const studentId = student?.studentId || '';
    
    const matchesSearch = searchQuery === '' || 
      studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.amount.toString().includes(searchQuery);
    
    const matchesStatus = statusFilter === '' || statusFilter === 'all' || payment.status === statusFilter;
    const matchesType = typeFilter === '' || typeFilter === 'all' || payment.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  }) || [];

  if (error) {
    return (
      <Card className="glass-morphism border-border/30">
        <CardContent className="p-12 text-center">
          <div className="p-4 bg-red-500/10 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
            <AlertTriangle className="h-10 w-10 text-red-500" />
          </div>
          <h3 className="text-lg font-semibold mb-2 text-red-600">Error Loading Payments</h3>
          <p className="text-muted-foreground mb-4">
            There was an error loading payment records. Please try again.
          </p>
          <Button onClick={() => refetch()} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-morphism border-border/30">
      <CardHeader className="space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-1">
            <CardTitle className="text-xl font-semibold text-primary flex items-center">
              <DollarSign className="h-5 w-5 mr-2" />
              Payment Records
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Manage and track all student payment records
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <AddPaymentDialog 
              trigger={
                <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Payment
                </Button>
              }
            />
          </div>
        </div>
        
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
          <Select value={statusFilter || "all"} onValueChange={(value) => setStatusFilter(value === "all" ? "" : value)}>
            <SelectTrigger className="w-48 glass-morphism border-border/30">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="unpaid">Unpaid</SelectItem>
              <SelectItem value="partial">Partial</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
              <SelectItem value="refunded">Refunded</SelectItem>
            </SelectContent>
          </Select>

          {/* Type Filter */}
          <Select value={typeFilter || "all"} onValueChange={(value) => setTypeFilter(value === "all" ? "" : value)}>
            <SelectTrigger className="w-48 glass-morphism border-border/30">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="tuition">Tuition</SelectItem>
              <SelectItem value="fees">Fees</SelectItem>
              <SelectItem value="book">Books</SelectItem>
              <SelectItem value="uniform">Uniform</SelectItem>
              <SelectItem value="transport">Transport</SelectItem>
              <SelectItem value="meal">Meal</SelectItem>
              <SelectItem value="exam">Exam</SelectItem>
              <SelectItem value="library">Library</SelectItem>
              <SelectItem value="activity">Activity</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
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
                {searchQuery || statusFilter || typeFilter ? 'No payments match your search criteria.' : 'No payments have been recorded yet.'}
              </p>
              <AddPaymentDialog 
                trigger={
                  <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Payment
                  </Button>
                }
              />
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPayments.map((payment) => {
              const student = getStudentInfo(payment.studentId);
              return (
                <Card key={payment.id} className="glass-morphism border-border/30 hover:border-primary/30 transition-all duration-300 group">
                  <CardContent className="p-6">
                    {/* Student Info */}
                    <div className="flex items-center space-x-3 mb-4">
                      <ProfileAvatar
                        src={student?.profilePhoto || undefined}
                        name={student ? `${student.firstName} ${student.lastName}` : 'Unknown Student'}
                        size="sm"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-foreground truncate">
                          {student ? `${student.firstName} ${student.lastName}` : 'Unknown Student'}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {student?.studentId || `#${payment.studentId}`}
                        </p>
                      </div>
                    </div>

                    {/* Payment Amount */}
                    <div className="mb-4">
                      <div className="text-2xl font-bold text-primary mb-1">
                        {formatCurrency(payment.amount)}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {payment.description || 'No description'}
                      </p>
                    </div>

                    {/* Payment Info */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Type:</span>
                        {getPaymentTypeBadge(payment.type || 'other')}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Status:</span>
                        {getStatusBadge(payment.status)}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Date:</span>
                        <span className="text-sm font-medium">
                          {formatDate(payment.date)}
                        </span>
                      </div>

                      {payment.method && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Method:</span>
                          <span className="text-sm font-medium capitalize">
                            {payment.method.replace('_', ' ')}
                          </span>
                        </div>
                      )}

                      {payment.receiptNumber && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Receipt:</span>
                          <span className="text-sm font-medium">
                            {payment.receiptNumber}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-border/30">
                      <div className="flex items-center space-x-1">
                        {payment.status !== 'paid' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUpdatePayment(payment.id, 'paid')}
                            className="h-8 text-xs border-green-200 text-green-700 hover:bg-green-50 dark:border-green-800 dark:text-green-300 dark:hover:bg-green-900/20"
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Mark Paid
                          </Button>
                        )}
                      </div>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
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
      </CardContent>
    </Card>
  );
};

export default PaymentsTable;