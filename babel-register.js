// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

// 定义了一个 forceTranspile 数组，其中包含了需要强制转译的库的正则表达式。
const forceTranspile = [
  // ESM libraries that require transpilation
  /@deck.gl\/layers/,
  /@loaders.gl\/polyfills/,
  // For some reason babel crashes even before trying to transpile this library
  // Instead we force transpile @deck.gl/layers which includes it, and alias to a transpiled version in babel.config.js
  /@mapbox\/tiny-sdf/
];

// 注册 Babel 转译器，并配置相关选项。
require('@babel/register')({
  // This tells babel where to look for `babel.config.js` file
  // 选项设置为当前文件所在目录，表示 Babel 将在该目录下查找 babel.config.js 文件。
  root: __dirname,
  // 选项用于指定需要忽略的文件或目录，这里使用了 forceTranspile 中的正则表达式来匹配需要转译的库。
  ignore: [
    filepath => {
      return forceTranspile.some(patt => patt.test(filepath))
        ? false
        : Boolean(filepath.match(/node_modules/));
    }
  ],
  // 选项设置为当前文件所在目录，表示只对该目录下的文件进行转译。
  only: [__dirname],
  // 选项设置为需要转译的文件扩展名，包括 .ts、.js、.tsx 和 .json。
  extensions: ['.ts', '.js', '.tsx', '.json']
});

// 引入 Babel polyfill,以确保在没有安装 Babel 的情况下也能正常运行项目。
require('@babel/polyfill');
var path = require('path');
var glob = require('glob');

// Requiring mapbox-gl here prevents polyfilling errors during tests.
// 引入mapbox-gl库，以防止在测试过程中出现polyfilling错误。
require('mapbox-gl');

// eslint-disable-next-line func-names
// 使用process.argv.slice(2)获取命令行参数(排除前两个参数，即node和脚本文件名)。
process.argv.slice(2).forEach(function(arg) {
  // eslint-disable-next-line func-names
  // 对每个命令行参数执行一个回调函数，该回调函数使用glob库来查找与参数匹配的文件。
  glob(arg, function(er, files) {
    // 如果在查找文件过程中发生错误，抛出异常。
    if (er) throw er;
    // eslint-disable-next-line func-names
    // 对于找到的每个文件，使用require引入文件并解析其路径。这样可以确保在当前工作目录下正确地引入模块。
    files.forEach(function(file) {
      require(path.resolve(process.cwd(), file));
    });
  });
});
