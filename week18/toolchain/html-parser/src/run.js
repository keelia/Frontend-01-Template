import { parseHTML } from "./parser.js";
let content =`</scrip`
let doc = parseHTML(`<script>${content}</script>`)
console.log(doc.children[0])