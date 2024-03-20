// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

// 全局的 console 对象。console 对象提供了一些方法，用于在控制台上输出信息、记录日志或进行调试。
const console = require('global/console');
function logInstruction(msg) {
  console.log('\x1b[36m%s\x1b[0m', msg);
}


/**
 * kepler 项目的 package.json 配置数据对象
 */
const KeplerPackage = require('../package.json');

// join() 函数用于将多个路径片段连接在一起。
// resolve() 函数用于将一个相对路径解析为绝对路径。
const {join, resolve} = require('path');

const LIB_DIR = resolve(__dirname, '..');
const SRC_DIR = resolve(LIB_DIR, './src');

logInstruction('[shared-webpack-configuration.js]' + '[LIB_DIR]' + ': ' + LIB_DIR);
logInstruction('[shared-webpack-configuration.js]' + '[SRC_DIR]' + ': ' + SRC_DIR);

const NODE_MODULES_DIR = resolve(__dirname, '../node_modules');

logInstruction('[shared-webpack-configuration.js]' + '[NODE_MODULES_DIR]' + ': ' + NODE_MODULES_DIR);

const resolveAlias = {
  react: `${NODE_MODULES_DIR}/react`,
  'react-dom': `${NODE_MODULES_DIR}/react-dom`,
  'react-redux': `${NODE_MODULES_DIR}/react-redux/lib`,
  'styled-components': `${NODE_MODULES_DIR}/styled-components`,
  'react-intl': `${NODE_MODULES_DIR}/react-intl`,
  // Suppress useless warnings from react-date-picker's dep
  'tiny-warning': `${SRC_DIR}/utils/src/noop.ts`,
  // kepler.gl and loaders.gl need to use same apache-arrow
  'apache-arrow': `${NODE_MODULES_DIR}/apache-arrow`
};

// add kepler.gl submodule aliases
const workspaces = KeplerPackage.workspaces;

logInstruction('[shared-webpack-configuration.js]' + 'Traverse workspace in package.json');

workspaces.forEach(workspace => {
  // workspace =  "./src/types",  "./src/constants", etc
  const moduleName = workspace.split('/').pop();
  const path = join(SRC_DIR, `${moduleName}/src`);
  logInstruction(`[shared-webpack-configuration.js] workspace: ${workspace}\t\t path: ${path}`);
  resolveAlias[`@kepler.gl/${moduleName}`] = path;
});

const ENV_VARIABLES_WITH_INSTRUCTIONS = {
  MapboxAccessToken: 'You can get the token at https://www.mapbox.com/help/how-access-tokens-work/',
  DropboxClientId: 'You can get the token at https://www.dropbox.com/developers',
  CartoClientId: 'You can get the token at https://www.mapbox.com/help/how-access-tokens-work/',
  MapboxExportToken: 'You can get the token at https://location.foursquare.com/developer',
  FoursquareClientId: 'You can get the token at https://location.foursquare.com/developer',
  FoursquareDomain: 'You can get the token at https://location.foursquare.com/developer',
  FoursquareAPIURL: 'You can get the token at https://location.foursquare.com/developer',
  FoursquareUserMapsURL: 'You can get the token at https://location.foursquare.com/developer',
};

/**
 * 这段代码定义了一个名为WEBPACK_ENV_VARIABLES的常量。它通过以下步骤生成：
 * 使用Object.keys()方法获取 ENV_VARIABLES_WITH_INSTRUCTIONS 对象的所有键(属性名),并将其存储在一个数组中。
 * 使用reduce()方法遍历这个键数组，将每个键对应的值设置为null, 并将结果累积到一个新的对象中。初始值是一个空对象{}。
 * 最终，WEBPACK_ENV_VARIABLES将是一个包含与ENV_VARIABLES_WITH_INSTRUCTIONS相同的键，但值都为null的新对象。
 * 
 * array.reduce(
 *  function(accumulator, currentValue, currentIndex, array) {
 *    ...   
 *  }, initialValue)
 * 
 * accumulator: 累加器，用于存储每次迭代的结果。
 * currentValue: 当前元素的值。
 * currentIndex: 当前元素的索引。
 * array: 数组本身。
 * initialValue: 可选参数，用于指定初始值。
 */
const WEBPACK_ENV_VARIABLES = Object.keys(ENV_VARIABLES_WITH_INSTRUCTIONS).reduce((acc, key) => ({
  ...acc,
  [key]: null
}), {});

module.exports = {
  ENV_VARIABLES_WITH_INSTRUCTIONS,
  WEBPACK_ENV_VARIABLES,
  RESOLVE_ALIASES: resolveAlias
}

logInstruction('[shared-webpack-configuration.js]' + '[Export webpack config]');
logInstruction(JSON.stringify({
  ENV_VARIABLES_WITH_INSTRUCTIONS,
  WEBPACK_ENV_VARIABLES,
  RESOLVE_ALIASES: resolveAlias
}));


