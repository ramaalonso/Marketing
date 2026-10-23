/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        yerbazo: {
          green: '#0f4b25',
          greenLight: '#176936',
          greenDark: '#092e16',
          cream: '#ece7d7',
          creamLight: '#f7f4ec',
          orange: '#e68628',
          orangeLight: '#f39c42',
          orangeDark: '#c56b14',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
