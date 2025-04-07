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
    <div className="w-64 h-full bg-white dark:bg-gray-900 border-r border-divider dark:border-gray-700 flex flex-col">
      {/* Logo */}
      <div className="p-4 flex items-center">
        <Logo size={48} />
        <div className="ml-2">
          <h1 className="font-homenaje text-xl text-black dark:text-white leading-none">
            Education
          </h1>
          <h1 className="font-homenaje text-xl text-black dark:text-white leading-none">
            Management
          </h1>
          <h1 className="font-homenaje text-xl text-black dark:text-white leading-none">
            System
          </h1>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 pt-6">
        <div className="px-4 mb-2">
          <Link
            href="/"
            className={`flex items-center py-2 px-4 rounded-md ${location === "/" ? "bg-blue text-white" : "text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
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
            Dashboard
          </Link>
        </div>

        <div className="px-4 mt-6">
          <h3 className="text-sm font-bold underline text-black-500 dark:text-white-400 uppercase tracking-wider mb-2">
            PROFILES
          </h3>
          <Link
            href="/students"
            className={`flex items-center py-2 px-4 rounded-md mb-1 ${location === "/students" ? "bg-blue text-white" : "text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
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
            Students
          </Link>
          <Link
            href="/classrooms"
            className={`flex items-center py-2 px-4 rounded-md mb-1 ${location === "/classrooms" ? "bg-blue text-white" : "text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
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
            Class Rooms
          </Link>
          <Link
            href="/employees"
            className={`flex items-center py-2 px-4 rounded-md ${location === "/employees" ? "bg-blue text-white" : "text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
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
            Employees
          </Link>
        </div>

        <div className="px-4 mt-6">
          <h3 className="text-sm font-bold underline text-black-500 dark:text-white-400 uppercase tracking-wider mb-2">
            WORK
          </h3>
          <Link
            href="/attendance"
            className={`flex items-center py-2 px-4 rounded-md mb-1 ${location === "/attendance" ? "bg-blue text-white" : "text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
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
            Attendances
          </Link>
          <Link
            href="/finance"
            className={`flex items-center py-2 px-4 rounded-md mb-1 ${location === "/finance" ? "bg-blue text-white" : "text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
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
            Finances
          </Link>
          <Link
            href="/exams"
            className={`flex items-center py-2 px-4 rounded-md mb-1 ${location === "/exams" ? "bg-blue text-white" : "text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
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
            Results
          </Link>
        </div>
        <div className="px-4 mt-6">
          <h3 className="text-sm font-bold underline text-black-500 dark:text-white-400 uppercase tracking-wider mb-2">
            others
          </h3>
          <Link
            href="/student-performance"
            className={`flex items-center py-2 px-4 rounded-md mb-1 ${location === "/student-performance" ? "bg-blue text-white" : "text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
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
            Performances
          </Link>
          <Link
            href="/reports"
            className={`flex items-center py-2 px-4 rounded-md mb-1 ${location === "/reports" ? "bg-blue text-white" : "text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
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
            Reports
          </Link>
          <Link
            href="/timetable"
            className={`flex items-center py-2 px-4 rounded-md ${location === "/timetable" ? "bg-blue text-white" : "text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
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
            Schedules
          </Link>
        </div>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-divider dark:border-gray-700">
        <div className="flex items-center">
          <img src={userAvatar} alt="User" className="w-10 h-10 rounded-full" />
          <div className="ml-3">
            <p className="text-sm font-medium text-black-800 dark:text-white-200">
              {activeUser}
            </p>
          </div>
          <button className="ml-auto text-black-500 dark:text-white-400">
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
  );
};

export default Sidebar;
