import { useState, useEffect } from 'react';

/**
 * Hook to detect if the current viewport is a mobile device.
 * @param breakpoint The maximum width in pixels to consider a mobile viewport. Default is 768px.
 * @returns A boolean indicating if the current viewport is mobile.
 */
export function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    // Check viewport on initial load
    const checkMobile = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };
    
    // Set immediately on mount
    checkMobile();
    
    // Add event listener for resize events
    window.addEventListener('resize', checkMobile);
    
    // Cleanup event listener
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, [breakpoint]);
  
  return isMobile;
}