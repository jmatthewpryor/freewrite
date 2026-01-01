'use client';

import { TextArea } from './TextArea';
import { cn } from '@/lib/utils';

export function Editor() {
  return (
    <div className={cn('flex-1 flex flex-col min-h-0', 'overflow-hidden')}>
      <TextArea />
    </div>
  );
}
