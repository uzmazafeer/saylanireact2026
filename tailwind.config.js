/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        saylani: {
          green: '#66b032',
          blue: '#0057a8',
        },
      },
    },
  },
  plugins: [],
}
