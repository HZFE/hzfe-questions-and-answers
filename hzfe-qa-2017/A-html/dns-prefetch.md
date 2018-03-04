```bash
# 此页面贡献者：树
```

# 如何在html中开启/关闭 DNS 预读取

由于 DNS 请求的延迟可能较高，所以有时需要浏览器预先读取 DNS 以减小用户点击链接时的延迟。

```html
<!--也可服务器发送 X-DNS-Prefetch-Control 头-->
<meta http-equiv="x-dns-prefetch-control" content="on"> 
<!--强制预读取-->
<link rel="dns-prefetch" href="https://hzfe.org/">
```

协议名可省略，`//` 不可省略。

# 学习资料
[MDN - X-DNS-Prefetch-Control](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-DNS-Prefetch-Control)
