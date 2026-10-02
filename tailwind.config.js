/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        aura: {
          bg: '#F7F5F0',          // Warm off-white / soft cream
          dark: '#111111',        // Near-black typography & gutters
          blush: '#F8DADD',       // Pastel blush
          lavender: '#D9CEFF',    // Pastel lavender
          mint: '#5B9E7C',        // Pastel mint
          lime: '#EAF56D',        // Pale lime
          white: '#FCFBF8',       // Soft white card
          coral: '#FF8F92',       // Warning / overspending
          green: '#58C875',       // Positive signals
          muted: '#666666',       // Readable secondary text
          border: '#E4E0D7',      // Subtle clean border
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'Manrope', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      borderRadius: {
        'bento': '20px',
        '2xl': '16px',
        '3xl': '20px',
        '4xl': '24px',
      },
      boxShadow: {
        'bento': '0 2px 8px rgba(17, 17, 17, 0.04), 0 1px 2px rgba(17, 17, 17, 0.02)',
        'bento-hover': '0 8px 24px rgba(17, 17, 17, 0.08), 0 2px 6px rgba(17, 17, 17, 0.04)',
      },
    },
  },
  plugins: [],
}
