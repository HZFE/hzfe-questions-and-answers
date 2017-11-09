# CSS重绘与回流

## 浏览器渲染过程
我们先来讨论一下浏览器在接收到HTML、CSS和JavasSript后，怎样把页面呈现在屏幕上的？
不同的浏览器的渲染过程存在些许不同，但大体的机制是一样的，下图展示了浏览器下载完所有代码后的大致工作流程：
![img](img/repaint_reflow_1.png)

* ##### 首先，浏览器解析HTML源码并构建一个DOM树：在DOM树中，每个HTML标签都有相应的节点，并且在介于两个标签中间的文字块也对应一个text节点。DOM树的根节点是documentElement，也就是<html>标签；
* ##### 然后，浏览器对CSS代码进行解析，一些当前浏览器不能识别的CSS hack写法（如-webkit前缀）将被忽略。CSS样式中包括浏览器默认样式（user agent stylesheet），用户自定义样式表（通过<link> / import引入的外部样式&行内样式）。最终样式会写入HTML标签的style属性中；
* ##### 接着，构建render树。render树跟DOM树有点像但不完全一样。render树能识别样式。假如你用display: none隐藏一个div，这个标签不会在render树中出现。这个规则适用于其他不可视元素，比如head标签等；另外，一个DOM元素在render树中可以有多个节点，比如代表p标签的一个文本节点中的每一行文字，又有一个渲染节点。render树中的节点叫做frame-结构体/box-盒子，这些节点都有CSS盒子属性：width, height, border, margin 等等
* ##### 最后，render树构建完毕，浏览器便开始将渲染节点绘制到屏幕上。

## 森林和树
```html
<html>
<head>
  <title>Beautiful page</title>
</head>
<body>
    
  <p>
    Once upon a time there was 
    a looong paragraph...
  </p>
  
  <div style="display: none">
    Secret message
  </div>
  
  <div><img src="..." /></div>
 
</body>
</html>
```
这个HTML文档对应的DOM树：每个标签对应一个节点，以及每个标签之间的文本也为一个节点。（实际上，空白区域也会被映射为一个text节点，为了简单说明，在此忽略）。因此DOM树：
```html
documentElement (html)
  head
    title
  body
    p
      [text node]
      
    div 
      [text node]
  
    div
      img
```
render树包含了DOM树的可视部分。因此他丢掉了一些东西，比如头部head标签和隐藏的div，同时他也为文本块增加了节点（又称作frames，boxs）。因此render树：
```javascipt
root (RenderView)
  body
    p
      line 1
      line 2
    div
      img
```
渲染树的root根节点是一个包括了所有其他节点的结构体（盒子）。你可以将它理解为浏览器窗口的内部区域，毕竟页面被限制在这个区域内。从技术上，WebKit把root节点称为RenderView（渲染视图），他与CSS初始包含块相对应，从坐标(0,0)到(window.innerWidth,window.innerHeight)。

接下来，我们将研究浏览器是如何通过循环遍历渲染树把页面展示到屏幕上的。

## WHAT - Repaints and reflows

你的页面中至少存在一个初始页面布局，并且和一次绘制动作。当然这仅仅是第一次绘制，在此之后，在用户的交互行为中，页面结构以及CSS可能会有变化。任何影响到渲染树的行为都会触发以下一种或者多种动作：

* ##### render树的局部或全部需要重新验证，节点大小需要重新计算。这种行为成为reflow回流。请注意这里存在至少一次reflow行为：就是初始化页面布局时的那次。
* ##### 屏幕的部分区域需要进行更新：可能是因为节点的几何结构改变，或样式改变（如背景色变化）。这种屏幕更新动作叫repaint/redraw。

重绘和回流可能是昂贵的，它们可能会伤害用户体验，并使用户界面显得迟钝。

## WHEN - 触发重绘/回流的机制

任何影响到构造渲染树的行为都会触发repaint或reflow，例如
```bash
1.DOM元素的增删改
2.通过display:none隐藏节点(重绘+回流)，通过visibility:hidden隐藏(重绘，因为没有几何结构的改变)
3.节点的移动、动画
4.样式表的增删改
5.浏览器窗口变化（滚动或缩放）
······（待补充）
```

举个栗子：
```javascript
// cache
var bstyle = document.body.style;

// reflow, repaint
bstyle.padding = "20px"; 
// another reflow and a repaint
bstyle.border = "10px solid red";
 
// repaint only
bstyle.color = "blue";
// repaint only
bstyle.backgroundColor = "#fad";

// reflow, repaint
bstyle.fontSize = "2em";

// reflow, repaint (new DOM element)
document.body.appendChild(document.createTextNode('dude!'));
```

可见，repaint是指元素的样式改变不影响文档流整体结构时，渲染树结构也就没有变化，因此仅仅是重新显示样式。重绘的代价是比较小的。注意，这并不是说样式改变不会导致回流，只是特定样式改变，才不会导致回流。第二个需要注意的点是，reflow一定需要repaint，但是repaint却不需要reflow。
```javascript
/*  以下Css Property改变  */

1.background-color

2.color

3.visibility

······（待补充）
```

有些reflow行为要比其他的花销大一些。比如你对body中最后的一个直属子元素乱搞，你可能不会影响到什么其他的节点，但是如果你对body中最前面的一个节点添加动画，或者改变这个div的尺寸，这就会将后面跟着的所有元素都推下去了，这种行为是非常消耗性能的。

