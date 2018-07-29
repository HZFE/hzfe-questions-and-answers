```bash
# 此页面贡献者：年轻的小铲
```
## 什么是原型链

原型链的构成是通过将一个类型的实例，赋值给另一个构造函数的原型对象。本质上就是拓展了原型的搜索机制。

举例说明：d是C的实例，C的原型对象是B的实例，B的原型对象是Object的实例，Object的原型对象是Object.prototype……

那么此时的原型链就是如下这条相互关联的原型组成的链状结构

```javascript
d ========> C.prototype ==========> B.prototype =============> Object.prototype =================> null
           (d.__proto__)      (C.prototype.__proto__)       (B.prototype.__proto__)     (Object.prototype.__proto__)
```

## 基于原型链的继承

可以通过构造器创建对象，实现继承。比如：

```javascript
function Hzfer (name, age) {
  this.name = name;
  this.age = age
}

Hzfer.prototype = {
  constructor: Hzfer,
  type: 'Front-end',
  sayName: function () {
    console.log(this.name)
  }
}

var hzfeMember = new Hzfer('aki', 18)
// hzfeMember 是构造函数 Hzfer 的实例对象，该实例对象有 name 和 age
// hzfeMember 的内部属性 [[Prototype]] 指向 Hzfer.prototype
// 于是我们愉快的继承了 type 属性 sayName 方法
```

可以通过 `Object.create()` 创建对象，实现继承。比如：

```javascript
function Hzfer () {}

Hzfer.prototype = {
  constructor: Hzfer,
  type: 'Front-end',
  sayName: function () {
    console.log(this.name)
  }
}

var hzfeMember = Object.create(Hzfer.prototype, {
  name: {
    configurable: true,
    enumerable: true,
    writable: true,
    value: 'aki'
  },
  age: {
    configurable: true,
    enumerable: true,
    writable: true,
    value: 18
  }
})
```

## 相关面试题

- [x] **__proto__ 的指向**

    构造函数创建一个新的实例后，实例内部有个指针，叫 `[[prototype]]`，指向创建该实例的构造函数的原型对象。部分浏览器在每个对象上添加了 `__proto__`属性，可以通过它来访问  `[[prototype]]` ，但是这个属性是非标准访问方式。在ES5中，可以使用 `Object.getPrototypeOf(instanceArg)` 来访问。
