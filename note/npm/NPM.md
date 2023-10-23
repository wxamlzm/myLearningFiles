## `NPM`(Node package Manager)

- Node 里的一个包管理工具
- 会随 Node 一起安装
- 用于管理 Node 的第三方模块

## package.json

- `NPM`包的描述文件
- 可以用 `npm init`命令创建
- 描述了包的基本信息，比如包的名字、版本、作者、依赖等
- 所有的依赖包都会在 dependencies 和 devDependencies 的配置中列出
  - devDependencies 中的包只用于开发环境
  - dependencies 中的包则是发布到生产环境的
  - 目前的简单理解业务关联的比如 element-ui,moment,axios 等放在 dependencies 中;不相关的比如 eslint,webpack 等放在 devDependencies 中
