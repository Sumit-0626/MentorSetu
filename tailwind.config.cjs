/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#646cff',
        hover: '#535bf2',
        dark: '#242424',
        light: '#ffffff',
        textLight: 'rgba(255, 255, 255, 0.87)',
        textDark: '#213547',
      },
    },
  },
  plugins: [],
}
