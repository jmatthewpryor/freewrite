/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        'lato': ['Lato', 'sans-serif'],
        'arial': ['Arial', 'sans-serif'],
        'system': ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        'serif': ['Times New Roman', 'serif'],
      },
      colors: {
        'editor': {
          light: {
            bg: '#FFFFFF',
            text: '#1A1A1A',
            muted: '#6B7280',
            border: '#E5E7EB',
            hover: '#F3F4F6',
          },
          dark: {
            bg: '#1A1A1A',
            text: '#F5F5F5',
            muted: '#9CA3AF',
            border: '#374151',
            hover: '#2D2D2D',
          },
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-in-out',
        'slide-in': 'slideIn 0.2s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateX(10px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
