# Githook
## 练习：git hook简单使用：pre-commit
1. 新建hook文件夹，git init, npm install
2. 在.git folder中添加自定义的pre-commit（node），并用chmod（https://www.howtogeek.com/437958/how-to-use-the-chmod-command-on-linux/）给它可执行权限：
    ```
    #!/usr/local/bin/node
    console.log("Hook is running")
   ```
   ```
    ls -l .git/hooks/pre-commit
    -rw-r--r--  1 .git/hooks/pre-commit
    chmod +x .git/hooks/pre-commit
    ls -l .git/hooks/pre-commit
    -rwxr-xr-x  .git/hooks/pre-commit
   ```
3. 在git commit的时候，就会run这个pre-commit的脚本
4. pre-commit中可以执行eslint的检查，单元测试等，决定是否通过这次commit，不通过可以用exit（1）退出
    ```
    #!/usr/local/bin/node
    const process = require("process")

    console.log("Hook is running")

    process.exit(1)
    ```
5. pre-push:某些分支不可以提交的话，可以直接在local处理
6. git-hooks应该在哪里被添加？ yeoman的generattoer里可以考虑添加的

>工具链是组件化和持续集成的承载；
> generator又是工具链的承载；
所以，自动化的大工程体系，互相是关联的，所有的点都会归结到generator上去。genreator出来一个项目有之后，整个用的技术，约定的支持，lint规则，check规则，往哪提交，全都是一体化的

## 练习：如何在git hook中执行eslint
https://eslint.org/docs/developer-guide/nodejs-api
pre-commit:
```
#!/usr/local/bin/node
const process = require("process")
const { ESLint } = require("eslint");
console.log("Hook is running");

(async function main() {
  // 1. Create an instance.
  const eslint = new ESLint();

  // 2. Lint files.
  const results = await eslint.lintFiles(["./main.js"]);

  // 3. Format the results.
  const formatter = await eslint.loadFormatter("stylish");
  const resultText = formatter.format(results);

  for (const result of results) {
      if(result.errorCount > 0){
        process.exitCode = 1;
      }
  }

  // 4. Output it.
  console.log(resultText);
})().catch((error) => {
  process.exitCode = 1;
  console.error(error);
});

```
需要注意unstaged的情况，所以需要‘git stash save -q --keep-index’
 >-比较好的是pre-push(lint在这里) +  post-commit的方式，pre-push添加一些柔性检查，类似git commit --no-verify，让用户跳过检查，自己承担责任

> 衍生阅读git hooks：https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks
一般client side最常用就是pre-push pre-commit
server-side就是pre-receive，但是server-side一般无法直接操纵git