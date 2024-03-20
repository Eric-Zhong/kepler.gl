// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

const {existsSync} = require('fs');
const {execSync} = require('child_process');

console.log('-----------------------------------------------');
console.log('----  通过运行 yarn/nmp 命令完成项目的启动  -------');
console.log('-----------------------------------------------');

const folder = process.argv[2];
const script = process.argv[3];

console.log('Folder: ', folder);
console.log('Script: ', script);

const cmd = !existsSync(`${folder}/node_modules`)
  ? `yarn && npm run ${script}`
  : `npm run ${script}`;

console.log('command: ', cmd);

execSync(cmd, {
  cwd: folder,
  stdio: 'inherit'
});
