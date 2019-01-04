// fansite.js
// create your own fansite using your miniWeb framework
const HOST = '127.0.0.1';
const PORT = 8080;
const App = require('./miniWeb.js').App;
const app = new App();
// console.log('called app', app);

app.get('/', function(request,response){
	response.sendFile('/home.html');
});
app.get('/about', function(request,response){
	response.sendFile('/about.html');
});
app.get('/css/base.css', function(request,response){
	response.sendFile('/css/base.css');
});
app.get('/image1.jpg', function(request,response){
	response.sendFile('/img/image1.jpg');
});
app.get('/image2.png', function(request,response){
	response.sendFile('/img/image2.png');
});
app.get('/image3.gif', function(request,response){
	response.sendFile('/img/image3.gif');
});
app.get('/home', function(request,response){
	response.redirect('/');
});

app.get('/rando', function(request,response){
	let randomNum = Math.floor(Math.random()*(3))+1;
	let image = '';
	switch(randomNum){
		case 1:
			image = 'image1.jpg';
			break;
		case 2:
			image = 'image2.png';
			break;
		case 3:
			image = 'image3.gif';
			break;
	}
	response.send(200, "<html>\r\n" +
                        "<head>\r\n" +
                     		"<meta charset='utf-8'>\r\n" +
                     		"<link rel='stylesheet' type='text/css' href='/css/base.css'/>\r\n" +
                      		"<title>Image</title>\r\n" +
                        "</head>\r\n" +
                        "<body>\r\n" +
                            "<h1>No, this is Patrick</h1>\r\n" +
                            `<img src=' ${image}' width: 100% height: 100% >\r\n` +
                        "</body>\r\n" +
                 "</html>"
    );  

});

app.listen(PORT,HOST);