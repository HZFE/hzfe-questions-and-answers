## null
```javascript
The Null type has exactly one value, called null.
```

## 数据类型 -【高程】
```html
有些时候，typeof操作符会返回一些令人迷惑但技术上却正确的值。
比如，调用typeof null会返回"object"，因为特殊值null被认为是一个空的对象引用。
```

## 为什么"typeof null"是'object'
```javascript
在JavaScript中，null是原始值之一，但是typeof null的输出却又是'object'。
很不幸的是，这个bug几乎不可能被修复，因为修复它会破坏现有的代码。
'typeof null'是从JavaScript第一版就遗留下来的问题，在这个版本中，数据用32位来存储：
数据的类型tag记录在其末尾中的1~3个比特中，剩余的比特位来存储数据的值。数据的类型有五种。

如果最末尾是1，那么这个数据类型就只是1个比特长度的。
如果最末尾是0，那么这种的数据类型长度都是占3个比特的，这种情况的有4种数据类型。
```

| 000 | 表示对象，存储的值是一个对象的引用 |
| ---- |----------------------------|
| 1   | 表示整数，存储的值是31位的有符号整数 |
| 010 | 表示双精度浮点数，存储的值是这个数字的引用 |
| 100 | 表示字符串，存储的值是这个字符串的引用 |
| 110 | 布尔值，存储的值是一个布尔值 |

有两种值比较特殊：
```javascript
undefined(JSVAL_VOID)是一个超出了最大能表示的整数的数（-2^30)
null(JSVAL_NULL)代表的是空指针(大多数平台下值为0x00)，因此，null的类型标签也是0
``` 
```html
现在知道为什么typeof null会被识别成对象了：
当typeof检查null的类型tag时，首先发现其末尾是一个0，进而检查倒数第二和第三个比特位，发现也都是0，于是typeof就认为null是一个对象了。
这是一个非常显而易见的bug，甚至很低级，但是我们不要忘了，第一版的JavaScript是一个人在十天内写出来的。
```

## 学习资料
[为什么"typeof null"是'object'](https://zui.su/typeof_null/)

[The history of “typeof null”](http://2ality.com/2013/10/typeof-null.html)

[MDN - typeof](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/typeof)