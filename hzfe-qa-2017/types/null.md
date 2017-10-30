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
| 类型 | 含义 |
| ---- |----------------------------|
| 000 | 表示对象，存储的值是一个对象的引用 |
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

让我们从 SpiderMonkey 的源码中看看具体实现吧。

```c
//jstypes.h
#define JS_BIT(n)       ((JSUint32)1 << (n))
#define JS_BITMASK(n)   (JS_BIT(n) - 1)
```

```c
// jsapi.h
#define JSVAL_OBJECT            0x0     /* untagged reference to object */
#define JSVAL_TAGBITS           3
#define JSVAL_TAGMASK           JS_BITMASK(JSVAL_TAGBITS) // ((JSUint32)1 << (3)) - 1
#define JSVAL_TAG(v)            ((v) & JSVAL_TAGMASK)
#define JSVAL_IS_OBJECT(v)      (JSVAL_TAG(v) == JSVAL_OBJECT)

#define OBJECT_TO_JSVAL(obj)    ((jsval)(obj))
#define JSVAL_NULL              OBJECT_TO_JSVAL(0)
```

```javascript
// jsapi.c
JS_PUBLIC_API(JSType)
JS_TypeOfValue(JSContext *cx, jsval v)
{
    JSType type;
    JSObject *obj;
    JSObjectOps *ops;
    JSClass *clasp;

    CHECK_REQUEST(cx);
    if (JSVAL_IS_OBJECT(v)) {
        type = JSTYPE_OBJECT;           /* XXXbe JSTYPE_NULL for JS2 */
        obj = JSVAL_TO_OBJECT(v);
        if (obj) {
            ops = obj->map->ops;
#if JS_HAS_XML_SUPPORT
            if (ops == &js_XMLObjectOps.base) {
                type = JSTYPE_XML;
            } else
#endif
            {
                /*
                 * ECMA 262, 11.4.3 says that any native object that implements
                 * [[Call]] should be of type "function". Note that RegExp and
                 * Script are both of type "function" for compatibility with
                 * older SpiderMonkeys.
                 */
                clasp = OBJ_GET_CLASS(cx, obj);
                if ((ops == &js_ObjectOps)
                    ? (clasp->call
                       ? (clasp == &js_RegExpClass || clasp == &js_ScriptClass)
                       : clasp == &js_FunctionClass)
                    : ops->call != NULL) {
                    type = JSTYPE_FUNCTION;
                } else {
#ifdef NARCISSUS
                    if (!OBJ_GET_PROPERTY(cx, obj,
                                          ATOM_TO_JSID(cx->runtime->atomState
                                                       .callAtom),
                                          &v)) {
                        JS_ClearPendingException(cx);
                    } else if (VALUE_IS_FUNCTION(cx, v)) {
                        type = JSTYPE_FUNCTION;
                    }
#endif
                }
            }
        }
    } else if (JSVAL_IS_NUMBER(v)) {
        type = JSTYPE_NUMBER;
    } else if (JSVAL_IS_STRING(v)) {
        type = JSTYPE_STRING;
    } else if (JSVAL_IS_BOOLEAN(v)) {
        type = JSTYPE_BOOLEAN;
    } else {
        type = JSTYPE_VOID;
    }
    return type;
}
```

从上面的源码我们可以知道，判断值是否为 `Object` 用到的函数是 `JSVAL_IS_OBJECT(v)`，而 `JSVAL_IS_OBJECT(v)` 的宏定义可以在 `jsapi.h` 中找到，`JSVAL_IS_OBJECT(v)` 实际上是等于 `JSVAL_TAG(v) == JSVAL_OBJECT` 的，一步步向上查找，最终我们可以发现
 `JSVAL_IS_OBJECT(null)` 实际上执行的操作是 **`(null & ((JSUint32)1 << (3)) - 1) == 0x0`**，而null的值为 0，显然左右这两个值是相等的，那么当然 typeof null 就等于 Object 了。

## 学习资料
[为什么"typeof null"是'object'](https://zui.su/typeof_null/)

[The history of “typeof null”](http://2ality.com/2013/10/typeof-null.html)

[MDN - typeof](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/typeof)
