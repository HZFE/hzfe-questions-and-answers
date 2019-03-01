```bash
# 此页面贡献者：小k 铲铲
```

# 类数组和数组

## 类数组 (array-like object)

类数组顾名思义就是**像数组的对象**。常见的类数组对象有 arguments，HTML collections，NodeList等等。一般有如下三个特点：

1. 不是数组
2. 有length属性，值为非负整数，且不超过 ```Math.pow(2,32) - 1```

## 数组 (array)

数组**是用来存储多个值的对象，每一个值有一个数字索引，并且可以是任意类型。**
对象的索引是字符串，数组的索引是数字。
同时数组作为一个单独的数据类型也有自己特定的一些方法，如```join``` ```push``` ```shift```等。

## 相同点/不同点

1. 都有length属性
2. 都是对象
```javascript
const obj = { 'first': 1, 'second': 2, length: 3 }
obj instanceof Object // true
[] instanceof Object // true
```
3. 类数组的length不会自增
```javascript
const obj = { 'first': 1, 'second': 2, length: 3}
obj.length // 3
obj.third = 3
obj.length // 3
```
4. 类数组没有原生数组的方法
```javascript
// 因为类数组不是用数组构造函数生成的，所以不会继承数组原型上的方法
// 可以通过以下途径将 object like array 转化为 array
Array.prototype.slice.call(arguments)
Array.from(arguments)
```


## 参考资料
- [difference between array & array-like object](https://stackoverflow.com/questions/29707568/javascript-difference-between-array-and-array-like-object)
- [Convert Array-like objects, Array.prototype.slice or Array.from](https://stackoverflow.com/questions/36995617/convert-array-like-objects-array-prototype-slice-or-array-from)
