import React from 'react';
import { cn } from '@/lib/utils';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export interface DataListColumn<T> {
  accessorKey: keyof T | string;
  header: string;
  cell?: (item: T) => React.ReactNode;
  badge?: boolean;
  badgeVariant?: 'default' | 'outline' | 'secondary' | 'destructive';
  badgeClassName?: string;
  primary?: boolean;
  secondary?: boolean;
  action?: boolean;
  hidden?: boolean;
  className?: string;
}

export interface ResponsiveDataListProps<T> {
  columns: DataListColumn<T>[];
  data: T[];
  keyExtractor: (item: T) => string | number;
  onItemClick?: (item: T) => void;
  emptyMessage?: string;
  isLoading?: boolean;
  className?: string;
  itemClassName?: string;
  expandable?: boolean;
  expandedContent?: (item: T) => React.ReactNode;
  renderItemCustom?: (item: T, columns: DataListColumn<T>[]) => React.ReactNode;
}

/**
 * A responsive data list component that displays as cards on mobile
 * and adapts based on screen size.
 */
export function ResponsiveDataList<T>({
  columns,
  data,
  keyExtractor,
  onItemClick,
  emptyMessage = 'No data available',
  isLoading = false,
  className = '',
  itemClassName = '',
  expandable = false,
  expandedContent,
  renderItemCustom,
}: ResponsiveDataListProps<T>) {
  const [expandedItems, setExpandedItems] = React.useState<Set<string | number>>(new Set());

  // Toggle item expanded state
  const toggleExpanded = (id: string | number) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  // Helper to get value from item using accessorKey
  const getItemValue = (item: T, accessorKey: keyof T | string): any => {
    if (typeof accessorKey === 'string' && accessorKey.includes('.')) {
      // Handle nested accessors like 'user.name'
      const keys = accessorKey.split('.');
      let value: any = item;
      for (const key of keys) {
        value = value?.[key];
        if (value === undefined) break;
      }
      return value;
    }
    return item[accessorKey as keyof T];
  };

  // Filter columns to only show what makes sense on mobile
  const primaryColumn = columns.find(col => col.primary);
  const secondaryColumns = columns.filter(col => col.secondary && !col.action);
  const actionColumns = columns.filter(col => col.action);

  // Render loading skeleton
  if (isLoading) {
    return (
      <div className={cn('rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700', className)}>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="border-b border-gray-200 dark:border-gray-700 last:border-0">
            <div className="p-4 flex items-center justify-between">
              <div className="animate-pulse">
                <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-4 w-48 bg-gray-100 dark:bg-gray-800 rounded"></div>
              </div>
              <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Render empty state
  if (data.length === 0) {
    return (
      <div className={cn('glass-morphism border-border/30 rounded-lg p-8 text-center', className)}>
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      {data.map(item => {
        const itemKey = keyExtractor(item);
        const isExpanded = expandedItems.has(itemKey);

        // Allow custom rendering if provided
        if (renderItemCustom) {
          return (
            <div 
              key={itemKey} 
              className={cn(
                'glass-morphism border-border/30 hover:border-primary/30 transition-all duration-300 hover:shadow-xl rounded-lg',
                onItemClick ? 'cursor-pointer' : '',
                itemClassName
              )}
            >
              {renderItemCustom(item, columns)}
            </div>
          );
        }

        return (
          <div 
            key={itemKey} 
            className={cn(
              'glass-morphism border-border/30 hover:border-primary/30 transition-all duration-300 hover:shadow-xl rounded-lg',
              onItemClick ? 'cursor-pointer' : '',
              itemClassName
            )}
            onClick={onItemClick ? () => onItemClick(item) : undefined}
          >
            {expandable ? (
              <Collapsible
                open={isExpanded}
                onOpenChange={() => {
                  if (expandable) {
                    toggleExpanded(itemKey);
                  }
                }}
              >
                <div className="p-4 flex flex-col">
                  <div className="flex justify-between items-start mb-1">
                    {/* Primary information */}
                    <div className="flex-1">
                      {primaryColumn && (
                        <div className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                          {primaryColumn.cell 
                            ? primaryColumn.cell(item) 
                            : getItemValue(item, primaryColumn.accessorKey)}
                        </div>
                      )}
                      
                      {/* Secondary information in a grid or list */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
                        {secondaryColumns.map(column => !column.hidden && (
                          <div key={column.accessorKey.toString()} className="flex items-center text-sm">
                            <span className="text-gray-500 dark:text-gray-400 mr-2">
                              {column.header}:
                            </span>
                            {column.badge ? (
                              <Badge 
                                variant={column.badgeVariant || 'default'} 
                                className={column.badgeClassName}
                              >
                                {column.cell 
                                  ? column.cell(item) 
                                  : getItemValue(item, column.accessorKey)}
                              </Badge>
                            ) : (
                              <span className="text-gray-900 dark:text-gray-100">
                                {column.cell 
                                  ? column.cell(item) 
                                  : getItemValue(item, column.accessorKey) || '-'}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex space-x-2 ml-4">
                      {actionColumns.map(column => !column.hidden && (
                        <div key={column.accessorKey.toString()}>
                          {column.cell && column.cell(item)}
                        </div>
                      ))}
                      
                      {expandable && (
                        <CollapsibleTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0 rounded-full"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleExpanded(itemKey);
                            }}
                          >
                            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          </Button>
                        </CollapsibleTrigger>
                      )}
                    </div>
                  </div>

                  {/* Expandable section */}
                  {expandable && expandedContent && (
                    <CollapsibleContent className="pt-3 pb-1">
                      <div className="border-t border-gray-100 dark:border-gray-800 pt-3">
                        {expandedContent(item)}
                      </div>
                    </CollapsibleContent>
                  )}
                </div>
              </Collapsible>
            ) : (
              <div className="p-4 flex flex-col">
                <div className="flex justify-between items-start mb-1">
                  {/* Primary information */}
                  <div className="flex-1">
                    {primaryColumn && (
                      <div className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                        {primaryColumn.cell 
                          ? primaryColumn.cell(item) 
                          : getItemValue(item, primaryColumn.accessorKey)}
                      </div>
                    )}
                    
                    {/* Secondary information in a grid or list */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
                      {secondaryColumns.map(column => !column.hidden && (
                        <div key={column.accessorKey.toString()} className="flex items-center text-sm">
                          <span className="text-gray-500 dark:text-gray-400 mr-2">
                            {column.header}:
                          </span>
                          {column.badge ? (
                            <Badge 
                              variant={column.badgeVariant || 'default'} 
                              className={column.badgeClassName}
                            >
                              {column.cell 
                                ? column.cell(item) 
                                : getItemValue(item, column.accessorKey)}
                            </Badge>
                          ) : (
                            <span className="text-gray-900 dark:text-gray-100">
                              {column.cell 
                                ? column.cell(item) 
                                : getItemValue(item, column.accessorKey) || '-'}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex space-x-2 ml-4">
                    {actionColumns.map(column => !column.hidden && (
                      <div key={column.accessorKey.toString()}>
                        {column.cell && column.cell(item)}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}