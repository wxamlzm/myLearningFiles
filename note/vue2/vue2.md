## vue2

- 期望能通过了解 vue2 的源码，更好的在 vue2 项目构建中进行配置;
- 文意为当前的理解，可能有误，2023 年 10 月 23 日

## main.js

- 对于 vue-cli 构建来讲非常熟悉的文件，一般作为业务开发几乎不会动，但到了自己通过 webpack 手动配置 vue 时发现，这个目录其实是 webpack 例子里的 index.js 的作用;

## new Vue()

- 以下代码为创建vue的实例，是vue范畴，但写在main.js里，应该是利用webpack来运行或者说打包vue的实例，所以是两者的交集
- 其中App.vue是vue组件，render函数是vue的渲染函数，h函数是vue的虚拟dom函数，el是vue的挂载点
```
import Vue from 'vue'
import App from './App.vue'
new Vue({
    el: '#app',
    render: h => h(App)
})
```
<!-- - 找到了vue中$mount的源码，但现阶段无法完成吃透这么长链条的构造链，就先到这里吧 -->
- App.vue 作为我们编写的根 Vue 组件,其模板中的 id="app" 不是必须的,通常vue-cli的App.vue的id是#app，应该是统一性用词的习惯;而一直以来我这边误解了，实质上new Vue()的el的#app，是用于寻找index.html中的Dom，以用于vue的注入的;
- 然后根据统一性用词的原则，因为App.vue和index.html实质上的确是业务期望一致的两个，所以在id上通过vue-cli定位为了一样的

## cli指令
- `vue add @vue/cli-plugin-unit-jest` 用于添加单元测试；会附加配置;