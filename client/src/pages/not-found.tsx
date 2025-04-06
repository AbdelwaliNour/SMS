import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Home, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import { useIsMobile } from "@/hooks/use-mobile";

export default function NotFound() {
  const [, navigate] = useLocation();
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md border dark:border-gray-800 shadow-lg">
        <CardContent className="pt-8 pb-6 px-6">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-20 h-20 rounded-full bg-red/10 flex items-center justify-center mb-4">
              <AlertCircle className="h-12 w-12 text-red" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white font-homenaje tracking-wide">
              404 - Page Not Found
            </h1>
            <p className="mt-4 text-gray-600 dark:text-gray-300">
              The page you are looking for doesn't exist or has been moved.
            </p>
          </div>
        </CardContent>
        <CardFooter className="pb-8 px-6 flex flex-col sm:flex-row gap-3 sm:gap-4">
          <Button 
            className="w-full sm:w-auto" 
            variant="outline"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
          <Button 
            className="w-full sm:w-auto" 
            onClick={() => navigate("/dashboard")}
          >
            <Home className="h-4 w-4 mr-2" />
            Go to Dashboard
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
