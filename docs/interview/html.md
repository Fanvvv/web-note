# HTML5

## HTML5 有哪些更新

1. 语义化标签：header、nav、main、footer、article、section
2. 媒体标签：audio、video
3. 表单：date、datetime、color、email
4. 进度条、度量器：progress
5. DOM查询操作：document.querySelector()
6. Web存储：localStorage、sessionStorage
7. 其他：canvas、svg、websocket
8. 拖拽
9. 自定义属性：data-*

## 语义化标签的好处

- 让人更容易读懂（增加代码可读性）
- 让搜索引擎更容易读懂（SEO）

## H5 事件

- onblur失焦事件
- onfocus聚焦事件
- onchange改变事件
- onclick点击事件
- onerror错误事件
- oninput输入事件
- onkeydown键盘按下事件
- onkeyup键盘抬起事件
- onmousemove鼠标移动事件
- onmouseover鼠标进入事件
- onmouseout鼠标移出事件等

## H5中input元素的type属性值

- color颜色
- password密码
- text文本
- CheckBox复选框
- radio单选框
- date日期
- button按钮
- submit提交按钮等

## script标签中defer和async的区别

**defer 和 async属性都是去异步加载外部的JS脚本文件，它们都不会阻塞页面的解析**

- async：异步加载，立即执行

- defer：异步加载，文档解析完执行

## 说一下 HTML5 drag API 

- dragstart：事件主体是被拖放元素，在开始拖放被拖放元素时触发。 
- darg：事件主体是被拖放元素，在正在拖放被拖放元素时触发。 
- dragenter：事件主体是目标元素，在被拖放元素进入某元素时触发。 
- dragover：事件主体是目标元素，在被拖放在某元素内移动时触发。 
- dragleave：事件主体是目标元素，在被拖放元素移出目标元素是触发。 
- drop：事件主体是目标元素，在目标元素完全接受被拖放元素时触发。 
- dragend：事件主体是被拖放元素，在整个拖放操作结束时触发。

## 三种存储方式对比

- **localStorage**：长期存储于浏览器，可存储5M,所有同源窗口共享数据  
- **sessionStorage**：浏览器关闭数据就被销毁，也可存储5M，只在同一浏览器窗口共享数据 
- **cookie**：有有效期，可存储4kB，所有同源窗口共享数据，数据会随着请求存储到请求报文中