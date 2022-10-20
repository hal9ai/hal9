const path = require('path')
const webpack = require('webpack')
const nodeExternals = require('webpack-node-externals')
const CopyPlugin = require("copy-webpack-plugin");
const package = require('./package.json');

module.exports = {
  entry: {
    server: './src/server.js',
  },
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '/',
    filename: '[name].js'
  },
  target: 'node',
  node: {
    __dirname: false,
    __filename: false,
  },
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /(\.txt\.js$)|(\.txt$)|(\.txt\.html$)/,
        use: [
          'raw-loader',
        ],
      }
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      VERSION: JSON.stringify(package.version)
    }),
  ]
}