const path = require('path');
const webpack = require('webpack')

const config = {
  entry: ['babel-polyfill','./src/jquery.slice.js'],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'jquery.slice.min.js'
  },
  module: {
    rules: [
        {   test : /\.js$/, loader : 'babel-loader',
            query: {
            presets: ['es2015','stage-3']
        }
      }
    ]
  },
  plugins : [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
      }
    })
  ]
};

module.exports = config;