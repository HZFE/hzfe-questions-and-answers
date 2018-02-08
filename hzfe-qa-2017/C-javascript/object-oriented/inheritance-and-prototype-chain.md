## 什么是原型链

原型链的构成是通过将一个类型的实例，赋值给另一个构造函数的原型对象。本质上就是拓展了原型的搜索机制。

举例说明：d是C的实例，C的原型对象是B的实例，B的原型对象是Object的实例，Object的原型对象是Object.prototype……

那么此时的原型链就是如下这条相互关联的原型组成的链状结构

```javascript
d ========> C.prototype ==========> B.prototype =============> Object.prototype =================> null
           (d.__proto__)      (C.prototype.__proto__)       (B.prototype.__proto__)     (Object.prototype.__proto__)
```

## 相关面试题

- [x] **__proto__ 的指向**

    构造函数创建一个新的实例后，实例内部有个指针，叫 `[[prototype]]`，指向创建该实例的构造函数的原型对象。部分浏览器在每个对象上添加了 `__proto__`属性，可以通过它来访问  `[[prototype]]` ，但是这个属性是非标准访问方式。在ES5中，可以使用 `Object.getPrototypeOf(instanceArg)` 来访问。

## 明天再充实这篇