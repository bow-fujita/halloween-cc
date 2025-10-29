/**
 * Copyright (C) 2018 Hiro Fujita <bow.fujita@gmail.com>
 */

'use strict';

const path = require('path')
    , webpack = require('webpack')
;

module.exports = {
  entry: path.join(__dirname, 'frontend', 'main.jsx')
, output: {
    path: path.join(__dirname, 'public', 'js')
  , filename: 'bundle.js'
  , hashFunction: 'sha256'
  }
, module: {
    rules: [{
      test: /\.(js|jsx)$/
    , exclude: /node_modules/
    , use: {
        loader: 'babel-loader'
      , options: {
          presets: [ '@babel/preset-env', '@babel/preset-react' ]
        }
      }
    }]
  }
, plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery'
    , jQuery: 'jquery'
    })
  ]
};
