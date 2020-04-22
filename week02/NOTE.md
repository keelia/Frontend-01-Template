# 每周总结可以写在这里
语言：
1.非形式语言（中文，英文，非严格定义，演化方式自由）
2.形式语言（乔姆斯基谱系）
  0型 无限制文法 -> 增加编译器的难度 ->等号两边可以有多个: ?::=? eg. <a><b> ::="c"
  1型 上下文相关文法 -> 等号两边的中间部分可以不同 : ?<a>?:==?<b>? eg. "a" <b> "c" :== "a" "x" "c"
  2型 上下文无关文法 大部分计算机语言都是主体上的上下文无关文法，等号左边只能有一个非终结符 -><a>::=?
  3型 正则文法（能用正则表达式表达的文法）-> 限制表达能力 -> 只允许左递归： 如果a出现在表达式的左边，那么它只能出现在右边表达式的开头/或|的结构的最开头
    <a>::= <a> ? (✅) <a>::=?<a> (❌)
  js在**出来之前都是左递归的，可以用正则表达式去分析的，js因为有了**所以实现了<a>::=?<a> ，所以js就落入了2型语法。

  计算机使用文法来处理语言：词法（语言分成单个的词）+语法（词作为输入流，用语法的规则）。如<DecimalNumber> = /0|[1-9][0-9]*/，扫描右边的正则表达式，就是词法分析，然后根据产生式去建立语法树/抽象语法树的过程叫语法分析。

  [重点：多加练习->如何去描述一门语言]产生式（bnf）：用尖括号扩起来的名称表示语法结构名
    语法结构 ->基础结构（终结符），引号和中间的字符表示终结符
          ->复合结构（非终结符），如表达式等
    可以有括号，
    *表示重复多次，
    |表示或，
    +表示1次或多次

    <Program> = ("a"+ | "b")+ 
    <Program> = <Program>"a"+ | <Program>"b"+

    <Number> = "0" | "1" | ... |"9"
    <DecimalNumber> = "0" | ("1" | "2" | ...|"9") + <Number>*

    <AdditiveExpression> = <DecimalNumber> "+" <DecimalNumber>
    <AdditiveExpression> = <AdditiveExpression> "+" <DecimalNumber>
    =>upgrade
    <AdditiveExpression> = <DecimalNumber> | ( <AdditiveExpression> "+" <DecimalNumber>)

    //用BNF实现四则运算
     <MultiplicativeExpression> = <DecimalNumber> | ( <MultiplicativeExpression> "*" <DecimalNumber>) | (<MultiplicativeExpression> "/" <DecimalNumber> )
     

    =>upgrade （如：1 * 3 + 4 || 5 + 6 && 3 * 4 + 9）
        <AdditiveExpression> = <MultiplicativeExpression> | ( <AdditiveExpression> "+" <MultiplicativeExpression>) | (
            <AdditiveExpression> "-" <MultiplicativeExpression>
        )

    <LogicalExpression> = （ <AdditiveExpression> | <LogicalExpression> ） "||" （ <AdditiveExpression> | <LogicalExpression> ） "&&" （ <AdditiveExpression> | <LogicalExpression> ）

    =>with braket
    <PrimaryExpression> = <DecimalNumber> | "(" <LogicalExpression> ")"
    
    [思考]用正则表达式来写/表达四则运算
    [小技巧]先把一些东西预处理，把它变为终结符，比如上述<DecimalNumber>
    <DecimalNumber> = /0|[1-9][0-9]*/十进制整数的正则表达式

    [提问] {get a(){return 1},get : 1}，get是几型文法？
    [答] 第一个get是obj的getter，第二个get成为了property name，所以get是js中为数不多的1型上下文相关文法。

    [**] 2**1**2 **是2型文法，除了**这种右结合的表达式（右边的先算，2**3**2 =>  2** （3 **2 ）），js里面的表达式部分基本都是正则文法，完全可以用正则去处理整个表达式的部分。
    <ExponentiationExpression> = <MultiplicativeExpression> | 
        <MultiplicativeExpression> "**" <ExponentiationExpression>
    <ExponentiationExpression>自己在右边；<MultiplicativeExpression>等的表达式自己在左边

    可以找找现成的能解析bnf的环境，看看自己写的


图灵完备性：跟图灵机等效的都叫做具有图灵完备性。
图灵机：凡是可计算的都可以被计算的，今天写的计算机语言都是图灵机的语法形式。
图灵停机问题：证明了世界上的一切不都是能被计算机解决的
所有计算机语言都必须具有图灵完备性
图灵机主流的实现方式3种
    命令式（2种）：
            ->goto
            ->if和while （有分支和循环就是具有图灵完备的）
    声明式（1种）：lambda具有图灵等效性
             ->递归和分支可以实现图灵完备性。警惕 凡是可以递归，就要注意是不是具有图灵完备性

动态语言和静态语言
    动态：
        在用户的设备和在线服务器上
        时间点：runtime/产品实际运行时
    静态：
        在程序员的设备上
        时间点：在产品开发时/compiletime

类型系统：
    动态类型系统
    静态类型系统【typescrip有静态类型系统】

强类型与弱类型：
    String + Number //隐式类型转换
    String == Boolean //Boolean ->Number -> compare with String
    弱类型是写起来爽，但是隐式类型转换会增加不可控性，纠错很难
【❕】不要混淆强弱类型和类型系统
    有隐式类型转换的类型叫弱类型，无隐式类型转换的叫强类型。
    ts属于弱类型，c++是弱类型，它有隐式类型转换

静态类型
    复合类型（2种）
        第一种：结构体（名字和类型的减值dui）：对象
        第二种：函数签名（函数的参数和返回值）（t1,t2）=>t3，位置必须对，类型必须对，数量必须对。

类型系统有了继承之后：子类型
    需要传type<Parent>的地方，传了<Children>也可以
    【协变】凡是能用Array<Parent>的地方，都能用Array<Child>。Array<Child>自然而然的继承了Array<Parent>
    函数的参数需要Child类型，但传个父类型进去，也可以
    【逆变】凡是能用Function<Child>的地方，都能用Function<Parent>，Function<Parent>自然而然的继承了Function<Child>

js本身是有继承关系，结构体，函数签名的，但是没有逆变和逆变，ts可以看作是在js上套了一个静态类型系统

一般的命令式编程语言的组成结构
    Atom:
        Identifier
        Literal
    Expression:
        Atom
        Operator
        Punctuator
    Statement:
        Expression
        Keyword
        Punctuactor
    Structure:
        Function
        Class
        Process
        Namespace
    Program:[js就Program和Module]
        Program
        Module
        Package
        Library

重学js：语法->语义->运行时
html，css是2型，但他们都不是图灵完备的，因为没有递归或者循环或者goto。有for或者for和if基本上一定是图灵完备。

csrf的处理：不要支持表单提交，而是用xmlhttp。或者不支持post get的表单提交
最有价值的：
操作系统|计算机网络|算法|数据结构
理解操作系统的机制，线程，信号量，锁，都是操作系统的东西，不是语言的。Windows编程/linix编程/安卓 来看操作系统
编译原理不是特别重要


参加开源项目
1.写文档
2.改bug
3.实现需求