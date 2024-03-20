// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

// import 'babel-polyfill';
// import 'babel-register';

import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './reducers';
import Routes from './routes';
/* 
它提供了一种在Node.js环境中访问和操作DOM的方法。
这个包允许你在服务器端渲染JavaScript应用程序时，使用类似于浏览器的DOM API。
这对于构建静态网站生成器、服务器端渲染框架等场景非常有用。 
*/
import document from 'global/document';

/*
在React中，require('./static/favicon.png')是一种导入静态资源文件的方式。
它使用CommonJS模块系统（Node.js默认的模块系统）来加载指定的图片文件。
*/
require('./static/favicon.png');

const el = document.createElement('div');
document.body.appendChild(el);

const root = ReactDOM.createRoot(el);
root.render(
  <Provider store={store}>
    <Routes />
  </Provider>
);
