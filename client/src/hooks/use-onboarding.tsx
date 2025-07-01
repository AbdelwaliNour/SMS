import { useState, useEffect } from 'react';

interface OnboardingState {
  isFirstVisit: boolean;
  hasCompletedWizard: boolean;
  showWelcomeWizard: boolean;
}

const ONBOARDING_STORAGE_KEY = 'edumanager-onboarding';

export const useOnboarding = () => {
  const [state, setState] = useState<OnboardingState>({
    isFirstVisit: true,
    hasCompletedWizard: false,
    showWelcomeWizard: false,
  });

  useEffect(() => {
    // Load onboarding state from localStorage
    const savedState = localStorage.getItem(ONBOARDING_STORAGE_KEY);
    
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        setState({
          isFirstVisit: false,
          hasCompletedWizard: parsed.hasCompletedWizard || false,
          showWelcomeWizard: false,
        });
      } catch (error) {
        console.error('Error parsing onboarding state:', error);
        // If there's an error, treat as first visit
        setState(prev => ({ ...prev, showWelcomeWizard: true }));
      }
    } else {
      // First visit - show welcome wizard after a short delay
      setTimeout(() => {
        setState(prev => ({ ...prev, showWelcomeWizard: true }));
      }, 1000);
    }
  }, []);

  const completeOnboarding = () => {
    const newState = {
      hasCompletedWizard: true,
      lastCompletedDate: new Date().toISOString(),
    };
    
    localStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify(newState));
    
    setState({
      isFirstVisit: false,
      hasCompletedWizard: true,
      showWelcomeWizard: false,
    });
  };

  const showWizard = () => {
    setState(prev => ({ ...prev, showWelcomeWizard: true }));
  };

  const hideWizard = () => {
    setState(prev => ({ ...prev, showWelcomeWizard: false }));
  };

  const resetOnboarding = () => {
    localStorage.removeItem(ONBOARDING_STORAGE_KEY);
    setState({
      isFirstVisit: true,
      hasCompletedWizard: false,
      showWelcomeWizard: true,
    });
  };

  return {
    ...state,
    completeOnboarding,
    showWizard,
    hideWizard,
    resetOnboarding,
  };
};