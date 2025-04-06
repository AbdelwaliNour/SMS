import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ResponsiveCardProps {
  title?: string;
  description?: string;
  className?: string;
  contentClassName?: string;
  headerClassName?: string;
  footerClassName?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  headerAction?: React.ReactNode;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  padded?: boolean;
}

export function ResponsiveCard({
  title,
  description,
  className,
  contentClassName,
  headerClassName,
  footerClassName,
  children,
  footer,
  headerAction,
  collapsible = false,
  defaultCollapsed = false,
  padded = true,
}: ResponsiveCardProps) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Card className={cn("shadow-sm", className)}>
      {(title || headerAction) && (
        <CardHeader className={cn("flex flex-row items-center justify-between space-y-0 pb-2", headerClassName)}>
          <div>
            {title && <CardTitle className="text-lg font-homenaje">{title}</CardTitle>}
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          
          <div className="flex items-center space-x-2">
            {headerAction}
            
            {collapsible && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0" 
                onClick={toggleCollapse}
              >
                {collapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
              </Button>
            )}
          </div>
        </CardHeader>
      )}
      
      {!collapsed && (
        <>
          <CardContent className={cn("pt-2", !padded && "p-0", contentClassName)}>
            {children}
          </CardContent>
          
          {footer && (
            <CardFooter className={cn("flex justify-between pt-0", footerClassName)}>
              {footer}
            </CardFooter>
          )}
        </>
      )}
    </Card>
  );
}