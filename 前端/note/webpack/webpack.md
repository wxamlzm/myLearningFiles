# webpack
- webpack有很多兼容性问题的吐槽，可能已经过时了，但vue2还没有，目前很多基础框架依然只支持vue2或者vue3的兼容不好，而webpack是vue2优秀的打包工具，所以我觉得还是有学习的必要;至少在维护当前项目和理解项目打包是个什么来讲还是值得花时间的;

# webpack.config.js
- 这个文件毫无疑问是webpack的核心，vue-cli下的vue.config.js很明显应该是这个文件的入参，同时vue-cli给webpack.config.js配置了很多默认参数来达到了效果，理解这个文件的配置可以更好的调配vue-cli的配置，尤其是在优化性能的时候会更方便;
- 通过引入并新建`html-webpack-plugin` 的实例，指定路径，并且配置清空参数，实现类似vue-cli打包的效果;[webpack管理输出](https://webpack.docschina.org/guides/output-management/)。