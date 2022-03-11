const path = require('path');
const package = require('./package.json');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  entry: {
    'hal9': './src/api/index.js',
    'hal9.min': './src/api/index.js',
  },
  devtool: "source-map",
  output: {
    filename: '[name].js',
    library: {
      name: 'hal9',
      type: 'umd2',
      export: 'default',
    },
    path: path.resolve(__dirname, 'dist'),
    globalObject: 'this',
  },
  mode: 'none',
  plugins: [
    new webpack.DefinePlugin({
      VERSION: JSON.stringify(package.version),
      HAL9ENV: JSON.stringify(process.env.HAL9_ENV ? process.env.HAL9_ENV : 'prod'),
      HAL9HOST: JSON.stringify('api')
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/,
        type: 'asset',
      },
      {
        test: /(\.txt\.js$)|(\.txt$)|(\.txt\.html$)|(\.py$)|(\.r$)/,
        use: [
          'raw-loader',
        ],
      },
      {
        test: /\.css$/i,
        use: [ 'css-loader' ],
      },
    ],
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin({
      include: /\.min\.js$/
    })]
  }
};
