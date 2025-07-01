# Education Management System

## Overview

This is a full-stack Education Management System built with React, Express, TypeScript, and PostgreSQL. The application provides comprehensive school management capabilities including student enrollment, employee management, classroom administration, attendance tracking, financial management, and reporting features.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Styling**: Tailwind CSS with custom design system
- **Component Library**: Radix UI primitives with custom shadcn/ui components
- **State Management**: TanStack Query (React Query) for server state
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation
- **Charts**: Recharts for data visualization

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Session Management**: connect-pg-simple for PostgreSQL session storage
- **API Design**: RESTful endpoints with consistent error handling
- **Build System**: ESBuild for server bundling

### Data Storage Solutions
- **Primary Database**: PostgreSQL via Neon Database
- **ORM**: Drizzle ORM with type-safe schema definitions
- **Schema Management**: Drizzle Kit for migrations and schema changes
- **Connection Pooling**: postgres-js for efficient database connections

## Key Components

### Database Schema
- **Users**: Authentication and authorization system
- **Students**: Complete student profile management with demographics
- **Employees**: Staff management with roles and sections
- **Classrooms**: Room allocation and capacity management
- **Attendance**: Daily attendance tracking with status types
- **Payments**: Financial transaction records
- **Exams**: Assessment management
- **Results**: Student performance tracking

### Core Modules
1. **Dashboard**: Real-time statistics and overview
2. **Student Management**: CRUD operations, profile management
3. **Employee Management**: Staff administration and role assignment
4. **Classroom Management**: Room allocation and teacher assignment
5. **Attendance System**: Daily tracking with mobile-responsive interface
6. **Finance Management**: Payment tracking and financial reporting
7. **Examination System**: Exam creation and result management
8. **Reporting & Analytics**: Comprehensive data visualization

### UI/UX Features
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Dark Mode Support**: System-wide theme switching
- **Enhanced Form Validation**: Real-time validation with visual feedback
- **Data Tables**: Sortable, filterable tables with pagination
- **Charts & Analytics**: Interactive data visualization
- **Skeleton Loading**: Animated loading states for better UX

## Data Flow

### Client-Server Communication
1. **API Layer**: RESTful endpoints under `/api/*` prefix
2. **Data Fetching**: TanStack Query handles caching, synchronization, and error states
3. **Form Submission**: React Hook Form with Zod validation before API calls
4. **Real-time Updates**: Query invalidation for immediate UI updates

### Database Operations
1. **Connection**: Drizzle ORM with postgres-js client
2. **Query Building**: Type-safe queries with Drizzle's query builder
3. **Migrations**: Schema changes managed via Drizzle Kit
4. **Data Validation**: Zod schemas shared between client and server

## External Dependencies

### Database & Infrastructure
- **@neondatabase/serverless**: Serverless PostgreSQL connection
- **drizzle-orm**: Type-safe ORM with excellent TypeScript support
- **postgres**: PostgreSQL client for Node.js

