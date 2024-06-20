const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  entry: {
    'hal9': './src/index.js',
    'hal9.min': './src/index.js',
  },
  devtool: "source-map",
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    globalObject: 'this',
    library: {
      name: 'h9',
      type: 'umd',
    },
  },
  optimization: {
    minimize: false,
    minimizer: [new UglifyJsPlugin({
      include: /\.min\.js$/
    })]
  }
}