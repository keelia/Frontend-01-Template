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
      body div #myid{
          background-color: #ff5000;
      }
      body div img{
          width:30px;
          background-color: #ff1111;
      }
      #container{
        width:500px;
        height:300px;
        display:flex;
      }
      #container #myid{
        width:200px
      }
      #container .c1{
        flex:1;
      }
  </style></head>
  <body><div id="container">
    <div id="myid"></div>
    <div class="c1"></div>
  </div></body>
</html>`
      );
  });

server.listen(8088)
// <img  class="second-img"/>