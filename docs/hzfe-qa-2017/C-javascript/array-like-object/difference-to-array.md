```bash
# 此页面贡献者：小k
```

# 类数组和数组组别

要弄清楚类数组和数组区别，首先要清楚什么是类数组，什么是数组。下面先介绍下这两个概念。

## 类数组 (array-like object)
类数组顾名思义就是像数组的对象。一般有如下三个特点：

1. 不是数组
2. 有length属性
3. length为非负整数，不超过Math.pow(2,32) - 1

满足以上三个特点的就是类数组对象了，常见的类数组对象有 arguments，HTML collections，NodeList等等。

## 数组 (array)
**数组是用来存储多个值的对象，每一个值有一个数字索引，并且可以是任意类型。**可以发现数组和对象比较相似，不同点在于对应的索引是字符串，而数组的索引是数字。同时数组作为一个单独的数据类型也有自己特定的一些方法，如join，push，shift等。

## 相同点
1. 都是对象
```javascript
const obj = { 'first': 1, 'second': 2, length: 3}
obj instanceof Object // true
[] instanceof Object // true
```
2. 有length属性

## 不同点
1. 类数组的length不会自增
```javascript
const obj = { 'first': 1, 'second': 2, length: 3}
obj.length // 3
obj.third = 3
obj.length // 4
obj instanceof Object // true
[].
```
2. 类数组没有原生数组的方法：因为类数组不是用数组构造函数生成的，所以不会继承数组原型上的方法

## 总结
其实在了解类数组和数组各自的定义之后，两者之间的不同点也就不言而喻了。对应的类数组对象转数组对应的参考文章里也有介绍，这里就不过多说明了。

## 参考资料
- [array-like object](https://github.com/hanzichi/underscore-analysis/issues/14)
- [array and array-like objects](https://www.nfriedly.com/techblog/2009/06/advanced-javascript-objects-arrays-and-array-like-objects/)
- [difference between array & array-like object](https://stackoverflow.com/questions/29707568/javascript-difference-between-array-and-array-like-object)