const path = require('path');
const package = require('./package.json');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = (env, argv) => { 
  const devel = argv.mode === 'development';

  var rules = [
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
  ];

  // This is here to make the hal9 package more compatible with older browsers
  if (!devel) {
    rules.unshift({
      test: /\.m?js$/,
      exclude: /(node_modules)/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: [
            '@babel/preset-env'
          ],
          plugins: [
            [
              '@babel/plugin-transform-runtime',
              {
                corejs: 3
              }
            ]
          ]
        }
      }
    });
  } else {
    rules.unshift({
      test: /\.m?js$/,
      exclude: /(node_modules)/,
      use: {
        loader: 'babel-loader',
        options: {
          plugins: [
            [
              '@babel/plugin-transform-runtime',
              {
                corejs: 3
              }
            ],
            '@babel/plugin-proposal-nullish-coalescing-operator',
            '@babel/plugin-proposal-optional-chaining'
          ]
        }
      }
    });
  }

  return {
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
      rules: rules,
    },
    optimization: {
      minimize: true,
      minimizer: [new TerserPlugin({
        include: /\.min\.js$/
      })]
    },
    devServer: {
      open: true,
      static: ['docs']
    },
  };
}
