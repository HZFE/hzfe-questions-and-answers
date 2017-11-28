# react性能优化——浅比较

在优化react应用时，绝大部分的优化空间在于避免不必要的render——即Virtual DOM的生成，这不仅可以节省执行render的时间，还可以节省对DOM节点做Diff的时间。

那么如何避免不必要的render，那么首先我们应该知道什么时候会触发组件的render。答案就是shouldComponentUpdate。

### 1. shouldComponentUpdate

React在组件的生命周期中提供了一个钩子shouldComponentUpdate,这个方法默认返回true，表示需要执行render方法并使用其返回值作为新的Virtual DOM节点。反之当这个方法返回false的时候，react不会调用render方法生成新的Virtual DOM节点，而是使用原有的Virtual DOM节点，这是最常用避免render的方法，也就是"短路"(short circuit)。

shouldComponentUpdate方法会获得两个参数，nextProps和nextState，常见的实现方式是将新旧state和props分别进行比较，确认没有改动或改动对组件没有影响的情况下返回false，否则返回true。

对于简单类型的state和props来说，可以直接通过===比较，然而随着业务逻辑的需要，组件的state和props通常是复杂类型(Object,Array等)，此时===意味着引用，即使引用比较结果为false，但是内容也有可能是一致的，只有对整个数据结构进行深层比较才能够得到正确的答案。但是，shouldComponentUpdate是一个被频繁调用的方法，而每一次都去做深层比较会带来很大的代价。在数据结构比较复杂的情况下，甚至会比重新render一遍还要低效，这样通过shouldComponentUpdate实现"短路"也失去了意义。因此最终的结论是采用浅比较(shallow compare)，即只遍历一层子节点。即对于下面的两个对象：

```javascript
const props = { foo, bar };
const nextProps = { foo, bar };
```

浅比较会对props.foo与nextProps.foo、props.bar与nextProps.bar进行比较(===)，而不会深入比较props.foo与nextProps.foo的内容。这样一来，比较的复杂度会大大降低。

上面的意思其实可以理解成只比较对象的 __"第一层"属性__，当属性对应的值为 __简单类型__时，直接理解成做 __===__ 比较，而当属性对应的值为 __复杂类型__ 时，只会比较两者 __是否是同一个对象的引用而不会去比较具体属性值对象中的每一个属性的值__。

### 2. react浅比较的实现方式

#### PureRenderMixin

PureRenderMixin是react官方提供的浅比较的实现，示例如下：
```javascript
var PureRenderMixin = require('react-addons-pure-render-mixin')
React.createClass({
  mixins: [PureRenderMixin],
  render: function() {
    return <div className={this.props.className}>foo</div>
  }
});
```
ES6中的用法是：
```javascript
import PureRenderMixin from 'react-addons-pure-render-mixin';
class FooComponent extends React.Component {
  constructor(props) {
    super(props)
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this)
  }

  render() {
    return <div className={this.props.className}>foo</div>
  }
}
```
虽然ES6的用法React组件并不支持，但你也可以这样做。手动将PureRenderMixin提供的shouldComponentUpdate挂载到组件实例上，但此时可以选择React提供的另一个辅助工具shallow-compare。

#### shallow-compare
```javascript
import shallowCompare from 'react-addons-shallow-compare'
class FooComponent extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  render() {
    return <div className={this.props.className}>foo</div>
  }
}
```
本质上和PureRenderMixin的实现方式是一致的。另外也有以高阶组件形式提供这种能力的工具，如recompose提供的pure方法，适合ES6写法的react组件，这里不展开介绍了。

#### PureComponent
在react 15.3.0之后就不推荐使用shallowCompare了，推荐使用15.3.0新增的PureComponent类，示例如下：
```javascript
import React, { PureComponent } from 'react'
class FooComponent extends PureComponent {
  render () {
    return <div className={this.props.className}>foo</div>
  }
}
```

### 3. react浅比较实现原理

由于对浅比较底层做的事情比较感兴趣，所以看了下相关实现方法的源码，发现底层都是调用一个shallowEqual方法，这个方法并不是react的一部分，而是 [fbjs](https://github.com/facebook/fbjs/blob/master/packages/fbjs/src/core/shallowEqual.js) 的一部分，相关代码如下：
```javascript
function is(x: mixed, y: mixed): boolean {
  // SameValue algorithm
  if (x === y) { // Steps 1-5, 7-10
    // Steps 6.b-6.e: +0 != -0
    // Added the nonzero y check to make Flow happy, but it is redundant
    return x !== 0 || y !== 0 || 1 / x === 1 / y;
  } else {
    // Step 6.a: NaN == NaN
    return x !== x && y !== y;
  }
}

function shallowEqual(objA: mixed, objB: mixed): boolean {
  if (is(objA, objB)) {
    return true;
  }

  if (typeof objA !== 'object' || objA === null ||
      typeof objB !== 'object' || objB === null) {
    return false;
  }

  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  // Test for A's keys different from B.
  for (let i = 0; i < keysA.length; i++) {
    if (
      !hasOwnProperty.call(objB, keysA[i]) ||
      !is(objA[keysA[i]], objB[keysA[i]])
    ) {
      return false;
    }
  }

  return true;
}
```

代码比较简单，其实就是上面提到的浅比较的实现，如果是基本类型就直接判断是否全等，如果是引用类型则遍历对应的key看对应的value是否相等，但是因为有使用flow做类型检测，需要大致了解一下flow的语法，另外代码还考虑到了0和NaN的情况,十分全面。

### 4.总结
虽然react提供了官方的类和相关的库来实现“短路”式的优化，不过在底层来说都是浅比较这一不变的思想，只不过随着时间推移越来越遍历，但是这些方法也不是万能的，特定情况下自己实现shouldComponentUpdate可能更加高效。

#### 参考资料
1. https://segmentfault.com/a/1190000006741060
2. https://reactjs.org/docs/shallow-compare.html
3. 《React全栈》
4. [shallowEqual.js](https://github.com/facebook/fbjs/blob/master/packages/fbjs/src/core/shallowEqual.js)
