import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { AnimatedSkeleton, CardSkeleton, ChartSkeleton } from '@/components/ui/animated-skeleton';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  ScatterChart,
  Scatter,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { 
  Download, 
  BarChart2, 
  TrendingUp, 
  PieChart as PieChartIcon,
  ArrowUpRight, 
  ArrowDownRight, 
  Minus 
} from 'lucide-react';

// Colors from our theme
const COLORS = ['#00A1FF', '#00C445', '#FFBE00', '#F62929', '#757575'];

interface ComparativeAnalysisProps {
  initialCompareBy?: 'section' | 'gender' | 'class';
}

const ComparativeAnalysis = ({ initialCompareBy = 'section' }: ComparativeAnalysisProps) => {
  const [compareBy, setCompareBy] = useState<'section' | 'gender' | 'class'>(initialCompareBy);
  const [timeRange, setTimeRange] = useState('year');
  const [selectedMetric, setSelectedMetric] = useState('academic');
  
  // Options for comparison
  const sectionOptions = ['primary', 'secondary', 'highschool'];
  const classOptions = ['1A', '1B', '2A', '2B', '3A', '3B'];
  const genderOptions = ['male', 'female'];
  
  // Track which items are selected for comparison
  const [selectedItems, setSelectedItems] = useState<string[]>(() => {
    // Initialize with first two options based on compareBy
    switch (compareBy) {
      case 'section':
        return [sectionOptions[0], sectionOptions[1]];
      case 'gender':
        return [genderOptions[0], genderOptions[1]];
      case 'class':
        return [classOptions[0], classOptions[1]];
      default:
        return [];
    }
  });
  
  // Fetch analytics data with filtering options
  const { data: analytics, isLoading, error } = useQuery({
    queryKey: ['/api/analytics', { period: timeRange, category: selectedMetric }],
  });
  
  // Handle checkbox change
  const handleCheckboxChange = (value: string) => {
    if (selectedItems.includes(value)) {
      setSelectedItems(selectedItems.filter(item => item !== value));
    } else {
      setSelectedItems([...selectedItems, value]);
    }
  };
  
  // Get options based on comparison type
  const getComparisonOptions = () => {
    switch (compareBy) {
      case 'section':
        return sectionOptions;
      case 'gender':
        return genderOptions;
      case 'class':
        return classOptions;
      default:
        return [];
    }
  };
  
  // Create presentable labels
  const formatLabel = (value: string) => {
    if (compareBy === 'section') {
      return value.charAt(0).toUpperCase() + value.slice(1);
    }
    if (compareBy === 'gender') {
      return value.charAt(0).toUpperCase() + value.slice(1);
    }
    return value;
  };
  
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <CardSkeleton className="h-8 w-48" />
          <div className="flex flex-wrap gap-2">
            <CardSkeleton className="h-10 w-36" />
            <CardSkeleton className="h-10 w-36" />
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <CardSkeleton className="h-8 w-28" />
          <CardSkeleton className="h-8 w-28" />
          <CardSkeleton className="h-8 w-28" />
        </div>
        
        <ChartSkeleton height={400} />
      </div>
    );
  }
  
  if (error) {
    return (
      <Card className="border-red bg-red/5">
        <CardHeader>
          <CardTitle className="text-red">Error Loading Data</CardTitle>
          <CardDescription>There was an error loading the comparative analysis data. Please try again later.</CardDescription>
        </CardHeader>
      </Card>
    );
  }
  
  // Generate sample academic performance data by section/gender/class
  const generatePerformanceData = () => {
    // This would come from the real analytics data in production
    
    // Academic performance by section
    if (compareBy === 'section') {
      return [
        { subject: 'Math', primary: 76, secondary: 82, highschool: 84 },
        { subject: 'Science', primary: 78, secondary: 84, highschool: 88 },
        { subject: 'English', primary: 83, secondary: 85, highschool: 87 },
        { subject: 'History', primary: 72, secondary: 75, highschool: 80 },
        { subject: 'Geography', primary: 75, secondary: 79, highschool: 84 },
      ];
    }
    
    // Academic performance by gender
    if (compareBy === 'gender') {
      return [
        { subject: 'Math', male: 79, female: 81 },
        { subject: 'Science', male: 83, female: 82 },
        { subject: 'English', male: 81, female: 89 },
        { subject: 'History', male: 77, female: 79 },
        { subject: 'Geography', male: 80, female: 82 },
      ];
    }
    
    // Academic performance by class
    return [
      { subject: 'Math', '1A': 75, '1B': 78, '2A': 81, '2B': 83, '3A': 85, '3B': 87 },
      { subject: 'Science', '1A': 77, '1B': 79, '2A': 83, '2B': 85, '3A': 87, '3B': 89 },
      { subject: 'English', '1A': 82, '1B': 80, '2A': 84, '2B': 86, '3A': 88, '3B': 90 },
      { subject: 'History', '1A': 71, '1B': 73, '2A': 76, '2B': 78, '3A': 82, '3B': 84 },
      { subject: 'Geography', '1A': 74, '1B': 76, '2A': 79, '2B': 81, '3A': 83, '3B': 86 },
    ];
  };
  
  // Generate sample attendance data
  const generateAttendanceData = () => {
    if (compareBy === 'section') {
      return [
        { month: 'Jan', primary: 92, secondary: 95, highschool: 91 },
        { month: 'Feb', primary: 94, secondary: 93, highschool: 92 },
        { month: 'Mar', primary: 95, secondary: 94, highschool: 90 },
        { month: 'Apr', primary: 93, secondary: 96, highschool: 93 },
        { month: 'May', primary: 96, secondary: 95, highschool: 94 },
        { month: 'Jun', primary: 95, secondary: 93, highschool: 95 },
      ];
    }
    
    if (compareBy === 'gender') {
      return [
        { month: 'Jan', male: 92, female: 94 },
        { month: 'Feb', male: 91, female: 95 },
        { month: 'Mar', male: 93, female: 94 },
        { month: 'Apr', male: 94, female: 93 },
        { month: 'May', male: 95, female: 96 },
        { month: 'Jun', male: 94, female: 95 },
      ];
    }
    
    return [
      { month: 'Jan', '1A': 91, '1B': 92, '2A': 93, '2B': 94, '3A': 95, '3B': 96 },
      { month: 'Feb', '1A': 92, '1B': 93, '2A': 94, '2B': 95, '3A': 96, '3B': 97 },
      { month: 'Mar', '1A': 91, '1B': 92, '2A': 93, '2B': 94, '3A': 95, '3B': 96 },
      { month: 'Apr', '1A': 93, '1B': 94, '2A': 95, '2B': 96, '3A': 97, '3B': 98 },
      { month: 'May', '1A': 94, '1B': 95, '2A': 96, '2B': 97, '3A': 98, '3B': 99 },
      { month: 'Jun', '1A': 92, '1B': 93, '2A': 94, '2B': 95, '3A': 96, '3B': 97 },
    ];
  };
  
  // Generate sample financial data
  const generateFinancialData = () => {
    if (compareBy === 'section') {
      return [
        { month: 'Jan', primary: 8500, secondary: 9800, highschool: 10500 },
        { month: 'Feb', primary: 8700, secondary: 10000, highschool: 11000 },
        { month: 'Mar', primary: 8600, secondary: 9900, highschool: 10800 },
        { month: 'Apr', primary: 8800, secondary: 10200, highschool: 11200 },
        { month: 'May', primary: 8900, secondary: 10300, highschool: 11300 },
        { month: 'Jun', primary: 9000, secondary: 10500, highschool: 11500 },
      ];
    }
    
    if (compareBy === 'gender') {
      return [
        { month: 'Jan', male: 15000, female: 14500 },
        { month: 'Feb', male: 15200, female: 15000 },
        { month: 'Mar', male: 15100, female: 14900 },
        { month: 'Apr', male: 15300, female: 15100 },
        { month: 'May', male: 15400, female: 15200 },
        { month: 'Jun', male: 15500, female: 15300 },
      ];
    }
    
    return [
      { month: 'Jan', '1A': 4500, '1B': 4600, '2A': 5500, '2B': 5600, '3A': 6500, '3B': 6600 },
      { month: 'Feb', '1A': 4600, '1B': 4700, '2A': 5600, '2B': 5700, '3A': 6600, '3B': 6700 },
      { month: 'Mar', '1A': 4550, '1B': 4650, '2A': 5550, '2B': 5650, '3A': 6550, '3B': 6650 },
      { month: 'Apr', '1A': 4700, '1B': 4800, '2A': 5700, '2B': 5800, '3A': 6700, '3B': 6800 },
      { month: 'May', '1A': 4750, '1B': 4850, '2A': 5750, '2B': 5850, '3A': 6750, '3B': 6850 },
      { month: 'Jun', '1A': 4800, '1B': 4900, '2A': 5800, '2B': 5900, '3A': 6800, '3B': 6900 },
    ];
  };
  
  // Generate data based on selected metric
  const getChartData = () => {
    switch (selectedMetric) {
      case 'academic':
        return generatePerformanceData();
      case 'attendance':
        return generateAttendanceData();
      case 'financial':
        return generateFinancialData();
      default:
        return [];
    }
  };
  
  // Filter chart data to include only selected items for comparison
  const filterChartData = (data: any[]) => {
    return data.map(item => {
      const filteredItem: Record<string, any> = { 
        [compareBy === 'class' ? 'class' : 
          compareBy === 'gender' ? 'gender' : 'subject']: 
          item[compareBy === 'class' ? 'class' : 
            compareBy === 'gender' ? 'gender' : 'subject'] 
      };
      
      // Include the x-axis field (first field)
      const xAxisField = Object.keys(item)[0];
      filteredItem[xAxisField] = item[xAxisField];
      
      // Include only selected comparison items
      selectedItems.forEach(selectedItem => {
        if (item[selectedItem] !== undefined) {
          filteredItem[selectedItem] = item[selectedItem];
        }
      });
      
      return filteredItem;
    });
  };
  
  // Get appropriate tooltip formatter based on metric
  const getTooltipFormatter = (value: number, name: string) => {
    if (selectedMetric === 'financial') {
      return [`$${value}`, formatLabel(name)];
    }
    if (selectedMetric === 'attendance') {
      return [`${value}%`, formatLabel(name)];
    }
    return [value, formatLabel(name)];
  };
  
  // Get chart Y-axis label based on metric
  const getYAxisLabel = () => {
    switch (selectedMetric) {
      case 'academic':
        return 'Score';
      case 'attendance':
        return 'Attendance Rate (%)';
      case 'financial':
        return 'Amount ($)';
      default:
        return '';
    }
  };
  
  // Get insight text based on selected data
  const getInsightText = () => {
    if (selectedItems.length < 2) {
      return 'Select at least two items to compare for insights.';
    }
    
    switch (selectedMetric) {
      case 'academic':
        if (compareBy === 'section') {
          return 'High School students consistently outperform in academic subjects, with the greatest gap in Science and Geography. Primary section shows the most room for improvement in History.';
        }
        if (compareBy === 'gender') {
          return 'Female students show higher performance in English, while male students perform slightly better in Science. Overall differences are minimal with roughly equal academic outcomes.';
        }
        return 'Performance improves with grade level, with 3B class showing consistently higher scores across all subjects. Consider successful teaching methods from higher grades for adaptation.';
        
      case 'attendance':
        if (compareBy === 'section') {
          return 'Secondary section has the highest attendance rates, with High School showing the most fluctuation throughout the year. Primary section maintains consistent attendance patterns.';
        }
        if (compareBy === 'gender') {
          return 'Female students have slightly higher attendance rates overall, though the gap is narrowing. Both groups show improved attendance in the later months of the academic year.';
        }
        return 'Higher classes demonstrate better attendance rates, with 3A and 3B consistently above 95%. Lower classes show more variation month-to-month.';
        
      case 'financial':
        if (compareBy === 'section') {
          return 'High School has the highest fee collection amounts, reflecting higher tuition costs. All sections show a gradual increase in collection amounts across the academic year.';
        }
        if (compareBy === 'gender') {
          return 'Fee collection is relatively balanced between genders, with male students accounting for slightly higher amounts overall. The trend lines for both groups follow similar patterns.';
        }
        return 'Fee collection increases with grade level as expected due to different fee structures. All classes show steady improvement in collection amounts over time.';
        
      default:
        return 'Select a metric and comparison items to see insights.';
    }
  };
  
  // Generate comparative summary
  const generateComparativeSummary = () => {
    if (selectedItems.length < 2) {
      return [];
    }
    
    const chartData = getChartData();
    
    // For academic performance, calculate average scores
    if (selectedMetric === 'academic') {
      return selectedItems.map(item => {
        const total = chartData.reduce((sum, dataPoint) => sum + (dataPoint[item] || 0), 0);
        const average = total / chartData.length;
        
        // Compare with first item in the list
        const compareWith = selectedItems[0];
        const difference = item === compareWith ? 0 : average - chartData.reduce((sum, dataPoint) => sum + (dataPoint[compareWith] || 0), 0) / chartData.length;
        
        return {
          name: formatLabel(item),
          average: average.toFixed(1),
          difference: difference.toFixed(1),
          trend: difference > 1 ? 'up' : difference < -1 ? 'down' : 'neutral'
        };
      });
    }
    
    // For attendance and financial, calculate average over time
    return selectedItems.map(item => {
      const total = chartData.reduce((sum, dataPoint) => sum + (dataPoint[item] || 0), 0);
      const average = total / chartData.length;
      
      // Compare with first item in the list
      const compareWith = selectedItems[0];
      const difference = item === compareWith ? 0 : average - chartData.reduce((sum, dataPoint) => sum + (dataPoint[compareWith] || 0), 0) / chartData.length;
      
      const percentDifference = item === compareWith ? 0 : (difference / (chartData.reduce((sum, dataPoint) => sum + (dataPoint[compareWith] || 0), 0) / chartData.length)) * 100;
      
      return {
        name: formatLabel(item),
        average: selectedMetric === 'financial' ? `$${average.toFixed(0)}` : `${average.toFixed(1)}${selectedMetric === 'attendance' ? '%' : ''}`,
        difference: selectedMetric === 'financial' ? `$${difference.toFixed(0)}` : `${difference.toFixed(1)}${selectedMetric === 'attendance' ? '%' : ''}`,
        percentDifference: `${percentDifference.toFixed(1)}%`,
        trend: difference > 0 ? 'up' : difference < 0 ? 'down' : 'neutral'
      };
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h2 className="text-2xl font-homenaje text-gray-800 dark:text-gray-200">
          Comparative Analysis
        </h2>
        
        <div className="flex flex-wrap gap-2">
          <Select value={compareBy} onValueChange={(value) => setCompareBy(value as any)}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Compare by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="section">By Section</SelectItem>
              <SelectItem value="gender">By Gender</SelectItem>
              <SelectItem value="class">By Class</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="term">Current Term</SelectItem>
              <SelectItem value="year">Academic Year</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" className="gap-1">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>
      
      {/* Metric Selection */}
      <Tabs value={selectedMetric} onValueChange={setSelectedMetric} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="academic" className="gap-1">
            <BarChart2 className="h-4 w-4" />
            <span className="hidden sm:inline">Academic</span>
          </TabsTrigger>
          <TabsTrigger value="attendance" className="gap-1">
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">Attendance</span>
          </TabsTrigger>
          <TabsTrigger value="financial" className="gap-1">
            <PieChartIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Financial</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>
      
      {/* Comparison Item Selection */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-homenaje text-blue">
            Select items to compare
          </CardTitle>
          <CardDescription>
            Choose at least two items for comparison
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            {getComparisonOptions().map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <Checkbox 
                  id={option} 
                  checked={selectedItems.includes(option)}
                  onCheckedChange={() => handleCheckboxChange(option)}
                  className="data-[state=checked]:bg-blue data-[state=checked]:border-blue"
                />
                <Label 
                  htmlFor={option}
                  className="cursor-pointer"
                >
                  {formatLabel(option)}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* No items selected message */}
      {selectedItems.length < 1 && (
        <Card className="border-yellow bg-yellow/5">
          <CardHeader>
            <CardTitle className="text-yellow">No Items Selected</CardTitle>
            <CardDescription>Please select at least two items to compare.</CardDescription>
          </CardHeader>
        </Card>
      )}
      
      {/* Comparison Chart */}
      {selectedItems.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-homenaje text-blue">
              {selectedMetric === 'academic' ? 'Academic Performance Comparison' : 
               selectedMetric === 'attendance' ? 'Attendance Rate Comparison' : 
               'Financial Metrics Comparison'}
            </CardTitle>
            <CardDescription>
              {selectedMetric === 'academic' ? 'Average scores by subject' : 
               selectedMetric === 'attendance' ? 'Attendance rates over time' : 
               'Fee collection over time'}
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              {selectedMetric === 'academic' ? (
                <BarChart
                  data={filterChartData(getChartData())}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="subject" />
                  <YAxis label={{ value: getYAxisLabel(), angle: -90, position: 'insideLeft' }} />
                  <Tooltip formatter={(value: any, name: any) => getTooltipFormatter(value, name)} />
                  <Legend />
                  {selectedItems.map((item, index) => (
                    <Bar 
                      key={item} 
                      dataKey={item} 
                      name={formatLabel(item)} 
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </BarChart>
              ) : (
                <LineChart
                  data={filterChartData(getChartData())}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis label={{ value: getYAxisLabel(), angle: -90, position: 'insideLeft' }} />
                  <Tooltip formatter={(value: any, name: any) => getTooltipFormatter(value, name)} />
                  <Legend />
                  {selectedItems.map((item, index) => (
                    <Line 
                      key={item} 
                      type="monotone" 
                      dataKey={item} 
                      name={formatLabel(item)} 
                      stroke={COLORS[index % COLORS.length]} 
                      strokeWidth={2}
                      dot={{ strokeWidth: 2 }}
                    />
                  ))}
                </LineChart>
              )}
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
      
      {/* Comparative Summary */}
      {selectedItems.length > 1 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {generateComparativeSummary().map((summary, index) => (
            <Card key={index} className={`${index === 0 ? 'bg-blue/5 border-blue/20' : ''}`}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-homenaje text-blue">
                  {summary.name}
                </CardTitle>
                <CardDescription>
                  {selectedMetric === 'academic' ? 'Average score across subjects' : 
                   selectedMetric === 'attendance' ? 'Average attendance rate' : 
                   'Average collection amount'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue">
                  {summary.average}
                </div>
                
                {index > 0 && (
                  <div className="flex items-center mt-2 text-sm">
                    <span className="mr-1">vs {generateComparativeSummary()[0].name}:</span>
                    <span className={`flex items-center ${
                      summary.trend === 'up' 
                        ? 'text-green' 
                        : summary.trend === 'down' 
                          ? 'text-red' 
                          : 'text-gray-500'
                    }`}>
                      {summary.trend === 'up' 
                        ? <ArrowUpRight className="h-4 w-4 mr-1" /> 
                        : summary.trend === 'down' 
                          ? <ArrowDownRight className="h-4 w-4 mr-1" /> 
                          : <Minus className="h-4 w-4 mr-1" />
                      }
                      {summary.difference} ({summary.percentDifference})
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {/* Insights */}
      {selectedItems.length > 1 && (
        <Card className="border-l-4 border-l-blue">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-homenaje text-blue">Analysis Insights</CardTitle>
            <CardDescription>Interpretation of comparative data</CardDescription>
          </CardHeader>
          <CardContent>
            <p>{getInsightText()}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ComparativeAnalysis;