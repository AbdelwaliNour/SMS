import React from 'react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface ResponsiveCardProps {
  title: string;
  description?: string;
  headerAction?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  padded?: boolean;
  bordered?: boolean;
  elevation?: 'none' | 'sm' | 'md' | 'lg';
}

/**
 * A responsive card component that adapts to different screen sizes
 * and provides optional collapsible functionality for mobile views.
 */
export function ResponsiveCard({
  title,
  description,
  headerAction,
  footer,
  children,
  className = '',
  headerClassName = '',
  bodyClassName = '',
  footerClassName = '',
  collapsible = false,
  defaultCollapsed = false,
  padded = true,
  bordered = true,
  elevation = 'md',
}: ResponsiveCardProps) {
  const isMobile = useIsMobile();
  const [isCollapsed, setIsCollapsed] = React.useState(isMobile && defaultCollapsed);

  // Handle resize events to update collapsed state
  React.useEffect(() => {
    if (!collapsible) return;
    setIsCollapsed(isMobile && defaultCollapsed);
  }, [isMobile, collapsible, defaultCollapsed]);

  // Determine shadow class based on elevation
  const getShadowClass = () => {
    switch (elevation) {
      case 'none': return '';
      case 'sm': return 'shadow-sm';
      case 'md': return 'shadow';
      case 'lg': return 'shadow-lg';
      default: return 'shadow';
    }
  };

  return (
    <Card 
      className={cn(
        bordered ? 'border border-gray-200 dark:border-gray-700' : 'border-0',
        getShadowClass(),
        'rounded-lg overflow-hidden bg-white dark:bg-gray-900',
        className
      )}
    >
      <CardHeader className={cn(
        'flex flex-row items-center justify-between bg-gray-50 dark:bg-gray-800/50 px-5 py-4',
        headerClassName
      )}>
        <div>
          <CardTitle className="text-lg font-homenaje">{title}</CardTitle>
          {description && (
            <CardDescription className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {description}
            </CardDescription>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {headerAction}
          
          {collapsible && (
            <Button
              variant="ghost"
              size="sm"
              className="p-1 h-8 w-8 rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              {isCollapsed ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
            </Button>
          )}
        </div>
      </CardHeader>
      
      {!isCollapsed && (
        <>
          <CardContent className={cn(
            padded ? 'p-5' : 'p-0',
            bodyClassName
          )}>
            {children}
          </CardContent>
          
          {footer && (
            <CardFooter className={cn(
              'border-t border-gray-100 dark:border-gray-800 px-5 py-4 bg-gray-50/50 dark:bg-gray-800/20',
              footerClassName
            )}>
              {footer}
            </CardFooter>
          )}
        </>
      )}
    </Card>
  );
}