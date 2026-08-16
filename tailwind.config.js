/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: '#15181C',
        steel: '#5B6570',
        paper: '#F7F5F0',
        amber: {
          DEFAULT: '#E8A33D',
          600: '#C97F1E',
          700: '#A5650F',
        },
        rust: '#B23A1F',
        moss: '#3B6D11',
        teal: '#0F6E56',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
};
