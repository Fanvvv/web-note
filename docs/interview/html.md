# HTML5

## HTML5 有哪些更新

1. 语义化标签：header、nav、main、footer、article、section
2. 媒体标签：audio、video
3. 表单：date、datetime、color、email
4. 进度条、度量器：progress
5. DOM查询操作：document.querySelector()
6. Web存储：localStorage、sessionStorage
7. 其他：canvas、svg、websocket

## 语义化标签的好处

- 让人更容易读懂（增加代码可读性）
- 让搜索引擎更容易读懂（SEO）

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