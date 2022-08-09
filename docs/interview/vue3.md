# Vue3

## vue2和vue3的区别

- 重新构建了响应式，使用 proxy 替换了Object.defineProperty
- 使用reactive就可以直接监听数组和对象类型的变化
- 采用了组合式API，而vue2是选项式API
- 重构了虚拟DOM
- 直接实现对象属性的增加和删除
- 模板编译时会把一些静态的节点转换为常量
- 监听的目标为对象本身，不需要像vue2采用Object.definePriperty遍历每一个属性，有一定的性能优化

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