'use client';

import { useState } from 'react';
import { useFreewriteStore } from '@/stores/freewrite';
import { Button } from '@/components/ui/Button';
import { Popover, PopoverContent } from '@/components/ui/Popover';
import { ChatIcon, CopyIcon, CheckIcon } from '@/components/ui/Icons';
import {
  getChatGPTUrl,
  getClaudeUrl,
  isEntryLongEnough,
  isUrlTooLong,
  getFullPrompt,
  copyToClipboard,
  MIN_ENTRY_LENGTH,
} from '@/lib/ai-prompts';
import { isTauri, openUrl, webFallback } from '@/lib/tauri';
import { cn } from '@/lib/utils';

export function ChatMenu() {
  const { currentText } = useFreewriteStore();
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState<'chatgpt' | 'claude' | null>(null);

  const hasEnoughText = isEntryLongEnough(currentText);
  const chatGptTooLong = isUrlTooLong(currentText, 'chatgpt');
  const claudeTooLong = isUrlTooLong(currentText, 'claude');

  const handleOpenUrl = async (url: string) => {
    if (isTauri()) {
      await openUrl(url);
    } else {
      webFallback.openUrl(url);
    }
    setIsOpen(false);
  };

  const handleCopy = async (type: 'chatgpt' | 'claude') => {
    const prompt = getFullPrompt(currentText, type);
    const success = await copyToClipboard(prompt);
    if (success) {
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    }
  };

  const handleChatGPT = () => {
    if (chatGptTooLong) {
      handleCopy('chatgpt');
    } else {
      handleOpenUrl(getChatGPTUrl(currentText));
    }
  };

  const handleClaude = () => {
    if (claudeTooLong) {
      handleCopy('claude');
    } else {
      handleOpenUrl(getClaudeUrl(currentText));
    }
  };

  return (
    <Popover
      open={isOpen}
      onOpenChange={setIsOpen}
      align="center"
      side="top"
      trigger={
        <Button variant="icon" size="sm" title="Chat with AI">
          <ChatIcon className="w-4 h-4" />
        </Button>
      }
    >
      <PopoverContent className="w-64">
        {!hasEnoughText ? (
          <div className="text-center py-2">
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Write at least {MIN_ENTRY_LENGTH} characters to chat with AI
            </p>
            <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">
              {currentText.length} / {MIN_ENTRY_LENGTH}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-xs text-neutral-500 dark:text-neutral-400 text-center mb-3">
              Send your entry to AI for reflection
            </p>

            <button
              onClick={handleChatGPT}
              className={cn(
                'w-full flex items-center justify-between px-3 py-2 rounded-md',
                'bg-neutral-100 dark:bg-neutral-700',
                'hover:bg-neutral-200 dark:hover:bg-neutral-600',
                'transition-colors duration-150'
              )}
            >
              <span className="font-medium text-sm">ChatGPT</span>
              {chatGptTooLong ? (
                copied === 'chatgpt' ? (
                  <CheckIcon className="w-4 h-4 text-green-500" />
                ) : (
                  <CopyIcon className="w-4 h-4 text-neutral-500" />
                )
              ) : (
                <span className="text-xs text-neutral-500">Open</span>
              )}
            </button>

            <button
              onClick={handleClaude}
              className={cn(
                'w-full flex items-center justify-between px-3 py-2 rounded-md',
                'bg-neutral-100 dark:bg-neutral-700',
                'hover:bg-neutral-200 dark:hover:bg-neutral-600',
                'transition-colors duration-150'
              )}
            >
              <span className="font-medium text-sm">Claude</span>
              {claudeTooLong ? (
                copied === 'claude' ? (
                  <CheckIcon className="w-4 h-4 text-green-500" />
                ) : (
                  <CopyIcon className="w-4 h-4 text-neutral-500" />
                )
              ) : (
                <span className="text-xs text-neutral-500">Open</span>
              )}
            </button>

            {(chatGptTooLong || claudeTooLong) && (
              <p className="text-xs text-neutral-500 text-center mt-2">
                Entry too long for URL. Click to copy prompt.
              </p>
            )}
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
