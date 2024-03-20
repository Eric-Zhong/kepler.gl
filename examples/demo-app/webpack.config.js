// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

// NOTE: To use this example standalone (e.g. outside of deck.gl repo)
// delete the local development overrides at the bottom of this file

// avoid destructuring for older Node version support
const resolve = require('path').resolve;
const join = require('path').join;
const webpack = require('webpack');

// 从 root 定义的共享 webpack 配置中，获取环境变量
const WEBPACK_ENV_VARIABLES = require('../../webpack/shared-webpack-configuration').WEBPACK_ENV_VARIABLES;

const CONFIG = {
  // bundle app.js and everything it imports, recursively.
  // 入口
  entry: {
    app: resolve('./src/main.js')
  },
  // 输出到 build 目录，对外访问路径为 /
  output: {
    path: resolve(__dirname, 'build'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  // 处理的文件后缀名
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  // 开发工具使用 source-map
  devtool: 'source-map',
  // 模块
  module: {
    rules: [
      {
        test: /\.(js|ts|tsx)$/,
        loader: 'babel-loader',
        include: [join(__dirname, 'src')],
        exclude: [/node_modules/]
      },
      // fix for arrow-related errors
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto'
      }
    ]
  },

  node: {
    fs: 'empty'
  },

  // to support browser history api and remove the '#' sign
  devServer: {
    historyApiFallback: true
  },

  // Optional: Enables reading mapbox and dropbox client token from environment variable
  plugins: [new webpack.EnvironmentPlugin(WEBPACK_ENV_VARIABLES)]
};

// This line enables bundling against src in this repo rather than installed kepler.gl module
// 这行代码的作用是将 kepler.gl 模块与当前仓库中的 src 目录进行捆绑，而不是使用已安装的 kepler.gl 模块。
module.exports = env => {
  return env ? require('../webpack.config.local')(CONFIG, __dirname)(env) : CONFIG;
};
