// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

/*
这段代码是在JavaScript中导入一个名为createAction的函数，该函数来自于redux-actions库。
redux-actions是一个用于创建Redux操作的实用工具库。

在Redux中，操作(Actions)是改变应用状态的唯一方式。
每个操作都是一个包含两个部分的对象：一个类型(type)和一个数据对象(payload)。
当这个操作被分发到Redux store时，它会触发一个对应的reducer函数来处理这个操作并更新应用的状态。

createAction函数的作用就是帮助我们创建这样的操作。
它接收一个字符串参数作为操作的类型，并返回一个新的函数。
这个新的函数接收任意数量的参数，并将这些参数包装成一个操作对象。
这样，我们就可以使用createAction来创建具有描述性名称的操作，而不是使用简单的字符串或数字作为类型。
*/
import { createAction } from 'redux-actions';

/**
 * 定义一个 Redux 的 action，用于触发 Redux store 处理类型为 'SET_MAP_CONFIG' 的动作，更新 app 的 status。
 */
export const setMapConfig = createAction('SET_MAP_CONFIG', payload => payload);
