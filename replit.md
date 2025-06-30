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
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```