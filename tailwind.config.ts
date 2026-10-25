import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          50: "#fafaf9",
          100: "#f1f0ed",
          200: "#e2e0dc",
          400: "#8a847b",
          500: "#6a635b",
          600: "#4a443d",
          700: "#2a2622",
          900: "#0a0a0b",
        },
        brand: {
          50: "#eef7ff",
          500: "#2b7fff",
          600: "#1e68e0",
          700: "#1452b8",
        },
        pop: {
          orange: "#ff5e3a",
          pink: "#ff2d55",
          yellow: "#ffd12c",
          mint: "#a9f0d1",
          sky: "#cfe8ff",
          plum: "#8b5cf6",
        },
      },
      fontFamily: {
        sans: ["ui-sans-serif", "-apple-system", "BlinkMacSystemFont", "SF Pro Display", "SF Pro Text", "Segoe UI", "system-ui", "sans-serif"],
        display: ["-apple-system", "BlinkMacSystemFont", "SF Pro Display", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(16,24,40,.04), 0 1px 3px rgba(16,24,40,.06)",
      },
    },
  },
  plugins: [],
} satisfies Config;
