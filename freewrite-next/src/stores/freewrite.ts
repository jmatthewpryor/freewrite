import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Entry, FontFamily, FontSize, Theme } from '@/types';
import { DEFAULT_TIMER_MINUTES } from '@/types';

interface FreewriteState {
  // Text state
  currentText: string;
  selectedEntryId: string | null;
  entries: Entry[];

  // UI state
  theme: Theme;
  fontSize: FontSize;
  fontFamily: FontFamily;
  isFullscreen: boolean;
  showSidebar: boolean;
  backspaceDisabled: boolean;

  // Timer state
  timeRemaining: number;
  timerRunning: boolean;
  initialTime: number;

  // UI visibility
  toolbarVisible: boolean;

  // Actions - Text
  setText: (text: string) => void;
  setSelectedEntryId: (id: string | null) => void;
  setEntries: (entries: Entry[]) => void;
  addEntry: (entry: Entry) => void;
  removeEntry: (id: string) => void;
  updateEntryPreview: (id: string, preview: string) => void;

  // Actions - UI
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  setFontSize: (size: FontSize) => void;
  cycleFontSize: () => void;
  setFontFamily: (family: FontFamily) => void;
  setRandomFont: () => void;
  setIsFullscreen: (value: boolean) => void;
  toggleFullscreen: () => void;
  setShowSidebar: (value: boolean) => void;
  toggleSidebar: () => void;
  setBackspaceDisabled: (value: boolean) => void;
  toggleBackspace: () => void;
  setToolbarVisible: (value: boolean) => void;

  // Actions - Timer
  setTimeRemaining: (time: number) => void;
  adjustTime: (delta: number) => void;
  setTimerRunning: (running: boolean) => void;
  startTimer: () => void;
  stopTimer: () => void;
  resetTimer: () => void;
  tickTimer: () => void;
}

const FONT_FAMILIES: FontFamily[] = ['lato', 'arial', 'system', 'serif'];
const FONT_SIZES: FontSize[] = [16, 18, 20, 22, 24, 26];

export const useFreewriteStore = create<FreewriteState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentText: '',
      selectedEntryId: null,
      entries: [],

      theme: 'dark',
      fontSize: 18,
      fontFamily: 'lato',
      isFullscreen: false,
      showSidebar: false,
      backspaceDisabled: false,

      timeRemaining: DEFAULT_TIMER_MINUTES * 60,
      timerRunning: false,
      initialTime: DEFAULT_TIMER_MINUTES * 60,

      toolbarVisible: true,

      // Text actions
      setText: (text) => set({ currentText: text }),
      setSelectedEntryId: (id) => set({ selectedEntryId: id }),
      setEntries: (entries) => set({ entries }),
      addEntry: (entry) => set((state) => ({
        entries: [entry, ...state.entries]
      })),
      removeEntry: (id) => set((state) => ({
        entries: state.entries.filter((e) => e.id !== id)
      })),
      updateEntryPreview: (id, preview) => set((state) => ({
        entries: state.entries.map((e) =>
          e.id === id ? { ...e, previewText: preview } : e
        )
      })),

      // UI actions
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set((state) => ({
        theme: state.theme === 'light' ? 'dark' : 'light'
      })),
      setFontSize: (fontSize) => set({ fontSize }),
      cycleFontSize: () => set((state) => {
        const currentIndex = FONT_SIZES.indexOf(state.fontSize);
        const nextIndex = (currentIndex + 1) % FONT_SIZES.length;
        return { fontSize: FONT_SIZES[nextIndex] };
      }),
      setFontFamily: (fontFamily) => set({ fontFamily }),
      setRandomFont: () => set(() => {
        const randomIndex = Math.floor(Math.random() * FONT_FAMILIES.length);
        return { fontFamily: FONT_FAMILIES[randomIndex] };
      }),
      setIsFullscreen: (isFullscreen) => set({ isFullscreen }),
      toggleFullscreen: () => set((state) => ({
        isFullscreen: !state.isFullscreen
      })),
      setShowSidebar: (showSidebar) => set({ showSidebar }),
      toggleSidebar: () => set((state) => ({
        showSidebar: !state.showSidebar
      })),
      setBackspaceDisabled: (backspaceDisabled) => set({ backspaceDisabled }),
      toggleBackspace: () => set((state) => ({
        backspaceDisabled: !state.backspaceDisabled
      })),
      setToolbarVisible: (toolbarVisible) => set({ toolbarVisible }),

      // Timer actions
      setTimeRemaining: (timeRemaining) => set({ timeRemaining }),
      adjustTime: (delta) => set((state) => {
        const newTime = Math.max(0, Math.min(45 * 60, state.timeRemaining + delta));
        return {
          timeRemaining: newTime,
          initialTime: newTime
        };
      }),
      setTimerRunning: (timerRunning) => set({ timerRunning }),
      startTimer: () => set({ timerRunning: true }),
      stopTimer: () => set({ timerRunning: false }),
      resetTimer: () => set((state) => ({
        timeRemaining: state.initialTime,
        timerRunning: false
      })),
      tickTimer: () => set((state) => {
        if (state.timeRemaining <= 0) {
          return { timerRunning: false, timeRemaining: 0 };
        }
        return { timeRemaining: state.timeRemaining - 1 };
      }),
    }),
    {
      name: 'freewrite-storage',
      partialize: (state) => ({
        theme: state.theme,
        fontSize: state.fontSize,
        fontFamily: state.fontFamily,
        backspaceDisabled: state.backspaceDisabled,
      }),
    }
  )
);
