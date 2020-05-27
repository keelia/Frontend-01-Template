//Client就是toy browser的内容
const net = require("net");
const parser = require('./parser');
const images = require('images')
const render = require('./render')
//用net的库，而不用http库来访问server，把需要的html拿回来，来实现浏览器；
class ResponseParser{
    constructor(){
        this.WAITING_STATUS_LINE =0//HTTP/1.1 200 OK
        this.WAITING_STATUS_LINE_END =1;
        this.WAITING_HEADER_NAME = 2;
        this.WAITING_HEADER_SPACE = 3;//header name的冒号后面还有个空格
        this.WAITING_HEADER_VALUE = 4;
        this.WAITING_HEADER_LINE_END = 5; //以\r\n结尾
        this.WAITING_HEADER_BLOCK_END = 6;//以\r\n\r\n结尾
        this.WAITING_BODY = 7;//以\r\n\r\n结尾

        this.current = this.WAITING_STATUS_LINE
        this.statusLine = ""
        this.headers = {}
        this.headerName = ""
        this.headerValue = ""
        this.bodyParser = null //一般在解析完header才去创建的，通过header的‘Transfer-Encoding’ 去创建
    }
    get isFinished(){
        return this.bodyParser && this.bodyParser.isFinished
    }
    get response(){
        this.statusLine.match(/HTTP\/1.1 ([0-9]+)([\s\S]+)/)
        return {
            statusCode:RegExp.$1,
            statusText:RegExp.$2,
            headers:this.headers,
            body :this.bodyParser.content.join('')
        }
    };

    receive(string){
        for (let i = 0; i < string.length; i++) {
            this.receiveCharacter(string.charAt(i))
        }
    }

    receiveCharacter(char){
        switch (this.current) {
            case this.WAITING_STATUS_LINE://以\r , \n结束
                if(char === '\r'){
                    this.current = this.WAITING_STATUS_LINE_END
                }else{
                    this.statusLine+=char
                }
                break;
            case this.WAITING_STATUS_LINE_END://以\r , \n结束
                if(char === '\n'){
                    this.current = this.WAITING_HEADER_NAME
                }
                break;
            case this.WAITING_HEADER_NAME://以:结束
                if(char === '\r'){
                    this.current = this.WAITING_HEADER_BLOCK_END
                }else if(char === ':'){
                    this.current = this.WAITING_HEADER_SPACE
                }else{
                    this.headerName+=char
                }
                break;
            case this.WAITING_HEADER_SPACE:
                if(char === ' '){
                    this.current = this.WAITING_HEADER_VALUE
                }
                break;
            case this.WAITING_HEADER_VALUE: //headervalue以\r做分节符
                if(char === '\r'){
                    this.current = this.WAITING_HEADER_LINE_END//header有多行,所以需要写进headers
                    this.headers[this.headerName] = this.headerValue
                    //empty headerName,headerValue
                    this.headerName = ''
                    this.headerValue = ''
                }else{
                    this.headerValue+=char
                }
                break;
            case this.WAITING_HEADER_LINE_END: 
                if(char === '\n'){
                    this.current = this.WAITING_HEADER_NAME
                }
                break;
            case this.WAITING_HEADER_BLOCK_END:
                if(char === '\n'){
                    this.current = this.WAITING_BODY
                    if(this.headers['Transfer-Encoding'] === 'chunked'){
                        this.bodyParser = new TrunkedBodyParser()
                    }
                }
                break
            case this.WAITING_BODY: 
                this.bodyParser.receiveCharacter(char)
                break;
            default:
                break;
        }
    }
}

class TrunkedBodyParser{
    //每次读一个数字，然后读这个数字(decimal)固定的字符。chuncked最后肯定是0\r\n结尾。
    constructor(){
        this.WAITING_LENGTH = 0
        this.WAITING_LENGTH_LINE_END = 1
        this.READING_TRUNK = 2;
        this.WAITING_NEW_LINE = 3
        this.WAITING_NEW_LINE_END = 4
        this.READING_TRUNK_END = 5

        this.isFinished = false
        this.length = 0 //计数器：记住trunck的大小（多少字符）它是16进制数
        this.content = []
        this.current = this.WAITING_LENGTH
    }
    
