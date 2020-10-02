# 事件循环 宏任务 微任务（job）
    事件循环是对浏览器或者node环境来说的，既不是对js引擎而言的，是在js引擎的context之外的东西，也不是js语言的一部分。
    js中的宏任务队列或者说事件循环其实是一个东西，是js的调用方去使用js的一种方式。如果只希望执行一段代码，是不需要事件循环的。

    思考：
        js引擎获取js代码片段的方式/获取到的js代码片段的类型有几个？
        3种：
        1.传入正常代码片段：
            <script>
                var a  = 1
                a++
            </script>
            or
            <script src="../address">
                var a  = 1
                a++
            </script>
        2.传入Function: 如setTimeout/setInterval，将js funciton和传入function的params传递出来给外面的js引擎去加入任务队列。
            <script>
                setTimeout(function (params) { },10000)
            </script>
        3.传入Module:
            <script type="module"></script>
    思考：
        js引擎如何执行promise
        result = new Promise(resolve=>resolve()).then(_=>this.a = 3),function() {return this.a}；
        result()
        宏任务/事件循环1：
            微任务/队列1:new Promise(resolve=>resolve()).then(_=>this.a = 3)
            微任务2:this.a = 3
        宏任务/事件循环2：
            微任务/队列1:return this.a

    一个宏任务里面可能包含无数个微任务，两者是打包的关系，宏任务和微任务同样也有可能是事件循环种的某个节点。

    任何的js代码（不论异步或者同步）都是微任务，几个微任务可能聚合在一个宏任务里去执行，所以不管是代码片段，函数还是模块其实都是微任务，只是说那几个微任务会聚成一个宏任务。在js引擎里面，每次调用如evaluateScript（执行一段代码片段）或者是callWithArguments（调用函数以某些参数）这样的操作就叫一个宏任务。通俗来说，只要出了js引擎就叫一个宏任务，没出js引擎，在js引擎里面执行的多段的代码就叫微任务。微任务是保存在js引擎的执行队列中的，在js引擎内部。
    promise里面前半段代码，reolve是立即执行了，是同步执行，resolve之后的then才是异步执行。
    then不是判断是宏微任务的标志，有then只是说明可能产生一个宏任务中有多个微任务的情况，但是一切js代码都是在微任务中执行的。setTimeout/setInterval不是js本身提供的api，是js宿主浏览器提供的api，所以它是宏任务，但是promise是js本身的api，所以它是微任务。

    如何看一个宏任务有哪些微任务，看执行顺序：promise是没有办法把微任务延迟执行的，可以认为一个微任务里面有多少个resolve被执行就会产生多少个额外的微任务。第一个微任务里面执行的是什么，它里面所有resolve的都当作本次自己的宏任务。链式调用then也是一个，每个then里面会产生微任务，看then里面是怎么resolve的，有一个resolve就会产生一个额外的微任务，resolve和微任务的数量都是相等的。

    Promise是js提供的结构化代码的一种方式，它配合了function。

    js引擎的任务列表里有很多宏任务，每个宏任务里面有个微任务列表，每个宏任务在执行第二个宏任务之前都会把自己的微任务执行完。

    为什么会产生多个宏任务，浏览器不会把代码都塞到一起，以上谈到有三种js代码的识别方式，有多个script标签。

    实际在浏览器中如何识别宏任务，有个代码片段就是宏任务，如click事件触发的function代码片段，或者是settimeout/setinterval。

    一个宏任务中只有一个微任务队列，宏任务中根据入队事件决定微任务的执行顺序，当前宏任务内的微任务执行完之后，才会执行下一个宏任务。

    一个宏任务里的同步代码可以理解为微任务，只不过比别的微任务优先入队。一个宏任务至少会先入队一个微任务（所有的同步代码算一个微任务），就是这个同步代码的微任务，所以一个宏任务里面同步的代码最先执行，微任务根据入队的时间执行。微任务是没有优先级的，宏任务是有优先级的。宏任务的优先级判断很复杂，由浏览器等外部环境来实现。

    微任务的控制权在js引擎，宏任务的控制权在宿主，这样js就方便跨语言传递信息了。

# js中结构化程序设计的基础设施
js执行力度：
js context =>realm 【一般的js引擎包含的最大的粒度】多个宏任务共享一个jscontext
宏任务
微任务promise
函数调用execution context
语句/声明
变量时
直接量/变量/this

realm：国度/疆界 里面有一套js完整的内置对象（date，array，prototype等等），每个realm都会创建一整套js内置对象。
js标准global对象：18 The Global Object

execution context stack:
    push
    pop
    running execution context
    传给服务端的字符串需要对中文或者其他特别字符的长度做处理吗？
    如果服务器端支持unicode的话是不需要处理的，但是如果是get请求的话，这个字符就需要用encodeurlcomponent处理的。虽然看到浏览器地址栏可以打中文，这是因为浏览器做了encode。

base64->canvas->canvas里面的东西取出来，在用url就可以了

# 浏览器工作原理

url发送http请求，拿到html代码，然后parse(解析)拿到dom tree，这时候dom tree上缺失了很多信息，如每个node上的css什么样。然后做css computing，把css的规则应用上去，让它有css属性。这就是一个带css的dom tree, 然后排版layout，就得到了带位置的dom tree， 然后进行渲染render，最终得到在内存中的一张图片bitmap，然后把这张图片显示到屏幕上。
这就是浏览器主要干的事情。

实践一个浏览器：
tcp：
tcp占宝问题

ip

每个节点就是对象，每条边就是一个属性。用图的结构。给边加上属性名。long label.

可视化工具
    数据可视化
    图形可视化

