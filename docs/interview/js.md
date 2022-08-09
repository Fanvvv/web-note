# JS

## 数据类型

- 基本数据类型：Number、String、Boolean、Symbol、Null、Undefined、BigInt。存于栈中
- 引用数据类型：Object（Array、function）。存于堆中

## 检查数据类型的方法

- typeof
- constructor
- instanceof
- Object.prototype.toString.call()

## 判断数组的方式

- Object.prototye.toString.call()
- Array.isArray()
- 原型链的方式：obj.__proto\_\_  === Array.prototye
- instanceof
- Array.prototype.isPrototypeOf

## 判断一个对象是空对象

- JSON.stringify()
- Object.keys()

```js
// JSON.stringify()
JSON.stringify(obj) == '{}'

// Object.keys()
Object.keys(obj).length
```

## ES6+新特性

- let、const块级作用域
- 箭头函数
- 解构赋值
- 模板字符串
- 字符串扩展方法
- 参数默认值和剩余参数
- 展开运算符
- ES6 module
- Reflect
- Proxy
- Promise
- Set、WeakSet
- Map、WeakMap
- for...of...
- Generator生成器
- Object.value和Object.entries
- ......

## var、let和const区别

这三个最明显的区别是 var 声明的变量是全局或者整个函数块的，而 let、const 声明的变量是块级的变量，var 声明的变量存在变量提升，let、const 不存在，let 声明的变量允许重新赋值，const 不允许。

## 作用域

- 指变量的有效范围
- 有三种：
  - 全局作用域：最外层函数定义的变量拥有全局作用域，即对任何内部函数来说，都是可以访问的
  - 局部作用域：局部作用域一般只在固定的代码片段内可访问到，而对于函数外部是无法访问的，最常见的例如函数内部
  - 块级作用域： 凡是代码块就可以划分变量的作用域

## 箭头函数与普通函数的区别

- **箭头函数比普通函数更加简洁**
- **箭头函数没有自己的this**
- **箭头函数继承来的this指向永远不会改变**
- **call()、apply()、bind()等方法不能改变箭头函数中this的指向**

- **箭头函数不能作为构造函数使用**
- **箭头函数没有自己的arguments**
- **箭头函数没有prototype**
- **箭头函数不能用作Generator函数，不能使用yield关键字**

## 箭头函数的this指向哪里

箭头函数并没有属于⾃⼰的this，它所谓的this是捕获其所在上下⽂的 this 值，作为⾃⼰的 this 值，并且由于没有属于⾃⼰的this，所以是不会被new调⽤的，这个所谓的this也不会被改变。

可以用Babel来理解一下箭头函数

```js
// ES6
const obj = { 
  fn() { 
    return () => { 
      console.log(this === obj); 
    }; 
  } 
}

// ES5 Babel转义
var obj = { 
   fn: function fn() { 
     var _this = this; 
     return function () { 
        console.log(_this === obj); 
     }; 
   } 
};
```

## 箭头函数不适用场景

- 对象方法
- 对象原型
- 构造函数
- 动态上下文的回调函数

```js
const btn1 = document.getElementById('btn1')
btn1.addEventListener('click' () => {
    // 使用箭头函数，this指向window，而不是获取的按钮
    console.log(this === window) // true
    this.innerHTML = 'click me'
})
```

- Vue 的生命周期函数和 methods

## map和weakMap的区别

1. map。map本质上就是键值对的集合，但是普通的Object中的键值对中的键只能是字符串。实际上Map是一个数组，它的每一个数据也都是一个数组。

```js
const map = [
     ["name","张三"],
     ["age",18],
]
```

2. WeakMap。WeakMap 对象也是一组键值对的集合，其中的键是弱引用的。**其键必须是对象**，原始数据类型不能作为key值，而值可以是任意的。

> 一旦不再需要，WeakMap 里面的**键名对象和所对应的键值对会自动消失，不用手动删除引用**。

**总结：**

- Map 数据结构。它类似于对象，也是键值对的集合，但是“键”的范围不限于字符串，各种类型的值（包括对象）都可以当作键。
- WeakMap 结构与 Map 结构类似，也是用于生成键值对的集合。但是 WeakMap 只接受对象作为键名（ null 除外），不接受其他类型的值作为键名。而且 WeakMap 的键名所指向的对象，不计入垃圾回收机制。

