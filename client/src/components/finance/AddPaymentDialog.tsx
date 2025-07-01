import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import {
  Plus,
  DollarSign,
  Calendar,
  User,
  CreditCard,
  FileText,
  Clock,
  Receipt,
  BookOpen,
  Calculator,
} from "lucide-react";
import type { Student, InsertPayment } from "@shared/schema";

// Enhanced payment form schema
const paymentFormSchema = z.object({
  studentId: z.number().min(1, "Please select a student"),
  amount: z.number().min(0.01, "Amount must be greater than 0"),
  description: z.string().min(1, "Description is required"),
  status: z.enum(["paid", "unpaid", "partial", "overdue", "refunded"]),
  type: z.enum(["tuition", "fees", "book", "uniform", "transport", "meal", "exam", "library", "activity", "other"]),
  method: z.enum(["cash", "card", "bank_transfer", "check", "mobile_payment", "online"]).optional(),
  receiptNumber: z.string().optional(),
  notes: z.string().optional(),
  term: z.string().optional(),
  academicYear: z.string().optional(),
  installmentNumber: z.number().optional(),
  totalInstallments: z.number().optional(),
  dueDate: z.string().optional(),
});

type PaymentFormData = z.infer<typeof paymentFormSchema>;

const paymentTypes = [
  { value: "tuition", label: "Tuition Fee", icon: BookOpen, color: "bg-blue-500" },
  { value: "fees", label: "School Fees", icon: DollarSign, color: "bg-green-500" },
  { value: "book", label: "Books & Materials", icon: BookOpen, color: "bg-purple-500" },
  { value: "uniform", label: "Uniform", icon: User, color: "bg-orange-500" },
  { value: "transport", label: "Transportation", icon: Calendar, color: "bg-yellow-500" },
  { value: "meal", label: "Meal Plan", icon: Clock, color: "bg-pink-500" },
  { value: "exam", label: "Examination Fee", icon: FileText, color: "bg-red-500" },
  { value: "library", label: "Library Fee", icon: BookOpen, color: "bg-indigo-500" },
  { value: "activity", label: "Activities", icon: Calendar, color: "bg-teal-500" },
  { value: "other", label: "Other", icon: Calculator, color: "bg-gray-500" },
];

const paymentMethods = [
  { value: "cash", label: "Cash", icon: DollarSign },
  { value: "card", label: "Credit/Debit Card", icon: CreditCard },
  { value: "bank_transfer", label: "Bank Transfer", icon: Calculator },
  { value: "check", label: "Check", icon: Receipt },
  { value: "mobile_payment", label: "Mobile Payment", icon: Calendar },
  { value: "online", label: "Online Payment", icon: Clock },
];

