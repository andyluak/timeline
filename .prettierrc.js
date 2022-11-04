module.exports = {
  trailingComma: "es5",
  tabWidth: 2,
  semi: true,
  singleQuote: false,
  indentStyle: "space",
  importOrder: [
    "^core/(.*)$",
    "^components/(.*)$",
    "^containers/(.*)$",
    "^utils/(.*)$",
    "^public/(.*)$",
    "^hooks[./]",
    "^pages[./]",
    "^[./|~/]",
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
};
