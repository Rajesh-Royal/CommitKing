import type { Config } from "tailwindcss";

export default {
  // Content paths are now handled in CSS with @source  
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: { extend: {} },
  plugins: [],
} satisfies Config;