## 数组有哪些原生方法

- 和字符串的转换方法：toString、toLocalString、join
- 尾部操作的方法：pop、push
- 首部操作的方法：shift、unshift
- 排序和反转方法：sort、reverse
- 连接方法：concat
- 截取方法：slice
- 插入方法：splice
- 索引方法：indexOf、lastIndexOf
- 迭代方法：every、some、fliter、map、forEach
- 归并方法：reduce、reduceRight

## 数组的遍历方法有哪些

| **方法**                  | **是否改变原数组** | **特点**                                                     |
| ------------------------- | ------------------ | ------------------------------------------------------------ |
| forEach()                 | 否                 | 数组方法，不改变原数组，但是可能会被callback函数改变，没有返回值 |
| map()                     | 否                 | 数组方法，不改变原数组，有返回值，可链式调用                 |
| filter()                  | 否                 | 数组方法，过滤数组，返回包含符合条件的元素的数组，可链式调用 |
| for...of                  | 否                 | for...of遍历具有Iterator迭代器的对象的属性，返回的是数组的元素、对象的属性值，不能遍历普通的obj对象，将异步循环变成同步循环 |
| every() 和 some()         | 否                 | 数组方法，some()只要有一个是true，便返回true；而every()只要有一个是false，便返回false. |
| find() 和 findIndex()     | 否                 | 数组方法，find()返回的是第一个符合条件的值；findIndex()返回的是第一个返回条件的值的索引值 |
| reduce() 和 reduceRight() | 否                 | 数组方法，reduce()对数组正序操作；reduceRight()对数组逆序操作 |

## 数组去重

- indexOf循环去重
- ES6 Set去重：Array.from(new Set(array))
- Object键值去重：数组的值存为Object的key，如Object[value] = true

## for...in和for...of的区别

- for…of 遍历获取的是对象的键值，for…in 获取的是对象的键名；
- for… in 会遍历对象的整个原型链，性能非常差不推荐使用，而 for…of 只遍历当前对象不会遍历原型链；
- 对于数组的遍历，for…in 会返回数组中所有可枚举的属性(包括原型链上可枚举的属性)，for…of 只返回数组的下标对应的属性值

> for...in 循环主要是为了遍历对象而生，不适用于遍历数组；for...of 循环可以用来遍历数组、类数组对象，字符串、Set、Map 以及 Generator 对象。

## for-await-of 有什么作用

- 用于遍历多个 Promise
- Promise.all 的替代品

```js
function createPromise(val) {
	return new Promise(res => {
        setTimeout(() => {
            res(val)
        }, 1000)
    })
}

(async function() {
    const p1 = createPromise(100)
    const p2 = createPromise(200)
    const p3 = createPromise(300)
    const list = [p1, p2, p3]
    // Promise.all
    Promise.all(list).then(res => console.log(res))
    // for await of
    for await(let res of list) {
        console.log(res)
    }
})()
```

- 应用场景：

> ​	如：用户批量上传图片，一个一个上传

## forEach和map方法有什么区别

相同点：循环数组每一项，且都有三个参数，分别是item、index、array，只是遍历数组，不会改变原数组

这些方法都是用来遍历数组的，两者区别如下：

- forEach()方法是将数组中的每一项作为回调函数的参数进行处理，对数据的操作会改变原数组，该方法没有返回值；
- map()方法不会改变原数组的值，返回一个新数组，新数组中的值为原数组调用函数处理之后的值；

## 原型和原型链

### 原型

所有引用类型都有一个\_\_proto\_\_属性，所有的函数都有一个prototype属性，所有引用类型的\_\_proto\_\_属性指向它构造函数的prototype属性

- 隐式原型：`__proto__`
- 显式原型：`prototype`

1、引用类型，都具有对象特性，即可自由扩展属性。

2、引用类型，都有一个隐式原型 `__proto__` 属性，属性值是一个普通的对象。

3、引用类型，隐式原型 `__proto__` 的属性值指向它的构造函数的显式原型 `prototype` 属性值。

4、当你试图得到一个对象的某个属性时，如果这个对象本身没有这个属性，那么它会去它的隐式原型 `__proto__`（也就是它的构造函数的显式原型 `prototype`）中寻找。

> 引用类型：Object、Array、Function、Date、RegExp

### 原型链

