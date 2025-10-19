/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#c026d3",
        secondary: "#e879f9"
      },
      container:{
        center:true,
        padding: {
          DEFAULT: "1rem",
          sm:"2rem",
          lg:"4rem",
          xl: "5rem",
          "2xl": "6rem",
        }
      }
    },
  },
  plugins: [],
}

