# 常见 HTTP 状态码


## Status Code Definitions

https://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html

## 1XX 没什么存在感

1 开头的 HTTP 状态码一般表示这是一个信息性（informational）的临时响应（provisional response）。

Code | 消息短语 | 描述
---- | ---  | ----  
100 | Continue | 表示服务器接收到了请求头，如果请求没完成就继续发送，如果完成了则忽略
101 | Switching Protocols | 表示切换协议，常用在 WebSocket 协议切换。

## 2XX 成功了成功了

2 开头的 HTTP 状态码一般表示服务器已经正确的接收到了请求。

Code | 消息短语 | 描述
---- | ---  | ----  
200 | OK | 最为常见的状态码，表示请求已成功
203 | Non-Authoritative Information | 表示服务器完成了请求但返回的内容经过了代理服务器的修改
204 | No Content | 表示服务器完成了请求但没有返回内容
206 | Partial Content | 表示服务器完成了请求返回了部分内容以及内容的区间（Range 头）

## 3XX 各种重定向

3 开头的 HTTP 状态码一般表示需要客户端进行进一步的操作。后续请求地址在 Location 头中指定。

Code | 消息短语 | 描述
---- | ---  | ----  
301  | Moved Permanently | 永久重定向，代表请求资源已经永久移动到新位置，一般网站在修改域名之后，对原域名设置 301 以便搜索引擎收录新地址
302  | Found | 临时重定向
303  | See Other | 表示资源存在另一个 URI，应使用 GET 访问
304  | Not Modified | 表示资源未修改，客户端可以使用之前下载的版本，无需重新传输

## 4XX 你出错了

4 开头的 HTTP 状态码一般表示客户端的请求有错误

Code | 消息短语 | 描述
---- | ---  | ----  
400  | Bad Request | 请求有明显错误，服务器无法处理请求
401  | Unauthorized | 表示请求需要用户认证，响应中会携带 `WWW-Authenticate` 头【认证相关：[HTTP基本认证](https://zh.wikipedia.org/wiki/HTTP%E5%9F%BA%E6%9C%AC%E8%AE%A4%E8%AF%81)、[HTTP摘要认证](https://zh.wikipedia.org/wiki/HTTP%E6%91%98%E8%A6%81%E8%AE%A4%E8%AF%81)】
403  | Forbidden | 表示服务器理解请求但是拒绝执行
404  | Not Found | 最常见的 4XX 状态码，表示请求失败，服务器上找不到相关资源

## 5XX 我出错了

5 开头的 HTTP 状态码一般表示服务器出现了错误或是异常

Code | 消息短语 | 描述
---- | ---  | ----  
500  | Internal Server Error | 通用的错误消息，表示服务器出现错误
502  | Bad Gateway | 表示服务器在请求一个上游服务器时出错了
503  | Service Unavailable | 表示服务器正在维护或是过载了，通常是临时性的
504  | Gateway Timeout | 表示服务器在请求一个上游服务器时用时过长