import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface Option {
  value: string;
  label: string;
}

interface FilterSelectProps {
  label: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  compact?: boolean;
  className?: string;
}

// Helper function to transform empty string values to "all"
const transformValue = (value: string) => value === '' ? 'all' : value;
const reverseTransformValue = (value: string) => value === 'all' ? '' : value;

const FilterSelect: React.FC<FilterSelectProps> = ({
  label,
  options,
  value,
  onChange,
  placeholder = 'Select...',
  compact = false,
  className = ''
}) => {
  // Transform options to ensure no empty string values
  const transformedOptions = options.map(option => ({
    ...option,
    value: transformValue(option.value)
  }));

  // Transform the current value if needed
  const transformedValue = transformValue(value);

  // Handle value change and transform back to expected format for parent components
  const handleValueChange = (newValue: string) => {
    onChange(reverseTransformValue(newValue));
  };

  // Find the currently selected option label for compact display
  const selectedOption = options.find(option => option.value === value);
  const displayText = compact 
    ? (selectedOption?.label || placeholder).split(' ')[0] // Show only first word in compact mode
    : placeholder;

  return (
    <div className={cn(
      "relative",
      className
    )}>
      {compact && (
        <div className="absolute -top-2.5 left-2 px-1 text-xs font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 z-10">
          {label}
        </div>
      )}
      <Select
        value={transformedValue}
        onValueChange={handleValueChange}
      >
        <SelectTrigger className={cn(
          "bg-white dark:bg-gray-800 border border-divider dark:border-gray-700 rounded",
          "text-sm focus:outline-none focus:ring-1 focus:ring-blue",
          compact 
            ? "pl-2 pr-7 py-1.5 min-w-[90px] text-xs h-9" 
            : "pl-3 pr-8 py-1 min-w-[120px]",
          compact && "pt-2"
        )}>
          <SelectValue placeholder={displayText} />
        </SelectTrigger>
        <SelectContent className="bg-white dark:bg-gray-800">
          {transformedOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-blue">
        <svg className={cn("fill-current", compact ? "h-3 w-3" : "h-4 w-4")} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </div>
    </div>
  );
};

export default FilterSelect;
