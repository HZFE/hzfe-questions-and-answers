## Ajax
（异步JavaScript和XML）Asynchronous JavaScript + XML, 其本身不是一种新技术，而是一个在 2005年被Jesse James Garrett提出的新术语，用来描述一种使用现有技术集合的‘新’方法, 包括: HTML or XHTML, Cascading Style Sheets, JavaScript, The Document Object Model, XML, XSLT, 以及最重要的 XMLHttpRequest object.当使用结合了这些技术的AJAX模型以后， 网页程序能够逐步快速地将更新呈现在用户界面上，不需要重载（刷新）整个页面。这使得程序能够更快地回应用户的操作。

## XMLHttpRequest
Ajax 技术的核心是 XMLHttpRequest 对象(简称 XHR)
```javascript
// IE7以上版本支持原生XHR对象
var xhr = new XMLHttpRequest()
// 在使用 XHR 对象时，要调用的第一个方法是 open()
// 参数: 请求类型、请求URL、是否异步发送请求
xhr.open("get", "example.php", false)
// send()方法接收一个参数，即要作为请求主体发送的数据。不需要发送数据时必须传入null，因为这个参数对有些浏览器来说是必需的。
xhr.send(null)
// 由于这次请求是同步的，JavaScript代码会等到服务器响应之后再继续执行。在收到响应后，响应的数据会自动填充XHR对象的属性，相关的属性简介如下。
// 1. responseText: 作为响应主体被返回的文本。
// 2. responseXML: 如果响应的内容类型是"text/xml"或"application/xml"，这个属性中将保存包含着响应数据的 XML DOM 文档。 
// 3. status: 响应的 HTTP 状态。
// 4. statusText: HTTP 状态的说明。
if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304){
  console.log(xhr.responseText)
} else {
  console.log("Request was unsuccessful: " + xhr.status)
}
```

```javascript
var xhr = new XMLHttpRequest()
// 像前面这样发送同步请求当然没有问题，但多数情况下，我们还是要发送异步请求，才能让 JavaScript 继续执行而不必等待响应。
// 此时，可以检测 XHR 对象的readyState属性，该属性表示请求/响应过程的当前活动阶段。这个属性可取的值如下。
// 0: 未初始化。尚未调用 open()方法。
// 1: 启动。   已经调用 open()方法，但尚未调用 send()方法。
// 2: 发送。   已经调用 send()方法，但尚未接收到响应。
// 3: 接收。   已经接收到部分响应数据。
// 4: 完成。   已经接收到全部响应数据，而且已经可以在客户端使用了。
// 只要readyState属性的值由一个值变成另一个值，都会触发一次readystatechange事件。通常，我们只对readyState值为4的阶段感兴趣，因为这时所有数据都已经就绪。
// 不过，必须在调用 open()之前指定 onreadystatechange 事件处理程序才能确保跨浏览器兼容性。
xhr.onreadystatechange = function () {
  if (xhr.readyState == 4) {
    if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
      console.log(xhr.responseText)
    } else {
      console.log("Request was unsuccessful: " + xhr.status)
    }
  }
};
xhr.open("get", "example.txt", true)
xhr.send(null)
```

```javascript
var xhr = new XMLHttpRequest()
xhr.onreadystatechange = function () {
  if (xhr.readyState == 4) {
    if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
      console.log(xhr.responseText)
    } else {
      console.log("Request was unsuccessful: " + xhr.status)
    }
  }
}
xhr.open("get", "example.php", true)
// 默认情况下，在发送 XHR 请求的同时，还会发送下列头部信息。
// Accept:          浏览器能够处理的内容类型。
// Accept-Charset:  浏览器能够显示的字符集。
// Accept-Encoding: 浏览器能够处理的压缩编码。
// Accept-Language: 浏览器当前设置的语言。
// Connection:      浏览器与服务器之间连接的类型。
// Cookie:          当前页面设置的任何 Cookie。
// Host:            发出请求的页面所在的域 。
// Referer:         发出请求的页面的 URI。
// User-Agent:      浏览器的用户代理字符串。
// 使用setRequestHeader()方法可以设置自定义的请求头部信息。接受参数:头部字段的名称&头部字段的值。
// 要成功发送请求头部信息，必须在调用open()方法之后且调用send()方法之前调用setRequestHeader()
xhr.setRequestHeader("MyHeader", "MyValue")
xhr.send(null)
```

```javascript
var xhr = new XMLHttpRequest()
xhr.open("post", "example.php", true)
// 默认情况下，服务器对POST请求和提交Web表单的请求并不会一视同仁。因此，服务器端必须有程序来读取发送过来的原始数据，并从中解析出有用的部分。
// 不过，我们可以使用 XHR 来模仿表单提交:
// 首先将 Content-Type 头部信息设置为application/x-www-form-urlencoded，也就是表单提交时的内容类型，
// 其次是以适当的格式创建一个字符串。将表单的数据进行序列化，然后再通过XHR发送到服务器（以下假设我们有个serialize函数）
xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
var form = document.getElementById("user-info")
xhr.send(serialize(form))
```