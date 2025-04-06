import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

type ExportFormat = 'pdf' | 'excel' | 'csv';

interface ReportExportOptionsProps {
  reportType: string;
}

const ReportExportOptions = ({ reportType }: ReportExportOptionsProps) => {
  const [exportFormat, setExportFormat] = useState<ExportFormat>('pdf');
  const [includeCharts, setIncludeCharts] = useState(true);
  const [includeTables, setIncludeTables] = useState(true);
  const [includeSummary, setIncludeSummary] = useState(true);
  const [fileName, setFileName] = useState(`${reportType}-report`);
  const [exportLoading, setExportLoading] = useState(false);
  
  const { toast } = useToast();

  const handleExport = () => {
    // In a real implementation, this would use an API to generate the report
    setExportLoading(true);
    
    // Simulate export delay
    setTimeout(() => {
      setExportLoading(false);
      toast({
        title: 'Report Generated',
        description: `Your ${reportType} report has been generated successfully.`,
        duration: 3000,
      });
    }, 1500);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-homenaje text-blue">Export Report</CardTitle>
        <CardDescription>Configure export settings for your report</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fileName">File Name</Label>
            <Input 
              id="fileName" 
              value={fileName} 
              onChange={(e) => setFileName(e.target.value)}
              className="border-gray-200 dark:border-gray-700 focus:border-blue focus:ring-1 focus:ring-blue"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Format</Label>
            <Select value={exportFormat} onValueChange={(value) => setExportFormat(value as ExportFormat)}>
              <SelectTrigger className="border-gray-200 dark:border-gray-700 focus:border-blue focus:ring-1 focus:ring-blue">
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">PDF Document</SelectItem>
                <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                <SelectItem value="csv">CSV File</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Include Content</Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="flex items-center space-x-2">
              <Switch 
                id="charts" 
                checked={includeCharts} 
                onCheckedChange={setIncludeCharts} 
                className="data-[state=checked]:bg-blue"
              />
              <Label htmlFor="charts" className="cursor-pointer">Charts & Visualizations</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="tables" 
                checked={includeTables} 
                onCheckedChange={setIncludeTables} 
                className="data-[state=checked]:bg-blue"
              />
              <Label htmlFor="tables" className="cursor-pointer">Data Tables</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="summary" 
                checked={includeSummary} 
                onCheckedChange={setIncludeSummary} 
                className="data-[state=checked]:bg-blue"
              />
              <Label htmlFor="summary" className="cursor-pointer">Executive Summary</Label>
            </div>
          </div>
        </div>

        <Tabs defaultValue="standard" className="w-full mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="standard">Standard Options</TabsTrigger>
            <TabsTrigger value="advanced">Advanced Options</TabsTrigger>
          </TabsList>
          
          <TabsContent value="standard" className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Paper Size</Label>
                <Select defaultValue="a4">
                  <SelectTrigger className="border-gray-200 dark:border-gray-700 focus:border-blue focus:ring-1 focus:ring-blue">
                    <SelectValue placeholder="Select paper size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="letter">Letter (8.5" x 11")</SelectItem>
                    <SelectItem value="a4">A4 (210 x 297mm)</SelectItem>
                    <SelectItem value="legal">Legal (8.5" x 14")</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Orientation</Label>
                <Select defaultValue="portrait">
                  <SelectTrigger className="border-gray-200 dark:border-gray-700 focus:border-blue focus:ring-1 focus:ring-blue">
                    <SelectValue placeholder="Select orientation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="portrait">Portrait</SelectItem>
                    <SelectItem value="landscape">Landscape</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="advanced" className="pt-4">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch id="watermark" className="data-[state=checked]:bg-blue" />
                <Label htmlFor="watermark" className="cursor-pointer">Include Watermark</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch id="password" className="data-[state=checked]:bg-blue" />
                <Label htmlFor="password" className="cursor-pointer">Password Protect</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch id="compress" defaultChecked className="data-[state=checked]:bg-blue" />
                <Label htmlFor="compress" className="cursor-pointer">Optimize File Size</Label>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button 
          variant="outline" 
          className="border-gray-200 hover:bg-gray-50 text-gray-600"
        >
          Cancel
        </Button>
        <Button 
          onClick={handleExport} 
          className="bg-blue hover:bg-blue/90 text-white shadow-sm hover:shadow"
          disabled={exportLoading}
        >
          {exportLoading ? "Generating..." : "Generate Report"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ReportExportOptions;