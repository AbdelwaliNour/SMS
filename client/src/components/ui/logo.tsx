
import { useTheme } from '@/components/theme-provider';

export const Logo = () => {
  const { theme } = useTheme();
  
  return (
    <img 
      src={theme === 'dark' ? "/logo1.svg" : "/logo2.svg"}
      alt="School Management System" 
      className="h-12 w-auto"
    />
  );
};
