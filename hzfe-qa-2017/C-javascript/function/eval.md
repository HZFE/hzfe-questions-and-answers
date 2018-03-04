```bash
# 此页面贡献者：年轻的小铲
```
## 什么是 eval

`eval` 接受一个字符串参数（传入非字符串参数则直接返回参数内容）。js 解析器将传入 `eval` 的参数当作实际的 ECMAScript 语句来解析，并把执行结果返回到原位置。**直接**通过 `eval` 执行的代码，享有调用时的执行上下文环境，否则，变为全局上下文环境。

## eval 存在的问题

### 性能问题

下面提供两组比较，一种是eval执行的语句是固定的，一种是含有赋值的。 仅供参考。

> However, while some caching of compiled scripts may happen, this will only be limited to scripts that are eval'd repeated with no modification
```javascript
console.time('c')
let c = 1
for(var i = 0; i < 9999; i++) {
  eval('console.log(c)')
}
console.timeEnd('c')

console.time('d')
let d = 1
for(var i = 0; i < 9999; i++) {
  console.log(d)
}
console.timeEnd('d')
```

> A more likely scenario is that you are eval'ing scripts that have undergone slight modification each time and as such could not be cached.
```javascript
console.time('a')
let a = 1
for(var i = 0; i < 9999; i++) {
  eval('a++')
}
console.timeEnd('a')

console.time('b')
let b = 1
for(var i = 0; i < 9999; i++) {
  b++
}
console.timeEnd('b')
```

### 安全问题

由于 `eval` 中的字符串始终会被执行，所以要控制其使用场景，不应该对未知或未信任源传来的字符串使用 `eval` 函数，否则会引起 `xss` 攻击。我们不关心（也不能阻止）用户在他们自己的浏览器中执行脚本。我们试图避免的攻击是，将用户输入的值通过我们脚本中的 `eval` 方法获得执行。如果存在这种 `eval` 的使用场景，用户则可以提交恶意脚本，做出窃取用户数据，注入广告或跳转等操作。

## 学习资料
[MDN - eval](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval)

[why-is-using-the-javascript-eval-function-a-bad-idea](https://stackoverflow.com/questions/86513/why-is-using-the-javascript-eval-function-a-bad-idea)