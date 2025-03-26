import { ReactNode, useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { AppTheme } from '@/App';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [theme, setTheme] = useState<AppTheme>(() => {
    // Check localStorage or system preference
    const savedTheme = localStorage.getItem('theme') as AppTheme | null;
    return savedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  });

  const toggleTheme = () => {
    setTheme(prev => {
      const newTheme = prev === 'light' ? 'dark' : 'light';
      
      // Update localStorage and document class
      localStorage.setItem('theme', newTheme);
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(newTheme);
      
      return newTheme;
    });
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100 dark:bg-gray-800">
      <Sidebar 
        theme={theme} 
        toggleTheme={toggleTheme}
        activeUser="Administrator"
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
