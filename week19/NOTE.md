# 练习：用yeoman generator串联起来完整的工具链
1. 创建toy-tool文件夹作为即将创建的generator的文件夹，npm init；
2. 创建 yeoman generator：npm install --save yeoman-generator
3. 创建 generators/app/index.js作为generator代码，并npm link
4. 构建generator：
   1. templates，作为新项目的基础文件/库：
      1. package.json配置dependencies
      2. lib基础库
      3. entry：main.js index.html
      4. 配置webpack.config