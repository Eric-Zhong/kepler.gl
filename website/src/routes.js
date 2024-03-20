// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import window from 'global/window';
import store from './reducers';
/* 首页 */
import Home from './components/home';
/* App 入口 */
import App from './components/app';
/* kepler Demo 页面 */
import Demo from '../../examples/demo-app/src/app';
/* 支持策略 */
import Policy from './components/policy';

import { buildAppRoutes } from '../../examples/demo-app/src/utils/routes';

/* kepler demo 中定义的 router 数据 */
const appRoute = buildAppRoutes(Demo);

/*
这段代码定义了一个名为trackPageChange的函数，该函数接收一个参数location。
函数的主要目的是检查传入的location字符串是否包含3个部分(以/分隔),
如果包含，则从第三个部分(索引为2)获取sampleId,
并使用Google Analytics的gtag方法发送一个名为load_sample的事件，
同时设置事件的event_label和value属性为sampleId。
这个函数通常用于跟踪网站页面的变化，例如在用户导航到不同的样本页面时。
*/
const trackPageChange = location => {
  const links = location.split('/');
  if (links.length === 3) {
    const sampleId = links[2];
    // window.gtag('event', 'load_sample', {
    //   event_label: sampleId,
    //   value: sampleId
    // });
  }
};

/*
在 React 中，syncHistoryWithStore 函数用于将 React Router 的路由历史记录与 Redux 的 store 同步。 
这意味着，当路由发生变化时，store 中的状态也会随之更新。
    history: React Router 的路由历史记录对象
    store: Redux 的 store 对象
syncHistoryWithStore 函数返回一个新的路由历史记录对象。 这个新的路由历史记录对象会监听 store 的变化，并在 store 中的状态发生变化时更新路由。
使用 syncHistoryWithStore 函数可以实现以下功能：
    在路由发生变化时，自动更新 store 中的状态
    在 store 中的状态发生变化时，自动更新路由
这可以使您的 React 应用程序更加易于维护和理解。
*/
const history = syncHistoryWithStore(browserHistory, store);

history.listen(location => {
  if (location.action === 'POP') {
    trackPageChange(location.pathname);
  }
});

/*
判断是不是旧的 URL
*/
function isOldUrl(location) {
  return Boolean(
    location.pathname === '/' &&
    location.hash &&
    location.hash.startsWith('#/demo')
  );
}

function onEnter(nextState, replace, callback) {
  /**
   * For backward compatibility, when we see a url path starting with '#/demo/...'
   * we redirect to '/demo/.../
   * 为了保持向后兼容性，当我们看到一个以 '#/demo/...' 开头的 URL 路径时，我们将把它重定向到 '/demo/...'
   **/
  if (isOldUrl(nextState.location)) {
    replace(location.hash.substring(1));
  }
  callback();
}

// eslint-disable-next-line react/display-name
// Tip: onEnter 是一个路由钩子，它会在进入路由之前触发。 它可以用于在进入路由之前执行一些操作，例如：
// 检查用户是否登录
// 加载数据
// 重定向到其他路由
// 
// onEnter 可以接受两个参数：
// nextState: 下一个路由的状态
// replace: 一个用于替换当前路由的函数
//
// IndexRoute 组件用于指定一个路由的默认子路由。 当父路由的路径匹配时，但子路由的路径不匹配时，就会渲染默认子路由。
// 
export default () => (
  <Router history={history}>
    <Route path="/" component={App} onEnter={onEnter}>
      <IndexRoute component={Home} onEnter={onEnter} />
      <Route path="/policy" component={Policy} onEnter={onEnter} />
      {/* 填充进 kepler demo 页面中定义的 status 内容 */}
      {appRoute}
    </Route>
  </Router>
);