当访问一个对象的某个属性时，会先在这个对象本身属性上查找，如果没有找到，就会去它的\_\_proto\_\_属性上查找，即他的构造函数的prototype，如果还没找到就会继续找他的构造函数的prototype属性，这样一层一层向上查找就会形成一个链式结构，即原型链

实例对象 = new 构造函数

实例对象的隐式原型`__proto__` === 原型对象 === 构造函数的显式原型`prototype`

原型对象的构造器`constructor` === 构造函数 

例如：

```js
const arr = new Array()
arr.__proto__ === Array.prototype // true
arr.__proto__.constructor === Array // true
Array.__proto__ === Object.prototype // true
```

可以用 instanceof 来判断原型是否在原型链上

```js
arr instanceof Array // true
arr instanceof Object // true
```

> 原型链的终点是 null
>
> Object.prototype.__proto\_\_ === null

## 闭包

**闭包是指有权访问另一个函数作用域中变量的函数**

闭包就是能够读取其他函数内部变量的函数，或者子函数在外调用，子函数所在的父函数的作用域不会被释放。

本质上是在函数内部和函数外部搭建一座桥梁，让子函数可以访问父函数中的局部变量；

- 好处就是可以保护变量不受外界污染
- 缺点就是常驻内存，消耗性能，所以开发中很少使用闭包

## this

- 函数调用，this指向全局对象
- 对象方法调用，this指向这个所在的对象
- 构造器调用，函数用new调用时，函数执行前会新创建一个对象，this指向这个新创建的对象
- apply、call、bind调用，this指向所绑定的对象

## call() 和 apply()

- apply：第一个参数指定了函数体内 this 对象的指向，第二个参数为一个带下标的集合，这个集合可以为数组，也可以为类数组，apply 方法把这个集合中的元素作为参数传递给被调用的函数。
- call 传入的参数数量不固定，跟 apply 相同的是，第一个参数也是代表函数体内的 this 指向，从第二个参数开始往后，每个参数被依次传入函数。

## new 操作符具体过程

- 创建一个空对象
- 将函数的this指向给这个空对象
- 执行函数代码
- 返回该对象

## js 的继承

- **原型链继承**：让新实例的原型等于父实例
  - 可继承：实例的构造函数的属性，父类构造函数属性，以及父类原型的属性
  - 不可继承：父类实例的属性
- **借用构造函数继承**：使用 apply()和 call()方法将父类构造函数引入子类函数
  - 可继承：父类构造函数的属性
  - 不可继承父类原型的属性
- **组合继承**：将原型链和借用构造函数的技术组合在一块，从而发挥两者之长的一种继承模式
- **原型式继承**：借助原型可以基于已有的对象创建新对象，类似复制了一个对象
- **寄生式继承**：就是给原型式继承外面套个壳子，没用到原型
- **寄生组合式继承**：通过借用函数来继承属性，通过原型链的混成形式来继承方法（常用）

## 异步编程的实现

- 回调函数
- Promise
- async函数
- generator生成器

## Promise

Promise本身是**同步的立即执行函数**， 当在executor中执行resolve或者reject的时候, 此时是异步操作， 会先执行then/catch等，当主栈完成后，才会去调用resolve/reject中存放的方法执行，打印p的时候，是打印的返回结果，一个Promise实例。

- 异步编程的解决方案，用来解决回调地狱问题
- 有三种状态：pending(进行中)、fulfilled(已成功)和rejected(已失败)
- 基本用法是new Promise()传入一个函数，函数里面有两个参数，一个是resolve成功的回调，一个是reject失败的回调
- new出来的promise实例有三个方法：参数都是一个数组
  - all：如果数组里面所有promise都resolve就进入then方法，有一个reject就进入catch 
  - allSettled：在then方法中返回所有的promise数组结果，不管是成功的还是失败的
  - race：数组中的promise哪个先返回结果就使用哪个的结果

```js
console.log('script start')
let promise1 = new Promise(function (resolve) {
    console.log('promise1')
    resolve()
    console.log('promise1 end')
}).then(function () {
    console.log('promise2')
})
setTimeout(function(){
    console.log('settimeout')
})
console.log('script end')
// 输出顺序: script start->promise1->promise1 end->script end->promise2->settimeout
```

## await/async

