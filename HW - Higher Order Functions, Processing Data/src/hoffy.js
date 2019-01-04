// hoffy.js
const rev = {
	sum: function(num1,num2, ...numn){
		let args = Array.from(arguments);
		if (args.length === 0){
			return 0;
		} else { 
			let total = args.reduce(function(sum, value){
				return sum + value;
			});
			return total;
		}
	},

	repeatCall: function(fn, n, arg){
		if( n != 0){
			fn(arg);
			repeatCall(fn, n-1, arg);
		}
	},

	repeatCallAllArgs: function(fn, n, args1, ...argn){
		if( n != 0){
			fn(args1, ... argn);
			repeatCallAllArgs(fn, n-1, args1,... argn);
		}
	},

	maybe: function(fn){
		function newFn(...args){
			if(args.includes(null)){
				return undefined;
			} else if (args.includes(undefined)){
				return undefined; 
			} else { 
				return fn(...args);
			}
		}
		return newFn;
	},

	constrainDecorator: function(fn,min,max){
		function newFn(...args){
			if(fn(...args) < min){
				return min;
			} else if (fn(...args) > max){
				return max;
			} else {
				return fn(...args);
			}
		}
		return newFn;
	},

	limitCallsDecorator: function(fn,n){
		let counter = 0;
		function newFn(...args){
			if (counter < n){
				counter ++;
				return fn(...args);
			} else {
				return undefined;
			}
		}
		return newFn;
	},

	filterWith: function(fn){
		function filtered(array){
			let result = array.filter(fn);
			return result;
		}
		return filtered;
	
	},

	simpleINIParse: function(s){
		let obj = {};
		let iniParse = s.split('\n');
		iniParse.map (function(str){ 
			//ask about below?????? (replace function)
			str = str.replace('\r','');
			if(str.lastIndexOf('=') >=0){
			let splitArray = str.split('=');
			if (splitArray.length < 2){
				if (str.lastIndexOf(splitArray[0]) > 0){
					obj[''] = splitArray[0]; 
				} else {
					obj[splitArray[0]] = '';
				}
			} else {
			obj[splitArray[0]] = splitArray[1];
			}
			}
		});	
		return obj;
	},

	readFileWith: function(fn){
		const fs = require('fs');
		function newFn(fileName, callback){
			fs.readFile(fileName, 'utf8', function(err,data){
				let content;
				if (err){ 
					content = undefined;
				} else{ 
					content = fn(data);
				}		
				callback(err, content);	
				
			});
		}
		return newFn;
	},
}

module.exports = rev;