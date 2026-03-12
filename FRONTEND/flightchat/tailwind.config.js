

// tailwind.config.js
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",// 👈 AIXÒ ÉS CLAU
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FD8400',
        secondary: '#FFAA19',
        accent: '#FABC3C',
        light: '#E97205',
        lighter: '#D8610C',
        neutral: {
          dark: '#3F4040',
          mid: '#7B8181',
          soft: '#AAA5A6',
          light: '#BFC0C0',
          lighter: '#D5D5D6',
          white: '#FFFFFF',
        }
      }
    }
  },
  plugins: [],
}


