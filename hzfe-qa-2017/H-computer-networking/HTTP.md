```bash
# 此页面贡献者：年轻的小铲
```
## HTTP
超文本传输协议 ( `HTTP` ) 被设计于上20世纪90年代初期，是一种具有可扩展性的 `应用层协议`，它是为 `Web` 浏览器和 `Web` 服务器之间的通信而设计的(当然也可以用作其他目的)，用于传输超媒体文档(例如 `HTML` )。一般通过 `TCP` 或 `TLS` 加密的 `TCP` 连接来发送，但理论上也可以使用任何其他可靠的传输协议。

`HTTP` 遵循经典的客户端 - 服务器模型，客户端和服务端通过交换各自的消息来进行交互。客户端打开一个连接( `connection` )，发出消息(请求 `requests` )，然后等待，直到收到服务端的消息(回应 `responses` )。

也就是说， `request` 通过一个实体被发出，实体也就是用户代理 (`user-agent`：可以是代表用户行为的任何工具，比如抓取网页来填充和维护搜索引擎索引的机器人)。大多数情况下，这个 `user-agent` 是指 Web 浏览器。每一个发送到服务器的 `request` ，都会被服务器处理并返回一个 `response` 。在这个 `request` 和 `response` 之间有许多实体，总称为代理(以下称 `proxy` )，他们的作用与表现各不相同，比如有些是网关，还有些是缓存等。请看以下流程图(实际上，在 `Client` 和 `Server` 之间，还有路由器，调制解调器等等。由于 Web 的层次设计，这些在网络层和传输层的内容不在此展开)：

```
----------         ---------         ---------         ----------
|        |  ---->  |       |  ---->  |       |  ---->  |        |
| Client |         | Proxy |         | Proxy |         | Server |
|        |  <----  |       |  <----  |       |  <----  |        |
----------         ---------         ---------         ----------
```

当 `Client` 想要与 `Server` 通信时，无论是最终服务器还是中间代理，它都会执行以下步骤：
1. **打开一个 `TCP` 连接**

    `TCP` 连接用来发送一条或多条 `request` 和获取 `response`。 `Client` 可能会打开一个新连接，或重用现有连接，或打开多个到 `Server` 的 `TCP` 连接。
2. **发送一个 `HTTP` 报文 （HTTP报文的类型：请求）**

    `HTTP` 报文（在 `HTTP/2` 之前）语义是可读的。在 `HTTP/2` 中，这些消息被嵌入到了一个新的二进制结构，帧。帧能实现一些优化，比如报文头部的压缩和复用（这使得报文不能被直接读取）。即使只有一部分原始 `HTTP` 报文以 `HTTP/2` 发送出来，每条报文的语义依旧不变，客户端会重组原始 `HTTP/1.1` 请求。所以两者的原理还是保持不变的。
    ```javascript
    /**
     * {Method} / {Version of protocol}
     * {Method}: GET POST PUT DELETE OPTIONS ....
     * {Version of protocol}: HTTP/1.1
     *
     * Headers: Host Accept-Language ....
     */
    GET / HTTP/1.1
    Host: developer.mozilla.org
    Accept-Language: fr
    ```
3. **读取服务端返回的报文信息 （HTTP报文的类型：回应）**
    ```JavaScript
    /**
     * {Version of protocol} {Status code} {Status message}
     * {Version of protocol}: HTTP/1.1
     * {Status code}: 200 304 400 403 404 406 500 ....
     *
     * Headers: Date Server Last-Modified ETag Accept-Ranges Content-Length Content-Type ....
     */
    HTTP/1.1 200 OK
    Date: Sat, 09 Oct 2010 14:28:02 GMT
    Server: Apache
    Last-Modified: Tue, 01 Dec 2009 20:18:22 GMT
    ETag: "51142bc1-7449-479b075b2891b"
    Accept-Ranges: bytes
    Content-Length: 29769
    Content-Type: text/html

    <!DOCTYPE html... (here comes the 29769 bytes of the requested web page)
    ```
4. **关闭连接或者为后续 `request` 重用连接**

### Stateless
`HTTP` 是一种 `无状态协议` ，在同一个连接中，两个执行成功的请求之间是没有联系的。也就是说，服务器不会在两个请求之间保留任何数据(状态)。比如在一个电商网站里，用户把某个商品加入到购物车，切换一个页面后再次添加了商品，这两次添加商品的请求之间没有关联，浏览器无法知道用户最终选择了哪些商品。`HTTP` 本质是无状态的，但是 `HTTP Cookies` 可以创建有状态的会话。使用 `HTTP` 的头部扩展，令 `HTTP Cookies` 被添加到工作流中，就会允许在每个HTTP请求上创建会话以共享相同的上下文或相同的状态。

