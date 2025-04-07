import React from "react";

interface LogoProps {
  size?: number;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 40, className = "" }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* School building icon with chart */}
      <circle cx="20" cy="20" r="20" fill="#0083CD" />
      <circle cx="20" cy="20" r="17" fill="#00A1FF" />

      {/* School building */}
      <path d="M20 7L10 13V29H30V13L20 7Z" fill="white" />

      {/* Roof */}
      <path d="M20 7L10 13H30L20 7Z" fill="#0083CD" />

      {/* Windows */}
      <rect x="13" y="16" width="4" height="4" fill="#0083CD" />
      <rect x="18" y="16" width="4" height="4" fill="#0083CD" />
      <rect x="23" y="16" width="4" height="4" fill="#0083CD" />
      <rect x="13" y="22" width="4" height="4" fill="#0083CD" />
      <rect x="18" y="22" width="4" height="4" fill="#0083CD" />
      <rect x="23" y="22" width="4" height="4" fill="#0083CD" />

      {/* Door */}
      <rect x="18" y="25" width="4" height="4" fill="#0083CD" />

      {/* Chart bars */}
      <rect x="10" y="32" width="3" height="3" fill="#0083CD" />
      <rect x="15" y="30" width="3" height="5" fill="#0083CD" />
      <rect x="20" y="28" width="3" height="7" fill="#0083CD" />
      <rect x="25" y="26" width="3" height="9" fill="#0083CD" />

      {/* Growth arrow */}
      <path
        d="M10 26L26 10"
        stroke="#FFFFFF"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M26 16V10H20"
        stroke="#FFFFFF"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
