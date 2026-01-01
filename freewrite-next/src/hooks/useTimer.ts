'use client';

import { useEffect, useCallback, useRef } from 'react';
import { useFreewriteStore } from '@/stores/freewrite';
import { TIMER_STEP_MINUTES, MIN_TIMER_MINUTES, MAX_TIMER_MINUTES } from '@/types';

/**
 * Hook for managing the timer functionality
 * Handles countdown, wheel adjustment, and timer state
 */
export function useTimer() {
  const {
    timeRemaining,
    timerRunning,
    initialTime,
    tickTimer,
    adjustTime,
    startTimer,
    stopTimer,
    resetTimer,
    setToolbarVisible,
  } = useFreewriteStore();

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Timer tick effect
  useEffect(() => {
    if (timerRunning) {
      intervalRef.current = setInterval(() => {
        tickTimer();
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [timerRunning, tickTimer]);

  // Stop timer when it reaches 0
  useEffect(() => {
    if (timeRemaining <= 0 && timerRunning) {
      stopTimer();
      // Optionally play a sound or show notification here
    }
  }, [timeRemaining, timerRunning, stopTimer]);

  // Hide toolbar when timer is running (with delay)
  useEffect(() => {
    if (timerRunning) {
      const hideTimeout = setTimeout(() => {
        setToolbarVisible(false);
      }, 2000);
      return () => clearTimeout(hideTimeout);
    } else {
      setToolbarVisible(true);
    }
  }, [timerRunning, setToolbarVisible]);

  // Handle wheel scroll to adjust time
  const handleWheel = useCallback((event: WheelEvent) => {
    event.preventDefault();

    // Determine scroll direction
    const delta = event.deltaY > 0 ? -1 : 1;
    const stepSeconds = TIMER_STEP_MINUTES * 60;

    adjustTime(delta * stepSeconds);
  }, [adjustTime]);

  // Toggle timer on click
  const toggleTimer = useCallback(() => {
    if (timerRunning) {
      stopTimer();
    } else if (timeRemaining > 0) {
      startTimer();
    }
  }, [timerRunning, timeRemaining, startTimer, stopTimer]);

  // Format time for display
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return {
    timeRemaining,
    timerRunning,
    initialTime,
    formattedTime: formatTime(timeRemaining),
    handleWheel,
    toggleTimer,
    startTimer,
    stopTimer,
    resetTimer,
  };
}
