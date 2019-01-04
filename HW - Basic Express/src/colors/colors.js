// colors.js
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const fs = require('fs');
const path = require('path');

let name;
var data = fs.readFileSync('colors.txt', 'utf8');
			// console.log(data);
			// function(err,data){
data = data.trim();
let content = data.split('\n');
// console.log(content);

function color(r,g,b){
	this.r = r
	this.g = g
	this.b = b
	// console.log(this.r + 'this.r');
	// console.log(r + 'r');
	let hexR = (+r).toString(16);
	let hexG = (+g).toString(16);
	let hexB = (+b).toString(16);

	if(hexR.length === 1){
		hexR = hexR + '0';
	}		
	if(hexG.length === 1){
		hexG = hexG + '0';
	}
	if(hexB.length === 1){
		hexB= hexB + '0';
	}
	let hex = ('#'+hexR + hexG + hexB).toUpperCase();
	this.hex = hex;
	this.name = nameFinder(hex);
	
}

function nameFinder(hex){
	for(let i=0;i<content.length;i++){
		let line = content[i].split(',');
		let hexCode = line[1].trim();
		if (hexCode === hex){
			name = line[0];
			// console.log('found value');
			return name;
		}
	}
}

//generates random Color from text file
function randomColor(){
	let selectedColor = content[Math.floor(Math.random()*(content.length-1))];
	let line = selectedColor.split(',');
	let hexCode = line[1].trim();
	// console.log(hexCode);
	let red = hexCode.slice(1,3);
	let green = hexCode.slice(3,5);
	let blue = hexCode.slice(5);

	// console.log(red + 'red' + green + 'green' + blue + 'blue');
	red = parseInt(""+red, 16);
	green = parseInt(""+green, 16);
	blue = parseInt(""+blue, 16);
	// console.log(red + 'red' + green + 'green' + blue + 'blue');

	// console.log('random hex is ' + hexCode);
	let randomColor = new color(red, green, blue);
	// console.log(randomColor);
	return randomColor;
}

app.set('view engine', 'hbs');

app.use(bodyParser.urlencoded({extended: false}));

app.get('/', function(req, res){
	res.redirect('/colors');
});

app.get('/about', function(req, res){
	res.render('about.hbs');
});

app.get('/colors', function(req, res){
	let generatedColors = [];
	
	const red = req.query.red;
	const blue = req.query.blue;
	const green = req.query.green;
	const total = req.query.total;
	if(red >= 0 && green >=0 && blue >=0 && red <=255  && green <=255 && blue <= 255 && total>0 && total<=10){
		
		let enteredColor = new color(red,green,blue);
		generatedColors.push(enteredColor);
		// console.log(enteredColor);
		// console.log('random color is:' + randomColor().name)

		for(let i = 0; i < total-1; i++){
			generatedColors.push(randomColor());
		// console.log(generatedColors);
		}
		res.render('colors.hbs', {'colors':generatedColors, 'isValid':true});
	} else if(req.query.red === undefined){
		res.render('colors.hbs', {'colors':generatedColors, 'isValid':true});
	} else {
		res.render('colors.hbs', {'colors':generatedColors, 'isValid':false});
	}

	// console.log(generatedColors);
	
});

app.get('/base.css', function(req,res){
  res.sendFile(path.join(__dirname, '/public/css','base.css'));
  // console.log(path.join(__dirname, '/public/css','base.css'));
});

app.listen(3000);
console.log('Started server on port 3000');