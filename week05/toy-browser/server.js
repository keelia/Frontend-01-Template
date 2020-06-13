const http = require("http");
const server = http.createServer((req, res) => {
    console.log("request received");
    console.log(req.headers)
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('X-Foo', 'bar');
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(
`<html maaa=a>
  <head><style>
      #container{
        width:500px;
        height:300px;
        display:flex;
        background-color: rgb(255,192,203);
      }
      div#container div{
        width:100px;
        height:100px;
      }
      div#container>div#myid{
        background-color: rgb(127,255,212);
      }
      div#container div.c1{
        flex:1;
        height:100px;
        background-color: rgb(255,255,224);
      }
      div#container>div[data-set=purple]{
        width:150px;
        height:130px;
        background-color: rgb(147,112,219);
      }
      
  </style></head>
  <body><div id="container">
    <div id="myid"></div>
    <div data-set="purple"></div>
    <div class="c1"></div>
  </div></body>
</html>`
      );
  });

server.listen(8088)
