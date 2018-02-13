# 用户从输入url到最终页面展示，这个过程中发生了什么

## DNS 查询

首先进行的是 DNS 查询，DNS 是应用层协议，DNS 所做的工作是通过域名查询对应的 IP 地址，DNS 查询大体分为以下几个步骤：

1. 检查浏览器的 DNS 缓存，如果有那就直接用。
2. 如果没有浏览器缓存，那么查询本地的 `hosts` 文件中的映射关系（Windows 一般在 `c:\windows\system32\drivers\etc\hosts`, Linux/MacOS 一般在 `/etc/hosts`）。
3. 查找本地 DNS 解析器缓存。
4. 发起 DNS 查询，返回 IP 地址。

关于第四点，我们可以通过一个完整的 `dig +trace` 来说明（先忽略权威/递归服务器的概念）。

```
> dig +trace www.hzfe.org

; <<>> DiG 9.9.7-P3 <<>> +trace www.hzfe.org
;; global options: +cmd
.			160794	IN	NS	c.root-servers.net.
...
.			160794	IN	NS	h.root-servers.net.
;; Received 239 bytes from 114.114.114.114#53(114.114.114.114) in 13 ms

org.			172800	IN	NS	a2.org.afilias-nst.info.
...
org.			172800	IN	NS	a0.org.afilias-nst.info.
org.			86400	IN	DS	9795 7 1 364DFAB3DAF254CAB477B5675B10766DDAA24982
org.			86400	IN	DS	9795 7 2 3922B31B6F3A4EA92B19EB7B52120F031FD8E05FF0B03BAFCF9F891B FE7FF8E5
org.			86400	IN	RRSIG	DS 8 1 86400 20180225050000 20180212040000 41824 . T/zwZWNHYMeKFbI5VPOfd2Io2m74Tcq8c9WOQVMxGO5sMogDGVfSx9tF nMa6QFwPt+eppTmKM61hlfVEDcMtq42KPJ4F3t4CjGocQDGc6ZnaGBOT 5zTTnd7TeCd3yUbdC/a9wCqSuNPZO597KzBZcM4y0opow+XySDVjpscY HfVwzXRPiSPNPQKEmcKYsnA+RDL1oIkvLiefVRxPFM40QEgsuxdOg2ZE L7JTFKKTvXL2sJL07wzqZq/MtT5GbIThIYS6Qp2zLNbRVa71isVCBcCg m7Vsz0W1Jc+xe4aKr9EN71epR2H2UY+AiE8EY30IQntrV6Q1Yx58G1q0 XxURHQ==
;; Received 814 bytes from 199.7.91.13#53(d.root-servers.net) in 490 ms

hzfe.org.		86400	IN	NS	vick.ns.cloudflare.com.
hzfe.org.		86400	IN	NS	val.ns.cloudflare.com.
h9p7u7tr2u91d0v0ljs9l1gidnp90u3h.org. 86400 IN NSEC3 1 1 1 D399EAAB H9PARR669T6U8O1GSG9E1LMITK4DEM0T NS SOA RRSIG DNSKEY NSEC3PARAM
h9p7u7tr2u91d0v0ljs9l1gidnp90u3h.org. 86400 IN RRSIG NSEC3 7 2 86400 20180305082812 20180212072812 1862 org. K7gSni6BLzPhdcHbBA6mntvv4gn68py6SSY3VoHuEBHpU+cozzFDVGzO gFEqiIWoI8h/xpRYQhnNbrY3y91aAawXRG4E0n1TYy3HAZsm6eAHq7s+ U6chnIk8g97mckA+BPxAEijMyzlEoAYpQVGiUfgUL/2xnzxaPebrH/BJ +Os=
ev4lmbjm3nk8rg2kj08ep8h457jlv7am.org. 86400 IN NSEC3 1 1 1 D399EAAB EV4TSG4FM887QH4FB2IPOKGUN1QJAB9L NS DS RRSIG
ev4lmbjm3nk8rg2kj08ep8h457jlv7am.org. 86400 IN RRSIG NSEC3 7 2 86400 20180302153210 20180209143210 1862 org. KlYKespDQSv8rv4ae7omZ2vKg+SrbDoookf4QvjEWzaP+iDvTQDNvZhG lFad1dKOfRreX0PEoE0PYkJyMl8AL23d5+P2vsbY6SHIChbLHoL/jOEt r2lNKeFLqRpgdmr/nCJ4B0dtvtkWJ7CFe5A4mwWIqB54qHu2fMqIWY7i dlU=
;; Received 588 bytes from 199.19.57.1#53(d0.org.afilias-nst.org) in 146 ms

www.hzfe.org.		300	IN	A	45.32.248.193
;; Received 57 bytes from 173.245.58.234#53(val.ns.cloudflare.com) in 197 ms
```

接下来我们一段段来解释。

```
; <<>> DiG 9.9.7-P3 <<>> +trace www.hzfe.org
;; global options: +cmd
.			160794	IN	NS	c.root-servers.net.
...
.			160794	IN	NS	h.root-servers.net.
;; Received 239 bytes from 114.114.114.114#53(114.114.114.114) in 13 ms
```

最前面的 `[c-h].root-servers.net.` 表示的是根域名(.)的 NS（所有的域名的根都是一个点 `.`，平时使用中都忽略了）。从这一组服务器中挑出一个查找 `org.` 的记录。

```
org.			172800	IN	NS	a2.org.afilias-nst.info.
...
org.			172800	IN	NS	a0.org.afilias-nst.info.
org.			86400	IN	DS	9795 7 1 364DF...
org.			86400	IN	DS	9795 7 2 3922B31B...
org.			86400	IN	RRSIG	DS 8 1 86400 2018022...
;; Received 814 bytes from 199.7.91.13#53(d.root-servers.net) in 490 ms
```

