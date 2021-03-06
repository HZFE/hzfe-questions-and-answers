```bash
# 此页面贡献者：小k
```

# 常见移动端调试方法

自H5发布以来，移动设备成了大前端的另一个战场。毫无疑问，相比于 Android 和 ios，h5无疑是其中开发成本最小的一个，只需一个前端开发，就可以实现三端上的访问。h5的火爆给前端带来了许多升级，但同时也带来了一些调试上的问题。毕竟移动端不同于PC端，没有dev-tools之类的高效调试工具，而且不同手机，不同操作系统都移动端调试增加了难度。下面将从不同的场景，简要介绍下常见对应的调试技巧。

## 页面调试
指的是直接通过访问url，在浏览器环境打开页面，包括一些在一些第三方应用中，如微信，qq等。这种场景相对来说和PC端调试比较类似，对应有如下3种调试方案。

1. **手动构建环境进行页面调试**：这类页面调试的共同点在于，无论是在浏览器，还是第三方应用中打开页面，其实都是对应一个浏览器环境。因此只需要了解对应的浏览器版本，然后下载对应版本的浏览器，就可以复现对应的问题。

2. **远程调试**：指的是在浏览器中对当前的手机显示上的页面进行调试，一般是通过远程调试的方式进行。按照手机操作系统的不同，对应的调试方式也有所不同。Android设备在Chrome上调试，ios设备在Safari浏览器上调试。这两种方式目前都有比较成熟的解决方案，自行搜索一般可以找到详细的操作说明，这里就不细说了。

3. **真机调试**：指的是直接在手机上对页面进行调试。一般都是通过第三方的组件库来显示对应的调试信息，如 [vconsole](https://github.com/Tencent/vConsole)，[spy-debugger](https://github.com/wuchangming/spy-debugger)等。其他第三方软件也有可能提供对应的调试工具，参照对应的文档进行操作一般即可。

下面是这三种方式的对比：

![difference](./images/difference.png)

## webView调试
针对的是在webView中打开的页面的调试。和直接在浏览器页面中打开比较类似，唯一不同的是在对应的webView可以影响内嵌网页的一些行为，如网络请求，页面交互等等。在webView上打开有问题，而直接通过对应的url访问没有问题，基本可以确定是webView对网页的行为产生了影响而导致问题产生。针对这类问题，比较常见的有一下两种排查方式。

1. **app内调试**：即在对应出现问题的app内进行调试，同样 Android 和 ios对应的调试方式也有所不同。但是相同的一点是，两者都需要对应的app支持调试。在Android应用中的表现打开安卓应用[webView调试模式](https://www.jianshu.com/p/ebd9736ad274)，在ios中则表现需要对应用进行debug，这个步骤一般需要有源代码，用xcode上跑起来，在对应的ios模拟器上运行。剩下的步骤则比较类似，安卓依然在PC的Chrome上对webView内嵌的页面进行调试，对应ios可以用Safari对页面进行调试。

2. **Charles抓包调试**：用Charles对页面上的应用进行抓包调试。将app内的请求全部抓包，由此来分析具体的问题。但是有一个问题就是可能是js内部报错，而不是网络请求错误，这个时候并不会抓到对应报错信息的请求。这里有一种hack的处理方式，既然没有请求，那我么可以创造请求。目前错误处理比较健全的应用中一般会带有全局的错误处理，如果没有，可以添加对应的全局的错误处理。可以在错误处理捕捉到错误时，使用一个http请求将对应的错误信息作为报文发出，这样就可以Charles中获取错误信息了。

相对来说，使用Charles抓包的方式进行调试成本更小，实际的app调试基本都需要对应的安卓和ios应用的开发环境才能能够支持，这些环境搭建对于前端来说通常就是一天的工作量了。最近有遇到一个问题就是在安卓的webView中表现正常，在ios的UIwebView中却有问题，实际排查了一天才发现是安卓和ios应用对于各自webView销毁的处理方式不一致导致的。遇到webView上表现不同的问题，建议还是找对应端的同学帮忙排查。

## 总结
可以发现，在脱离了熟悉的PC端之后，调试在移动端似乎没有那么容易。但是，也没有那么难。在我觉得大多数移动端调试基本都是兼容性问题，也有少数的场景是webView对页面有影响。但无论是哪种场景，按照上面所说的方式排查，最终应该是可以找到问题所在的。欢迎补充及指正。

PS：关于抓包可以推荐两个免费的抓包工具，安卓上的 packet capture，ios上的 stream，两款软件都是免费的。可以抓HTTP/HTPPS的包，不过抓HTTPS的包需要装证书，但是相对来说比Charles要简单一些，有兴趣的同学可以试用下。

## 参考链接
- [移动前端调试方案(Android + Chrome 远程调试)](https://www.cnblogs.com/leinov/p/4094138.html)
- [移动端浏览器调试方法汇总](https://juejin.im/entry/5937c9c5a22b9d0058120b7d)
- [移动端前端开发调试](http://yujiangshui.com/multidevice-frontend-debug/)
