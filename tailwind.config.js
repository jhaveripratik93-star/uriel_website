/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        forest: { 950: "#0f2017", 900: "#14291d", 800: "#1f3d2b", 700: "#2d5a40", 100: "#e8efe9" },
        gold: { 400: "#d8bd85", 500: "#c9a96a", 600: "#a98a4e" },
        ivory: { 50: "#fdfbf6", 100: "#faf7f0", 200: "#f3ead2" },
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
