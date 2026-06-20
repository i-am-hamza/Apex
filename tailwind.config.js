/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        apex: {
          dark: "#0F0C1D",
          mid: "#0D1535",
          navy: "#071223",
          surface: "rgba(255,255,255,0.05)",
          elevated: "rgba(255,255,255,0.08)",
          border: "rgba(255,255,255,0.10)",
          primary: "#F1F5F9",
          secondary: "#94A3B8",
          muted: "#475569",
          amber: "#F59E0B",
          blue: "#60A5FA",
          green: "#34D399",
          violet: "#A78BFA",
          orange: "#FB923C",
          pink: "#F472B6",
          sky: "#38BDF8",
        },
      },
      fontFamily: { sans: ["Inter", "system-ui", "sans-serif"] },
      keyframes: {
        "dock-bounce": {
          "0%,100%": { transform: "translateY(0) scale(1)" },
          "40%": { transform: "translateY(-8px) scale(1.08)" },
          "70%": { transform: "translateY(-3px) scale(1.04)" },
        },
        shimmer: { "0%,100%": { opacity: "1" }, "50%": { opacity: "0.4" } },
        "score-pop": {
          "0%": { transform: "scale(1.15)" },
          "100%": { transform: "scale(1)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "dock-bounce": "dock-bounce 0.4s ease-out",
        shimmer: "shimmer 1.8s ease-in-out infinite",
        "score-pop": "score-pop 0.3s ease-out",
        "fade-up": "fade-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
}
