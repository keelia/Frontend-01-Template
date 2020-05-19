//find "a" in string
function findA(str){
    return str.includes("a")
}

function findA(str){
    for (let c of str) {
        if(c == 'a'){
            return true
        }
    }
    return false
}
//find "ab" in string
function findAB(str){
    let foundA = false
    for (let c of str) {
        if(c == 'a'){
            foundA =  true
        }else if(foundA && c == 'b'){
            return true
        }else{
            foundA = false
        }
    }
    return false
}
// console.log(findAB('i am aaaaab'))
// console.log(findAB('i am ba'))

//find "abcdef" in string
function findABCDEF(str){
    let foundA = false
    let foundB = false
    let foundC = false
    let foundD = false
    let foundE = false
    for (let c of str) { 
        if(c == 'a'){  //相当于分成了一个一个的函数：状态即
            foundA =  true
        }else if(foundA && c == 'b'){
            foundB = true
        }else if(foundB && c == 'c'){
            foundC = true
        }else if(foundC && c == 'd'){
            foundD = true
        }else if(foundD && c == 'e'){
            foundE = true
        }else if(foundE && c == 'f'){
            return true
        }else{
            foundA = false
            foundB = false
            foundC = false
            foundD = false
            foundE = false
        }
    }
    return false
}


//状态机实现
function match(string){ //状态机的一般模版：永远有start。end，
    let state = start;
    for (let c of string) {
        state = state(c)
    }
    return state === end//只有找完全部字符，state才会等于end
}

function start(c){//只关心输入是不是a的
    if(c == "a"){ //如果输入不是a，不会foundA，因此不会改变下一个状态
        return foundA
    }else{
        return start //状态不变的意思
    }
}
function end(c){ //只要找到abcdef 后面是什么都无所谓了。小技巧，像一个trap，陷入到这一个状态里面
    return end
}

function foundA(c){
    if(c == 'b'){
        return foundB
    }else{
        //return start//退回start,因为要连续找出abcdef
        //update 小技巧：把本状态代理回原来的start状态（严格的状态机是不允许这样写的，必须老老实实的写前置的判断），喂给start再执行一遍结果
        //为了要解决aabcdef仍然可以被找到，不然找到第一个a之后进入foundA状态，下一个不是b，会重新回到start
        //这里相当于把第二个a又转回了findA。
        //这里不是递归，不是自己调用自己
        return start(c)
    }
}
function foundB(c){
    if(c  == 'c'){
        return foundC
    }else{
        //return start
        return start(c)
    }
}
function foundC(c){
    if(c  == 'd'){
        return foundD
    }else{
        //return start
        return start(c)
    }
}
function foundD(c){
    if(c  == 'e'){
        return foundE
    }else{
       //return start
       return start(c)
    }
}
function foundE(c){
    if(c  == 'f'){
        return end
    }else{
       // return start
        return start(c)
    }
}
//console.log(match('i abm groot cdef'))
//console.log(match('i abm groot abcdefoot'))
//console.log(match('i aabcdefoot'))

//如何处理abcabx字符串：find abcabx
function match(string){ //状态机的一般模版
    let state = start;
    for (let c of string) {
        state = state(c)
    }
    return state === end//只有找完全部字符，state才会等于end
}

function start(c){//只关心输入是不是a的
    if(c == "a"){ //如果输入不是a，不会foundA，因此不会改变下一个状态
        return foundA
    }else{
        return start //状态不变的意思
    }
}
function end(c){ //只要找到abcdef 后面是什么都无所谓了。小技巧，像一个trap，陷入到这一个状态里面
    return end
}

function foundA(c){
    if(c == 'b'){
        return foundB
    }else{
        return start(c)
    }
}
function foundB(c){
    if(c  == 'c'){
        return foundA2
    }else{
        return start(c)
    }
}
function foundA2(c){
    if(c  == 'a'){
        return foundB2
    }else{
        return start(c)
    }
}
function foundB2(c){
    if(c  == 'b'){
        return foundX
    }else{
       return start(c)
    }
}
function foundX(c){
    if(c == 'x'){
        return end
    }else{
        //如果到了要处理是不是x的地步，说明前面两个已经确定是ab了，因此类似回到start状态，这里应该回到foundB：如果不是第二个ab，回到第一个ab的状态
        return foundB(c) //return start(c)这样无法处理abcabcabx
    }
}
//console.log(match('abcabx'))
console.log(match('abcabcabx'))