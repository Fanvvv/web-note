# Proxy 和 Reflect

## Proxy 概念和用法
一个 Proxy 对象包装另一个对象并拦截诸如读取/写入属性和其他操作，可以选择自行处理它们，或者透明地允许该对象处理它们

### 语法

```javascript
const proxy = new Proxy(target, handler)
```

- `target`: 要包装的对象，可以是任何东西，包括函数
- `handler`: 代理配置：带有“捕捉器”的对象。

- - 常用的捕捉器：

- - - get 捕捉器：用于读取 `target` 的属性
    - set 捕捉器：用于写入 `target` 的属性

全部捕捉器

| 内部方法                | Handler 方法               | 何时触发                                                     |
| ----------------------- | -------------------------- | ------------------------------------------------------------ |
| `[[Get]]`               | `get`                      | 读取属性                                                     |
| `[[Set]]`               | `set`                      | 写入属性                                                     |
| `[[HasProperty]]`       | `has`                      | `in`操作符                                                   |
| `[[Delete]]`            | `deleteProperty`           | `delete`操作符                                               |
| `[[Call]]`              | `apply`                    | 函数调用                                                     |
| `[[Construct]]`         | `construct`                | `new` 操作符                                                 |
| `[[GetPrototypeOf]]`    | `getPrototypeOf`           | [Object.getPrototypeOf](https://developer.mozilla.org/zh/docs/Web/JavaScript/Reference/Global_Objects/Object/getPrototypeOf) |
| `[[SetPrototypeOf]]`    | `setPrototypeOf`           | [Object.setPrototypeOf](https://developer.mozilla.org/zh/docs/Web/JavaScript/Reference/Global_Objects/Object/setPrototypeOf) |
| `[[IsExtensible]]`      | `isExtensible`             | [Object.isExtensible](https://developer.mozilla.org/zh/docs/Web/JavaScript/Reference/Global_Objects/Object/isExtensible) |
| `[[PreventExtensions]]` | `preventExtensions`        | [Object.preventExtensions](https://developer.mozilla.org/zh/docs/Web/JavaScript/Reference/Global_Objects/Object/preventExtensions) |
| `[[DefineOwnProperty]]` | `defineProperty`           | [Object.defineProperty](https://developer.mozilla.org/zh/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty), [Object.defineProperties](https://developer.mozilla.org/zh/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperties) |
| `[[GetOwnProperty]]`    | `getOwnPropertyDescriptor` | [Object.getOwnPropertyDescriptor](https://developer.mozilla.org/zh/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyDescriptor), `for..in`, `Object.keys/values/entries` |
| `[[OwnPropertyKeys]]`   | `ownKeys`                  | [Object.getOwnPropertyNames](https://developer.mozilla.org/zh/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyNames), [Object.getOwnPropertySymbols](https://developer.mozilla.org/zh/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertySymbols), `for..in`, `Object.keys/values/entries` |

::: warning **注意：**

JavaScript 强制执行某些不变量 —— 内部方法和捕捉器必须满足的条件

其中大多数用于返回值：

- `[[Set]]` 如果值已成功写入，则必须返回 `true`，否则返回 `false`。
- `[[Delete]]` 如果已成功删除该值，则必须返回 `true`，否则返回 `false`。
- ...... 依此类推

:::

## get 捕捉器

`handler` 应该有 `get(target, property, receiver)` 方法

- `target` —— 是目标对象，该对象被作为第一个参数传递给 `new Proxy`，
- `property` —— 目标属性名，
- `receiver` —— 如果目标属性是一个 getter 访问器属性，则 `receiver` 就是本次读取属性所在的 `this` 对象。通常，这就是 `proxy` 对象本身（或者，如果我们从 proxy 继承，则是从该 proxy 继承的对象）。

## set 捕捉器

`set(target, property, value, receiver)`：

- `target` —— 是目标对象，该对象被作为第一个参数传递给 `new Proxy`，
- `property` —— 目标属性名称，
- `value` —— 目标属性的值，
- `receiver` —— 与 `get` 捕捉器类似，仅与 setter 访问器属性相关。

::: tip

如果写入操作（setting）成功，`set` 捕捉器应该返回 `true`，否则返回 `false`（触发 `TypeError`）

:::

## ownKeys 和 getOwnPropertyDescriptor

`Object.keys`，`for..in` 循环和大多数其他遍历对象属性的方法都使用内部方法 `[[OwnPropertyKeys]]`（由 `ownKeys` 捕捉器拦截) 来获取属性列表

例子：使用 `ownKeys` 捕捉器拦截 `for..in` 对 `user` 的遍历，并使用 `Object.keys` 和 `Object.values` 来跳过以下划线 `_` 开头的属性

```javascript
let user = {
  name: "John",
  age: 30,
  _password: "***"
};

user = new Proxy(user, {
  ownKeys(target) {
    return Object.keys(target).filter(key => !key.startsWith('_'));
  }
});

// "ownKeys" 过滤掉了 _password
for(let key in user) alert(key); // name，然后是 age

// 对这些方法的效果相同：
alert( Object.keys(user) ); // name,age
alert( Object.values(user) ); // John,30
```

### 在原型上添加属性

`Object.keys` 仅返回带有 `enumerable` 标志的属性，下面例子中会返回 **空**

```javascript
let user = { };

user = new Proxy(user, {
  ownKeys(target) {
    return ['a', 'b', 'c'];
  }
});

alert( Object.keys(user) ); // <empty>
```

在这里，由于没有属性，其描述符为空，没有 `enumerable` 标志，因此它被略过。

为了让 `Object.keys` 返回一个属性，我们需要它要么存在于带有 `enumerable` 标志的对象，要么我们可以拦截对 `[[GetOwnProperty]]` 的调用（捕捉器 `getOwnPropertyDescriptor` 可以做到这一点)，并返回带有 `enumerable: true` 的描述符。

```javascript
let user = { };

user = new Proxy(user, {
  ownKeys(target) { // 一旦要获取属性列表就会被调用
    return ['a', 'b', 'c'];
  },

  getOwnPropertyDescriptor(target, prop) { // 被每个属性调用
    return {
      enumerable: true,
      configurable: true
      /* ...其他标志，可能是 "value:..." */
    };
  }

});

alert( Object.keys(user) ); // a, b, c
```

## has 捕捉器

`has` 捕捉器会拦截 `in` 调用。

```
has(target, property)
```

- `target` —— 是目标对象，被作为第一个参数传递给 `new Proxy`，
- `property` —— 属性名称。

```javascript
let range = {
  start: 1,
  end: 10
};

range = new Proxy(range, {
  has(target, prop) {
    return prop >= target.start && prop <= target.end;
  }
});

alert(5 in range); // true
alert(50 in range); // false
```

## 包装函数 apply

我们也可以将代理（proxy）包装在函数周围。

`apply(target, thisArg, args)` 捕捉器能使代理以函数的方式被调用：

- `target` 是目标对象（在 JavaScript 中，函数就是一个对象），
- `thisArg` 是 `this` 的值。
- `args` 是参数列表。

## Reflect

`Reflect` 是一个内建对象，可简化 `Proxy` 的创建。

| 操作                | `Reflect`调用                       | 内部方法        |
| ------------------- | ----------------------------------- | --------------- |
| `obj[prop]`         | `Reflect.get(obj, prop)`            | `[[Get]]`       |
| `obj[prop] = value` | `Reflect.set(obj, prop, value)`     | `[[Set]]`       |
| `delete obj[prop]`  | `Reflect.deleteProperty(obj, prop)` | `[[Delete]]`    |
| `new F(value)`      | `Reflect.construct(F, value)`       | `[[Construct]]` |

**对于每个可被** `Proxy` **捕获的内部方法，在** `Reflect` **中都有一个对应的方法，其名称和参数与** `Proxy` **捕捉器相同。**

