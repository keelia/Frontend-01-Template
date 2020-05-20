//如何用状态机处理完全未知的pattern
console.log(matchWithKMP('ababx','i am ababx!hahah'))//true
console.log(matchWithKMP('abs','i am ababx!hahah'))//false
console.log(matchWithKMP('abs','i am abs ababx!hahah')) //true
console.log(matchWithKMP('mml','i ammm mml ababx!hahah'))//true


function matchWithKMP(pattern,str){
    const  alreadyMatchedInStr =  {}
    const patternFns = pattern.split('').map((patternC,patternCIndex)=>{
        return (c)=>{
            //Check if c matched pattern 
            //console.log('check if',c ,'is match?',patternC)
            if(c == patternC){
                //save already matched
                //console.log('matched')
                alreadyMatchedInStr[patternC] = patternCIndex
                if((patternCIndex+1) > (pattern.length -1)){
                   // console.log('partten end')
                    return patternFns[patternFns.length - 1]
                }else{
                   // console.log('gonext pattern')
                    return patternFns[patternCIndex+1]
                }
            }else{
                if(patternCIndex === 0){
                    return patternFns[0]
                }else{
                    //console.log(patternFns[alreadyMatchedInStr[patternC]])
                    if(!isNaN(alreadyMatchedInStr[patternC]) && (alreadyMatchedInStr[patternC] > -1)){
                        return patternFns[alreadyMatchedInStr[patternC]]
                    }else{
                        return patternFns[0].call(this,c)
                    }
                }
            }
        }
    })
    let state = patternFns[0]
    for(let c of str){
        state = state(c)
    }
    return state == patternFns[patternFns.length - 1]
}
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

//KMP Code
//function generate(str){
    //     let m = str.length
    //     let ret = [-1]
    //     let k = -1
    //     for (let i = 1;i < m;i++) {
    //         while (k != -1 && str[k+1]!= str[i]){
    //             k = ret[k]
    //         }
    //         if(str[k+1] === str[i]){
    //             k = k + 1
    //         }
    //         ret[i] = k
    //     }
    //     return ret
    // }
// function matchWithKMP(pattern,str){
//     const next = generate(str)
//     let j = 0
//     let i = 0;
//     let matched = false
//     for(;i<str.length;++i){
//         if(str[i] == pattern[j]){
//             j++
//             if(j == pattern.length){
//                 matched = true
//                 break;
//             }
//         }else if(j == 0){
//             continue
//        }else{
//            j = next[j-1] > -1 ? next[j-1] :0
//        }
//     }
//     if(matched){
//         const startIndex = i - pattern.length + 1
//         return str.substr(startIndex,pattern.length)
//     }else{
//         return 'Not Found'
//     }
// }
