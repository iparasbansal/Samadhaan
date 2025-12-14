/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // Enables manual dark mode toggle via a 'dark' class
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Clean and modern sans-serif
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Elegant custom palette
        brand: {
          DEFAULT: '#6366f1', // Indigo-500
          light: '#818cf8',
          dark: '#4f46e5',
        },
        surface: {
          light: '#f8fafc', // Slate-50
          dark: '#0f172a', // Slate-950
        },
        accent: {
          cyan: '#06b6d4',
          emerald: '#10b981',
          amber: '#f59e0b',
          red: '#ef4444',
        },
      },
      backgroundImage: {
        // Gradient utilities
        'gradient-brand': 'linear-gradient(to right, #6366f1, #06b6d4)',
        'gradient-dark': 'linear-gradient(to bottom right, #0f172a, #1e293b, #334155)',
      },
      boxShadow: {
        card: '0 4px 24px rgba(0,0,0,0.15)',
        glow: '0 0 12px 2px rgba(99,102,241,0.3)',
      },
      animation: {
        'spin-slow': 'spin 20s linear infinite',
        fade: 'fadeIn 0.3s ease-out',
        scale: 'scaleIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: 0 },
          '100%': { transform: 'scale(1)', opacity: 1 },
        },
      },
    },
  },
  plugins: [],
};
