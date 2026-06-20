/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        apex: {
          amber: "#F59E0B",
          "amber-dark": "#B45309",
          dark: "#0A0A0F",
          card: "#111827",
          elevated: "#1F2937",
          border: "#374151",
          muted: "#6B7280",
        },
      },
      fontFamily: { sans: ["Inter", "system-ui", "sans-serif"] },
      keyframes: {
        shimmer: { "0%,100%": { opacity: "1" }, "50%": { opacity: "0.4" } },
        "score-pop": {
          "0%": { transform: "scale(1.2)", color: "#F59E0B" },
          "100%": { transform: "scale(1)" },
        },
      },
      animation: {
        shimmer: "shimmer 1.8s ease-in-out infinite",
        "score-pop": "score-pop 0.35s ease-out",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
}
