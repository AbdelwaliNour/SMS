import { ReactNode, useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { MobileNavigation } from './MobileNavigation';
import { useIsMobile } from '@/hooks/use-mobile';
import { AppTheme } from '@/App';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const isMobile = useIsMobile();
  const [theme, setTheme] = useState<AppTheme>(() => {
    // Check localStorage or system preference
    const savedTheme = localStorage.getItem('theme') as AppTheme | null;
    return savedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  });

  // Apply theme class on initial render and when theme changes
  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => {
      const newTheme = prev === 'light' ? 'dark' : 'light';
      
      // Update localStorage
      localStorage.setItem('theme', newTheme);
      
      return newTheme;
    });
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-background via-background to-muted/20">
      {/* Sidebar (desktop only) */}
      {!isMobile && (
        <Sidebar 
          theme={theme} 
          toggleTheme={toggleTheme}
          activeUser="Administrator"
        />
      )}
      
      {/* Mobile navigation */}
      <MobileNavigation />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header toggleTheme={toggleTheme} theme={theme} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
