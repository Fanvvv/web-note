# Vue3

## vue2和vue3的区别

- 重新构建了响应式，使用 proxy 替换了Object.defineProperty
- 使用reactive就可以直接监听数组和对象类型的变化
- 采用了组合式API，而vue2是选项式API
- 重构了虚拟DOM
- 直接实现对象属性的增加和删除
- 模板编译时会把一些静态的节点转换为常量
- 监听的目标为对象本身，不需要像vue2采用Object.definePriperty遍历每一个属性，有一定的性能优化

### 从 API 特性方面

1. `Composition API`
2. `setup` 语法糖
3. `Teleport` 传送门
4. `Fragments` 支持多根节点
5. `SFC CSS` 变量，支持 `v-bind` 绑定 css 变量

### 从框架设计层面

1. 代码打包体积更小了
2. 响应式的优化，用 `Proxy` 代替 `Object.defineProperty`
3. 虚拟 DOM 的优化：`静态提升`、添加`更新类型标记`
4. Diff 算法的优化：使用 `最长递增子序列` 优化了对比流程

### 其他方面

1. `Vue3` 不兼容 `IE11`，因为`IE11`不兼容`Proxy`
2. `v-if`的优先级高于`v-for`
3. `vue3`中`v-model`可以以`v-model:xxx`的形式使用多次，而`vue2`中只能使用一次；多次绑定需要使用`sync`
4. `vue3` 能更好的与 `TS` 结合

## vue3 生命周期函数

除了`beforecate`和`created`(它们被`setup`方法本身所取代)

- `onBeforeMount` – 在挂载开始之前被调用：相关的 `render` 函数首次被调用。
- `onMounted` – 组件挂载时调用
- `onBeforeUpdate` – 数据更新时调用，发生在虚拟 DOM 打补丁之前。这里适合在更新之前访问现有的 DOM，比如手动移除已添加的事件监听器。
- `onUpdated` – 由于数据更改导致的虚拟 DOM 重新渲染和打补丁，在这之后会调用该钩子。
- onBeforeUnmount – 在卸载组件实例之前调用。在这个阶段，实例仍然是完全正常的。
- `onUnmounted` – 卸载组件实例后调用。调用此钩子时，组件实例的所有指令都被解除绑定，所有事件侦听器都被移除，所有子组件实例被卸载。
- `onActivated` – 被 `keep-alive` 缓存的组件激活时调用。
- `onDeactivated` – 被 `keep-alive` 缓存的组件停用时调用。
- `onErrorCaptured` – 当捕获一个来自子孙组件的错误时被调用。此钩子会收到三个参数：错误对象、发生错误的组件实例以及一个包含错误来源信息的字符串。此钩子可以返回 `false` 以阻止该错误继续向上传播。

### 跟vue2相比

- `beforeCreate` -> 使用 `setup()`
- `created` -> 使用 `setup()`
- `beforeMount` -> `onBeforeMount`
- `mounted` -> `onMounted`
- `beforeUpdate` -> `onBeforeUpdate`
- `updated` -> `onUpdated`
- `beforeDestroy` -> `onBeforeUnmount`
- `destroyed` -> `onUnmounted`
- `errorCaptured` -> `onErrorCaptured`·····

## Vue3 组件通信

1. Props

2. emits

3. expose / ref

4. $attrs 子组件多根节点的话，可以使用 v-bind 来绑定

5. v-model，vue3 可以绑定多个，比如：

   ```vue
   <Child v-model:msg1="message1" v-model:msg2="message2" />
   ```

6. provide / inject

7. 事件总线 eventBus： `$on` 注册事件，`$emit` 调用事件，`$off` 销毁事件

8. vuex

## Vue2 和 Vue3 中 v-model 的区别

