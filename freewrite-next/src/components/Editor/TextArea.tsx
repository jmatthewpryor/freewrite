'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { useFreewriteStore } from '@/stores/freewrite';
import { useEntries } from '@/hooks/useEntries';
import { useKeyboard } from '@/hooks/useKeyboard';
import { cn } from '@/lib/utils';
import { FONT_FAMILIES, PLACEHOLDER_PROMPTS } from '@/types';
import { randomItem } from '@/lib/utils';

export function TextArea() {
  const { fontFamily, fontSize, theme, backspaceDisabled } = useFreewriteStore();
  const { currentText, setText } = useEntries();
  useKeyboard();

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [placeholder, setPlaceholder] = useState(PLACEHOLDER_PROMPTS[0]);

  // Rotate placeholder on mount
  useEffect(() => {
    setPlaceholder(randomItem(PLACEHOLDER_PROMPTS));
  }, []);

  // Focus textarea on mount
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  // Handle text change
  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  }, [setText]);

  // Handle keydown for backspace blocking
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (backspaceDisabled && e.key === 'Backspace') {
      e.preventDefault();
    }
  }, [backspaceDisabled]);

  // Calculate line height based on font size
  const lineHeight = fontSize * 1.8;

  return (
    <div className="flex-1 w-full max-w-4xl mx-auto px-8 py-12">
      <textarea
        ref={textareaRef}
        value={currentText}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        spellCheck={false}
        className={cn(
          'w-full h-full resize-none outline-none',
          'bg-transparent',
          'placeholder:text-neutral-400 dark:placeholder:text-neutral-600',
          'text-neutral-900 dark:text-neutral-100',
          'transition-colors duration-200',
          'scrollbar-hide'
        )}
        style={{
          fontFamily: FONT_FAMILIES[fontFamily],
          fontSize: `${fontSize}px`,
          lineHeight: `${lineHeight}px`,
        }}
      />
    </div>
  );
}
