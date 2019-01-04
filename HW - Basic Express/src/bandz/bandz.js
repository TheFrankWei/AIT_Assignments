// bandz.js
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');

let bandList = [];
function band(name, genre, location, description){
	this.name = name;
	this.genre = genre;
	this.location = location;
	this.description = description; 
	bandList.push(this);
}

let kanye = new band('Kanye West', 'Hip-Hop', 'Atlanta, GA', 'Yeezy Yeezy');
let cheatCodes = new band('Cheat Codes', 'Electronic', 'Los Angeles, CA', 'No Promises');
let lauv = new band('Lauv', 'Pop', 'San Francisco, CA', 'He graduated from NYU!');

app.set('view engine', 'hbs');

app.use(bodyParser.urlencoded({extended: false}));

app.get('/', function(req, res){
	const filterGenre = req.query.filterGenre;
	console.log(filterGenre);
	let filteredBands = bandList.filter(function(filtered){
			return (filtered.genre === filterGenre);
	});

	if(filterGenre != undefined){
		res.render('home.hbs', {'bands':filteredBands});
	} else { 
		res.render('home.hbs', {'bands':bandList});
	}
});

app.post('/', function(req, res){
	const genre = req.body.genre;
	const location = req.body.location;
	const description = req.body.description;
	const name = req.body.name;

	let newBand = new band(name,genre,location,description);
	console.log(newBand);
	res.redirect('/');
});

app.get('/base.css', function(req,res){
  res.sendFile(path.join(__dirname, '/public/css','base.css'));
  // console.log(path.join(__dirname, '/public/css','base.css'));
});

app.listen(3000);
console.log('Started server on port 3000');