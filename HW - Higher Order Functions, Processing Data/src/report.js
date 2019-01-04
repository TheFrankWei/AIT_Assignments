// report.js
const yelpfunc = require('./yelpfunc.js');
const fs = require('fs');
const request = require('request');
let nextFile = 'https://foureyes.github.io/csci-ua.0480-fall2017-003/homework/02/086e27c89913c5c2dde62b6cdd5a27d2.json';

function readStuff(nextFile){
	// console.log(nextFile);
	// console.log(typeof nextFile + 'AAAAAAAAAAAAAAA');
	request(nextFile, function(error,response,body){
	let content;
	
	body.trim();
	if (error){ 
		content = undefined;
	} else{ 
		content = body.trim();
	}		
	content = body.split('\n');

/*fs.readFile('../business.json', 'utf8', function(err,data) {
	let content;
	if (err){ 
		content = undefined;
	} else{ 
		content = data.trim();
	}		
	//console.log(err);
	content = data.split('\n');
	*/

	const jsonParsed = content.reduce((i, j) => {
      if (typeof(i) === 'string') {
        i = [JSON.parse(i)];
      }
      if (j){
        i.push(JSON.parse(j));
      }
      return i;
    });

	console.log('========== \n url:' + nextFile +'\n ==========')

	console.log(yelpfunc.processYelpData(jsonParsed));

	let lastLine = JSON.parse(content[content.length-2]);


	//console.log(lastLine.nextFile);
	if(lastLine.nextFile != undefined){
	nextFile = 'https://foureyes.github.io/csci-ua.0480-fall2017-003/homework/02/'+lastLine.nextFile;
	console.log(nextFile);
		readStuff(nextFile);
	} 
	
	});
	}

	return readStuff(nextFile);
