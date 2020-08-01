# Carousel组件优化
## 添加支持child
> 如何实现tabpanel，将每个child都包裹一个div?:this.children.map返回一个jsx
> optianl作业：将carousel也改造成一个内容性的组件

## 为什么有组件的概念？
> 组件通常代表一个ui的元素，组件的特性properties,methods,inherit(这三个也是对象的特性),attribute代表了声明式编程相关的特性，config带来了全局相关的能力， state体现了组件内部状态的变化，event能从组件接受东西,lifecycle定义组件的方式,children使得能够以树形的结构去描述一个复杂的界面。提供了下一个层次的一组抽象能力，很适用于ui的一种抽象方式
## 组件化的方案到底如何承载，是非常自由的
> 用什么样的方式去承载，可以用不同的语言/方式.如react的hooks用一个函数来把一个组件相关的东西去描述清楚，去掉了properties,methods,inherit这三个相关的东西,properties和attributes是一回事，也没有config，state和event会完全把组件重新render,省了不少事。

## 学习组件系统的理论知识，获得一些设计组件系统的灵感，不用拘泥于react/vue等某种形式之中

## 学习组件系统的用处：可以自己写一个组件系统，当再去看react/vue的时候，不用再去理解一边他们相关的概念，而是了解一个组件系统的终点在哪里，轻松上手一个组件系统的框架

> 我们自己写的组件没有重新render的功能，跟react有很大的区别,react是有event/state变化的时候，马上进行reander，当然操作的是微dom，操作完去做比对，再考虑要不要更新真正的dom。重新render的模式：不需要考虑patch的模式，也不用考虑set/get attribute函数

除了树形的组件，有时候还有列表的需求ListView

## 管理组件的css
> 用cssloader把组件的css用js依赖进来
> css只需要append一次

## 如何封装组件的css，不让它的style污染全局?
> 自定义自己的css-loader;自定义loader，有了parser之后，将carousel的name作为css rule的前缀,不然别的全局变量污染组件的style。自定义laoder不是唯一的scope方案，最好的方案是给每个组件添加root上的attribute。