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
          gray_lighter: "#F9F7F3",
          gray_darker: "#888888",
        },
      },
      keyframes: {
        loading: {
          "0%, 100%": { fill: "#88888880" },
          "50%": { fill: "#888888" },
        },
        loadingDark: {
          "0%, 100%": { fill: "#FFFFFF80" },
          "50%": { fill: "#FFFFFF" },
        },
      },
    },
    container: {
      center: true,
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
