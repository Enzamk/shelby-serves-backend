/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          500: '#6366f1',
          600: '#4f46e5',
        },
        dark: {
          900: '#0f172a',
          800: '#1e293b',
        }
      }
    },
  },
  plugins: [],
  darkMode: 'class',
};