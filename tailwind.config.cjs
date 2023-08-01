const colors = require("tailwindcss/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{svelte,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: colors.purple,
        fmd: {
          white: {DEFAULT: "#ffffff", background: "#FFFFFF05"},
          black: "#000000",
          navy: "#1E2852",
          blue: "#364c99",
          red: {
            DEFAULT: "#F04D21",
            600: "#DB3B0F",
            300: "#F3714D",
            background: "#db3b0f05",
          },
          gray: {DEFAULT: "#E5E5E5", 600: "#888888"},
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
