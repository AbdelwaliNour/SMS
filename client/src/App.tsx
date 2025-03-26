import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import { useState, useEffect } from "react";
import Dashboard from "@/pages/dashboard";
import Students from "@/pages/students";
import AddStudent from "@/pages/add-student";
import Employees from "@/pages/employees";
import AddEmployee from "@/pages/add-employee";
import Classrooms from "@/pages/classrooms";
import Finance from "@/pages/finance";
import Exams from "@/pages/exams";
import Attendance from "@/pages/attendance";
import Reports from "@/pages/reports";
import TimeTable from "@/pages/timetable";

export type AppTheme = "light" | "dark";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard}/>
      <Route path="/students" component={Students}/>
      <Route path="/add-student" component={AddStudent}/>
      <Route path="/employees" component={Employees}/>
      <Route path="/add-employee" component={AddEmployee}/>
      <Route path="/classrooms" component={Classrooms}/>
      <Route path="/finance" component={Finance}/>
      <Route path="/exams" component={Exams}/>
      <Route path="/attendance" component={Attendance}/>
      <Route path="/reports" component={Reports}/>
      <Route path="/timetable" component={TimeTable}/>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [theme, setTheme] = useState<AppTheme>(() => {
    // Check for stored theme preference or use preferred color scheme
    const savedTheme = localStorage.getItem("theme") as AppTheme | null;
    return savedTheme || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  });

  // Update HTML class when theme changes
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="app min-h-screen">
        <Router />
        <Toaster />
      </div>
    </QueryClientProvider>
  );
}

export default App;
