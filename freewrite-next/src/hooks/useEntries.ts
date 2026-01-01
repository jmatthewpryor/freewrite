'use client';

import { useEffect, useCallback, useRef } from 'react';
import { useFreewriteStore } from '@/stores/freewrite';
import {
  isTauri,
  loadEntries,
  saveEntry,
  loadEntry,
  deleteEntry as deleteEntryFile,
  ensureFreewriteDir,
  generateEntryFilename,
  formatEntryDate,
  webFallback,
} from '@/lib/tauri';
import { debounce, generateId } from '@/lib/utils';
import type { Entry } from '@/types';

const WELCOME_MESSAGE = `Welcome to Freewrite!

This is your space to think freely. Set a timer, start writing, and let your thoughts flow without judgment or editing.

Tips:
- Use the timer (scroll to adjust) to set focused writing sessions
- Toggle backspace off to encourage continuous flow
- Send your entries to ChatGPT or Claude for reflection
- Your entries are saved automatically as you type

Start writing below...`;

/**
 * Hook for managing entries
 * Handles loading, saving, creating, and deleting entries
 */
export function useEntries() {
  const {
    currentText,
    selectedEntryId,
    entries,
    setText,
    setSelectedEntryId,
    setEntries,
    addEntry,
    removeEntry,
    updateEntryPreview,
  } = useFreewriteStore();

  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isInitializedRef = useRef(false);

  // Create a new entry
  const createNewEntry = useCallback(async (initialContent: string = ''): Promise<Entry> => {
    const id = generateId();
    const now = new Date();
    const filename = generateEntryFilename(id);

    const entry: Entry = {
      id,
      date: formatEntryDate(now),
      filename,
      previewText: initialContent.slice(0, 30).replace(/\n/g, ' '),
      createdAt: now,
    };

    // Save the entry
    if (isTauri()) {
      await saveEntry(id, filename, initialContent);
    } else {
      webFallback.saveEntry(id, filename, initialContent);
    }

    addEntry(entry);
    setSelectedEntryId(id);
    setText(initialContent);

    return entry;
  }, [addEntry, setSelectedEntryId, setText]);

  // Load entries on mount
  useEffect(() => {
    if (isInitializedRef.current) return;
    isInitializedRef.current = true;

    const init = async () => {
      try {
        let loadedEntries: Entry[];

        if (isTauri()) {
          await ensureFreewriteDir();
          loadedEntries = await loadEntries();
        } else {
          loadedEntries = webFallback.loadEntries();
        }

        if (loadedEntries.length === 0) {
          // First time user - create welcome entry
          await createNewEntry(WELCOME_MESSAGE);
        } else {
          setEntries(loadedEntries);
          // Select the first (newest) entry
          const firstEntry = loadedEntries[0];
          setSelectedEntryId(firstEntry.id);

          // Load the entry content
          if (isTauri()) {
            const content = await loadEntry(firstEntry.filename);
            setText(content);
          } else {
            const content = webFallback.loadEntry(firstEntry.id);
            setText(content);
          }
        }
      } catch (error) {
        console.error('Failed to initialize entries:', error);
        // Create a new entry as fallback
        await createNewEntry('');
      }
    };

    init();
  }, [createNewEntry, setEntries, setSelectedEntryId, setText]);

  // Auto-save debounced
  const debouncedSave = useRef(
    debounce((id: string, filename: string, content: string) => {
      const doSave = async () => {
        try {
          if (isTauri()) {
            await saveEntry(id, filename, content);
          } else {
            webFallback.saveEntry(id, filename, content);
          }
          // Update preview
          const preview = content.slice(0, 30).replace(/\n/g, ' ');
          updateEntryPreview(id, preview);
        } catch (error) {
          console.error('Failed to save entry:', error);
        }
      };
      doSave();
    }, 500)
  ).current;

  // Save when text changes
  useEffect(() => {
    if (!selectedEntryId) return;

    const entry = entries.find(e => e.id === selectedEntryId);
    if (!entry) return;

    debouncedSave(entry.id, entry.filename, currentText);
  }, [currentText, selectedEntryId, entries]);

  // Select an entry
  const selectEntry = useCallback(async (id: string) => {
    const entry = entries.find(e => e.id === id);
    if (!entry) return;

    setSelectedEntryId(id);

    try {
      if (isTauri()) {
        const content = await loadEntry(entry.filename);
        setText(content);
      } else {
        const content = webFallback.loadEntry(id);
        setText(content);
      }
    } catch (error) {
      console.error('Failed to load entry:', error);
      setText('');
    }
  }, [entries, setSelectedEntryId, setText]);

  // Delete an entry
  const deleteSelectedEntry = useCallback(async (id: string) => {
    const entry = entries.find(e => e.id === id);
    if (!entry) return;

    try {
      if (isTauri()) {
        await deleteEntryFile(entry.filename);
      } else {
        webFallback.deleteEntry(id);
      }

      removeEntry(id);

      // Select another entry or create new one
      const remainingEntries = entries.filter(e => e.id !== id);
      if (remainingEntries.length > 0) {
        await selectEntry(remainingEntries[0].id);
      } else {
        await createNewEntry('');
      }
    } catch (error) {
      console.error('Failed to delete entry:', error);
    }
  }, [entries, removeEntry, selectEntry, createNewEntry]);

  // Create a new empty entry
  const newEntry = useCallback(async () => {
    await createNewEntry('');
  }, [createNewEntry]);

  return {
    currentText,
    selectedEntryId,
    entries,
    setText,
    selectEntry,
    deleteEntry: deleteSelectedEntry,
    newEntry,
  };
}
