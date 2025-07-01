import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { useQuery } from '@tanstack/react-query';
import PaymentsTable from '@/components/finance/PaymentsTable';
import { formatCurrency } from '@/lib/utils';
import { Payment } from '@shared/schema';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  CreditCard, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  BarChart3,
  PieChart,
  Download,
  Filter,
  Plus,
  Calendar,
  Building,
  Target,
  Wallet
} from 'lucide-react';

export default function Finance() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['/api/stats'],
  });

  const { data: payments } = useQuery({
    queryKey: ['/api/payments'],
  });

  // Calculate financial metrics
  const totalRevenue = Array.isArray(payments) ? payments.reduce((sum: number, payment: any) => sum + payment.amount, 0) : 85000;
  const collectionRate = 87.5;
  const outstandingAmount = 12500;
  const paidStudents = 145;
  const unpaidStudents = 23;
  const partialStudents = 8;

  const handleAddPayment = () => {
    // This is handled inside the PaymentsTable component with dialog
  };

  return (
    <Layout>
      <div className="space-y-8">
        {/* Modern Page Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-green-500/10 rounded-xl">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gradient">Financial Management</h1>
                <p className="text-muted-foreground">Track payments, revenue, and financial analytics</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button variant="outline" className="glass-morphism border-border/30 hover:border-primary/30">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Financial Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Revenue */}
          <Card className="glass-morphism border-border/30 hover:border-primary/30 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground font-medium">Total Revenue</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <h3 className="text-2xl font-bold text-green-600">{formatCurrency(totalRevenue)}</h3>
                    <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +12.5%
                    </Badge>
                  </div>
                </div>
                <div className="p-3 bg-green-500/10 rounded-xl">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Collection Rate */}
          <Card className="glass-morphism border-border/30 hover:border-primary/30 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground font-medium">Collection Rate</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <h3 className="text-2xl font-bold text-blue-600">{collectionRate}%</h3>
                    <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +3.2%
                    </Badge>
                  </div>
                  <Progress value={collectionRate} className="mt-3 h-2" />
                </div>
                <div className="p-3 bg-blue-500/10 rounded-xl">
                  <Target className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Outstanding Amount */}
          <Card className="glass-morphism border-border/30 hover:border-primary/30 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground font-medium">Outstanding</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <h3 className="text-2xl font-bold text-orange-600">{formatCurrency(outstandingAmount)}</h3>
                    <Badge className="bg-orange-500/10 text-orange-600 border-orange-500/20">
                      <TrendingDown className="h-3 w-3 mr-1" />
                      -8.1%
                    </Badge>
                  </div>
                </div>
                <div className="p-3 bg-orange-500/10 rounded-xl">
                  <AlertTriangle className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Active Students */}
          <Card className="glass-morphism border-border/30 hover:border-primary/30 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground font-medium">Active Students</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <h3 className="text-2xl font-bold text-purple-600">{paidStudents + unpaidStudents + partialStudents}</h3>
                    <Badge className="bg-purple-500/10 text-purple-600 border-purple-500/20">
                      <Users className="h-3 w-3 mr-1" />
                      176 total
                    </Badge>
                  </div>
                </div>
                <div className="p-3 bg-purple-500/10 rounded-xl">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment Status Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Paid Students */}
          <Card className="glass-morphism border-border/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-500/10 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-green-600 text-[25px]">Paid Students</h3>
                    <p className="text-sm text-muted-foreground">Fees fully collected</p>
                  </div>
                </div>
                <Badge className="bg-green-500/10 text-green-600 border-green-500/20 text-sm px-3 py-1">
                  {paidStudents}
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Payment Rate</span>
                  <span className="font-medium">82.4%</span>
                </div>
                <Progress value={82.4} className="h-2 bg-green-500/10" />
              </div>
            </CardContent>
          </Card>

          {/* Partial Payments */}
          <Card className="glass-morphism border-border/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-amber-500/10 rounded-lg">
                    <Clock className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-amber-600 text-[25px]">Partial Payments</h3>
                    <p className="text-sm text-muted-foreground">Partially paid fees</p>
                  </div>
                </div>
                <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 text-sm px-3 py-1">
                  {partialStudents}
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Completion Rate</span>
                  <span className="font-medium">4.5%</span>
                </div>
                <Progress value={4.5} className="h-2 bg-amber-500/10" />
              </div>
            </CardContent>
          </Card>

          {/* Unpaid Students */}
          <Card className="glass-morphism border-border/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-red-500/10 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-red-600">Unpaid Students</h3>
                    <p className="text-sm text-muted-foreground">Outstanding fees</p>
                  </div>
                </div>
                <Badge className="bg-red-500/10 text-red-600 border-red-500/20 text-sm px-3 py-1">
                  {unpaidStudents}
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Outstanding Rate</span>
                  <span className="font-medium">13.1%</span>
                </div>
                <Progress value={13.1} className="h-2 bg-red-500/10" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Financial Analytics Tabs */}
        <Tabs defaultValue="payments" className="space-y-6">
          <TabsList className="glass-morphism border-border/30 bg-background/50">
            <TabsTrigger value="payments" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <CreditCard className="h-4 w-4 mr-2" />
              Payments
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="reports" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <PieChart className="h-4 w-4 mr-2" />
              Reports
            </TabsTrigger>
          </TabsList>

          <TabsContent value="payments" className="space-y-6">
            <PaymentsTable onAddPayment={handleAddPayment} />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Monthly Revenue Chart */}
              <Card className="glass-morphism border-border/30">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-primary flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Monthly Revenue Trend
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Revenue chart visualization</p>
                      <p className="text-sm">Would integrate with Recharts</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Methods Distribution */}
              <Card className="glass-morphism border-border/30">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-primary flex items-center">
                    <PieChart className="h-5 w-5 mr-2" />
                    Payment Methods
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        <span className="text-sm">Cash</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">45%</div>
                        <div className="text-xs text-muted-foreground">$38,250</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span className="text-sm">Bank Transfer</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">35%</div>
                        <div className="text-xs text-muted-foreground">$29,750</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                        <span className="text-sm">Card Payment</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">20%</div>
                        <div className="text-xs text-muted-foreground">$17,000</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Quick Reports */}
              <Card className="glass-morphism border-border/30 hover:border-primary/30 transition-all duration-300 cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                      <Calendar className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Monthly Report</h3>
                      <p className="text-sm text-muted-foreground">Current month financial summary</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Generate Report
                  </Button>
                </CardContent>
              </Card>

              <Card className="glass-morphism border-border/30 hover:border-primary/30 transition-all duration-300 cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-green-500/10 rounded-lg">
                      <Users className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Student Payments</h3>
                      <p className="text-sm text-muted-foreground">Individual payment history</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Generate Report
                  </Button>
                </CardContent>
              </Card>

              <Card className="glass-morphism border-border/30 hover:border-primary/30 transition-all duration-300 cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-purple-500/10 rounded-lg">
                      <Building className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Financial Statement</h3>
                      <p className="text-sm text-muted-foreground">Comprehensive financial overview</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Generate Report
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
