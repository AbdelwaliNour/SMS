
import { useTheme } from '@/components/theme-provider';

interface LogoProps {
  size?: number;
  className?: string;
}

export const Logo = ({ size = 48, className = "" }: LogoProps) => {
  const { theme } = useTheme();
  
  return (
    <img 
      src={theme === 'dark' ? "/logo1.svg" : "/logo2.svg"}
      alt="School Management System" 
      className={`w-auto ${className}`}
      style={{ 
        height: `${size}px`,
        fill: theme === 'dark' ? '#ffffff' : '#00A3FF' 
      }}
    />
  );
};
