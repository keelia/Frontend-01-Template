// let pattern= [
//     [0,0,0],
//     [0,0,0],
//     [0,0,0]
// ]
let pattern= [
    1,0,0,
    0,0,0,
    0,0,0
]
let color = 2

const icons = ['\u2B55','\u274c']//o,x
// function show(){
//     const container = document.getElementById('container')
//     container.innerHTML =""
//     for (let index = 0; index < pattern.length; index++) {
//         const line = pattern[index]
//         for (let itemIndex = 0; itemIndex < line.length; itemIndex++) {
//             const cell = document.createElement('div')
//             cell.setAttribute('class','cell')
//             if(line[itemIndex]==1){
//                 cell.innerHTML =icons[0]
//             }else if(line[itemIndex]==2){
//                 cell.innerHTML =icons[1]
//             }
//             cell.addEventListener("click",()=>move(itemIndex,index))
//             container.appendChild(cell)
//         }
//     }
// }
show()

// function move(x,y){//user move
//     if(pattern[y][x]!==0){
//         return
//     }
//     pattern[y][x] = color;
//     if(win(pattern,color,x,y)){
//         alert(color===2?`${icons[1]} is winner!`:`${icons[0]} is winner!`)
//     }
//     color = 3 - color;//swith between 1/2
//     show()
//     computerMove(x,y)
//  }
 function move(x,y){//user move
    if(pattern[y*3+x]!==0){
        return
    }
    pattern[y*3+x] = color;
    if(win(pattern,color,x,y)){
        alert(color===2?`${icons[1]} is winner!`:`${icons[0]} is winner!`)
    }
    color = 3 - color;//swith between 1/2
    show()
    computerMove(x,y)
 }
// function computerMove(x,y){
//     let choice = bestChoice(pattern,color)
//     if(choice.point){
//         pattern[choice.point[1]][choice.point[0]] = color
//     }
//     if(win(pattern,color,x,y)){
//         alert(color===2?`${icons[1]} is winner!`:`${icons[0]} is winner!`)
//     }
//     color = 3-color
//     show()
// }
function computerMove(x,y){
    let choice = bestChoice(pattern,color)
    if(choice.point){
        pattern[choice.point[1]*3+choice.point[0]] = color
    }
    if(win(pattern,color,x,y)){
        alert(color===2?`${icons[1]} is winner!`:`${icons[0]} is winner!`)
    }
    color = 3-color
    show()
}
// function win(pattern,color,x,y){
//     //hor
//     for (let i = 0; i < 3; i++) {
//         let win = true
//         for (let j = 0; j < 3; j++) {
//             if(pattern[i][j]!== color){
//                 win=false
//                 break
//             }
//         }
//         if(win){
//             return true
//         }
//     }
    
//     //vertical
//     for (let i = 0; i < 3; i++) {
//         let win = true
//         for (let j = 0; j < 3; j++) {
//             if(pattern[j][i]!== color){
//                 win=false
//                 break
//             }
//         }
//         if(win){
//             return true
//         }
//     }
//     //cross: left-right
//     {
//         let win = true
//         for (let i = 0; i < 3; i++) {
//             if(pattern[i][i]!== color){
//                 win = false
//                 break
//             }
//         }
//         if(win){
//             return true
//         }
//     }
//     //cross:right-left
//     {
//         let win = true
//         for (let i = 0; i < 3; i++) {
//             if(pattern[i][2-i]!== color){//relation:x+y=2
//                 win=false
//                 break
//             }
//         }
//         if(win){
//             return true
//         }
//     }
//     return false
// }
function win(pattern,color,x,y){
    //hor
    for (let i = 0; i < 3; i++) {
        let win = true
        for (let j = 0; j < 3; j++) {
            if(pattern[i*3+j]!== color){
                win=false
                break
            }
        }
        if(win){
            return true
        }
    }
    
    //vertical
    for (let i = 0; i < 3; i++) {
        let win = true
        for (let j = 0; j < 3; j++) {
            if(pattern[j*3+i]!== color){
                win=false
                break
            }
        }
        if(win){
            return true
        }
    }
    //cross: left-right
    {
        let win = true
        for (let i = 0; i < 3; i++) {
            if(pattern[i *3 +i]!== color){
                win = false
                break
            }
        }
        if(win){
            return true
        }
    }
    //cross:right-left
    {
        let win = true
        for (let i = 0; i < 3; i++) {
            if(pattern[i*3+2-i]!== color){//relation:x+y=2
                win=false
                break
            }
        }
        if(win){
            return true
        }
    }
    return false
}
// function willWin(pattern,color){
//     for (let i = 0; i < 3; i++) {
//         for (let j = 0; j < 3; j++) {
//             if(pattern[i][j]!==0){
//                 continue;
//             }else{
//                 let temp =clone(pattern)//也可以不用colon，而是在win check只会把temp[i][j]改回去
//                 temp[i][j] = color
//                 if(win(temp,color,)){
//                     return [j,i]
//                 }
//             }
//         }
//     }
//     return null
// }
function willWin(pattern,color){
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if(pattern[i *3 + j]!==0){
                continue;
            }else{
                let temp =clone(pattern)//也可以不用colon，而是在win check只会把temp[i][j]改回去
                temp[i*3+j] = color
                if(win(temp,color,)){
                    return [j,i]
                }
            }
        }
    }
    return null
}
//存一个棋谱进去，作为开局
let openings = new Map()
openings.set([
    [0,0,0],
    [0,0,0],
    [0,0,0]
].toString()+"1",{
    point:[1,1],
    result:0
})
//在存一个棋谱，加快bestchoice的搜索速度
openings.set([
    [0,0,0],
    [0,1,0],
    [0,0,0]
].toString()+"2",{
    point:[0,0],
    result:0
})


