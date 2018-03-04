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

`CORS`: Cross-Origin Resource Sharing。跨源资源共享（CORS）是一种机制，它通过使用额外的 HTTP Header 来让浏览器获得访问来自不同来源（域）服务器上的选定资源的权限。需要用到 `CORS` 的比如有：

1. 跨域使用 XMLHttpRequest / Fetch APIs
2. Web 字体（CSS @font-face中的跨域字体）
3. 使用 drawImage 绘制到 canvas 的images / video frames
4. WebGL textures ...

# 学习资料
[MDN - Same-origin policy](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy)
[wiki - jsonp](https://en.wikipedia.org/wiki/JSONP)
[stackoverflow - what is jsonp](https://stackoverflow.com/questions/3839966/can-anyone-explain-what-jsonp-is-in-layman-terms)
[MDN - CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)

[同源策略和跨域请求研究](http://yincheng.site/cross-domain)
[我知道的跨域与安全](https://juejin.im/post/5a6320d56fb9a01cb64ee191)
