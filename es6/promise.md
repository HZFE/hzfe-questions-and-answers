## Promise的特点
* `Promise对象`有三种状态：`pending`、`fulfilled`、`rejected`。只有异步操作的结果，可以决定当前是哪一种状态，任何其他操作都无法改变这个状态。这也是`Promise`这个名字的由来，它的英语意思就是“承诺”，表示其他手段无法改变。对象的状态不受外界影响。

* `Promise对象`的状态改变，只有两种可能：从`pending`变为`fulfilled` / 从`pending`变为`rejected`。只要状态改变了，就不会再变。如果改变已经发生，你再对`Promise对象`添加回调函数，也会立即得到这个结果。这与事件`Event`完全不同，事件的特点是，如果你错过了它，再去监听，是得不到结果的。

* `Promise对象`可以将异步操作以同步操作的流程表达出来，避免了层层嵌套的回调函数。此外，`Promise对象`提供统一的接口，使得控制异步操作更加容易。`Promise`也有一些缺点：
1. 无法取消`Promise`，一旦新建它就会立即执行，无法中途取消。
2. 如果不设置回调函数，`Promise`内部抛出的错误，不会反应到外部。
3. 当处于`pending`状态时，无法得知目前进展到哪一个阶段（刚刚开始还是即将完成）。

## 基本使用方法
```javascript
var getData = function (url) {
  // new Promise构造器之后，会返回一个promise对象
  return new Promise(function (resolve, reject) {
    // 异步处理。处理结束后、调用resolve 或 reject
    let req = new XMLHttpRequest()
    req.onreadystatechange = function () {
      if (req.readyState == 4) {
        if ((req.status >= 200 && req.status < 300) || req.status == 304) {
          resolve(req.responseText)
        } else {
          reject(new Error(req.status))
        }
      }
    }
    req.open("get", url, true)
    req.setRequestHeader("MyHeader", "MyValue")
    req.send(null)
  })
}

var url = "http://httpbin.org/get"

// 1.
// 通过new生成的promise对象为了设置其值在 resolve(成功)/reject(失败)时调用的回调函数，可以使用promise.then()实例方法。
// resolve(成功) 时 onFulfilled 会被调用
// reject(失败)  时 onRejected  会被调用
// onFulfilled、onRejected 两个都为可选参数。
// getData(url)
//   .then(onFulfilled, onRejected)

// 2.
// promise.then成功和失败时都可以使用。另外在只想对异常进行处理时可以采用 promise.then(undefined, onRejected) 这种方式，只指定reject时的回调函数即可。
// 不过这种情况下 promise.catch(onRejected) 应该是个更好的选择。(就是promise.then(undefined, onRejected)的别名)
getData(url)
  .then(function(result){
    // 获取请求数据成功时的处理
    console.log(result)
  })
  .catch(function(error){
    // 获取请求数据失败时的处理
    console.log(error)
  })
```

## API详解

Promise#resolve
```javascript
new Promise(function(resolve, reject) {
  resolve(123)
})
// 等价于
Promise.resolve(123)
// 其返回值也是一个promise对象，所以可以对其返回值进行.then调用
Promise.resolve(42).then(function(value){
    console.log(value) // 42
});
// Promise的很多处理内部也是使用了 Promise.resolve 算法将值转换为promise对象后再进行处理的。
```

Promise#reject
```javascript
new Promise(function(resolve,reject){
    reject(new Error("出错了"));
});
// 等价于
Promise.reject(new Error("出错了"))
// 它和Promise.resolve(value) 的不同在于promise内调用的函数是reject而不是resolve。
```

Promise只能使用异步调用方式
```javascript
var promise = new Promise(function (resolve){
  console.log("A");
  resolve(42);
});
promise.then(function(value){
  console.log("B");
});
console.log("C");

// A
// C
// B
```

Promise#then
```javascript
var increment = val => val+1
var doubleUp  = val => val*2
var output    = val => console.log(val)

var promise = Promise.resolve(1);
// 每个方法中 return 的值不仅只局限于字符串或者数值类型，也可以是对象或者promise对象等复杂类型。
// return的值会由 Promise.resolve(return的返回值); 进行相应的包装处理。
// 因此不管回调函数中会返回一个什么样的值，最终 then 的结果都是返回一个新创建的promise对象
promise
  .then(increment)
  .then(doubleUp)
  .then(output)
  .catch(function(error){ console.error(error) });
// Promise#then 不仅仅是注册一个回调函数那么简单，它还会将回调函数的返回值进行变换，创建并返回一个promise对象。
```