//轮到自己走的时候才能判断bestChoice，所以注意color代表的某方
// function bestChoice(pattern,color){
//     if(openings.has(pattern.toString()+color)){
//         return openings.get(pattern.toString()+color)
//     }
//     let point = willWin(pattern,color)
//     //如果我要赢了，就return willWin
//     if(point){//递归的终止条件1
//         return {
//             point,
//             result:1//-1:lose 1:win 0:none
//         }
//     }
//     //不然就尝试在可以走的每一步上，看对方最差的情况
//     let result = -1 //假设自己是最差的情况
//     outter:for (let i = 0; i < 3; i++) {
//         for (let j = 0; j < 3; j++) {
//             if(pattern[i][j]!==0){
//                 continue;
//             }else{
//                 let temp =clone(pattern)
//                 temp[i][j] = color
//                 let opp = bestChoice(temp,3-color)//得到对方最好的情况
//                 if(-opp.result >= result){ //对面最坏的情况就是我最好的情况
//                     point = [j,i]
//                     result = -opp.result
//                 }
//                 //只要有一个点赢了，就不需要再往下走了,不需要遍历对方全部的可能
//                 if(result ==1){
//                     break outter;
//                 }
//             }
//         }
//     }
//     return {//递归的终止条件2
//         point,
//         result:point ? result :0 
//     }
// }
function bestChoice(pattern,color){
    // if(openings.has(pattern.toString()+color)){
    //     return openings.get(pattern.toString()+color)
    // }
    let point = willWin(pattern,color)
    //如果我要赢了，就return willWin
    if(point){//递归的终止条件1
        return {
            point,
            result:1//-1:lose 1:win 0:none
        }
    }
    //不然就尝试在可以走的每一步上，看对方最差的情况
    let result = -1 //假设自己是最差的情况
    outter:for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if(pattern[i*3+j]!==0){
                continue;
            }else{
                let temp =clone(pattern)
                temp[i*3+j] = color
                let opp = bestChoice(temp,3-color)//得到对方最好的情况
                if(-opp.result >= result){ //对面最坏的情况就是我最好的情况
                    point = [j,i]
                    result = -opp.result
                }
                //只要有一个点赢了，就不需要再往下走了,不需要遍历对方全部的可能
                if(result ==1){
                    break outter;
                }
            }
        }
    }
    return {//递归的终止条件2
        point,
        result:point ? result :0 
    }
}


function clone(pattern){
    return Object.create(pattern)//一维数组的clone方式，把一维数组作为原型创建一个新对象，要取这个新对象的属性就会去数组上去找，创建新对象没费任何代价
    return JSON.parse(JSON.stringify(pattern))
}




function show(){
    const container = document.getElementById('container')
    container.innerHTML =""
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            const cell = document.createElement('div')
            cell.setAttribute('class','cell')
            if(pattern[i*3+j]==1){
                cell.innerHTML =icons[0]
            }else if(pattern[i*3+j]==2){
                cell.innerHTML =icons[1]
            }
            cell.addEventListener("click",()=>move(j,i))
            container.appendChild(cell)
        }
    }
}

