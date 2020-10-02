new Promise(resolve=>resolve()).then(_=>console.log('1'))
setTimeout(()=>{
    console.log("2")
},0)
console.log("3")

//3
//1
//undefined
//2

/**
 * 宏任务1:
 *  微任务1:
 *      同步代码3
 *      promise产生了1了新的微任务2，加入队列
 *  微任务2:
 *      异步代码1
 * undefined第一个宏任务结束的标志
 * 宏任务2:
 *     异步代码2
 * 
 */

 //一个宏任务里的同步代码可以理解为微任务，只不过比别的微任务优先入队

async function  foo(params) {
    console.log("-2")
    await new Promise(resolve=>resolve());
    console.log("-1")
    //await可以理解为在await后面的分号后面加了个then，相当于语法上的then
    //await new Promise(resolve=>resolve('haha')).then
    //所以几乎可以理解为只有promise/then才会产生新的微任务

    await new Promise(resolve=>resolve());
    console.log("0.5")
}
new Promise(resolve=>(console.log("0"),resolve()))
    .then(_=>(
        console.log('1'),
        new Promise(resolve=>resolve())
            .then(_=>console.log("1.5"))))
setTimeout(()=>{
    console.log("2")
    new Promise(resolve=>resolve()).then(_=>console.log("3"))
},0)
console.log("4")
console.log("5")
foo()
/**
 * 宏任务1:
 *  微任务1:
 *      同步代码：
 *          执行promise 0，then产生微任务2加入队列，
 *          4，5
 *          调用foo，
 *              -2
 *              await产生微任务3加入队列//第一个await的微任务执行之后，第二个await才入队
 *  微任务2:
 *      异步代码1
 *      执行promise产生微任务4加入队列
 *  微任务3:
 *      异步代码 -1
 *      执行第二个await，产生微任务5加入队列
 *  微任务4:
 *      异步代码1.5
 *  微任务5:
 *      异步代码0.5
 * 
 * 宏任务2:
 *  微任务1:
 *      异步代码2，执行promise，产生微任务2加入队列
 *  微任务2:
 *      异步代码3
 * 
 * 
 * 
 */


 setTimeout(()=>new Promise(resolve=>resolve())
        .then(_=>console.log('cool'))),(1+1)

/**
 * 宏任务1:
 *      遇到settimout，生产新的宏任务2加入队列
 *   微任务1:
 *      同步代码2
 * 
 * 宏任务2:
 *  微任务1:
 *      产生promise，then产生新的微任务2放入队列
 *  微任务2:
 *      异步代码cool
 */

new Promise(resolve=>resolve())
.then(_=>{
    // let i =0
    // while(i<10000000000){
    //     i++
    // }
    console.log('cool')}),1+1
//cool
//宏任务返回值是2

new Promise(resolve=>resolve())
.then(_=>{
    let i =0
    while(i<100000000){
        i++
    }
    console.log('cool')});
    1+1
//cool
//注意此处console里出来的只是代表此次宏任务返回值是2。
//交换一下就是
1+1,new Promise(resolve=>resolve())
.then(_=>{
    // let i =0
    // while(i<10000000000){
    //     i++
    // }
    console.log('cool')})
// cool
// Promise {<resolved>: undefined}

//因此会先输出同步代码1+1，然后再cool
new Promise(resolve=>resolve())
.then(_=>{
    // let i =0
    // while(i<10000000000){
    //     i++
    // }
    console.log('cool')});
console.log(1+1)
/**
 * 宏任务：
 *  微任务1:
 *      执行promise，产生微任务2加入队列
 *      同步代码1+1
 *  微任务2:
 *      异步代码cool
 * 宏任务结束，返回值为undefined
 */

new Promise(resolve=>{
    console.log('resolve')
    resolve()})
.then(_=>{
    let i =0
    while(i<10000000000){
        i++
    }
    console.log('cool')}),1+3;
console.log(1+1)
//2
//cool
//undefined
//1+3不可能console出来，它不是宏任务的返回值

new Promise(resolve=>resolve())
.then(_=>{
    let i =0
    while(i<10000000000){
        i++
    }
    console.log('cool')});1+3;
console.log(1+1)
//2
//cool
//undefined

function sleep(duration) {
    return new Promise(function (resolve, reject) {
        console.log("b");
        setTimeout(function () {
            resolve();
            let i =0
            while(i<10000000000){
                i++
            }
            // var begin = Date.now();
            // while (Date.now() - begin < 1000);
            console.log("d");
        }, duration);
    })
}
console.log("a");
sleep(0).then(() => console.log("c")); 
/**
 * 宏任务1:
 *  微任务1:
 *      同步代码：
 *          "a"
 *          调用sleep
 *              执行promise
 *                  异步代码"b"
 *                  执行settimeout
 *                  返回timer
 *                      触发宏任务2
 *                          【注意】：promise里面是根据什么时候resolve，什么时候才新建微任务加入队列的
 *                          宏任务的reslolve execute了then里面的"c"这个函数
 *                      宏任务2结束                      
 *              返回promise                             
 *          产生新的微任务2
 *  微任务2:
 *      异步代码"c"
 * 
 * 
 * 宏任务2:setTimeout
 *      异步代码resolve了
 *      console"d"
 * a=>b=>d=>c
 */

async function async1() {
    console.log('async1 start');
    await async2();
    console.log('async1 end');
}
async function async2() {
    console.log('async2');
}
async1();
new Promise(function (resolve) {
    console.log('promise1');
    resolve();
}).then(function () {
    console.log('promise2');
});

/**
 * 宏任务1:
 * ·微任务1:
 *      同步代码：
 *          执行async1
 *              同步代码：async1 start
 *              await 的then是产生在;之后的，所以async2也是同步执行掉了
 *              同步调用 async2
 *              async2调用结束之后，产生新的微任务2加入队列
 *          执行promise：
 *              同步代码：promise1
 *              resolve产生新的微任务3加入队列
 * 微任务2async2之后的代码:
 *      async1 end
 * 微任务3:
 *      异步代码promise2
 * 
 */
 