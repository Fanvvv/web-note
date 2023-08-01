# Node.js

## 常见的内置模块

### path

path 模块用于对路径和文件进行处理，提供了很多好用的方法

从路径中获取信息：

- dirname：获取文件的父文件夹；
- basename：获取文件名；
- extname：获取文件扩展名。

路径拼接：

- path.join()

将文件和某个文件夹拼接：

-  path.resolve()：resolve函数会判断我们拼接的路径前面是否有 `/` 或 `../` 或 `./`，如果有表示是一个绝对路径，会返回对应的拼接路径， 如果没有，那么会和当前执行文件所在的文件夹进行路径的拼接。

### fs

 fs 是 File System 的缩写，表示文件系统。

API 大多数都提供三种操作方式

- 方式一：同步操作文件：代码会被阻塞，不会继续执行；
- 方式二：异步回调函数操作文件：代码不会被阻塞，需要传入回调函数，当获取到结果时，回调函数被执行；
- 方式三：异步 Promise 操作文件：代码不会被阻塞，通过 fs.promises 调用方法操作，会返回一个 Promise， 可以通过 then、catch 进行处理；

fs 模块中的一些方法：

- fs.open() 方法用于分配新的文件描述符；
- fs.readFile(path[, options], callback)：读取文件的内容；
- fs.writeFile(file, data[, options], callback)：在文件中写入内容；
- fs.mkdir() 或 fs.mkdirSync()：创建一个新文件夹；
- fs.rename()：文件重命名；

### events

发出事件和监听事件都是通过EventEmitter类来完成的，它们都属 于events对象

- emitter.on(eventName, listener)：监听事件，也可以使用 addListener； 
- emitter.off(eventName, listener)：移除事件监听，也可以使 用removeListener；
- emitter.emit(eventName[, ...args])：发出事件，可以携带一 些参数；

常见的属性：

- emitter.eventNames()：返回当前 EventEmitter对象注册的事件字符串数组；
- emitter.getMaxListeners()：返回当前 EventEmitter对象的最大监听器数量，可以通过setMaxListeners() 来修改，默认是10；
- emitter.listenerCount(事件名称)：返回当前 EventEmitter对象某一个事件名称，监听器的个数；
- emitter.listeners(事件名称)：返回当前 EventEmitter对象某个事件监听器上所有的监听器数组

## 常见的包管理工具

### npm

packag.json 中必填的属性：name、version。

常见的属性：

- name 是项目的名称；
- version 是当前项目的版本号；
- description 是描述信息，很多时候是作为项目的基本描述；
- author 是作者相关信息（发布时用到）；
- license 是开源协议（发布时用到）；
- main 设置程序的入口；
- script 用于配置一些脚本命令，以键值对的形式存在；
- dependencies 是指定无论开发环境还是生成环境都需要依赖的包；
-  devDependencies 一些包在生产环境是不需要的，比如 webpack、babel 等，我们会通过 `npm install webpack --save-dev`，将它安装到 devDependencies 属性中；

> 疑问：那么在生产环境如何保证不安装这些包呢？ 
>
> 生产环境不需要安装时，我们需要通过 npm install --production 来安装文件的依赖

- engines 用于指定Node和NPM的版本号；
- browserslist 用于配置打包后的JavaScript浏览器的兼容情况；

npm install 原理图：

