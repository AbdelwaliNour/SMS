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
  insertResultSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // API Routes
  const apiRouter = app.route('/api');
  
  // Stats
  app.get('/api/stats', async (req: Request, res: Response) => {
    const stats = await storage.getStats();
    res.json(stats);
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

  const httpServer = createServer(app);
  return httpServer;
}
