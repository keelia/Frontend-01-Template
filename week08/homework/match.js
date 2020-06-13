function match(element,selector){
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
     let parentTagPass=true,parentIdPass=true, parentClassPass=true,parentAttrPass=true
     if(parent.tagPart.length>0){
         parentTagPass = element.parent && element.parent.tagName === parent.tagPart
     }
     if(parent.classPart.length>0){
         const attr = element.parents.attributes.filter(att=>(att.name  == 'attr') && (att.value.attrName == 'class'))[0]
         const classes = attr && attr.value.attrValue ? attr.value.attrValue.split(" ") : []
         parentClassPass = !!classes.some(cls=>cls.replace(' ','')== parent.classPart)
     }
     if(parent.idPart.length>0){
         const attr = element.parent.attributes.filter(att=>(att.name  == 'attr') && (att.value.attrName == 'id'))[0]
         parentIdPass = !!(attr && attr.value.attrValue == parent.idPart)
     }
     if(parent.attrPart.attrProp.length>0){
         const attr = element.parent.attributes.filter(att=>(att.name  == 'attr') && (att.value.attrName == attrPart.attrProp))[0]
         parentAttrPass = attr && attr.value.attrValue === parent.attrPart.attrValue
     }
     parentPass = parentTagPass && parentIdPass && parentClassPass && parentAttrPass
     return tagPass && idPass && classPass && attrPass && parentPass
 }