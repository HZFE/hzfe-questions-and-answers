题目关键词：`面向对象` `继承` `原型链` `new`

#### 面向对象基础芝士
  ```javascript
  常见的对象比如这个样子。
  let hzfeDalao = { name: "盖盖" }
  ```
  ```javascript
  在控制台打印hzfeDalao，除了name: "盖盖"之外，还会有个__proto__对象，里面包含了一堆方法。也就是:

             打印   ------------
   hzfeDalao ====>  name: "盖盖"   打印  ---------------
                    __proto__     ====> constructor
                    ------------        hasOwnProperty
                                        toString
                                        valueOf
                                        ....             打印  ------
                                        __proto__        ====> null
                                        ---------------       ------
  ```
  ```javascript
  当我们打印hzfeDalao.toString时，会做这样的动作：
  1、hzfeDalao对象有没有toString？                    // 有：打印；没有：下一步
  2、hzfeDalao.__proto__对象有没有toString？          // 有：打印；没有：下一步
  3、hzfeDalao.__proto__.__proto__对象有没有toString？// 有：打印；没有：下一步
  4、...
  这个动作直到找到toString或者__proto__为null时停止。他这个'搜索的路线'，就是[原型链]
  ```
  ```javascript
  那么我们再搞一个dalao
  let ifeDalao = { name: "爆栈" }

  ifeDalao 和hzfeDalao 的toString 方法都是同一个: Object.prototype.toString
  因为所有对象，都继承自Object。也就是说，他们共享了Object上面的方法和属性。

  如果想ifeDalao的toString不调用Object.prototype.toString，那么像刚刚所说的动作过程那一步一样，
  在ifeDalao对象上添加toString属性即可，这样他就不会往下一步寻找。
  ```
#### 原型模式
  ```javascript
  首先看一个对象字面量，这种只能创建单个对象：
  let hzfeDalao = {
    type: 'hzfeDalao',
    position: 'CTO',
    sex: 'Gay',
    sleep: () => '不存在的',
    play: () => '玩的'
  }

  如果我们要创建18个盖盖去挖金矿，意味着重复代码：
  let hzfe = []
  for(let i = 0; i<18; i++) {
    hzfe.push( Object.assign({id: i}, hzfeDalao) )
  }
  ```
  ```javascript
  那么我们这里就可以利用原型链，避免重复创建盖盖相同的睡觉玩耍等方法及属性：
  function hzfeDalao (id) {
    let obj = {}
    obj.__proto__ = hzfeDalao.prototype

    obj.id  = id

    return obj
  }
  hzfeDalao.prototype = {
    type: 'hzfeDalao',
    position: 'CTO',
    sex: 'Gay',
    sleep: () => '不存在的',
    play: () => '玩的'
  }

  let hzfe = []
  for (let i = 0; i<18; i++) {
    hzfe.push( hzfeDalao(i) )
  }
  ```
  ```javascript
  那么实际上我们可以使用new操作符来创建实例。请跟上面的代码做对比
  function HzfeDalao (id) {
    this.id = id
  }
  HzfeDalao.prototype = {
    type: 'hzfeDalao',
    position: 'CTO',
    sex: 'Gay',
    sleep: () => '不存在的',
    play: () => '玩的'
  }

  let hzfe = []
  for (let i = 0; i<18; i++) {
    hzfe.push( new HzfeDalao(i) )
  }
  ```
  ```javascript
  对比后其实可以发现，这个new的过程就是：
  1、创建一个新对象
  2、将构造函数的作用域赋给新对象（因此this就指向了这个新对象）
  3、执行构造函数中的代码（为这个新对象添加属性）
  4、返回新对象
  ```