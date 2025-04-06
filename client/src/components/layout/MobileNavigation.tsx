import { useState } from 'react';
import { useLocation, Link } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Home, Users, BookOpen, UserCheck, DollarSign, BarChart2, Calendar, Award, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ProfileAvatar } from '@/components/ui/profile-avatar';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  isActive: boolean;
  onClick: () => void;
}

const NavItem = ({ icon, label, href, isActive, onClick }: NavItemProps) => (
  <Link href={href}>
    <a
      className={cn(
        "flex items-center space-x-3 px-6 py-4 border-l-4 transition-colors duration-200",
        isActive 
          ? "border-blue bg-blue/10 text-blue" 
          : "border-transparent hover:bg-gray-100 dark:hover:bg-gray-800"
      )}
      onClick={onClick}
    >
      <div className="flex-shrink-0 w-6">{icon}</div>
      <span className="text-base font-medium">{label}</span>
    </a>
  </Link>
);

export function MobileNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  // Animation variants for the sidebar
  const sidebarVariants = {
    closed: {
      x: '-100%',
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 40
      }
    },
    open: {
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 40
      }
    }
  };

  // Animation variants for the overlay
  const overlayVariants = {
    closed: {
      opacity: 0,
      transition: {
        delay: 0.2
      }
    },
    open: {
      opacity: 1
    }
  };

  return (
    <>
      {/* Mobile menu toggle button */}
      <div className="absolute top-3 left-3 z-30 md:hidden">
        <Button 
          variant="ghost" 
          className="p-2 rounded-full text-gray-700 dark:text-gray-300"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <Menu size={24} />
        </Button>
      </div>

      {/* Overlay and Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Dark overlay */}
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={overlayVariants}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={closeMenu}
            />

            {/* Sidebar navigation */}
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={sidebarVariants}
              className="fixed top-0 left-0 h-full w-4/5 max-w-xs bg-white dark:bg-gray-900 z-50 md:hidden flex flex-col"
            >
              {/* Header with close button */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue flex items-center justify-center rounded-lg">
                    <span className="text-white font-bold text-xl">EM</span>
                  </div>
                  <div className="ml-3">
                    <h2 className="text-lg font-homenaje text-gray-800 dark:text-gray-200">Education</h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Management System</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-gray-500"
                  onClick={closeMenu}
                  aria-label="Close menu"
                >
                  <X size={20} />
                </Button>
              </div>

              {/* User profile */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center">
                <ProfileAvatar name="Administrator" size="md" />
                <div className="ml-3">
                  <p className="font-medium text-gray-800 dark:text-gray-200">Administrator</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">admin@school.edu</p>
                </div>
              </div>

              {/* Navigation links */}
              <nav className="flex-1 overflow-y-auto py-4">
                <div className="mb-3">
                  <NavItem 
                    icon={<Home size={20} />}
                    label="Dashboard"
                    href="/"
                    isActive={location === '/'}
                    onClick={closeMenu}
                  />
                </div>

                <div className="mb-1 px-6">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Profiles</h3>
                </div>
                <div className="mb-3">
                  <NavItem 
                    icon={<Users size={20} />}
                    label="Students"
                    href="/students"
                    isActive={location === '/students'}
                    onClick={closeMenu}
                  />
                  <NavItem 
                    icon={<BookOpen size={20} />}
                    label="Class Rooms"
                    href="/classrooms"
                    isActive={location === '/classrooms'}
                    onClick={closeMenu}
                  />
                  <NavItem 
                    icon={<UserCheck size={20} />}
                    label="Employees"
                    href="/employees"
                    isActive={location === '/employees'}
                    onClick={closeMenu}
                  />
                </div>

                <div className="mb-1 px-6">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Work</h3>
                </div>
                <div>
                  <NavItem 
                    icon={<UserCheck size={20} />}
                    label="Attendance"
                    href="/attendance"
                    isActive={location === '/attendance'}
                    onClick={closeMenu}
                  />
                  <NavItem 
                    icon={<DollarSign size={20} />}
                    label="Finance"
                    href="/finance"
                    isActive={location === '/finance'}
                    onClick={closeMenu}
                  />
                  <NavItem 
                    icon={<Award size={20} />}
                    label="Results"
                    href="/exams"
                    isActive={location === '/exams'}
                    onClick={closeMenu}
                  />
                  <NavItem 
                    icon={<BarChart2 size={20} />}
                    label="Reports"
                    href="/reports"
                    isActive={location === '/reports'}
                    onClick={closeMenu}
                  />
                  <NavItem 
                    icon={<Calendar size={20} />}
                    label="Timetable"
                    href="/timetable"
                    isActive={location === '/timetable'}
                    onClick={closeMenu}
                  />
                </div>
              </nav>

              {/* Footer */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <Button variant="outline" className="w-full flex items-center justify-center" size="sm">
                  <Settings size={16} className="mr-2" />
                  <span>Settings</span>
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}