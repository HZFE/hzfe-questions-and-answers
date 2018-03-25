```bash
# 此页面贡献者：SSN、铲屎苗
```

# WHAT - Method Definitions

## 安全和幂等的方法

### 安全方法

GET HEAD 方法不应该具有除了检索之外的操作。这些方法应该被认为是**安全的**。而 POST PUT DELETE 则被视为可能存在**不安全**的请求操作。（当然，这也不能担保服务器并没有因为执行 GET 请求而产生副作用）

### 幂等方法

方法也可以具有**幂等性**的性质：（除了错误或过期等问题外）N > 0 个相同请求的副作用与单个请求相同。GET，HEAD，PUT 和 DELETE 都具有幂等性。另外，OPTIONS 和 TRACE 不应该有副作用，所以本质上也是幂等的。

## GET

GET 方法是指获取任何由 Request-URI 标识的信息（实体）。

如果请求头中包含 If-Modified-Since | If-Unmodified-Since | If-Match | If-None-Match | If-Range 等字段，则 GET 的语义变为“ 条件 GET ”。 条件 GET 方法的请求，仅在请求头中描述的条件成立的情况下，才传送实体。条件 GET 方法通过允许缓存实体，来减少不必要的网络请求。

如果请求头包含 Range 字段，则 GET 的语义变为“ 部分 GET ”。 部分 GET 请求只传输实体的一部分。部分 GET 方法通过允许继续获取已被部分检索的实体，而不传输已经由客户端持有的数据，来减少不必要的网络请求。

对 GET 请求的响应是可以被缓存的（当它符合 HTTP 缓存要求时）

## POST

POST 请求时，源服务器接受请求中包含的实体，并作为请求URI标识资源的新从属数据。POST 方法执行的实际功能由服务器决定，通常取决于请求URI。发布的实体从属于该URI（就像文件从属于包含它的目录，新闻文章从属于发布的新闻组，或者记录条目从属于数据库。）

对 POST 方法的响应不可缓存，除非响应头中包含适当的 Cache-Control 或 Expires 字段。

# GET POST 区别

对比 | GET | POST |
------ |-----|-----|
请求是否有主体 | 否 | 是
安全性 | 是 | 否
幂等性 | 是 | 否
可缓存 | 是 | 仅在包含相关缓存字段情况下可缓存

# 学习资料

[rfc2616 - Method Definitions](https://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html#sec9)
