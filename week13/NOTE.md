# Proxy 
    一般用于类库/框架；业务不用。

# 组件化基础
> 前端架构 = 80%组件化 + UI架构模式 + 零零碎碎基础库的需求

## 对象和组件
### 对象
* Properties
* Methods
* Inherit
### 组件
* Properties
* Methods
* Inherit
* Attribute
* Config & State【组件构造的时候就需要决定的一些设置】
* Event
* Lifecycle
* Children【每个组件体系必须要有children机制，虽然不是每个组件都需要有children】
> 以上的对象和组件的特性考虑清楚了之后，sfc或者jsx等只是组件化的实现手段，其实都是围绕着以上的8点特性去考虑的。

## 组件的组成:组件一般是用对象去抽象
- 组件内部： state；children
- 组件外部参数： attribute（component user's makeup code），method，property
- event：通过事件把组件内部的状态传递出去

### Attribute VS Property
- attribute 强调描述性【外部的感觉】
- property 强调从属关系【财产的感觉】对象更强调property

#### html的attribute和property[其他语言类似]
- property在html不能改,myComponent.a = "value",只能在js设置
- attribute能改, js和标记语言都可以设 
<pre>
    <code>
        <my-component attribute = "v'">
        myComponent.getAttribute('a')
        myComponent.setAttribute('a',value)
    </code>
</pre>

- 特例:
- - attribute和property有时有重叠的意思，如id
- - 有时是一回事，但是名字不一样html-class,js-className/classList
- - style html和js是不一样的
- -  href a.href的url是resolve的结果,a.getAttribute('href')跟html代码中完全一致，所以href是单向反射关系，修改a.href之后，href属性并不会返回到html上去
-  - value:input的value是单向的同步关系: 
<pre>
<code>
< input value = "cute"/>
</code>
</pre>
如果property没有设置，则input.value的结果和input.getAttribute('value‘)是一致的,都是cute
如果input.value = 'hello’，如value属性已经被设置，则attribute不变，input.value//hello,input.getAttribute('value‘)//cute
attribute像property的默认值一样，一旦property被修改过，attribute的value不再跟着变化

## 如何设计组件状态：
state只接受用户输入改变
config一般是全局的，一锤子买卖，只接受js的设置，不可以被js改变
<table>
    <tr>
        <td></td>
        <td>Markup set</td>
        <td>JS set</td>
        <td>JS Change</td>
        <td>User Input Change</td>
    </tr>
    <tr>
        <td>Property</td>
        <td>❌</td>
        <td>✅</td>
        <td>✅</td>
        <td>❓</td>
    </tr>
    <tr>
        <td>Attribute</td>
        <td>✅</td>
        <td>✅</td>
        <td>✅</td>
        <td>❓</td>
    </tr>
    <tr>
        <td>State</td>
        <td>❌</td>
        <td>❌</td>
        <td>❌</td>
        <td>✅</td>
    </tr>
    <tr>
        <td>Config</td>
        <td>❌</td>
        <td>✅</td>
        <td>❌</td>
        <td>❌</td>
    </tr>
</table>

    //基本的组件结构：
    class MyComponent{
    constructor(config){//config一般由js代码统一决定，大部分组件的创建使用< myComponent >这种声明式(标签)语言去创建，不太有机会去改new里面的东西的。config相当于env，写死的敞亮
        this.state = {i:1} //state是私有的变量
    }
    get prop1(){
    
    }
    set prop1(){
         
    }
    getAttribute(attr){

    }
    setAttribute(attr,value){
         
    }
    getChildren(){ }
    setChildren(){ }
    }
    //property和attribute可以一致也可以不一致，取决于想不想让：
    //myComponent.prop1 = 33 和下面这个tag上的attr1是一个东西，react选择让他们一致,但这种一致不是任何一个组件体系必须的
    \<myComponent attr1 ="33">


>react的constructor(prop),可以理解为react里面是prop是等效于config的
>react不分attr和prop的，可以理解为react只有property

## Lifecycle
- create
- mount/unmount
- js change/set
- user input
- render
- destroyed
- 以上的before/after状态

    class MyComponent extends Component{
    constructor(config){
        this.state = {i:1}
    }
    //这些hooks函数由外部被调用
    mounted(){}
    render(){}
    }
>不用为每个组件单独设定生命周期，只要一个组件系统出来了之后，各个组件的生命周期就是一致的

## Children
1. Content型 Children：跟html一样，放几个img就是几个img
        
        <my-button><img src="{{icon}}"/>{{title}}</my-button>
2. Templet型 Children：下面的li可能是多个，数量对应外面传的data
    
        <my-list><li><img src="{{icon}}"/>{{title}}</li></my-list>
>因此设计时，注意组件中写的children跟展现出来的children是有区别的

## 练习: 
为轮播组件设计它的state,property,attribute,children,config*(一般没有),event,method.
#### Carousel
+ state: activatedIndex
+ property: loop, time, imglist, color,forward
+ attribute: startIndex(跟activatedInext来对应,startIndex没有必要在property有，因为它只用一次，后面就交给state);也设计成跟property一样的
+ children: 如果property有imglist，这里就没有children，如果没有，这里的children就是imglist.children可以有append/remove/add.这里可以考虑分开设计Carousel 和 Carousel View两个组件，后者只负责播放
+ event: change,click/touch,hover,swipe,resize,doubleclick
+ method: 
  + next,prev,goto(如果activatedIndex放在property中，不放在state中，那么next/prev/goto也就不需要了，直接改activatedIndex即可)
  + play,stop(有autoplay的话，不需要有play(autoplay=true)/stop(autoplay=false))
+ config:全局设置，跟业务没有关系
  + 以下三种循环方式的选择可以配置成config：mode:"useRAF","useTimeout".
    + setInterval(tick,16)
    + 或者setTimeout()递归
    + 或者requestAnimationFrame()

>组件化需要解决的问题：用代码承载以上的设计

