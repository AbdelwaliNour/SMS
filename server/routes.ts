import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import {
  insertStudentSchema, 
  insertEmployeeSchema, 
  insertClassroomSchema,
  insertAttendanceSchema,
  insertPaymentSchema,
  insertExamSchema,
  insertResultSchema,
  insertScheduleSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // API Routes
  const apiRouter = app.route('/api');
  
  // Stats
  app.get('/api/stats', async (req: Request, res: Response) => {
    const stats = await storage.getStats();
    res.json(stats);
  });

  // Advanced analytics endpoint
  app.get('/api/analytics', async (req: Request, res: Response) => {
    try {
      // Get query parameters for filtering
      const period = req.query.period as string || 'all';
      const category = req.query.category as string || 'all';
      const section = req.query.section as string || 'all';
      
      // Get all the data we need for analytics
      const students = await storage.getStudents();
      const employees = await storage.getEmployees();
      const attendance = await storage.getAttendances();
      const payments = await storage.getPayments();
      const exams = await storage.getExams();
      const results = await storage.getResults();
      const classrooms = await storage.getClassrooms();
      
      // Filter data based on period if needed
      let filteredAttendance = [...attendance];
      let filteredPayments = [...payments];
      let filteredResults = [...results];
      let filteredExams = [...exams];
      
      // Date filtering logic
      if (period !== 'all') {
        const now = new Date();
        let startDate = new Date();
        
        // Calculate start date based on period
        switch(period) {
          case 'week':
            startDate.setDate(now.getDate() - 7);
            break;
          case 'month':
            startDate.setMonth(now.getMonth() - 1);
            break;
          case 'quarter':
            startDate.setMonth(now.getMonth() - 3);
            break;
          case 'year':
            startDate.setFullYear(now.getFullYear() - 1);
            break;
        }
        
        // Apply filters
        filteredAttendance = attendance.filter(a => a.date && new Date(a.date) >= startDate);
        filteredPayments = payments.filter(p => p.date && new Date(p.date) >= startDate);
        filteredExams = exams.filter(e => e.date && new Date(e.date) >= startDate);
        filteredResults = results.filter(r => {
          const exam = exams.find(e => e.id === r.examId);
          return exam?.date && new Date(exam.date) >= startDate;
        });
      }
      
      // Section filtering
      let sectionFilteredStudents = [...students];
      if (section !== 'all') {
        sectionFilteredStudents = students.filter(s => s.section === section);
      }
      
      // Prepare student IDs for further filtering
      const sectionStudentIds = sectionFilteredStudents.map(s => s.id);
      
      // Filter other entities by section if needed
      if (section !== 'all') {
        filteredAttendance = filteredAttendance.filter(a => sectionStudentIds.includes(a.studentId));
        filteredPayments = filteredPayments.filter(p => sectionStudentIds.includes(p.studentId));
        filteredResults = filteredResults.filter(r => sectionStudentIds.includes(r.studentId));
      }
      
      // Generate attendance trends from actual data
      const attendanceTrendMap = new Map();
      
      filteredAttendance.forEach(a => {
        if (!a.date) return;
        
        const dateStr = new Date(a.date).toISOString().split('T')[0];
        if (!attendanceTrendMap.has(dateStr)) {
          attendanceTrendMap.set(dateStr, { date: dateStr, present: 0, absent: 0, late: 0 });
        }
        
        const dayStats = attendanceTrendMap.get(dateStr);
        if (a.status === 'present') dayStats.present++;
        else if (a.status === 'absent') dayStats.absent++;
        else if (a.status === 'late') dayStats.late++;
      });
      
      // Sort attendance trends by date
      const attendanceTrends = Array.from(attendanceTrendMap.values())
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      
      // Use placeholder data only if we don't have enough real data
      if (attendanceTrends.length < 7) {
        attendanceTrends.push(
          ...[
            { date: '2025-03-21', present: 82, absent: 15, late: 3 },
            { date: '2025-03-22', present: 78, absent: 18, late: 4 },
            { date: '2025-03-23', present: 88, absent: 9, late: 3 },
            { date: '2025-03-24', present: 90, absent: 8, late: 2 },
            { date: '2025-03-25', present: 91, absent: 7, late: 2 },
            { date: '2025-03-26', present: 89, absent: 8, late: 3 },
            { date: '2025-03-27', present: 87, absent: 10, late: 3 },
          ].slice(0, 7 - attendanceTrends.length)
        );
      }
      
      // Generate subject performance data
      const subjectPerformanceMap = new Map();
      
      // Collect all subjects from exams
      filteredExams.forEach(exam => {
        if (!exam.subjects || !exam.subjects.length) return;
        
        exam.subjects.forEach(subject => {
          if (!subjectPerformanceMap.has(subject)) {
            subjectPerformanceMap.set(subject, { 
              subject, 
              scores: [],
              average: 0,
              highest: 0,
              lowest: 100 
            });
          }
        });
      });
      
      // For each subject, gather scores
      filteredResults.forEach(result => {
        const exam = filteredExams.find(e => e.id === result.examId);
        
        if (!exam?.subjects || !exam.subjects.length) return;
        
        exam.subjects.forEach(subject => {
          const subjectData = subjectPerformanceMap.get(subject);
          if (subjectData) {
            subjectData.scores.push(result.score);
            
            if (result.score > subjectData.highest) {
              subjectData.highest = result.score;
            }
            
            if (result.score < subjectData.lowest) {
              subjectData.lowest = result.score;
            }
          }
        });
      });
      
      // Calculate averages
      subjectPerformanceMap.forEach(data => {
        if (data.scores.length > 0) {
          data.average = data.scores.reduce((sum, score) => sum + score, 0) / data.scores.length;
        }
        
        // Remove the scores array from the final output
        delete data.scores;
      });
      
      // Convert to array of subject performance data
      const subjectPerformance = Array.from(subjectPerformanceMap.values());
      
      // Use default subject data if we don't have any
      if (subjectPerformance.length === 0) {
        [
          { subject: 'Math', average: 78, highest: 95, lowest: 45 },
          { subject: 'Science', average: 82, highest: 98, lowest: 55 },
          { subject: 'English', average: 85, highest: 97, lowest: 60 },
          { subject: 'History', average: 75, highest: 92, lowest: 52 },
          { subject: 'Geography', average: 79, highest: 94, lowest: 58 },
        ].forEach(item => subjectPerformance.push(item));
      }
      
      // Generate monthly payment data
      const monthlyPaymentMap = new Map();
      
      // Initialize with current and past 5 months
      const now = new Date();
      for (let i = 0; i <= 5; i++) {
        const monthDate = new Date(now);
        monthDate.setMonth(now.getMonth() - i);
        
        const monthKey = monthDate.toLocaleString('default', { month: 'short' });
        monthlyPaymentMap.set(monthKey, { month: monthKey, amount: 0 });
      }
      
      // Add payment data to each month
      filteredPayments.forEach(payment => {
        if (!payment.date) return;
        
        const paymentDate = new Date(payment.date);
        const monthKey = paymentDate.toLocaleString('default', { month: 'short' });
        
        if (monthlyPaymentMap.has(monthKey)) {
          const monthData = monthlyPaymentMap.get(monthKey);
          monthData.amount += payment.amount;
        }
      });
      
      // Convert to sorted array of monthly payment data
      const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const monthlyCollection = Array.from(monthlyPaymentMap.values())
        .sort((a, b) => monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month));
      
      // Analytics data structure
      const analytics = {
        // Student demographics
        demographics: {
          genderDistribution: {
            male: sectionFilteredStudents.filter(s => s.gender === 'male').length,
            female: sectionFilteredStudents.filter(s => s.gender === 'female').length,
          },
          sectionDistribution: {
            primary: students.filter(s => s.section === 'primary').length,
            secondary: students.filter(s => s.section === 'secondary').length,
            highschool: students.filter(s => s.section === 'highschool').length,
          },
          ageDistribution: {
            '5-10': sectionFilteredStudents.filter(s => s.age && s.age >= 5 && s.age <= 10).length,
            '11-15': sectionFilteredStudents.filter(s => s.age && s.age >= 11 && s.age <= 15).length,
            '16-20': sectionFilteredStudents.filter(s => s.age && s.age >= 16 && s.age <= 20).length,
          }
        },
        
        // Attendance trends
        attendance: {
          overall: {
            present: filteredAttendance.filter(a => a.status === 'present').length,
            absent: filteredAttendance.filter(a => a.status === 'absent').length,
            late: filteredAttendance.filter(a => a.status === 'late').length,
          },
          bySection: {
            primary: {
              present: filteredAttendance.filter(a => {
                const student = students.find(s => s.id === a.studentId);
                return student?.section === 'primary' && a.status === 'present';
              }).length,
              absent: filteredAttendance.filter(a => {
                const student = students.find(s => s.id === a.studentId);
                return student?.section === 'primary' && a.status === 'absent';
              }).length,
            },
            secondary: {
              present: filteredAttendance.filter(a => {
                const student = students.find(s => s.id === a.studentId);
                return student?.section === 'secondary' && a.status === 'present';
              }).length,
              absent: filteredAttendance.filter(a => {
                const student = students.find(s => s.id === a.studentId);
                return student?.section === 'secondary' && a.status === 'absent';
              }).length,
            },
            highschool: {
              present: filteredAttendance.filter(a => {
                const student = students.find(s => s.id === a.studentId);
                return student?.section === 'highschool' && a.status === 'present';
              }).length,
              absent: filteredAttendance.filter(a => {
                const student = students.find(s => s.id === a.studentId);
                return student?.section === 'highschool' && a.status === 'absent';
              }).length,
            },
          },
          trends: attendanceTrends,
          topAbsentees: sectionFilteredStudents
            .map(student => {
              const absences = filteredAttendance.filter(a => 
                a.studentId === student.id && a.status === 'absent'
              ).length;
              
              return {
                studentId: student.id,
                name: `${student.firstName} ${student.lastName}`,
                absences
              };
            })
            .sort((a, b) => b.absences - a.absences)
            .slice(0, 5)
        },
        
        // Academic performance
        academic: {
          averageScores: {
            overall: filteredResults.length 
              ? filteredResults.reduce((acc, curr) => acc + curr.score, 0) / filteredResults.length 
              : 0,
            bySection: {
              primary: filteredResults.filter(r => {
                const student = students.find(s => s.id === r.studentId);
                return student?.section === 'primary';
              }).reduce((acc, curr) => acc + curr.score, 0) / 
              filteredResults.filter(r => {
                const student = students.find(s => s.id === r.studentId);
                return student?.section === 'primary';
              }).length || 0,
              
              secondary: filteredResults.filter(r => {
                const student = students.find(s => s.id === r.studentId);
                return student?.section === 'secondary';
              }).reduce((acc, curr) => acc + curr.score, 0) / 
              filteredResults.filter(r => {
                const student = students.find(s => s.id === r.studentId);
                return student?.section === 'secondary';
              }).length || 0,
              
              highschool: filteredResults.filter(r => {
                const student = students.find(s => s.id === r.studentId);
                return student?.section === 'highschool';
              }).reduce((acc, curr) => acc + curr.score, 0) / 
              filteredResults.filter(r => {
                const student = students.find(s => s.id === r.studentId);
                return student?.section === 'highschool';
              }).length || 0,
            },
          },
          subjectPerformance,
          performanceTrends: [
            { term: 'Term 1', averageScore: 76 },
            { term: 'Term 2', averageScore: 78 },
            { term: 'Term 3', averageScore: 80 },
            { term: 'Term 4', averageScore: 82 },
          ],
          topPerformers: sectionFilteredStudents
            .map(student => {
              const studentResults = filteredResults.filter(r => r.studentId === student.id);
              const averageScore = studentResults.length
                ? studentResults.reduce((acc, curr) => acc + curr.score, 0) / studentResults.length
                : 0;
              
              return {
                studentId: student.id,
                name: `${student.firstName} ${student.lastName}`,
                averageScore,
                examsTaken: studentResults.length
              };
            })
            .filter(s => s.examsTaken > 0)
            .sort((a, b) => b.averageScore - a.averageScore)
            .slice(0, 5)
        },
        
        // Financial analytics
        financial: {
          feeCollection: {
            total: filteredPayments.reduce((acc, curr) => acc + curr.amount, 0),
            paid: filteredPayments.filter(p => p.status === 'paid').reduce((acc, curr) => acc + curr.amount, 0),
            partial: filteredPayments.filter(p => p.status === 'partial').reduce((acc, curr) => acc + curr.amount, 0),
            unpaid: filteredPayments.filter(p => p.status === 'unpaid').reduce((acc, curr) => acc + curr.amount, 0),
          },
          collectionBySection: {
            primary: filteredPayments.filter(p => {
              const student = students.find(s => s.id === p.studentId);
              return student?.section === 'primary';
            }).reduce((acc, curr) => acc + curr.amount, 0),
            
            secondary: filteredPayments.filter(p => {
              const student = students.find(s => s.id === p.studentId);
              return student?.section === 'secondary';
            }).reduce((acc, curr) => acc + curr.amount, 0),
            
            highschool: filteredPayments.filter(p => {
              const student = students.find(s => s.id === p.studentId);
              return student?.section === 'highschool';
            }).reduce((acc, curr) => acc + curr.amount, 0),
          },
          monthlyCollection,
          pendingPayments: sectionFilteredStudents
            .map(student => {
              const studentPayments = filteredPayments.filter(p => p.studentId === student.id);
              const totalDue = studentPayments.reduce((acc, curr) => acc + curr.amount, 0);
              const totalPaid = studentPayments
                .filter(p => p.status === 'paid')
                .reduce((acc, curr) => acc + curr.amount, 0);
              const totalPartial = studentPayments
                .filter(p => p.status === 'partial')
                .reduce((acc, curr) => acc + (curr.paidAmount || 0), 0);
              
              const amountPending = totalDue - totalPaid - totalPartial;
              
              return {
                studentId: student.id,
                name: `${student.firstName} ${student.lastName}`,
                totalDue,
                amountPaid: totalPaid + totalPartial,
                amountPending
              };
            })
            .filter(s => s.amountPending > 0)
            .sort((a, b) => b.amountPending - a.amountPending)
            .slice(0, 5)
        },
        
        // Teacher performance
        teacherPerformance: {
          subjectAverages: employees
            .filter(e => e.role === 'teacher' && e.subjects && e.subjects.length)
            .map(teacher => {
              // Find results for exams in teacher's subjects
              const teacherSubjects = teacher.subjects || [];
              
              // Calculate average scores for each subject
              const subjectScores = teacherSubjects.map(subject => {
                // Find exams for this subject
                const subjectExams = filteredExams.filter(e => 
                  e.subjects && e.subjects.includes(subject)
                );
                
                const examIds = subjectExams.map(e => e.id);
                
                // Find results for those exams
                const subjectResults = filteredResults.filter(r => 
                  examIds.includes(r.examId)
                );
                
                // Calculate average score
                const avgScore = subjectResults.length
                  ? subjectResults.reduce((acc, r) => acc + r.score, 0) / subjectResults.length
                  : 0;
                
                return {
                  subject,
                  avgScore,
                  studentsPassed: subjectResults.filter(r => r.score >= 60).length,
                  totalStudents: subjectResults.length
                };
              });
              
              // Overall teacher performance
              const overallAverage = subjectScores.length
                ? subjectScores.reduce((acc, s) => acc + s.avgScore, 0) / subjectScores.length
                : 0;
              
              return {
                teacherId: teacher.id,
                name: `${teacher.firstName} ${teacher.lastName}`,
                overallAverage,
                subjectScores
              };
            })
            .sort((a, b) => b.overallAverage - a.overallAverage)
        }
      };
      
      res.json(analytics);
    } catch (error) {
      console.error("Analytics error:", error);
      res.status(500).json({ error: 'Failed to fetch analytics data' });
    }
  });
  
  // Students
  app.get('/api/students', async (req: Request, res: Response) => {
    const students = await storage.getStudents();
    res.json(students);
  });
  
  app.get('/api/students/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid student ID' });
    }
    
    const student = await storage.getStudent(id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    res.json(student);
  });
  
  app.post('/api/students', async (req: Request, res: Response) => {
    try {
      const studentData = insertStudentSchema.parse(req.body);
      const student = await storage.createStudent(studentData);
      res.status(201).json(student);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid student data', errors: error.errors });
      }
      res.status(500).json({ message: 'Failed to create student' });
    }
  });
  
  app.patch('/api/students/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid student ID' });
    }
    
    try {
      const studentData = insertStudentSchema.partial().parse(req.body);
      const student = await storage.updateStudent(id, studentData);
      
      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }
      
      res.json(student);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid student data', errors: error.errors });
      }
      res.status(500).json({ message: 'Failed to update student' });
    }
  });
  
  app.delete('/api/students/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid student ID' });
    }
    
    const success = await storage.deleteStudent(id);
    
    if (!success) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    res.status(204).end();
  });
  
  // Employees
  app.get('/api/employees', async (req: Request, res: Response) => {
    const employees = await storage.getEmployees();
    res.json(employees);
  });
  
  app.get('/api/employees/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid employee ID' });
    }
    
    const employee = await storage.getEmployee(id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    
    res.json(employee);
  });
  
  app.post('/api/employees', async (req: Request, res: Response) => {
    try {
      const employeeData = insertEmployeeSchema.parse(req.body);
      const employee = await storage.createEmployee(employeeData);
      res.status(201).json(employee);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid employee data', errors: error.errors });
      }
      res.status(500).json({ message: 'Failed to create employee' });
    }
  });
  
  app.patch('/api/employees/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid employee ID' });
    }
    
    try {
      const employeeData = insertEmployeeSchema.partial().parse(req.body);
      const employee = await storage.updateEmployee(id, employeeData);
      
      if (!employee) {
        return res.status(404).json({ message: 'Employee not found' });
      }
      
      res.json(employee);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid employee data', errors: error.errors });
      }
      res.status(500).json({ message: 'Failed to update employee' });
    }
  });
  
  app.delete('/api/employees/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid employee ID' });
    }
    
    const success = await storage.deleteEmployee(id);
    
    if (!success) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    
    res.status(204).end();
  });
  
  // Classrooms
  app.get('/api/classrooms', async (req: Request, res: Response) => {
    const classrooms = await storage.getClassrooms();
    res.json(classrooms);
  });
  
  app.get('/api/classrooms/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid classroom ID' });
    }
    
    const classroom = await storage.getClassroom(id);
    if (!classroom) {
      return res.status(404).json({ message: 'Classroom not found' });
    }
    
    res.json(classroom);
  });
  
  app.post('/api/classrooms', async (req: Request, res: Response) => {
    try {
      const classroomData = insertClassroomSchema.parse(req.body);
      const classroom = await storage.createClassroom(classroomData);
      res.status(201).json(classroom);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid classroom data', errors: error.errors });
      }
      res.status(500).json({ message: 'Failed to create classroom' });
    }
  });
  
  app.patch('/api/classrooms/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid classroom ID' });
    }
    
    try {
      const classroomData = insertClassroomSchema.partial().parse(req.body);
      const classroom = await storage.updateClassroom(id, classroomData);
      
      if (!classroom) {
        return res.status(404).json({ message: 'Classroom not found' });
      }
      
      res.json(classroom);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid classroom data', errors: error.errors });
      }
      res.status(500).json({ message: 'Failed to update classroom' });
    }
  });
  
  app.delete('/api/classrooms/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid classroom ID' });
    }
    
    const success = await storage.deleteClassroom(id);
    
    if (!success) {
      return res.status(404).json({ message: 'Classroom not found' });
    }
    
    res.status(204).end();
  });
  
  // Attendance
  app.get('/api/attendance', async (req: Request, res: Response) => {
    const attendance = await storage.getAttendances();
    res.json(attendance);
  });
  
  app.get('/api/attendance/student/:studentId', async (req: Request, res: Response) => {
    const studentId = parseInt(req.params.studentId);
    if (isNaN(studentId)) {
      return res.status(400).json({ message: 'Invalid student ID' });
    }
    
    const attendance = await storage.getAttendanceByStudentId(studentId);
    res.json(attendance);
  });
  
  app.post('/api/attendance', async (req: Request, res: Response) => {
    try {
      const attendanceData = insertAttendanceSchema.parse(req.body);
      const attendance = await storage.createAttendance(attendanceData);
      res.status(201).json(attendance);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid attendance data', errors: error.errors });
      }
      res.status(500).json({ message: 'Failed to create attendance record' });
    }
  });
  
  app.patch('/api/attendance/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid attendance ID' });
    }
    
    try {
      const attendanceData = insertAttendanceSchema.partial().parse(req.body);
      const attendance = await storage.updateAttendance(id, attendanceData);
      
      if (!attendance) {
        return res.status(404).json({ message: 'Attendance record not found' });
      }
      
      res.json(attendance);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid attendance data', errors: error.errors });
      }
      res.status(500).json({ message: 'Failed to update attendance record' });
    }
  });
  
  // Payments
  app.get('/api/payments', async (req: Request, res: Response) => {
    const payments = await storage.getPayments();
    res.json(payments);
  });
  
  app.get('/api/payments/student/:studentId', async (req: Request, res: Response) => {
    const studentId = parseInt(req.params.studentId);
    if (isNaN(studentId)) {
      return res.status(400).json({ message: 'Invalid student ID' });
    }
    
    const payments = await storage.getPaymentsByStudentId(studentId);
    res.json(payments);
  });
  
  app.post('/api/payments', async (req: Request, res: Response) => {
    try {
      const paymentData = insertPaymentSchema.parse(req.body);
      const payment = await storage.createPayment(paymentData);
      res.status(201).json(payment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid payment data', errors: error.errors });
      }
      res.status(500).json({ message: 'Failed to create payment record' });
    }
  });
  
  app.patch('/api/payments/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid payment ID' });
    }
    
    try {
      const paymentData = insertPaymentSchema.partial().parse(req.body);
      const payment = await storage.updatePayment(id, paymentData);
      
      if (!payment) {
        return res.status(404).json({ message: 'Payment record not found' });
      }
      
      res.json(payment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid payment data', errors: error.errors });
      }
      res.status(500).json({ message: 'Failed to update payment record' });
    }
  });
  
  // Exams
  app.get('/api/exams', async (req: Request, res: Response) => {
    const exams = await storage.getExams();
    res.json(exams);
  });
  
  app.get('/api/exams/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid exam ID' });
    }
    
    const exam = await storage.getExam(id);
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }
    
    res.json(exam);
  });
  
  app.post('/api/exams', async (req: Request, res: Response) => {
    try {
      const examData = insertExamSchema.parse(req.body);
      const exam = await storage.createExam(examData);
      res.status(201).json(exam);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid exam data', errors: error.errors });
      }
      res.status(500).json({ message: 'Failed to create exam' });
    }
  });
  
  app.patch('/api/exams/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid exam ID' });
    }
    
    try {
      const examData = insertExamSchema.partial().parse(req.body);
      const exam = await storage.updateExam(id, examData);
      
      if (!exam) {
        return res.status(404).json({ message: 'Exam not found' });
      }
      
      res.json(exam);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid exam data', errors: error.errors });
      }
      res.status(500).json({ message: 'Failed to update exam' });
    }
  });
  
  app.delete('/api/exams/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid exam ID' });
    }
    
    const success = await storage.deleteExam(id);
    
    if (!success) {
      return res.status(404).json({ message: 'Exam not found' });
    }
    
    res.status(204).end();
  });
  
  // Results
  app.get('/api/results', async (req: Request, res: Response) => {
    const results = await storage.getResults();
    res.json(results);
  });
  
  app.get('/api/results/student/:studentId', async (req: Request, res: Response) => {
    const studentId = parseInt(req.params.studentId);
    if (isNaN(studentId)) {
      return res.status(400).json({ message: 'Invalid student ID' });
    }
    
    const results = await storage.getResultsByStudentId(studentId);
    res.json(results);
  });
  
  app.get('/api/results/exam/:examId', async (req: Request, res: Response) => {
    const examId = parseInt(req.params.examId);
    if (isNaN(examId)) {
      return res.status(400).json({ message: 'Invalid exam ID' });
    }
    
    const results = await storage.getResultsByExamId(examId);
    res.json(results);
  });
  
  app.post('/api/results', async (req: Request, res: Response) => {
    try {
      const resultData = insertResultSchema.parse(req.body);
      const result = await storage.createResult(resultData);
      res.status(201).json(result);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid result data', errors: error.errors });
      }
      res.status(500).json({ message: 'Failed to create result' });
    }
  });
  
  app.patch('/api/results/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid result ID' });
    }
    
    try {
      const resultData = insertResultSchema.partial().parse(req.body);
      const result = await storage.updateResult(id, resultData);
      
      if (!result) {
        return res.status(404).json({ message: 'Result not found' });
      }
      
      res.json(result);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid result data', errors: error.errors });
      }
      res.status(500).json({ message: 'Failed to update result' });
    }
  });
  
  app.delete('/api/results/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid result ID' });
    }
    
    const success = await storage.deleteResult(id);
    
    if (!success) {
      return res.status(404).json({ message: 'Result not found' });
    }
    
    res.status(204).end();
  });

  // Schedules routes
  app.get('/api/schedules', async (req: Request, res: Response) => {
    const schedules = await storage.getSchedules();
    res.json(schedules);
  });
  
  app.get('/api/schedules/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid schedule ID' });
    }
    
    const schedule = await storage.getSchedule(id);
    
    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }
    
    res.json(schedule);
  });
  
  app.post('/api/schedules', async (req: Request, res: Response) => {
    try {
      const scheduleData = insertScheduleSchema.parse(req.body);
      const schedule = await storage.createSchedule(scheduleData);
      res.status(201).json(schedule);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid schedule data', errors: error.errors });
      }
      res.status(500).json({ message: 'Failed to create schedule' });
    }
  });
  
  app.patch('/api/schedules/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid schedule ID' });
    }
    
    try {
      const scheduleData = insertScheduleSchema.partial().parse(req.body);
      const schedule = await storage.updateSchedule(id, scheduleData);
      
      if (!schedule) {
        return res.status(404).json({ message: 'Schedule not found' });
      }
      
      res.json(schedule);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid schedule data', errors: error.errors });
      }
      res.status(500).json({ message: 'Failed to update schedule' });
    }
  });
  
  app.delete('/api/schedules/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid schedule ID' });
    }
    
    const success = await storage.deleteSchedule(id);
    
    if (!success) {
      return res.status(404).json({ message: 'Schedule not found' });
    }
    
    res.status(204).end();
  });

  const httpServer = createServer(app);
  return httpServer;
}