### Extensible
`HTTP` 的可扩展性体现在 `HTTP/1.0` 中提出的 `HTTP headers` 中。 它让协议扩展变得非常容易。只要服务端和客户端就新 headers 达成语义一致，新功能就可以被轻松加入进来。可以用HTTP控制的常用功能有：
- **缓存**
  - 如何缓存文档，能通过HTTP来控制。`Server` 可以指示 `proxies` 和 `Client` 缓存什么内容，缓存多久。而客户端也能够命令中间的缓存代理来忽略存储的文档。
- **开放同源限制**
  - 为防止网络窥探和其他隐私入侵，Web 浏览器强制严格分离网站。只有来自同一来源的页面才能访问网页的所有信息。虽然这样的约束对服务器来说是一种负担，但 `HTTP headers` 可以放宽服务器端的严格分离，从而使文档成为来自不同域的信息的拼凑体（这样做可能有安全相关的原因）。
- **认证**
  - 某些页面可能受到保护，因此只有特定的用户才能访问它。基本认证可以由 `HTTP` 提供，或者使用 `WWW-Authenticate` 和类似的 `Headers` ，或者通过使用 `HTTP cookie` 设置特定的会话。
- **代理和隧道**
  - 服务器或客户端通常位于内联网上，并向其他人隐藏其真实IP地址。`HTTP request` 通过 `proxies` 来跨越这个网络障碍。并非所有的 `proxies` 都是 `HTTP proxies` 。比如 SOCKS 协议，运作在更底层。像 FTP 这样的协议，能够被这些 `proxies` 处理。
- **会话**
  - 使用 `HTTP Cookies` 可以将请求与服务器的状态关联起来。尽管基本的 `HTTP` 是一种无状态协议，但这会创建会话。这不仅适用于购物车这种的电商需求，也适用于任何网站上的用户定制展示内容的需求。

## Client: user-agent
为了呈现网页，浏览器首先发送一个 `request` 来获取页面的 `HTML` 文档。然后解析该文件，获取与执行脚本、CSS样式表相对应的其他请求，以及页面中包含的子资源(通常为图像和视频)。然后，浏览器将这些资源整合到一起，展现出一个完整的文档，也就是网页。浏览器执行的脚本可以在之后的阶段获取更多资源，并相应地更新网页。

网页是超文本文件。这意味着某些是链接的显示文本，可以(一般通过鼠标点击)被激活来获取新的网页，由此，用户可以指挥和利用他们的 `user-agent` 来进行网页浏览。`user-agent` 来负责发送这些 `HTTP request` ，并进一步解释 `HTTP response` 以向用户提供明确的响应。

## Server
在上述通信过程的另一端，是 `Web Server` ，提供 `Client` 所请求的文档。 `Server` 仅在虚拟意义上代表一台服务器，实际上，他可能是共享负载(负载均衡)的一组服务器组成的计算机集群，也可能是一种复杂的软件，通过向其他计算机(如缓存，数据库服务器，电子商务服务器 ，...)发起请求来获取部分或全部资源。

`Server` 不一定是一台机器，但一台机器上，可以托管多个 `Server` 。通过 `HTTP/1.1` 和 `Host header` ，他们甚至可以共享相同的 `IP` 地址。

## Proxy
在 `client` 和 `Server` 之间，有许多计算机和其他设备转发了 `HTTP` 消息。由于 Web 栈层次结构设计的原因，它们大多都出现在传输层、网络层和物理层上，对于 `HTTP` 应用层而言就是透明的(虽然它们可能会对应用层性能有重要影响)。还有一部分表现在应用层上，被称为 `Proxy` 。 `Proxy` 既可以表现得透明，又可以不透明(改变请求不通过它们)，并且可以执行许多功能：
- 缓存(可以是公开的也可以是私有的，像浏览器的缓存)
- 过滤(像反病毒扫描，家长控制...)
- 负载平衡(允许多个服务器为不同的请求提供服务)
- 认证(对不同资源进行权限管理)
- 日志记录(允许存储历史信息)

## Connection
连接在传输层进行控制，因此基本上不属于 `HTTP` 范畴。 `HTTP` 不要求底层传输协议是 `connection-based` 的；只要求它是可靠的，不丢失消息的(至少会返回错误)。在互联网上最常见的两种传输协议中，`TCP` 是可靠的，而 `UDP` 不是。 因此，`HTTP` 依赖于`connection-based` 的 `TCP` 进行消息传递，虽然并不是总需要 `connection`。

`HTTP/1.0` 为每一个 `request` / `response` 都打开一个 `TCP` 连接，导致了2个缺点：打开一个 `TCP` 连接需要多次往返消息，因此速度慢。但当多个消息周期性发送时，这样就变得更加高效：暖连接比冷连接更高效。

为了减轻这些缺陷，以减少连接开销，`HTTP/1.1` 引入了长连接( `persistent connections` )：底层 `TCP` 连接可以通过 `Connection header` 来实现部分控制。而 `HTTP/2` 则更进一步，通过在单个连接上复用消息的方式，来保持该连接为暖连接，提高效率。

## 学习资料
[MDN - HTTP Overview](https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview)
