'use client';

import { useFreewriteStore } from '@/stores/freewrite';
import { Button } from '@/components/ui/Button';
import { DiceIcon } from '@/components/ui/Icons';
import { cn } from '@/lib/utils';
import type { FontFamily } from '@/types';

const FONT_BUTTONS: { family: FontFamily; label: string }[] = [
  { family: 'lato', label: 'Lato' },
  { family: 'arial', label: 'Arial' },
  { family: 'system', label: 'System' },
  { family: 'serif', label: 'Serif' },
];

export function FontControls() {
  const { fontSize, fontFamily, cycleFontSize, setFontFamily, setRandomFont } = useFreewriteStore();

  return (
    <div className="flex items-center gap-1">
      {/* Font size button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={cycleFontSize}
        className="font-mono min-w-[40px]"
        title="Cycle font size"
      >
        {fontSize}
      </Button>

      {/* Divider */}
      <div className="w-px h-4 bg-neutral-300 dark:bg-neutral-600 mx-1" />

      {/* Font family buttons */}
      {FONT_BUTTONS.map(({ family, label }) => (
        <Button
          key={family}
          variant="ghost"
          size="sm"
          active={fontFamily === family}
          onClick={() => setFontFamily(family)}
          className={cn(
            'text-xs px-2',
            fontFamily === family && 'font-semibold'
          )}
        >
          {label}
        </Button>
      ))}

      {/* Random font button */}
      <Button
        variant="icon"
        size="sm"
        onClick={setRandomFont}
        title="Random font"
      >
        <DiceIcon className="w-4 h-4" />
      </Button>
    </div>
  );
}
