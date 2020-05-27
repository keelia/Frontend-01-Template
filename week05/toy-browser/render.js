const images = require('images')
 module.exports.render = function render(viewpoint,element){
    //console.log(viewpoint,element)
    if(element.style){//绘制单个元素
        const img = images(element.style.width,element.style.height) //不一定是css写的宽高，而是layout计算来的
        if(element.style['background-color']){
            let color = element.style['background-color'] || 'rgb(255,255,255)'
            color.match(/rgb\((\d+),(\d+),(\d+)\)/)
            img.fill(Number(RegExp.$1),Number(RegExp.$2),Number(RegExp.$3),1) //渲染
            viewpoint.draw(img,element.style.left || 0,element.style.top || 0)//绘制
        }
    }
    //绘制dom
    if(element.children){
        for (const child of element.children) {
                render(viewpoint,child)
        }
    }
 }