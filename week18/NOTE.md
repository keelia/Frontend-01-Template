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

> 总结： 构建build工具其实是对文本的处理，掌握对http的解析，html的解析，css，js的解析等。有官方工具的如：html parser，css parser，vue compiler，babel tranformer，一般使用中是官方+自研来达到业务需求。

- 练习（非重点）：npm除了当作命令，还可以当做包用:npm install npm
  - folder:npm-demo: npm init
  - npm install npm
  - main.js: 脚本执行webpack的安装
      ```
      const npm = require('npm')
      let config = {
          "name": "npm-demo",
          "version": "1.0.0",
          "description": "",
          "main": "index.js",
          "scripts": {
          "test": "echo \"Error: no test specified\" && exit 1"
          },
          "author": "",
          "license": "ISC",
          "dependencies": {
          "npm": "^6.14.7"
          }
      }
      npm.load(config,(err)=>{
          npm.install('webpack',(err)=>{
              console.log(err)
          })
      })
      console.log(npm)
      ```

