/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sable: { DEFAULT: "#F3E6CF", deep: "#E6D3AE" },
        ocre: "#C8873A",
        terracotta: "#B5542F",
        or: "#C9A24B",
        oasis: "#1F3D2E",
        chaux: "#FBF8F2",
        nuit: "#1A0F0A", // fond « nuit Sahara » de la carte
      },
      fontFamily: {
        // Variables injectées par next/font dans layout.tsx
        serif: ["var(--font-cormorant)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      keyframes: {
        nudge: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(6px)" },
        },
        breathe: {
          "0%, 100%": { opacity: "0.55", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.04)" },
        },
      },
      animation: {
        nudge: "nudge 2.2s ease-in-out infinite",
        breathe: "breathe 3.2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
