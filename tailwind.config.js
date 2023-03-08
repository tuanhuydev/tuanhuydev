/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./frontend/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': [''],
        'mono': ['']
      },
      minHeight: {
        '1/2': 'half',
      },
      colors: {
        'primary': "#172733",
      },
    },
  },
  plugins: [],
}