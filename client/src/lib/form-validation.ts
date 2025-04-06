import { z } from 'zod';

// Reusable validation messages
export const ValidationMessages = {
  required: "This field is required",
  email: "Please enter a valid email address",
  phone: "Please enter a valid phone number",
  min: (min: number) => `Must be at least ${min} characters`,
  max: (max: number) => `Must be at most ${max} characters`,
  number: "Please enter a valid number",
  integer: "Please enter a whole number",
  positive: "Please enter a positive number",
  date: "Please enter a valid date",
  future: "Date must be in the future",
  past: "Date must be in the past",
  url: "Please enter a valid URL",
  match: "Passwords do not match",
  unique: "This value is already taken",
  select: "Please select an option",
};

// Common validation patterns
export const ValidationPatterns = {
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  phone: /^(\+\d{1,3})?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/,
  url: /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
  alphanumeric: /^[a-zA-Z0-9 ]*$/,
  letters: /^[a-zA-Z ]*$/,
  numbers: /^[0-9]*$/,
  strongPassword: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
};

// Common schema refinements
export const zodRefinements = {
  pastDate: (schema: z.ZodString) => 
    schema.refine(
      (val) => {
        const date = new Date(val);
        return date < new Date();
      },
      { message: ValidationMessages.past }
    ),
  futureDate: (schema: z.ZodString) => 
    schema.refine(
      (val) => {
        const date = new Date(val);
        return date > new Date();
      },
      { message: ValidationMessages.future }
    ),
  timeRange: (startField: string, endField: string) => 
    (schema: z.ZodObject<any>) => 
      schema.refine(
        (data) => {
          if (!data[startField] || !data[endField]) return true;
          return data[startField] < data[endField];
        },
        {
          message: "End time must be after start time",
          path: [endField],
        }
      ),
};

// Form field visual state utility
export const getFieldState = (errors?: any, touched?: boolean) => {
  if (errors) return "error";
  if (touched) return "success";
  return "default";
};

// Generate error message component class based on state
export const getErrorMessageClass = (state: "error" | "success" | "default") => {
  switch (state) {
    case "error":
      return "text-red text-xs animate-in fade-in slide-in-from-top-1 duration-200";
    case "success":
      return "text-green text-xs animate-in fade-in slide-in-from-top-1 duration-200";
    default:
      return "text-xs text-gray-500 dark:text-gray-400";
  }
};

// Generate input class based on state
export const getInputStateClass = (state: "error" | "success" | "default") => {
  const baseClass = "border-gray-200 dark:border-gray-700 focus:ring-1";
  
  switch (state) {
    case "error":
      return `${baseClass} border-red focus:border-red focus:ring-red/30`;
    case "success":
      return `${baseClass} border-green focus:border-green focus:ring-green/30`;
    default:
      return `${baseClass} focus:border-blue focus:ring-blue/30`;
  }
};

// Helper to get validation hint based on field name and validation rules
export const getFieldHint = (fieldName: string) => {
  const hints: Record<string, string> = {
    firstName: "Enter first name",
    lastName: "Enter last name",
    email: "e.g. user@example.com",
    phone: "e.g. +1 (555) 123-4567",
    address: "Enter full address",
    password: "Min 8 chars with uppercase, lowercase, number & special char",
    confirmPassword: "Re-enter password to confirm",
    dob: "Select date of birth",
    joinDate: "Select joining date", 
    startTime: "e.g. 09:00",
    endTime: "e.g. 17:00",
  };
  
  return hints[fieldName] || "";
};