const paymentStatuses = [
  { value: "paid", label: "Paid", color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" },
  { value: "unpaid", label: "Unpaid", color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300" },
  { value: "partial", label: "Partial", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300" },
  { value: "overdue", label: "Overdue", color: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300" },
  { value: "refunded", label: "Refunded", color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300" },
];

const currentYear = new Date().getFullYear();
const academicYears = [
  `${currentYear - 1}-${currentYear}`,
  `${currentYear}-${currentYear + 1}`,
  `${currentYear + 1}-${currentYear + 2}`,
];

const terms = ["First Term", "Second Term"];

interface AddPaymentDialogProps {
  trigger?: React.ReactNode;
  onPaymentAdded?: () => void;
}

export function AddPaymentDialog({ trigger, onPaymentAdded }: AddPaymentDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<PaymentFormData>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      amount: 0,
      description: "",
      status: "unpaid",
      type: "tuition",
      academicYear: `${currentYear}-${currentYear + 1}`,
      term: "Fall",
    },
  });

  const { data: students = [] } = useQuery<Student[]>({
    queryKey: ["/api/students"],
  });

  const addPaymentMutation = useMutation({
    mutationFn: async (data: PaymentFormData) => {
      const paymentData: Partial<InsertPayment> = {
        ...data,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
      };
      
      const response = await apiRequest("POST", "/api/payments", paymentData);
      if (!response.ok) {
        throw new Error("Failed to add payment");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/payments"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({
        title: "Payment Added",
        description: "Payment record has been created successfully.",
      });
      form.reset();
      setIsOpen(false);
      onPaymentAdded?.();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add payment. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: PaymentFormData) => {
    addPaymentMutation.mutate(data);
  };

  const selectedPaymentType = paymentTypes.find(
    (type) => type.value === form.watch("type")
  );

  const selectedStatus = paymentStatuses.find(
    (status) => status.value === form.watch("status")
  );

  const defaultTrigger = (
    <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700">
      <Plus className="h-4 w-4 mr-2" />
      Add Payment
    </Button>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[90vh] flex flex-col glass-morphism border-border/30 bg-gradient-to-br from-emerald-50/80 via-white to-blue-50/80 dark:from-emerald-950/20 dark:via-background dark:to-blue-950/20">
        <DialogHeader className="pb-6 border-b border-emerald-200/50 dark:border-emerald-800/50 flex-shrink-0 bg-gradient-to-r from-emerald-100/50 to-teal-100/50 dark:from-emerald-900/30 dark:to-teal-900/30 -m-6 mb-0 p-6 rounded-t-lg">
          <DialogTitle className="text-2xl font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent flex items-center">
            <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg mr-3">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            Add New Payment
          </DialogTitle>
          <DialogDescription className="text-emerald-700 dark:text-emerald-300">
            Create a new payment record with comprehensive details and tracking information.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-6 min-h-0">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Payment Overview Card */}
              <Card className="glass-morphism">
                <CardContent className="space-y-6">
                  {/* Payment Overview */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-medium flex items-center text-emerald-700 dark:text-emerald-300 p-4">
                      <div className="p-1.5 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg mr-2">
                        <Receipt className="h-5 w-5 text-white" />
                      </div>
                      Payment Overview
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Student Selection */}
                      <FormField
                        control={form.control}
                        name="studentId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-medium flex items-center text-blue-700 dark:text-blue-300">
                              <div className="p-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded mr-2">
                                <User className="h-4 w-4 text-white" />
                              </div>
                              Student
                            </FormLabel>
                            <Select
                              value={field.value?.toString()}
                              onValueChange={(value) => field.onChange(parseInt(value))}
                            >
                              <FormControl>
                                <SelectTrigger className="h-12">
                                  <SelectValue placeholder="Select a student" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {students.map((student) => (
                                  <SelectItem key={student.id} value={student.id.toString()}>
                                    <div className="flex items-center space-x-3">
                                      <div>
                                        <div className="font-medium">
                                          {student.firstName} {student.lastName}
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                          {student.studentId} • Class {student.class}
                                        </div>
                                      </div>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Amount */}
                      <FormField
                        control={form.control}
                        name="amount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-medium flex items-center text-green-700 dark:text-green-300">
                              <div className="p-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded mr-2">
                                <DollarSign className="h-4 w-4 text-white" />
                              </div>
                              Amount ($)
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.01"
                                min="0"
                                placeholder="0.00"
                                className="h-12 text-lg"
                                {...field}
                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Payment Type Selection */}
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-medium text-purple-700 dark:text-purple-300">Payment Type</FormLabel>
                        <FormControl>
                          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                            {paymentTypes.map((type) => {
                              const Icon = type.icon;
                              const isSelected = field.value === type.value;
                              return (
                                <div
                                  key={type.value}
                                  className={`cursor-pointer p-4 rounded-lg border-2 transition-all hover:border-primary/50 ${
                                    isSelected
                                      ? "border-primary bg-primary/10"
                                      : "border-border/30 hover:bg-muted/30"
                                  }`}
                                  onClick={() => field.onChange(type.value)}
                                >
                                  <div className="flex flex-col items-center space-y-2">
                                    <div className={`p-2 rounded-lg ${type.color}/20`}>
                                      <Icon className={`h-5 w-5 text-${type.color.split('-')[1]}-600`} />
                                    </div>
                                    <span className="text-sm font-medium text-center">
                                      {type.label}
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Description */}
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-medium flex items-center text-orange-700 dark:text-orange-300">
                          <div className="p-1 bg-gradient-to-r from-orange-500 to-yellow-500 rounded mr-2">
                            <FileText className="h-4 w-4 text-white" />
                          </div>
                          Description
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter payment description"
                            className="h-12"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Payment Details Card */}
              <Card className="glass-morphism">
                <CardContent className="space-y-6">
                  {/* Payment Details */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-medium flex items-center text-blue-700 dark:text-blue-300 p-4">
                      <div className="p-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg mr-2">
                        <CreditCard className="h-5 w-5 text-white" />
                      </div>
                      Payment Details
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Status */}
                      <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-medium">Payment Status</FormLabel>
                            <Select value={field.value} onValueChange={field.onChange}>
                              <FormControl>
                                <SelectTrigger className="h-12">
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {paymentStatuses.map((status) => (
                                  <SelectItem key={status.value} value={status.value}>
                                    <div className="flex items-center space-x-2">
                                      <Badge className={status.color}>
                                        {status.label}
                                      </Badge>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Payment Method */}
                      <FormField
                        control={form.control}
                        name="method"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-medium">Payment Method</FormLabel>
                            <Select value={field.value} onValueChange={field.onChange}>
                              <FormControl>
                                <SelectTrigger className="h-12">
                                  <SelectValue placeholder="Select payment method" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {paymentMethods.map((method) => {
                                  const Icon = method.icon;
                                  return (
                                    <SelectItem key={method.value} value={method.value}>
                                      <div className="flex items-center space-x-2">
                                        <Icon className="h-4 w-4" />
                                        <span>{method.label}</span>
                                      </div>
                                    </SelectItem>
                                  );
                                })}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Due Date */}
                      <FormField
                        control={form.control}
                        name="dueDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-medium flex items-center">
                              <Calendar className="h-4 w-4 mr-2" />
                              Due Date
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="date"
                                className="h-12"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Academic Information */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-medium flex items-center text-purple-700 dark:text-purple-300 p-4">
                      <div className="p-1.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg mr-2">
                        <BookOpen className="h-5 w-5 text-white" />
                      </div>
                      Academic Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Academic Year */}
                      <FormField
                        control={form.control}
                        name="academicYear"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Academic Year</FormLabel>
                            <Select value={field.value} onValueChange={field.onChange}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select academic year" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {academicYears.map((year) => (
                                  <SelectItem key={year} value={year}>
                                    {year}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Term */}
                      <FormField
                        control={form.control}
                        name="term"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Term</FormLabel>
                            <Select value={field.value} onValueChange={field.onChange}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select term" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {terms.map((term) => (
                                  <SelectItem key={term} value={term}>
                                    {term}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Notes */}
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-medium text-rose-700 dark:text-rose-300">Additional Notes</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter any additional notes about this payment..."
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Payment Summary */}
              {form.watch("amount") > 0 && (
                <Card className="glass-morphism border-gradient-to-r from-emerald-300 to-teal-300 dark:from-emerald-700 dark:to-teal-700 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-950/30 dark:via-teal-950/30 dark:to-cyan-950/30 shadow-xl shadow-emerald-500/10">
                  <CardContent className="p-6 bg-gradient-to-r from-emerald-100/20 to-teal-100/20 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <h4 className="text-lg font-semibold bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent">Payment Summary</h4>
                        <div className="flex items-center space-x-4">
                          {selectedPaymentType && (
                            <Badge className="bg-primary/10 text-primary">
                              {selectedPaymentType.label}
                            </Badge>
                          )}
                          {selectedStatus && (
                            <Badge className={selectedStatus.color}>
                              {selectedStatus.label}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                          ${form.watch("amount")?.toFixed(2) || "0.00"}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 pt-6 border-t border-gradient-to-r from-emerald-200 to-teal-200 dark:from-emerald-800 dark:to-teal-800 bg-gradient-to-r from-emerald-50/30 to-teal-50/30 dark:from-emerald-950/20 dark:to-teal-950/20 -mx-6 px-6 pb-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                  className="min-w-[120px] border-rose-300 text-rose-700 hover:bg-rose-50 dark:border-rose-700 dark:text-rose-300 dark:hover:bg-rose-950/20"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={addPaymentMutation.isPending}
                  className="min-w-[120px] bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 transition-all duration-300"
                >
                  {addPaymentMutation.isPending ? "Adding..." : "Add Payment"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}