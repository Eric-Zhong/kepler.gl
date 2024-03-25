// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {createAction, handleActions} from 'redux-actions';
import KeplerGlSchema from '../../../src/schemas/src';

/*
# 定义应用级的 Reducer 

React中的reducer是一个纯函数，它接收当前的state和一个action，然后根据action的类型返回一个新的state。

reducer的定义通常包含以下几个步骤：

* 定义初始状态：在开始使用reducer之前，需要定义一个初始状态作为reducer的起始点。
* 定义action类型：actions是发送数据的对象，它们包含了要执行的操作类型以及可能需要的任何相关数据。
* 处理action：reducer函数会检查action的类型，并根据这个类型来更新state。

使用reducer的场景包括：

管理全局状态：当应用的状态需要跨多个组件共享时，可以使用reducer来集中管理这些状态。
实现复杂的状态逻辑：如果状态更新依赖于多个因素或条件，使用reducer可以帮助组织这些逻辑。
替代useState：对于复杂组件，当需要管理多个内部状态时，useReducer可以作为useState的替代品，帮助简化状态管理。
*/

// CONSTANTS
export const INIT = 'INIT';
export const SET_MAP_CONFIG = 'SET_MAP_CONFIG';

// ACTIONS
export const appInit = createAction(INIT);
export const setMapConfig = createAction(SET_MAP_CONFIG);

// INITIAL_STATE
const initialState = {
  appName: 'example',
  loaded: false
};

// REDUCER
const appReducer = handleActions(
  {
    [INIT]: (state, action) => ({
      ...state,
      loaded: true
    }),
    // 当收到 'SET_MAP_CONFIG' 的 reducer 时，处理获取 app config 过程。
    [SET_MAP_CONFIG]: (state, action) => ({
      ...state,
      // 在 app.props 中增加 mapConfig 属性
      mapConfig: KeplerGlSchema.getConfigToSave(action.payload)
    })
  },
  initialState
);

export default appReducer;
