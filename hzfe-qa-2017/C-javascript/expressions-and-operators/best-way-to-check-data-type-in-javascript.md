## 储备知识

### typeof 操作符

  - 对于基本类型，除 null 以外，均可以返回正确的结果。

      但是如果用 new 操作符来创建基本数据类型的实例时，typeof 判断为 object

  - 对于引用类型，除 function 以外，一律返回 object 类型。

  - 对于 null ，返回 object 类型。

### constructor 属性

  - 除 null 和 undefined ，可以调用变量的 constructor 属性判断类型。

      但是，constructor 属性不稳定，有可能被开发者重写

### toString 方法

  - 对变量调用该方法，默认返回其内部属性 [[Class]] ，格式为 [object Xxx] ，其中 Xxx 就是对象的类型。

## 代码参考

工具函数：

```javascript
function checkType (value) {
  return toString.call(value)
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 */
function isObjectLike(value) {
  return typeof value == 'object' && value !== null
}
```

1. 判断 `Stirng`

```javascript
function isString(value) {
  const type = typeof value
  return type == 'string' || (type == 'object' && value != null && !Array.isArray(value) && checkType(value) == '[object String]')
}
```

2. 判断 `Number`

```javascript
function isNumber(value) {
  return typeof value == 'number' || (isObjectLike(value) && checkType(value) == '[object Number]')
}
```

3. 判断 `Boolean`

```javascript
function isBoolean(value) {
  return value === true || value === false || (isObjectLike(value) && checkType(value) == '[object Boolean]')
}
```

4. 判断 `Null`

```javascript
function isNull(value) {
  return value === null
}
```

5. 判断 `Undefined`

```javascript
function isUndefined(value) {
  return value === undefined
}
```

6. 判断 `Object`

```javascript
function isObject(value) {
  const type = typeof value
  return value != null && (type == 'object' || type == 'function')
}
```

7. 判断 `Function`

```javascript
function isFunction(value) {
  if (!isObject(value)) {
    return false
  }

  const tag = checkType(value)
  return tag == '[object Function]' || tag == '[object AsyncFunction]' || tag == '[object GeneratorFunction]' || tag == '[object Proxy]'
}
```

8. 判断 `Array`

```javascript
// ie9+
function isArray (value) {
  return Array.isArray(value)
}
```

9. 判断 `Date`

```javascript
function isDate (value) {
  return isObjectLike(value) && checkType(value) == '[object Date]'
}
```

10. 判断 `RegExp`

```javascript
function IsRegExp (value) {
  return isObjectLike(value) && checkType(value) == '[object RegExp]'
}
```

## 学习资料

[判断 JS 数据类型的四种方法](http://www.cnblogs.com/onepixel/p/5126046.html)

[lodash](https://github.com/lodash/lodash)