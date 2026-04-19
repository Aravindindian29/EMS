/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ironman: {
          red: '#C8102E',
          gold: '#FFD700',
          darkRed: '#8B0000',
          lightGold: '#FFF4B3',
          dark: '#1A1A1A',
          darker: '#0D0D0D',
        }
      },
      backgroundImage: {
        'glossy-red': 'linear-gradient(135deg, #C8102E 0%, #8B0000 100%)',
        'glossy-gold': 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
        'glossy-dark': 'linear-gradient(135deg, #1A1A1A 0%, #0D0D0D 100%)',
      },
      boxShadow: {
        'glossy': '0 8px 32px 0 rgba(200, 16, 46, 0.37)',
        'glossy-gold': '0 8px 32px 0 rgba(255, 215, 0, 0.37)',
        'glossy-lg': '0 15px 50px 0 rgba(200, 16, 46, 0.5)',
        'inner-glossy': 'inset 0 2px 4px 0 rgba(255, 255, 255, 0.2)',
      }
    },
  },
  plugins: [],
}
