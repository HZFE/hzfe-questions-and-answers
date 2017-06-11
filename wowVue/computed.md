# 浅析 Vue 的 Computed


## Vue 版本

`Vue.js v2.3.2`

## 在哪找到 Computed

`vue/src/core/instance/state.js:150`

## 咋来的？

阅读 Vue 的源码一般可以从 `vue/src/core/instance/index.js` 开始。

`index.js`

打开这个文件我们首先可以看到这么一段代码：

```javascript
import ...
function Vue (options) {
  if (process.env.NODE_ENV !== 'production' &&
    !(this instanceof Vue)) {
    warn('Vue is a constructor and should be called with the `new` keyword')
  }
  this._init(options)
}

initMixin(Vue)
stateMixin(Vue)
eventsMixin(Vue)
lifecycleMixin(Vue)
renderMixin(Vue)

export default Vue
```

因为 computed 是 Vue 实例的一个属性，所以显而易见的我们应该顺着 `this._init(options)` 往下找。那么 `this._init` 在哪呢？其实他在 `init.js` 里。

`init.js`

```javascript
export function initMixin (Vue: Class<Component>) {
  Vue.prototype._init = function (options?: Object) {
  
  //balabala...
  initLifecycle(vm)
  initEvents(vm)
  initRender(vm)
  callHook(vm, 'beforeCreate')
  initInjections(vm) // resolve injections before data/props
  initState(vm)
  initProvide(vm) // resolve provide after data/props
  callHook(vm, 'created')
  //balabala...
```

根据 Vue 的生命周期图，我们不难想到 computed 相关内容应该在 `initState(vm)`，接着往下找~

`stat.js`

```javascript
export function initState (vm: Component) {
  vm._watchers = []
  const opts = vm.$options
  if (opts.props) initProps(vm, opts.props)
  if (opts.methods) initMethods(vm, opts.methods)
  if (opts.data) {
    initData(vm)
  } else {
    observe(vm._data = {}, true /* asRootData */)
  }
  if (opts.computed) initComputed(vm, opts.computed)
  if (opts.watch) initWatch(vm, opts.watch)
}
```

`vm.$options` 就是实例化时传的那个对象，从代码我们可以看出来，如果我们传给 Vue 的对象中包含 computed 属性的话，那么就会开始初始化 computed: `initComputed(vm, opts.computed)`

## Computed 代码

```javascript
function initComputed (vm: Component, computed: Object) {
  const watchers = vm._computedWatchers = Object.create(null)

  // 遍历 computed
  for (const key in computed) {
    const userDef = computed[key]
    // 如果 computed[key] 是函数那么就把函数作为 getter，否则把 computed[key].get 作为 getter
    let getter = typeof userDef === 'function' ? userDef : userDef.get
    if (process.env.NODE_ENV !== 'production') {
      if (getter === undefined) {
        warn(
          `No getter function has been defined for computed property "${key}".`,
          vm
        )
        getter = noop
      }
    }
    // create internal watcher for the computed property.
    // 为 computed 属性创建一个 watcher
    watchers[key] = new Watcher(vm, getter, noop, computedWatcherOptions)

    // component-defined computed properties are already defined on the
    // component prototype. We only need to define computed properties defined
    // at instantiation here.
    // 判断是否有同名属性
    if (!(key in vm)) {
      defineComputed(vm, key, userDef)
    } else if (process.env.NODE_ENV !== 'production') {
      if (key in vm.$data) {
        warn(`The computed property "${key}" is already defined in data.`, vm)
      } else if (vm.$options.props && key in vm.$options.props) {
        warn(`The computed property "${key}" is already defined as a prop.`, vm)
      }
    }
  }
}

export function defineComputed (target: any, key: string, userDef: Object | Function) {
  // 如果之前的 computed[key] 是函数的话
  if (typeof userDef === 'function') {
    sharedPropertyDefinition.get = createComputedGetter(key) // 创建 computed getter
    sharedPropertyDefinition.set = noop // setter 是个空函数
  } else {
    // 如果定义 computed[key].get 的话
    // 如果开启了缓存，则创建一个 computed getter，否则直接使用 computed[key].get
    sharedPropertyDefinition.get = userDef.get
      ? userDef.cache !== false
        ? createComputedGetter(key)
        : userDef.get
      : noop
    
    // 如果定义了 computed[key].set 的话那么就直接用，否则 setter 是个空函数
    sharedPropertyDefinition.set = userDef.set
      ? userDef.set
      : noop
  }
  // 把这个 computed '代理'到实例上
  Object.defineProperty(target, key, sharedPropertyDefinition)
}

// 创建 computed getter，其中的 watcher 又是另一个主题了，在这不再展开
function createComputedGetter (key) {
  return function computedGetter () {
    const watcher = this._computedWatchers && this._computedWatchers[key]
    if (watcher) {
      if (watcher.dirty) {
        watcher.evaluate()
      }
      if (Dep.target) {
        watcher.depend()
      }
      return watcher.value
    }
  }
}
```

## 总结一下

computed 的主要步骤就是：

1. 遍历 computed
2. 获取 getter
3. 创建 watcher
4. 创建 computed getter
5. 把当前属性代理到 Vue 实例上



