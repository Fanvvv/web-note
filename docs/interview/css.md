# CSS3

## css选择器

| **选择器**     | **格式**      | **优先级权重** |
| -------------- | ------------- | -------------- |
| id选择器       | #id           | 100            |
| 类选择器       | .classname    | 10             |
| 属性选择器     | a[ref=“eee”]  | 10             |
| 伪类选择器     | li:last-child | 10             |
| 标签选择器     | div           | 1              |
| 伪元素选择器   | li::after     | 1              |
| 相邻兄弟选择器 | h1+p          | 0              |
| 子选择器       | ul>li         | 0              |
| 后代选择器     | li a          | 0              |
| 通配符选择器   | *             | 0              |

选择器的**优先级**：

- 标签选择器、伪元素选择器：1；
- 类选择器、伪类选择器、属性选择器：10；
- id 选择器：100；
- 内联样式：1000；

## css3有哪些更新

- 新增各种CSS选择器 （: not(.input)：所有 class 不是“input”的节点）
- 圆角 （border-radius:8px）
- 多列布局 （multi-column layout）
- 阴影和反射 （Shadoweflect）
- 文字特效 （text-shadow）
- 文字渲染 （Text-decoration）
- 线性渐变 （gradient）
- 旋转 （transform）
- 增加了旋转,缩放,定位,倾斜,动画,多背景

## 隐藏元素的方法有哪些

- **display: none**：渲染树不会包含该渲染对象，因此该元素不会在页面中占据位置，也不会响应绑定的监听事件。
- **visibility: hidden**：元素在页面中仍占据空间，但是不会响应绑定的监听事件。
- **opacity: 0**：将元素的透明度设置为 0，以此来实现元素的隐藏。元素在页面中仍然占据空间，并且能够响应元素绑定的监听事件。
- **position: absolute**：通过使用绝对定位将元素移除可视区域内，以此来实现元素的隐藏。
- **z-index: 负值**：来使其他元素遮盖住该元素，以此来实现隐藏。
- **clip/clip-path** ：使用元素裁剪的方法来实现元素的隐藏，这种方法下，元素仍在页面中占据位置，但是不会响应绑定的监听事件。
- **transform: scale(0,0)**：将元素缩放为 0，来实现元素的隐藏。这种方法下，元素仍在页面中占据位置，但是不会响应绑定的监听事件。

## 对盒模型的理解

CSS3中的盒模型有以下两种：标准盒子模型、IE盒子模型（怪异盒模型）

盒模型都是由四个部分组成的，分别是margin、border、padding和content。

标准盒模型和IE盒模型的区别在于设置width和height时，所对应的范围不同：

- 标准盒模型的width和height属性的范围只包含了content，
- IE盒模型的width和height属性的范围包含了border、padding和content。

可以通过修改元素的box-sizing属性来改变元素的盒模型：

- `box-sizing: content-box`表示标准盒模型（默认值）
- `box-sizing: border-box`表示IE盒模型（怪异盒模型）

## 对BFC的理解

BFC是一个独立的布局环境，可以理解为一个容器，在这个容器中按照一定规则进行物品摆放，并且不会影响其它环境中的物品。如果一个元素符合触发BFC的条件，则BFC中的元素布局不受外部影响。

**创建BFC的条件：**

- 根元素：body；
- 元素设置浮动：float 除 none 以外的值；
- 元素设置绝对定位：position (absolute、fixed)；
- display 值为：inline-block、table-cell、table-caption、flex等；
- overflow 值为：hidden、auto、scroll；

**BFC的作用：**

- **解决margin的重叠问题**：由于BFC是一个独立的区域，内部的元素和外部的元素互不影响，将两个元素变为两个BFC，就解决了margin重叠的问题。
- **解决高度塌陷的问题**：在对子元素设置浮动后，父元素会发生高度塌陷，也就是父元素的高度变为0。解决这个问题，只需要把父元素变成一个BFC。常用的办法是给父元素设置`overflow:hidden`。
- **创建自适应两栏布局**：可以用来创建自适应两栏布局：左边的宽度固定，右边的宽度自适应。

