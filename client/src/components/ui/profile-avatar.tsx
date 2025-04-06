import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, UserCircle } from "lucide-react";

interface ProfileAvatarProps {
  src?: string;
  name: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  fallbackIcon?: "user" | "circle";
}

export function ProfileAvatar({ 
  src, 
  name, 
  size = "md", 
  className = "", 
  fallbackIcon = "user" 
}: ProfileAvatarProps) {
  // Get initials from name
  const initials = name
    .split(" ")
    .map(part => part[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
  
  // Determine size class
  const sizeClass = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-14 w-14",
    xl: "h-20 w-20"
  }[size];
  
  // Font size classes
  const fontSizeClass = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
    xl: "text-xl"
  }[size];
  
  // Icon size
  const iconSize = {
    sm: 18,
    md: 22,
    lg: 30,
    xl: 44
  }[size];
  
  return (
    <Avatar className={`${sizeClass} border-2 border-primary/10 ${className}`}>
      <AvatarImage src={src} alt={name} />
      <AvatarFallback className={`bg-gradient-to-br from-blue to-blue/70 text-white ${fontSizeClass}`}>
        {fallbackIcon === "user" ? (
          <User size={iconSize} className="text-white" />
        ) : (
          initials || <UserCircle size={iconSize} className="text-white" />
        )}
      </AvatarFallback>
    </Avatar>
  );
}