Promise#catch
```javascript
// 在ECMAScript 3中保留字是不能作为对象的属性名使用的。
// 而IE8及以下版本都是基于ECMAScript 3实现的，因此不能将 catch 作为属性来使用，也就不能编写类似 promise.catch() 的代码
// 因此就出现了 identifier not found 这种语法错误了。
// 而现在的浏览器都是基于ECMAScript 5的，而在ECMAScript 5中保留字都属于 IdentifierName ，也可以作为属性名使用了。

// 点标记法（dot notation） 要求对象的属性必须是有效的标识符（在ECMAScript 3中则不能使用保留字）。
// 但是使用 中括号标记法（bracket notation）的话，则可以将非合法标识符作为对象的属性名使用。
// 也就是说，上面的代码如果像下面这样重写的话，就能在IE8及以下版本的浏览器中运行了（当然还需要polyfill）。
var promise = Promise.reject(new Error("message"));
promise["catch"](function (error) {
  console.error(error);
});
// 或者使用then的写法
var promise = Promise.reject(new Error("message"));
promise.then(undefined, function (error) {
  console.error(error);
});
```

Promise.all
```javascript
// Promise.all 接收一个 promise对象的数组作为参数。数组中的promise对象[同步执行]。
// 当这个数组里的所有promise对象全部变为resolve或reject状态的时候
// 它才会去调用 .then 方法，then获得的promise数组的执行结果顺序不变。
```

Promise.race
```javascript
// Promise.all 在接收到的所有的对象promise都变为 FulFilled 或者 Rejected 状态之后才会继续进行后面的处理
// Promise.race 只要有一个promise对象进入 FulFilled 或者 Rejected 状态的话，就会继续进行后面的处理
// 但是Promise.race 在第一个promise对象变为Fulfilled之后，并不会取消其他promise对象的执行。
// 在 ES6 Promises 规范中，也没有取消（中断）promise对象执行的概念，我们必须要确保promise最终进入resolve or reject状态之一
```

在一个`.then`里同时指定`onFulfilled`和`onRejected`，和使用`.catch`有什么区别。
```javascript
function throwError(value) { throw new Error(value) }

// 1. onRejected不会被调用
function badMain(onRejected) {
  return Promise.resolve(42)
                .then(throwError, onRejected)
}

// 2. 有异常发生时onRejected会被调用
function goodMain(onRejected) {
  return Promise.resolve(42)
                .then(throwError).catch(onRejected);
}

// 运行示例
badMain(function(){
  console.log("BAD"); // 不被执行
});
goodMain(function(){
  console.log("GOOD"); // 被执行
});

// badMain:
// 虽然我们在 .then 的第二个参数中指定了用来错误处理的函数，但实际上它却不能捕获第一个参数 => onFulfilled 指定的函数（本例为 throwError ）里面出现的错误。
// goodMain:
// 代码则遵循了 throwError => onRejected 的调用流程。 这时候 throwError 中出现异常的话，在会被方法链中的下一个方法，即 .catch 所捕获，进行相应的错误处理。

// .then方法中的onRejected参数所指定的回调函数，实际上针对的是[[其promise对象]]或者[[之前的promise对象]]
// 而不是针对.then方法里面指定的第一个参数，即onFulfilled所指向的对象，这也是 then 和 catch 表现不同的原因。
// 这种情况下 then 是针对 Promise.resolve(42) 的处理，在onFulfilled 中发生异常，在同一个 then 方法中指定的 onRejected 也不能捕获该异常。
```

## Promise扩展类库
[kriskowal/q](https://github.com/kriskowal/q)

类库 Q 实现了 Promises 和 Deferreds 等规范。 它自2009年开始开发，还提供了面向Node.js的文件IO API Q-IO 等， 是一个在很多场景下都能用得到的类库。

[petkaantonov/bluebird](https://github.com/petkaantonov/bluebird)

这个类库除了兼容 Promise 规范之外，还扩展了取消promise对象的运行，取得promise的运行进度，以及错误处理的扩展检测等非常丰富的功能，此外它在实现上还在性能问题下了很大的功夫。

## 学习资料
[Promise 对象](http://es6.ruanyifeng.com/#docs/promise)

[JavaScript Promise迷你书（中文版）](http://liubin.org/promises-book/)