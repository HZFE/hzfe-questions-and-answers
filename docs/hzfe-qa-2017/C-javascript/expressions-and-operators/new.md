```bash
# 此页面贡献者：年轻的小铲
```
## Syntax

```javascript
new constructor[([arguments])]
// constructor: 一个指定对象实例的类型的类或函数。
// arguments: 一个用来被构造函数调用的参数列表。
```

## `new` operator does the following things:

1. 初始化一个新的对象
  > It creates a new object. The type of this object, is simply object.

2. 令这个新对象继承构造函数的prototype属性
  > It sets this new object's internal, inaccessible, [[prototype]] (i.e. __proto__) property
  > to be the constructor function's external, accessible, prototype object.

3. 将 this 绑定到这个新创建的对象
  > It makes the this variable point to the newly created object.

4. 执行构造函数中的代码，涉及到this的语句，则使用新创建的对象
  > It executes the constructor function, using the newly created object whenever this is mentioned.

5. 返回新创建的对象，除非构造函数返回了一个非 null 对象，这种情况下，返回的则是构造函数返回的对象。
  > It returns the newly created object, unless the constructor function returns a non-null object reference.
  > In this case, that object reference is returned instead.


## examples

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

## 相关面试题

- [x] **new关键字和不new有什么区别**

    前者是使用new关键字，把函数当成构造函数，创建一个自定义对象类型的实例，或具有构造函数的内置对象的实例；
    
    后者就是直接对方法进行调用，执行方法中的语句。

- [x] **构造函数return字符串的话是返回什么，为什么**

    返回的是被创建的实例对象，也就是this所指的对象。
    
    因为构造函数可以显式return一个非null的对象，除此之外，则默认返回this对象。

## 学习资料

[MDN - new operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/new)

[what-is-the-new-keyword-in-javascript](https://stackoverflow.com/questions/1646698/what-is-the-new-keyword-in-javascript)