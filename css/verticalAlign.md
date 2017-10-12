## 垂直居中

> 常用的文字垂直居中方法

### line-height（单行文本 div => height: 40px）

``` css
div {
    line-height: 40px;
}
```

### vertical-align（仅生效inline、inline-block和table-cell元素 / 多行文本）

``` css
div {
    display: table-cell;
    vertical-align: middle;
}
```

## 图片右侧文字垂直居中
``` html
<div class="box">
    <div class="box-img"></div>
    <span class="box-span">middle</span>
</div>
``` 

``` css
.box {
    background-color: #cacaca;
}

.box-img {
    display: inline-block;
    width: 100px;
    height: 100px;
    background-color: #000;
    vertical-align: middle;
 }

.box-span {
    vertical-align: middle;
}
```

> 常用水平垂直居中方法

### 绝对定位（父级position: relative）

__method1（div => width:200px, height: 100px）__

``` css
/*  or inline-block  */
div {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    margin: auto;
}
```
__method2（need't height and width）__

``` css
/*  or inline-block  */
div {
    position: absolute;
    left: 50%;
    top: 50%;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
}
```
__method3（div => width:200px, height: 100px）__

``` css
/*  or inline-block  */
div {
    position: absolute;
    left: 50%;
    top: 50%;
    margin-left: -100px;
    margin-top: -50px;
}
```
### display（need't height and width）

__method1__

``` html
<div class="box">
    <div class="box-child"></div>
</div>
``` 
``` css
/*  .box-child or inline-block/inline  */
.box {
    display: -webkit-box;
    -webkit-box-pack: center;
    -webkit-box-align: center;
}
```
__method2__
``` html
<div class="box">
    <div class="box-child"></div>
</div>
``` 
``` css
/*  .box-child or inline-block/inline  */
.box {
    display: flex;
    align-items: center;
    justify-content: center;
}
```

> 图片显示的一些处理

``` bash
'background-size: cover'使背景图扩展至足够大，覆盖背景区域。配合'background-position: center'可以让图片中心正常显示。
```
