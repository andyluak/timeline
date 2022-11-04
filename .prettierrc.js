module.exports = {
  trailingComma: "es5",
  tabWidth: 2,
  semi: true,
  singleQuote: false,
  importOrder: [
    "^core/(.*)$",
    "^components/(.*)$",
    "^containers/(.*)$",
    "^hooks[./]",
    "^pages[./]",
    "^utils/(.*)$",
    "^public/(.*)$",
    "^[./|~/]",
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  plugins: [require("prettier-plugin-tailwindcss")],
};
