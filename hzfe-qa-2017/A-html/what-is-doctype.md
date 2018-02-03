## what is doctype
我们的html中，一般初始化如以下代码。那`<!DOCTYPE html>`是干嘛的呢？
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document</title>
</head>
<body>
  
</body>
</html>
```
当写 `HTML` 或 `XHTML` 时，添加 `Doctype` 声明非常重要。这样浏览器就能了解预期的文档类型，从而告诉浏览器，要通过哪一种规范解析文档，确保文档在不同的浏览器中以相同的方式被解析。

而由于历史原因，浏览器解析以 `<!DOCTYPE html>` 的Doctype声明开头的 `HTML` 文档时，会表现得更一致。

## 参考资料
[Doctype](https://www.w3.org/QA/Tips/Doctype)

[Recommended list of Doctype declarations](https://www.w3.org/QA/2002/04/valid-dtd-list.html)

[doctype-state](https://www.w3.org/TR/html5/syntax.html#doctype-state)