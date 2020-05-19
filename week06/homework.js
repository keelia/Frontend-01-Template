//状态机完成“abababx”的处理
function match(str){
    let state = start;
    for (let c of str) {
        state = state(c)
    }
    return state === end
}
function start(c){
    if(c == 'a'){
        return findA1
    }else{
        return start
    }
}
function end(c){
    return end
}

function findA1(c){
    if(c == 'b'){
        return findB1
    }else{
        return start(c)
    }
}
function findB1(c){
    if(c == 'a'){
        return findA2
    }else{
        return start(c)
    }
}
function findA2(c){
    if(c == 'b'){
        return findB2
    }else{
        return findB1(c)
    }
}
function findB2(c){
    if(c == 'a'){
        return findA3
    }else{
        return findA2(c)
    }
}
function findA3(c){
    if(c == 'b'){
        return findB3
    }else{
        return findB2(c)
    }
}
function findB3(c){
    if(c == 'x'){
        return end
    }else{
        return findA3(c)
    }
}
//console.log(match('abababx')) //true
//console.log(match('ababababx')) //true
//console.log(match('abacbababx')) //false
//console.log(match('abbbbababx')) //false
//console.log(match('abababxxxx')) //true

//如何用状态机处理完全未知的pattern
console.log(matchWithKMP('ababx','i am ababx!hahah'))
console.log(matchWithKMP('abs','i am ababx!hahah'))
console.log(matchWithKMP('abs','i am abs ababx!hahah'))
console.log(matchWithKMP('mml','i ammm mml ababx!hahah'))
// function matchWithKMP(pattern,str){
//     const next = generate(str)
//     let j = 0
//     let i = 0
//     for(;i<str.length;++i){
//         if(str[i] == pattern[j]){
//             j++
//             if(j == pattern.length){
//                 break;
//             }
//         }else if(j == 0){
//             continue
//        }else{
//            j = next[j-1] > -1 ? next[j-1] :0
//        }
//     }
//     const startIndex = i - pattern.length + 1
//     return JSON.stringify(str.substr(startIndex,pattern.length))
// }


function generate(str){
    let m = str.length
    let ret = [-1]
    let k = -1
    for (let i = 1;i < m;i++) {
        while (k != -1 && str[k+1]!= str[i]){
            k = ret[k]
        }
        if(str[k+1] === str[i]){
            k = k + 1
        }
        ret[i] = k
    }
    return ret
}

function matchWithKMP(pattern,str){
    const next = generate(str)
    let j = 0
    let i = -1
    let endIndex;
    let state = start
    for(let c of str){
        i++
        state = state(c)
        if(state == end && !endIndex){
            endIndex = i
        }
    }
    function start(c){
        //console.log(i,j,JSON.stringify(c))
        if(c == pattern[j]){
            //console.log(c,'get matched forword')
            return forword(c)
        }else{
            //console.log(c,'not match,backword j')
            return backword
        }
    }

    function end(c){
        return end
    }
    function forword(c){
        j++
        if(j ==  pattern.length){
           // console.log(c,'in the enn')
            return end
        }else{
            //console.log(c,'reset start match')
            return start
        }
    }
    function backword(c){
        if(j == 0){
            //console.log(c,'stay at 0')
            return start
        }else{
            //console.log(c,'put back')
            j = next[j-1] > -1 ? next[j-1] :0
            return start
        }
    }
    const startIndex = endIndex - pattern.length+1
    //console.log(i,j,endIndex,startIndex)
    return JSON.stringify(str.substr(startIndex,pattern.length))
}
