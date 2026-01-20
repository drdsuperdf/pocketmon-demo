/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // 使用 class 控制暗色模式
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
       transitionDelay: {
        '600': '600ms', // 自定义 delay-600
      },
       zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
    },
  },
  plugins: [],
}





