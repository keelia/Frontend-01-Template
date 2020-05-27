const cssParser = require('./css-parser');
const {layout} = require('./layout');
//文本节点的结束是文件结束作为标志的，但是目前这个分析器在没有遇到一个特殊标签之前，可能还会继续在补全字符的状态，所以没办法把最后的文本挂上去，
//所以这里用symbol（symbol都是唯一的），把它作为特殊字符作为end，标示文件结尾。因为字符都有被占位，所以没办法放一个string进去，而是用symbol。
//这是小技巧处理绝大多数匹配结尾的情况，有时如处理字符串时候也可能会需要一个标示结尾的东西，不一定是symbol。只要是唯一的东西都可以
const EOF= Symbol("EOF")//EOF: an end-of-file token.每个state都有个eof。

let currentToken = null
//用入栈出栈的方式构造dom树，最后栈里是没有元素的，所以先放一个document，最后用stack[0]把整个树拿出来
let stack = [{type:'document',children:[]} ]//标准也是一样：
/**
 12.2.6 Tree construction
 The input to the tree construction stage is a sequence of tokens from the tokenization stage.
 The tree construction stage is associated with a DOM Document object when a parser is created.
 */
let currentTextNode = null//处理文本节点：核心要素拼接文本内容
function data(c){//start state
    if(c == "<"){
        return tagOpen
    }else if(c === EOF){
        //Emit an end-of-file token.
        emit({
            type:"EOF"
        }) 
    }else{
        //Emit the current input character as a character token.
        emit({
            type:"text",
            content:c
        })
        return data
    }
}

function tagOpen(c){
    if(c == "/"){
        return endTagOpen
    }else if(c.match(/^[a-zA-Z]$/)){ //匹配字母
        //Create a new start tag token, set its tag name to the empty string. Reconsume in the tag name state.
        currentToken = {
            type:"startTag",
            tagName:""
        }
        return tagName(c) //回忆之前start(c)的代理写法，把字母都托管给tagName状态，而不是用tagName，这样会跳过当前这个字符。
        //对应标准里的“ Reconsume in the tag name state.” rensume就对应的tagName(C)后面的括号
    }else if(c == EOF){
        //This is an eof-before-tag-name parse error. Emit a U+003C LESS-THAN SIGN character token and an end-of-file token.
        emit({
            type:'text',
            content:'\u003c'
        })
        emit({
            type:'EOF'
        })
    }
    else{
         //This is an invalid-first-character-of-tag-name parse error. Emit a U+003C LESS-THAN SIGN character token. Reconsume in the data state.
        emit({
            type:'text',
            content:'\u003c'
        }) 
        return data(c)
    }
}

function tagName(c){
    if(c.match(/^[\t|\n|\f ]$/)){
        return beforAttributeName
    }else if(c == "/"){
        return selfClosingStartTag
    }else if(c.match(/^[a-zA-Z]$/)){
        //Append the lowercase version of the current input character (add 0x0020 to the character's code point) to the current tag token's tag name.
        currentToken.tagName+=c.toLowerCase();
        return tagName
    }else if(c == ">"){
        //Switch to the data state. Emit the current tag token.
        emit(currentToken) 
        return data
    }else if(c == EOF){
        //This is an eof-in-tag parse error. Emit an end-of-file token.
        emit({
            type:"EOF"
        }) 
    }
    else{
        //Append the current input character to the current tag token's tag name.
        currentToken.tagName+=c
        return tagName
    }
}

