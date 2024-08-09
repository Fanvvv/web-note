# 高阶编程技巧

利用闭包的机制，实现出来的一些高阶编程方式

- 模块化思想
- 惰性函数
- 柯里化函数

- - 高阶组件 -> React
  - 函数防抖节流
  - bind
  - ......

- compose组合函数

## 模块化思想：

:::tip 演变

单例 -> AMD(require.js) -> CMD(sea.js) -> CommonJS(Node) -> ES6Module

:::

从一个例子中来学习，比如我们要实现两个板块，一个天气板块，一个资讯板块。

### 无模块化思想

没有模块化思想之前，团队协作开发或者代码量较多的情况下，会导致全局变量污染（全局变量冲突）

两个板块中都有 `changeCity` 函数，会导致函数覆盖

```javascript
// 天气板块
const time = '2024-04-01'
function queryData() {
  
}
function changeCity() {
  
}
// 资讯板块
const time = '2023-12-12'
function changeCity() {
  
}
```

### 闭包

暂时基于闭包的"保护作用"防止全局变量的污染，但是因为每个板块的代码都是私有的，无法相互调用

```javascript
// 利用自执行函数实现闭包
(function () {
  const time = '2024-04-01'
  function queryData() {}
  function changeCity() {}
})()

(function () {
  const time = '2023-12-12'
  function changeCity() {}
})()
```

### 闭包且能相互调用

基于某些方法去实现相互调用：

- window
- ......

```javascript
(function () {
  const time = '2024-04-01'
  function queryData() {}
  function changeCity() {}
  // 把需要供别人调用的API方法，挂载到全局上（不能挂载太多，挂载多了，还是会引发全局变量的污染）
  window.queryData = queryData
})()

(function () {
  const time = '2023-12-12'
  function changeCity() {}
  queryData()
})()
```

### 对象

对象的特点：每一个对象都是一个单独的堆内存空间（单独的实例 -> Object），这样即使多个对象中的成员名称相同，也互不影响

```javascript
const obj1 = {
  name: 'fan',
  age: '18',
  fn: function() {}
}
const obj2 = {
  name: 'fanfan',
  age: '20',
  fn: function() {}
}
```

仿照其他后台语言，其实obj1/obj2不仅仅称为对象名，更被称为"命名空间(给堆内存空间起一个名字)"

每一个对象都是一个单独的实例，用来管理自己的私有信息，即使名字相同，也互不影响，其实这就是"JS中的单例设计模式"

### 高级单例设计模式

**闭包 + 单例**的结合，也是最早期的 JS 模块化思想，react hooks就是利用这种思想

```javascript
const weatherModule = (function () {
  const time = '2024-04-01'
  function queryData() {}
  function changeCity() {}
  return {
    queryData,
    changeCity
  }
})()
const infoModule = (function () {
  const time = '2023-12-12'
  function changeCity() {}
  weatherModule.queryData()
  return {
    changeCity
  }
})()
```

## 惰性函数

通过一个例子来学习惰性函数：

window.getComputedStyle(元素)：这个API用于获取当前元素经过浏览器计算的样式（返回样式对象）

它在IE6~8中，是不兼容的，需要使用 `元素.currentStyle` 来获取

`'getComputedStyle' in window`等价于 `window.getComputedStyle`，"属性 in 对象" 检测当前对象是否有这个属性，有返回true，反之false

```javascript
/**
 * element: 元素
 * attr: 属性名
 */
function getCss(element, attr) {
  if ('getComputedStyle' in window) {
    return window.getComputedStyle(element)[attr]
  }
  return element.currentStyle[attr]
}

const body = document.body
console.log(getCss(body, 'height'))
```

这样写函数，我们在同一个浏览器，同一个页面的情况下，执行这个函数，每执行一次，就会判断浏览器是否兼容（ window 上是否有 getComputedStyle 这个方法），浏览器和页面不改变的情况下，我们不需要再进行重复判断，我们可以用惰性思想来优化它。

### 优化

优化思想：第一次执行 getCss 我们已经知晓是否兼容了，第二次及以后再执行 getCss，则不想再处理兼容的校验了，其实这种思想就是"惰性思想"，（懒，干一次可以搞定的，绝对不会做第二次）

```javascript
function getCss(element, attr) {
  // 第一次执行，根据是否兼容，实现函数的重构
  if ('getComputedStyle' in window) {
    getCss = function(element, attr) {
      return window.getComputedStyle(element)[attr]
    }
  } else {
    getCss = function(element, attr) {
      return element.currentStyle[attr]
    }
  }
  // 为了保证第一次也可以获取信息，则需要把重构的函数执行一次
  return getCss(element, attr)
}
```

## 函数柯里化

预先处理的思想（形成一个不被释放的闭包，把一些信息存储起来，以后基于作用域链，访问到事先存储的信息，然后进行相关的处理，所有符合这种模式（或者闭包应用的）都被称为柯里化函数）

有一个需求如下：

```javascript
const curing = (x) => {
  // ...something
}
const sum = curing(10)
console.log(sum(20)) // 30
console.log(sum(30, 40)) // 80
```

实现：

```java
const curing = (x) => {
    return function(...args) {
        // 第一种
        // let total = x
        // args.forEach(item => {
        //     total += item
        // })
        // return total
        
        // 第二种
        args.unshift(x)
        return args.reduce((result, item) => result + item)
    }
}
```

### 手写 reduce

```javascript
Array.prototype.reduce = function(callback, initial) {
  var self = this, i = 0
  if (type callback !== 'function') throw new TypeError('callback must be a function')
  if (type initial === 'undefined') {
    initial = self[1]
    i = 1
  }

  for (; i < self.length; i++) {
    var item = self[i], index = i
    initial = callback(initial, item, index)
  }

  return initial
}
```

## compose 函数

在函数式编程当中有一个很重要的概念就是函数组合，实际上就是把处理数据的函数像管道一样连接起来，然后让数据穿过管道得到最终的结果。例如：

```javascript
const add1 = (x) => x + 1
const mul3= (x) => x * 3
const div2 = (x) => x / 2
div2(mul3(add1(add1(0)))) // 3
```

而这样的写法可读性明显太差了，我们可以构建一个`compose`函数，它接受任意多个函数作为参数（这些函数都只接受一个参数），然后`compose`返回的也是一个函数，达到以下的效果：

```javascript
const operate = compose(div2, mul3, add1, add1)
operate(0) // 相当于 div2(mul3(add1(add1(0))))
operate(2) // 相当于 div2(mul3(add1(add1(2))))
```

简而言之：`compose`可以把类似于`f(g(h(x)))`这种写法简化成`compose(f, g, h)(x)`

实现：

```javascript
function compose(...funcs) {
  return function(x) {
    if (funcs.length === 0) return x
    if (funcs.length === 1) return typeof funcs[0] === 'function' ? funcs[0](x) : x
    return funcs.reduceRight((result, item) => {
      return typeof item === 'function' ? item(result) : result
    }, x)
  }
}
```

funcs：存储的是最后需要执行的函数及其顺序（最后传递的函数优先执行）

- 执行`compose`只是把最后要执行的函数及顺序事先存储起来，函数还没有执行（柯理化思想）
- 返回一个`operate`处理函数，执行`operate`，并且传递初始值，才按照之前存储的函数及顺序依次执行函数

### redux 中 compose 函数的实现

```javascript
function compose(...funcs) {
  if (funcs.length === 0) {
    return arg => arg
  }

  if (funcs.length === 1) {
    return funcs[0]
  }

  return funcs.reduce((a, b) => (...args) => a(b(...args)))
}
```