# Vue 组件通信从入门到精通

## 前言
Vue 拥有强大的组件系统，组件都需要配合来使用，每个组件都是独立的个体，组合组件时必然会出现组件间通信的问题。

## 父子组件通信
父子组件是非常常见的一种组合方式，Vue 也设计了一套高度解耦并且非常优雅的API来解决了父子组件通信的问题。

![props-events](img/props-events.png)
> 以上图片来自Vue 官网

### 神奇的Prop :)

Prop 就像函数的参数，调用时外部（父组件）传入
```vue
// 爸爸组件
Vue.component('parent', {
    name: 'jackma',
    template: `
        <div>
            <child :money="giveMoney(100000)"></child>   
        </div>   
    `,
    data() {
        return {
            money: 999999999
        }
    },
    methods: {
        // 给钱方法
        giveMoney(number) {
            this.money -= number;
            return number;
        }
    }
});

// 儿子组件
Vue.component('child', {
    name: 'me',
    template: `
        <div>我的余额：{{ this.money }}</div>
    `,
    props: [money],
    data() {
        return {
            money: 0
        }
    }
});
```

以上示例代码父组件往子组件 Prop `money` 里传递数据。

**注意：Prop和HTML属性一样如果不使用`v-bind`的方式传递接受的就是一个字符串，如果需要作为 JavaScript 表达式就需要使用`v-bind`的方式传递 Prop**
