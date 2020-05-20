# 有限状态机处理字符串
用处：做游戏，敌人的ai/处理字符串/编译原理/ai算法

1.每个状态都是一个机器，机器互相独立。不同于平时的“状态”（用变量表示状态），每个状态都表示成一个机器，可以存储变量输出
每个状态机接受的输入都是一致的，参数一致的函数。
    在每个机器里，我们可以做计算/存储/输出 
    所有这些机器接受的输入是一致的
    状态机的每个机器本身没有状态，如果用函数表示，买个状态应该是纯函数（纯函数：不能依赖外部环境不停的发生变化，不能有影响输出的副作用。可以在状态机里面储存数据的，也可以往外写）【状态机没有封装的必要，纯函数已是极简，封装会变复杂】
    状态机的状态改变只能是因为输入，输入改变状态或者不改变状态。

状态机本身无法封装，但是状态机的处理过程，可以被封装。如正则就是状态机处理字符串的一种封装
    
每个机器知道下一个状态：
    每个机器都有确定的下一个状态（moore）
    每个机器根据输入决定下一个状态（mealy）【常用】

状态机跟状态模式有相似的地方，但是没有直接联系。
多数的状态，都跟状态机没有关系。而是跟状态模式有关系。
generator是可以实现状态机的，可以用generator来改造状态机。
马尔可夫链，状态转译矩阵，就是状态机。
正则底层使用状态机来实现的

在一个字符串中找到字符“a”

# js中的有限状态机
每个函数是一个状态
function state(input)//函数参数就是输入
{
    //函数中，可以自由的编写代码，处理每个状态的逻辑
    return next;//返回值作为下一个状态
    //如果返回值是固定值，那么就是moore型的状态机.如果返回值跟input有关，用if else来判断返回值，那么就是mealy型状态机。
}

//以下是调用
while(input){
    //获取输入
    state = state(input) //把状态机的返回值作为下一个状态
}
状态机可以实现kmp等效版本，可以完成到正则的程度

作业：
    状态机完成“abababx”的处理
可选作业：
    如何用状态机处理完全未知的pattern。pattern 其实最终可以到正则的程度。
    ！完成kmp等效的状态机，时间复杂度om+n，两个字符串pattern+string长度之和。
    ！不要用原始的kmp去做，要用状态机去完成，
    hint：状态可能是生成的，js里面闭包的使用；所有的状态都不是手写的了；应该要用到数组；
    match(pattern,string){
        ///????
    }
    match('ababx','i am ababx!hahah');

参考资料：wiki：fsm