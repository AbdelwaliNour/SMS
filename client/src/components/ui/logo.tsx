
interface LogoProps {
  size?: number;
  className?: string;
}

export const Logo = ({ size = 48, className = "" }: LogoProps) => {
  return (
    <img 
      src="/logo.png"
      alt="Education Management System" 
      className={`w-auto ${className}`}
      style={{ 
        height: `${size}px`
      }}
    />
  );
};
