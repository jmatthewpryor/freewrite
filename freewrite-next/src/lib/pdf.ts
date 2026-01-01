/**
 * PDF export functionality using jsPDF
 */

import { jsPDF } from 'jspdf';

interface PDFOptions {
  title?: string;
  fontSize?: number;
  fontFamily?: string;
  lineHeight?: number;
  margin?: number;
}

const DEFAULT_OPTIONS: Required<PDFOptions> = {
  title: 'Freewrite Entry',
  fontSize: 12,
  fontFamily: 'helvetica',
  lineHeight: 1.5,
  margin: 40,
};

/**
 * Extract title from entry text (first 4 words)
 */
export const extractTitle = (text: string): string => {
  const words = text.trim().split(/\s+/).slice(0, 4);
  if (words.length === 0) return 'Untitled';
  return words.join(' ') + (text.trim().split(/\s+/).length > 4 ? '...' : '');
};

/**
 * Generate PDF from entry text
 */
export const generatePDF = (content: string, options: PDFOptions = {}): jsPDF => {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  // Create PDF document (A4 size)
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const textWidth = pageWidth - (opts.margin * 2);

  // Set font
  doc.setFont(opts.fontFamily);
  doc.setFontSize(opts.fontSize);

  // Split text into lines that fit within page width
  const lines = doc.splitTextToSize(content, textWidth);

  // Calculate line height in points
  const lineHeightPt = opts.fontSize * opts.lineHeight;

  let y = opts.margin;

  for (const line of lines) {
    // Check if we need a new page
    if (y + lineHeightPt > pageHeight - opts.margin) {
      doc.addPage();
      y = opts.margin;
    }

    doc.text(line, opts.margin, y);
    y += lineHeightPt;
  }

  return doc;
};

/**
 * Generate PDF and return as blob
 */
export const generatePDFBlob = (content: string, options: PDFOptions = {}): Blob => {
  const doc = generatePDF(content, options);
  return doc.output('blob');
};

/**
 * Generate PDF and return as Uint8Array (for Tauri file saving)
 */
export const generatePDFBytes = (content: string, options: PDFOptions = {}): Uint8Array => {
  const doc = generatePDF(content, options);
  return doc.output('arraybuffer') as unknown as Uint8Array;
};

/**
 * Download PDF in browser (fallback for non-Tauri)
 */
export const downloadPDF = (content: string, filename: string, options: PDFOptions = {}): void => {
  const doc = generatePDF(content, options);
  doc.save(filename);
};

/**
 * Generate a safe filename from title
 */
export const generatePDFFilename = (title: string): string => {
  const safe = title
    .replace(/[^a-zA-Z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .toLowerCase()
    .slice(0, 50);
  return `${safe || 'freewrite'}.pdf`;
};
