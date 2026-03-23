import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#0B1F3A",
          deep: "#060F1E",
          light: "#1E3A5F",
        },
        "cyber-cyan": "#06E6D9",
      },
      boxShadow: {
        "blue-sm":  "0 1px 3px rgba(37,99,235,0.08)",
        "blue-md":  "0 4px 16px rgba(37,99,235,0.12), 0 1px 4px rgba(0,0,0,0.04)",
        "blue-lg":  "0 8px 32px rgba(37,99,235,0.18), 0 2px 8px rgba(0,0,0,0.06)",
        "blue-xl":  "0 20px 60px rgba(37,99,235,0.22), 0 4px 16px rgba(0,0,0,0.08)",
        "cyan-glow":"0 0 24px rgba(6,230,217,0.35)",
      },
      animation: {
        ticker:   "ticker 40s linear infinite",
        float:    "float 3s ease-in-out infinite",
        "fade-up":"fadeUp 0.4s ease-out",
      },
      keyframes: {
        ticker: {
          "0%":   { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%":      { transform: "translateY(-10px)" },
        },
        fadeUp: {
          "0%":   { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
