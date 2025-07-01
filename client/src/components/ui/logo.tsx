import logoImage from "@assets/logo1_1751360257822.png";

interface LogoProps {
  size?: number;
  className?: string;
}

export const Logo = ({ size = 64, className = "" }: LogoProps) => {
  return (
    <img
      src={logoImage}
      alt="Education Management System"
      className={`${className}`}
      style={{
        height: `${size}px`,
        width: `${size * 1.5}px`,
        objectFit: "contain",
      }}
    />
  );
};
