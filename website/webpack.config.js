// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

// 首先，它引入了一些必要的模块，如path、webpack、 KeplerPackage等。
const { resolve, join } = require('path');
const webpack = require('webpack');
const KeplerPackage = require('../package');

const {
  WEBPACK_ENV_VARIABLES,
  ENV_VARIABLES_WITH_INSTRUCTIONS,
  RESOLVE_ALIASES
} = require('../webpack/shared-webpack-configuration');

// 然后，它定义了一些常量，如LIB_DIR和SRC_DIR,分别表示库目录和源目录。
const LIB_DIR = resolve(__dirname, '..');
const SRC_DIR = resolve(LIB_DIR, './src');

// 全局的 console 对象。console 对象提供了一些方法，用于在控制台上输出信息、记录日志或进行调试。
const console = require('global/console');

// 接下来，它定义了一个名为BABEL_CONFIG的对象，其中包含了Babel插件和预设的配置。
// Babel是一个广泛使用的JavaScript编译器，用于将新版本的JavaScript代码转换为旧版本的浏览器兼容代码。
const BABEL_CONFIG = {
  // 这是一个数组，包含了需要在编译过程中使用的Babel预设。这里使用了三个预设。
  // 这些预设分别用于处理不同类型的JavaScript代码，如ES6+、React和TypeScript。
  presets: [
    '@babel/preset-env', 
    '@babel/preset-react', 
    '@babel/preset-typescript'
  ],
  // 包含了需要在编译过程中使用的Babel插件。
  plugins: [
    [
      // 用于将TypeScript代码转换为普通的JavaScript代码。
      // 在这里，它的配置对象中的isTSX属性设置为true,表示同时支持TSX(一种扩展了JavaScript的语法)和JSX(一种用于构建用户界面的标记语言)。
      // allowDeclareFields属性设置为true,表示允许在类声明中使用declare namespace语法。
      '@babel/plugin-transform-typescript',
      {
        isTSX: true,
        allowDeclareFields: true
      }
    ],
    // 用于支持类属性(class properties)语法，即在类定义中可以直接声明属性，而不需要使用构造函数。
    '@babel/plugin-proposal-class-properties',
    // 用于支持从命名空间中导出变量的功能。
    '@babel/plugin-proposal-export-namespace-from',
    // 用于支持可选链操作符(Optional Chaining Operator),即可以在调用对象属性或方法时省略括号。
    '@babel/plugin-proposal-optional-chaining',
    [
      // 用于在编译过程中搜索并替换特定的文本。
      'search-and-replace',
      {
        rules: [
          {
            // 用于将__PACKAGE_VERSION__字符串替换为KeplerPackage.version的值。
            // 这可能是为了在打包应用程序时替换包的版本信息。
            search: '__PACKAGE_VERSION__',
            replace: KeplerPackage.version
          }
        ]
      }
    ]
  ]
};

