const px2rem = require('postcss-pxtorem');

module.exports = {
  plugins: [px2rem({ rootValue: 75, unitPrecision: 5, propList: ['*'] })]
};
