// miniWeb.js
// define your Request, Response and App objects here
const net = require('net');
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
      		200:"OK",
		    404:"Not Found",
		    500:"Internal Server Error",
		    400:"Bad Request",
		    301:"Moved Permanently",
		    302:"Found",
		    303:"See Other"
    	};
    	this.types = {
      		html:"text/html",
      		css:"text/css",
      		txt:"text/txt",
      		jpeg:"image/jpeg",
      		jpg:"image/jpg",
      		png:"image/png",
      		gif:"image/gif"
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
		if(arguments.length > 0){
      		this.sock.end(s);
    	}else{
      		this.sock.end();
    	}
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
		let tempStatus;
    	if(arguments.length === 2){
      		tempStatus = statusCode;	
      		url = url;
    	}else if(arguments.length === 1){
      		tempStatus = 301;
      		url = statusCode;
    	}else{
      		throw new Error("incorrect number of arguments");
    	}
    	this.setHeader("Location", url);
    	this.statusCode = tempStatus; 
    	this.send(tempStatus, this.body);
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
		// console.log(fileName);
		const publicRoot = __dirname.slice(0,-3) + '/public';
		// console.log(publicRoot);
    	const filePath = publicRoot + fileName;
    	// console.log(filePath);
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

class App{
	constructor(){
		this.server = net.createServer(this.handleConnection.bind(this));
		this.routes = {};
	}
	get(path,cb){
		this.routes[path] = cb;
		// console.log('----------------------------------------');
		// console.log('this is the path: ' + path +  '\nthis is the cb: ' + this.routes[path]);
	}
	listen(port,host){
		// console.log('----------------------------------------');
		// console.log('this is the port: ' + port +  '\nthis is the host: ' + host);
		this.server.listen(port,host);
	}
	handleConnection(sock){
		sock.on('data', this.handleRequestData.bind(this, sock));
	}
	handleRequestData(sock, binaryData){
		const request = new Request(binaryData+'');
    	const response = new Response(sock);
    	const path = request.path;
    	if(request.headers["Host"] !== "localhost:8080"){
     		response.setHeader("Content-Type", "text/plain");
      		response.send(400, "Bad request");
      	} else if(this.routes.hasOwnProperty(path)){
      		this.routes[path](request,response);
      	} else {
      		response.setHeader("Content-Type", "text/plain");
      		response.send(404, "Page Not Found");
    	}
    	sock.on("close", this.logResponse.bind(this, request, response));
	}

	logResponse(request,response){
		console.log(`${request.path} ${request.method} ${response.statusCode} ${response.statusObject[response.statusCode]}`);
	}

	//const app = new App();
}

module.exports = {Request:Request, Response:Response, App:App};
