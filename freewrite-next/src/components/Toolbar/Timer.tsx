'use client';

import { useRef, useEffect, useCallback } from 'react';
import { useTimer } from '@/hooks/useTimer';
import { cn } from '@/lib/utils';

export function Timer() {
  const {
    formattedTime,
    timerRunning,
    handleWheel,
    toggleTimer,
  } = useTimer();

  const timerRef = useRef<HTMLButtonElement>(null);

  // Attach wheel event listener
  useEffect(() => {
    const element = timerRef.current;
    if (!element) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      handleWheel(e);
    };

    element.addEventListener('wheel', onWheel, { passive: false });
    return () => element.removeEventListener('wheel', onWheel);
  }, [handleWheel]);

  return (
    <button
      ref={timerRef}
      onClick={toggleTimer}
      className={cn(
        'px-3 py-1.5 rounded-md font-mono text-sm',
        'transition-all duration-200',
        'hover:bg-neutral-100 dark:hover:bg-neutral-800',
        'select-none cursor-pointer',
        timerRunning
          ? 'text-green-600 dark:text-green-400 font-semibold'
          : 'text-neutral-600 dark:text-neutral-400'
      )}
      title="Click to start/stop. Scroll to adjust time."
    >
      {formattedTime}
    </button>
  );
}
