## Why Debounce
浏览器中某些计算和处理要比其他的昂贵的多。例如，DOM操作比起非DOM交互需要更多的内存和CPU时间。连续尝试进行过多的DOM相关操作可能会导致浏览器挂起，有时候甚至会崩溃。尤其在IE中使用onresize事件处理程序的时候容易发生，当调整浏览器大小的时候，该事件连续触发。在onresize事件处理程序内部如果尝试进行DOM操作，其高频率的更改可能会让浏览器崩溃。

## How Debounce
```javascript
// 去抖背后的基本思想是，某些代码不可以在没有间断的情况连续重复执行。
// 第一次调用函数，创建一个定时器，在指定的时间间隔之后运行代码。
// 当第二次调用该函数时，它会清除前一次的定时器并设置另一个。
// 如果前一个定时器已经执行过了，这个操作就没有任何意义。
// 然而，如果前一个定时器尚未执行，其实就是将其替换为一个新的定时器。
// 目的是只有在执行函数的请求停止了一段时间之后才执行。

function debounce (method, context) {
  clearTimeout(method.tid)
  method.tid = setTimeout(function () {
    method.call(context)
  }, 100)
}

function test1 () { console.log('yo, hzfe') }
window.onresize = function () { debounce(test1) }
```

## underscore - debounce 源码分析
```javascript
// Returns a function, that, as long as it continues to be invoked, will not be triggered.
// The function will be called after it stops being called for N milliseconds.
// If `immediate` is passed, trigger the function on the leading edge, instead of the trailing.
_.debounce = function(func, wait, immediate) {
  var timeout, result;

  var later = function(context, args) {
    timeout = null;
    if (args) result = func.apply(context, args);
  };

  var debounced = restArgs(function(args) {
    // 如果已有定时器 则清除
    if (timeout) clearTimeout(timeout);
    if (immediate) {
      var callNow = !timeout;
      // 此处的回调函数later不会被执行进func的apply方法，因为没有args
      // immediate为真的情况下 仅在wait秒内，反复调用的第一次触发一个func
      // 之后在wait毫秒以内再次进入此处时，timeout已存在，later函数就用于重新记录新的定时器
      timeout = setTimeout(later, wait);
      // timeout为null 对func的第一次调用
      if (callNow) result = func.apply(this, args);
    } else {
      timeout = _.delay(later, wait, this, args);
    }

    return result;
  });

  debounced.cancel = function() {
    clearTimeout(timeout);
    timeout = null;
  };

  return debounced;
};
```

## Why Throttle
简单的说，函数节流能使得连续的函数执行，变为固定时间段间断地执行。还是以 scroll 事件为例，如果不加以节流控制：轻轻滚动下窗口，控制台打印了 N 多个 hello world 字符串。如果 scroll 回调不是简单的打印字符串，而是涉及一些 DOM 操作，这样频繁的调用，低版本浏览器可能就会直接假死，我们希望回调可以间隔时间段触发。

## How Throttle
```javascript
// 比如当 scroll 事件刚触发时，打印一个 hello world，然后设置个 1000ms 的定时器
// 此后每次触发 scroll 事件触发回调，如果已经存在定时器，则回调不执行方法
// 直到定时器触发，handler 被清除，然后重新设置定时器。

Throttle = function (method, context) {
  return function () {
    if (method.tid) return
    method.tid = setTimeout(function () {
      method.call(context)
      method.tid = null
    }, 1000)
  }
}
function test2 () { console.log('hello world') }
window.onscroll = Throttle(test2)
```

## underscore - throttle 源码分析
```javascript
// Returns a function, that, when invoked, will only be triggered at most once during a given window of time.
// Normally, the throttled function will run as much as it can,
// without ever going more than once per `wait` duration;
// but if you'd like to disable the execution on the leading edge, pass `{leading: false}`.
// To disable execution on the trailing edge, ditto.
_.throttle = function(func, wait, options) {
  var timeout, context, args, result;
  var previous = 0;
  if (!options) options = {};

  var later = function() {
    previous = options.leading === false ? 0 : _.now();
    timeout = null;
    result = func.apply(context, args);
    if (!timeout) context = args = null;
  };

  var throttled = function() {
    var now = _.now();

    // 首次触发时 若leading=false 则previous为当前时间戳
    // 目的是让remaining为wait毫秒，不会立即触发func
    if (!previous && options.leading === false) previous = now;

    var remaining = wait - (now - previous);
    context = this;
    args = arguments;

    // 如果remaining <= 0 或者 remaining > wait（表示客户端系统时间被调整过）时
    // 1.如果存在定时器，把定时器清除 + 重置id
    // 2.立即执行func，并将这次触发throttled方法的时间戳保存
    // 3.如果不存在定时器，把上下文 + 参数列表重置
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    }

    // 不存在定时器 且未指定 options.trailing = false
    // 1.则在remaining毫秒后执行later
    else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }
    return result;
  };

  throttled.cancel = function() {
    clearTimeout(timeout);
    previous = 0;
    timeout = context = args = null;
  };

  return throttled;
};
```

## difference between throttling and debouncing
```javascript
Throttling enforces a maximum number of times a function can be called over time.
As in "execute this function at most once every 100 milliseconds."

Debouncing enforces that a function not be called again until a certain amount of time has passed without it being called.
As in "execute this function only if 100 milliseconds have passed without it being called."
```

## 学习资料
[The Difference Between Throttling and Debouncing](https://css-tricks.com/the-difference-between-throttling-and-debouncing/)

[Debouncing and Throttling Explained Through Examples](https://css-tricks.com/debouncing-throttling-explained-examples/)

[JavaScript 函数节流和函数去抖应用场景辨析](https://github.com/hanzichi/underscore-analysis/issues/20)

[underscore 函数去抖的实现](https://github.com/hanzichi/underscore-analysis/issues/21)

[underscore 函数节流的实现](https://github.com/hanzichi/underscore-analysis/issues/22)
