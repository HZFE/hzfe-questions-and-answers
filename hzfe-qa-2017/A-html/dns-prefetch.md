# 如何在html中开启/关闭 DNS 预读取

```html
<!--也可服务器发送 X-DNS-Prefetch-Control 头-->
<meta http-equiv="x-dns-prefetch-control" content="on"> 
<!--强制预读取-->
<link rel="dns-prefetch" href="https://hzfe.org/">
```

协议名可省略，`//` 不可省略。