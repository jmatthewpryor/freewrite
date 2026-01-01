'use client';

import { useFreewriteStore } from '@/stores/freewrite';
import { useEntries } from '@/hooks/useEntries';
import { Button } from '@/components/ui/Button';
import {
  SunIcon,
  MoonIcon,
  MaximizeIcon,
  MinimizeIcon,
  PlusIcon,
  SidebarIcon,
} from '@/components/ui/Icons';
import { Timer } from './Timer';
import { FontControls } from './FontControls';
import { ChatMenu } from './ChatMenu';
import { cn } from '@/lib/utils';

export function Toolbar() {
  const {
    theme,
    isFullscreen,
    showSidebar,
    backspaceDisabled,
    toolbarVisible,
    timerRunning,
    toggleTheme,
    toggleFullscreen,
    toggleSidebar,
    toggleBackspace,
    setToolbarVisible,
  } = useFreewriteStore();
  const { newEntry } = useEntries();

  // Show toolbar on hover when timer is running
  const handleMouseEnter = () => {
    if (timerRunning) {
      setToolbarVisible(true);
    }
  };

  const handleMouseLeave = () => {
    if (timerRunning) {
      // Delay hiding to allow for interaction
      setTimeout(() => {
        setToolbarVisible(false);
      }, 1000);
    }
  };

  return (
    <div
      className={cn(
        'fixed bottom-0 left-0 right-0',
        'transition-opacity duration-300',
        toolbarVisible ? 'opacity-100' : 'opacity-0 hover:opacity-100'
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className={cn(
          'mx-auto max-w-5xl px-4 py-3',
          'flex items-center justify-between',
          'bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm',
          'border-t border-neutral-200 dark:border-neutral-800'
        )}
      >
        {/* Left section - Font controls */}
        <FontControls />

        {/* Right section - Utility controls */}
        <div className="flex items-center gap-1">
          {/* Timer */}
          <Timer />

          {/* Chat menu */}
          <ChatMenu />

          {/* Backspace toggle */}
          <Button
            variant="ghost"
            size="sm"
            active={backspaceDisabled}
            onClick={toggleBackspace}
            title={backspaceDisabled ? 'Backspace disabled' : 'Backspace enabled'}
            className={cn(
              'text-xs px-2',
              backspaceDisabled && 'text-red-500 dark:text-red-400'
            )}
          >
            {backspaceDisabled ? 'BS Off' : 'BS On'}
          </Button>

          {/* Fullscreen toggle */}
          <Button
            variant="icon"
            size="sm"
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          >
            {isFullscreen ? (
              <MinimizeIcon className="w-4 h-4" />
            ) : (
              <MaximizeIcon className="w-4 h-4" />
            )}
          </Button>

          {/* New entry */}
          <Button
            variant="icon"
            size="sm"
            onClick={newEntry}
            title="New entry"
          >
            <PlusIcon className="w-4 h-4" />
          </Button>

          {/* Theme toggle */}
          <Button
            variant="icon"
            size="sm"
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
          >
            {theme === 'dark' ? (
              <SunIcon className="w-4 h-4" />
            ) : (
              <MoonIcon className="w-4 h-4" />
            )}
          </Button>

          {/* Sidebar toggle */}
          <Button
            variant="icon"
            size="sm"
            active={showSidebar}
            onClick={toggleSidebar}
            title="Toggle history"
          >
            <SidebarIcon className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
