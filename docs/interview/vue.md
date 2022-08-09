# Vue2

## Vue2 数据双向绑定的原理

Vue是结合发布者-订阅者模式，通过 Object.defineProperty()为各个属性定义get、set特性方法，在数据发生改变时给订阅者发布消息，触发相应的监听回调，更新dom

## Vue2 生命周期

-  beforeCreate：数据未加载，dom元素未创建
-  create：数据已经加载完毕，但是dom元素还是没有创建
-  beforeMount：组件实例还没有挂载
-  mounted：组件已经挂载，而且dom元素已经创建
-  beforeUpdate 组件更新之前
-  update：组件更新完毕
-  beforeDestroy：组件销毁前
-  destroy：组件已经被销毁了

当页面第一次页面加载时会触发 beforeCreate, created, beforeMount, mounted 这几个钩子函数

## Vue2 组件通信

- props、$emit
- ref、refs
- $parent、$children
- $attrs、$listeners
- provide、inject
- 事件总线 event bus
- vuex

分类：

- 父子：props、$children、refs
- 子父：$emit、$parent
- 兄弟：事件总线、$on
- 祖孙：provide、inject
- 跨组件：$attrs、$listeners

## Vue 常用的指令及其作用

- v-modal：数据双向绑定
- v-for：循环遍历
- v-show：内容显示
- v-hide：内容隐藏
- v-if：
  - 显示或隐藏
  - 条件判断
- v-bind：动态绑定(:)
- v-on：绑定事件(@)
- v-text：解析文本
- v-html：解析HTML标签

## 自定义指令的使用以及生命周期/钩子函数

- 分类：全局自定义指令，局部自定义指令

- **全局自定义指令**：

```js
Vue.directive('指令名', {
  // 当被绑定的元素插入到 DOM 中时……
  inserted: function (el) {
     // 操作
  }
})
```

- **局部自定义指令**：

```js
directives: {
  指令名: {
    // 指令的定义
    inserted: function (el) {
       // 操作
    }
  }
}
```

- 生命周期/钩子函数：
  - inserted：被绑定元素插入父节点时调用
  - bind：只调用一次，指令第一次被绑定到元素时
  - update：元素本身更新时触发
  - componentUpdate：组件和子组件更新时触发
  - unbind：指令被移除时触发
- 每个钩子函数中都有el和binding参数，而componentUpdate钩子中还暴露一个oldVal，用以区分旧值和新值
  - el：绑定元素
  - binding：是一个参数对象，一般我们会用到其中的value值，用于src的属性值

## v-model 的实现原理

- 以value和input值为例，其实是:value和@input的语法糖
- :value是绑定了数据，@input是监听输入框值的变化，然后改变值
- 总的来说就是绑定数据并且监听数据改变
- 内部为不用的输入元素使用不用的属性并抛出不同的事件：
  - text和textarea使用value属性和input事件
  - checkbox使用checked和change事件
  - select将value作为props并将change作为事件

## v-show 和 v-if 指令的共同点和不同点

- 相同点：
  - 都是控制内容的显示和隐藏
- 不同点：
  - v-show：
    - 设置css属性中的display为none
    - 会编译，只是初始值为false，所以将display设置为none
    - 只编译一次，性能好一些
    - 适用于频繁切换某节点时，切换性能消耗小，但是初始性能消耗大
  - v-if：
    - dom树中添加或删除dom元素
    - 如果初始值为false时不会编译
    - 不停的创建和销毁，性能差一点
    - 初始渲染开销小，但是切换开销大

## watch 和 computed 的区别

- computed：
  - 支持缓存，数据发生改变时才会重新计算
  - 不支持异步操作
  - 当其属性值为函数时，默认是get方法，函数返回值就是属性的属性值
  - 在computed中，属性都有一个get和set方法，当数据变化时调用set方法
- watch：
  - 不支持缓存，数据变，直接触发相应的操作
  - 支持异步操作
  - 监听的数据是data中定义或者props传递的数据
  - 需要深度监听或者立即触发的时候就需要将函数转变成一个对象，为其添加deep:true深度监听或immediate：true立即监听，此时监听的函数写法是：handler(){ }
  - 监听的对象可以是字符串

