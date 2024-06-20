const hal9PrettierConfig = require('../.prettierrc.json');

module.exports = {
  ...hal9PrettierConfig,
  plugins: [
    require.resolve('prettier-plugin-css-order'),
    require.resolve('prettier-plugin-tailwindcss'),
  ],
};
