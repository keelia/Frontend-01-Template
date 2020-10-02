
    // setTimeout(()=>console.log("d"), 0)
    // var r = new Promise(function(resolve, reject){
    //     console.log('R:before resolve')
    //     resolve()
    // });
    // r.then(() => { 
    //     var begin = Date.now();
    //     console.log('begain',Date.now())
    //     while(Date.now() - begin < 1000);
    //     console.log('after begain',Date.now())
    //     console.log("c1") 
    //     new Promise(function(resolve, reject){
    //         resolve()
    //     }).then(() => console.log("c2"))
    // });

    // async function  foo(params) {
    //     console.log("-2")
    //     await new Promise(resolve=>resolve());
    //     console.log("-1")
    //     //await可以理解为在await后面的分号后面加了个then，相当于语法上的then
    //     //await new Promise(resolve=>resolve('haha')).then
    //     //所以几乎可以理解为只有promise/then才会产生新的微任务
    
    //     await new Promise(resolve=>resolve());
    //     console.log("0.5")
    // }
    // new Promise(resolve=>(console.log("0"),resolve()))
    //     .then(_=>(
    //         console.log('1'),
    //         new Promise(resolve=>resolve())
    //             .then(_=>console.log("1.5"))))
    // setTimeout(()=>{
    //     console.log("2")
    //     new Promise(resolve=>resolve()).then(_=>console.log("3"))
    // },0)
    // console.log("4")
    // console.log("5")
    // foo()
function sleep(timeout){
    return new Promise(resolve=>{
        setTimeout(resolve, timeout);
    })
}
    async function async1() {
        console.log('async1 start');
        await async2();
        console.log('async1 end');
    }
    async function async2() {
        console.log('async2 start');
        await sleep(0)
        console.log('async2 end');
    }
    async1();
    new Promise(function (resolve) {
        console.log('promise1');
        resolve();
    }).then(function () {
        var begin = Date.now();
        while(Date.now() - begin < 10000);
        console.log('promise2');
    });