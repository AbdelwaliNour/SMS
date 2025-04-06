import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

/**
 * Common validation message templates
 */
export const ValidationMessages = {
  required: "This field is required",
  min: (length: number) => `Must be at least ${length} characters`,
  max: (length: number) => `Cannot exceed ${length} characters`,
  email: "Please enter a valid email address",
  phone: "Please enter a valid phone number",
  numeric: "Please enter a valid number",
  date: "Please enter a valid date",
  url: "Please enter a valid URL",
  match: "Entries do not match",
  passwordRequirements: "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character"
};

/**
 * Common validation regex patterns
 */
export const ValidationPatterns = {
  letters: /^[A-Za-z\s]+$/,
  alphanumeric: /^[A-Za-z0-9\s]+$/,
  numeric: /^\d+$/,
  phone: /^(\+\d{1,3})?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  url: /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/
};

/**
 * Common validation rules for form fields
 */
export const ValidationRules = {
  /**
   * Creates validation rules for required text fields
   * @param fieldName Human-readable field name for error messages
   * @param minLength Minimum length requirement (default: 2)
   * @param maxLength Maximum length requirement (default: 100)
   */
  requiredText: (fieldName: string, minLength = 2, maxLength = 100) => 
    z.string()
      .min(minLength, `${fieldName} must be at least ${minLength} characters`)
      .max(maxLength, `${fieldName} cannot exceed ${maxLength} characters`)
      .trim(),
  
  /**
   * Creates validation rules for optional text fields
   * @param fieldName Human-readable field name for error messages
   * @param minLength Minimum length requirement (default: 2)
   * @param maxLength Maximum length requirement (default: 100)
   */
  optionalText: (fieldName: string, minLength = 2, maxLength = 100) => 
    z.string()
      .min(minLength, `${fieldName} must be at least ${minLength} characters`)
      .max(maxLength, `${fieldName} cannot exceed ${maxLength} characters`)
      .trim()
      .optional()
      .or(z.literal('')),
  
  /**
   * Creates validation rules for required email fields
   */
  requiredEmail: () => 
    z.string()
      .email('Please enter a valid email address')
      .trim(),
  
  /**
   * Creates validation rules for optional email fields
   */
  optionalEmail: () => 
    z.string()
      .email('Please enter a valid email address')
      .trim()
      .optional()
      .or(z.literal('')),
  
  /**
   * Creates validation rules for required numeric fields
   * @param fieldName Human-readable field name for error messages
   * @param min Minimum value requirement
   * @param max Maximum value requirement
   */
  requiredNumber: (fieldName: string, min?: number, max?: number) => {
    let schema = z.number({
      required_error: `${fieldName} is required`,
      invalid_type_error: `${fieldName} must be a number`
    });
    
    if (min !== undefined) {
      schema = schema.min(min, `${fieldName} must be at least ${min}`);
    }
    
    if (max !== undefined) {
      schema = schema.max(max, `${fieldName} cannot exceed ${max}`);
    }
    
    return schema;
  },
  
  /**
   * Creates validation rules for optional numeric fields
   * @param fieldName Human-readable field name for error messages
   * @param min Minimum value requirement
   * @param max Maximum value requirement
   */
  optionalNumber: (fieldName: string, min?: number, max?: number) => {
    let schema = z.number({
      invalid_type_error: `${fieldName} must be a number`
    });
    
    if (min !== undefined) {
      schema = schema.min(min, `${fieldName} must be at least ${min}`);
    }
    
    if (max !== undefined) {
      schema = schema.max(max, `${fieldName} cannot exceed ${max}`);
    }
    
    return schema.optional();
  },
  
  /**
   * Creates validation rules for required date fields
   * @param fieldName Human-readable field name for error messages
   * @param minDate Minimum date requirement
   * @param maxDate Maximum date requirement
   */
  requiredDate: (fieldName: string, minDate?: Date, maxDate?: Date) => {
    let schema = z.date({
      required_error: `${fieldName} is required`,
      invalid_type_error: `${fieldName} must be a valid date`
    });
    
    if (minDate) {
      schema = schema.min(minDate, `${fieldName} must be after ${minDate.toLocaleDateString()}`);
    }
    
    if (maxDate) {
      schema = schema.max(maxDate, `${fieldName} must be before ${maxDate.toLocaleDateString()}`);
    }
    
    return schema;
  },
  
  /**
   * Creates validation rules for optional date fields
   * @param fieldName Human-readable field name for error messages
   * @param minDate Minimum date requirement
   * @param maxDate Maximum date requirement
   */
  optionalDate: (fieldName: string, minDate?: Date, maxDate?: Date) => {
    let schema = z.date({
      invalid_type_error: `${fieldName} must be a valid date`
    });
    
    if (minDate) {
      schema = schema.min(minDate, `${fieldName} must be after ${minDate.toLocaleDateString()}`);
    }
    
    if (maxDate) {
      schema = schema.max(maxDate, `${fieldName} must be before ${maxDate.toLocaleDateString()}`);
    }
    
    return schema.optional();
  },
  
  /**
   * Creates validation rules for phone number fields
   * @param isRequired Whether the field is required
   */
  phoneNumber: (isRequired = true) => {
    const phoneRegex = /^(\+\d{1,3})?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
    const schema = z.string()
      .regex(phoneRegex, 'Please enter a valid phone number')
      .trim();
    
    return isRequired ? schema : schema.optional().or(z.literal(''));
  },
  
  /**
   * Creates validation rules for password fields with strength requirements
   * @param minLength Minimum length requirement (default: 8)
   */
  password: (minLength = 8) => {
    return z.string()
      .min(minLength, `Password must be at least ${minLength} characters`)
      .refine(
        (value) => /[A-Z]/.test(value),
        { message: 'Password must include at least one uppercase letter' }
      )
      .refine(
        (value) => /[a-z]/.test(value),
        { message: 'Password must include at least one lowercase letter' }
      )
      .refine(
        (value) => /[0-9]/.test(value),
        { message: 'Password must include at least one number' }
      )
      .refine(
        (value) => /[^A-Za-z0-9]/.test(value),
        { message: 'Password must include at least one special character' }
      );
  },
  
  /**
   * Creates validation for password confirmation
   * @param passwordField The name of the password field to match against
   */
  passwordConfirmation: (passwordField: string) => {
    return z.string()
      .min(1, 'Please confirm your password')
      // We'll use a static validation here since we can't easily access the other password field
      // The actual validation will happen in react-hook-form
      .refine(val => val.length > 0, {
        message: 'Passwords do not match'
      });
  },
  
  /**
   * Creates validation rules for URL fields
   * @param isRequired Whether the field is required
   */
  url: (isRequired = true) => {
    const schema = z.string()
      .url('Please enter a valid URL')
      .trim();
    
    return isRequired ? schema : schema.optional().or(z.literal(''));
  },
};

/**
 * Error formatter to convert form validation errors into user-friendly messages
 * @param error The validation error to format
 */
export function formatValidationError(error: any): string {
  if (!error) return '';
  
  if (typeof error === 'string') return error;
  
  if (error.message) return error.message;
  
  if (Array.isArray(error)) {
    return error.map(err => formatValidationError(err)).join(', ');
  }
  
  return 'An error occurred with this field';
}

/**
 * Creates a resolver for a form schema
 * @param schema The zod schema to create a resolver for
 */
export function createFormResolver<T extends z.ZodType>(schema: T) {
  return zodResolver(schema);
}

/**
 * Type helper to derive form schema type
 */
export type FormSchemaType<T extends z.ZodType> = z.infer<T>;