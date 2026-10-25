import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          50: "#f7f7f8",
          100: "#eceef1",
          200: "#d5d9e0",
          400: "#8a93a3",
          600: "#4a5162",
          900: "#0e1116",
        },
        brand: {
          50: "#eef7ff",
          500: "#2b7fff",
          600: "#1e68e0",
          700: "#1452b8",
        },
        accent: { 500: "#10b981" },
      },
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Inter", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(16,24,40,.04), 0 1px 3px rgba(16,24,40,.06)",
      },
    },
  },
  plugins: [],
} satisfies Config;