## Vuex属性

- **state**：定义需要管理的数据
- **getters**：state派生出来的数据，相当于state的计算属性
- **mutation**：里面定义的是同步的更新数据方法，每个方法里都有两个参数，一个是state，一个是payload，通过store.commit调用
- **action**：里面定义的是异步的方法，每个方法里面有两个参数，一个是store，一个是payload，通过store.dispatch调用，在actions里也可以提交mutation，通过store.commit
- **module**：将vuex模块化，可以让每一个模块拥有自己的state、mutation、action、getters，结构清晰，方便管理

## 路由懒加载

- 路由懒加载也叫延迟加载，即在需要的时候进行加载，随用随载
- 出现的原因：
  - 单页面应用如果没有用懒加载则webpack打包后文件很大
  - 进入首页的时候需要加载的内容过多，出现白屏现象，不利于用户体验
- 实现方法：
  - 配置异步组件：()=> import(“vue页面路径”)

## 路由模式

- hash模式：
  - 浏览器中符号是“#”，\#以及#后面的字符称之为 hash，又叫前端路由
  - 用 window.location.hash 读取
  - hash 虽然在 URL 中，但不被包括在 HTTP 请求中
  - hash 改变会触发 hashchange 事件
  - hash发生变化的url都会被浏览器记录下来，从而浏览器的前进后退都可以用
- history模式：
  - history 采用 HTML5 的新特性
  - history 模式不仅可以在url里放参数，还可以将数据存放在一个特定的对象中
  - 它也有个问题：不怕前进，不怕后退，就怕刷新（如果后端没有准备的话，会分分钟刷出一个404来），因为刷新是实实在在地去请求服务器的

## 路由之间跳转方式

四种方式：

- router-link搭配 to 属性，在模板中使用
- push() 跳转到指定页面
- replace() 跳转到指定页面，但是没有历史记录跳不回去
- go(N) N可以为正数也可以为负数，正数是向前跳转，负数是向后跳转

## 路由传参的方式

- 编程式的导航router.push：

  - 字符串：

    - 直接传递路由地址，但是不能传递参数

      this.$router.push("home")

  - 对象：

    - 命名路由：这种方式传递参数，目标页面刷新会报错

      this.$router.push({name:"news",params:{userId:123})

    - 查询参数：和 name 配对的式 params，和 path 配对的是 query

      this.$router.push({path:"/news',query:{uersId:123})

    - 接收参数：this.$route.query

- 声明式的导航：

  - 字符串：<router-link to:"news">\</router-link>
  - 命名路由：<router-link :to:"{name:'news',params:{userid:1111}}">\</route-link>
  - 查询参数：\<router-link :to="{path:'/news',query:{userId:1111}}">\</router-link>

## vue-router 动态路由

- 场景：把某种模式匹配到的所有路由，全都映射到同个组件
- 解决办法：以在 vue-router 的路由路径中使用动态路径参数
  - 使用   ：开头
  - 在路径中最后使用 ？传参

## 如何封装组件

- **原因**：封装组件可以提升项目开发效率，把页面抽象成多个相对独立的模块，复用性高
- **步骤**：
  - 创建一个组件
  - Vue.component 注册组件
  - 子组件需要数据，可以在 props 中接受定义
  - 而子组件修改好数据后，想把数据传递给父组件，可以采用 emit 方法

## 页面优化

- v-if和v-for不能连用
- 更多的情况下，使用v-if代替v-show
- 要保证key值的唯一
- 使用组件懒加载或者图片懒加载
- 防抖和节流的使用
- 模块按需导入
- 打包优化
- 使用cdn加载第三方模块
- 缓存常用信息
- 精灵图，base64

## 动态组件

- 定义：多个组件使用同一个挂载点，并动态切换

- 使用：\<component :is="componentName">\</component>，当控制 componentName 改变时就可以动态切换选择组件