//简化，除了遇到>，其他都暂不处理
function beforAttributeName(c){
    if(c.match(/^[\t|\n|\f ]$/)){
        //Ignore the character.
        //return beforAttributeName
    }else if(c == "/"){//Reconsume in the after attribute name state.
        return afterAttributeName(c)
    }else if(c == ">"){
        return afterAttributeName(c)
    }else if(c == EOF){
        return afterAttributeName(c)
    }else if(c == "="){
        //This is an unexpected-equals-sign-before-attribute-name parse error.
        // Start a new attribute in the current tag token. 
        //Set that attribute's name to the current input character, and its value to the empty string. 
        //Switch to the attribute name state.
        currentToken.attr = {
            attrName:c,
            attrValue:''
        }
        return attributeName
    }
    else{
        //Start a new attribute in the current tag token. 
        //Set that attribute name and value to the empty string. 
        //Reconsume in the attribute name state.
        currentToken.attr = {
            attrName:'',
            attrValue:''
        }
        return attributeName(c)
    }
}
function attributeName(c){
    if(c.match(/^[>|/|\t|\n|\f ]$/)){
        //Reconsume in the after attribute name state.
        return afterAttributeName(c)
    }else if(c == EOF){
        return afterAttributeName(c)
    }else if(c == "="){
        return beforAttributeValue
    }else if(c.match(/^[a-zA-Z]$/)){
        //Append the lowercase version of the current input character (add 0x0020 to the character's code point) to the current attribute's name.
        currentToken.attr.attrName+=c.toLowerCase();
        return attributeName
    }else{
        //Append the current input character to the current attribute's name.
        currentToken.attr.attrName+=c.toLowerCase();
        return attributeName
    }
}
function afterAttributeName(c){
    if(c.match(/^[\t|\n|\f ]$/)){
        //Ignore the character.
        return afterAttributeName
    }else if(c == ">"){
        //Switch to the data state. Emit the current tag token.
        emit(currentToken)
        return data
    }else if(c == "="){
        return beforAttributeValue
    }
    else if(c == "/"){
        //Switch to the self-closing start tag state.
        return selfClosingStartTag
    }else if(c == EOF){
       // This is an eof-in-tag parse error. Emit an end-of-file token.
        emit({
            type:'EOF'
        })
    }else{
        //Start a new attribute in the current tag token.
        // Set that attribute name and value to the empty string. Reconsume in the attribute name state.
        currentToken.attr = {
            attrName:c,
            attrValue:''
        }
        return attributeName(c)
    }
}

function beforAttributeValue(c){
    if(c.match(/^[\t|\n|\f ]$/)){
        //Ignore the character.
        //return beforAttributeValue
    }else if(c == "\""){
        return doubleQuotedAttributeValue
    }else if(c == "\'"){
        return singleQuotedAttributeValue
    }else if(c == ">"){
        //This is a missing-attribute-value parse error. Switch to the data state. Emit the current tag token.
        emit(currentToken)
        return data
    }
    else{
        //Reconsume in the attribute value (unquoted) state.
        return unQuotedAttributeValue(c)
    }
}
function doubleQuotedAttributeValue(c){
    if(c == "\""){
        return afterQuotedAttributeValue
    }else if(c == EOF){
        //This is an eof-in-tag parse error. Emit an end-of-file token.
        return emit({
            type:'EOF'
        })
    }else{
        //Append the current input character to the current attribute's value.
        currentToken.attr.attrValue += c
        return doubleQuotedAttributeValue
    }
}
function singleQuotedAttributeValue(c){
    if(c = "\'"){
        return afterQuotedAttributeValue
    }else if(c == EOF){
        //This is an eof-in-tag parse error. Emit an end-of-file token.
        return emit({
            type:'EOF'
        })
    }else{
        //Append the current input character to the current attribute's value.
        currentToken.attr.attrValue += c
        return singleQuotedAttributeValue
    }
}
function unQuotedAttributeValue(c){
    if(c.match(/^[\t|\n|\f ]$/)){
        return beforAttributeName
    }else if(c == ">"){
        //Switch to the data state. Emit the current tag token.
        emit(currentToken)
        return data
    }else if(c == EOF){
        //This is an eof-in-tag parse error. Emit an end-of-file token.
        return emit({
            type:'EOF'
        })
    }else{
        //Append the current input character to the current attribute's value.
        currentToken.attr.attrValue += c
        return unQuotedAttributeValue
    }
}
function afterQuotedAttributeValue(c){
    if(c.match(/^[\t|\n|\f ]$/)){
        return beforAttributeName
    }else if(c == ">"){
        //Switch to the data state. Emit the current tag token.
        emit(currentToken)
        return data
    }else if(c == "/"){
        //Switch to the self-closing start tag state.
        return selfClosingStartTag
    }else if(c == EOF){
        //This is an eof-in-tag parse error. Emit an end-of-file token.
        return emit({
            type:'EOF'
        })
    }else{
        //This is a missing-whitespace-between-attributes parse error. Reconsume in the before attribute name state.
        return beforAttributeName(c)
    }
}

function selfClosingStartTag(c){
    if(c == ">"){
        //Set the self-closing flag of the current tag token. Switch to the data state. Emit the current tag token.
        currentToken.isSelfclosing = true
        emit(currentToken)
        return data
    }else if(c == EOF){
        //This is an eof-in-tag parse error. Emit an end-of-file token.
        emit({
            type:"EOF"
        })
    }
    else{
         //This is an unexpected-solidus-in-tag parse error. Reconsume in the before attribute name state.
         return beforAttributeName(c)
    }
}

