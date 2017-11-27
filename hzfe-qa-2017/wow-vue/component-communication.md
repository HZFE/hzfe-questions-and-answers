# Vue 组件通信

## 前言
Vue 拥有强大的组件系统，组件都需要配合来使用，每个组件都是独立的个体，组合组件时必然会出现组件间通信的问题。

## 父子组件通信
父子组件是非常常见的一种组合方式，Vue 也设计了一套高度解耦并且非常优雅的API来解决了父子组件通信的问题。

![props-events](img/props-events.png)
> 以上图片来自Vue 官网

### 神奇的Prop :)

Prop 就像函数的参数，调用时外部（父组件）传入
```js
// 父组件 计算器组件
Vue.component('calculator', {
    name: 'calculator',
    template: `
        <div>
            <input v-model="firstNumber" type="number">加
            <input v-model="secondNumber" type="number">等于
            <addition 
                :first-number="firstNumber" 
                :second-number="secondNumber">
            </addition>   
        </div>   
    `,
    data() {
        return {
            firstNumber: 0,
            secondNumber: 0
        }
    }
});

// 子组件 加法组件
Vue.component('addition', {
    name: 'addition',
    template: `
        <span>{{ firstNumber + secondNumber }}</span>
    `,
    props: ['firstNumber', 'secondNumber']
});
```

以上示例代码父组件往子组件 Prop 里传递数值，子组件计算 Prop 结果显示在模板中。

**注意：Prop如果不使用`v-bind`的方式传递接受的就是一个字符串，如果需要作为 JavaScript 表达式就需要使用`v-bind`的方式传递 Prop。**

> Prop 是单向绑定的：当父组件的属性变化时，将传递给子组件，但是反过来不会。这是为了防止子组件无意间修改了父组件的状态，来避免应用的数据流变得难以理解。

以上摘自 Vue 官网，这就意味着你将无法直接像用`v-model`一样用 Prop 来传递数据。当然你也可以通过 `.sync`修饰符和自定义组件的`v-model`来实现双向绑定的功能。
**`.sync`修饰符需要使用 Vue 2.3.0 以上版本**

Prop 还支持对传入的数据进行验证，此文不在赘述，需要详细了解 Prop 的用法请参考 Vue 的官方文档。

### 神奇的自定义事件 :)

父组件通过 Prop 来和子组件进行通信，子组件通过自定义事件的机制来和父组件通信。

接下来我们修改下示例代码，把按钮封装到加法组件里，加法组件（子组件）向父组件提供自定义事件`on-addition`，父组件绑定事件函数，加法组件（子组件）的按钮被点击后就去触发`on-addition`自定义事件，父组件传入的事件处理函数就会被调用，父组件就能从事件处理函数的参数中拿到相应数据。

```js
// 父组件 计算器组件
Vue.component('calculator', {
    name: 'calculator',
    template: `
        <div>
            <input v-model="firstNumber" type="number">加
            <input v-model="secondNumber" type="number">
            <addition 
                :first-number="firstNumber" 
                :second-number="secondNumber"
                @on-addition="onAddition">
            </addition>
            {{ result }}   
        </div>   
    `,
    data() {
        return {
            firstNumber: 0,
            secondNumber: 0,
            result: 0
        }
    },
    methods: {
        onAddition(result) {
            this.result = result;
        }
    }
});

// 子组件 加法组件
Vue.component('addition', {
    name: 'addition',
    template: `
        <button type="button" @click="handleAddition">等于</button>
    `,
    props: ['firstNumber', 'secondNumber'],
    methods: {
        handleAddition() {
            const result = firstNumber + secondNumber;
            this.$emit('on-addition', result);
        }
    }
});
```

## 非父子组件的通信

### Event Bus
非父子组件也就是同级组件（兄弟组件），或者为嵌套较深多层级的父子组件。简单情况下 Vue 官方文档介绍了使用 Event Bus 的方式来处理非父子级组件间的通信。

```js
const bus = new Vue();

Vue.component('a', {
    template: `
        <button type="button" @click="handleClick"></button>
    `,
    methndos: {
        handleClick() {
            bus.$emit('a-click', '我a组件被点击啦!');
        }
    }
});

Vue.component('b', {
    template: `
        <p>b组件接受到的消息：{{ msg }}</p>
    `,
    data() {
        return {
            msg: '';
        }
    },
    created() {
        bus.$on('a-click', (msg) => {
            this.msg = msg;
        });
    }
});
```
Event Bus 其实就是通过一个中间的 Vue 空实例，在这个 Vue 空实例上面订阅事件和触发事件，达到非父子组件通信的目的。
在实际开发项目中，Event Bus 如果用的很多，代码会变得难以维护。

复杂的非父子级组件通信问题，可以采用状态管理模式。推荐使用[Vuex](https://vuex.vuejs.org/) ，Vuex 是 Vue 官方基于状态管理模式实现的库。

### $broadcast 和 $dispatch
`$broadcast`和`$dispatch`原本是 Vue 1.x 中的API，在 Vue 2.x 中已经被移除。 
`$broadcast`可以去广播事件通知当前组件的所有后代，然后触发相应的事件。`$dispatch`则是组件往父级向上冒泡去触发相应的事件。

`$broadcast`和`$dispatch`在编写 Vue 的一些第三方组件库的时候非常有用，虽然已经在 Vue 2.x 中被移除，但Element UI等一些比较大的开源组件库里，都去重新实现了这两个API。

[Element UI 中的$broadcast和$dispatch实现的源码](https://github.com/ElemeFE/element/blob/dev/src/mixins/emitter.js)

Element UI中的这两个API和 Vue 1.x 的有些不同，Element UI是通过指定组件名来定向的去触发某一个组件中相应的事件，而不是向 Vue 1.x 中那样事件广播。有兴趣的朋友可以读下源码。
