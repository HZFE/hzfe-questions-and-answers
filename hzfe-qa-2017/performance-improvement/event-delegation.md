### 为什么需要事件委托

在JavaScript中，添加到页面上的事件处理程序数量将直接关系到页面的整体运行性能：每当将事件处理程序指定给元素时，运行中的浏览器代码与支持页面交互的JavaScript代码之间就会建立一个连接。这种连接越多，页面执行起来就越慢。导致这一问题的原因是多方面的。首先，每个函数都是对象，都会占用内存；内存汇总的对象越多，性能就越差。其次，必需事先指定所有事件处理程序而导致的DOM访问次数，会延迟整个页面的交互就绪时间。

想象假如存在一个`table`中有10列，100行。在用户点击单元格时需要作出一些响应。如果对这1000个单元格分别加上事件处理程序，这将会导致严重的性能问题。

### 怎么样事件委托

事件委托利用了事件冒泡，如果我们有一系列类似的元素需要监听事件，那么我们可以直接在这些元素的共同父元素上，指定一个事件处理程序。像下面的代码，我们使用事件委托只为`table`元素添加了一个`click`事件处理程序，由于所有的`td`都是这个元素的子节点，而且click事件会冒泡，所以`td`的`click`事件会被这个函数处理。这样写后，我们可以任意在table中添加/删除`<td>`，不需要额外新增事件处理程序或移除。

与不使用事件委托相比，这里只取得了一个DOM元素，只添加了一个事件处理程序。

```javascript
function getEventTarget(e) {
  e = e || window.event;
  return e.target || e.srcElement;
}

let table = document.getElementById('hzfeTable')

table.addEventListener('click', function (event) {
  let target = getEventTarget(event) // where was the click?
  if (target.tagName != 'TD') return; // not on TD? Then we're not interested
  doSomething(target)
}, false)
```

### 学习资料
[Event delegation](https://javascript.info/event-delegation)