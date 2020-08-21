# phantomjs & eslint

> phantomjs:检查页面最终渲染出来的结果

> eslint：检查js的风格

## 练习：基于phantomjs做无头浏览器check
1. 安装phantomjs
   1. 下载phantomjs
   2. cmd里面which node，装在node所在的bin里面
   3. phantomjs --version
2. phantomjs测试需要的步骤：
   1. 启动local的server
      1. 使用components作为demo，webpack-dev-server on localhost:8080
   2. 对页面元素做断言【phantomjs不支持let等新语法】
      1. 写check/check.js访问 localhost:8080 检查页面元素
      2. 写测试代码：
      ```
           var page = require('webpage').create();
           page.open('http://localhost:8080/', function(status) {
           if(status === "success") {
               var body = page.evaluate(function() {
                   var toString = function(pad,element){
                           var children = element.childNodes
                           var childrenString = ''
                           for (var i = 0; i < children.length; i++) {
                               childrenString+=toString("    "+ pad,children[i]) + '\n'
                           }
                           var name = element.tagName || '#text: ' + JSON.stringify(element.textContent)
                           return pad + name + (children.length > 0 ? '\n'+ childrenString :'') 
                       }
                       return toString('',document.body);
               });
               console.log(body);
           }
           phantom.exit();
       });
      ```
      1. 看body产生的代码，结构等对不对

> phantomjs用在哪里？持续集成里面的页面检测，测试页面是否正确;冒烟测试；对整个页面上的图片进行检查；

> 不合适用在服务器端渲染，不适合用在线上服务

> phantomjs相关的包：npm install mocha-phantomjs-core [不推荐]

## 练习： 使用eslint检查代码风格
1. demo/ eslint安装:npm install eslint --save-dev
2. demo/ npx eslint --init
3. demo/ npx eslint ./main.js ：使用eslint检查原始的src的文件，不是build出来的
4. demo/ 使用插件，适配react，setting中配置对应的pragma:
   ```
    settings:{
        react: {
        "createClass": "createReactClass", // Regex for Component Factory to use,
                                            // default to "createReactClass"
        "pragma": "create",  // Pragma to use, default to "React"
        "version": "detect", // React version. "detect" automatically picks the version you have installed.
                            // You can also use `16.0`, `16.3`, etc, if you want to override the detected value.
                            // default to latest and warns if missing
                            // It will default to "detect" in the future
        "flowVersion": "0.53" // Flow version
        }
    }
   ```

> 一般不会改config里面的rules：
```
 rules: {
    "semi": "error",
    "no-unused-vars":"off"
  },
  ```
> rule可以自定义，可开发.但一般都不是自己写。