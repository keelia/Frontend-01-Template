const css = require('css')
let rules = []
module.exports.addCSSRules = function addCSSRules(text){
    const ast = css.parse(text);
    //把css rules暂存在rules数组中
    rules.push(...ast.stylesheet.rules)
}

module.exports.computeCSS = function computeCSS(element){
   //console.log(rules)
    //console.log('compute css for',element)
    //记录父元素的序列
    const parents = [] //从距离element最近的父开始存
    let currentEl = element
    while(currentEl.parent){
        parents.push(currentEl.parent)
        currentEl = currentEl.parent
    }
    //拆分选择器
    if(!element.computedStyle){
        element.computedStyle = {}
    }
  
    //双数组的同时循环，看哪个先用尽
    for (const rule of rules) {
        const selectorParts = rule.selectors[0].split(" ").reverse()//reverse把“当前元素”的selector放在第一位
        if(!match(element,selectorParts[0])){//如果当前元素不匹配第一个selector，那就不用关了
            continue
        }
        //否则，当前元素匹配上了第一个selector
        var j = 1;//从第二个selector开始，看看parent有没有匹配到
        let ruleMatched = false;
        for (let i = 0; i < parents.length; i++) {//遍历当前元素的每个parent
            if(match(parents[i],selectorParts[j])){ //父元素中有命中selector中的某个的话，往前走一个selector,中途没匹配的话就继续走下一个parents
                j++;
            }
            if(j >= selectorParts.length){ //j走到头了，说明parents匹配成功了
                ruleMatched = true
                break;
            }
        }
       
        if(ruleMatched){
            //计算出来selector的specificity
            const sp = specificity(rule.selectors[0])
            const computedStyle = element.computedStyle

           //把rule里面的decalaration加在element上
           for (const declar of rule.declarations) {
                if(!computedStyle[declar.property]){
                    computedStyle[declar.property] = {}
                }
                if(!computedStyle[declar.property].specificity){
                    //specificity放在每个属性上
                    computedStyle[declar.property].value = declar.value;
                    computedStyle[declar.property].specificity = sp
                }else if(compare(computedStyle[declar.property].specificity,sp)){ //如果这个属性已经有sp了，需要compare
                    //如果原来的优先级低，就把新的sp覆盖上去，否则什么都不做
                    computedStyle[declar.property].value = declar.value;
                    computedStyle[declar.property].specificity = sp
                }
                //没有直接存成element.computedStyle[declar.property] = declar.value
                //为了方便后面判断属性的优先级，预留一个存优先级的地方
                //这里有个瑕疵，命中两条rule的元素，后面的rule会发生覆盖，如下，myid的img会被后面的rule覆盖掉
                // body div #myid{
                //     width:100px;
                //     background-color: #ff5000;
                // }
                // body div img{
                //     width:30px;
                //     background-color: #ff1111;
                // }
           }
           //console.log('we should add css style for element',element.computedStyle)

        }

    }

    //这里可以判断inline style，并覆盖
    // let inlineStyle = element.attributes.filter(att=>(att.name  == 'style')) //找到inline-style的attraibute
    // const parsedInlinestyle = css.parse(`* {${inlineStyle[0]}}`)//用css-parser parse出rule:用* {} 套成一个css 样式
    // const inlineStyleps= [1,0,0,0]//定义inline style的sp是【1，0，0，0】
    //然后跟matched的代码差不多，以下
    // const sp = specificity(rule.selectors[0])
    //         const computedStyle = element.computedStyle

    //        //把rule里面的decalaration加在element上
    //        for (const declar of rule.declarations) {
    //             if(!computedStyle[declar.property]){
    //                 computedStyle[declar.property] = {}
    //             }
    //             if(!computedStyle[declar.property].specificity){
    //                 //specificity放在每个属性上
    //                 computedStyle[declar.property].value = declar.value;
    //                 computedStyle[declar.property].specificity = sp
    //             }else if(compare(computedStyle[declar.property].specificity,sp)){ //如果这个属性已经有sp了，需要compare
    //                 //如果原来的优先级低，就把新的sp覆盖上去，否则什么都不做
    //                 computedStyle[declar.property].value = declar.value;
    //                 computedStyle[declar.property].specificity = sp
    //             }
    //             //没有直接存成element.computedStyle[declar.property] = declar.value
    //             //为了方便后面判断属性的优先级，预留一个存优先级的地方
    //             //这里有个瑕疵，命中两条rule的元素，后面的rule会发生覆盖，如下，myid的img会被后面的rule覆盖掉
    //             // body div #myid{
    //             //     width:100px;
    //             //     background-color: #ff5000;
    //             // }
    //             // body div img{
    //             //     width:30px;
    //             //     background-color: #ff1111;
    //             // }
    // }


}

