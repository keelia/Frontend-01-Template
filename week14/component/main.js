function create(Cls,attributes,...children){
    let o;
    if(typeof Cls === "string"){//小写div会被传入成string
        o = new Wrapper(Cls)
    }else{
        o = new Cls({
            timer:1234
        })//global config
    }
   
    for (const name in attributes) {
        //o.setAttribute(name,attributes[name])
        //如果想property和attribute完全一样，就可以直接:
        o[name]=attributes[name]
    }
    
    for (const child of children) {
       // o.children.push(child)
       if(typeof child === 'string'){
        child = new Text(child)
       }
       console.log(child)
       
       o.appendChild(child)
    }
    return o
}
// class Parent{
//     constructor(config){
//         this.children = []
//         this.root = document.createElement("div")
//     }
//     set class(v){//property
//         console.log('Parent::class',v)
//     }
//     set id(v){//property
//         console.log('Parent::id',v)
//     }
//     setAttribute(name,value){//attribute
//         this.root.setAttribute(name,value)
//     }
//     appendChild(child){
//         console.log('Parent:appendchild',child)
//         child.mountTo(this.root)
//         this.children.push(child)
//     }

//     mountTo(parent){
//         parent.appendChild(this.root)
//     }
// }
// class Child{
//     constructor(config){
//         this.children = []
//         this.root = document.createElement("div")
//     }
//     set class(v){//property
//         console.log('Parent::class',v)
//     }
//     set id(v){//property
//         console.log('Parent::id',v)
//     }
//     setAttribute(name,value){//attribute
//         this.root.setAttribute(name,value)
//     }
//     appendChild(child){
//         console.log('child:appendChild',child)
//         child.mountTo(this.root)
//         this.children.push(child)
//     }
    
//     mountTo(parent){
//         parent.appendChild(this.root)
//     }
// }
class Wrapper{
    constructor(type){
        this.children = []
        this.root = document.createElement(type)
    }
    set class(v){//property
        console.log('Parent::class',v)
    }
    set id(v){//property
        console.log('Parent::id',v)
    }
    setAttribute(name,value){//attribute
        this.root.setAttribute(name,value)
    }
    appendChild(child){
        this.children.push(child)
       // child.mountTo(this.root)
    }
    
    mountTo(parent){
        parent.appendChild(this.root)
        //mountTo是生命周期的函数，所以把child挂上去的时候，不发生在appendchild时，而应该是把自己挂上去的时候，再把自己的child挂上去
        for (const child of this.children) {
            child.mountTo(this.root)
        }
    }
}
class Text{//text 不用回有child/attr/pperos
    constructor(text){
        this.children = []
        this.root = document.createTextNode(text)
    }
    mountTo(parent){
        parent.appendChild(this.root)
    }
}
//以上为架构代码
//以下为业务代码：写了就有
class MyComponent{
    constructor(config){
        //config 尽量不要写在这里，而是用gloabl的config去向constructor传参
        this.children = []
        //this.root = document.createElement("div")
        //也可以把attribute和pros用分开
        this.attributes = new Map()
        this.properties = new Map()
    }
    set class(v){//property
        console.log('Parent::class',v)
    }
    set id(v){//property
        console.log('Parent::id',v)
    }

    set title(v){//property
        this.properties.set('title',v)
    }
    
    setAttribute(name,value){//attribute
        //应该把attributes存起来，然后在人的人里面去处理
        this.attributes.set(name,value)
       // this.root.setAttribute(name,value)
    }
    appendChild(child){
        //child.mountTo(this.root)
       this.children.push(child)
    }
    
    mountTo(parent){
        this.slot = <div></div>
        //parent.appendChild(this.root)
        //mountTo是生命周期的函数，所以把child挂上去的时候，不发生在appendchild时，而应该是把自己挂上去的时候，再把自己的child挂上去
        for (const child of this.children) {
            this.slot.appendChild(child)
            //child.mountTo(this.root)
        }
        this.render().mountTo(parent)
    }
    render(){
        return <article>
            {/* <h1>{this.attributes.get("title")}</h1> */}
            <h2>{this.properties.get("title")}</h2>
            <header>Header</header>
            { this.slot }
            <footer>Footer</footer>
        </article>
    }
}


// let component = <div id="a" class="b" style="width:100px;height:100px;background:red;">
//     <div></div>
//     <p></p>
//     <div></div>
//     <div></div>
// </div>
let component = <MyComponent title="this is a title">
    <div id="a" class="b" style="width:100px;height:100px;background:pink;">
        {new Wrapper('span')}
        <div>htttt</div>
    </div>
    </MyComponent>
component.class ="c"
component.id ="d"
//component.title ="property title"
component.mountTo(document.body)
console.log(component)
//component.setAttribute("id","b")