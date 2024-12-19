import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '"Source Sans 3"',
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
          '"Noto Color Emoji"',
        ],
      },
      aspectRatio: {
        '1': '1 / 1',
        '4/6': '4 / 6',
        '9/16': '9 / 16',
        '16/9': '16 / 9',
      },
      colors: {
        "paper-pink": "#FFE9E4",
        "brand-pink": "#ED5959",
        "brand-pink-dark": "#C74E48",
        "inkverse-black": '#403B51',
        "taddy-blue": '#567CD6',
        "taddy-blue-dark": '#3E5FBC',
        "action-green": '#55BC31',
      },
    },
  },
  plugins: [],
} satisfies Config;