function match(element,selector){
    if(!selector || !element.attributes){
        return false
    }
    return combinatorSelector(element,selector)
    //如果是复合选择器，需要用正则或者状态机把它的每个部分拆开
    //如 main>div.a#id[attr=value] 拆成:
    //main> 检查父亲
    //div
    //.a
    //#id
    //[attr=value]
}
function combinatorSelector(element,selector){
   // console.log('selector',selector)
    // console.log('res',res)
    let idPart ='',tagPart = '',classPart = '',attrPart = {
        attrProp:'',
        attrValue:''
    },parent = {
        tagPart:'',
        classPart:'',
        attrPart: {
            attrProp:'',
            attrValue:''
        },
        idPart:''
    }
    let state = start;
    let currentFilling = true
    if(selector.includes('>')){
        const [parentS,currentS] = selector.split('>')
        for(let c of currentS){
            state = state(c)
        }
        currentFilling = false
        state = start
        for(let c of parentS){
            state = state(c)
        }
    }else{
        let state = start
        for(let c of selector){
            state = state(c)
        }
    }
    
   
    function start(c){
        if(c === "#"){
            return idState
        }else if(c === "."){
            return classState
        }else if(c==='['){
            return attrProp
        }else if(/[a-zA-Z]/.test(c)){
            return tagState(c)
        }
        return end(c)
    }

    function idState(c){
        if(/[a-zA-Z0-9-_]/.test(c)){
            if(currentFilling){
                idPart+=c
            }else{
                parent.idPart+=c
            }
            return idState
        }else{
            return start(c)
        }
    }

    function classState(c){
        if(/[a-zA-Z0-9-_]/.test(c)){
            if(currentFilling){
                classPart+=c
            }else{
                parent.classPart+=c
            }
            return classState
        }else{
            return start(c)
        }
    }

    function tagState(c){
        if(/[a-zA-Z]/.test(c)){
            if(currentFilling){
                tagPart+=c
            }else{
                parent.tagPart+=c
            }
            return tagState
        }else{
            return start(c)
        }
    }

    function attrProp(c){
        if(c!=='='){
            if(currentFilling){
                attrPart.attrProp+=c
            }else{
                parent.attrPart.attrProp+=c
            }
            return attrProp
        }else{
            return attrValue
        }
    }

    function attrValue(c){
        if(c!==']'){
            if(currentFilling){
                attrPart.attrValue+=c
            }else{
                parent.attrPart.attrValue+=c
            }
            
            return attrValue
        }else{
            return start
        }
    }
    function end(c){
        return end
    }

    let tagPass=true,idPass=true,classPass=true,parentPass=true,attrPass=true;
    if(tagPart.length>0){
        //check element has tag or not
        tagPass = element.tagName === tagPart
    }
    if(classPart.length>0){
        const attr = element.attributes.filter(att=>(att.name  == 'attr') && (att.value.attrName == 'class'))[0]
        //class-attr的attrValue理论上是空格分隔的，所以应该用循环遍历class来判断
        //实现空格分隔的class选择器
        const classes = attr && attr.value.attrValue ? attr.value.attrValue.split(" ") : []
        classPass = !!classes.some(cls=>cls.replace(' ','')== classPart)
    }
    if(idPart.length>0){
        const attr = element.attributes.filter(att=>(att.name  == 'attr') && (att.value.attrName == 'id'))[0]
        idPass = !!(attr && attr.value.attrValue == idPart)
    }
    if(attrPart.attrProp.length>0){
        const attr = element.attributes.filter(att=>(att.name  == 'attr') && (att.value.attrName == attrPart.attrProp))[0]
        attrPass = attr && attr.value.attrValue === attrPart.attrValue
    }
    //parent check
    if(parent.tagPart.length>0){
        parentPass = element.parent && element.parent.tagName === parent.tagPart
    }
   //console.log('id:',idPart,idPass,'tag:',tagPart,tagPass,'cls:',classPart,classPass,'attr',attrPart,'parent:',parent)
    return tagPass && idPass && classPass && attrPass
}
//计算specificity
function specificity(selectorInRule){
    const p = [0,0,0,0] //inline-style,id,class,tag
    const selectorParts = selectorInRule.split(" ")
    for (const part of selectorParts) {
        //没有支持符合选择器div.a#y的话，这里要用正则再拆一层
        if(part.charAt(0) == '#'){
            p[1]+=1
        }else if(part.charAt(0) == '.'){
            p[2]+=1
        }else{
            p[3]+=1
        }
    }
    return p;
}

function compare(oldSp,newSp){
    //inline-style,id-100,class-10,tag-1
    const base = [1000,100,10,1]
    const oldp = oldSp.map((item,index)=>item*base[index]).reduce((a,c)=>a+c,0)
    const newp = newSp.map((item,index)=>item*base[index]).reduce((a,c)=>a+c,0)
    return oldp < newp
}