    receiveCharacter(char){
        switch (this.current) {
            case this.WAITING_LENGTH:
                if(char === '\r'){
                    if(this.length === 0){
                        this.isFinished = true
                    }
                    this.current = this.WAITING_LENGTH_LINE_END
                }else{
                    //length是16进制数
                    this.length *= 16
                    this.length += parseInt(char,16)
                }
                break;
            case this.WAITING_LENGTH_LINE_END:
                if(char === '\n'){
                    this.current = this.READING_TRUNK
                }
                break;
            case this.READING_TRUNK:
                if(char === '\r'){
                    this.current = this.READING_TRUNK_END
                }else{
                    this.content.push(char)
                    this.length--
                    if(this.length ===0){
                        this.current = this.WAITING_NEW_LINE
                    }
                }
                break;
            case this.WAITING_NEW_LINE:
                if(char === '\r'){
                    this.current = this.WAITING_NEW_LINE_END
                }
                break;
            case this.WAITING_NEW_LINE_END:
                if(char ==='\n'){
                    this.current = this.WAITING_LENGTH
                }
                break;
            default:
                break;
        }
    }
}

class Request{
    //method,url = host +port + path
    //body:k/v
    //headers
    constructor(options){
        this.method = options.method || "GET";
        this.host = options.host;
        this.port = options.port || 80;
        this.path = options.path || '/'
        this.body  = options.body ||{}
        this.headers = options.headers || {}
        if(!this.headers['Content-Type']){
            this.headers['Content-Type'] = 'application/x-www-form-urlencoded'
        }
        if(this.headers['Content-Type'] === 'application/json'){
            this.bodyText = JSON.stringify(this.body)
        }else if(this.headers['Content-Type'] === 'application/x-www-form-urlencoded'){
            this.bodyText = Object.keys(this.body).map(key=>`${key}=${encodeURIComponent(this.body[key])}`).join('&')
        }
        this.headers['Content-Length'] = this.bodyText.length
    }

    toString(){
        //POST / HTTP/1.1\r\n Content-Type : application/x-www-form-urlencoded\r\n Content-length: 11\r\n name=keelia
        //request line + 
        return `${this.method} ${this.path} HTTP/1.1\r\n${Object.keys(this.headers).map(key=>`${key}: ${this.headers[key]}`).join('\r\n')}\r\n\r\n${this.bodyText}\r\n`
    }

    send(connection){
        return new Promise((resolve,reject)=>{
            const parser = new ResponseParser
            if(connection){
                connection.write(this.toString())
            }else{
                connection = net.createConnection({
                    host:this.host,
                    port:this.port
                },()=>{
                    connection.write(this.toString())
                })
            }
            connection.on('data', (data) => { //tcp是流式数据，受到data的时候根本不知道是不是个完整的数据，不能直接new response，而是用responseparser。用状态机parse
                parser.receive(data.toString())
                if(parser.isFinished){
                    resolve(parser.response)
                }
                connection.end();
            });
            connection.on('error', (error) => {
                reject(error)
                connection.end();
            });
        })
    }
}

void async function(){
    let request = new Request({
        method:'POST',
        host:'127.0.0.1',
        port:8088,
        path:'/',
        headers:{
            ["X-Foo2"]:"customed"
        },
        body:{
            name:'keelia'
        }
    })
    let response = await request.send()
    let dom = parser.parseHTML(response.body)
   // const tobeRender = dom.children[0].children[2].children[0].children[3]
    let viewpoint = images(800,600) //viewpoint:多大的空间画图/浏览器的网页部分
    render.render(viewpoint,dom)
    viewpoint.save('viewpoint.jpg')
}()



// const client = net.createConnection({ 
//     host:'127.0.0.1',
//     port: 8088 }, () => {
//     // 'connect' listener.
//     console.log('connected to server!');
//     let request = new Request({
//         method:'POST',
//         host:'127.0.0.1',
//         port:8088,
//         path:'/',
//         headers:{
//             ["X-Foo2"]:"customed"
//         },
//         body:{
//             name:'keelia'
//         }
//     })
//     console.log(request.headers)
//     client.write(request.toString())
//     // client.write(`POST / HTTP/1.1\r\n
//     // Content-Type : application/x-www-form-urlencoded\r\n
//     // Content-length: 11\r\n
//     // name=keelia`)
//     // client.write('POST / HTTP/1.1\r\n');
//     // client.write('Host: 127.0.0.1\r\n');
//     // client.write('Content-length: 20\r\n');
//     // client.write('Content-Type : application/x-www-form-urlencoded\r\n');
//     // client.write('\r\n');
//     // client.write('field1=aaa&code=x%3D1\r\n');
//     // client.write('\r\n');
//   });
//   client.on('data', (data) => {
//     console.log('hihi',data.toString());
//     client.end();
//   });
//   client.on('end', () => {
//     console.log('disconnected from server');
//   });

