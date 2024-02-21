import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        sleep: "#B4DFD8",
        physical: "#F9F5E3",
        emotional: "#E4EFFF",
        productivity: "#E8DACE",
        social: "#FFCBB4",
      },
      boxShadow: {
        custom: "5px 5px 10px rgb(0 0 0 / 10%)",
      },
    },
  },
  plugins: [],
};
export default config;
