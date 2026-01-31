
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      colors: {
        toiral: {
          primary: '#149499',
          dark: '#16384B',
          secondary: '#67A8A9',
          light: '#BBDAD9',
          bg: '#E4F0EF',
          'bg-light': '#F2FBFA',
        },
      },
      fontFamily: {
        outfit: ['Outfit', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(22, 56, 75, 0.08)',
        'soft-lg': '0 10px 25px -3px rgba(22, 56, 75, 0.12)',
      }
    },
  },
  plugins: [],
}
