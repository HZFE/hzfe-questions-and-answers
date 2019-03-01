```bash
# 此页面贡献者：铲铲
```

# META

> In the past, meta tags were used by search engines to index web pages based on title, description, and even keywords. In a perfect world, if everyone had used them fairly, it would have served as a boon. However, certain websites started overusing them, cramming popular keywords in the hope of getting better search results. Google, recognizing this, announced in 2009 that they don’t use meta keywords or descriptions in their search algorithms for ranking purposes.

> Even though the description meta tags have no effect on search engine rank, they do appear in search results. This means that a person gets to read your description on a search results page before clicking on your link, showing that meta descriptions should be written for people to read rather than for robots to find. So while a good meta description will not improve your ranking, it will increase click-through rates to your website from search pages.

the meta element is empty, and has no closing tag. The four attributes defined for meta are:

- ```charset``` 定义文档中使用的字符集。
- ```name``` 如果存在，`name` 属性将给出元数据的名称。
- ```http-equiv``` 将指定的值绑定到从服务器请求的文档的 `HTTP header` 上。
- ```content``` 此属性包含 `http-equiv` 或 `name` 属性的值，具体取决于所使用的值。

## charset

```html
<meta charset="utf-8">
```

## http-equiv

https://www.w3.org/TR/html50/document-metadata.html#attr-meta-http-equiv

- content-type
- default-style
- refresh
- content-language(Non-conforming)
- set-cookie(Non-conforming)

**TIPS**： `content-type` 定义文档的MIME类型，后跟其字符编码。 它遵循与HTTP content-type entity-header 字段相同的语法，但由于它位于HTML页面内，因此除 `text/html` 之外的大多数值都是不可能的。 因此，其内容的有效语法是字符串 `text/html` ，后跟一个具有以下语法的字符集：`; charset = IANAcharset` ，其中 `IANAcharset` 是IANA定义的字符集的首选MIME名称。而带有 `charset` 属性的 `<meta>` 元素是 pre-HTML5 `<meta http-equiv="Content-Type" content="text/html; charset=IANAcharset">` 的代名词。‘IANAcharset’ 所代表的值等价于 `charset` 的值。

## name

- application-name
- author
- description
- generator
- keywords
- creator
- googlebot
- publisher
- slurp
- **robots**
- **referrer**
- **viewport**

### referer

> referrer 用来控制附加到文档发送的请求的 Referer HTTP Header 上。该 name 下可用的 `content` 有：

- `no-referrer-when-downgrade` Send the origin as a referrer to URLs as secure as the current page, (https→https), but does not send a referrer to less secure URLs (https→http). This is the default behaviour.
- `no-referrer` Do not send a HTTP Referrer header.
- `origin` Send the origin of the document.
- `origin-when-cross-origin` Send the full URL (stripped of parameters) for same-origin requests, but only send the origin for other cases.
- `same-origin` A referrer will be sent for same-site origins, but cross-origin requests will contain no referrer information.
- `strict-origin` Only send the origin of the document as the referrer to a-priori as-much-secure destination (HTTPS->HTTPS), but don't send it to a less secure destination (HTTPS->HTTP).
- `strict-origin-when-cross-origin` Send a full URL when performing a same-origin request, only send the origin of the document to a-priori as-much-secure destination (HTTPS->HTTPS), and send no header to a less secure destination (HTTPS->HTTP).
- `unsafe-URL` Send the full URL (stripped of parameters) for same-origin or cross-origin requests.

### viewport

https://developer.mozilla.org/en-US/docs/Mozilla/Mobile/Viewport_meta_tag

> viewport 提供了有关视口的初始大小。仅供移动设备使用。该 name 下可用的 `content` 有：

- `width`	**A positive integer number, or the text `device-width`**: Defines the pixel width of the viewport that you want the web site to be rendered at.
- `initial-scale`	**A positive number between 0.0 and 10.0**: Defines the ratio between the device width (device-width in portrait mode or device-height in landscape mode) and the viewport size.
- `height` **A positive integer, or the text `device-height`**: Defines the height of the viewport. **Not used by any browser**.
- `maximum-scale` **A positive number between 0.0 and 10.0**: Defines the maximum amount to zoom in. It must be greater or equal to the minimum-scale or the behaviour is undefined. **Browser settings can ignore this rule and iOS10+ ignores it by default**.
- `minimum-scale` **A positive number between 0.0 and 10.0**: Defines the minimum zoom level. It must be smaller or equal to the maximum-scale or the behaviour is undefined. **Browser settings can ignore this rule and iOS10+ ignores it by default**.
- `user-scalable` **yes or no**: If set to no, the user is not able to zoom in the webpage. The default is yes. **Browser settings can ignore this rule and iOS10+ ignores it by default**.

[\<meta\>: The Document-level Metadata element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta)

[Using Meta Tags in HTML: Some Basics and Best Practices](https://www.sitepoint.com/meta-tags-html-basics-best-practices/)
