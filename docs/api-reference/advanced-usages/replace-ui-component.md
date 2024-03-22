# Replace UI Component with Component Dependency Injection
# 用组件依赖注入替换UI组件

To allow customize a child component, the library author usually has to pass the child component down as a prop from top of the component tree. This approach will work for component that are relatively small, but it won’t scale for kepler.gl because it has hundreds of child components. To give user the flexibility to render certain component differently. Kepler.gl has a dependency injection system that allows user to inject custom components to kepler.gl UI replacing the default ones at bootstrap time.

为了自定义一个子组件，库的作者通常需要将子组件作为props从组件树的最顶层传递下来。这种方法对于相对较小的组件是有效的，但对于kepler.gl来说却不行，因为它有数百个子组件。为了使用户能够按自己的方式渲染某些组件，kepler.gl具有一种依赖注入系统，它允许用户在kepler.gl UI启动时注入自定义组件，替换默认的组件。

All you need to do is to create a component factory for the one you wish to replace, import the original component factory and call `injectComponents` at where `KeplerGl` is mounted. `injectComponents` will return a new `KeplerGl` component instance that renders the custom child component. This way we don’t have to keep track of hundreds of component as props and pass them all the way down. Dependency injection only happens once when `keplerGl` component is imported.

你所需要做的就是为你想要替换的组件创建一个组件工厂，导入原始组件工厂并在KeplerGl挂载的地方调用injectComponents。injectComponents将返回一个新的KeplerGl组件实例，它渲染自定义的子组件。这样我们就无需跟踪作为props传递的数百个组件并将它们一路传递下去。依赖注入仅在keplerGl组件被导入时发生一次。

## Factory
## 工厂

For each high level component in kepler.gl, we export a `factory`. A `factory` is a function that takes a set of `dependencies` and return a component instance. In this example below, the `MapContainerFactory` takes `MapPopover` and `MapControl` as dependencies and returns the `MapContainer` component instance. Not all components are exported as factories in kepler.gl at the moment, we are still testing this feature.

对于kepler.gl中的每个高级组件，我们都导出一个factory。一个factory是一个函数，它接受一组dependencies并返回一个组件实例。在下面的例子中，MapContainerFactory接受MapPopover和MapControl作为依赖，并返回MapContainer组件实例。目前，并非所有组件都在kepler.gl中作为工厂导出，我们仍在测试这个功能。

```js
// 定义地图弹出窗口工厂
import MapPopoverFactory from 'components/map/map-popover';
// 定义地图操作工厂
import MapControlFactory from 'components/map/map-control';

// 定义地图组件，接收传入两个子组件
function MapContainerFactory(MapPopover, MapControl) {
 // 返回拥有地图+控制的地图组件
 return class MapContainer extends Component {
   render() {
     return (
       <div>
         <MapPopover {...popoverProps} />
         <MapControl {...controlProps} />
       </div>
      );
   }
 }
}
// 定义地图组件的两个依赖注入项(Factory)，可以通过component.injectComponents(...)将 Factory组件注入到 component 中。
MapContainerFactory.deps = [MapPopoverFactory, MapControlFactory];
```

## Recipes
## 食谱/配方

A recipe is an array of default factory, and the one to replace it. `[defaultFactory, customFactory]`. To replace default component, user can import the existing component factory, call `injectComponents` and pass in the new recipe to get a new `KeplerGl` instance.

食谱是一个默认工厂和要替换它的工厂的数组[defaultFactory, customFactory]。要替换默认组件，用户可以导入现有的组件工厂，调用injectComponents并传递新的食谱以获得新的KeplerGl实例。

### Inject Components
### 注入组件

In kepler.gl, we create the app injector by calling provide with an array of default recipes. We then export a `injectComponents` function that user can call to inject a different recipe and returns a new kepler.gl instance.

Here is an example of how to use `injectComponents` to replace default `PanelHeader`.

