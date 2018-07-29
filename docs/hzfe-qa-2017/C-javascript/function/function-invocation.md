```bash
# 此页面贡献者：年轻的小铲
```
# 函数有哪几种执行方式

1. Invoking a Function as a Function
  - 简单调用
  - 箭头函数
  - DOM事件处理函数
  - DOM内联事件处理函数
2. Invoking a Function as a Method
  - 作为对象的方法 / 原型链上的方法 / 作为 getter 或 setter
3. Invoking a Function with a Function Constructor
  - 作为构造函数
4. Invoking a Function with a call / apply method
  - call / apply 方法



## 作为一个函数进行调用

这是一种最简单的调用函数的办法。这个函数没有明确赋予给任何对象，因此在浏览器中运行时，默认属于 `window对象` 的方法。全局变量、方法或函数容易出现命名冲突或者其他的bug。

```javascript
// myFunction() and window.myFunction() is the same function:
function myFunction(a, b) {
  return a * b;
}
myFunction(10, 2);           // Will return 20
window.myFunction(10, 2);    // Will also return 20
```

```javascript
// arrow functions
var myFunction = (a,b) => a*b
myFunction(10, 2);           // Will return 20
window.myFunction(10, 2);    // Will also return 20
```

## 作为一个方法在对象上调用

在下面的代码中， `myObject` 有个 `getThis` 方法，调用 `myObject.getThis()` 时， `this` 指向调用该方法的对象 `myObject` 。与“作为函数进行调用”对比：“作为函数进行调用”所指的函数是定义在 `Window对象` 上的，而且调用时不必显式指定 `Window` 的引用，除此以外，这两种方式是一样的。看下面的例子中，调用了相同函数，但是返回值根据函数上下文的不同，返回不同结果。

```javascript
// 在 JavaScript 中你可以将函数定义为一个对象的方法
var getThis = function () {
  return this
}
var myObject = {
  firstName:"John",
  lastName: "Doe",
  getThis: getThis
}
myObject.getThis();        // Will return {firstName: "John", lastName: "Doe", getThis: ƒ}
getThis();                 // Will return Window {frames: Window, postMessage: ƒ, blur: ƒ, focus: ƒ, close: ƒ, …}
```

## 作为构造器进行调用，创建一个新对象

如果函数调用前有一个 `new` 关键词，那么这就是将函数作为构造器进行调用的方式。这看起来像是新创建了一个函数，其实是创建了一个新的空对象，this指向新的对象，并且这个对象继承了他的构造函数中的属性和方法。如果没有显式的返回值，新创建的对象则作为构造器的返回值进行返回。通过构造器，使用相同的模式就可以更容易地创建多个对象，而无需再一遍又一遍地重复相同的代码。

```javascript
// This is a function constructor:
function myFunction(arg1, arg2) {
  this.firstName = arg1;
  this.lastName = arg2;
}

// This creates a new object
var x = new myFunction("John", "Doe");
x.firstName;                // Will return "John"

// This creates another new object
var y = new myFunction("John", "Doe");
y.firstName;                // Will return "John"

x == y                      // false
```

## 使用 call / apply 方法进行调用

到目前为止，我们看到，函数调用方式之间的主要差异是：执行上下文对象中的 `this` 的区别。

- 作为普通的全局函数调用时，上下文对象是全局对象（严格模式是undefined）；
- 作为箭头函数调用，上下文对象由其词法环境决定；
- 作为方法进行调用，上下文对象是方法的拥有者；
- 作为构造器调用，上下文对象则是新创建的对象实例；
- 作为事件处理函数，上下文对象是响应的Dom元素；

我们如果想自由指定函数上下文，可以使用 `call / apply`

```javascript
var a = 'Global';
var obj = {a: 'Custom'};

function whatsThis(arg) {
  return this.a;
}

whatsThis();          // 'Global'
whatsThis.call(obj);  // 'Custom'
whatsThis.apply(obj); // 'Custom'
```

也可以通过使用 `bind` 方法生成一个新的函数，再调用。如果是通过 `bind` 生成的函数，无论这个函数以什么方式被调用，他的执行上下文都不会再被改变，始终是调用 `bind` 时传入的第一个 `thisArg` 。

## 学习资料
[JavaScript Function Invocation](https://www.w3schools.com/js/js_function_invocation.asp)

[MDN - THIS](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/this)