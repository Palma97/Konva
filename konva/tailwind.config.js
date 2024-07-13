/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#ff9a76",
        secondary: "#ffeadb",
        tercery: "#679b9b",
        fourth: "#637373",
      },
    },
  },
  plugins: [],
};