async 函数返回一个 Promise 对象，当函数执行的时候，一旦遇到 await 就会先返回，等到触发的异步操作完成，再执行函数体内后面的语句。可以理解为，是让出了线程，跳出了 async 函数体。

- 是异步代码的新方式
- 基于promise实现的
- 使异步代码更像同步代码
- await 只能在async函数中使用，不能在普通函数中使用，要成对出现
- 默认返回一个promise实例，不能被改变
- await下面的代码是异步，后面的代码是同步的

```js
async function async1(){
   console.log('async1 start');
    await async2();
    console.log('async1 end')
}
async function async2(){
    console.log('async2')
}
console.log('script start');
async1();
console.log('script end')
// 输出顺序：script start->async1 start->async2->script end->async1 end
```

## 宏任务和微任务

- js是单线程的，但是分同步异步
- 微任务和宏任务皆为异步任务，它们都属于一个队列
- 宏任务一般是：script、setTimeout、setInterval、postMessage、MessageChannel、setImmediate(Node.js 环境)
- 微任务：Promise.then、Object.observe、MutationObserver、process.nextTick(Node.js 环境)
- 先执行同步再执行异步，异步遇到微任务，先执行微任务，执行完后如果没有微任务，就执行下一个宏任务，如果有微任务，就按顺序一个一个执行微任务

> 总结：微任务和宏任务的执行顺序是先执行同步任务，先执行同步后异步，异步分为宏任务和微任务两种，异步遇到微任务先执行微任务，执行完后如果没有微任务，就执行下一个宏任务。

## 垃圾回收机制（GC）

**垃圾回收**：JavaScript代码运行时，需要分配内存空间来储存变量和值。当变量不在参与运行时，就需要系统收回被占用的内存空间，这就是垃圾回收。

**回收方式**：

- 标记清除（现代）

遍历 window 对象，没有引用的就清除

- 引用计数（早期浏览器所使用的算法）

```js
// IE6-7 内存泄漏 bug
// 循环引用
var div1 = document.getElementById('div')
div1.a = div1
div.someBigData = {}
```

## 导致内存泄漏的情况

- 意外的全局变量
- 被遗忘的计时器或回调函数
- 脱离DOM的引用
- 闭包

## Set 和 Map 的区别

- set用于数据重组，成员不重复，一般用于数组去重，类似于数组，只有键值，没有键名，可以遍历
- map用于数据存储，是键值对的集合，可以遍历，可以跟各种数据格式转换

## 弱引用 WeakMap 和 WeakSet

1. WeakSet

- 只能存放对象类型，不能存放基本数据类型
- 对元素的引用是弱引用，如果没有其他引用对某个对象进行引用，那么GC可以对该对象进行回收
- 常见的方法：add、delete、has

2. WeakMap

- WeakMap的key只能使用对象，不接受其他的类型作为key
- WeakMap的key对对象想的引用是弱引用，如果没有其他引用引用这个对象，那么GC可以回收该对象
- 常见的方法：set、get、has、delete

> WeakSet 和 WeakMap 都不可以遍历

## ES6 Module和CommonJS的异同

区别：

- CommonJS是对模块的浅拷⻉，ES6 Module是对模块的引⽤，即ES6 Module只存只读，不能改变其值，也就是指针指向不能变，类似const；
- import的接⼝是read-only（只读状态），不能修改其变量值。 即不能修改其变量的指针指向，但可以改变变量内部指针指向，可以对commonJS对重新赋值（改变指针指向），但是对ES6 Module赋值会编译报错。 

共同点： 

- CommonJS和ES6 Module都可以对引⼊的对象进⾏赋值，即对对象内部属性的值进⾏改变。

## Webpack

- 定义：是一个打包模块化的工具，在webpack中一切文件皆为模块，通过loader转换文件，通过plugin注入钩子，最后输出由多个模块组合成的文件
- 作用：由于浏览器对于js中的很多代码不可以直接进行解析读取，这个时候需要先通过 wabpack 把资源进行打包，解析成浏览器可以识别的代码
- 配置：
  - 入口：指示webpack使用哪个模块作为构建其内部依赖图的开始，默认值是：‘./src/index.js’
  - 出口：告诉webpack在哪里输出它所创建的bundle，以及如何命名这些文件，主要输出文件的默认值是‘./dist/main.js’
  - mode：配置模式，development(开发环境)、production(生产环境)、none(不使用任何默认优化选项)
  - loader：自带能力，用于转换某些类型的模块
  - plugin：打包优化，资源管理，注入环境变量等
