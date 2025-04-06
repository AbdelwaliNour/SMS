import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format as formatDate } from 'date-fns';
import { cn } from '@/lib/utils';

interface ReportSchedulerProps {
  reportType: string;
}

const ReportScheduler = ({ reportType }: ReportSchedulerProps) => {
  const [frequency, setFrequency] = useState('weekly');
  const [recipients, setRecipients] = useState('admin@school.com');
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [sendEmail, setSendEmail] = useState(true);
  const [saveToCloud, setSaveToCloud] = useState(true);
  const [reportFormat, setReportFormat] = useState('pdf');
  const [isScheduling, setIsScheduling] = useState(false);
  
  const { toast } = useToast();

  const handleSchedule = () => {
    // In a real implementation, this would use an API to schedule the report
    setIsScheduling(true);
    
    // Simulate scheduling delay
    setTimeout(() => {
      setIsScheduling(false);
      toast({
        title: 'Report Scheduled',
        description: `Your ${reportType} report has been scheduled successfully.`,
        duration: 3000,
      });
    }, 1500);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-homenaje text-green">Schedule Report</CardTitle>
        <CardDescription>Set up automatic report generation and delivery</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="frequency">Frequency</Label>
            <Select value={frequency} onValueChange={setFrequency}>
              <SelectTrigger className="border-gray-200 dark:border-gray-700 focus:border-green focus:ring-1 focus:ring-green">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="biweekly">Bi-weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Start Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal border-gray-200 dark:border-gray-700 focus:border-green focus:ring-1 focus:ring-green",
                    !startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? formatDate(startDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {frequency === 'weekly' && (
          <div className="space-y-2">
            <Label>Days of Week</Label>
            <div className="grid grid-cols-7 gap-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <Button 
                  key={day} 
                  variant="outline" 
                  className="h-10 p-0 data-[state=on]:bg-green data-[state=on]:text-white" 
                  data-state={day === 'Mon' ? 'on' : 'off'}
                >
                  {day}
                </Button>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="recipients">Recipients (comma separated)</Label>
          <Input 
            id="recipients" 
            value={recipients} 
            onChange={(e) => setRecipients(e.target.value)}
            className="border-gray-200 dark:border-gray-700 focus:border-green focus:ring-1 focus:ring-green"
          />
        </div>

        <div className="space-y-2">
          <Label>Delivery Options</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="flex items-center space-x-2">
              <Switch 
                id="email" 
                checked={sendEmail} 
                onCheckedChange={setSendEmail} 
                className="data-[state=checked]:bg-green"
              />
              <Label htmlFor="email" className="cursor-pointer">Send via Email</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="cloud" 
                checked={saveToCloud} 
                onCheckedChange={setSaveToCloud} 
                className="data-[state=checked]:bg-green"
              />
              <Label htmlFor="cloud" className="cursor-pointer">Save to Cloud Storage</Label>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="format">Format</Label>
            <Select value={reportFormat} onValueChange={setReportFormat}>
              <SelectTrigger className="border-gray-200 dark:border-gray-700 focus:border-green focus:ring-1 focus:ring-green">
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">PDF Document</SelectItem>
                <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                <SelectItem value="csv">CSV File</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Notification Preferences</Label>
            <Select defaultValue="success">
              <SelectTrigger className="border-gray-200 dark:border-gray-700 focus:border-green focus:ring-1 focus:ring-green">
                <SelectValue placeholder="Select notification preference" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="always">Always Notify</SelectItem>
                <SelectItem value="success">On Success Only</SelectItem>
                <SelectItem value="failure">On Failure Only</SelectItem>
                <SelectItem value="never">Never</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button 
          variant="outline" 
          className="border-gray-200 hover:bg-gray-50 text-gray-600"
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSchedule} 
          className="bg-green hover:bg-green/90 text-white shadow-sm hover:shadow"
          disabled={isScheduling}
        >
          {isScheduling ? "Scheduling..." : "Schedule Report"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ReportScheduler;