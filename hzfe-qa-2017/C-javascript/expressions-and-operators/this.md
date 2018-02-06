## this的值

### 全局上下文

在函数体外部，也就是全局执行上下文中，无论是否在严格模式下，`this` 都指代全局对象。

### 函数上下文

在函数体内部，`this` 的值由函数的调用方式决定。请参考 [函数有哪几种执行方式](hzfe-qa-2017/C-javascript/function/function-invocation.md) 这篇内容看详细解释。

  - 简单调用
    - 非严格模式：`this === 全局对象`
    - 严格模式：`this === undefined`
  - 箭头函数
    - 只由创建时的词法上下文决定，不能通过 `bind / call / apply` 改变 `this`
  - bind 方法
    - 被创建的新函数的 `this` 永久被绑定为 `bind` 方法的第一个参数
  - call / apply 方法
    - `this` 被绑定到 `call / apply` 方法的第一个参数
  - 作为对象的方法 / 原型链上的方法 / 作为 getter 或 setter
    - `this` 是调用该方法的对象
  - 作为构造函数
    - `this` 被绑定到构造出的新对象
  - 作为DOM事件处理函数
    - `this` 指向触发事件的元素
  - 作为内联事件处理函数
    - `this` 指向监听器所在的DOM元素

## 相关面试题

根据以上总结，我们来速度简答以下this的面试题！

- [x] 严格模式下全局调用函数this指向什么

`undefined`

- [x] es6箭头函数和普通函数的区别

箭头函数的this只和创建时的词法上下文有关，而普通函数的this可以根据其调用方法而改变。

## 学习资料

[MDN - THIS](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)