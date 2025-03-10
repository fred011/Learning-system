import { withUt } from "uploadthing/tw";

/** @type {import('tailwindcss').Config} */
const config = withUt({
  content: ["./src/**/*.{html,ts,tsx,js,jsx,mdx}"],
  theme: {
    extend: {},
  },
  plugins: [],
});

export default config;
