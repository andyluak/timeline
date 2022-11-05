const pluginSortImports = require("@trivago/prettier-plugin-sort-imports");
const pluginTailwindcss = require("prettier-plugin-tailwindcss");

const myParser = {
  ...pluginSortImports.parsers.typescript,
  parse: pluginTailwindcss.parsers.typescript.parse,
};

const myPlugin = {
  parsers: {
    typescript: myParser,
  },
};

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
  plugins: [myPlugin],
};
