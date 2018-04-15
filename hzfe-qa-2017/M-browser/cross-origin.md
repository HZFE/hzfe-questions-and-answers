# 面试题
1. 为什么存在跨域这个问题？

    因为**浏览器**中存在**同源策略**

3. 同源策略是什么？为什么要有同源策略？

    如果两个页面的**协议**，**端口**（如果有指定）和**域名**都相同，则两个页面具有相同的源。浏览器对 JavaScript 实施的安全限制，限制了不同源之间的交互，叫同源策略。这是为了预防某些恶意行为。

4. 跨域有哪些常用方法？

    - jsonp 跨域
    - CORS

# jsonp

`JSONP`: JSON with Padding or JSON-P[1]。他允许绕过同源策略共享数据。但由于固有的不安全性，`JSONP` 正在被 `CORS` 所取代。

### how

**如何绕过同源策略？**

对于每个新的 `JSONP` 请求，浏览器都必须添加一个新的 `<script>` 元素，或复用现有的。对于**添加一个新的 `<script>` 元素**，是通过动态 `DOM` 操作完成的。将 `<script>` 元素注入到 HTML DOM 中，并将所需要请求的 URL 赋值给 `src` 属性。这个 URL 需要携带一个 `callback` 参数，因此服务器能知道用于包装响应的回调函数名称(JSON 响应和 JSONP 响应的区别就在于， JSONP 响应对象需要作为参数传递给回调函数)。

0. 创建 script 标签，指定 src 属性值，并将该 script 标签嵌入 DOM 中；
1. 浏览器立即获取该 script 资源，立即执行资源中代码；
2. 执行结果（响应对象）作为参数传递给回调函数（i.e. 资源请求完成时，该回调函数必须已存在于全局作用域中）；

### why

**存在安全隐患，建议使用 `CORS` 替代。**

- 不可信的第三方代码

    使用远程网站的 script 标签会让远程网站得以注入**任何**的内容至网站里。如果远程的网站有 JavaScript 注入漏洞，原来的网站也会受到影响。

- 回调名称操作和反射文件下载攻击

    未经把控的回调名称可以被用来传递恶意数据给客户端，绕过 application/json 类型相关的限制，比如2014年反射文件下载（RFD）攻击所示。

- 跨网站请求伪造 CSRF

    由于HTML `<script>` 标签在网络浏览器实现中不遵守同源策略，因此恶意页面可以请求并获取属于其他站点的 JSON 数据。这将允许在恶意页面的上下文中处理这些数据，如果用户当前登录到其他站点，则可能泄漏了密码或其他敏感数据。

# CORS

出于安全原因，浏览器限制了从 script 中发起的 cross-origin HTTP 请求。例如 XMLHttpRequest 和 Fetch 等 APIs 遵循同源策略。因此，除非使用 CORS ，否则使用这些 APIs 的应用只能从加载该应用的相同域中，请求 HTTP 资源。

`CORS` [Cross-Origin Resource Sharing 跨源资源共享]是一种机制，它的工作原理是，添加额外的 HTTP Headers 来让服务器描述允许使用浏览器读取某一资源的一组 origin 。该机制要求浏览器对可能给服务器数据造成 side-effects 的 HTTP request 进行预检 (preflight) ：使用 HTTP OPTIONS 请求方法从服务器请求回 supported methods 后，在服务器 "approval" 的前提下，使用实际的 HTTP method 来发送 request。

需要用到 `CORS` 的比如有：

1. 跨域使用 XMLHttpRequest / Fetch APIs
2. Web 字体（CSS @font-face中的跨域字体）
3. 使用 drawImage 绘制到 canvas 的images / video frames
4. WebGL textures ...

## CORS 例子1: 简单请求

不会触发 `CORS preflight` 的被称为 simple requests，simple request 满足以下特点：
- GET | HEAD | POST
- 除浏览器自动设置的 Headers ，可以设置以下 Headers（CORS 安全首部字段集合）
    - Accept
    - Accept-Language
    - Content-Language
    - Last-Event-ID
    - DPR
    - Save-Data
    - Viewport-Width
    - Width
    - Content-Type
        - application/x-www-form-urlencoded
        - multipart/form-data
        - text/plain

假设我们有一个跨域 GET 请求：

```bash
# request headers
GET /resources/public-data/ HTTP/1.1
# ......
Origin: http://foo.example

# response headers
HTTP/1.1 200 OK
# ......
Access-Control-Allow-Origin: *
```

## CORS 例子2: 预检请求

因为非简单请求可能会影响用户数据，所以他会经过一层 preflight：先通过 OPTIONS method 向另一个域上的资源发送 HTTP request 以确定是否可以安全发送 actual request 。

满足以下任何一种情况，则需要 preflight：
- PUT | DELETE | CONNECT | OPTIONS | TRACE | PATCH
- 前面 simple request 的 headers 列表中没有提到的

假设我们有一个跨域 POST 请求，带有复杂请求头：

```js
'X-PINGOTHER': 'pingpong'
'Content-Type': 'application/xml'
```

```bash
# preflight request headers
OPTIONS /resources/post-here/ HTTP/1.1
# ......
Origin: http://foo.example
Access-Control-Request-Method: POST
Access-Control-Request-Headers: X-PINGOTHER, Content-Type

# preflight response headers
HTTP/1.1 200 OK
# ......
Access-Control-Allow-Origin: http://foo.example
Access-Control-Allow-Methods: POST, GET
Access-Control-Allow-Headers: X-PINGOTHER, Content-Type
Access-Control-Max-Age: 86400

# actual request header
POST /resources/post-here/ HTTP/1.1
# ......
X-PINGOTHER: pingpong
Content-Type: text/xml; charset=UTF-8
Origin: http://foo.example

# actual response header
HTTP/1.1 200 OK
# ......
Access-Control-Allow-Origin: http://foo.example
```

# 学习资料
[stackoverflow - what is jsonp](https://stackoverflow.com/questions/3839966/can-anyone-explain-what-jsonp-is-in-layman-terms)
[MDN - CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)

[同源策略和跨域请求研究](http://yincheng.site/cross-domain)
[我知道的跨域与安全](https://juejin.im/post/5a6320d56fb9a01cb64ee191)
