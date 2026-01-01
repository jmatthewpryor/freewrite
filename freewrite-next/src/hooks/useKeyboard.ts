'use client';

import { useEffect, useCallback } from 'react';
import { useFreewriteStore } from '@/stores/freewrite';

/**
 * Hook for handling keyboard events
 * Manages backspace blocking and other keyboard shortcuts
 */
export function useKeyboard() {
  const { backspaceDisabled, toggleFullscreen, toggleSidebar, toggleTheme } = useFreewriteStore();

  // Handle keydown events
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Block backspace if disabled
    if (backspaceDisabled && event.key === 'Backspace') {
      event.preventDefault();
      return;
    }

    // Keyboard shortcuts with Cmd/Ctrl
    if (event.metaKey || event.ctrlKey) {
      switch (event.key) {
        case 'f':
          // Cmd+F for fullscreen (if not in text field for search)
          if (event.shiftKey) {
            event.preventDefault();
            toggleFullscreen();
          }
          break;
        case '\\':
          // Cmd+\ for sidebar
          event.preventDefault();
          toggleSidebar();
          break;
        case 'd':
          // Cmd+D for dark mode toggle
          if (event.shiftKey) {
            event.preventDefault();
            toggleTheme();
          }
          break;
      }
    }

    // Escape key handling
    if (event.key === 'Escape') {
      // Could be used to exit fullscreen or close sidebar
    }
  }, [backspaceDisabled, toggleFullscreen, toggleSidebar, toggleTheme]);

  // Attach event listener
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return {
    backspaceDisabled,
  };
}
