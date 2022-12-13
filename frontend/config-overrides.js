/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const { override, addWebpackAlias } = require('customize-cra');
const path = require('path');

module.exports = override(
  addWebpackAlias({
    '@': path.resolve(__dirname, 'src'),
  }),
);
