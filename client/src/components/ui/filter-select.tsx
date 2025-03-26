import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
}

// Helper function to transform empty string values to "all"
const transformValue = (value: string) => value === '' ? 'all' : value;
const reverseTransformValue = (value: string) => value === 'all' ? '' : value;

const FilterSelect: React.FC<FilterSelectProps> = ({
  label,
  options,
  value,
  onChange,
  placeholder = 'Select...'
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

  return (
    <div className="relative">
      <Select
        value={transformedValue}
        onValueChange={handleValueChange}
      >
        <SelectTrigger className="bg-white dark:bg-gray-800 border border-divider dark:border-gray-700 rounded pl-3 pr-8 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue min-w-[120px]">
          <SelectValue placeholder={placeholder} />
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
        <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </div>
    </div>
  );
};

export default FilterSelect;
