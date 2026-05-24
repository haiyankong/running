/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx,css}'],
  theme: {
    fontFamily: {
      sans: [
        '-apple-system',
        'BlinkMacSystemFont',
        'Segoe UI',
        'Roboto',
        'Oxygen-Sans',
        'Ubuntu',
        'Cantarell',
        'Helvetica Neue',
        'sans-serif',
      ],
    },
    extend: {
      colors: {
        background: '#F6F8F7',
        card: '#FFFFFF',
        primary: '#122034',
        secondary: '#5B667A',
        accent: '#F05A3E',
        route: '#1877F2',
        mint: '#28A979',
        sun: '#F2B84B',
        line: '#DDE4EA',
      },
      borderRadius: {
        card: '0.5rem',
      },
    },
  },
  plugins: [],
};
