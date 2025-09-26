# Education Management System

## Overview
This is a full-stack Education Management System designed to provide comprehensive school management capabilities. Built with React, Express, TypeScript, and PostgreSQL, it handles student enrollment, employee management, classroom administration, attendance tracking, financial management, and reporting. The system aims to be a complete solution for educational institutions.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom design system, Radix UI primitives, shadcn/ui components
- **State Management**: TanStack Query
- **Routing**: Wouter
- **Form Handling**: React Hook Form with Zod validation
- **Charts**: Recharts
- **UI/UX Decisions**: Responsive, mobile-first design; Dark Mode support; Glass-morphism design system with modern animations, gradients, and backdrop-blur effects; Enhanced form validation; Sortable, filterable, paginated data tables; Interactive charts; Skeleton loading; Consistent visual design across modules (e.g., card-based layouts, consistent tabbed interfaces).

### Backend
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL (Neon Database)
- **ORM**: Drizzle ORM
- **Session Management**: connect-pg-simple
- **API Design**: RESTful endpoints with consistent error handling
- **Build System**: ESBuild

### Data Storage & Schema
- **Primary Database**: PostgreSQL via Neon Database
- **ORM**: Drizzle ORM for type-safe schema definitions
- **Schema Management**: Drizzle Kit for migrations
- **Core Entities**: Users, Students, Employees, Classrooms, Attendance, Payments, Exams, Results. Includes fields like profile photos, auto-generated IDs (ST-YYYY-####, E-YYYY-###), and detailed payment/attendance data.
- **Sections**: Primary, Intermediate, Secondary.

### Core Modules & Features
- **Dashboard**: Real-time statistics and overview.
- **Student Management**: CRUD, profile management (including profile photo, age calculation).
- **Employee Management**: Staff administration, role assignment (including profile photo).
- **Classroom Management**: Allocation, teacher assignment, deletion.
- **Attendance System**: Daily tracking, mobile-responsive interface, bulk recording, statistics, card-based display.
- **Finance Management**: Payment tracking, financial reporting, comprehensive payment schema (type, method, receipt, installments), card-based display.
- **Examination System**: Exam creation, result management, grade distribution, card-based display.
- **Reporting & Analytics**: Comprehensive data visualization, consistent filtering across modules.
- **Performance Management**: Student performance tracking, distribution cards, detailed metrics.
- **Timetable Management**: Schedule display, section distribution (Primary/Intermediate/Secondary).

## External Dependencies

### Database & Infrastructure
- `@neondatabase/serverless`: Serverless PostgreSQL connection.
- `drizzle-orm`: Type-safe ORM.
- `postgres`: PostgreSQL client for Node.js.

### UI Components & Styling
- `@radix-ui/*`: Headless UI primitives.
- `tailwindcss`: Utility-first CSS framework.
- `class-variance-authority`: Component variant management.
- `lucide-react`: Icon library.
- `recharts`: Charting library.

### Development & Build Tools
- `vite`: Fast build tool and dev server.
- `tsx`: TypeScript execution for development.
- `esbuild`: Fast JavaScript bundler for production.