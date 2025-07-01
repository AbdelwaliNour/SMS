import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Result, Student, Exam } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search, 
  Award,
  Calendar,
  Plus,
  Eye,
  Edit,
  Trash2,
  User,
  BookOpen
} from 'lucide-react';
import { calculateAge } from '@/lib/utils';

interface ResultsTableProps {
  onAddResult: () => void;
}

const ResultsTable: React.FC<ResultsTableProps> = ({ onAddResult }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [subjectFilter, setSubjectFilter] = useState("all");

  const { data: results, isLoading } = useQuery<Result[]>({
    queryKey: ['/api/results'],
  });

  const { data: students } = useQuery<Student[]>({
    queryKey: ['/api/students'],
  });

  const { data: exams } = useQuery<Exam[]>({
    queryKey: ['/api/exams'],
  });

  const subjects = ["Arabic", "English", "Islamic", "Somali", "Math", "Science", "ICT", "Social"];

  const getStudentName = (studentId: number) => {
    const student = students?.find(s => s.id === studentId);
    return student ? `${student.firstName} ${student.lastName}` : `Student #${studentId}`;
  };

  const getExamName = (examId: number) => {
    const exam = exams?.find(e => e.id === examId);
    return exam ? exam.name : `Exam #${examId}`;
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'bg-gradient-to-r from-green-500 to-emerald-500 text-white';
      case 'B': return 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white';
      case 'C': return 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white';
      case 'D': return 'bg-gradient-to-r from-orange-500 to-red-500 text-white';
      case 'F': return 'bg-gradient-to-r from-red-500 to-rose-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  // Filter results based on search and filters
  const filteredResults = results?.filter(result => {
    const student = students?.find(s => s.id === result.studentId);
    const studentName = student ? `${student.firstName} ${student.lastName}` : '';
    const matchesSearch = searchTerm === '' || 
      studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student?.studentId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSubject = subjectFilter === 'all' || result.subject.toLowerCase() === subjectFilter.toLowerCase();
    const matchesStatus = statusFilter === 'all' || result.grade === statusFilter;
    
    return matchesSearch && matchesSubject && matchesStatus;
  }) || [];

  return (
    <div className="space-y-6">
      {/* Search and Filter Section */}
      <Card className="glass-morphism border-border/30 p-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by student name, ID, or subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 glass-morphism border-border/30 bg-background/50"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Select value={subjectFilter} onValueChange={setSubjectFilter}>
              <SelectTrigger className="w-40 glass-morphism border-border/30">
                <SelectValue placeholder="Subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                {subjects.map((subject) => (
                  <SelectItem key={subject} value={subject.toLowerCase()}>
                    {subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32 glass-morphism border-border/30">
                <SelectValue placeholder="Grade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Grades</SelectItem>
                <SelectItem value="A">Grade A</SelectItem>
                <SelectItem value="B">Grade B</SelectItem>
                <SelectItem value="C">Grade C</SelectItem>
                <SelectItem value="D">Grade D</SelectItem>
                <SelectItem value="F">Grade F</SelectItem>
              </SelectContent>
            </Select>
            
            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
              {filteredResults.length} results
            </Badge>
          </div>
        </div>
      </Card>

      {/* Results Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="glass-morphism border-border/30 animate-pulse">
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                  <div className="h-8 bg-muted rounded w-full"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredResults.length === 0 ? (
        <Card className="glass-morphism border-border/30">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mb-4">
              <Award className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No Results Found</h3>
            <p className="text-muted-foreground text-center mb-6">
              {searchTerm || statusFilter !== 'all' || subjectFilter !== 'all' 
                ? "No results match your current filters."
                : "No exam results have been recorded yet."
              }
            </p>
            <Button
              onClick={onAddResult}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add First Result
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResults.map((result) => {
            const student = students?.find(s => s.id === result.studentId);
            const exam = exams?.find(e => e.id === result.examId);
            const percentage = Math.round((result.score / result.total) * 100);
            const age = student?.dateOfBirth ? calculateAge(student.dateOfBirth) : null;
            
            return (
              <Card key={result.id} className="glass-morphism border-border/30 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group">
                <CardContent className="p-6 space-y-4">
                  {/* Student Header */}
                  <div className="flex items-center gap-3">
                    <Avatar className="h-14 w-14 ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all duration-300">
                      <AvatarImage src={student?.profilePhoto} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold text-lg">
                        {student ? `${student.firstName[0]}${student.lastName[0]}` : 'ST'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <p className="font-semibold text-lg truncate group-hover:text-primary transition-colors duration-300">
                          {getStudentName(result.studentId)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-sm text-muted-foreground">
                          {student?.studentId || `#${result.studentId}`}
                        </p>
                        {age && (
                          <Badge variant="outline" className="text-xs bg-blue-500/10 text-blue-600 border-blue-500/20">
                            Age {age}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Badge className={`${getGradeColor(result.grade)} text-lg px-3 py-1 font-bold shadow-lg`}>
                      {result.grade}
                    </Badge>
                  </div>

                  {/* Subject and Exam Info */}
                  <div className="bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-800 dark:to-slate-700 rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Subject</span>
                      </div>
                      <Badge variant="outline" className="bg-white/80 dark:bg-slate-700/80">
                        {result.subject}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Exam</span>
                      <span className="text-sm text-muted-foreground truncate max-w-[150px]">
                        {getExamName(result.examId)}
                      </span>
                    </div>

                    {/* Score Display */}
                    <div className="text-center pt-2">
                      <div className="text-3xl font-bold text-primary mb-1">
                        {result.score}<span className="text-xl text-muted-foreground">/{result.total}</span>
                      </div>
                      <div className="text-sm text-muted-foreground mb-2">
                        {percentage}% Score
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Footer with Date and Actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-border/30">
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(result.createdAt).toLocaleDateString()}
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:bg-blue-500/10 hover:text-blue-600">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:bg-amber-500/10 hover:text-amber-600">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:bg-red-500/10 hover:text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
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

export default ResultsTable;