- 流程：
  - 初始化参数
  - 开始编译
  - 确定入口
  - 编译
  - 完成模块编译
  - 输出资源
  - 输出完成

## Webpack常见的Loader和Plugin

### Loader

因为webpack原生只能解析js文件，要打包其他文件的话，需要使用loader，Loader是**从右向左**指向的

- file-loader：把⽂件输出到⼀个⽂件夹中，在代码中通过相对 URL 去引⽤输出的⽂件 
- url-loader：和 file-loader 类似，但是能在⽂件很⼩的情况下以 base64 的⽅式把⽂件内容注⼊到代码中去 
- source-map-loader：加载额外的 Source Map ⽂件，以⽅便断点调试 
- image-loader：加载并且压缩图⽚⽂件 
- babel-loader：把 ES6 转换成 ES5 
- css-loader：加载 CSS，⽀持模块化、压缩、⽂件导⼊等特性 
- style-loader：把 CSS 代码注⼊到 JavaScript 中，通过 DOM 操作去加载 CSS。 
- eslint-loader：通过 ESLint 检查 JavaScript 代码 

### Plugin

插件，可以使webpack具有更多灵活性

- define-plugin：定义环境变量 
- html-webpack-plugin：简化html⽂件创建 
- uglifyjs-webpack-plugin：通过 UglifyES 压缩 ES6 代码 
- webpack-parallel-uglify-plugin: 多核压缩，提⾼压缩速度 
- webpack-bundle-analyzer: 可视化webpack输出⽂件的体积 
- mini-css-extract-plugin: CSS提取到单独的⽂件中，⽀持按需加载

## 常见的 HTTP 状态码

- **2xx**请求成功
- **3xx**重定向
- **4xx**客户端错误，一般是语法错误或者请求无法实现 --- 403 禁止访问 --- 404 找不到地址的匹配页面
- **5xx**服务器端错误

## 跨域

- 定义：浏览器执行脚本时会检查是否同源，只有同源才会执行，不同源即为跨域
- 这里的同源是指访问的协议、域名、端口都相同
- 解决办法

1. JSONP：通过动态创建 script，再请求一个带参网址实现跨域通信。

```html
<!-- 网页a -->
<script>
	window.onSuccess = function(data) {
        console.log(data)
    }
</script>
<script src="https://www.xxx.com/api/getData"></script>
```

```js
// https://www.xxx.com/api/getData 返回一段字符串
'onSuccess({ errno: 0, data: { /* 数据内容*/ } })'
```

2. document.domain + iframe 跨域
3. location.hash + iframe 跨域
4. window.name + iframe 跨域
5. postMessage 跨域
6. CORS：服务端设置 Access-Control-Allow-Origin 即可，前端无须设置，若要带 cookie 请求，前后端都需要设置。

```js
// 服务端
response.setHeader("Access-Control-Allow-Origin", "http://localhost:3000") // 或者 '*' 允许所有
response.setHeader("Access-Control-Allow-Headers", "X-Requested-With")
response.setHeader("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS")
response.setHeader("Access-Control-Allow-Credentials", "true") // 允许跨域接收 cookie
```

7. 代理跨域：启一个代理服务器，实现数据的转发，如基于webpack中的webpack.config.js文件中在devServer对象中配置通过proxy

## http跨域时为什么要发送options请求

- options请求，是跨域请求之前的预检查
- 浏览器自行发起的，无需我们干预
- 不会影响实际的功能

## 实现一个Ajax请求

- 创建一个XMLHttpRequest对象
- 调用这个对象的open()方法,规定请求方式和请求地址
- 设置一个请求头（post请求）
- 设置请求成功后要调用的回调函数
- 调用这个对象的send()方法,完成发送

```js
// 简易实现
const ajax = function(url, cb) {
    const xhr = new XMLHttpRequest()
    xhr.open('get', url, false)
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                cb(xhr.responseText)
            }
        }
    }
    xhr.send(null)
}
```

## ajax、axios、fetch的区别

### 从不同维度上

- Ajax 是一种技术统称
- Fetch 是一个具体的 API
- Axios 是一个第三方库

### ajax

缺点：

