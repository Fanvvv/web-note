# vite + vue3 打包成 app 后，首页白屏问题

### 问题描述：

运行 `npm run build` 后，将项目使用 HbuildX 进行真机调试，在安卓手机运行发现首页白屏

### 解决办法

使用 @vitejs/plugin-legacy 插件
[@vitejs/plugin-legacy github地址](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy)

安装好插件后，需要使用这个插件，同时必须安装 `terser`

```
npm i @vitejs/plugin-legacy
npm add -D terser
```

用法：

```js
// vite.config.js
import legacy from '@vitejs/plugin-legacy'

export default {
  plugins: [
    legacy({
      targets: ['defaults', 'not IE 11']
    })
  ]
}
```

这是我的配置：

```js
// vite.config.js
export default {
  plugins: [
    legacy({
      targets: [
        "> 1%, last 1 version, ie >= 11",
        "safari >= 10",
        "Android > 39",
        "Chrome >= 60",
        "Safari >= 10.1",
        "iOS >= 10.3",
        "Firefox >= 54",
        "Edge >= 15"
      ],
      additionalLegacyPolyfills: ["regenerator-runtime/runtime"],
      polyfills: ["es.promise.finally", "es/map", "es/set"],
      modernPolyfills: ["es.promise.finally"]
    })
  ]
}
```

接下来还要对打包后 dist 文件夹中的 index.html 进行处理一下

![1](%E6%89%93%E5%8C%85%E6%88%90app%E9%81%87%E5%88%B0%E7%9A%84%E9%97%AE%E9%A2%98.assets/1.png)