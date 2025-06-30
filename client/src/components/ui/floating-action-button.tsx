import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';

interface FloatingActionButtonProps extends React.ComponentProps<typeof Button> {
  className?: string;
  icon?: React.ReactNode;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  className,
  icon = <Plus className="h-6 w-6" />,
  children,
  ...props
}) => {
  return (
    <Button
      size="lg"
      className={cn(
        "fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl",
        "bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90",
        "transition-all duration-300 hover:scale-110 z-50",
        "glass-morphism border-primary/20",
        className
      )}
      {...props}
    >
      {children || icon}
    </Button>
  );
};