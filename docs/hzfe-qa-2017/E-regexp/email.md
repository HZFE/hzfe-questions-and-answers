```bash
# 此页面贡献者：树
```
# email的正则正则正则

## 规范

传送门：https://tools.ietf.org/html/rfc5322#section-3.4.1

> 3.4.1.  Addr-Spec Specification
> 
>   An addr-spec is a specific Internet identifier that contains a
   locally interpreted string followed by the at-sign character ("@",
   ASCII value 64) followed by an Internet domain.  The locally
   interpreted string is either a quoted-string or a dot-atom.  If the
   string can be represented as a dot-atom (that is, it contains no
   characters other than atext characters or "." surrounded by atext
   characters), then the dot-atom form SHOULD be used and the quoted-
   string form SHOULD NOT be used.  Comments and folding white space
   SHOULD NOT be used around the "@" in the addr-spec.
>   
>      Note: A liberal syntax for the domain portion of addr-spec is
>      given here.  However, the domain portion contains addressing
>      information specified by and used in other protocols (e.g.,
>      [RFC1034], [RFC1035], [RFC1123], [RFC5321]).  It is therefore
>      incumbent upon implementations to conform to the syntax of
>      addresses for the context in which they are used.
>       
>   addr-spec       =   local-part "@" domain
>
>   local-part      =   dot-atom / quoted-string / obs-local-part
>
>   domain          =   dot-atom / domain-literal / obs-domain
>
>   domain-literal  =   [CFWS] "[" *([FWS] dtext) [FWS] "]" [CFWS]
>
>   dtext           =   %d33-90 /          ; Printable US-ASCII
>                       %d94-126 /         ;  characters not including
>                       obs-dtext          ;  "[", "]", or "\"
>
>   The domain portion identifies the point to which the mail is
   delivered.  In the dot-atom form, this is interpreted as an Internet
   domain name (either a host name or a mail exchanger name) as
   described in [RFC1034], [RFC1035], and [RFC1123].  In the domain-
   literal form, the domain is interpreted as the literal Internet
   address of the particular host.  In both cases, how addressing is
   used and how messages are transported to a particular host is covered
   in separate documents, such as [RFC5321].  These mechanisms are
   outside of the scope of this document.
>
>   The local-part portion is a domain-dependent string.  In addresses,
   it is simply interpreted on the particular host as a name of a
   particular mailbox.

大致翻译过来呢就是，邮箱地址分为三个部分，`local-part`、 `@` 以及 `domain`。下面是 `local-part` 以及 `domain` 的详细规范：

### local-part

可以使用所有的 ASCII 字符，包括：

- 大小写字母
- 数字
- 特殊符号 !#$%&'*+-/=?^_`{|}~
- `.` 不可以放在开头或结尾或连续使用，除非用引号包括起来
- `+` 加号一般会被忽略 
- 空格以及 "(),:;<>@[\\] 只能包含在引号之内
- 注释可以包含在括号之内，例如 `admin(el psy congroo)@geeku.net` 等于 `admin@geeku.net` 

除了上述的 ASCII 字符之外，U+007F 以上的 UTF-8 编码的字符按规范也可以使用，但可能会受到邮件系统的限制。

其他更为细节的规范可以参考维基百科中的介绍：[维基百科:Email_address](https://en.wikipedia.org/wiki/Email_address)

### domain

domain 的命名规范很简单，即它得是个 **hostname**。domain 就是由一系列由点分隔的标签组成的。标签的命名规范如下：

- 大小写字母
- 数字，顶级域名不能是纯数字
- 连字符 `-`，连字符不可在开头或结尾

以上的规则被称为 LDH 规则 (letters, digits, hyphen)。

除了以上规则之外，domain 还可以是以 [] 包裹的 IP 地址。以括号包含的注释同样可以出现在 domain 中。

## 无脑版

```javascript
const emailReg = /\w+@\w+\.\w+/;
```

## 优化(?)版

```javascript
const emailReg = /[a-zA-Z0-9!#$%&'*+-/=?^_`{|}~]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-]{2}/;
```

## HTML5 之撒手不管版

```html
<input type="email" />
```

## 谷歌搜到版

```javascript
const emailReg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
```

## 参考

[维基百科:Email_address](https://en.wikipedia.org/wiki/Email_address)