// 通用的 webpack 配置项
const COMMON_CONFIG = {
  // 指定应用程序的入口文件。
  entry: ['./src/main'],
  // 定义输出文件的路径、文件名和公共路径。
  output: {
    path: resolve(__dirname, 'build'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  // 配置模块解析器，包括扩展名、模块搜索路径和别名。
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
    modules: ['node_modules', SRC_DIR],
    alias: RESOLVE_ALIASES
  },
  // 定义模块加载器规则，包括不同类型的文件如何处理。
  // 例如，使用babel-loader 编译 ES2015+ 的 JavaScript/JSX/TS/TSX 文件，使用url-loader加载图片文件等。
  module: {
    rules: [
      // 使用Babel编译ES2015+的JavaScript、JSX、TypeScript 和 TypeScript-React(TSX)文件。
      // 配置了babel-loader,并设置了BABEL_CONFIG选项。同时排除了node_modules目录。
      {
        // Compile ES2015 using bable
        test: /\.(js|jsx|ts|tsx)$/,
        loader: 'babel-loader',
        options: BABEL_CONFIG,
        exclude: [/node_modules/]
      },
      // 使用url-loader加载.eot、.svg、.ico、.ttf、.woff、.woff2、.gif、.jpg和.png等文件。
      {
        test: /\.(eot|svg|ico|ttf|woff|woff2|gif|jpe?g|png)$/,
        loader: 'url-loader'
      },
      // 使用file-loader加载.svg、.ico、.gif、.jpg和.png等文件，并设置了默认的文件名和扩展名。
      {
        test: /\.(svg|ico|gif|jpe?g|png)$/,
        loader: 'file-loader?name=[name].[ext]'
      },
      // for compiling apache-arrow ESM module
      // 使用 Babel 编译 apache-arrow 库中的 ESM 模块。
      {
        test: /\.mjs$/,
        include: /node_modules\/apache-arrow/,
        type: 'javascript/auto'
      },
      // for compiling @probe.gl, website build started to fail (March, 2024)
      // 配置了babel-loader,并设置了BABEL_CONFIG选项。
      {
        test: /\.(js)$/,
        loader: 'babel-loader',
        options: BABEL_CONFIG,
        include: /node_modules\/@probe.gl/
      }
    ]
  },
  // 配置Node.js模块，这里设置为不使用fs模块。
  node: {
    fs: 'empty'
  },

  // to support browser history api and remove the '#' sign
  // 开发服务器配置，启用浏览器历史 API 并移除 URL 中的 '#' 符号。
  devServer: {
    historyApiFallback: true
  },

  // Optional: Enables reading mapbox token from environment variable
  // 插件列表
  // 使用了 webpack.EnvironmentPlugin 来从环境变量中读取 Mapbox 令牌(如果有的话)。
  plugins: [
    // Provide default values to suppress warnings
    new webpack.EnvironmentPlugin(WEBPACK_ENV_VARIABLES)
  ],

  // Required to avoid deck.gl undefined module when code is minified
  // 优化配置，包括避免在代码压缩时出现未定义模块的问题。
  optimization: {
    concatenateModules: false,
    providedExports: false,
    usedExports: false
  }
};

/**
 * 添加开发时的 webpack 配置项
 * @param {*} config 
 * @returns 
 */
const addDevConfig = config => {
  config.module.rules.push({
    // Unfortunately, webpack doesn't import library sourcemaps on its own...
    // 一个正则表达式，用于匹配以.js结尾的文件。
    test: /\.js$/,
    // 表示在构建过程中使用source-map-loader来处理这些文件。
    use: ['source-map-loader'],
    // 设置为'pre',表示在编译之前应用这个规则。
    enforce: 'pre',
    // 用于排除不需要使用source maps的模块
    exclude: [/node_modules\/react-palm/, /node_modules\/react-data-grid/]
  });

  // 它使用Object.assign()方法将一个对象与另一个对象合并。

  return Object.assign(config, {
    // 表示在开发过程中生成源映射(source maps),以便在浏览器中调试压缩后的代码。
    devtool: 'source-maps',
    // config.plugins数组中的元素将保持不变，而空数组将被添加到该数组的末尾。
    // 这样做的目的是向config.plugins数组中添加新的插件：
    plugins: config.plugins.concat([
      // new webpack.HotModuleReplacementPlugin(),
      new webpack.NoEmitOnErrorsPlugin()
    ])
  });
};

/**
 * 添加 生产 环境时的 webpack 配置
 * @param {*} config 
 * @returns 
 */
const addProdConfig = config => {
  return Object.assign(config, {
    output: {
      // __dirname是一个全局变量，表示当前执行脚本所在的目录。
      // ouput 输出文件目录的绝对路径
      path: resolve(__dirname, './dist'),
      filename: 'bundle.js'
    }
  });
};

// 然后，它定义了一些辅助函数，如logError、logInstruction、validateEnvVariable。
// 用于在控制台输出错误信息、提示信息和验证环境变量。
function logError(msg) {
  console.log('\x1b[31m%s\x1b[0m', msg);
}

function logInstruction(msg) {
  console.log('\x1b[36m%s\x1b[0m', msg);
}

function validateEnvVariable(variable, instruction) {
  if (!process.env[variable]) {
    logError(`Error! ${variable} is not defined`);
    logInstruction(`Make sure to run "export ${variable}=<token>" before deploy the website`);
    logInstruction(instruction);
    throw new Error(`Missing ${variable}`);
  }
}

// 最后，它导出了一个函数，该函数根据传入的环境参数(如开发环境或生产环境)返回相应的webpack配置。
module.exports = env => {
  env = env || {};

  let config = COMMON_CONFIG;

  if (env.local) {
    config = addDevConfig(config);
  }

  if (env.prod) {
    Object.entries(ENV_VARIABLES_WITH_INSTRUCTIONS).forEach(entry => {
      // we validate each entry [name, instruction]
      validateEnvVariable(...entry);
    });
    config = addProdConfig(config);
  }

  return config;
};
