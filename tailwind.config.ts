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
          dark: "#063B7A",
          light: "#0D4E96",
        },
        gold: {
          DEFAULT: "#D8A84E",
          light: "#E5BC6E",
          dark: "#B8862C",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          soft: "#F8FAFC",
          muted: "#F1F5F9",
        },
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "serif"],
        sans: ["var(--font-be-vietnam)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
