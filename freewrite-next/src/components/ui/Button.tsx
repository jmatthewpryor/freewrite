'use client';

import { forwardRef, ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'ghost' | 'icon';
  size?: 'sm' | 'md' | 'lg';
  active?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', active, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-md font-medium transition-all duration-150',
          'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent',
          'disabled:opacity-50 disabled:cursor-not-allowed',

          // Variants
          variant === 'default' && [
            'bg-neutral-200 dark:bg-neutral-700',
            'text-neutral-900 dark:text-neutral-100',
            'hover:bg-neutral-300 dark:hover:bg-neutral-600',
            'focus:ring-neutral-400 dark:focus:ring-neutral-500',
          ],
          variant === 'ghost' && [
            'bg-transparent',
            'text-neutral-600 dark:text-neutral-400',
            'hover:bg-neutral-100 dark:hover:bg-neutral-800',
            'hover:text-neutral-900 dark:hover:text-neutral-100',
          ],
          variant === 'icon' && [
            'bg-transparent',
            'text-neutral-500 dark:text-neutral-400',
            'hover:text-neutral-900 dark:hover:text-neutral-100',
            'hover:bg-neutral-100 dark:hover:bg-neutral-800',
          ],

          // Sizes
          size === 'sm' && 'h-7 px-2 text-xs',
          size === 'md' && 'h-8 px-3 text-sm',
          size === 'lg' && 'h-10 px-4 text-base',

          // Icon size adjustments
          variant === 'icon' && size === 'sm' && 'h-7 w-7 p-0',
          variant === 'icon' && size === 'md' && 'h-8 w-8 p-0',
          variant === 'icon' && size === 'lg' && 'h-10 w-10 p-0',

          // Active state
          active && 'bg-neutral-200 dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100',

          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