- 本身是针对MVC编程，不符合前端MVVM的浪潮
- 基于原生XHR开发，XHR本身的架构不清晰
- 不符合关注分离（Separation of Concerns）的原则
- 配置和调用方式非常混乱，而且基于事件的异步模型不友好。

### fetch

**fetch不是ajax的进一步封装，而是原生js，没有使用XMLHttpRequest对象**。

fetch的优点：

- 语法简洁，更加语义化
- 基于标准 Promise 实现，支持 async/await
- 更加底层，提供的API丰富（request, response）
- 脱离了XHR，是ES规范里新的实现方式

fetch的缺点：

- fetch只对网络请求报错，对400，500都当做成功的请求，服务器返回 400，500 错误码时并不会 reject，只有网络错误这些导致请求不能完成时，fetch 才会被 reject。
- fetch默认不会带cookie，需要添加配置项： fetch(url, {credentials: 'include'})
- fetch不支持abort，不支持超时控制，使用setTimeout及Promise.reject的实现的超时控制并不能阻止请求过程继续在后台运行，造成了流量的浪费
- fetch没有办法原生监测请求的进度，而XHR可以

### axios

Axios 是一种基于Promise封装的HTTP客户端，其特点如下：

- 浏览器端发起XMLHttpRequests请求
- node端发起http请求
- 支持Promise API
- 监听请求和返回
- 对请求和返回进行转化
- 取消请求
- 自动转换json数据
- 客户端支持抵御XSRF攻击

### 用法

1. ajax

```js
const ajax = function(url, cb) {
    const xhr = new XMLHttpRequest()
    xhr.open('get', url, false)
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                cb(xhr.responseText)
            }
        }
    }
    xhr.send(null)
}
```

2. fetch

```js
const fetch = function(url) {
    return fetch(url).then(res => res.json())
}
```

## axios拦截器

- 作用：
  - Axios 是一个基于 promise 的 HTTP 库，支持promise所有的API
  - 可以拦截请求和响应
  - 可以转换请求数据和响应数据，并对响应回来的内容自动转换成 JSON类型的数据
  - 安全性更高
- 相关配置：
  - url：请求的服务器地址
  - method：请求方法
  - baseURL：基准路径
  - headers：请求头
  - parmas：路径参数
- 做了什么：
  - 请求拦截器：
    - 在请求发送前进行的操作，如：每个请求体里加上token
  - 响应拦截器：
    - 接收到响应后进行的操作，如：服务器返回的登录状态失效，就跳转到登录页

## token 失效处理

- 第一种方案是：服务器端保存token状态，用户每次操作都会自动推迟token的过期时间，session就是采用这种策略保持token的有效期，但是当前后端分离，单页面的时候，每秒钟的请求发起多次，每次都去刷新一下过期时间会非常消耗性能的；
- 第二种方案：使用refresh token，避免频繁的刷新token，此时服务端只要在token过期的时候反馈给前端，前端使用refresh token申请一个全新的token继续使用即可

## 事件对象和事件委托

- 事件对象：
  - 一个函数或者方法都会带有一个事件对象参数
  - 事件对象.target是获取最先触发的元素
  - 事件对象有两种公共的方法：
    - .preventDefault() 阻止默认行为
    - .stopPropagation()阻止冒泡
- 事件委托：
  - 可以把事件处理器添加到一个上级元素上，避免把事件处理器添加到多个子元素上，提高性能
  - 还可以预测未来，动态添加的元素仍然可以触发该事件
  - 主要依靠的就是事件冒泡，也就是当一个元素接收到事件的时候，会把他接收到的事件传给自己的父级，一直到window

## 深拷贝和浅拷贝

- **浅拷贝**：将值复制一份，如果是基本类型数据就拷贝的就是基本类型的值，互不影响，但是如果有引用类型的数据则拷贝的是其地址，改变一个，另一个随之改变；可以用展开运算符进行浅拷贝
  - Object.assign()
  - Array.prototype.concat()
  - Array.prototype.slice()
  - 扩展运算符
- **深拷贝**：就是内存中开辟一块新地址，完整拷贝一份到新地址中，如果修改一个另一个则不会受到影响；可以用递归的方式进行深拷贝，如果只是一些字符串或者数字类的，可以用JSON的方式进行转换
  - JSON.parse(JSON.stringify())

