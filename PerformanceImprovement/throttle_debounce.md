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

## underscore - debounce
```javascript
// Returns a function, that, as long as it continues to be invoked, will not be triggered.
// The function will be called after it stops being called for N milliseconds.
// If `immediate` is passed, trigger the function on the leading edge, instead of the trailing.
_.debounce = function(func, wait, immediate) {
  var timeout, result

  var later = function(context, args) {
    timeout = null
    if (args) result = func.apply(context, args)
  }

  // restArgs: Similar to ES6's rest param
  var debounced = restArgs(function(args) {
    if (timeout) clearTimeout(timeout)
    if (immediate) {
      var callNow = !timeout
      timeout = setTimeout(later, wait)
      if (callNow) result = func.apply(this, args)
    } else {
      timeout = _.delay(later, wait, this, args)
    }

    return result
  })

  debounced.cancel = function() {
    clearTimeout(timeout)
    timeout = null
  }

  return debounced
}
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
[JavaScript 函数节流和函数去抖应用场景辨析](https://github.com/hanzichi/underscore-analysis/issues/20)