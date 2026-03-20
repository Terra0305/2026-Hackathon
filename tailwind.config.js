/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        outfit: ['Outfit', 'sans-serif'],
      },
      colors: {
        sync: {
          bg: 'var(--sync-bg)',
          card: 'var(--sync-card)',
          cardHover: 'var(--sync-cardHover)',
          border: 'var(--sync-border)',
          primary: 'var(--sync-primary)',
          primaryHover: 'var(--sync-primaryHover)',
          text: 'var(--sync-text)',
          muted: 'var(--sync-muted)'
        }
      }
    },
  },
  plugins: [],
}
