/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{html,js,jsx,ts,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#198754',
        secondary: '#333'
      },
      fontFamily: {
        sans: [
          'Segoe UI',
          'serif',
        ],
      },
    },
  },
  plugins: [],
}