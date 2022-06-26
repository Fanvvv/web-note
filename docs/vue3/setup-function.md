# Vue3 的 setup 函数

vue3 使用的是 Composition API，而 Composition API 带来了 setup 函数，它是 Composition API 的入口。

setup 其实就是组件的另外一个选项，只不过我们可以用它来代替之前所编写的大部分其他选项，比如：methods、computed、watch、data、生命周期等等。

通过 setup 的参数和返回值来认识它

## setup 函数的参数

setup 可以传入两个参数：

1. 第一个参数：props
2. 第二个参数：context

> 项目中使用了 ts，如果要对传递的参数做类型推断，需要使用 defineComponent

### 1. props

在 vue2 中我们就认识了它，它其实就是父组件传递过来的属性，这些属性会放到 props 对象中，当我们需要在 setup 函数中使用这些属性时，就可以通过 props 参数来获取，它是一个响应式对象。

1. 对 props 类型的定义，是和 vue2 一样，在 props 选项中定义

2. 在 options API 中，我们使用 props 对象，需要通过 this.$props 来获取

3. 在 setup 中，因为它是通过参数传递到 setup 中的，所以可以直接使用它

> 它是响应式的，不能使用解构赋值对它进行解构，这样会使它的属性失去响应式
>
> 如果需要解构的话，vue3 提供了 toRefs 来将响应式对象转换为普通对象

### 2. context

它是一个普通对象，我们可以对它进行解构，它包含了四个属性

1. attrs：属性，非响应式对象，所有非 prop 的 attribute，等同于 $attrs
2. slots：插槽，非响应式对象，父组件传递过来的插槽，等同于 $slots
3. emit：触发对象，是一个方法，在组件内部需要发出事件时使用，等同于 $emit
4. expose：暴露公共，是一个函数，在这个函数被子组件调用后，父组件用过 ref 拿到的结果是调用 expose 是的参数，而不是组件实例

```vue
expose-a:
<template>
  <expose-b ref="componentB"></expose-b>
  <button @click="componentB">increment</button>
</template>

<script>
import { ref } from 'vue'
import ExposeB from './expose-b.vue'
export default {
  components: {
    ExposeB
  },
  setup() {
    const componentB = ref(null)
    return { componentB }
  },
}
</script>

expose-b:
<template>
  expose-b: {{ count }}
</template>

<script>
import { ref } from 'vue'
export default {
  setup(props, { expose }) {
    const count = ref(0)
    const increment = () => count.value++
    expose(increment)
    return {
      count,
      increment
    }
  },
}
</script>
```

## setup 函数的返回值

返回一个对象，setup 的返回值可以在 template 中使用，也就是说，返回值代替了之前的 data 选项，我们甚至可以返回一个可执行函数，代替了之前 methods 选项中的方法。

```vue
<script>
export default {
    setup() {
        const name = 'fan'
        const age = 1
        const add = () => {
            age++
        }
        return { name, add }
    }
}
</script>
```

## setup 函数中不可以使用 this

`setup` 与 `data` 等其他选项不同，它没有指向当前组件实例。`setup` 是在其他选项被解析之前调用，所以无法获取到 this。`setup` 内部的 `this` 的行为与其它选项中的 `this` 完全不同。这使得 `setup` 在和其它选项式 API 一起使用时可能会导致混淆。
