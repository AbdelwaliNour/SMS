import React from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useFormContext } from 'react-hook-form';
import { getFieldState, getInputStateClass, getFieldHint } from '@/lib/form-validation';

export interface Option {
  label: string;
  value: string;
}

interface EnhancedFormFieldProps {
  name: string;
  label: string;
  type?: 'text' | 'email' | 'number' | 'password' | 'date' | 'time' | 'tel' | 'textarea' | 'select' | 'checkbox' | 'radio';
  placeholder?: string;
  description?: string;
  options?: Option[];
  className?: string;
  labelClassName?: string;
  showHint?: boolean;
  isRequired?: boolean;
  isReadOnly?: boolean;
  isDisabled?: boolean;
  onChange?: (value: any) => void;
}

export function EnhancedFormField({
  name,
  label,
  type = 'text',
  placeholder,
  description,
  options = [],
  className = '',
  labelClassName = '',
  showHint = true,
  isRequired = false,
  isReadOnly = false,
  isDisabled = false,
  onChange,
}: EnhancedFormFieldProps) {
  const form = useFormContext();
  
  // Get form state for this field
  const fieldState = getFieldState(
    form?.formState?.errors?.[name], 
    form?.formState?.touchedFields?.[name]
  );
  
  // Generate field hint based on field name or use provided placeholder
  const hint = showHint ? (placeholder || getFieldHint(name)) : undefined;
  
  // Determine input state classes
  const stateClass = getInputStateClass(fieldState);
  
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn(className)}>
          <div className="flex justify-between">
            <FormLabel className={cn(
              "text-xs text-gray-700 dark:text-gray-300 mb-1 flex items-center", 
              labelClassName
            )}>
              {label}
              {isRequired && (
                <span className="text-red ml-1">*</span>
              )}
            </FormLabel>
            
            {fieldState === "success" && (
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-4 w-4 text-green" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path 
                  fillRule="evenodd" 
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
                  clipRule="evenodd" 
                />
              </svg>
            )}
          </div>

          {/* Field description if provided */}
          {description && (
            <p className="text-xs text-gray-500 dark:text-gray-400 -mt-1 mb-1">
              {description}
            </p>
          )}

          <FormControl>
            {/* Render different input types */}
            {type === 'select' ? (
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                  onChange?.(value);
                }}
                defaultValue={field.value}
                disabled={isDisabled}
              >
                <SelectTrigger className={stateClass}>
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                  {options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : type === 'checkbox' ? (
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={field.value}
                  onCheckedChange={(checked) => {
                    field.onChange(checked);
                    onChange?.(checked);
                  }}
                  disabled={isDisabled}
                  className={cn(stateClass, "rounded-sm")}
                />
                {placeholder && (
                  <Label className="text-sm text-gray-600 dark:text-gray-400">{placeholder}</Label>
                )}
              </div>
            ) : type === 'radio' ? (
              <RadioGroup
                onValueChange={(value) => {
                  field.onChange(value);
                  onChange?.(value);
                }}
                defaultValue={field.value}
                className="flex flex-col space-y-1"
                disabled={isDisabled}
              >
                {options.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.value} id={`${name}-${option.value}`} />
                    <Label htmlFor={`${name}-${option.value}`} className="text-sm">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            ) : type === 'textarea' ? (
              <Textarea
                {...field}
                placeholder={hint}
                className={cn(stateClass)}
                disabled={isDisabled}
                readOnly={isReadOnly}
                onChange={(e) => {
                  field.onChange(e);
                  onChange?.(e.target.value);
                }}
              />
            ) : (
              <div className="relative">
                <Input
                  {...field}
                  type={type}
                  placeholder={hint}
                  className={cn(stateClass)}
                  disabled={isDisabled}
                  readOnly={isReadOnly}
                  onChange={(e) => {
                    if (type === 'number') {
                      const value = e.target.value === '' ? '' : Number(e.target.value);
                      field.onChange(value);
                      onChange?.(value);
                    } else {
                      field.onChange(e);
                      onChange?.(e.target.value);
                    }
                  }}
                  value={field.value ?? ''}
                />
                
                {/* Error icon */}
                {fieldState === "error" && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-4 w-4 text-red" 
                      viewBox="0 0 20 20" 
                      fill="currentColor"
                    >
                      <path 
                        fillRule="evenodd" 
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" 
                        clipRule="evenodd" 
                      />
                    </svg>
                  </div>
                )}
              </div>
            )}
          </FormControl>
          
          {/* Animated form message with transition */}
          <FormMessage className={cn(
            "animate-in fade-in slide-in-from-top-1 duration-200",
            fieldState === "error" ? "text-red text-xs" : "text-xs text-gray-500 dark:text-gray-400"
          )} />
        </FormItem>
      )}
    />
  );
}