import { pgTable, text, serial, integer, boolean, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Enum definitions
export const genderEnum = pgEnum('gender', ['male', 'female']);
export const shiftEnum = pgEnum('shift', ['morning', 'afternoon', 'evening']);
export const roleEnum = pgEnum('role', ['teacher', 'driver', 'cleaner', 'guard', 'admin', 'staff']);
export const sectionEnum = pgEnum('section', ['primary', 'secondary', 'highschool']);
export const statusEnum = pgEnum('status', ['present', 'absent', 'late']);
export const paymentStatusEnum = pgEnum('payment_status', ['paid', 'unpaid', 'partial']);

// User table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default('staff'),
  fullName: text("full_name").notNull(),
  email: text("email"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Student table
export const students = pgTable("students", {
  id: serial("id").primaryKey(),
  studentId: text("student_id").notNull().unique(),
  firstName: text("first_name").notNull(),
  middleName: text("middle_name"),
  lastName: text("last_name").notNull(),
  gender: genderEnum("gender").notNull(),
  dateOfBirth: text("date_of_birth"),
  phone: text("phone"),
  email: text("email"),
  address: text("address"),
  section: sectionEnum("section").notNull(),
  class: text("class").notNull(),
  fatherName: text("father_name"),
  fatherPhone: text("father_phone"),
  fatherEmail: text("father_email"),
  motherName: text("mother_name"),
  motherPhone: text("mother_phone"),
  motherEmail: text("mother_email"),
  profilePhoto: text("profile_photo"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Employee table
export const employees = pgTable("employees", {
  id: serial("id").primaryKey(),
  employeeId: text("employee_id").notNull().unique(),
  firstName: text("first_name").notNull(),
  middleName: text("middle_name"),
  lastName: text("last_name").notNull(),
  gender: genderEnum("gender").notNull(),
  dateOfBirth: text("date_of_birth"),
  phone: text("phone"),
  email: text("email"),
  role: roleEnum("role").notNull(),
  section: sectionEnum("section"),
  salary: integer("salary").notNull(),
  shift: shiftEnum("shift"),
  subjects: text("subjects").array(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Classroom table
export const classrooms = pgTable("classrooms", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  section: sectionEnum("section").notNull(),
  capacity: integer("capacity").notNull(),
  teacherId: integer("teacher_id").references(() => employees.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Attendance table
export const attendance = pgTable("attendance", {
  id: serial("id").primaryKey(),
  date: timestamp("date").notNull().defaultNow(),
  studentId: integer("student_id").references(() => students.id).notNull(),
  status: statusEnum("status").notNull(),
  note: text("note"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Payment table
export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").references(() => students.id).notNull(),
  amount: integer("amount").notNull(),
  date: timestamp("date").notNull().defaultNow(),
  description: text("description"),
  status: paymentStatusEnum("status").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Exam table
export const exams = pgTable("exams", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  section: sectionEnum("section").notNull(),
  class: text("class").notNull(),
  date: timestamp("date").notNull(),
  subjects: text("subjects").array(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Result table
export const results = pgTable("results", {
  id: serial("id").primaryKey(),
  examId: integer("exam_id").references(() => exams.id).notNull(),
  studentId: integer("student_id").references(() => students.id).notNull(),
  subject: text("subject").notNull(),
  score: integer("score").notNull(),
  total: integer("total").notNull(),
  grade: text("grade").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertStudentSchema = createInsertSchema(students).omit({ id: true, createdAt: true });
export const insertEmployeeSchema = createInsertSchema(employees).omit({ id: true, createdAt: true });
export const insertClassroomSchema = createInsertSchema(classrooms).omit({ id: true, createdAt: true });
export const insertAttendanceSchema = createInsertSchema(attendance).omit({ id: true, createdAt: true });
export const insertPaymentSchema = createInsertSchema(payments).omit({ id: true, createdAt: true });
export const insertExamSchema = createInsertSchema(exams).omit({ id: true, createdAt: true });
export const insertResultSchema = createInsertSchema(results).omit({ id: true, createdAt: true });

// Type definitions
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Student = typeof students.$inferSelect;
export type InsertStudent = z.infer<typeof insertStudentSchema>;

export type Employee = typeof employees.$inferSelect;
export type InsertEmployee = z.infer<typeof insertEmployeeSchema>;

export type Classroom = typeof classrooms.$inferSelect;
export type InsertClassroom = z.infer<typeof insertClassroomSchema>;

export type Attendance = typeof attendance.$inferSelect;
export type InsertAttendance = z.infer<typeof insertAttendanceSchema>;

export type Payment = typeof payments.$inferSelect;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;

export type Exam = typeof exams.$inferSelect;
export type InsertExam = z.infer<typeof insertExamSchema>;

export type Result = typeof results.$inferSelect;
export type InsertResult = z.infer<typeof insertResultSchema>;

// Define relations
export const studentsRelations = relations(students, ({ many }) => ({
  attendance: many(attendance),
  payments: many(payments),
  results: many(results),
}));

export const employeesRelations = relations(employees, ({ many }) => ({
  classrooms: many(classrooms),
}));

export const classroomsRelations = relations(classrooms, ({ one }) => ({
  teacher: one(employees, {
    fields: [classrooms.teacherId],
    references: [employees.id],
  }),
}));

export const attendanceRelations = relations(attendance, ({ one }) => ({
  student: one(students, {
    fields: [attendance.studentId],
    references: [students.id],
  }),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  student: one(students, {
    fields: [payments.studentId],
    references: [students.id],
  }),
}));

export const examsRelations = relations(exams, ({ many }) => ({
  results: many(results),
}));

export const resultsRelations = relations(results, ({ one }) => ({
  student: one(students, {
    fields: [results.studentId],
    references: [students.id]
  }),
  exam: one(exams, {
    fields: [results.examId],
    references: [exams.id]
  })
}));
