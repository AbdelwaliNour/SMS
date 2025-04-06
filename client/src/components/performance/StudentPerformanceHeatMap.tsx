import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, Cell, Legend, CartesianGrid } from 'recharts';
import { ResponsiveCard } from '@/components/ui/responsive-card';
import { AnimatedSkeleton } from '@/components/ui/animated-skeleton';
import { useIsMobile } from '@/hooks/use-mobile';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface StudentPerformanceHeatMapProps {
  studentId: number;
  className?: string;
}

// Mock subject/exam performance data for the heat map
const MOCK_SUBJECTS = ['Math', 'Science', 'English', 'History', 'Geography', 'Arts'];
const MOCK_EXAMS = ['First Term', 'Mid Term', 'Final Term'];

const getColor = (score: number) => {
  if (score >= 90) return '#00C445'; // Green for high scores
  if (score >= 75) return '#00A1FF'; // Blue for good scores
  if (score >= 60) return '#FFBE00'; // Yellow for average scores
  return '#F62929'; // Red for low scores
};

export default function StudentPerformanceHeatMap({ 
  studentId, 
  className 
}: StudentPerformanceHeatMapProps) {
  const isMobile = useIsMobile();
  
  // In a real application, we would fetch data from the API
  // Here we're using a loading state to simulate data fetching
  const { isLoading } = useQuery({
    queryKey: ['/api/results/student', studentId],
    enabled: false, // Disable the actual query since we're using mock data for the demo
  });
  
  // Generate mock data for the heat map (this would normally come from the API)
  const generateMockData = () => {
    const data: Array<{ x: number; y: number; z: number; subject: string; exam: string; score: number }> = [];
    
    MOCK_SUBJECTS.forEach((subject, subjectIndex) => {
      MOCK_EXAMS.forEach((exam, examIndex) => {
        // Generate a score between 35 and 100
        // We'll use the studentId to generate consistent pseudo-random scores for the same student
        const seedValue = (studentId * 13 + subjectIndex * 7 + examIndex * 11) % 65;
        const score = 35 + seedValue;
        
        data.push({
          x: examIndex,
          y: subjectIndex,
          z: score,
          subject,
          exam,
          score
        });
      });
    });
    
    return data;
  };
  
  const heatMapData = useMemo(() => generateMockData(), [studentId]);
  
  // Generate mock data for the radar chart (overall performance by subject)
  const radarData = useMemo(() => {
    return MOCK_SUBJECTS.map(subject => {
      const subjectScores = heatMapData
        .filter(item => item.subject === subject)
        .map(item => item.score);
      
      const avgScore = subjectScores.reduce((sum, score) => sum + score, 0) / subjectScores.length;
      
      return {
        subject,
        score: Math.round(avgScore)
      };
    });
  }, [heatMapData]);
  
  // Generate mock trend data
  const trendData = useMemo(() => {
    return MOCK_EXAMS.map(exam => {
      const examIndex = MOCK_EXAMS.indexOf(exam);
      const examScores = heatMapData
        .filter(item => item.x === examIndex)
        .map(item => item.score);
      
      const avgScore = examScores.reduce((sum, score) => sum + score, 0) / examScores.length;
      
      return {
        name: exam,
        score: Math.round(avgScore)
      };
    });
  }, [heatMapData]);
  
  // Custom tooltip for the heat map
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 shadow-lg rounded-md">
          <p className="font-medium">{data.subject}</p>
          <p className="text-sm text-gray-600 dark:text-gray-300">{data.exam}</p>
          <p className="text-sm font-bold mt-1">
            Score: <span style={{ color: getColor(data.score) }}>{data.score}</span>
          </p>
        </div>
      );
    }
    return null;
  };
  
  // Bar chart for subject averages
  const BarChart = () => (
    <div className="h-60 md:h-72">
      {isLoading ? (
        <AnimatedSkeleton className="w-full h-full" variant="chart" />
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart
            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#ccc" opacity={0.3} />
            <XAxis 
              type="category" 
              dataKey="subject" 
              name="Subject" 
              angle={isMobile ? -45 : 0}
              textAnchor={isMobile ? 'end' : 'middle'}
              height={60}
              interval={0}
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              type="number" 
              dataKey="score" 
              name="Score" 
              domain={[0, 100]} 
              unit="%" 
              tick={{ fontSize: 12 }}
            />
            <Tooltip cursor={false} content={<CustomTooltip />} />
            <Scatter 
              name="Scores" 
              data={radarData} 
              fill="#8884d8"
              shape="circle"
            >
              {radarData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={getColor(entry.score)}
                  r={15}
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      )}
    </div>
  );
  
  return (
    <ResponsiveCard
      title="Academic Performance Analysis"
      description="Detailed view of student's performance across subjects and exams"
      className={className}
    >
      <Tabs defaultValue="heatmap">
        <TabsList className="mb-4">
          <TabsTrigger value="heatmap">Heat Map</TabsTrigger>
          <TabsTrigger value="subjects">By Subject</TabsTrigger>
          <TabsTrigger value="trend">Performance Trend</TabsTrigger>
        </TabsList>
        
        <TabsContent value="heatmap" className="mt-0">
          <div className="h-80 md:h-96">
            {isLoading ? (
              <AnimatedSkeleton className="w-full h-full" variant="chart" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart
                  margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#ccc" opacity={0.3} />
                  <XAxis 
                    type="number" 
                    dataKey="x" 
                    name="Exam" 
                    domain={[-0.5, 2.5]}
                    tickCount={3}
                    ticks={[0, 1, 2]}
                    tickFormatter={(value) => MOCK_EXAMS[value] || ''}
                  />
                  <YAxis 
                    type="number" 
                    dataKey="y" 
                    name="Subject" 
                    domain={[-0.5, 5.5]}
                    tickCount={6}
                    ticks={[0, 1, 2, 3, 4, 5]}
                    tickFormatter={(value) => MOCK_SUBJECTS[value] || ''}
                  />
                  <ZAxis
                    type="number"
                    dataKey="z"
                    range={[100, 500]}
                    domain={[0, 100]}
                  />
                  <Tooltip cursor={false} content={<CustomTooltip />} />
                  <Legend 
                    payload={[
                      { value: '90-100%', type: 'circle', color: '#00C445' },
                      { value: '75-89%', type: 'circle', color: '#00A1FF' },
                      { value: '60-74%', type: 'circle', color: '#FFBE00' },
                      { value: '0-59%', type: 'circle', color: '#F62929' },
                    ]}
                  />
                  <Scatter name="Scores" data={heatMapData} fill="#8884d8">
                    {heatMapData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={getColor(entry.score)}
                      />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="subjects" className="mt-0">
          <BarChart />
        </TabsContent>
        
        <TabsContent value="trend" className="mt-0">
          <div className="h-60 md:h-72">
            {isLoading ? (
              <AnimatedSkeleton className="w-full h-full" variant="chart" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart
                  margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#ccc" opacity={0.3} />
                  <XAxis 
                    type="category" 
                    dataKey="name" 
                    name="Exam"
                  />
                  <YAxis 
                    type="number" 
                    dataKey="score" 
                    name="Score" 
                    domain={[0, 100]} 
                    unit="%" 
                  />
                  <Tooltip cursor={false} content={<CustomTooltip />} />
                  <Scatter 
                    name="Average Scores" 
                    data={trendData} 
                    fill="#8884d8"
                    line={{ stroke: '#00A1FF', strokeWidth: 2 }}
                    lineType="joint"
                    shape="circle"
                  >
                    {trendData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={getColor(entry.score)}
                        r={20}
                      />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            )}
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="mt-4 text-sm text-gray-500 dark:text-gray-400 italic">
        Note: This visualization shows the student's performance scores across different subjects and exams.
      </div>
    </ResponsiveCard>
  );
}