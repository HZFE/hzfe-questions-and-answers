```bash
# 此页面贡献者：小钻风
```
# 算法：中序遍历

中序遍历(In-Order Traversal)，也叫做中根遍历、中序周游，指先访问左（右）子树，然后访问根，最后访问右（左）子树的遍历方式。适用于树形结构，属于深度优先遍历。

例如，有如下一种树形结构：

![](./img/pic1.jpg)

中序遍历的序列是：a+b*c-d-e/f

---

## 实现

```js
const tree = {
  value: '-',
  left: {
    value: '+',
    left: {
      value: 'a'
    },
    right: {
      value: '*',
      left: {
        value: 'b'
      },
      right: {
        value: '-',
        left: {
          value: 'c'
        },
        right: {
          value: 'd'
        }
      }
    }
  },
  right: {
    value: '/',
    left: {
      value: 'e'
    },
    right: {
      value: 'f'
    }
  }
}
```

### JavaScript

```js
const inOrder = function (node) {
  if (node) {
    inOrder(node.left)
    console.log(node.value)
    inOrder(node.right)
  }
}

inOrder(tree)
```

得到的结果为：

![](./img/pic2.png)

符合期望！
