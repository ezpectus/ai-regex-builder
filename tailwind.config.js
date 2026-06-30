/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Dark theme
        'dark-bg': '#0d1117',
        'dark-surface': '#161b22',
        'dark-border': '#30363d',
        'dark-text': '#c9d1d9',
        'dark-muted': '#8b949e',
        'accent': '#58a6ff',
        'accent-hover': '#79b8ff',
        'match-yellow': '#ffd33d',
        // Light theme
        'light-bg': '#ffffff',
        'light-surface': '#f6f8fa',
        'light-border': '#afb8c1',
        'light-text': '#24292f',
        'light-muted': '#57606a',
        'light-accent': '#0969da',
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'pulse-loading': 'pulseLoading 1.5s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(100%)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        pulseLoading: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },
    },
  },
  plugins: [],
}
