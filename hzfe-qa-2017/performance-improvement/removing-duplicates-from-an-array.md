### 根据实际场景选择不同去重方式
```javascript
let uniq

// 一般来说，我们会选择遍历数组，
// 看一下当前元素在数组中第一次出现时的index，是否等于当前元素的index
// 等于则说明第一次出现，反之重复。
// 但是，indexOf 底层使用 === 判断，所以indexOf不能去重 NaN 元素：NaN === NaN // false
uniq = arr => arr.filter((item, index) => arr.indexOf(item) === index)

// ES7中的includes方法则可以区分NaN：http://www.ecma-international.org/ecma-262/7.0/#sec-array.prototype.includes
uniq = arr => arr.filter((item, index) => !arr.includes(item))

// 在filter方法的回调函数中使用第三个参数(array)，so we can avoid a closure of the array variable
uniq = arr => arr.filter((item, index, self) => self.indexOf(item) == index)
```

```javascript
// 如果对数组元素顺序无要求，可以排序后去重
// 排序后，过滤数组，过滤条件为如果是第一个元素或者相邻的元素不相同时，才为真
// 对一个已经排好序的数组去重，这种方法效率肯定高于使用 indexOf，且比indexOf（ES5）兼容性好
uniq = arr => arr.concat().sort().filter((item, index, self) => !index || item !== self[index - 1])
```

```javascript
// 尽管以上的写法很简洁，但是如果需要去重的数组很大，那么就十分低效[O(n^{2})].
// 最好的办法是这样的：
// 将每个元素放在一个哈希表，然后立即检查它的存在。[O(n)]
// 但是却有些缺点：
// 1.因为hash keys在Javascript中只能为strings，所以不能区分1和'1'：uniq([1,"1"]) 将返回 [1]
// 2.同样的原因，所有的objects会被认为是同一个：uniq([{foo:1},{foo:2}]) 将返回 [{foo:1}]
// 因此，如果你的数组元素都是原始值且你不需要区分数据类型，那么这就已经是最好的解决方案了：
uniq = arr => {
  let seen = {}
  return arr.filter(item => seen.hasOwnProperty(item) ? false : (seen[item] = true))
}
```

```javascript
// ES6 provides the Set object, which makes things a whole lot easier:
uniq = arr => Array.from(new Set(arr))

// 或者
uniq = arr => [...new Set(arr)]
```

```javascript
// A universal solution combines both approaches:
// it uses hash lookups for primitives and linear search for objects.
function uniq(arr) {
  let prims = {"boolean":{}, "number":{}, "string":{}}, objs = [];

  return arr.filter(item => {
    let type = typeof item
    if(type in prims) 
      return prims[type].hasOwnProperty(item) ? false : (prims[type][item] = true)
    else
      return objs.indexOf(item) >= 0 ? false : objs.push(item)
  })
}
```

### underscore源码分析：uniq方法
```javascript
// 生成无重复元素的数组。
// 如果数组已经排序过，你可以传入第二个参数为true，以选择使用更快的算法。
// 第三个参数方便传入方法，在去重同时对元素进行操作
_.uniq = _.unique = function(array, isSorted, iteratee, context) {

  // isSorted未传入布尔值，则默认初始化部分参数
  if (!_.isBoolean(isSorted)) {
    context = iteratee;
    iteratee = isSorted;
    isSorted = false;
  }
  if (iteratee != null) iteratee = cb(iteratee, context);

  var result = [];
  var seen = [];

  for (var i = 0, length = getLength(array); i < length; i++) {
    var value = array[i],
        computed = iteratee ? iteratee(value, i, array) : value;
    if (isSorted) {
      // 与前一个元素作比较
      if (!i || seen !== computed) result.push(value);
      seen = computed;
    } else if (iteratee) {
      // 元素被操作改变过，则在seen数组中查找是否有相同元素
      if (!_.contains(seen, computed)) {
        seen.push(computed);
        result.push(value);
      }
    } else if (!_.contains(result, value)) {
      // 直接在result数组中查找是否有相同元素
      result.push(value);
    }
  }
  return result;
};
```

### 学习资料

[Remove Duplicates from JavaScript Array](https://stackoverflow.com/questions/9229645/remove-duplicates-from-javascript-array)

[JavaScript专题之数组去重](https://github.com/mqyqingfeng/Blog/issues/27)

[也谈JavaScript数组去重](https://www.toobug.net/article/array_unique_in_javascript.html)
