'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/Button';
import { TrashIcon, DownloadIcon } from '@/components/ui/Icons';
import { cn } from '@/lib/utils';
import type { Entry } from '@/types';
import { isTauri, loadEntry, showSaveDialog, writeBinaryFile, webFallback } from '@/lib/tauri';
import { extractTitle, generatePDFBytes, generatePDFFilename, downloadPDF } from '@/lib/pdf';

interface EntryItemProps {
  entry: Entry;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

export function EntryItem({ entry, isSelected, onSelect, onDelete }: EntryItemProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleExportPDF = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExporting(true);

    try {
      // Load the entry content
      let content: string;
      if (isTauri()) {
        content = await loadEntry(entry.filename);
      } else {
        content = webFallback.loadEntry(entry.id);
      }

      const title = extractTitle(content);
      const filename = generatePDFFilename(title);

      if (isTauri()) {
        // Use native save dialog
        const savePath = await showSaveDialog(filename);
        if (savePath) {
          const pdfBytes = generatePDFBytes(content, { title });
          await writeBinaryFile(savePath, pdfBytes);
        }
      } else {
        // Browser download
        downloadPDF(content, filename, { title });
      }
    } catch (error) {
      console.error('Failed to export PDF:', error);
    } finally {
      setIsExporting(false);
    }
  }, [entry.id, entry.filename]);

  const handleDelete = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Delete this entry?')) {
      onDelete(entry.id);
    }
  }, [entry.id, onDelete]);

  return (
    <div
      onClick={() => onSelect(entry.id)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        'group px-3 py-2 cursor-pointer',
        'transition-colors duration-150',
        'hover:bg-neutral-100 dark:hover:bg-neutral-800',
        isSelected && 'bg-neutral-100 dark:bg-neutral-800'
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p
            className={cn(
              'text-sm truncate',
              isSelected
                ? 'text-neutral-900 dark:text-neutral-100 font-medium'
                : 'text-neutral-700 dark:text-neutral-300'
            )}
          >
            {entry.previewText || 'Empty entry'}
          </p>
          <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-0.5">
            {entry.date}
          </p>
        </div>

        {/* Action buttons - visible on hover */}
        <div
          className={cn(
            'flex items-center gap-0.5',
            'transition-opacity duration-150',
            isHovered ? 'opacity-100' : 'opacity-0'
          )}
        >
          <Button
            variant="icon"
            size="sm"
            onClick={handleExportPDF}
            disabled={isExporting}
            title="Export as PDF"
            className="h-6 w-6"
          >
            <DownloadIcon className="w-3.5 h-3.5" />
          </Button>
          <Button
            variant="icon"
            size="sm"
            onClick={handleDelete}
            title="Delete entry"
            className="h-6 w-6 hover:text-red-500"
          >
            <TrashIcon className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
