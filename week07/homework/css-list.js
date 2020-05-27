

var list = document.getElementById('container').children
var result = []
for (const li of list) {
    if(li.getAttribute('data-tag').match('css')){
        result.push({
            name:li.children[1].innerText,
            url:li.children[1].children[0].href
        })
    }
}
console.log(result)