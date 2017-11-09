# React一些数据变化导致会让组件所有的全部渲染，用什么来解决

## 啥时候会重新渲染一个子组件？

当子组件的 `shouldComponentUpdate()` 的返回值为 `true` 时。而 `shouldComponentUpdate()` 的返回值默认为 `true`，所以嗦，如果子组件都没有做什么特别的处理，是一些特别普通的 `Component` 的话，父组件更新时就会更新所有的子组件。

## 咋避免？

### Option 1

你可以给你的子组件加上 `shouldComponentUpdate()` 方法，例如：

```javascript
class Messy extends Component {
    // ...
    shouldComponentUpdate (newProps, newState) {
        return newProps.val !== this.props.val;
    }
    // ...
}
```

### Option 2

还可以继承 React 自带的 `PureComponent` 类。

文档里是这么说的：

> React.PureComponent is exactly like React.Component but implements shouldComponentUpdate() with a shallow prop and state comparison.
> If your React component’s render() function renders the same result given the same props and state, you can use React.PureComponent for a performance boost in some cases.

于是乎只要这样就可以了：

```javascript
import { PureComponent } from 'react';
class Messy extends PureComponent {
    // ...
}
```

需要注意的是，`PureComponent` 进行的是浅比较，如果你的数据包含复杂的数据结构，那么可能就不太对了。如果有深层次的数据改变，你可以手动 `forceUpdate()` 或是使用 [immutable objects](https://facebook.github.io/immutable-js/)。

## 参考

[React: Parent component re-renders all children, even those that haven't changed on state change](https://stackoverflow.com/questions/40819992/react-parent-component-re-renders-all-children-even-those-that-havent-changed)