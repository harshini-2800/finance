/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Obsidian Amethyst Luxury Theme
        obsidian: {
          DEFAULT: '#09070D',
          dark: '#06040A',
          plum: '#100B16',
          aubergine: '#17101F',
        },
        plum: {
          surface: '#1A1224',
          DEFAULT: '#201629',
          muted: '#291C35',
          rich: '#30203E',
          card: '#1F1528',
          border: '#352247',
        },
        amethyst: {
          dark: '#39204F',
          DEFAULT: '#633B86',
          light: '#7A4A9E',
        },
        violet: {
          DEFAULT: '#8955B5',
          light: '#9E69CD',
          subtle: '#8955B520',
        },
        lavender: {
          soft: '#B99AD9',
          DEFAULT: '#C9B4E5',
          pale: '#D3C0E8',
          light: '#E6DCF5',
        },
        luxury: {
          text: '#F5F0FA',
          secondary: '#B7AFC1',
          muted: '#82768E',
          card: '#1B1324',
          border: '#322244',
          highlight: '#3F2B54',
        }
      },
      boxShadow: {
        'glow-sm': '0 0 15px rgba(137, 85, 181, 0.3)',
        'glow-md': '0 0 25px rgba(137, 85, 181, 0.4)',
        'glow-lg': '0 0 35px rgba(137, 85, 181, 0.55)',
      },
      fontFamily: {
        sans: ['Manrope', 'Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
