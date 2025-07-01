import React from 'react';
import { cn } from '@/lib/utils';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { UseFormReturn, FieldPath } from 'react-hook-form';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, AlertCircle } from 'lucide-react';

/**
 * Base props for enhanced form field components
 */
interface BaseEnhancedFormFieldProps<T extends Record<string, any>> {
  form: UseFormReturn<T>;
  name: FieldPath<T>;
  label: string;
  description?: string;
  disabled?: boolean;
  className?: string;
  required?: boolean;
  showSuccessState?: boolean;
}

/**
 * Props for the enhanced text input form field
 */
export interface EnhancedFormFieldProps<T extends Record<string, any>> extends BaseEnhancedFormFieldProps<T> {
  placeholder?: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'date' | 'select';
  maxLength?: number;
  min?: number;
  max?: number;
  options?: Array<{ value: string; label: string; }>;  // For select type
  onChange?: (value: string) => void;  // For custom change handler
}

/**
 * Props for the enhanced select form field
 */
export interface EnhancedSelectFieldProps<T extends Record<string, any>> extends BaseEnhancedFormFieldProps<T> {
  placeholder?: string;
  options: Array<{ 
    value: string; 
    label: string;
  }>;
  onChange?: (value: string) => void;  // For custom change handler
}

/**
 * Props for the enhanced textarea form field
 */
export interface EnhancedTextareaFieldProps<T extends Record<string, any>> extends BaseEnhancedFormFieldProps<T> {
  placeholder?: string;
  maxLength?: number;
  rows?: number;
  onChange?: (value: string) => void;  // For custom change handler
}

/**
 * Enhanced form field with validation feedback and animations
 */
export function EnhancedFormField<T extends Record<string, any>>({
  form,
  name,
  label,
  description,
  placeholder,
  type = 'text',
  disabled = false,
  className,
  required = false,
  isRequired = false, // Backward compatibility
  showSuccessState = true,
  maxLength,
  min,
  max,
  options = [],
  onChange,
}: EnhancedFormFieldProps<T> & { isRequired?: boolean }) {
  // Use either required or isRequired prop
  const fieldIsRequired = required || isRequired;
  const fieldState = form.getFieldState(name);
  const value = form.watch(name);
  
  const isValid = !fieldState.invalid && fieldState.isDirty && value;
  const hasError = fieldState.invalid && fieldState.isTouched;
  
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel className="flex items-center">
            {label}
            {fieldIsRequired && <span className="text-red ml-1 text-xs">*</span>}
          </FormLabel>
          
          <FormControl>
            <div className="relative">
              {type === 'select' && options && options.length > 0 ? (
                <Select
                  disabled={disabled}
                  onValueChange={(value) => {
                    field.onChange(value);
                    onChange && onChange(value);
                  }}
                  defaultValue={field.value}
                  value={field.value || undefined}
                >
                  <FormControl>
                    <SelectTrigger className={cn(
                      hasError 
                        ? 'border-red focus-visible:ring-red/20'
                        : isValid && showSuccessState
                          ? 'border-green focus-visible:ring-green/20'
                          : ''
                    )}>
                      <SelectValue placeholder={placeholder} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {options.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  {...field}
                  type={type}
                  placeholder={placeholder}
                  disabled={disabled}
                  maxLength={maxLength}
                  min={type === 'number' ? (min ?? 1) : undefined}
                  max={type === 'number' ? max : undefined}
                  className={cn(
                    'pr-10',
                    hasError 
                      ? 'border-red focus-visible:ring-red/20'
                      : isValid && showSuccessState
                        ? 'border-green focus-visible:ring-green/20'
                        : ''
                  )}
                  value={field.value || ''}
                  onChange={(e) => {
                    field.onChange(e);
                    onChange && onChange(e.target.value);
                  }}
                />
              )}
              
              <div className={cn("absolute pointer-events-none", 
                type === 'select' ? "inset-y-0 right-8 flex items-center" : "inset-y-0 right-0 flex items-center pr-3")}>
                <AnimatePresence initial={false} mode="wait">
                  {hasError && (
                    <motion.span
                      key="error"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="text-red"
                    >
                      <AlertCircle className="h-4 w-4" />
                    </motion.span>
                  )}
                  
                  {isValid && showSuccessState && !hasError && (
                    <motion.span
                      key="success"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="text-green"
                    >
                      <Check className="h-4 w-4" />
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </FormControl>
          
          {description && (
            <FormDescription>
              {description}
            </FormDescription>
          )}
          
          <AnimatePresence>
            {hasError && (
              <motion.div 
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <FormMessage />
              </motion.div>
            )}
          </AnimatePresence>
          
          {maxLength && type === 'text' && (
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-right">
              {value?.length || 0}/{maxLength}
            </div>
          )}
        </FormItem>
      )}
    />
  );
}

