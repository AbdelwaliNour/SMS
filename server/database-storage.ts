import { IStorage } from './storage';
import { 
  User, InsertUser, Student, InsertStudent, 
  Employee, InsertEmployee, Classroom, InsertClassroom, 
  Attendance, InsertAttendance, Payment, InsertPayment, 
  Exam, InsertExam, Result, InsertResult,
  users, students, employees, classrooms, attendance, payments, exams, results
} from '@shared/schema';
import { db } from './db';
import { eq, and, desc } from 'drizzle-orm';

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }
  
  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }
  
  // Students
  async getStudents(): Promise<Student[]> {
    return await db.select().from(students).orderBy(desc(students.id));
  }
  
  async getStudent(id: number): Promise<Student | undefined> {
    const [student] = await db.select().from(students).where(eq(students.id, id));
    return student || undefined;
  }
  
  async getStudentById(studentId: string): Promise<Student | undefined> {
    const [student] = await db.select().from(students).where(eq(students.studentId, studentId));
    return student || undefined;
  }
  
  async createStudent(student: InsertStudent): Promise<Student> {
    const [newStudent] = await db.insert(students).values(student).returning();
    return newStudent;
  }
  
  async updateStudent(id: number, studentUpdate: Partial<InsertStudent>): Promise<Student | undefined> {
    const [updatedStudent] = await db
      .update(students)
      .set(studentUpdate)
      .where(eq(students.id, id))
      .returning();
    return updatedStudent || undefined;
  }
  
  async deleteStudent(id: number): Promise<boolean> {
    const [deletedStudent] = await db.delete(students).where(eq(students.id, id)).returning({ id: students.id });
    return !!deletedStudent;
  }
  
  // Employees
  async getEmployees(): Promise<Employee[]> {
    return await db.select().from(employees).orderBy(desc(employees.id));
  }
  
  async getEmployee(id: number): Promise<Employee | undefined> {
    const [employee] = await db.select().from(employees).where(eq(employees.id, id));
    return employee || undefined;
  }
  
  async getEmployeeById(employeeId: string): Promise<Employee | undefined> {
    const [employee] = await db.select().from(employees).where(eq(employees.employeeId, employeeId));
    return employee || undefined;
  }
  
  async createEmployee(employee: InsertEmployee): Promise<Employee> {
    const [newEmployee] = await db.insert(employees).values(employee).returning();
    return newEmployee;
  }
  
  async updateEmployee(id: number, employeeUpdate: Partial<InsertEmployee>): Promise<Employee | undefined> {
    const [updatedEmployee] = await db
      .update(employees)
      .set(employeeUpdate)
      .where(eq(employees.id, id))
      .returning();
    return updatedEmployee || undefined;
  }
  
  async deleteEmployee(id: number): Promise<boolean> {
    const [deletedEmployee] = await db.delete(employees).where(eq(employees.id, id)).returning({ id: employees.id });
    return !!deletedEmployee;
  }
  
  // Classrooms
  async getClassrooms(): Promise<Classroom[]> {
    return await db.select().from(classrooms).orderBy(desc(classrooms.id));
  }
  
  async getClassroom(id: number): Promise<Classroom | undefined> {
    const [classroom] = await db.select().from(classrooms).where(eq(classrooms.id, id));
    return classroom || undefined;
  }
  
  async createClassroom(classroom: InsertClassroom): Promise<Classroom> {
    const [newClassroom] = await db.insert(classrooms).values(classroom).returning();
    return newClassroom;
  }
  
  async updateClassroom(id: number, classroomUpdate: Partial<InsertClassroom>): Promise<Classroom | undefined> {
    const [updatedClassroom] = await db
      .update(classrooms)
      .set(classroomUpdate)
      .where(eq(classrooms.id, id))
      .returning();
    return updatedClassroom || undefined;
  }
  
  async deleteClassroom(id: number): Promise<boolean> {
    const [deletedClassroom] = await db.delete(classrooms).where(eq(classrooms.id, id)).returning({ id: classrooms.id });
    return !!deletedClassroom;
  }
  
  // Attendance
  async getAttendances(): Promise<Attendance[]> {
    return await db.select().from(attendance).orderBy(desc(attendance.id));
  }
  
  async getAttendance(id: number): Promise<Attendance | undefined> {
    const [result] = await db.select().from(attendance).where(eq(attendance.id, id));
    return result || undefined;
  }
  
  async getAttendanceByStudentId(studentId: number): Promise<Attendance[]> {
    return await db
      .select()
      .from(attendance)
      .where(eq(attendance.studentId, studentId))
      .orderBy(desc(attendance.date));
  }
  
  async createAttendance(attendanceData: InsertAttendance): Promise<Attendance> {
    const [newAttendance] = await db.insert(attendance).values(attendanceData).returning();
    return newAttendance;
  }
  
  async updateAttendance(id: number, attendanceUpdate: Partial<InsertAttendance>): Promise<Attendance | undefined> {
    const [updatedAttendance] = await db
      .update(attendance)
      .set(attendanceUpdate)
      .where(eq(attendance.id, id))
      .returning();
    return updatedAttendance || undefined;
  }
  
  // Payments
  async getPayments(): Promise<Payment[]> {
    return await db.select().from(payments).orderBy(desc(payments.id));
  }
  
  async getPayment(id: number): Promise<Payment | undefined> {
    const [payment] = await db.select().from(payments).where(eq(payments.id, id));
    return payment || undefined;
  }
  
  async getPaymentsByStudentId(studentId: number): Promise<Payment[]> {
    return await db
      .select()
      .from(payments)
      .where(eq(payments.studentId, studentId))
      .orderBy(desc(payments.date));
  }
  
  async createPayment(payment: InsertPayment): Promise<Payment> {
    const [newPayment] = await db.insert(payments).values(payment).returning();
    return newPayment;
  }
  
  async updatePayment(id: number, paymentUpdate: Partial<InsertPayment>): Promise<Payment | undefined> {
    const [updatedPayment] = await db
      .update(payments)
      .set(paymentUpdate)
      .where(eq(payments.id, id))
      .returning();
    return updatedPayment || undefined;
  }
  
  // Exams
  async getExams(): Promise<Exam[]> {
    return await db.select().from(exams).orderBy(desc(exams.id));
  }
  
  async getExam(id: number): Promise<Exam | undefined> {
    const [exam] = await db.select().from(exams).where(eq(exams.id, id));
    return exam || undefined;
  }
  
  async createExam(exam: InsertExam): Promise<Exam> {
    const [newExam] = await db.insert(exams).values(exam).returning();
    return newExam;
  }
  
  async updateExam(id: number, examUpdate: Partial<InsertExam>): Promise<Exam | undefined> {
    const [updatedExam] = await db
      .update(exams)
      .set(examUpdate)
      .where(eq(exams.id, id))
      .returning();
    return updatedExam || undefined;
  }
  
  async deleteExam(id: number): Promise<boolean> {
    const [deletedExam] = await db.delete(exams).where(eq(exams.id, id)).returning({ id: exams.id });
    return !!deletedExam;
  }
  
  // Results
  async getResults(): Promise<Result[]> {
    return await db.select().from(results).orderBy(desc(results.id));
  }
  
  async getResult(id: number): Promise<Result | undefined> {
    const [result] = await db.select().from(results).where(eq(results.id, id));
    return result || undefined;
  }
  
  async getResultsByStudentId(studentId: number): Promise<Result[]> {
    return await db
      .select()
      .from(results)
      .where(eq(results.studentId, studentId))
      .orderBy(desc(results.id));
  }
  
  async getResultsByExamId(examId: number): Promise<Result[]> {
    return await db
      .select()
      .from(results)
      .where(eq(results.examId, examId))
      .orderBy(desc(results.id));
  }
  
  async createResult(result: InsertResult): Promise<Result> {
    const [newResult] = await db.insert(results).values(result).returning();
    return newResult;
  }
  
  async updateResult(id: number, resultUpdate: Partial<InsertResult>): Promise<Result | undefined> {
    const [updatedResult] = await db
      .update(results)
      .set(resultUpdate)
      .where(eq(results.id, id))
      .returning();
    return updatedResult || undefined;
  }
  
  async deleteResult(id: number): Promise<boolean> {
    const [deletedResult] = await db.delete(results).where(eq(results.id, id)).returning({ id: results.id });
    return !!deletedResult;
  }
  
  // Stats
  async getStats(): Promise<any> {
    try {
      // Fetch all necessary data
      const studentsData = await db.select().from(students);
      const employeesData = await db.select().from(employees);
      const classroomsData = await db.select().from(classrooms);
      const attendanceData = await db.select().from(attendance);
      const paymentsData = await db.select().from(payments);
      const examsData = await db.select().from(exams);
      const resultsData = await db.select().from(results);
      
      // Compute student statistics
      const studentGenderCounts = studentsData.reduce(
        (acc, student) => {
          if (student.gender === 'male') acc.male += 1;
          else if (student.gender === 'female') acc.female += 1;
          
          if (student.section === 'primary') acc.primary += 1;
          else if (student.section === 'secondary') acc.secondary += 1;
          else if (student.section === 'highschool') acc.highschool += 1;
          
          return acc;
        }, 
        { male: 0, female: 0, primary: 0, secondary: 0, highschool: 0 }
      );
      
      // Compute employee statistics
      const teachersCount = employeesData.filter(emp => emp.role === 'teacher').length;
      
      // Compute attendance statistics
      const attendanceCounts = attendanceData.reduce(
        (acc, record) => {
          if (record.status === 'present') acc.present += 1;
          else if (record.status === 'absent') acc.absent += 1;
          else if (record.status === 'late') acc.late += 1;
          return acc;
        },
        { present: 0, absent: 0, late: 0 }
      );
      
      // Compute payment statistics
      const paymentStats = paymentsData.reduce(
        (acc, payment) => {
          if (payment.status === 'paid') {
            acc.paid += 1;
            acc.totalPaidAmount += payment.amount;
          } else if (payment.status === 'unpaid') {
            acc.unpaid += 1;
            acc.totalUnpaidAmount += payment.amount;
          } else if (payment.status === 'partial') {
            acc.partial += 1;
            acc.totalPaidAmount += payment.paidAmount || 0;
            acc.totalUnpaidAmount += (payment.amount - (payment.paidAmount || 0));
          }
          return acc;
        },
        { paid: 0, unpaid: 0, partial: 0, totalPaidAmount: 0, totalUnpaidAmount: 0 }
      );
      
      // Compute exam and results statistics
      const averageScore = resultsData.length 
        ? resultsData.reduce((acc, result) => acc + result.score, 0) / resultsData.length 
        : 0;
        
      const subjectPerformance = examsData.map(exam => {
        const examResults = resultsData.filter(r => r.examId === exam.id);
        const avgScore = examResults.length 
          ? examResults.reduce((acc, r) => acc + r.score, 0) / examResults.length 
          : 0;
        
        return {
          subject: exam.subject,
          avgScore,
          passRate: examResults.length 
            ? examResults.filter(r => r.score >= 60).length / examResults.length * 100 
            : 0
        };
      });
      
      // Return comprehensive stats
      return {
        students: {
          total: studentsData.length,
          ...studentGenderCounts
        },
        employees: {
          total: employeesData.length,
          teachers: teachersCount
        },
        classrooms: {
          total: classroomsData.length
        },
        attendance: attendanceCounts,
        payments: paymentStats,
        academics: {
          averageScore,
          totalExams: examsData.length,
          totalResults: resultsData.length,
          subjectPerformance
        },
        overview: {
          studentTeacherRatio: teachersCount ? studentsData.length / teachersCount : 0,
          attendanceRate: attendanceData.length 
            ? attendanceCounts.present / attendanceData.length * 100 
            : 0,
          paymentCompletionRate: paymentsData.length 
            ? paymentStats.paid / paymentsData.length * 100 
            : 0
        }
      };
    } catch (error) {
      console.error("Error getting stats:", error);
      // Return empty stats on error
      return {
        students: { total: 0, male: 0, female: 0, primary: 0, secondary: 0, highschool: 0 },
        employees: { total: 0, teachers: 0 },
        classrooms: { total: 0 },
        attendance: { present: 0, absent: 0, late: 0 },
        payments: { paid: 0, unpaid: 0, partial: 0, totalPaidAmount: 0, totalUnpaidAmount: 0 }
      };
    }
  }
}