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
    <header className="glass-morphism border-b border-border/50 py-4 px-6 flex items-center justify-between backdrop-blur-xl">
      {/* Left section - Modern branding on mobile */}
      {isMobile && (
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-primary to-purple-600 rounded-lg"></div>
          <span className="text-lg font-bold text-gradient">EduSmart</span>
        </div>
      )}

      {/* Modern Search Bar */}
      <div
        className={cn(
          "relative transition-all duration-300 ease-in-out",
          isMobile
            ? isSearchOpen
              ? "w-full absolute left-0 top-0 z-20 glass-morphism p-4"
              : "w-auto"
            : "w-96",
        )}
      >
        {isMobile && !isSearchOpen ? (
          <Button
            size="icon"
            variant="ghost"
            className="w-10 h-10 rounded-xl hover:bg-primary/10 transition-all duration-300"
            onClick={() => setIsSearchOpen(true)}
          >
            <Search className="h-5 w-5" />
          </Button>
        ) : (
          <div className="relative">
            <Input
              type="text"
              placeholder="Search students, courses, reports..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="pl-12 pr-4 py-3 rounded-xl border-border/50 bg-background/50 backdrop-blur-sm"
              autoFocus={isMobile && isSearchOpen}
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            {isMobile && isSearchOpen && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSearchOpen(false)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
              >
                Cancel
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Modern Date & Time Display */}
      {!isMobile && (
        <div className="absolute left-1/2 transform -translate-x-1/2 text-center hidden md:block">
          <div className="glass-morphism px-4 py-2 rounded-xl border border-border/30">
            <p className="text-lg font-mono text-primary font-semibold">{formattedTime}</p>
            <p className="text-xs text-muted-foreground">
              {formattedDate}
            </p>
          </div>
        </div>
      )}

      {/* Modern Action Buttons */}
      <div className="flex items-center space-x-2">
        {/* Theme toggle */}
        <Button
          size="icon"
          variant="ghost"
          className="w-10 h-10 rounded-xl hover:bg-primary/10 transition-all duration-300"
          onClick={toggleTheme}
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5 text-amber-500" />
          ) : (
            <Moon className="h-5 w-5 text-slate-600" />
          )}
        </Button>

        {/* Only show these on desktop or when search is closed on mobile */}
        {(!isMobile || !isSearchOpen) && (
          <>
            <div className="relative">
              <Button
                size="icon"
                className="w-10 h-10 rounded-xl bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white shadow-lg transition-all duration-300 hover:scale-105"
                onClick={() => alert("Notifications")}
              >
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full animate-pulse">
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