/**
 * Enhanced select field with validation feedback and animations
 */
export function EnhancedSelectField<T extends Record<string, any>>({
  form,
  name,
  label,
  description,
  options,
  placeholder,
  disabled = false,
  className,
  required = false,
  isRequired = false, // Backward compatibility
  showSuccessState = true,
  onChange,
}: EnhancedSelectFieldProps<T> & { isRequired?: boolean }) {
  // Use either required or isRequired prop
  const fieldIsRequired = required || isRequired;
  const fieldState = form.getFieldState(name);
  const value = form.watch(name);
  
  const isValid = !fieldState.invalid && fieldState.isDirty && value;
  const hasError = fieldState.invalid && fieldState.isTouched;
  
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel className="flex items-center">
            {label}
            {fieldIsRequired && <span className="text-red ml-1 text-xs">*</span>}
          </FormLabel>
          
          <div className="relative">
            <Select
              disabled={disabled}
              onValueChange={(value) => {
                field.onChange(value);
                onChange && onChange(value);
              }}
              defaultValue={field.value}
              value={field.value || undefined}
            >
              <FormControl>
                <SelectTrigger className={cn(
                  hasError 
                    ? 'border-red focus-visible:ring-red/20'
                    : isValid && showSuccessState
                      ? 'border-green focus-visible:ring-green/20'
                      : ''
                )}>
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <div className="absolute inset-y-0 right-8 flex items-center pointer-events-none">
              <AnimatePresence initial={false} mode="wait">
                {hasError && (
                  <motion.span
                    key="error"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="text-red"
                  >
                    <AlertCircle className="h-4 w-4" />
                  </motion.span>
                )}
                
                {isValid && showSuccessState && !hasError && (
                  <motion.span
                    key="success"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="text-green"
                  >
                    <Check className="h-4 w-4" />
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </div>
          
          {description && (
            <FormDescription>
              {description}
            </FormDescription>
          )}
          
          <AnimatePresence>
            {hasError && (
              <motion.div 
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <FormMessage />
              </motion.div>
            )}
          </AnimatePresence>
        </FormItem>
      )}
    />
  );
}

/**
 * Enhanced textarea field with validation feedback and animations
 */
export function EnhancedTextareaField<T extends Record<string, any>>({
  form,
  name,
  label,
  description,
  placeholder,
  disabled = false,
  className,
  required = false,
  isRequired = false, // Backward compatibility
  showSuccessState = true,
  maxLength,
  rows = 4,
  onChange,
}: EnhancedTextareaFieldProps<T> & { isRequired?: boolean }) {
  // Use either required or isRequired prop
  const fieldIsRequired = required || isRequired;
  const fieldState = form.getFieldState(name);
  const value = form.watch(name);
  
  const isValid = !fieldState.invalid && fieldState.isDirty && value;
  const hasError = fieldState.invalid && fieldState.isTouched;
  
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel className="flex items-center">
            {label}
            {fieldIsRequired && <span className="text-red ml-1 text-xs">*</span>}
          </FormLabel>
          
          <FormControl>
            <div className="relative">
              <Textarea
                {...field}
                placeholder={placeholder}
                disabled={disabled}
                maxLength={maxLength}
                rows={rows}
                className={cn(
                  hasError 
                    ? 'border-red focus-visible:ring-red/20'
                    : isValid && showSuccessState
                      ? 'border-green focus-visible:ring-green/20'
                      : ''
                )}
                value={field.value || ''}
                onChange={(e) => {
                  field.onChange(e);
                  onChange && onChange(e.target.value);
                }}
              />
              
              <div className="absolute top-2 right-2 flex items-center pointer-events-none">
                <AnimatePresence initial={false} mode="wait">
                  {hasError && (
                    <motion.span
                      key="error"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="text-red"
                    >
                      <AlertCircle className="h-4 w-4" />
                    </motion.span>
                  )}
                  
                  {isValid && showSuccessState && !hasError && (
                    <motion.span
                      key="success"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="text-green"
                    >
                      <Check className="h-4 w-4" />
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </FormControl>
          
          {description && (
            <FormDescription>
              {description}
            </FormDescription>
          )}
          
          <AnimatePresence>
            {hasError && (
              <motion.div 
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <FormMessage />
              </motion.div>
            )}
          </AnimatePresence>
          
          {maxLength && (
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-right">
              {value?.length || 0}/{maxLength}
            </div>
          )}
        </FormItem>
      )}
    />
  );
}

/**
 * Section container for form fields with title and description
 */
interface EnhancedFormSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function EnhancedFormSection({
  title,
  description,
  children,
  className,
}: EnhancedFormSectionProps) {
  return (
    <div className={cn("p-6 rounded-lg border bg-card", className)}>
      <div className="mb-4">
        <h3 className="text-lg font-medium">{title}</h3>
        {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
      </div>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
}