# 高级核心前端技术选择题

1. 在HTML5中，`<input type="number">` 元素的 `step` 属性的默认值是多少？
   A. 1
   B. 0
   C. any
   D. 0.1

2. CSS中，`overflow: scroll` 和 `overflow: auto` 的区别是什么？
   A. scroll 总是显示滚动条，auto 只在需要时显示
   B. scroll 只在需要时显示滚动条，auto 总是显示
   C. scroll 允许滚动，auto 不允许滚动
   D. 没有区别，可以互换使用

3. JavaScript中，以下哪个方法可以用来深拷贝一个对象？
   A. Object.assign()
   B. {...obj}
   C. JSON.parse(JSON.stringify(obj))
   D. Object.create(obj)

4. HTML5中的 `hidden` 属性的作用是什么？
   A. 隐藏元素，但保留其空间
   B. 完全移除元素，不保留空间
   C. 使元素不可见，但仍可交互
   D. 加密元素内容

5. 在CSS中，`transform: translate(-50%, -50%)` 通常与哪个定位属性配合使用来实现元素的精确居中？
   A. position: relative
   B. position: absolute
   C. position: fixed
   D. position: sticky

6. JavaScript中，`Array.prototype.slice()` 方法的返回值是：
   A. 原数组的引用
   B. 原数组的浅拷贝
   C. 原数组的深拷贝
   D. 一个新的空数组

7. 在HTML5中，哪个属性用于指定自动完成功能应该被打开还是关闭？
   A. autocomplete
   B. autofill
   C. autosubmit
   D. autovalidate

8. CSS中，`@supports` 规则的主要用途是什么？
   A. 检查浏览器是否支持某个CSS属性或值
   B. 定义媒体查询
   C. 导入外部样式表
   D. 创建动画关键帧

9. 在JavaScript中，以下哪个方法可以用来检测一个值是否为数组？
   A. typeof
   B. instanceof
   C. Array.isArray()
   D. Object.prototype.toString.call()

10. HTML5中的 `<progress>` 元素用于表示任务的进度。如果没有指定 `value` 属性，它表示什么？
    A. 0%进度
    B. 100%进度
    C. 50%进度
    D. 不确定的进度状态

11. 在CSS Grid布局中，`fr` 单位代表什么？
    A. 固定的像素值
    B. 相对于父元素的百分比
    C. 可用空间中的一个份额（fraction）
    D. 字体相对单位

12. JavaScript中，`Object.seal()` 方法的作用是什么？
    A. 使对象的所有属性不可修改
    B. 防止向对象添加新属性，但允许修改现有属性
    C. 完全冻结对象，使其不可修改
    D. 删除对象的所有属性

13. 在HTML5中，`<input type="date">` 返回的日期格式是什么？
    A. MM/DD/YYYY
    B. DD/MM/YYYY
    C. YYYY-MM-DD
    D. 取决于用户的本地设置

14. CSS中，`outline` 属性与 `border` 属性的主要区别是什么？
    A. outline 不占用空间，border 占用空间
    B. outline 只能是实线，border 可以是虚线
    C. outline 不能设置圆角，border 可以
    D. outline 只用于焦点状态，border 用于常规状态

15. 在JavaScript中，`Promise.allSettled()` 方法的作用是什么？
    A. 当所有 Promise 都成功时返回结果
    B. 当任一 Promise 完成时返回结果
    C. 返回所有 Promise 的结果，无论成功还是失败
    D. 只返回成功的 Promise 结果

16. HTML5中的 `contenteditable` 属性可以应用于哪些元素？
    A. 只能应用于 `<input>` 和 `<textarea>`
    B. 只能应用于块级元素
    C. 只能应用于内联元素
    D. 可以应用于几乎任何HTML元素

17. 在CSS中，`pointer-events: none` 的作用是什么？
    A. 隐藏鼠标指针
    B. 禁用元素的所有鼠标事件
    C. 改变鼠标指针的样式
    D. 只允许点击事件

18. JavaScript中，`WeakSet` 和 `Set` 的主要区别是什么？
    A. WeakSet 只能存储对象，Set 可以存储任何类型的值
    B. WeakSet 的元素可以被垃圾回收，Set 的元素不行
    C. WeakSet 是有序集合，Set 是无序集合
    D. WeakSet 可以被迭代，Set 不能被迭代

19. 在HTML5中，`<meta name="viewport">` 标签的 `content` 属性中，`initial-scale=1.0` 的作用是什么？
    A. 设置页面的初始缩放级别
    B. 禁止用户缩放页面
    C. 设置页面的最大宽度
    D. 启用响应式设计

20. CSS中，`mix-blend-mode` 属性的作用是什么？
    A. 混合多个背景图像
    B. 定义元素的内容如何与其父元素的内容和背景混合
    C. 创建渐变效果
    D. 调整元素的透明度

21. 在JavaScript中，`Object.preventExtensions()` 方法的作用是什么？
    A. 防止对象被删除
    B. 使对象的所有属性不可修改
    C. 防止向对象添加新属性
    D. 冻结对象的原型链

22. HTML5中，`<input type="file" multiple>` 中 `multiple` 属性的作用是什么？
    A. 允许上传多种类型的文件
    B. 允许选择多个文件
    C. 允许多次上传文件
    D. 创建多个文件输入字段

23. 在CSS中，`@property` 规则的主要用途是什么？
    A. 定义自定义CSS属性（变量）
    B. 声明动画属性
    C. 创建新的选择器
    D. 导入外部样式表

24. JavaScript中，`Symbol.toPrimitive` 的作用是什么？
    A. 将 Symbol 转换为字符串
    B. 定义对象转换为原始值时的行为
    C. 创建唯一的标识符
    D. 比较两个 Symbol 值

25. 在HTML5中，`<details>` 元素的 `open` 属性的作用是什么？
    A. 使 `<details>` 元素可点击
    B. 默认展开 `<details>` 元素的内容
    C. 允许 `<details>` 元素包含其他元素
    D. 使 `<details>` 元素在新窗口中打开

26. CSS中，`scroll-snap-type` 属性的作用是什么？
    A. 定义滚动条的样式
    B. 控制滚动时元素的对齐方式
    C. 设置元素的溢出行为
    D. 创建平滑滚动效果

27. 在JavaScript中，`Proxy` 对象的主要用途是什么？
    A. 创建对象的浅拷贝
    B. 拦截和自定义对象的基本操作
    C. 实现对象的继承
    D. 加密对象的属性

28. HTML5中，`<input type="color">` 元素默认返回的颜色格式是什么？
    A. RGB
    B. RGBA
    C. HEX
    D. HSL

29. 在CSS中，`contain` 属性的主要作用是什么？
    A. 控制子元素是否溢出父元素
    B. 隔离元素的内容，优化浏览器的渲染性能
    C. 定义元素的容器查询
    D. 设置元素的溢出行为

30. JavaScript中，`globalThis` 关键字的作用是什么？
    A. 引用全局对象（在浏览器中是 window，在 Node.js 中是 global）
    B. 创建全局变量
    C. 访问全局作用域
    D. 定义全局常量

---

答案:

1. A
2. A
3. C
4. B
5. B
6. B
7. A
8. A
9. C
10. D
11. C
12. B
13. C
14. A
15. C
16. D
17. B
18. A and B
19. A
20. B
21. C
22. B
23. A
24. B
25. B
26. B
27. B
28. C
29. B
30. A
