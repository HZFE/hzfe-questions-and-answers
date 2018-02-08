# 常见 HTTP 状态码


## Status Code Definitions

https://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html

## 1XX 毫无存在感

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
206 | No Content | 表示服务器完成了请求返回了部分内容以及内容的区间（Range 头）

## 3XX 各种重定向

3 开头的 HTTP 状态码一般表示需要客户端进行进一步的操作。后续请求地址在 Location 头中指定。

Code | 消息短语 | 描述
---- | ---  | ----  
