import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getGenderDisplayName(gender: string): string {
  return gender.charAt(0).toUpperCase() + gender.slice(1);
}

export function formatDate(date: Date | string): string {
  if (!date) return '';
  
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function generateUserAvatar(name: string, size = 32): string {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=00A1FF&color=fff&size=${size}`;
}

export function truncateText(text: string, maxLength: number): string {
  if (!text) return '';
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
}

export function calculateGrade(score: number, total: number): string {
  const percentage = (score / total) * 100;
  
  if (percentage >= 90) return 'A';
  if (percentage >= 80) return 'B';
  if (percentage >= 70) return 'C';
  if (percentage >= 60) return 'D';
  return 'F';
}

export function getSectionDisplayName(section: string): string {
  return section.charAt(0).toUpperCase() + section.slice(1);
}

export function calculateAge(dateOfBirth: string | null): number | null {
  if (!dateOfBirth) return null;
  
  const birthDate = new Date(dateOfBirth);
  const today = new Date();
  
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();
  
  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
}

export function formatAgeDisplay(dateOfBirth: string | null): string {
  const age = calculateAge(dateOfBirth);
  if (age === null) return 'Age not set';
  return `${age} years old`;
}

export function getProfilePhotoUrl(profilePhoto: string | null, name: string): string {
  if (profilePhoto && profilePhoto.trim() !== '') {
    return profilePhoto;
  }
  // Fallback to avatar generator
  return generateUserAvatar(name, 200);
}

export function generateStudentId(): string {
  const currentYear = new Date().getFullYear();
  const randomNum = Math.floor(Math.random() * 9000) + 1000; // 4-digit number
  return `ST-${currentYear}-${randomNum}`;
}

export function generateEmployeeId(): string {
  const currentYear = new Date().getFullYear();
  const randomNum = Math.floor(Math.random() * 900) + 100; // 3-digit number
  return `E-${currentYear}-${randomNum}`;
}
