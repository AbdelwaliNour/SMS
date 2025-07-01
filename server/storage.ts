import {
  users, User, InsertUser,
  students, Student, InsertStudent,
  employees, Employee, InsertEmployee,
  classrooms, Classroom, InsertClassroom,
  attendance, Attendance, InsertAttendance,
  payments, Payment, InsertPayment,
  exams, Exam, InsertExam,
  results, Result, InsertResult,
  schedules, Schedule, InsertSchedule
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Students
  getStudents(): Promise<Student[]>;
  getStudent(id: number): Promise<Student | undefined>;
  getStudentById(studentId: string): Promise<Student | undefined>;
  createStudent(student: InsertStudent): Promise<Student>;
  updateStudent(id: number, student: Partial<InsertStudent>): Promise<Student | undefined>;
  deleteStudent(id: number): Promise<boolean>;
  
  // Employees
  getEmployees(): Promise<Employee[]>;
  getEmployee(id: number): Promise<Employee | undefined>;
  getEmployeeById(employeeId: string): Promise<Employee | undefined>;
  createEmployee(employee: InsertEmployee): Promise<Employee>;
  updateEmployee(id: number, employee: Partial<InsertEmployee>): Promise<Employee | undefined>;
  deleteEmployee(id: number): Promise<boolean>;
  
  // Classrooms
  getClassrooms(): Promise<Classroom[]>;
  getClassroom(id: number): Promise<Classroom | undefined>;
  createClassroom(classroom: InsertClassroom): Promise<Classroom>;
  updateClassroom(id: number, classroom: Partial<InsertClassroom>): Promise<Classroom | undefined>;
  deleteClassroom(id: number): Promise<boolean>;
  
  // Attendance
  getAttendances(): Promise<Attendance[]>;
  getAttendance(id: number): Promise<Attendance | undefined>;
  getAttendanceByStudentId(studentId: number): Promise<Attendance[]>;
  createAttendance(attendance: InsertAttendance): Promise<Attendance>;
  updateAttendance(id: number, attendance: Partial<InsertAttendance>): Promise<Attendance | undefined>;
  
  // Payments
  getPayments(): Promise<Payment[]>;
  getPayment(id: number): Promise<Payment | undefined>;
  getPaymentsByStudentId(studentId: number): Promise<Payment[]>;
  createPayment(payment: InsertPayment): Promise<Payment>;
  updatePayment(id: number, payment: Partial<InsertPayment>): Promise<Payment | undefined>;
  
  // Exams
  getExams(): Promise<Exam[]>;
  getExam(id: number): Promise<Exam | undefined>;
  createExam(exam: InsertExam): Promise<Exam>;
  updateExam(id: number, exam: Partial<InsertExam>): Promise<Exam | undefined>;
  deleteExam(id: number): Promise<boolean>;
  
  // Results
  getResults(): Promise<Result[]>;
  getResult(id: number): Promise<Result | undefined>;
  getResultsByStudentId(studentId: number): Promise<Result[]>;
  getResultsByExamId(examId: number): Promise<Result[]>;
  createResult(result: InsertResult): Promise<Result>;
  updateResult(id: number, result: Partial<InsertResult>): Promise<Result | undefined>;
  deleteResult(id: number): Promise<boolean>;
  
  // Schedules
  getSchedules(): Promise<Schedule[]>;
  getSchedule(id: number): Promise<Schedule | undefined>;
  createSchedule(schedule: InsertSchedule): Promise<Schedule>;
  updateSchedule(id: number, schedule: Partial<InsertSchedule>): Promise<Schedule | undefined>;
  deleteSchedule(id: number): Promise<boolean>;
  
  // Stats
  getStats(): Promise<any>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private students: Map<number, Student>;
  private employees: Map<number, Employee>;
  private classrooms: Map<number, Classroom>;
  private attendance: Map<number, Attendance>;
  private payments: Map<number, Payment>;
  private exams: Map<number, Exam>;
  private results: Map<number, Result>;
  private schedules: Map<number, Schedule>;
  
  private userId: number;
  private studentId: number;
  private employeeId: number;
  private classroomId: number;
  private attendanceId: number;
  private paymentId: number;
  private examId: number;
  private resultId: number;
  private scheduleId: number;

  constructor() {
    this.users = new Map();
    this.students = new Map();
    this.employees = new Map();
    this.classrooms = new Map();
    this.attendance = new Map();
    this.payments = new Map();
    this.exams = new Map();
    this.results = new Map();
    this.schedules = new Map();
    
    this.userId = 1;
    this.studentId = 1;
    this.employeeId = 1;
    this.classroomId = 1;
    this.attendanceId = 1;
    this.paymentId = 1;
    this.examId = 1;
    this.resultId = 1;
    this.scheduleId = 1;
    
    // Seed initial data
    this.seedInitialData();
  }
  
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { ...insertUser, id, createdAt: new Date() };
    this.users.set(id, user);
    return user;
  }
  
  // Student methods
  async getStudents(): Promise<Student[]> {
    return Array.from(this.students.values());
  }
  
  async getStudent(id: number): Promise<Student | undefined> {
    return this.students.get(id);
  }
  
  async getStudentById(studentId: string): Promise<Student | undefined> {
    return Array.from(this.students.values()).find(
      (student) => student.studentId === studentId,
    );
  }
  
  async createStudent(insertStudent: InsertStudent): Promise<Student> {
    const id = this.studentId++;
    const student: Student = { ...insertStudent, id, createdAt: new Date() };
    this.students.set(id, student);
    return student;
  }
  
  async updateStudent(id: number, studentUpdate: Partial<InsertStudent>): Promise<Student | undefined> {
    const student = this.students.get(id);
    if (!student) return undefined;
    
    const updatedStudent = { ...student, ...studentUpdate };
    this.students.set(id, updatedStudent);
    return updatedStudent;
  }
  
  async deleteStudent(id: number): Promise<boolean> {
    return this.students.delete(id);
  }
  
  // Employee methods
  async getEmployees(): Promise<Employee[]> {
    return Array.from(this.employees.values());
  }
  
  async getEmployee(id: number): Promise<Employee | undefined> {
    return this.employees.get(id);
  }
  
  async getEmployeeById(employeeId: string): Promise<Employee | undefined> {
    return Array.from(this.employees.values()).find(
      (employee) => employee.employeeId === employeeId,
    );
  }
  
  async createEmployee(insertEmployee: InsertEmployee): Promise<Employee> {
    const id = this.employeeId++;
    const employee: Employee = { ...insertEmployee, id, createdAt: new Date() };
    this.employees.set(id, employee);
    return employee;
  }
  
  async updateEmployee(id: number, employeeUpdate: Partial<InsertEmployee>): Promise<Employee | undefined> {
    const employee = this.employees.get(id);
    if (!employee) return undefined;
    
    const updatedEmployee = { ...employee, ...employeeUpdate };
    this.employees.set(id, updatedEmployee);
    return updatedEmployee;
  }
  
  async deleteEmployee(id: number): Promise<boolean> {
    return this.employees.delete(id);
  }
  
  // Classroom methods
  async getClassrooms(): Promise<Classroom[]> {
    return Array.from(this.classrooms.values());
  }
  
  async getClassroom(id: number): Promise<Classroom | undefined> {
    return this.classrooms.get(id);
  }
  
  async createClassroom(insertClassroom: InsertClassroom): Promise<Classroom> {
    const id = this.classroomId++;
    const classroom: Classroom = { ...insertClassroom, id, createdAt: new Date() };
    this.classrooms.set(id, classroom);
    return classroom;
  }
  
  async updateClassroom(id: number, classroomUpdate: Partial<InsertClassroom>): Promise<Classroom | undefined> {
    const classroom = this.classrooms.get(id);
    if (!classroom) return undefined;
    
    const updatedClassroom = { ...classroom, ...classroomUpdate };
    this.classrooms.set(id, updatedClassroom);
    return updatedClassroom;
  }
  
  async deleteClassroom(id: number): Promise<boolean> {
    return this.classrooms.delete(id);
  }
  
  // Attendance methods
  async getAttendances(): Promise<Attendance[]> {
    return Array.from(this.attendance.values());
  }
  
  async getAttendance(id: number): Promise<Attendance | undefined> {
    return this.attendance.get(id);
  }
  
  async getAttendanceByStudentId(studentId: number): Promise<Attendance[]> {
    return Array.from(this.attendance.values()).filter(
      (attendance) => attendance.studentId === studentId,
    );
  }
  
  async createAttendance(insertAttendance: InsertAttendance): Promise<Attendance> {
    const id = this.attendanceId++;
    const attendance: Attendance = { ...insertAttendance, id, createdAt: new Date() };
    this.attendance.set(id, attendance);
    return attendance;
  }
  
  async updateAttendance(id: number, attendanceUpdate: Partial<InsertAttendance>): Promise<Attendance | undefined> {
    const attendance = this.attendance.get(id);
    if (!attendance) return undefined;
    
    const updatedAttendance = { ...attendance, ...attendanceUpdate };
    this.attendance.set(id, updatedAttendance);
    return updatedAttendance;
  }
  
  // Payment methods
  async getPayments(): Promise<Payment[]> {
    return Array.from(this.payments.values());
  }
  
  async getPayment(id: number): Promise<Payment | undefined> {
    return this.payments.get(id);
  }
  
  async getPaymentsByStudentId(studentId: number): Promise<Payment[]> {
    return Array.from(this.payments.values()).filter(
      (payment) => payment.studentId === studentId,
    );
  }
  
  async createPayment(insertPayment: InsertPayment): Promise<Payment> {
    const id = this.paymentId++;
    const payment: Payment = { ...insertPayment, id, createdAt: new Date() };
    this.payments.set(id, payment);
    return payment;
  }
  
  async updatePayment(id: number, paymentUpdate: Partial<InsertPayment>): Promise<Payment | undefined> {
    const payment = this.payments.get(id);
    if (!payment) return undefined;
    
    const updatedPayment = { ...payment, ...paymentUpdate };
    this.payments.set(id, updatedPayment);
    return updatedPayment;
  }
  
  // Exam methods
  async getExams(): Promise<Exam[]> {
    return Array.from(this.exams.values());
  }
  
  async getExam(id: number): Promise<Exam | undefined> {
    return this.exams.get(id);
  }
  
  async createExam(insertExam: InsertExam): Promise<Exam> {
    const id = this.examId++;
    const exam: Exam = { ...insertExam, id, createdAt: new Date() };
    this.exams.set(id, exam);
    return exam;
  }
  
  async updateExam(id: number, examUpdate: Partial<InsertExam>): Promise<Exam | undefined> {
    const exam = this.exams.get(id);
    if (!exam) return undefined;
    
    const updatedExam = { ...exam, ...examUpdate };
    this.exams.set(id, updatedExam);
    return updatedExam;
  }
  
  async deleteExam(id: number): Promise<boolean> {
    return this.exams.delete(id);
  }
  
  // Result methods
  async getResults(): Promise<Result[]> {
    return Array.from(this.results.values());
  }
  
  async getResult(id: number): Promise<Result | undefined> {
    return this.results.get(id);
  }
  
  async getResultsByStudentId(studentId: number): Promise<Result[]> {
    return Array.from(this.results.values()).filter(
      (result) => result.studentId === studentId,
    );
  }
  
  async getResultsByExamId(examId: number): Promise<Result[]> {
    return Array.from(this.results.values()).filter(
      (result) => result.examId === examId,
    );
  }
  
  async createResult(insertResult: InsertResult): Promise<Result> {
    const id = this.resultId++;
    const result: Result = { ...insertResult, id, createdAt: new Date() };
    this.results.set(id, result);
    return result;
  }
  
  async updateResult(id: number, resultUpdate: Partial<InsertResult>): Promise<Result | undefined> {
    const result = this.results.get(id);
    if (!result) return undefined;
    
    const updatedResult = { ...result, ...resultUpdate };
    this.results.set(id, updatedResult);
    return updatedResult;
  }
  
  async deleteResult(id: number): Promise<boolean> {
    return this.results.delete(id);
  }
  
  // Stats
  async getStats(): Promise<any> {
    const totalStudents = this.students.size;
    const maleStudents = Array.from(this.students.values()).filter(s => s.gender === 'male').length;
    const femaleStudents = totalStudents - maleStudents;
    
    const totalEmployees = this.employees.size;
    const teachers = Array.from(this.employees.values()).filter(e => e.role === 'teacher').length;
    const otherEmployees = totalEmployees - teachers;
    
    const presentStudents = 45; // Sample data
    const absentStudents = 5; // Sample data
    
    const totalClassrooms = this.classrooms.size;
    const totalShifts = 2; // Sample data
    
    const paidStudents = Array.from(this.payments.values()).filter(p => p.status === 'paid').length;
    const unpaidStudents = 50; // Sample data
    
    const totalSubjects = 10; // Sample data
    const examTypes = 2; // Sample data
    
    const sections = Array.from(new Set(Array.from(this.students.values()).map(s => s.section))).length;
    
    // Calculate financial stats
    const collectedAmount = Array.from(this.payments.values())
      .filter(p => p.status === 'paid')
      .reduce((sum, payment) => sum + payment.amount, 0);
    
    const uncollectedAmount = 1000; // Sample data
    
    // Calculate result stats
    const highestScore = 99.5;
    const lowestScore = 65.55;
    
    return {
      students: {
        total: totalStudents,
        male: maleStudents,
        female: femaleStudents,
        present: presentStudents,
        absent: absentStudents
      },
      classrooms: {
        total: totalClassrooms,
        sections: sections
      },
      employees: {
        total: totalEmployees,
        teachers: teachers,
        others: otherEmployees,
        shifts: totalShifts
      },
      finance: {
        paidStudents: paidStudents,
        unpaidStudents: unpaidStudents,
        collectedAmount: collectedAmount,
        uncollectedAmount: uncollectedAmount
      },
      exams: {
        subjects: totalSubjects,
        types: examTypes,
        highestScore: highestScore,
        lowestScore: lowestScore
      }
    };
  }

  // Schedule methods
  async getSchedules(): Promise<Schedule[]> {
    return Array.from(this.schedules.values());
  }

  async getSchedule(id: number): Promise<Schedule | undefined> {
    return this.schedules.get(id);
  }

  async createSchedule(insertSchedule: InsertSchedule): Promise<Schedule> {
    const id = this.scheduleId++;
    const schedule: Schedule = { ...insertSchedule, id, createdAt: new Date() };
    this.schedules.set(id, schedule);
    return schedule;
  }

  async updateSchedule(id: number, scheduleUpdate: Partial<InsertSchedule>): Promise<Schedule | undefined> {
    const schedule = this.schedules.get(id);
    if (!schedule) return undefined;
    
    const updatedSchedule = { ...schedule, ...scheduleUpdate };
    this.schedules.set(id, updatedSchedule);
    return updatedSchedule;
  }

  async deleteSchedule(id: number): Promise<boolean> {
    return this.schedules.delete(id);
  }
  
  // Seed initial data for testing
  private seedInitialData() {
    // Create admin user
    const admin: InsertUser = {
      username: 'admin',
      password: 'admin123',
      role: 'admin',
      fullName: 'System Admin',
      email: 'admin@school.com'
    };
    this.createUser(admin);
    
    // Create 10 students
    const sections = ['primary', 'secondary', 'highschool'];
    const classes = ['One', 'Two', 'Three', 'Four', 'Five', 'Six'];
    
    for (let i = 1; i <= 10; i++) {
      const gender = i % 3 === 0 ? 'female' : 'male';
      const section = sections[i % 3] as 'primary' | 'secondary' | 'highschool';
      const classLevel = classes[i % 6];
      
      const student: InsertStudent = {
        studentId: `1-Qar-Sh-${2023 + i}`,
        firstName: 'Student',
        middleName: '',
        lastName: `${i}`,
        gender,
        dateOfBirth: '2010-01-01',
        phone: `12345${i}`,
        email: `student${i}@school.com`,
        address: `${123 + i} Education Street, School District`,
        section,
        class: classLevel,
        fatherName: `Father ${i}`,
        fatherPhone: `98765${i}`,
        fatherEmail: `father${i}@email.com`,
        motherName: `Mother ${i}`,
        motherPhone: `45678${i}`,
        motherEmail: `mother${i}@email.com`
      };
      
      this.createStudent(student);
      
      // Create payments for each student
      const payment: InsertPayment = {
        studentId: i,
        amount: 500,
        date: new Date(),
        description: 'Monthly Fee',
        status: i % 3 === 0 ? 'unpaid' : 'paid'
      };
      
      this.createPayment(payment);
      
      // Create attendance for each student
      const attendance: InsertAttendance = {
        studentId: i,
        date: new Date(),
        status: i % 5 === 0 ? 'absent' : 'present',
        note: ''
      };
      
      this.createAttendance(attendance);
    }
    
    // Create employees
    const roles = ['teacher', 'driver', 'cleaner', 'guard', 'admin', 'staff'];
    const shifts = ['morning', 'afternoon', 'evening'];
    
    for (let i = 1; i <= 8; i++) {
      const role = roles[i % 6] as 'teacher' | 'driver' | 'cleaner' | 'guard' | 'admin' | 'staff';
      const shift = shifts[i % 3] as 'morning' | 'afternoon' | 'evening';
      const gender = i % 4 === 0 ? 'female' : 'male';
      const section = i < 5 ? 'primary' as const : (i < 8 ? 'secondary' as const : 'highschool' as const);
      
      const employee: InsertEmployee = {
        employeeId: `E-${1000 + i}`,
        firstName: 'Employee',
        middleName: '',
        lastName: `${i}`,
        gender,
        dateOfBirth: '1990-01-01',
        phone: `987${i}65432`,
        email: `employee${i}@school.com`,
        role,
        section,
        salary: 300,
        shift,
        subjects: role === 'teacher' ? ['Math', 'Science', 'English'] : []
      };
      
      this.createEmployee(employee);
    }
    
    // Create classrooms
    for (let i = 1; i <= 5; i++) {
      const section = i <= 2 ? 'primary' as const : (i <= 4 ? 'secondary' as const : 'highschool' as const);
      
      const classroom: InsertClassroom = {
        name: `Room ${100 + i}`,
        section,
        capacity: 30,
        teacherId: i
      };
      
      this.createClassroom(classroom);
    }
    
    // Create exams
    const subjects = ['Math', 'Science', 'English', 'Arabic', 'Islamic', 'Somali', 'History'];
    
    for (let i = 1; i <= 3; i++) {
      const section = i === 1 ? 'primary' as const : (i === 2 ? 'secondary' as const : 'highschool' as const);
      const classLevel = classes[i % 6];
      
      const exam: InsertExam = {
        name: `Final Exam ${i}`,
        section,
        class: classLevel,
        date: new Date(),
        subjects: subjects.slice(0, 5)
      };
      
      this.createExam(exam);
      
      // Create results for exam
      for (let j = 1; j <= 8; j++) {
        if (j % 2 === 0) continue; // Only create for some students
        
        for (let k = 0; k < 5; k++) {
          const result: InsertResult = {
            examId: i,
            studentId: j,
            subject: subjects[k],
            score: 90 + (j % 10),
            total: 100,
            grade: 'A'
          };
          
          this.createResult(result);
        }
      }
    }
  }
}

// Use DatabaseStorage instead of MemStorage
import { DatabaseStorage } from './database-storage';
export const storage = new DatabaseStorage();
