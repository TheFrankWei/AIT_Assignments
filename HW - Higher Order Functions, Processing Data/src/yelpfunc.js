// yelpfunc.js
const rev = {

	processYelpData: function(resturaunts){
		let report;
		let resturauntCount = resturaunts.length;
		resturaunts.pop();
		
		/*the average stars of all of the businesses
		the names of all of the pizza places in Las Vegas
		the two Mexican restaurants with the most reviews
		the most common name in the data set
		the number of restaurants per state*/


		//average stars of all businesses
		
		
		let total = resturaunts.reduce(function(result, current){
		
			return Number(result) + Number(current.stars);
		}, 0);
		
		let avg = (total/(resturaunts.length));

		//------
		let lasVegas = resturaunts.filter(function(element){
			return (element.state === 'NV' && element.city === 'Las Vegas' && element.categories.includes('Pizza'));
		});
		//write forloop to print state and rating
		//------
		let mexicanResturaunts = resturaunts.filter(function(element){
			return element.hasOwnProperty('categories')});
		mexicanResturaunts = mexicanResturaunts.filter(function(element){

			return (element.categories.includes('Mexican'));
		});

		mexicanResturaunts.sort(function(a,b){
			let reviewsA = a.review_count;
			let reviewsB = b.review_count;
			if (reviewsA < reviewsB){
				return -1;
			}
			if (reviewsA > reviewsB){
				return 1;
			}
				return 0;
			});
		//top 2 = last 2 elements
		//-----
		let resturauntsFrequency = [];
		let common = resturaunts.forEach(function(element){
			const index = resturauntsFrequency.findIndex(function(newElement) {
				return newElement.name === element.name; 
			});
			if (index >= 0){
				resturauntsFrequency[index].count ++;
			} else {
				resturauntsFrequency.push({"name": element.name, "count": 1});
			}
		});

		resturauntsFrequency.sort(function(a,b){
			let countA = a.count;
			let countB = b.count;
			if (countA < countB){
				return -1;
			}
			if (countA > countB){
				return 1;
			}
				return 0;
		});


		//------
		let mappedResturaunts = resturaunts.map(function(element){
			return element.state;
		}) ;

		//console.log(mappedResturaunts[0]);

		let map = {};
		for(let i = 0; i < mappedResturaunts.length-1; i++){
			if(map.hasOwnProperty(mappedResturaunts[i])){
				map[mappedResturaunts[i]] += 1;
			} else {
				map[mappedResturaunts[i]] = 1;
			}
		}

		/*map.sort(function(a,b){
			let countA = a.count;
			let countB = b.count;
			if (countA < countB){
				return -1;
			}
			if (countA > countB){
				return 1;
			}
				return 0;
		});*/

		let keys = Object.keys(map);
		
	
		report = '* Average Rating of the dataset: ' + avg + 
		"\n\n All resturaunts in Las Vegas, NV that serve pizza + \n";

		let returnedString = "";
		for(let i =0; i < lasVegas.length; i++){
			returnedString += "* " + lasVegas[i].name + " (* " + lasVegas[i].stars + " stars *)\n";	
		}

		report += returnedString + "\n\n * The two highest reviewed Mexican serving resturaunts are: \n    * " + mexicanResturaunts[mexicanResturaunts.length-1].name + ", "+ mexicanResturaunts[mexicanResturaunts.length-1].state + ", " + mexicanResturaunts[mexicanResturaunts.length-1].review_count +" reviews   (* " + mexicanResturaunts[mexicanResturaunts.length-1].stars + " stars *)\n    * "  
		+ mexicanResturaunts[mexicanResturaunts.length-2].name + ", "+ mexicanResturaunts[mexicanResturaunts.length-2].state + ", " + mexicanResturaunts[mexicanResturaunts.length-2].review_count + " reviews   (* " + mexicanResturaunts[mexicanResturaunts.length-2].stars + " stars *)\n\n" +
		"* The most common name in the dataset:\n    * " + resturauntsFrequency[resturauntsFrequency.length-1].name + " is the most common business and appears " + resturauntsFrequency[resturauntsFrequency.length-1].count + " times in the dataset \n\n" +
		"* Resturaunt count by state ";

		returnedString = "";
		for(let i =0; i < keys.length; i++){
			returnedString += "\n    * " + keys[i] + ": " + map[keys[i]];	
		}

		report += returnedString;

		return report;
	}
}
module.exports = rev;