## HOW - 减少重绘和回流: 开发优化策略

由于reflows和repaints带来的render树的改变会导致昂贵的性能消耗，而浏览器的目标就是减少这种副作用。浏览器的策略就是不执行/推迟执行。他会设置一个队列用来存放这些行为变动的需求，并且一次性执行他们。也就是说，存在多个需要reflow的动作会被合并为一个reflow动作。浏览器将这些动作加入到缓存队列中，当到达一定的时间间隔，或者累积了足够多个后执行它们。

但是，有时候某些的代码会破坏上述的浏览器优化机制，导致浏览器刷新缓存队列并且执行所有已缓存的操作行为。这种情况发生在获取下面这些样式信息的行为中：

```javascript
offsetTop, offsetLeft, offsetWidth, offsetHeight
scrollTop/Left/Width/Height
clientTop/Left/Width/Height
getComputedStyle(), 或者IE下的currentStyle
```
以上的行为本质上是获取一个节点的样式信息，浏览器必须提供最新的值。为了达到此目的，浏览器需要将缓存队列中的所有行为全部执行完毕，并且被强制回流。所以，在一条逻辑中同时执行set和get样式操作时非常不好的，如下：
```javascript
el.style.left = el.offsetLeft + 10 + "px";
```
```javascript
// 最终只有一次重绘和回流被触发
var $body = $('body');
$body.css('padding', '1px'); // 触发重绘与回流
$body.css('color', 'red'); // 触发重绘
$body.css('margin', '2px'); // 触发重绘与回流

//两次回流
var $body = $('body');
$body.css('padding', '1px');
$body.css('padding'); // 此处触发强制回流
$body.css('color', 'red');
$body.css('margin', '2px');
```
减少reflows/repaints引起的用户体验上的负面影响的策略是尽量少的引起reflows/repaints，以及尽量少的请求获得样式信息，由此，浏览器则可以利用其机制优化合并reflows行为。那么怎么做呢？
* ##### 不要一个一个的去改样式。最明智及可维护的是去改变class名，而不是样式。但是这种是指静态的样式修改。假如样式是动态变化的，可以选择修改cssText，而不是每次有变动就直接操作元素的每个style属性。
```javascript
// bad
var left = 10,
    top  = 10;
el.style.left = left + "px";
el.style.top  = top  + "px";

// better 
el.className += " theclassname";

// better
el.style.cssText += "; left: " + left + "px; top: " + top + "px;";
```
* ##### "离线"处理多个DOM操作。“离线”的意思是将需要进行的DOM操作脱离DOM树，比如：
```javascript
1.用documentFragment集中处理临时操作；
2.将需要更新的节点克隆，在克隆节点上进行更新操作，然后把原始节点替换为克隆节点；
3.先通过设置display:none将节点隐藏（此时出发一次回流和重绘），然后对隐藏的节点进行100个操作（这些操作都会单独触发回流和重绘），完毕后将节点的display恢复显示（此时再次触发一次回流和重绘）。通过这种方法，将可能存在的多次repaints/reflows缩减为2次。
```
* ##### 不要过度进行计算样式的操作。如果你需要用到一个样式值，请用局部变量储存，然后利用这个局部变量进行相关操作。例如：
```javascript
// bad
for(big; loop; here) {
  el.style.left = el.offsetLeft + 10 + "px";
  el.style.top  = el.offsetTop  + 10 + "px";
}
 
// better
var left = el.offsetLeft,
    top  = el.offsetTop
    esty = el.style;
for(big; loop; here) {
    left += 10;
    top  += 10;
    esty.left = left + "px";
    esty.top  = top  + "px";
}
```
理解浏览器重绘以及回流的主要目的是为了优化性能。当你在打算改变样式时，首先考虑一下渲染树的机制，并且评估一下你的操作会引发多少刷新渲染树的行为。例如，浏览器认为 position 为 absolute 或 fixed 的元素更改只会影响其本身和子元素，而 static 的元素变化则会影响之后的所有元素，也就是说，一个绝对定位的节点是会脱离文档流，所以当对此节点应用动画时不会对其他节点产生很大影响，当绝对定位的节点置于其他节点上层时，其他节点只会触发重绘，而不会触发回流。

## 怎样使用devtools查看回流和重绘

[分析绘制](https://developers.google.com/web/tools/chrome-devtools/evaluate-performance/timeline-tool?hl=zh-cn#profile-painting)

[渲染性能](https://developers.google.com/web/fundamentals/performance/rendering/?hl=zh-cn)

[无线性能优化：Composite](http://taobaofed.org/blog/2016/04/25/performance-composite/)

[GPU Accelerated Compositing in Chrome](http://www.chromium.org/developers/design-documents/gpu-accelerated-compositing-in-chrome)

## 学习资料
[Rendering: repaint, reflow/relayout, restyle](https://www.phpied.com/rendering-repaint-reflowrelayout-restyle/) (以上内容97%翻译自此原文)

[[翻译]浏览器渲染Rendering那些事](http://www.cnblogs.com/ihardcoder/p/3927709.html) (以上内容参考了此翻译文章，并修正了不准确的翻译或错误部分)