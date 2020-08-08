# Dev Tools
> 命令：
- init
- add:加模块/页面，init工具的一个补充
- dev
- build
- test
- publish

## Server
- build（构建工具）:其实贯穿server和client两个领域；前端很主体的工具，前段工作基本都离不开。webpack（主要在使用的，入口出口都是js） babel（可以独立使用，也可以单独使用，常用三件套） vue jsx postcss
- watch：和build是一体的。fsevent。
- mock：假装有api，跟服务端相关的工作需要用到
- http：ws（这个包比较好的是 直接把本地启动起来变成web server）

### build
- 练习：非webpack环境下的babel是如何compile的：
  - install dependencies：npm install --save-dev @babel/core @babel/cli @babel/preset-env
  - .bablelrc config file，配置preset
  - terminal： bable demo.js
  - 输出transfotmed js，适用于多数浏览器平台

- 练习： 使用vue complier 解析js
  - 安装@vue/compiler-sfc
  - 使用它的compileTemplate方法去解析自己写的一段js代码，得到输出的object
  - https://github.com/vuejs/vue-next/blob/master/packages/compiler-sfc/__tests__/compileTemplate.spec.ts
