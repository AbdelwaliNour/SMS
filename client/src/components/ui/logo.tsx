
import logoImage from "@assets/logo1_1751360257822.png";

interface LogoProps {
  size?: number;
  className?: string;
}

export const Logo = ({ size = 48, className = "" }: LogoProps) => {
  return (
    <img 
      src={logoImage}
      alt="Education Management System" 
      className={`w-auto ${className}`}
      style={{ 
        height: `${size}px`
      }}
    />
  );
};
