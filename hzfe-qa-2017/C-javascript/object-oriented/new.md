## Syntax
```javascript
new constructor[([arguments])]
// constructor: 一个指定对象实例的类型的函数。
// arguments:   一个用来被构造函数调用的参数列表。
```

## `new` operator does 5 things:
```javascript
1.创建一个新的对象。
// It creates a new object. The type of this object, is simply object.

2.将这个新对象的内部属性[[prototype]]指向构造函数的prototype属性。
// It sets this new object's internal, inaccessible, [[prototype]] (i.e. __proto__) property
// to be the constructor function's external, accessible, prototype object.

3.将this指向这个新对象
// It makes the this variable point to the newly created object.

4.执行构造函数中的代码
// It executes the constructor function, using the newly created object whenever this is mentioned.

5.返回新对象（但是，当构造函数有返回非null对象时，则返回的是构造函数的返回值）
// It returns the newly created object, unless the constructor function returns a non-null object reference.
// In this case, that object reference is returned instead.
```

## example
```javascript
ObjMaker = function() { this.a = 'first' }
// ObjMaker is just a function, there's nothing special about it that makes it a constructor.

ObjMaker.prototype.b = 'second'
// like all functions, ObjMaker has an accessible prototype property that we can alter.
// I just added a property called 'b' to it.
// Like all objects, ObjMaker also has an inaccessible [[prototype]] property that we can't do anything with

obj1 = new ObjMaker()
// 3 things just happened.

// A new, empty object was created called obj1. At first obj1 was the same as {}.
// The [[prototype]] property of obj1 was then set to the current object value of the ObjMaker.prototype.
// The ObjMaker function was executed, with obj1 in place of this... so obj1.a was set to 'first'.

console.log(obj1.a) // first
console.log(obj1.b) // second
// obj1 doesn't have a property called 'b', so JavaScript checks its [[prototype]].
// Its [[prototype]] is the same as ObjMaker.prototype.
// ObjMaker.prototype has a property called 'b' with value 'second'
// So returns 'second'
```

## 学习资料
[MDN - new operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/new)

[what-is-the-new-keyword-in-javascript](https://stackoverflow.com/questions/1646698/what-is-the-new-keyword-in-javascript)

[JavaScript中的new关键词](https://www.w3cplus.com/javascript/javascript-new-keyword.html)