## 重绘和回流

### 重绘

**重绘就是将渲染树节点转换为屏幕上的实际像素，不涉及重新布局阶段的位置与大小计算。** 如：`color`、`background-color`、`visibility` 等

### 回流

**触发条件：**

1. 页面一开始渲染的时候（无法避免）
2. 添加或删除可见的DOM元素
3. 元素的位置发生变化
4. 元素的尺寸发生变化（包括外边距、内边框、边框大小、高度和宽度等）
5. 内容发生变化（文本变化或图片被另一个不同尺寸的图片所替代等）
6. 浏览器的窗口尺寸变化（因为回流是根据视口的大小来计算元素的位置和大小的）

> **回流一定会触发重绘，而重绘不一定会回流**

## 居中对齐有哪些实现方式

1. 水平居中

- inline 元素：text-centent: center;
- block 元素：margin: 0 auto;
- absolute 元素：left: 50% + margin-left: 负值

2. 垂直居中

- inline 元素：line-height 的值等于 height 的值
- absolute 元素：top: 50% + margin-top: 负值
- absolute 元素：transform(-50%, -50%)
- absolute 元素：top,left,right,bottom = 0 + margin: auto

> 第一种和第二种需要知道盒子的大小，不知道盒子大小的时候，可以使用第三种和第四种

3. 水平垂直居中

- 利用绝对定位，先将元素的左上角通过top:50%和left:50%定位到页面的中心，然后再通过translate来调整元素的中心点到页面的中心。

```css
.parent {
    position: relative;
}
 
.child {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
}
```

- 利用绝对定位，设置四个方向的值都为0，并将margin设置为auto，由于宽高固定，因此对应方向实现平分，可以实现水平和垂直方向上的居中。

```css
.parent {
    position: relative;
}
 
.child {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
}
```

- 利用绝对定位，先将元素的左上角通过top:50%和left:50%定位到页面的中心，然后再通过margin负值来调整元素的中心点到页面的中心。

```css
.parent {
    position: relative;
}
 
.child {
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -50px;     /* 自身 height 的一半 */
    margin-left: -50px;    /* 自身 width 的一半 */
}
```

- 使用flex布局，通过align-items:center和justify-content:center设置容器的垂直和水平方向上为居中对齐，然后它的子元素也可以实现垂直和水平的居中。

```css
.parent {
    display: flex;
    justify-content:center;
    align-items:center;
}
```

## css预处理器有什么用

**预处理器，**如：`less`，`scss`，`stylus`，用来预编译`scss`或者`less`，增加了`css`代码的复用性。层级，`mixin`， 变量，循环， 函数等对编写以及开发UI组件都极为方便。

## 响应式设计的概念及基本原理

响应式网站设计`（Responsive Web design`）是一个网站能够兼容多个终端，而不是为每一个终端做一个特定的版本。

关于原理： 基本原理是通过媒体查询`（@media）`查询检测不同的设备屏幕尺寸做处理。

关于兼容： 页面头部必须有`meta`声明的`viewport`。

```html
<meta name="’viewport’" content="”width=device-width," initial-scale="1." maximum-scale="1,user-scalable=no”"/>
```

## css中的单位

相对长度单位。 其长度单位会随着它的参考值的变化而变化。

- px,像素
- em,元素的字体高度
- %,百分比
- rem,根元素的font-size
- vm,视窗宽度，1vw=视窗宽度的1%
- vh,视窗高度，1vh=视窗高度的1%

### rpx

**rpx 是微信小程序解决自适应屏幕尺寸的尺寸单位。微信小程序规定屏幕的宽度为750rpx。**

无论是在iPhone6上面还是其他机型上面都是750rpx的屏幕宽度，拿iPhone6来讲，屏幕宽度为375px，把它分为750rpx后， 1rpx = 0.5px = 1物理像素。

微信小程序也支持rem尺寸单位，rem和rpx的换算关系：rem: 规定屏幕宽度为20rem；1rem = (750/20)rpx 。