在kepler.gl中，我们通过调用提供函数并传递一个默认食谱数组来创建应用程序注入器。然后我们导出一个injectComponents函数，用户可以调用它来注入不同的食谱并返回一个新的kepler.gl实例。

以下是如何使用injectComponents来替换默认的PanelHeader的示例。

```js
import {injectComponents, PanelHeaderFactory} from 'kepler.gl/components';

// define custom header
// 自定义的 header 组件
const CustomHeader = () => (<div>My kepler.gl app</div>);

// create a factory
// 自定义的工厂，以及工厂所实现的返回组件内容
const myCustomHeaderFactory = () => CustomHeader;

// Inject custom header into Kepler.gl,
// 将自定义的 header 工厂注入到 kepler.gl 中去，实现替换。
const KeplerGl = injectComponents([
  [PanelHeaderFactory, myCustomHeaderFactory]
]);

// render KeplerGl, it will render your custom header
const MapContainer = () => <KeplerGl id="foo"/>;
```

##  Pass custom component props
## 传递自定义组件props

`injectComponents` allows user to render custom component, however, they usually also want to pass additional props to the customized component which current component injector doesn’t support. To enable passing additional props, we implemented a `withState`helper that passes additional props to the customized component. `withState` takes 3 arguments: `lenses`, `mapStateToProps` and `actionCreators`,  They allows user to pass in kepler.gl instance state, state from other part of the app, and custom actions.

injectComponents允许用户渲染自定义组件，但是，他们通常还希望向定制组件传递额外的props，而当前的组件注入器不支持。为了使传递额外的props成为可能，我们实现了一个withState助手，它将额外的props传递给定制的组件。withState接受三个参数：lenses、mapStateToProps 和 actionCreators，它们允许用户传入kepler.gl实例状态、来自应用程序其他部分的状态和自定义操作。

- `lense` - A getter function to get a piece of kepler.gl subreducer state. Kepler.gl exports lenses for all its sub-reducers. For instance when pass `mapStateLens` to `withState`, the component will receive `mapState` of current kepler.gl instance as a prop. 获取kepler.gl子reducer状态片段的getter函数。Kepler.gl为其所有子reducer导出lens。例如，当向withState传递mapStateLens时，组件将接收当前kepler.gl实例的mapState作为props。

- `mapStateToProps` - A wild card to play. You can pass a `mapStateToProps` function to get the state from any part of the app. If the lenses aren’t enough, use `mapStateToProps`. 一个可以随意发挥的参数。你可以传入一个mapStateToProps函数来获取来自应用程序任何部分的状态。如果lenses不够用，使用mapStateToProps。

- `actions` - action creators that will be passed to `bindActionCreators`. 将传递给bindActionCreators的操作创建器。

Here is an example of using `withState` helper to add reducer state and actions to customized component as additional props.

以下是使用withState助手向自定义组件传递reducer状态和操作作为额外props的示例。

```js
// 引入 withState
import {withState, injectComponents, PanelHeaderFactory} from 'kepler.gl/components';
// 导入 visStateLens
import {visStateLens} from 'kepler.gl/reducers';

// custom action wrap to mounted instance
// 定义一个动作 method。
const addTodo = (text) => ({
    type: 'ADD_TODO',
    text
});

// define custom header
// 自定义一个 header 的 component. 有一个 addTodo 的动作. 显示 visState。datasets 中数据的长度。
const CustomHeader = ({visState, todos, addTodo}) => (
  <div onClick={() => addTodo('say hello')}>{`${Object.keys(visState.datasets).length} dataset loaded`}</div>
);

// now CustomHeader will receive `visState` `todos` and `addTodo` as additional props.
// 定义自定义 header 组件，使用 withState(...) 将前面定义的 “visState, todos, addTodo” 参数添加到 props 中，并进行传递。 
const myCustomHeaderFactory = () => withState(
  // subreducer lenses
  [visStateLens],
  // mapStateToProps
  state => ({
     todos: state.todos
  }),
  // actions
  {addTodo}
)(CustomHeader);
```
