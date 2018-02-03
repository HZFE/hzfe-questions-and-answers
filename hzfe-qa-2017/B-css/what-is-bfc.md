# 块格式化上下文 (BFC)

`BFC` 包含创建它的元素内的所有内容。

BFC对于`定位`与`清除浮动`很重要。定位和清除浮动的样式规则只适用于处于同一BFC内的元素。浮动不会影响其它BFC中元素的布局，并且清除浮动只能清除同一BFC中在它前面的元素的浮动。`Margin collapsing` 也只发生在属于同一BFC内的块级元素之间。

A BFC is created by one of the following:

- 根元素，或其它包含它的元素

- 块元素 ( `overflow` 值不为 `visible` )
- 内联块元素 (`display` 值为 `inline-block` )
- 浮动元素 ( `float` 值不为 `none` )
- 绝对定位元素 (`position` 值为 `absolute` 或 `fixed` )

- 弹性元素 ( 其父级元素设置了 `display` 值为 `flex` 或 `inline-flex` )
- 网格元素 ( 其父级元素设置了 `display` 值为 `grid` 或 `inline-grid` )
- 多列容器 (元素的 `column-count` 或 `column-width` 值不为 `auto`， 包括 `column-count: 1` 的元素)

- 表格单元格元素 (HTML表格单元格，或者 `display` 值为 `table-cell` )
- 表格标题元素 (HTML表格标题，或者 `display` 值为 `table-caption` )
- 匿名表格元素 (`display` 值为 `table` | `table-row` | `table-row-group` | `table-header-group` | `table-footer-group` (分别是HTML tables | table rows, table bodies, table headers and table footers的默认属性)，或 `inline-table`)

- `display` 值为 `flow-root`
- `contain` 值为 `layout` | `content` | `strict`
- `column-span` 值为 `all` (即便具有 `column-span: all` 的元素没有被包裹在一个多列容器中，也始终会创建一个新的BFC)

## 参考资料
[BFC](https://developer.mozilla.org/zh-CN/docs/Web/Guide/CSS/Block_formatting_context)

[理解CSS中BFC](http://www.w3cplus.com/css/understanding-block-formatting-contexts-in-css.html)