'use client';

import { useFreewriteStore } from '@/stores/freewrite';
import { useEntries } from '@/hooks/useEntries';
import { Button } from '@/components/ui/Button';
import { FolderIcon } from '@/components/ui/Icons';
import { EntryItem } from './EntryItem';
import { isTauri, openFreewriteDir } from '@/lib/tauri';
import { cn } from '@/lib/utils';

export function Sidebar() {
  const { showSidebar } = useFreewriteStore();
  const { entries, selectedEntryId, selectEntry, deleteEntry } = useEntries();

  const handleOpenFolder = async () => {
    if (isTauri()) {
      await openFreewriteDir();
    }
  };

  if (!showSidebar) return null;

  return (
    <div
      className={cn(
        'w-64 h-full border-l border-neutral-200 dark:border-neutral-800',
        'bg-white dark:bg-neutral-900',
        'flex flex-col',
        'animate-slide-in'
      )}
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
            History
          </h2>
          {isTauri() && (
            <Button
              variant="icon"
              size="sm"
              onClick={handleOpenFolder}
              title="Open in Finder"
              className="h-6 w-6"
            >
              <FolderIcon className="w-3.5 h-3.5" />
            </Button>
          )}
        </div>
      </div>

      {/* Entry list */}
      <div className="flex-1 overflow-y-auto">
        {entries.length === 0 ? (
          <div className="px-4 py-8 text-center">
            <p className="text-sm text-neutral-500">No entries yet</p>
          </div>
        ) : (
          <div className="py-1">
            {entries.map((entry, index) => (
              <div key={entry.id}>
                <EntryItem
                  entry={entry}
                  isSelected={entry.id === selectedEntryId}
                  onSelect={selectEntry}
                  onDelete={deleteEntry}
                />
                {index < entries.length - 1 && (
                  <div className="mx-3 border-b border-neutral-100 dark:border-neutral-800" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-2 border-t border-neutral-200 dark:border-neutral-800">
        <p className="text-xs text-neutral-500 text-center">
          {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
        </p>
      </div>
    </div>
  );
}
