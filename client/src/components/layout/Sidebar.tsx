import { useLocation, Link } from "wouter";
import { useState } from "react";
import { Logo } from "../ui/logo";
import { AppTheme } from "@/App";
import { Switch } from "@/components/ui/switch";

interface SidebarProps {
  theme: AppTheme;
  toggleTheme: () => void;
  activeUser: string;
}

const Sidebar = ({ theme, toggleTheme, activeUser }: SidebarProps) => {
  const [location] = useLocation();

  // Generate random avatar for user
  const [userAvatar] = useState(
    `https://ui-avatars.com/api/?name=${encodeURIComponent(activeUser)}&background=0D8ABC&color=fff`,
  );

  return (
    <div className="w-64 h-full glass-morphism border-r border-border/50 flex flex-col backdrop-blur-xl">
      {/* Modern Logo Section */}
      <div className="p-6 border-b border-border/30">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary/10 rounded-xl">
            <Logo size={60} />
          </div>
          <div>
            <h1 className="font-bold text-lg text-foreground leading-tight">
              EMS
            </h1>
            <p className="text-xs text-muted-foreground">
              Education Management System
            </p>
          </div>
        </div>
      </div>

      {/* Modern Navigation */}
      <nav className="flex-1 py-6 space-y-2">
        <div className="px-4">
          <Link
            href="/"
            className={`flex items-center py-3 px-4 rounded-xl transition-all duration-300 group ${
              location === "/"
                ? "bg-primary text-primary-foreground shadow-lg"
                : "text-foreground hover:bg-primary/10 hover:text-primary"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-3 transition-transform group-hover:scale-110"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            <span className="font-medium">Dashboard</span>
          </Link>
        </div>

        <div className="px-4 space-y-1">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-4">
            Management
          </h3>
          <Link
            href="/students"
            className={`flex items-center py-3 px-4 rounded-xl transition-all duration-300 group ${
              location === "/students"
                ? "bg-primary text-primary-foreground shadow-lg"
                : "text-foreground hover:bg-primary/10 hover:text-primary"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-3 transition-transform group-hover:scale-110"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
            <span className="font-medium">Students</span>
          </Link>
          <Link
            href="/classrooms"
            className={`flex items-center py-3 px-4 rounded-xl transition-all duration-300 group ${
              location === "/classrooms"
                ? "bg-primary text-primary-foreground shadow-lg"
                : "text-foreground hover:bg-primary/10 hover:text-primary"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-3 transition-transform group-hover:scale-110"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            <span className="font-medium">Classrooms</span>
          </Link>
          <Link
            href="/employees"
            className={`flex items-center py-3 px-4 rounded-xl transition-all duration-300 group ${
              location === "/employees"
                ? "bg-primary text-primary-foreground shadow-lg"
                : "text-foreground hover:bg-primary/10 hover:text-primary"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-3 transition-transform group-hover:scale-110"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span className="font-medium">Employees</span>
          </Link>
        </div>

        <div className="px-4 space-y-1 mt-6">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-4">
            Operations
          </h3>
          <Link
            href="/attendance"
            className={`flex items-center py-3 px-4 rounded-xl transition-all duration-300 group ${
              location === "/attendance"
                ? "bg-primary text-primary-foreground shadow-lg"
                : "text-foreground hover:bg-primary/10 hover:text-primary"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-3 transition-transform group-hover:scale-110"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
              />
            </svg>
            <span className="font-medium">Attendance</span>
          </Link>
          <Link
            href="/finance"
            className={`flex items-center py-3 px-4 rounded-xl transition-all duration-300 group ${
              location === "/finance"
                ? "bg-primary text-primary-foreground shadow-lg"
                : "text-foreground hover:bg-primary/10 hover:text-primary"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-3 transition-transform group-hover:scale-110"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="font-medium">Finance</span>
          </Link>
          <Link
            href="/exams"
            className={`flex items-center py-3 px-4 rounded-xl transition-all duration-300 group ${
              location === "/exams"
                ? "bg-primary text-primary-foreground shadow-lg"
                : "text-foreground hover:bg-primary/10 hover:text-primary"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-3 transition-transform group-hover:scale-110"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            <span className="font-medium">Exams</span>
          </Link>
        </div>
        <div className="px-4 space-y-1 mt-6">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-4">
            Analytics
          </h3>
          <Link
            href="/student-performance"
            className={`flex items-center py-3 px-4 rounded-xl transition-all duration-300 group ${
              location === "/student-performance"
                ? "bg-primary text-primary-foreground shadow-lg"
                : "text-foreground hover:bg-primary/10 hover:text-primary"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-3 transition-transform group-hover:scale-110"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="font-medium">Performance</span>
          </Link>
          <Link
            href="/reports"
            className={`flex items-center py-3 px-4 rounded-xl transition-all duration-300 group ${
              location === "/reports"
                ? "bg-primary text-primary-foreground shadow-lg"
                : "text-foreground hover:bg-primary/10 hover:text-primary"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-3 transition-transform group-hover:scale-110"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <span className="font-medium">Reports</span>
          </Link>
          <Link
            href="/timetable"
            className={`flex items-center py-3 px-4 rounded-xl transition-all duration-300 group ${
              location === "/timetable"
                ? "bg-primary text-primary-foreground shadow-lg"
                : "text-foreground hover:bg-primary/10 hover:text-primary"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-3 transition-transform group-hover:scale-110"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="font-medium">Timetable</span>
          </Link>
        </div>
      </nav>

      {/* Modern User Profile Section */}
      <div className="p-4 border-t border-border/30 mt-auto">
        <div className="glass-morphism p-4 rounded-xl border border-border/30 hover:border-primary/30 transition-all duration-300">
          <div className="flex items-center">
            <div className="relative">
              <img
                src={userAvatar}
                alt="User"
                className="w-12 h-12 rounded-xl ring-2 ring-primary/20"
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background"></div>
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-semibold text-foreground">
                {activeUser}
              </p>
              <p className="text-xs text-muted-foreground">Administrator</p>
            </div>
            <button className="p-2 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all duration-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
