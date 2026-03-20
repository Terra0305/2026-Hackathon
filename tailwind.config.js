/** @type {import('tailwindcss').Config} */
export default {
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
          bg: '#0D0E12',
          card: '#181A20',
          cardHover: '#22252D',
          border: 'rgba(255,255,255,0.08)',
          primary: '#3284FF',
          primaryHover: '#5297FF',
          text: '#F1F3F5',
          muted: '#8A92A0'
        }
      }
    },
  },
  plugins: [],
}
