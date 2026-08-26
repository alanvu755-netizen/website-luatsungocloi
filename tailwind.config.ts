import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#073B78",
          dark: "#0F172A",
          deep: "#063B7A",
          light: "#0D4E96",
          soft: "#1E293B",
        },
        gold: {
          DEFAULT: "#D8A84E",
          light: "#F59E0B",
          warm: "#E5BC6E",
          dark: "#D97706",
          deep: "#B8862C",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          soft: "#F8FAFC",
          muted: "#F1F5F9",
          border: "#E2E8F0",
        },
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Merriweather", "serif"],
        sans: ["var(--font-be-vietnam)", "Inter", "sans-serif"],
      },
      boxShadow: {
        card: "0 4px 20px -2px rgba(15, 23, 42, 0.06), 0 2px 6px -1px rgba(15, 23, 42, 0.04)",
        "card-hover": "0 12px 30px -4px rgba(15, 23, 42, 0.12), 0 4px 10px -2px rgba(216, 168, 78, 0.15)",
        gold: "0 0 15px rgba(216, 168, 78, 0.3)",
      },
      borderRadius: {
        xl: "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
    },
  },
  plugins: [],
};

export default config;
