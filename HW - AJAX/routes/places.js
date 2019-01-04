const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Bring in mongoose model, Place, to represent a restaurant
const Place = mongoose.model('Place');

router.get('/places', (req, res) => {
  const queryLocation = req.query.location;
  const queryCuisine = req.query.cuisine;

	if(req.query.location && req.query.cuisine){
		Place.find({location: queryLocation, cuisine: queryCuisine}, function(err, restaurant){
			if(err){
				console.log('search failed');
			}
			else{
				res.json(restaurant.map(function(element) {
					return({
						'name': element.name,
						'cuisine': element.cuisine,
						'location': element.location
					});
				}));
			}
		});
	}

	else if (req.query.cuisine){
		Place.find({cuisine: queryCuisine}, function(err, restaurant){
			if(err){
				console.log('search failed');
			}
			else{
				res.json(restaurant.map(function(element) {
					return({
						'name': element.name,
						'cuisine': element.cuisine,
						'location': element.location
					});
				}));
			}
		});
	}
  else if(req.query.location){
		Place.find({location: queryLocation}, function(err, restaurant){
			if(err){
				console.log('search failed');
			}
			else{
				res.json(restaurant.map(function(element) {
					return({
						'name': element.name,
						'cuisine': element.cuisine,
						'location': element.location
					});
				}));
			}
		});
	}
	else{
		Place.find({}, function(err, restaurant){
			if(err){
				console.log('search failed');
			}
			else{
				res.json(restaurant.map(function(element) {
					return({
						'name': element.name,
						'cuisine': element.cuisine,
						'location': element.location
					});
				}));
			}
		});
	}
});

router.post('/places/create', (req, res)=>{
	Place.find({name: req.body.name, location: req.body.location, cuisine: req.body.cuisine}, function(err, place){
		if(err){
			console.log('search failed');
		}
		else if(place.length > 0){
			return res.send('No duplicates');
		}
		else{
			new Place({
				name: req.body.name,
				cuisine: req.body.cuisine,
				location: req.body.location
			}).save(function(err, restaurant) {
				if (err) {
					return res.send(500, 'database error');
				}
				res.json({id:restaurant._id});
			});
		}
	});
});

module.exports = router;
