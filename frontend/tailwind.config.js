/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#14171F",
        paper: "#F5F5F1",
        signal: "#2F5DE3",
        moss: "#3F6C51",
        clay: "#B23A2D",
        slate: {
          // Darkened from the original #7C8493 — the lighter value fell
          // below WCAG AA contrast (~3.7:1) at the small sizes it's used
          // for (labels, captions, meta text). This reads ~6:1 on paper/white.
          450: "#5B6472",
        },
      },
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
        body: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      // Site-wide type scale. Sizes marked with clamp() scale fluidly between
      // mobile and desktop instead of relying on manual sm:/md: overrides.
      fontSize: {
        hero: [
          "clamp(2rem, 1.3rem + 3vw, 3.25rem)",
          { lineHeight: "1.08", letterSpacing: "-0.02em", fontWeight: "600" },
        ],
        "page-title": [
          "clamp(1.625rem, 1.35rem + 1vw, 2rem)",
          { lineHeight: "1.2", letterSpacing: "-0.01em", fontWeight: "600" },
        ],
        "section-title": [
          "clamp(1.125rem, 1rem + 0.4vw, 1.375rem)",
          { lineHeight: "1.3", letterSpacing: "-0.005em", fontWeight: "600" },
        ],
        "card-title": ["1rem", { lineHeight: "1.4", fontWeight: "600" }],
        body: ["0.9375rem", { lineHeight: "1.65", fontWeight: "400" }],
        "body-sm": ["0.8125rem", { lineHeight: "1.55", fontWeight: "400" }],
        price: ["0.9375rem", { lineHeight: "1", fontWeight: "600", letterSpacing: "0.01em" }],
        nav: ["0.875rem", { lineHeight: "1.2", fontWeight: "500" }],
        button: ["0.875rem", { lineHeight: "1", fontWeight: "600", letterSpacing: "0.01em" }],
        label: ["0.6875rem", { lineHeight: "1.3", fontWeight: "600", letterSpacing: "0.06em" }],
        caption: ["0.75rem", { lineHeight: "1.5", fontWeight: "400" }],
      },
      backgroundImage: {
        "grain": "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
};
