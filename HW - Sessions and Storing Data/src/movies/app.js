// app.js
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
require('./db.js');

const app = express();

const sessionOptions = {
	secret: 'secret for signing session id',
	saveUninitialized: false,
	resave: false
};

const mongoose = require('mongoose');
const Movie = mongoose.model('Movie');

app.set('view engine', 'hbs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session(sessionOptions));

app.get('/movies/', function(req, res) {
	if(req.query.director){
		Movie.find({director: req.query.director}, function(err, movies){
			res.render('movies.hbs', {'movies':movies});
		});
	} else {
		Movie.find(function(err, movies){
			res.render('movies.hbs', {'movies':movies});
		});
	}

});

app.get('/movies/add/', function(req, res) {
	res.render('add.hbs');
});

app.post('/movies/', function(req, res){
	new Movie({
		title: req.body.title,
		director: req.body.director,
		year: parseInt(req.body.year)
	}).save(function(err,movies){
		if(req.session.movieList){
			req.session.movieList.push(movies);
		}else{
			req.session.movieList = [movies];
		}
		res.redirect('/movies/');
	});
});

app.get('/mymovies', function(req, res) {
	const movies = req.session.movieList;
	res.render('movies.hbs', {'movies':movies});
});

app.listen(3000);
console.log('Started server on port 3000');
