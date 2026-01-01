/**
 * Tauri API wrappers for file system operations
 * These functions bridge between the React app and native Tauri commands
 */

import type { Entry } from '@/types';

// Check if we're running in Tauri
export const isTauri = (): boolean => {
  if (typeof window === 'undefined') return false;
  return '__TAURI__' in window;
};

// Dynamic import of Tauri APIs (only works in Tauri context)
const getTauriApis = async () => {
  if (!isTauri()) {
    throw new Error('Not running in Tauri context');
  }

  const [fs, dialog, shell, path] = await Promise.all([
    import('@tauri-apps/plugin-fs'),
    import('@tauri-apps/plugin-dialog'),
    import('@tauri-apps/plugin-shell'),
    import('@tauri-apps/api/path'),
  ]);

  return { fs, dialog, shell, path };
};

// Get the Freewrite directory path
export const getFreewriteDir = async (): Promise<string> => {
  const { path } = await getTauriApis();
  const documentsDir = await path.documentDir();
  return `${documentsDir}Freewrite`;
};

// Ensure the Freewrite directory exists
export const ensureFreewriteDir = async (): Promise<void> => {
  const { fs } = await getTauriApis();
  const dir = await getFreewriteDir();

  try {
    await fs.mkdir(dir, { recursive: true });
  } catch (error) {
    // Directory might already exist
    console.log('Directory exists or created:', dir);
  }
};

// Generate a new entry filename
export const generateEntryFilename = (id: string): string => {
  const now = new Date();
  const dateStr = now.toISOString()
    .replace(/[T:]/g, '-')
    .replace(/\..+/, '')
    .slice(0, 19);
  return `[${id}]-[${dateStr}].md`;
};

// Parse entry info from filename
export const parseEntryFilename = (filename: string): { id: string; date: Date } | null => {
  const match = filename.match(/\[([^\]]+)\]-\[(\d{4}-\d{2}-\d{2}-\d{2}-\d{2}-\d{2})\]\.md/);
  if (!match) return null;

  const [, id, dateStr] = match;
  const [year, month, day, hour, minute, second] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day, hour, minute, second);

  return { id, date };
};

// Format date for display
export const formatEntryDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

// Load all entries from the Freewrite directory
export const loadEntries = async (): Promise<Entry[]> => {
  const { fs } = await getTauriApis();
  const dir = await getFreewriteDir();

  try {
    const files = await fs.readDir(dir);
    const entries: Entry[] = [];

    for (const file of files) {
      if (!file.name?.endsWith('.md')) continue;

      const parsed = parseEntryFilename(file.name);
      if (!parsed) continue;

      // Read first 30 characters for preview
      const filePath = `${dir}/${file.name}`;
      const content = await fs.readTextFile(filePath);
      const previewText = content.slice(0, 30).replace(/\n/g, ' ');

      entries.push({
        id: parsed.id,
        date: formatEntryDate(parsed.date),
        filename: file.name,
        previewText,
        createdAt: parsed.date,
      });
    }

    // Sort by date, newest first
    entries.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    return entries;
  } catch (error) {
    console.error('Failed to load entries:', error);
    return [];
  }
};

// Save entry content
export const saveEntry = async (id: string, filename: string, content: string): Promise<void> => {
  const { fs } = await getTauriApis();
  const dir = await getFreewriteDir();

  await ensureFreewriteDir();
  const filePath = `${dir}/${filename}`;
  await fs.writeTextFile(filePath, content);
};

// Load entry content
export const loadEntry = async (filename: string): Promise<string> => {
  const { fs } = await getTauriApis();
  const dir = await getFreewriteDir();

  const filePath = `${dir}/${filename}`;
  return await fs.readTextFile(filePath);
};

// Delete an entry
export const deleteEntry = async (filename: string): Promise<void> => {
  const { fs } = await getTauriApis();
  const dir = await getFreewriteDir();

  const filePath = `${dir}/${filename}`;
  await fs.remove(filePath);
};

// Open the Freewrite directory in Finder
export const openFreewriteDir = async (): Promise<void> => {
  const { shell } = await getTauriApis();
  const dir = await getFreewriteDir();
  await shell.open(dir);
};

// Open URL in default browser
export const openUrl = async (url: string): Promise<void> => {
  const { shell } = await getTauriApis();
  await shell.open(url);
};

// Show save dialog for PDF export
export const showSaveDialog = async (defaultName: string): Promise<string | null> => {
  const { dialog } = await getTauriApis();

  const result = await dialog.save({
    defaultPath: defaultName,
    filters: [{ name: 'PDF', extensions: ['pdf'] }],
  });

  return result;
};

// Write binary file (for PDF)
export const writeBinaryFile = async (filePath: string, data: Uint8Array): Promise<void> => {
  const { fs } = await getTauriApis();
  await fs.writeFile(filePath, data);
};

// Fallback implementations for web/development
export const webFallback = {
  loadEntries: (): Entry[] => {
    const stored = localStorage.getItem('freewrite-entries');
    if (!stored) return [];
    return JSON.parse(stored);
  },

  saveEntry: (id: string, _filename: string, content: string): void => {
    const entries = webFallback.loadEntries();
    const index = entries.findIndex(e => e.id === id);

    if (index >= 0) {
      entries[index].previewText = content.slice(0, 30).replace(/\n/g, ' ');
    }

    localStorage.setItem('freewrite-entries', JSON.stringify(entries));
    localStorage.setItem(`freewrite-content-${id}`, content);
  },

  loadEntry: (id: string): string => {
    return localStorage.getItem(`freewrite-content-${id}`) || '';
  },

  deleteEntry: (id: string): void => {
    const entries = webFallback.loadEntries();
    const filtered = entries.filter(e => e.id !== id);
    localStorage.setItem('freewrite-entries', JSON.stringify(filtered));
    localStorage.removeItem(`freewrite-content-${id}`);
  },

  createEntry: (): Entry => {
    const id = crypto.randomUUID();
    const now = new Date();
    const entry: Entry = {
      id,
      date: formatEntryDate(now),
      filename: generateEntryFilename(id),
      previewText: '',
      createdAt: now,
    };

    const entries = webFallback.loadEntries();
    entries.unshift(entry);
    localStorage.setItem('freewrite-entries', JSON.stringify(entries));

    return entry;
  },

  openUrl: (url: string): void => {
    window.open(url, '_blank');
  },
};
