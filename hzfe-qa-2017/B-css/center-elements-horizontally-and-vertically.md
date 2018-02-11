```bash
# 此页面贡献者：阿喵、年轻的小铲
```
## 垂直居中的场景

0. Can you use flexbox?
0. Can you use grid?
1. Is the element of fixed width and height?
2. Is the element of unknown width and height?

## 约定
以下 `css` 中， `child` 为被垂直居中的元素。只写了 `parent` 元素样式的，默认为 `parent` 内的元素被垂直居中。

## 前提条件：可以使用flexbox
那就爽了
```css
.parent {
  display: flex;
  justify-content: center;
  align-items: center;
}
```

## 前提条件：可以使用grid
那就爽了
```css
.parent {
  display: grid;
  justify-content: center;
  align-items: center;
}
```

## 场景1：目标元素具有固定宽|高
将元素绝对定位的位置设为50% / 50%，并设置相应方向的负 `margin` 值 `width + padding / 2` 和 `height + padding / 2` 的。
```css
.parent {
  position: relative;
}

.child {
  position: absolute;
  top: 50%;
  left: 50%;

  width: 300px;
  height: 100px;
  padding: 20px;

  margin: -70px 0 0 -170px;
}
```

在设置宽高后，将元素绝对定位相关属性设置如下(left、top、bottom、right 偏移量自定义)，并设置 `margin` 为 `auto`。则元素在设定的left、top、bottom、right视口范围内垂直居中。
```css
.child {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  margin: auto;

  width: 300px;
  height: 100px;
  padding: 20px;

}
```

元素须具有固定的高度，则设置其 `line-height` 值与 `height` 值相等，达到竖直方向居中目的，再设置水平方向居中。
```css
.child {
  height: 100px;
  line-height: 100px;
  text-align: center;
}
```

利用display:table-cell属性使内容垂直居中。
```css
.child {
  display:table-cell;
  vertical-align: middle;
  text-align: center;

  width: 100px;
  height: 100px;
}
```

## 场景2：目标元素未知宽高
将元素绝对定位的位置设为50% / 50%，并通过 transform 属性的 translate() 方法，将元素相对当前位置，反向移动其宽高的50%。(百分比计算不是以父元素为基准，而是以自己为基准。)
```css
.parent {
  position: relative;
}
.child {
  position: absolute;
  top: 50%;
  left: 50%;

  transform: translate(-50%, -50%);
}
```

## 参考资料
[Centering in CSS: A Complete Guide](https://css-tricks.com/centering-css-complete-guide/)