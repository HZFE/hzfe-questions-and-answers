```bash
# 此页面贡献者：树
```
# script 标签 defer 或 async 属性的作用及区别

目前，`script` 标签有以下几种加载模式，分别是普通模式，`defer` 模式，`async` 模式，`module` 模式和 `module+async` 模式。首先引用一下规范中对这几个模式的定义：

[HTML Living Standard - scripting](https://html.spec.whatwg.org/multipage/scripting.html#attr-script-async)

> The async and defer attributes are boolean attributes that indicate how the script should be evaluated. Classic scripts may specify defer or async, but must not specify either unless the src attribute is present. Module scripts may specify the async attribute, but must not specify the defer attribute.
>
> There are several possible modes that can be selected using these attributes, and depending on the script's type.
> 
> For classic scripts, if the async attribute is present, then the classic script will be fetched in parallel to parsing and evaluated as soon as it is available (potentially before parsing completes). If the async attribute is not present but the defer attribute is present, then the classic script will be fetched in parallel and evaluated when the page has finished parsing. If neither attribute is present, then the script is fetched and evaluated immediately, blocking parsing until these are both complete.
> 
> For module scripts, if the async attribute is present, then the module script and all its dependencies will be fetched in parallel to parsing, and the module script will be evaluated as soon as it is available (potentially before parsing completes). Otherwise, the module script and its dependencies will be fetched in parallel to parsing and evaluated when the page has finished parsing. (The defer attribute has no effect on module scripts.)
> 
> This is all summarized in the following schematic diagram:
>
> ![](./asyncdefer.svg)
> 
> With &lt;script&gt;, parsing is interrupted by fetching and execution. With &lt;script defer&gt;, fetching is parallel to parsing and execution takes place after all parsing has finished. And with &lt;script async&gt;, fetching is parallel to parsing but once it finishes parsing is interrupted to execute the script. The story for &lt;script type="module"&gt; is similar to &lt;script defer&gt;, but the dependencies will be fetched as well, and the story for &lt;script type="module" async&gt; is similar to &lt;script async&gt; with the extra dependency fetching.
> 
> The exact processing details for these attributes are, for mostly historical reasons, somewhat non-trivial, involving a number of aspects of HTML. The implementation requirements are therefore by necessity scattered throughout the specification. The algorithms below (in this section) describe the core of this processing, but these algorithms reference and are referenced by the parsing rules for script start and end tags in HTML, in foreign content, and in XML, the rules for the document.write() method, the handling of scripting, etc.
> 
> The defer attribute may be specified even if the async attribute is specified, to cause legacy Web browsers that only support defer (and not async) to fall back to the defer behavior instead of the blocking behavior that is the default.

## async 模式

```html
<script async>
```

`async` 模式下的 `script` 标签加载脚本和 HTML 解析是同步执行的。这意味着加载的时候不会打断 HTML 的解析，直到加载完成之后才会阻塞 HTML 的解析来执行脚本，执行完成之后再继续 HTML 解析。

## defer 模式

```html
<script defer>
```

`defer` 模式下的 `script` 标签加载脚本和 HTML 解析和 `async` 一样是同步执行的。和 `async` 不同的是 `defer` 模式会等到 HTML 解析完成之后才开始执行脚本

## module 模式

```html
<script type="module">
```

普通的 `module` 模式和 `defer` 模式类似，都是加载脚本和 HTML 解析是同步执行，等到 HTML 解析完成之后才开始执行脚本。

## module+async 模式

```html
<script type="module" async>
```

加上 `async` 的`module` 模式的表现就和 `async` 一样了，即同步加载，阻塞 HTML 解析以执行脚本，随后继续 HTML 解析

## 兼容性

`async` 和 `defer` 获得了几乎所有的现代浏览器的支持，需要注意的是 IE 9 及以下不支持 `async`，所以建议 `async` 和 `defer` 都添加上以便不支持 `async` 的浏览器可以降级到 `defer` 而不是在加载时阻塞 HTML 的解析。