![image-20230731165226643](https://raw.githubusercontent.com/Fanvvv/picBed/szmuseum/20230731165227.png)

npm 其他命令

- npm rebuild：强制重新打包。
- npm cache clean：清除缓存。

### yarn

yarn 是为了弥补 npm 的一些缺陷而出现的。

早期的 npm 存在很多的缺陷，比如安装依赖速度很慢、版本依赖混乱等等一系列的问题

### pnpm



## 如何开发脚手架工具

使用 Commander 库

## Buffer 

### Buffer 和二进制

计算机中所有的内容：文字、数字、图片、音频、视频最终都会使用二进制来表示。

我们可以将 Buffer 看成是一个存储二进制的数组，这个数组中的每一项，可以保存8位二进制： 00000000。

> 为什么是8位呢？
>
> 因为一位二进制存储的数据是非常有限的，以通常会将8位合在一起作为一个单元，这个单元称之为一个字节（byte）。

### Buffer 创建

- Buffer.from
- Buffer.alloc

### Buffer 和文件读取

- 文本文件的读取：

```js
fs.readFile('./test/text', (err, data) => {
    console.log(data) // <Buffer 48 65 6c 6c 6f 20 57 6f 72 6c 64>
    console.log(data.toString()) // Hello World
})
```

- 图片文件的读取：

```js
fs.readFile('./img.jpg', (err, data) => {
    console.log(data) // <Buffer ... more bytes>
})
```

```js
sharp('./test.png').resize(1000, 1000).toBuffer().then(data => {
    fs.writeFileSync('./test.copy.png', data)
})
```

### Buffer的创建过程

我们创建Buffer时，并不会频繁的向操作系统申请内存，它会默认先申请一个8 * 1024个字节大小的内存， 也就是8kb

## Stream

> 文件的读写时，我们可以直接通过 readFile或者 writeFile方式读写文件，为什么还需要流呢？
>
> - 直接读写文件的方式，虽然简单，但是无法控制一些细节的操作；
> - 比如从什么位置开始读、读到什么位置、一次性读取多少个字节；
> - 读到某个位置后，暂停读取，某个时刻恢复读取等等；
> - 或者这个文件非常大，比如一个视频文件，一次性全部读取并不合适。

文件读写的 Stream

事实上Node中很多对象是基于流实现的：

- http模块的Request和Response对象
- process.stdout对象

> 官方：另外所有的流都是EventEmitter的实例

Node.js中有四种基本流类型：

- Writable：可以向其写入数据的流（例如 fs.createWriteStream()）。
- Readable：可以从中读取数据的流（例如 fs.createReadStream()）。 
- Duplex：同时为Readable和的流Writable（例如 net.Socket）。
- Transform：Duplex可以在写入和读取数据时修改或转换数据的流（例如zlib.createDeflate()）

### Readable

使用 `fs.readFile` 读取一个文件信息，这种方式是一次性将一个文件中所有的内容都读取到程序（内存）中，但是这种读取方式会出现**文件过大、读取的位置、结束的位置、一次读取的大小**等问题。

我们可以使用 createReadStream 来读取文件，常用参数：

- start：文件读取开始的位置；
- end：文件读取结束的位置；
- highWaterMark：一次性读取字节的长度，默认是64kb。

### Writable

使用 createWriteStream 来写入文件，常用参数：

- flags：默认是w，如果我们希望是追加写入，可以使用 a或者 a+；
- start：写入的位置

### pipe 方法

正常情况下，我们可以将读取到的 输入流，手动的放到 输出流中进行写入

```js
const reader = fs.createReadStream('./foo.txt')
const writer = fs.createWriteStream('./bar.txt')

reader.on("data", (data) => {
    console.log(data)
    writer.write(data, (err) => {
        console.log(err)
    })
})
```

我们也可以通过pipe来完成这样的操作

```js
reader.pipe(writer)
```

## Http 模块

### 创建一个简单的 web 服务器

```js
const http = require('http')
const HTTP_PORT = 8000
const server = http.createServer((req, res) => {
    res.end("Hello World")
})
server.listen(HTTP_PORT, () => {
    console.log(`服务器在${HTTP_PORT}启动~`)
})
```

### request 对象

在向服务器发送请求时，我们会携带很多信息：

- URL
- 请求方式 method
- 请求头 headers

### 文件上传

```js
// 图片文件必须设置位二进制的
req.serEncoding('binary')

// 获取 content-type 中的 boundary 的值
var boundary = req.headers['content-type'].split('; ')[1].replace('boundary=', '')

// 记录当前数据的信息
const fileSize = req.headers['content-length']
let curSize = 0
let body = ''

// 监听当前的数据
req.on("data", (data) => {
    curSize += data.length
    res.write(`文件上传进度：${ curSize/fileSize * 100 }%\n`)
    body += data
})

req.on('end', () => {
    // 切割数据
    const payload = qs.parse(body, "\r\n", ":")
    // 获取最后的类型（image/png）
    const fileType = payload["Content-type"].substring(1)
    // 获取要截取的长度
    //·获取要截取的长度
    const fileTypePosition = body.indexof(fileType) + fileType.length
    let binaryData = body.substring(fileTypePosition)
    binaryData = binaryData.replace(/^\s\s*/, '')
    // binaryData = binaryData.replaceAll('\r\n', '')
    const finalData = binaryData.substring(0， binaryData. indexOf('--' + boundary + '--'))
    fs.writeFile('./boo.png', finalData, 'binary', (err) => {
        console.log(err)
        res.end("文件上传完成~")
	})
})
```