### UI Components & Styling
- **@radix-ui/***: Headless UI primitives for accessibility
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Component variant management
- **lucide-react**: Modern icon library

### Development & Build Tools
- **vite**: Fast build tool and dev server
- **tsx**: TypeScript execution for development
- **esbuild**: Fast JavaScript bundler for production

## Deployment Strategy

### Development Environment
- **Dev Server**: Vite dev server with HMR for frontend
- **Backend**: tsx for TypeScript execution with auto-reload
- **Database**: Neon Database with environment-based configuration

### Production Build
1. **Frontend**: Vite builds optimized static assets to `dist/public`
2. **Backend**: ESBuild bundles server code to `dist/index.js`
3. **Database**: Drizzle Kit pushes schema changes via `db:push`
4. **Serving**: Express serves both API and static files

### Configuration
- **Environment Variables**: DATABASE_URL required for database connection
- **Build Commands**: 
  - `npm run build`: Full production build
  - `npm run start`: Production server
  - `npm run dev`: Development mode

## Changelog

```
Changelog:
- June 30, 2025. Initial setup
- June 30, 2025. Comprehensive UI modernization completed:
  * Implemented glass-morphism design system with contemporary styling
  * Enhanced CSS with modern animations, gradients, and backdrop-blur effects
  * Modernized Layout, Sidebar, Header, and Dashboard components
  * Created floating action button and enhanced form components
  * Updated all dashboard sections with modern card designs and interactive elements
  * Improved dark mode support with cohesive theme integration
- June 30, 2025. Student profile enhancements completed:
  * Added profilePhoto field to student schema with database migration
  * Implemented automatic age calculation from dateOfBirth field
  * Enhanced student cards to display profile photos with fallback to generated avatars
  * Added prominent age display as blue badges throughout student interfaces
  * Updated both main students table and responsive student list with new features
  * Enhanced Add/Edit Student forms to include profile photo URL field
- June 30, 2025. Employee and student form improvements completed:
  * Added automatic ID generation for students (ST-YYYY-####) and employees (E-YYYY-###)
  * Made ID fields readonly with auto-generated values in both add and edit forms
  * Redesigned EditEmployeeForm with modern glass-morphism styling to match AddEmployeeForm
  * Updated EnhancedFormField components with consistent styling and validation
  * Fixed database schema compatibility issues and null value handling
- June 30, 2025. Profile picture and classroom management enhancements:
  * Added profilePhoto field to employee schema and database migration
  * Enhanced AddEmployeeForm and EditEmployeeForm with profile picture URL field
  * Fixed edit classroom routing from /edit-classroom to /edit-classroom/:id
  * Modernized AddClassroomForm with glass-morphism design and EnhancedFormField components
  * Added delete classroom functionality with confirmation dialog and proper error handling
  * Removed FloatingActionButton from students page as requested
- July 1, 2025. Comprehensive attendance page redesign completed:
  * Redesigned entire attendance page with modern, professional interface
  * Added comprehensive statistics cards with real-time attendance metrics
  * Enhanced table design with selection checkboxes and improved column headers
  * Upgraded student display with larger profile photos, age badges, and gender indicators
  * Implemented smart date formatting with "Today/Yesterday" recognition
  * Enhanced status indicators with gradients, shadows, and improved visual hierarchy
  * Redesigned notes section with better styling and visual feedback
  * Updated quick action buttons with enhanced hover effects and active states
  * Fixed light/dark mode compatibility for all interface elements
  * Added advanced search and filtering capabilities
- July 1, 2025. Record attendance form redesign and functionality improvements:
  * Redesigned form as a table format for efficient bulk attendance recording
  * Added three action buttons per student: Present (green), Late (amber), Absent (red)
  * Increased form width to max-w-7xl for better table display
  * Added class filtering functionality to the attendance form
  * Fixed date format issues in attendance submission (proper timestamp handling)
  * Implemented bulk save functionality with individual record error tracking
  * Enhanced error handling with detailed feedback and console logging
- July 1, 2025. Attendance table structure completely redesigned:
  * Separated student information into individual columns for better data organization
  * Created 9 distinct columns: Photo, Student ID, Student Name, Age, Section, Class, Date & Time, Notes, Attendance Status
  * Removed complex combined student details column in favor of granular data display
  * Enhanced table readability with centered alignment for badges and compact photo display
  * Fixed all React key conflicts and duplicate column issues for clean console logs
- July 1, 2025. Complete finance page and payments table redesign:
  * Redesigned entire finance page with comprehensive financial overview cards and analytics
  * Replaced traditional payments table with modern card-based layout for better visual appeal
  * Added advanced search functionality and status filtering for payment records
  * Enhanced payment cards with student profile photos, status badges, and quick action buttons
  * Implemented tabbed interface for Payments, Analytics, and Reports sections
  * Added modern glass-morphism styling throughout the finance module
  * Created empty state with call-to-action for first payment entry
- July 1, 2025. Complete attendance page redesign to match finance page:
  * Redesigned entire attendance page to exactly match finance page layout and styling
  * Added comprehensive attendance overview cards with real-time metrics and progress bars
  * Created attendance status distribution cards for Present, Late, and Absent students
  * Implemented identical tabbed interface for Records, Analytics, and Reports sections
  * Replaced traditional attendance table with beautiful card-based layout matching finance design
  * Enhanced visual consistency with profile avatars, status badges, and glass-morphism styling
  * Added advanced search and filtering capabilities consistent with finance page patterns
- July 1, 2025. Attendance recording system redesign and functionality fixes:
  * Created comprehensive table-based attendance recording interface with bulk submission
  * Redesigned dialog form to include class filtering and three action buttons per student
  * Implemented working state management for student status selection and notes
  * Fixed API submission issues by removing date field (using database default timestamp)
  * Added real-time visual feedback for selected attendance status with color-coded buttons
  * Enhanced user experience with live counters showing filtered students and marked attendance
- July 1, 2025. Comprehensive payment system redesign and enhancement:
  * Enhanced payments schema with comprehensive fields: type, method, receipt number, notes, terms, installments
  * Added new payment enums: payment_type (tuition, fees, books, etc.), payment_method (cash, card, etc.), extended payment_status
  * Created comprehensive AddPaymentDialog with modern design and extensive payment options
  * Redesigned PaymentsTable with enhanced filtering by status and payment type
  * Added visual payment type badges and improved status indicators
  * Implemented installment payment tracking and academic year/term organization
  * Added payment method tracking and receipt number management
- July 1, 2025. Payment dialog UI improvements and optimization:
  * Fixed dialog width responsiveness to prevent horizontal scrolling (max-w-4xl)
  * Improved payment type grid responsiveness with proper breakpoints
  * Removed default trigger button for better component control
  * Cleaned up action button styling and removed background gradients
  * Standardized Cancel button to use default shadcn/ui styling
  * Enhanced debugging capabilities for payment form submission
- July 1, 2025. Complete results/exams page redesign with modern card-based layout:
  * Redesigned entire results page to match finance and attendance page styling patterns
  * Added comprehensive overview cards with real-time statistics and gradient icons
  * Implemented grade distribution visualization with progress bars and color-coded badges
  * Created tabbed interface for Results, Exams, and Analytics sections
  * Replaced traditional table with beautiful card-based result display
  * Added advanced search and filtering by subject, grade, and student information
  * Enhanced student result cards with profile avatars, grade badges, and score visualization
  * Integrated dual functionality for both exam creation and result recording
  * Added empty states with call-to-action buttons for improved user experience
- July 1, 2025. Results page redesigned to exactly match finance page structure:
  * Modified page header to match finance page with icon, title, and action buttons layout
  * Updated overview cards to follow finance page card structure with trending badges
  * Changed grade distribution to match finance payment status card pattern (Excellent/Good/Needs Support)
  * Aligned all tab styling, analytics charts, and reports sections with finance page
  * Created finance-style ResultsTable component with search, filters, and card-based display
  * Ensured complete visual and structural consistency between finance and results pages
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```