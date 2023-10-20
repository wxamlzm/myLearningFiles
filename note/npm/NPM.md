## ```NPM```(Node package Manager)
- Node里的一个包管理工具
- 会随Node一起安装
- 用于管理Node的第三方模块

## package.json
- ```NPM```包的描述文件
- 可以用 ```npm init```命令创建
- 描述了包的基本信息，比如包的名字、版本、作者、依赖等
- 所有的依赖包都会在dependencies 和 devDependencies 的配置中列出
  - devDependencies 中的包只用于开发环境
  - dependencies中的包则是发布到生产环境的