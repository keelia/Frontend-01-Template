import {parseHTML } from '../src/parser.js';
let assert = require('assert')
//import assert from 'assert'
describe('Html parser test', function () {
    it('parse a single element', function () {
        let doc = parseHTML("<div></div>")
        let div = doc.children[0]
        assert.equal(div.tagName,'div')
        assert.equal(div.children.length,0)
        assert.equal(div.type,'element')
        assert.equal(div.attributes.length,0)
    })

    it('parse a single element with text content', function () {
        let doc = parseHTML("<div>Hello</div>")
        let div = doc.children[0]
        let text = div.children[0]
        assert.equal(text.type,'text')
        assert.equal(text.content,'Hello')
    })

    it('tag mismatch ', function () {
        try {
            let doc = parseHTML("<div></vid>")
        } catch (error) {
            assert.equal(error.message,'Tag start end not match')
        }
    })

    it('text with <', function () {
        let doc = parseHTML("<div>a < b</div>")
        let div = doc.children[0]
        let text = div.children[0]
        assert.equal(text.type,'text')
        assert.equal(text.content,'a < b')
    })

    it('with props', function () {
        let doc = parseHTML("<div id=a data=\"abc\" class='cls'></div>")
        let div = doc.children[0]
        let count = 0
        for (const attr of div.attributes) {
            const attrItem = attr.value
            if(attrItem.attrName === "id"){
                count++
                assert.equal(attrItem.attrValue,'a')
            }
            if(attrItem.attrName === "class"){
                count++
                assert.equal(attrItem.attrValue,'cls')
            }
            if(attrItem.attrName === "data"){
                count++
                assert.equal(attrItem.attrValue,'abc')
            }
        }
        assert.ok(count === 3)
    })

    it('with props2', function () {
        let doc = parseHTML('<div id=a data=\'abc\' class="cls"></div>')
        let div = doc.children[0]
        let count = 0

        for (const attr of div.attributes) {
            const attrItem = attr.value
            if(attrItem.attrName === "id"){
                count++
                assert.equal(attrItem.attrValue,'a')
            }
            if(attrItem.attrName === "class"){
                count++
                assert.equal(attrItem.attrValue,'cls')
            }
            if(attrItem.attrName === "data"){
                count++
                assert.equal(attrItem.attrValue,'abc')
            }
        }
        assert.ok(count === 3)
    })

    it('with props3 selfclosed', function () {
        let doc = parseHTML('<div id=a data=\'abc\' class="cls"/>')
        let div = doc.children[0]
        let count = 0
        for (const attr of div.attributes) {
            const attrItem = attr.value
            if(attrItem.attrName === "id"){
                count++
                assert.equal(attrItem.attrValue,'a')
            }
            if(attrItem.attrName === "class"){
                count++
                assert.equal(attrItem.attrValue,'cls')
            }
            if(attrItem.attrName === "data"){
                count++
                assert.equal(attrItem.attrValue,'abc')
            }
        }
        assert.ok(count === 3)
    })

    it('selfclosed', function () {
        let doc = parseHTML('<div/>')
        let div = doc.children[0]
    })

    it('script', function () {
        let content =`<div>abcd</div>
        <span>x</span>
        /script>
        <script
        <
        </
        </s
        </sc
        </scr
        </scri
        </scrip
        </script `
        let doc = parseHTML(`<script>${content}</script>`)
        let scpt = doc.children[0]
        assert.equal(scpt.tagName,'script')
        assert.equal(scpt.children.length,1)
        assert.equal(scpt.type,'element')
        assert.equal(scpt.attributes.length,0)
        const child = scpt.children[0]
        assert.equal(child.type,'text')
        assert.equal(child.content,content)
    })


    it('attribut with no value', function () {
        let doc = parseHTML('<div class></div>')
        let div = doc.children[0]
        let count = 0
        for (const attr of div.attributes) {
            const attrItem = attr.value
            if(attrItem.attrName === "class"){
                count++
                assert.equal(attrItem.attrValue,'')
            }
        }
        assert.ok(count === 1)
    })

    it('attribut with no value', function () {
        let doc = parseHTML('<div class id data></div>')
        let div = doc.children[0]
        let count = 0
        for (const attr of div.attributes) {
            const attrItem = attr.value
            if(attrItem.attrName === "class"){
                count++
                assert.equal(attrItem.attrValue,'')
            }
            if(attrItem.attrName === "data"){
                count++
                assert.equal(attrItem.attrValue,'')
            }
            if(attrItem.attrName === "id"){
                count++
                assert.equal(attrItem.attrValue,'')
            }
        }
        assert.ok(count === 3)
    })

    it('html tag nam with no-char', function () {
        let doc = parseHTML('<d123>Hello!</d123>')
        let el = doc.children[0]
        const textContent = el.children[0]
        assert.equal(el.tagName,'d123')
        assert.equal(el.children.length,1)
        assert.equal(el.type,'element')
        assert.equal(textContent.type,'text')
        assert.equal(textContent.content,'Hello!')
    })

    it('attr name starts with equal-sign,switch to attrib name', function () {
        let doc = parseHTML('<div data=\'abc\' class=cls1 =cls2 id="123"></div>')
        let div = doc.children[0]
        let count = 0
        for (const attr of div.attributes) {
            const attrItem = attr.value
            if(attrItem.attrName === "class"){
                count++
                assert.equal(attrItem.attrValue,'cls1')
            }
            if(attrItem.attrName === "data"){
                count++
                assert.equal(attrItem.attrValue,'abc')
            }
            if(attrItem.attrName === "id"){
                count++
                assert.equal(attrItem.attrValue,'123')
            }
            if(attrItem.attrName === "=cls2"){
                count++
                assert.equal(attrItem.attrValue,'')
            }
        }
        assert.ok(count === 4)
    })

    it('missing attr value', function () {
        let doc = parseHTML('<div data=></div>')
        let div = doc.children[0]
        let count = 0
        for (const attr of div.attributes) {
            const attrItem = attr.value
            if(attrItem.attrName === "data"){
                count++
                assert.equal(attrItem.attrValue,'')
            }
        }
        assert.ok(count === 1)
    })

    it('missing attr value', function () {
        let doc = parseHTML('<div data ></div>')
        let div = doc.children[0]
        let count = 0
        for (const attr of div.attributes) {
            const attrItem = attr.value
            if(attrItem.attrName === "data"){
                count++
                assert.equal(attrItem.attrValue,'')
            }
        }
        assert.ok(count === 1)
    })

    it('missing white space between attrs', function () {
        let doc = parseHTML('<div data="abc"id=\'123\'class=cls></div>')
        let div = doc.children[0]
        let count = 0
        for (const attr of div.attributes) {
            const attrItem = attr.value
            if(attrItem.attrName === "class"){
                count++
                assert.equal(attrItem.attrValue,'cls')
            }
            if(attrItem.attrName === "data"){
                count++
                assert.equal(attrItem.attrValue,'abc')
            }
            if(attrItem.attrName === "id"){
                count++
                assert.equal(attrItem.attrValue,'123')
            }
        }
        assert.ok(count === 3)
    })

    it('slef closing tag', function () {
        let doc = parseHTML('<div/ data="abc"class=\'cls\'id=123>')
        let div = doc.children[0]
        console.log(div,div.attributes)
        let count = 0
        for (const attr of div.attributes) {
            const attrItem = attr.value
            if(attrItem.attrName === "class"){
                count++
                assert.equal(attrItem.attrValue,'cls')
            }
            if(attrItem.attrName === "data"){
                count++
                assert.equal(attrItem.attrValue,'abc')
            }
            if(attrItem.attrName === "id"){
                count++
                assert.equal(attrItem.attrValue,'123')
            }
        }
        assert.ok(count === 3)
    })

    it('end tag parse error', function () {
        let doc = parseHTML('</><div data/=>')
        let children = doc.children
        assert.equal(children.length,1)
        assert.equal(children[0].tagName,'div')
    })

    it('end tag parse error', function () {
        let doc = parseHTML('<div data==></div>')
        let div = doc.children[0]
        console.log(div,div.attributes)
    })

});