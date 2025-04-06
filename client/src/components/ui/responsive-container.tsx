import * as React from "react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

interface ResponsiveContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  backLink?: string;
  containerClassName?: string;
  headerClassName?: string;
  contentClassName?: string;
  showBackOnMobile?: boolean;
  maxWidthClass?: string;
}

export function ResponsiveContainer({
  children,
  title,
  backLink,
  className,
  containerClassName,
  headerClassName,
  contentClassName,
  showBackOnMobile = true,
  maxWidthClass = "max-w-5xl",
  ...props
}: ResponsiveContainerProps) {
  const isMobile = useIsMobile();
  const [, navigate] = useLocation();

  const handleBack = () => {
    if (backLink) {
      navigate(backLink);
    } else {
      window.history.back();
    }
  };

  return (
    <div
      className={cn(
        "w-full mx-auto px-4 py-6 md:px-6 md:py-8",
        maxWidthClass,
        containerClassName
      )}
      {...props}
    >
      {(title || (isMobile && showBackOnMobile)) && (
        <div
          className={cn(
            "flex items-center mb-6 pb-4 border-b dark:border-gray-800",
            headerClassName
          )}
        >
          {isMobile && showBackOnMobile && (
            <button
              onClick={handleBack}
              className="mr-3 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
          )}
          {title && (
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white font-homenaje tracking-wide">
              {title}
            </h1>
          )}
        </div>
      )}
      <div
        className={cn(
          "w-full",
          contentClassName
        )}
      >
        {children}
      </div>
    </div>
  );
}

interface FormContainerProps extends ResponsiveContainerProps {
  onSubmit?: (e: React.FormEvent) => void;
  formClassName?: string;
}

export function ResponsiveFormContainer({
  children,
  onSubmit,
  formClassName,
  ...props
}: FormContainerProps) {
  const isMobile = useIsMobile();

  const formClasses = cn(
    "space-y-6",
    isMobile ? "w-full" : "w-2/3 mx-auto",
    formClassName
  );

  return (
    <ResponsiveContainer {...props}>
      <form onSubmit={onSubmit} className={formClasses}>
        {children}
      </form>
    </ResponsiveContainer>
  );
}