```js
// 手写深拷贝
const obj = {}
const clone = (target) => {
    if (typeof target !== 'object') return target
    const cloneTarget = Array.isArray(target) ? [] : {}
    for (const key in target) {
        cloneTarget[key] = clone(target[key])
    }
    return cloneTarget
}
```

## 防抖和节流

- **防抖**是合并成一次进行，通过一个计时器来控制，如果在规定时间内再次触发，则取消之前的计时器重新计时，类似于游戏中的回城事件
- **节流**是不管触发事件多么频繁，只有在规定时间后才可触发第二次，类似于游戏中的大招技能释放，一般搜索框会做节流事件，减少请求次数，优化性能

### 区别

- 防抖：限制执行次数，多次密集的触发只执行一次
- 节流：限制执行频率，有节奏的执行
- 节流关注“过程”，防抖关注“结果”

### 实现

- 防抖

```js
const debounce = (fn, delay = 100) => {
    let timer = 0
    return function() {
        if (timer) clearTimeout(timer)
        timer = setTimeout(() => {
            fn.apply(this, argments)
            timer = 0
        }, delay)
    }
}
```

- 节流

```js
const throttle = function(fn, delay = 100) {
    let timer = 0
    return function() {
        if (timer) return
        timer = setTimeout(() => {
            fn.apply(this, argments)
            timer = 0
        }, delay)
    }
}
```

### 使用场景

- 防抖
  - 搜索框
  - resize，不断调整窗口大小
  - ...
- 节流
  - 拖拽
  - 鼠标不断点击触发
  - 监听滚动
  - ...

## 强缓存和协商缓存的区别

### 强缓存

使用强缓存策略时，如果缓存资源有效，则直接使用缓存资源，不必再向服务器发起请求

强缓存策略可以通过两种方式来设置，分别是 http 头信息中的 Expires 属性和 Cache-Control 属性

![image-20220809182432842](https://raw.githubusercontent.com/Fanvvv/picBed/master/image-20220809182432842.png)

![image-20220809182540502](https://raw.githubusercontent.com/Fanvvv/picBed/master/image-20220809182540502.png)

`Cache-Control` 常用的两个字段：

- `max-age=`：设置缓存的最大有效期，单位为秒
- `no-cache`：设置了该字段需要先和服务端确认返回的资源是否发生了变化，如果资源未发生变化，则直接使用缓存好的资源；

Cache-Control 中的 **no-cache 和 no-store** 对比

- no-cache 是指先要和服务器确认是否有资源更新，在进行判断。也就是说没有强缓存，但是会有协商缓存；
- no-store 是指不使用任何缓存，每次请求都直接从服务器获取资源。

### 协商缓存

如果命中强制缓存，我们无需发起新的请求，直接使用缓存内容，如果没有命中强制缓存，如果设置了协商缓存，这个时候协商缓存就会发挥作用了。

![image-20220809182624961](https://raw.githubusercontent.com/Fanvvv/picBed/master/image-20220809182624961.png)

![image-20220809182324478](https://raw.githubusercontent.com/Fanvvv/picBed/master/image-20220809182324478.png)

使用协商缓存策略时，会先向服务器发送一个请求，如果资源没有发生修改，则返回一个 304 状态，让浏览器使用本地的缓存副本。如果资源发生了修改，则返回修改后的资源。

协商缓存也可以通过两种方式来设置，分别是 http 头信息中的 **Etag** 和 **Last-Modified** 属性。

当 Last-Modified 和 Etag 属性同时出现的时候，Etag 的优先级更高。使用协商缓存的时候，服务器需要考虑负载平衡的问题，因此多个服务器上资源的 Last-Modified 应该保持一致，因为每个服务器上 Etag 的值都不一样，因此在考虑负载平衡时，最好不要设置 Etag 属性。

> 总结：强缓存策略和协商缓存策略在缓存命中时都会直接使用本地的缓存副本，区别只在于协商缓存会向服务器发送一次请求。它们缓存不命中时，都会向服务器发送请求来获取资源。在实际的缓存机制中，强缓存策略和协商缓存策略是一起合作使用的。浏览器首先会根据请求的信息判断，强缓存是否命中，如果命中则直接使用资源。如果不命中则根据头信息向服务器发起请求，使用协商缓存，如果协商缓存命中的话，则服务器不返回资源，浏览器直接使用本地资源的副本，如果协商缓存不命中，则服务器返回最新的资源给浏览器。