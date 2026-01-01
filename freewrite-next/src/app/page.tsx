'use client';

import { useEffect } from 'react';
import { useFreewriteStore } from '@/stores/freewrite';
import { Editor } from '@/components/Editor';
import { Toolbar } from '@/components/Toolbar';
import { Sidebar } from '@/components/Sidebar';
import { cn } from '@/lib/utils';

export default function Home() {
  const { isFullscreen, toggleFullscreen } = useFreewriteStore();

  // Handle fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isNowFullscreen = !!document.fullscreenElement;
      if (isNowFullscreen !== isFullscreen) {
        toggleFullscreen();
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [isFullscreen, toggleFullscreen]);

  // Toggle browser fullscreen
  useEffect(() => {
    const toggleBrowserFullscreen = async () => {
      try {
        if (isFullscreen && !document.fullscreenElement) {
          await document.documentElement.requestFullscreen();
        } else if (!isFullscreen && document.fullscreenElement) {
          await document.exitFullscreen();
        }
      } catch (error) {
        console.log('Fullscreen not supported or denied');
      }
    };

    toggleBrowserFullscreen();
  }, [isFullscreen]);

  return (
    <main
      className={cn(
        'h-screen flex',
        'bg-white dark:bg-neutral-900',
        'transition-colors duration-200'
      )}
    >
      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Editor />
      </div>

      {/* Sidebar */}
      <Sidebar />

      {/* Toolbar */}
      <Toolbar />
    </main>
  );
}
