/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--color-background)",
        surface: "var(--color-surface)",
        "surface-hover": "var(--color-surface-hover)",
        border: "var(--color-border)",
        "text-primary": "var(--color-text-primary)",
        "text-secondary": "var(--color-text-secondary)",
        accent: "var(--color-accent)",
        "accent-hover": "var(--color-accent-hover)",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