function endTagOpen(c){
    if(c == ">"){
        //This is a missing-end-tag-name parse error. Switch to the data state.
        return data
    }else if(c.match(/^[a-zA-Z]$/)){ 
        //Create a new end tag token, set its tag name to the empty string. Reconsume in the tag name state.
        currentToken = {
            type:"endTag",
            tagName:""
        }
        return tagName(c)
    }else if(c == EOF){
        //This is an eof-before-tag-name parse error. Emit a U+003C LESS-THAN SIGN character token, a U+002F SOLIDUS character token and an end-of-file token.
        emit({
            type:"EOF"
        })
    }
    else{
         //This is an invalid-first-character-of-tag-name parse error. Create a comment token whose data is the empty string. Reconsume in the bogus comment state.
         //return data(c)
    }
}

function emit(token){ //提交我们生成的token
    let top = stack[stack.length - 1];//取一个栈顶，凡是新入栈的element一定是栈顶的子元素/children
    if(token.type == 'startTag'){
        //创建element,element是最终构造出来的东西，tag是文本层面的一种称呼，创建词法的时候需要的，是我们写代码的时候使用的。
        let element = {
            type:'element',
            children:[],
            attributes:[],
            parent:top//记录父亲元素便于css computing
        }
        element.tagName = token.tagName
        for (let prop in token) {
            if(prop!=="type" && prop!=='tagName'){
                element.attributes.push({
                    name:prop,
                    value:token[prop]
                })
            }
        }
        //可以认为只要创建了element，它就会有自己的css属性，因此在这里调用css computing,
        //跟style的添加不一样，我们希望尽可能的早计算css，如果也像style一样在出栈的时候才去计算css，
        //像有<main>这种很大型的父元素具有css属性将会在它的全部children出栈之后，它出栈的时候才会去计算，
        //但是有很多children的css属性是依赖父元素的，这样整个页面渲染的时间就会非常迟
        cssParser.computeCSS(element)
        
        top.children.push(element)//自封闭标签到这一步已经完成,只记录在父亲的children里面，不必入栈

        if(!token.isSelfclosing){//不是自封闭标签的话，入栈
            stack.push(element)
        }

        currentTextNode = null
    }else if(token.type == 'endTag'){
        //要在结束标签的位置计算layout，因为必须要拿到元素的子元素才可以layout
        //实际浏览器中是需要根据属性元素的属性做不同的判断，如在正常流中，基本不需要在endtag的地方，在starttag的地方就可以layout
        if(top.tagName !== token.tagName){
            throw(new Error('Tag start end not match'))
        }else{
            //收集css样式：遇到style标签时，添加css规则
            //在pop阶段才会执行css rule add，因为在入栈的时候，style的子元素 text content还没有收集到
            if(top.tagName == 'style'){
                // type: 'element',
                // children: [
                //     {
                //     type: 'text',
                //     content: '\n' +
                //         '      body div #myid{\n' +
                //         '          width:100px;\n' +
                //         '          background-color: #ff5000;\n' +
                //         '      }\n' +
                //         '      body div img{\n' +
                //         '          width:30px;\n' +
                //         '          background-color: #ff1111;\n' +
                //         '      }\n' +
                //         '  '
                //     }
                // ],
                // attributes: [],
                // tagName: 'style',
                cssParser.addCSSRules(top.children[0].content)
            }
            layout(top)
            stack.pop()//出栈
        }
        currentTextNode == null
    }else if(token.type == 'text'){
        if(currentTextNode == null){
            currentTextNode = {
                type:'text',
                content:""
            }
            top.children.push(currentTextNode)
        }
        currentTextNode.content += token.content
        //console.log(  currentTextNode.content )
    }
}


module.exports.parseHTML = function parseHTML(html){
    //console.log(html)    
    let state = data;
    for (let c of html) {
        state = state(c)
    }
    state = state(EOF)//只有找完全部字符，state才会等于end
    return stack[0]
}
// parseHTML( `<html maaa=a>
// <head>
//     <style>
// body div #myid{
//     width:100px;
//     background-color: #ff5000;
// }
// body div img{
//     width:30px;
//     background-color: #ff1111;
// }
//     </style>
// </head>
// <body>
//     <div>
//         <img id="myid"/>
//         <img />
//     </div>
// </body>
// </html>`)