我们通过 `d.root-servers.net` 找到了 `org.` 的一组 NS。后面的 `DS` 和 `RRSIG` 属于 `DNSSEC` 相关内容，主要作用是解决 DNS 的欺骗和缓存污染，暂且不提。
继续选出一台服务器来查找 `hzfe.org.` 的 NS 记录。

```
hzfe.org.		86400	IN	NS	vick.ns.cloudflare.com.
hzfe.org.		86400	IN	NS	val.ns.cloudflare.com.
h9p7u7tr2u91d0v0ljs9l1gidnp90u3h.org. 86400 IN NSEC3 1 1 1 D39...
;; Received 588 bytes from 199.19.57.1#53(d0.org.afilias-nst.org) in 146 ms
```

这样我们就查找到了 `hzfe.org` 的 NS 记录，接着选择其中一台服务器就可以查找到 `www.hzfe.org` 的 A 记录了。

```
www.hzfe.org.		300	IN	A	45.32.248.193
;; Received 57 bytes from 173.245.58.234#53(val.ns.cloudflare.com) in 197 ms
```

最终我们就得到了 `www.hzfe.org` 的 A 记录 `45.32.248.193`，以上就是一次完整的 DNS 解析过程，但是实际情况是，在以上服务器之间还存在着递归服务器，递归服务器的作用是缓存解析结果。

```
> nslookup www.hzfe.org
Server:		114.114.114.114
Address:	114.114.114.114#53

Non-authoritative answer:
Name:	www.hzfe.org
Address: 45.32.248.193
```

上面提示的 `Non-authoritative answer` 就表示这条记录是由递归服务器返回的内容。


### DNS 报文格式

DNS 同时占用 TCP 和 UDP 的 53 端口，请求和响应报文都是相同的格式：

```
+--+--+--+--+--+--+--+
|      Header        |
+--+--+--+--+--+--+--+
|      Question      |
+--+--+--+--+--+--+--+
|      Answer        |
+--+--+--+--+--+--+--+
|      Authority     |
+--+--+--+--+--+--+--+
|      Additional    |
+--+--+--+--+--+--+--+
```

```
  Header format

    0  1  2  3  4  5  6  7  0  1  2  3  4  5  6  7
  +--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
  |                      ID                       | 
  +--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
  |QR|  opcode   |AA|TC|RD|RA|   Z    |   RCODE   |
  +--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
  |                    QDCOUNT                    |
  +--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
  |                    ANCOUNT                    |
  +--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
  |                    NSCOUNT                    |
  +--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
  |                    ARCOUNT                    |
  +--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
```

- ID: 标识 DNS 会话
- FLAGS
    - QR: 0 查询报文，1 响应报文
    - opcode: 0 标准查询，1 反向查询，2 服务器状态查询，3/15 保留
    - AA 权威应答标志，1 权威，0 非权威
    - TC: 表示报文太长被截断
    - RD: 递归期望
    - RA: 是否可以递归
    - Z: 保留字段
    - RCODE: 响应码
        - 0 No Error 无错误
        - 1 Format Error 格式错误
        - 2 Server Failure 服务器错误
        - 3 Name Error Name 错误
        - 4 Not Implemented 未实现
        - 5 Refused 拒绝
        - 6 YX 不该存在的 Name
        - 7 YX RR Set 不该存在的资源记录
        - 8 NX RR Set 应该存在却不存在的资源记录
        - 9 Not Auth 未认证
        - 10 Not Zone Name 不存在于 Zone 之中
- QDCOUNT: Question 段中的问题记录数
- ANCOUNT: Answer 段中的资源记录数
- NSCOUNT: 报文授权段中的授权记录数
- ARCOUNT: 报文附加段中的附加记录数



```
  Question format

    0  1  2  3  4  5  6  7  0  1  2  3  4  5  6  7
  +--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
  |                     ...                       |
  |                    QNAME                      |
  |                     ...                       |
  +--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
  |                    QTYPE                      |
  +--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
  |                    QCLASS                     |
  +--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
```

- QNAME: 查询域名，[编码方式](http://www.tcpipguide.com/free/t_DNSNameNotationandMessageCompressionTechnique.htm)，例如 `3` `w` `w` `w` `4` `h` `z` `f` `e` `3` `o` `r` `g` `0`
- QTYPE: 协议类型
    - 251 IXFR 
    - 252 AXFR
    - 253 MAILB
    - 254 MAILA
    - 255 * 
- QClass: 查询类，一般都是 IN (Internet).


```
  Answer/Authority/Additional format

    0  1  2  3  4  5  6  7  0  1  2  3  4  5  6  7
  +--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
  |                    NAME                       |
  +--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
  |                    TYPE                       |
  +--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
  |                    CLASS                      |
  +--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
  |                    TTL                        |
  +--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
  |                    RDLENGTH                   |
  +--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
  |                    RDATA                      |
  +--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
```

- NAME: 域名
- TYPE: 记录类型
    - 1 A IP 地址
    - 2 NS Name server
    - 5 CNAME 别名
    - 6 SOA 
    - 12 PTR
    - 15 MX Email
    - 16 TXT 文本
- CLASS: 查询类，一般都是 IN (Internet).
- TTL: Time To Live 表示缓存时间
- RDLENGTH: RDATA 的长度
- RDATA: 记录内容

### 参考

- [DNS Message Header and Question Section Format](http://www.tcpipguide.com/free/t_DNSMessageHeaderandQuestionSectionFormat.htm)
- [DNS 请求报文详解](https://yi-love.github.io/blog/node.js/javascript/dns/2016/11/11/dns-request.html)
- [DNS 查询全解](https://www.90.cx/dns-query-1/)

## TCP

## HTTP/HTTPS

## 渲染