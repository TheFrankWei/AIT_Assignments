// evenWarmer.js
// create Request and Response constructors...

const net = require('net');
const HOST = '127.0.0.1';
const PORT = 8080;
const fs = require('fs');


class Request{

	constructor(httpRequest){
		this.httpRequest = httpRequest;
		let parsedHttp = httpRequest.split('\r\n\r\n');
		let beforeBody = parsedHttp[0].split('\r\n');
		let pathMethodParse = beforeBody[0].split(' ');
		this.method = pathMethodParse[0];
		this.path = pathMethodParse[1];
		this.headers = {};
		
		let headerParse = beforeBody.slice(1,beforeBody.length);

		for(let i = 0; i < headerParse.length; i ++){
			let result = headerParse[i].split(': ');
			this.headers[result[0]]=result[1];
		}

		if(parsedHttp.length > 1){
			this.body = parsedHttp[1];
		}


	}
	toString(){
		return this.httpRequest;
	}
}

class Response{
	constructor(sock){
		this.sock = sock;
    	this.headers = {};
    	this.body = '';
    	this.statusCode = '';
    	
		this.statusObject = {
      		200: "OK",
		    404: 'Not Found',
		    500: 'Internal Server Error',
		    400: "Bad Request",
		    301: "Moved Permanently",
		    302: 'Found',
		    303: 'See Other'
    	};
    	this.types = {
      		html: "text/html",
      		css: "text/css",
      		txt: "text/txt",
      		jpeg: "image/jpeg",
      		jpg: 'image/jpg',
      		png: 'image/png',
      		gif: 'image/gif'
    	};
	}

	setHeader(name,value){
		this.headers[name] = value;
	}

	write(data){
		this.body = data;
		this.sock.write(data);
	}

	end(s){
		this.sock.end(s);
	}

	send(statusCode,body){
		this.statusCode = statusCode;
    	this.body = body;
    	this.end(this.toString());
	}

	writeHead(statusCode){
		this.statusCode = statusCode;

	    let statusString = ''
    	statusString += (`HTTP/1.1 ${this.statusCode} ${this.statusObject[this.statusCode]}\r\n`);
    	for(let val in this.headers){
      		if(this.headers.hasOwnProperty(val)){
        		statusString += `${val}: ${this.headers[val]}\r\n`
      		}
    	}
    	statusString+= '\r\n';
    	this.write(statusString);
	}

	redirect(statusCode, url){
    	if(arguments.length === 2){
      		this.statusCode = statusCode;	
      		this.url = url;
    	}else if(arguments.length === 1){
      		statusCode = 301;
      		url = arguments[0];
    	}else{
      		throw new Error("incorrect number of arguments");
    	}
    	this.setHeader("Location", url);
    	this.send(statusCode, this.body);
	}

	toString(){
		let s= '';
    	s+= (`HTTP/1.1 ${this.statusCode} ${this.statusObject[this.statusCode]}\r\n`);
    	for(let x in this.headers){
      		if(this.headers.hasOwnProperty(x)){
        		s+= (`${x}: ${this.headers[x]}\r\n`);
      		}
    	}
    	s+= '\r\n';
    	s+= (`${this.body}`);
    	return s;
	}

	sendFile(fileName){
		const publicRoot = __dirname.slice(0,-4) + '/public';
    	const filePath = publicRoot + fileName;
    	let encoding;
    	let fileType = '';
   			for(let i=0; i<fileName.length; i++){
      			if(fileName[i] === "."){
        			fileType += fileName.slice(i+1).trim();
      			}
    		}
    	
    	if(this.types[fileType].split('/')[0] === "text"){
      		encoding = 'utf8';
    	}else if(this.types[fileType].split('/')[0] === 'image'){
      		encoding = null;
    	}
    	fs.readFile(filePath, encoding, (err,data) => {
        	if(err){
          		this.setHeader('Content-Type', 'text/plain');
          		this.send(500, 'Internal Server Error');
          		throw err;
        	}else{
	          	this.setHeader('Content-Type', this.types[fileType]);
	          	this.writeHead(200);
	          	this.write(data);
	          	this.end();
        }
      });
	}
}



const server = net.createServer((sock) => {
   // console.log(`got connection from ${sock.remoteAddress}:${sock.remotePort}`);

    sock.on('data', function(binaryData) {
    //console.log('got data\n=====\n' + binaryData); 
    const request = new Request(binaryData+' ');
    const response = new Response(sock);
    if(request.path === "/"){
      response.setHeader('Content-Type','text/html');
      response.send(200,'<link rel = "stylesheet" type = "text/css" href = "foo.css"> <h2>this is a red header</h2><em>Hello</em> <strong>World</strong>');
  	}else if(request.path === "/foo.css"){
      response.setHeader('Content-Type', 'text/css');
      response.send(200, 'h2 {color: red;}');
    }else if(request.path === "/test"){
      response.sendFile("/html/test.html");
    }else if(request.path === "/img/bmo1.gif"){
      response.sendFile("/img/bmo1.gif");
    }else{
      response.setHeader('Content-Type', 'text/plain');
      response.send(404, 'uh oh... 404 page not found!');
    }
	});
});
server.listen(PORT, HOST);

module.exports = {Request:Request, Response:Response};