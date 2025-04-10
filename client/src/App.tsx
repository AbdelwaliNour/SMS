import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import NotFound from "@/pages/not-found";
import { useState, useEffect } from "react";
import Dashboard from "@/pages/dashboard";
import Students from "@/pages/students";
import AddStudent from "@/pages/add-student";
import EditStudent from "@/pages/edit-student";
import Employees from "@/pages/employees";
import AddEmployee from "@/pages/add-employee";
import Classrooms from "@/pages/classrooms";
import Finance from "@/pages/finance";
import Exams from "@/pages/exams";
import Attendance from "@/pages/attendance";
import Reports from "@/pages/reports";
import TimeTable from "@/pages/timetable";
import StudentPerformance from "@/pages/student-performance";
import FormValidationDemo from "@/pages/form-validation-demo";

export type AppTheme = "light" | "dark";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/students" component={Students} />
      <Route path="/add-student" component={AddStudent} />
      <Route path="/edit-student/:id" component={EditStudent} />
      <Route path="/employees" component={Employees} />
      <Route path="/add-employee" component={AddEmployee} />
      <Route path="/classrooms" component={Classrooms} />
      <Route path="/finance" component={Finance} />
      <Route path="/exams" component={Exams} />
      <Route path="/attendance" component={Attendance} />
      <Route path="/reports" component={Reports} />
      <Route path="/timetable" component={TimeTable} />
      <Route path="/student-performance" component={StudentPerformance} />
      <Route path="/form-validation-demo" component={FormValidationDemo} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="app-theme">
        <div className="app min-h-screen">
          <Router />
          <Toaster />
        </div>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
