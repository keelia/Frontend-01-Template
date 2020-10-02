可以研究一下infinity nan在内存里的排布
[要深入理解float这个类型在内存里的排布和表示方法]

grammar：

代码层面来看，运算符的优先级其实是树结构生成的语法

left-hand-side-expressions【包括member,new,call expession】：
    member expression：返回的是reference类型（两部分组成：object,key）只有delete和assign才体现出来引用的特性。只有member expression能保持引用的特性
    比如：
        a.b，a[b]【a必须是对象】b可以是symbol或者string
        super.b，super[b]（super只能在构造函数中用，调用父类的方法和属性）,
        new.target(只能在new function的构造函数里面用，可以访问new的目标的对象，存在目的)
        //new.target 的意义
        function foo(){
            console.log(this)
        }
        foo()//undefined
        new foo()//foo(){}

        //但是存在伪造obj，使其prototype指向foo
        const fakeObject = {}
        Object.setPrototypeOf(fakeObject,foo.prototype)
        fakeObject.constructor = foo
        //这时候
        foo.apply(fakeObject)//把fakeObject当作this穿进去
        //这时候会console出来foo(constructor:f)
        //在new.target出来之前，只用function里面的this的话，
        //是没有办法判断得到的object是用new构造出来的，还是普通的方法调用的
        //instanceof也不好使，因为它是走原型链去检查，fakeObject instanceof foo //true


        function foo(){
            console.log(new.target)
        }
        //new.target可以判断是不是用new调用的，被哪一个view调起来的。
        //或者在一些method里面再调用一下constructor，本来已经是new出来的实例，
        //再再上面apply一个foo（再调用一下constructor），就更无从判断
    foo`传参数`【foo必须是个对象，至于是不是函数，就是运行时的事了】
        primaryexpression：相当于atom

    new Foo和new Foo()优先级不一样：带()的优先级更高
   
    比new优先级更低的就是call：
        foo()/super()
        foo()['b']函数调用之后再访问member express，会先foo()，再访问b。member expression的优先级变低了。同样的new foo()['b'],会先执行new foo()，为了让new的逻辑更顺畅，符合人类预期。[只要函数调用参与的member expression，它的优先级就降低到了比new更低]
        但是new foo['b']还是会先执行foo['b']的。
        foo()`abc`//函数可以返回一个函数，然后接template

js来说，左手表达式的极限是call（foo()）。等号的左边必须是一个reference，语法上必须是lefthandside
left-handside/right-handside指的是等号的左边和右边

right-hand-side：
    Updateexpression【自增运算符】：自增/自减就必须是个number类型才可以
    a++
    a--
    --a
    ++a
    eg:
        ++ a ++ //Error
        ++ (a ++ )//Error
     page 178:11.9.1 
        Update expression = letfhandsideExpression + [no lineterminator]++
        literminator是换行符之类的
        思考：
            var a =1,b=1,c=1;
            a
            ++
            b
            ++
            c
            谁自增了？ a++中间，a后面不能有换行（literminator），所以被认为是++b,++c了，b,c自增了。
            同时多行注释也会被认为是换行:
            a/**
            */b/*
            */++
            c
            以上也是b,c自增了

    Unary expression【单目运算符】：
        delete a.b 【a.b就必须是个reference类型，不然都会错】
        void foo()【void 是一个运算符，不像c++之类的代表不返回任何指，void的意思是，后面不管跟了什么都会返回undefind,生成undefind最好的方法是用void 0，以后就忘记undefined，而是用viod 0 来产生undefined，以免全局变量undefined被篡改】
        type of a [a可以是任意]
        +a 【a必须是number】
        -a【a必须是number】
        ~a 【a必须是整数number】
        !a 【a必须是boolean型】
        await a【a必须是promise】
        [void]：
            立即执行函数

    Exponental:
        ** 【a必须是number】
        唯一一个右结合的运算符:3**2**3 => 3**(2**3)
    Muluiplicative:
        */%【a必须是number】
    Additive:
        +【a必须是number，string】
        -【a必须是number】
    Shift:
        << >> >>> 【a必须是整数number】
    Relationship:
        <> <= >= 【a必须是number】
        instance of 
        in：for in里面不能用in 【in后面必须是对象，in前面必须是string或者symbol】
    Equlity: 等号逻辑上也属于比较（relationship），但是等号的优先级低于> <
        == != === !==
    Bitwise:
        & ^ | 【a必须是整数number】
    Logical:逻辑运行不会进行类型转换
        && || 
        [短路逻辑] function foo(){
                        console.log(1)
                        return false
                    }
                    function foo2(){
                        console.log(2)
                        return false
                    }
                    foo() && foo2() //foo()先算，如果返回true才执行foo2,所以可以把&&和||当作if用
    Conditional:也不会进行类型转换
        ?:也是短路逻辑，true？foo(）：foo2(); foo2()不会执行
    逗号：
        相当于表达式里面的分号，优先级最低

【箭头➕表达式其实是图灵完备的语言】

【js里面有几种加法？】
    1.number类型的加法，两边都转换成数字才能相加
    2.string类型的加法，两边都转换成字符串才能相加
【js里面有几种乘法？】
    1种乘法，只有数字能相乘。凡是乘法都会自动转换成number，8*'abc'//NaN

[Type convertion的规则]
Number
String
Boolean
    以上三个不带new，调用他们返回的就是基本类型String('1')//1

Symbol
虽然：new String('hello').length //5 'hello'.length //5,但是typeof ‘hello'//string type of new String('hello')//object
同时new String('hello') 和’hello'类型转换的规则不一样，new String会统一按照object去转，所以！new String("")//false !""/true


对象是不能出现在表达式左边的，以跟block statement的大括号进行区分。所以：
{
    a:1
}
这种情况不会被理解成一个对象，a会被理解成一个label

对象不是数据存储的工具，结构体就是数据存储的工具

一只典型的鱼，然后用它来描述别的鱼跟它的不同，a鱼的鳞片比典型的鱼更深，或者b鱼比典型的鱼更长。

boundfunction:Functon.prototype.bind(this)
js标准里面[[]]双括号表示特殊的属性


[Array Exotic Object]
    Length:
        1. whenever an own property is added whose name is an array index, the value of the "length" property is changed,
            var a = []
            console.log(a.length)//0
            a[2] = void 0;
            console.log(a.length)//3
        2.whenever the value of the "length" property is changed, every own property whose name is an array index whose value is not smaller than the new length is deleted
            a.length = 2
            a// [empty × 2]

[String Exotic Object]
    1. have 2 kinds of data properties. Both of them are non-writable and non-configurable.
        A: integer-indexed data properties
        B: length data properties

[Arguments Exoitc Object]
    1. Object.prototype.toString.apply(arguments) :[object Arguments]
    2. An arguments exotic object is an exotic object whose array index properties map to the formal parameters bindings of an invocation of its associated ECMAScript function.
        function argFunc(a,b,c){
            arguments[2] = 5 //Or  c = 5
            console.log(arguments[2],c)//5,5
        }
        argFunc(1,'2',void 0,null,{x:1},[2,3,4])

[Integer-Indexed(an integer index whose numeric value i is in the range +0 ≤ i < 232 - 1) Exotic Objects]:
    [[ViewedArrayBuffer]]
    [[ArrayLength]]
    [[ByteOffset]]
    [[TypedArrayName]] 

[Immutable Prototype Exotic Objects]:An immutable prototype exotic object is an exotic object that has a [[Prototype]] internal slot that will not change once it is initialized.

[Proxy Object]:
    [[ProxyHandler]]
    [[ProxyTarget]]
