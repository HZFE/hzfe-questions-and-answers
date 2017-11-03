# js引擎怎么实现Class关键字

class 在 ES5 时被 ECMAScript 列入了保留字（Reserved Words）中，意味着从 ES5 时你就不可以使用 class 作为标识符。在 ES6 时 class 终于被正式引入 ECMAScript 标准之中。class 的出现意味着我们可以不用写长串的代码来模拟其他语言中的类了。虽然 ES6 中的 class 依然是基于原型的实现（prototype-based inheritance），但是已经大大减少了我们的编码量，代码也更加简洁直观。那么 JS 引擎具体是如何实现 class 的呢？

## class 是个语法糖

ES6 中的 class 依旧是基于我们一直使用的原型的实现，本质上是一个语法糖。下面是 MDN 对 class 的简介：

> The class declaration creates a new class with a given name using prototype-based inheritance.
>
>You can also define a class using a class expression. But unlike the class expression, the class declaration doesn't allow an existing class to be declared again and will throw a type error if attempted. 
>
>Syntax
>class name [extends] {
>  // class body
>}

我们如果用 babel 来编译一个 class 会得到以下结果：

```javascript
// 代码
class Geeku {
    constructor() {
        console.log('constructor');
    }
    hello () {
        console.log('hello');
    }
}
// babel es2015-loose 编译后
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Geeku = function () {
  function Geeku() {
    _classCallCheck(this, Geeku);

    console.log('constructor');
  }

  Geeku.prototype.hello = function hello() {
    console.log('hello');
  };

  return Geeku;
}();
```

从编译后的代码我们可以看到 babel 对 class 的处理，那么实际的规范又是什么呢？


## ECMA-262 规范

[ECMA-262](http://www.ecma-international.org/ecma-262/6.0/#sec-class-definitions) 14.5 节就是有关 class 的规范。

从规范中我们可以知道 class 的语法结构是：

![](https://ws1.sinaimg.cn/large/006tKfTcgy1fl59iz3mupj30h00m075t.jpg)

后面一大堆的东西先不看，我们先来看 14.5.14 这一小节，这一小节的内容就是 class 运行时怎么一步步执行的。我们跟着这一小节的内容来一步步往后看。

![](https://ws4.sinaimg.cn/large/006tNc79gy1fl5amfsi98j315k1sm7ui.jpg)

从以上规范我们可以很清楚的看到，ES6 中的 class 依旧是 prototype 那一套东西。

## V8 中的具体实现

我们乘胜追击，来看看 V8 引擎中 class 的具体实现

// 追不动追不动，先 TODO 了