import { useState, useEffect, useCallback } from 'react';

export const useUserActivity = (timeoutMs: number = 5000) => {
  const [isActive, setIsActive] = useState(false);
  const [lastActivity, setLastActivity] = useState(Date.now());

  const updateActivity = useCallback(() => {
    setLastActivity(Date.now());
    setIsActive(true);
  }, []);

  useEffect(() => {
    const events = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click',
      'focus',
      'input'
    ];

    // Add event listeners
    events.forEach(event => {
      document.addEventListener(event, updateActivity, true);
    });

    // Cleanup
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, updateActivity, true);
      });
    };
  }, [updateActivity]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      if (now - lastActivity > timeoutMs) {
        setIsActive(false);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lastActivity, timeoutMs]);

  return isActive;
};