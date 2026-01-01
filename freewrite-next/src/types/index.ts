export interface Entry {
  id: string;
  date: string;
  filename: string;
  previewText: string;
  createdAt: Date;
}

export type FontFamily = 'lato' | 'arial' | 'system' | 'serif';
export type FontSize = 16 | 18 | 20 | 22 | 24 | 26;
export type Theme = 'light' | 'dark';

export interface EditorSettings {
  fontFamily: FontFamily;
  fontSize: FontSize;
  theme: Theme;
  backspaceDisabled: boolean;
}

export interface TimerState {
  timeRemaining: number;
  isRunning: boolean;
  initialTime: number;
}

export const FONT_FAMILIES: Record<FontFamily, string> = {
  lato: 'Lato, sans-serif',
  arial: 'Arial, sans-serif',
  system: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
  serif: 'Times New Roman, serif',
};

export const FONT_SIZES: FontSize[] = [16, 18, 20, 22, 24, 26];

export const PLACEHOLDER_PROMPTS = [
  "What's on your mind?",
  "Start writing...",
  "Let your thoughts flow...",
  "Begin your freewrite...",
  "What are you thinking about?",
  "Just start typing...",
  "Write without stopping...",
  "Let it all out...",
];

export const DEFAULT_TIMER_MINUTES = 15;
export const MIN_TIMER_MINUTES = 0;
export const MAX_TIMER_MINUTES = 45;
export const TIMER_STEP_MINUTES = 5;
