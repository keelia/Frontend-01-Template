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

# setup VM for publish-server & server
1. install Node/npm
2. install openssh : https://ubuntu.com/server/docs/service-openssh
  1. sudo apt install openssh-server
  2. sudo service ssh start
  3. sudo service ssh start
3. local machine connect to VM:
  1. VM Setting : Network->advanced->port forwarding: name:ssh, host port 2222, guest port 22
  2. local machine: ssh -p 2222 keelia@127.0.0.1 / exit :https://www.digitalocean.com/community/tutorials/how-to-use-ssh-to-connect-to-a-remote-server-in-ubuntu
4. copy folder to VM:scp -P 2222 ./main.js keelia@localhost:~; node_module can be installed by package-lock.json(Not pakage.json)
5. cd server, npm start, VM Setting foprt forwaring:80 host , guest 3000
6. local machine 
  1. nav to : http://127.0.0.1 or http://127.0.0.1:80
  2. sudo vim /etc/hosts  add '127.0.0.1' to 'xxx.io' as a domain name
  3. nav to xxx.io should be same as 1.
  4. copy folder to VM:scp -P 2222 -r ./publish-server-vanilla keelia@127.0.0.1:~
7. VM new terminal
  1. remove vanilla in name:Cmd:mv publish-server-vanilla/ publish-server
  2. cd publish-server, Cmd: node index.js. server on 8081
  3. VM port forwarding add host 8088, guest 8081
8. local machine, 
  1. go to publish-tool, change request port to 8088, host canbe xxx.io
  2. github settings developer settings:change auth URL form 'http://localhost:8081/auth' to 'http://localhost:8088/auth'
9. publish tool
  1. send request to localhost:8080, which will go to VM port8081(port forwarded)
  2. publish-server recieved requst in 1., write files to server folder, return ok
  3. publish tool request on end.

# integration toolchiain:toy-tool(generator) init project, publish project to vm server
1. publish-tool :
  1. rename publish-tool to toy-publish-tool
  2. cmd:npm link
2. toy-tool
  1. generators/app/templates/package.json:
    1. add "publish" with the link just linked by 'npm link' : node ../node_modules/toy-publish-tool/publish.js
    2. add "lint" :"eslint ./src"
3. test: mkdir :demo ,cd demo: 
  1. yo tooltoy (init a project)
  2. webpack, see if dist/ can be run
4. publish dist folder in demo: npm run publish
5. adjust carousel to demo: webpack.config, npm install --save-dev css, lib folder(gesture/animation/cubicBezier/createElement/gesture), tool folder(custom-loader, etc)

> 前端必要的工作流程（3类工程的技能）：组件化，工具链，发布系统
