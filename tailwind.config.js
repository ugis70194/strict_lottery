// c:\Users\masa2\project\strict_lottery\tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default { // または module.exports = { ... }
  content: [
    "./index.html", // プロジェクトルートの index.html
    "./src/**/*.{js,ts,jsx,tsx}", // src フォルダ以下の関連ファイル
  ],
  theme: {
    extend: {
      // ... shadcn/ui のテーマ設定など
    },
  },
  plugins: [require("tailwindcss-animate")], // tailwindcss-animate を使っている場合
}
