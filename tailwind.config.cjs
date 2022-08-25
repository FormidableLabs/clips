const colors = require("tailwindcss/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{svelte,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: colors.purple,
        fmd: {
          white: "#ffffff",
          black: "#000000",
          navy: "#1E2852",
          blue: "#364c99",
          red: "#F04D21",
          sky: "#8BDDFD",
          yellow: "#FFC951",
          gray: "#EBE5DA",
          gray2: "#f4f1eb"
        }
      }
    },
    container: {
      center: true
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
};
