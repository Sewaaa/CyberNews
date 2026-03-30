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
      fontFamily: {
        grotesk: ["var(--font-grotesk)", "system-ui", "sans-serif"],
      },
      colors: {
        navy: {
          DEFAULT: "#1C0E00",
          deep: "#0F0700",
          light: "#44301A",
        },
        "fox-orange":   "#F97316",
        "fox-amber":    "#F59E0B",
        "fox-dark":     "#0F0D0B",
        "fox-surface":  "#1C1612",
      },
      boxShadow: {
        "fox-sm":        "0 1px 3px rgba(234,88,12,0.08)",
        "fox-md":        "0 4px 16px rgba(234,88,12,0.12), 0 1px 4px rgba(0,0,0,0.04)",
        "fox-lg":        "0 8px 32px rgba(234,88,12,0.16), 0 2px 8px rgba(0,0,0,0.06)",
        "fox-xl":        "0 20px 60px rgba(234,88,12,0.20), 0 4px 16px rgba(0,0,0,0.08)",
        "orange-glow":   "0 0 20px rgba(249,115,22,0.35), 0 0 40px rgba(249,115,22,0.12)",
        "red-glow":      "0 0 16px rgba(239,68,68,0.5)",
        "card-dark":     "0 4px 24px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)",
        "card-dark-hover":"0 8px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(249,115,22,0.20), inset 0 1px 0 rgba(255,255,255,0.07)",
      },
      animation: {
        ticker:       "ticker 40s linear infinite",
        float:        "float 3s ease-in-out infinite",
        "float-slow": "float-slow 5s ease-in-out infinite",
        "fade-up":    "fadeUp 0.5s ease-out",
        "pulse-red":  "pulseRed 2s ease-in-out infinite",
        "spin-slow":  "spin 3s linear infinite",
        victory:      "victory 2.8s ease-in-out infinite",
        "orb-1":      "orbFloat1 22s ease-in-out infinite",
        "orb-2":      "orbFloat2 28s ease-in-out infinite",
        "orb-3":      "orbFloat3 18s ease-in-out infinite",
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
        "float-slow": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%":      { transform: "translateY(-5px)" },
        },
        fadeUp: {
          "0%":   { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseRed: {
          "0%, 100%": { opacity: "1" },
          "50%":      { opacity: "0.65" },
        },
        victory: {
          "0%, 100%": { transform: "translateY(0) scale(1) rotate(0deg)" },
          "20%":      { transform: "translateY(-14px) scale(1.04) rotate(-2deg)" },
          "40%":      { transform: "translateY(0) scale(1) rotate(0deg)" },
          "60%":      { transform: "translateY(-8px) scale(1.02) rotate(2deg)" },
          "80%":      { transform: "translateY(0) scale(1) rotate(0deg)" },
        },
        orbFloat1: {
          "0%, 100%": { transform: "translate(0px, 0px)" },
          "33%":      { transform: "translate(-80px, 60px)" },
          "66%":      { transform: "translate(50px, 120px)" },
        },
        orbFloat2: {
          "0%, 100%": { transform: "translate(0px, 0px)" },
          "33%":      { transform: "translate(90px, -50px)" },
          "66%":      { transform: "translate(-60px, -90px)" },
        },
        orbFloat3: {
          "0%, 100%": { transform: "translate(0px, 0px)" },
          "50%":      { transform: "translate(60px, 80px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
