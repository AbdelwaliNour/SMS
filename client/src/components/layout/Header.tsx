import { useState, useEffect } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const Header = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState("");

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
    }
  };

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-divider dark:border-gray-700 py-4 px-6 flex items-center justify-between">
      {/* Search Bar */}
      <div className="relative w-96">
        <Input
          type="text"
          placeholder="Search......"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="pl-4 pr-10 py-2 w-full"
        />
        <button
          onClick={handleSearch}
          className="absolute right-3 top-2.5 text-blue"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>
      </div>

      {/* Date & Time - Centered */}
      <div className="absolute left-1/2 transform -translate-x-1/2 text-center">
        <p className="text-xl font-bold text-blue">{formattedTime}</p>
        <p className="text-gray-600 dark:text-gray-300 text-sm">
          {formattedDate}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center space-x-4">
        <div className="relative">
          <Button
            size="icon"
            className="w-10 h-10 rounded-full bg-blue hover:bg-blue/90 text-white"
            onClick={() => alert("Notifications")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            <span className="absolute -top-1 -right-1 bg-red text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
              3
            </span>
          </Button>
        </div>
        <Button
          size="icon"
          className="w-10 h-10 rounded-full bg-blue hover:bg-blue/90 text-white"
          onClick={() => alert("Settings")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </Button>
      </div>
    </header>
  );
};

export default Header;
