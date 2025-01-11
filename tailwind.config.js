/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#1E40AF", // Blue
        secondary: "#1E3A8A", // Darker Blue
        light: "#F9FAFB", // Light Gray (can still be used for subtle contrasts)
        darkBackground: "#1A202C", // Default dark background
        darkCard: "#2D3748", // Cards or sections
        darkText: "#E2E8F0", // Light text on dark
        accent: "#38B2AC", // Teal accent for highlights
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"], // Use Inter or Roboto
      },
    },
  },
  plugins: [],
};
