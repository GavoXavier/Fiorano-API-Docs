/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class", // Enable dark mode
  theme: {
    extend: {
      colors: {
        primary: "#1E40AF", // Blue
        secondary: "#1E3A8A", // Darker Blue
        light: "#F9FAFB", // Light Gray
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"], // Use Inter or Roboto
      },
    },
  },
  plugins: [],
};
