const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  devtool: 'source-map',
  plugins: [],
  output: {
    filename: '[name].min.js'
  }
});
