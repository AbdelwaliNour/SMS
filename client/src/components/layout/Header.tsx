import { useState, useEffect } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Search, Bell, Settings, Sun, Moon } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { AppTheme } from "@/App";
import { cn } from "@/lib/utils";

interface HeaderProps {
  theme: AppTheme;
  toggleTheme: () => void;
}

const Header = ({ theme, toggleTheme }: HeaderProps) => {
  const isMobile = useIsMobile();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Update time every second for more accurate time display
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Format time as HH:MM:SS
  const formattedTime = currentTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  // Format date as  DD, Month, YYYY
  const formattedDate = currentTime.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const handleSearch = () => {
    // Implement search functionality
    if (searchQuery.trim()) {
      alert(`Searching for: ${searchQuery}`);
      // In a real implementation, you would navigate to search results or filter content
      if (isMobile) {
        setIsSearchOpen(false);
      }
    }
  };

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-divider dark:border-gray-700 py-3 px-4 md:py-4 md:px-6 flex items-center justify-between">
      {/* Left section - Logo or branding on mobile */}
      {isMobile && (
        <div className="text-xl font-homenaje tracking-wider text-blue pl-2">
          School Manager
        </div>
      )}

      {/* Search Bar - Full on desktop, icon-only on mobile */}
      <div className={cn(
        "relative transition-all duration-300 ease-in-out",
        isMobile 
          ? isSearchOpen 
            ? "w-full absolute left-0 top-0 z-20 bg-white dark:bg-gray-900 p-3"
            : "w-auto" 
          : "w-96"
      )}>
        {isMobile && !isSearchOpen ? (
          <Button
            size="icon"
            variant="ghost"
            className="w-9 h-9 text-gray-600 dark:text-gray-300"
            onClick={() => setIsSearchOpen(true)}
          >
            <Search className="h-5 w-5" />
          </Button>
        ) : (
          <div className="flex">
            <Input
              type="text"
              placeholder="Search......"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="pl-4 pr-10 py-2 w-full"
              autoFocus={isMobile && isSearchOpen}
            />
            <div className="absolute right-0 top-0 flex items-center h-full">
              {isMobile && isSearchOpen && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsSearchOpen(false)}
                  className="h-full px-2 text-gray-500"
                >
                  Cancel
                </Button>
              )}
              <button
                onClick={handleSearch}
                className="h-full px-3 text-blue"
              >
                <Search className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Date & Time - Centered on desktop, hidden on mobile */}
      {!isMobile && (
        <div className="absolute left-1/2 transform -translate-x-1/2 text-center hidden md:block">
          <p className="text-xl font-bold text-blue">{formattedTime}</p>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            {formattedDate}
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center space-x-2 md:space-x-4">
        {/* Theme toggle */}
        <Button
          size="icon"
          variant="ghost"
          className="w-9 h-9 md:w-10 md:h-10 rounded-full text-gray-600 dark:text-gray-300"
          onClick={toggleTheme}
        >
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
        
        {/* Only show these on desktop or when search is closed on mobile */}
        {(!isMobile || !isSearchOpen) && (
          <>
            <div className="relative">
              <Button
                size="icon"
                className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-blue hover:bg-blue/90 text-white"
                onClick={() => alert("Notifications")}
              >
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-red text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  3
                </span>
              </Button>
            </div>
            <Button
              size="icon"
              className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-blue hover:bg-blue/90 text-white"
              onClick={() => alert("Settings")}
            >
              <Settings className="h-5 w-5" />
            </Button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
